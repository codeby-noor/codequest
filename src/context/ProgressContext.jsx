import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  getProgress,
  saveProgress,
  addXP,
  completeLesson,
  completeChallenge,
  completeProject,
  updateProjectProgress,
  updateProjectSteps,
  unlockLesson,
  addSkillProgress,
  updateStreak,
  applyWorldUnlocks,
  isWorldUnlocked,
} from "../engine/progressEngine";
import { getLevelInfo } from "../engine/levelEngine";
import { getNextLessonId } from "../data/lessonsIndex";
import { reconcileAchievements } from "../data/achievements";
import {
  initializePlayerAndSync,
  formatCloudPayload,
  getPlayerId,
} from "../services/cloudSync";
import { updatePlayerProgress } from "../services/apiClient";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => reconcileAchievements(getProgress()).progress);
  const [lastReward, setLastReward] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [playerId, setPlayerId] = useState(() => getPlayerId());
  const [syncStatus, setSyncStatus] = useState("idle"); // "idle" | "synced" | "offline"

  // 1. Initial Cloud Sync on Mount
  useEffect(() => {
    let isMounted = true;

    initializePlayerAndSync(progress)
      .then((res) => {
        if (!isMounted) return;
        if (res.playerId) {
          setPlayerId(res.playerId);
        }
        setSyncStatus(res.syncStatus || "offline");

        if (res.mergedProgress) {
          setProgress((prev) => {
            const before = JSON.stringify(prev);
            const after = JSON.stringify(res.mergedProgress);
            if (before !== after) {
              return reconcileAchievements(res.mergedProgress).progress;
            }
            return prev;
          });
        }
      })
      .catch(() => {
        if (isMounted) setSyncStatus("offline");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Persist to localStorage immediately and sync to cloud (debounced)
  useEffect(() => {
    saveProgress(progress);

    if (!playerId) {
      // If no player ID yet (e.g. app launched offline), attempt background registration if online
      const timer = setTimeout(() => {
        initializePlayerAndSync(progress)
          .then((res) => {
            if (res.playerId) {
              setPlayerId(res.playerId);
            }
            if (res.syncStatus === "synced") {
              setSyncStatus("synced");
            }
          })
          .catch(() => {
            setSyncStatus("offline");
          });
      }, 800);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setSyncStatus("syncing");
      updatePlayerProgress(playerId, formatCloudPayload(progress))
        .then((res) => {
          if (res.success) {
            setSyncStatus("synced");
          } else if (res.status === 404) {
            // Stale player ID detected: re-initialize safely without losing local progress
            clearPlayerId();
            setPlayerId(null);
            initializePlayerAndSync(progress).then((r) => {
              if (r.playerId) setPlayerId(r.playerId);
              setSyncStatus(r.syncStatus || "offline");
            });
          } else {
            setSyncStatus("offline");
          }
        })
        .catch(() => {
          setSyncStatus("offline");
        });
    }, 600);

    return () => clearTimeout(timer);
  }, [progress, playerId]);

  // 3. Online event listener for instantaneous recovery when network returns
  useEffect(() => {
    const handleOnline = () => {
      const currentId = getPlayerId();
      if (!currentId) {
        initializePlayerAndSync(progress)
          .then((res) => {
            if (res.playerId) setPlayerId(res.playerId);
            setSyncStatus(res.syncStatus || "offline");
          })
          .catch(() => setSyncStatus("offline"));
      } else {
        updatePlayerProgress(currentId, formatCloudPayload(progress))
          .then((res) => {
            if (res.success) {
              setSyncStatus("synced");
            } else if (res.status === 404) {
              clearPlayerId();
              setPlayerId(null);
              initializePlayerAndSync(progress).then((r) => {
                if (r.playerId) setPlayerId(r.playerId);
                setSyncStatus(r.syncStatus || "offline");
              });
            } else {
              setSyncStatus("offline");
            }
          })
          .catch(() => setSyncStatus("offline"));
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
      }
    };
  }, [progress]);

  useEffect(() => {
    const result = reconcileAchievements(progress);
    if (result.newlyUnlocked.length > 0) {
      setProgress(result.progress);
      const reward = result.newlyUnlocked.reduce((total, achievement) => total + achievement.xp, 0);
      setLastReward({ amount: reward, reason: `${result.newlyUnlocked.length} achievement${result.newlyUnlocked.length > 1 ? "s" : ""} unlocked`, timestamp: Date.now() });
    }
  }, [progress]);

  /** Add XP, detect level-up, and record the reward. */
  const grantXP = useCallback(
    (amount, reason) => {
      setProgress((prev) => {
        const before = getLevelInfo(prev.xp);
        const withXP = addXP(prev, amount);
        const after = getLevelInfo(withXP.xp);

        if (after.level > before.level) {
          setLevelUp({ from: before.level, to: after.level, title: after.title });
        }

        setLastReward({ amount, reason, timestamp: Date.now() });
        return withXP;
      });
    },
    []
  );

  /** Complete a lesson: mark complete, grant XP, unlock next, add skill progress. */
  const completeLessonAndReward = useCallback(
    (lesson) => {
      setProgress((prev) => {
        if ((prev.completedLessons || []).includes(lesson.id)) {
          return prev;
        }
        let next = completeLesson(prev, lesson.id);
        next = completeChallenge(next, lesson.challenge.id);
        next = addSkillProgress(next, lesson.skillId || lesson.skill || "programming", lesson.skillProgress || lesson.skillPercent || 5);
        next = updateStreak(next);

        const nextLessonId = getNextLessonId(lesson.id);
        if (nextLessonId) {
          next = unlockLesson(next, nextLessonId);
        }

        // Apply world unlock logic (e.g. Village complete → unlock Workshop)
        next = applyWorldUnlocks(next);

        const before = getLevelInfo(prev.xp);
        const withXP = addXP(next, lesson.xp);
        const after = getLevelInfo(withXP.xp);

        if (after.level > before.level) {
          setLevelUp({ from: before.level, to: after.level, title: after.title });
        }

        setLastReward({ amount: lesson.xp, reason: lesson.title, timestamp: Date.now() });
        return withXP;
      });
    },
    []
  );

  const completeProjectAndReward = useCallback((project) => {
    setProgress((prev) => {
      if ((prev.completedProjects || []).includes(project.id)) return prev;
      let next = completeProject(prev, project.id);
      (project.skillRewards || []).forEach((reward) => {
        next = addSkillProgress(next, reward.id, reward.percent);
      });
      next = addXP(next, project.xp);
      setLastReward({ amount: project.xp, reason: project.title, timestamp: Date.now() });
      return next;
    });
  }, []);

  const setProjectProgress = useCallback((projectId, percent) => {
    setProgress((prev) => updateProjectProgress(prev, projectId, percent));
  }, []);

  const setProjectSteps = useCallback((projectId, steps) => {
    setProgress((prev) => updateProjectSteps(prev, projectId, steps));
  }, []);

  /** Check if a lesson is unlocked. */
  const isLessonUnlocked = useCallback(
    (lessonId) =>
      (progress.unlockedLessons || []).includes(lessonId) ||
      (progress.completedLessons || []).includes(lessonId),
    [progress.unlockedLessons, progress.completedLessons]
  );

  /** Check if a lesson is completed. */
  const isLessonCompleted = useCallback(
    (lessonId) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  /** Check if a challenge is completed. */
  const isChallengeCompleted = useCallback(
    (challengeId) => progress.completedChallenges.includes(challengeId),
    [progress.completedChallenges]
  );

  /** Check if a world is unlocked. */
  const checkWorldUnlocked = useCallback(
    (worldId) => isWorldUnlocked(worldId, progress),
    [progress]
  );

  /** Dismiss the level-up modal. */
  const dismissLevelUp = useCallback(() => setLevelUp(null), []);

  /** Dismiss the reward toast. */
  const dismissReward = useCallback(() => setLastReward(null), []);

  const value = {
    progress,
    levelInfo: getLevelInfo(progress.xp),
    playerId,
    syncStatus,
    grantXP,
    completeLessonAndReward,
    completeProjectAndReward,
    setProjectProgress,
    setProjectSteps,
    isLessonUnlocked,
    isLessonCompleted,
    isChallengeCompleted,
    isWorldUnlocked: checkWorldUnlocked,
    lastReward,
    dismissReward,
    levelUp,
    dismissLevelUp,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}