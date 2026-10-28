import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import PageHeader from "../../components/PageHeader/PageHeader";
import { demoLeaderboardUsers } from "../../data/leaderboard";
import { getLeaderboard as getLocalLeaderboard, getLeaderboardStats, createCurrentUser } from "../../engine/leaderboardEngine";
import { useProgress } from "../../context/ProgressContext";
import { getLeaderboard as fetchServerLeaderboard } from "../../services/apiClient";

export default function Leaderboard() {
  const [filter, setFilter] = useState("global");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiveServer, setIsLiveServer] = useState(false);
  const [serverUsers, setServerUsers] = useState([]);
  const [serverCurrentUserRank, setServerCurrentUserRank] = useState(null);

  const { progress, levelInfo, playerId } = useProgress();
  const currentUser = createCurrentUser(progress, levelInfo);

  const loadLeaderboardData = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchServerLeaderboard({ limit: 25, page, userId: playerId })
      .then((res) => {
        if (res && res.success && Array.isArray(res.users) && res.users.length > 0) {
          setServerUsers(res.users);
          setTotalPages(res.totalPages || 1);
          setServerCurrentUserRank(res.currentUserRank || null);
          setIsLiveServer(true);
        } else {
          // Fallback to local demo rankings if server returned empty or offline
          setIsLiveServer(false);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load online rankings");
        setIsLiveServer(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, playerId]);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  // If using live server data
  let rankedUsers = [];
  let userStats = null;

  if (isLiveServer && serverUsers.length > 0) {
    rankedUsers = serverUsers.map((u) => {
      const isCurrent = (playerId && String(u.id) === String(playerId)) || u.isCurrent;
      return {
        ...u,
        name: u.username || u.name || "Adventurer",
        current: Boolean(isCurrent),
        achievements: u.achievementsCount ?? (Array.isArray(u.achievements) ? u.achievements.length : 0),
        color: "coral",
      };
    });

    // If current user is not in the page, check serverCurrentUserRank
    const foundCurrent = rankedUsers.find((u) => u.current);
    const currentRank = foundCurrent ? foundCurrent.rank : (serverCurrentUserRank?.rank || 1);
    const currentXp = foundCurrent ? foundCurrent.xp : (serverCurrentUserRank?.xp || progress.xp || 0);
    const nextUser = rankedUsers.find((u) => u.rank === currentRank - 1);

    userStats = {
      current: {
        rank: currentRank,
        xp: currentXp,
        level: levelInfo.level,
        streak: progress.streak || 0,
      },
      next: nextUser || null,
      xpToNext: nextUser ? Math.max(0, nextUser.xp - currentXp) : 0,
    };
  } else {
    // Local demo data
    const localRanked = getLocalLeaderboard(demoLeaderboardUsers, currentUser, filter);
    rankedUsers = localRanked;
    const stats = getLeaderboardStats(localRanked);
    userStats = stats;
  }

  const { current, next, xpToNext } = userStats;

  return (
    <div className="container leaderboard-page" style={{ paddingBottom: "4rem" }}>
      <PageHeader
        eyebrow="Global Rankings"
        title="Climb the Leaderboard"
        description="Compete with fellow learners on the verified XP leaderboard. Complete missions to elevate your standing."
      />

      {/* Online / Offline status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="leaderboard-demo-label">
          {isLiveServer ? "● Verified Live Standings" : "Local Standings"}{" "}
          <span>{isLiveServer ? "Connected to MongoDB Cloud" : "Demonstration rankings for comparison"}</span>
        </div>

        {error && (
          <Button variant="ghost" onClick={loadLeaderboardData}>
            ↻ Retry Connection
          </Button>
        )}
      </div>

      {/* View Filters */}
      <div className="leaderboard-filters" role="group" aria-label="Leaderboard view">
        <FilterButton active={filter === "global"} onClick={() => setFilter("global")}>
          GLOBAL
        </FilterButton>
        <FilterButton active={filter === "weekly"} onClick={() => setFilter("weekly")}>
          WEEKLY
        </FilterButton>
        <FilterButton active={filter === "friends"} onClick={() => setFilter("friends")}>
          FRIENDS
        </FilterButton>
      </div>

      {/* Player Stats Bar */}
      <div className="leaderboard-stats">
        <Stat label="Your Rank" value={`#${current.rank}`} />
        <Stat label="Total XP" value={`${current.xp.toLocaleString()} XP`} />
        <Stat label="Current Level" value={`Level ${String(current.level).padStart(2, "0")}`} />
        <Stat label="Day Streak" value={`🔥 ${current.streak}d`} />
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--cq-text-muted)" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚡ Loading leaderboard rankings...</div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {rankedUsers.length >= 3 && <Podium users={rankedUsers.slice(0, 3)} />}

          {/* Standings List */}
          <section className="leaderboard-list-section">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Standings</span>
                <h2>CodeQuest Learners</h2>
              </div>
            </div>

            <div className="leaderboard-list">
              <div className="leaderboard-list-head">
                <span>Rank</span>
                <span>Player</span>
                <span>Level</span>
                <span>XP</span>
                <span>Streak</span>
                <span>Achievements</span>
              </div>
              {rankedUsers.map((user) => (
                <LeaderboardRow key={user.id || user.rank} user={user} />
              ))}
            </div>

            {/* Pagination controls if multiple pages */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1.5rem" }}>
                <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  ← Previous
                </Button>
                <span style={{ color: "var(--cq-text-muted)", fontSize: "0.9rem" }}>
                  Page {page} of {totalPages}
                </span>
                <Button variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Next →
                </Button>
              </div>
            )}
          </section>

          {/* Player Position Aside */}
          <aside className="leaderboard-position">
            <span className="section-eyebrow">Your Position</span>
            <div className="leaderboard-position-main">
              <strong>#{current.rank}</strong>
              <div>
                <h2>You</h2>
                <span>
                  Level {String(current.level).padStart(2, "0")} · {current.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
            <p>
              {next
                ? `You're ${xpToNext.toLocaleString()} XP away from the next rank (#${current.rank - 1}).`
                : "You're currently leading the ranks! Keep solving to defend your position."}
            </p>
          </aside>
        </>
      )}
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button className={`leaderboard-filter ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Avatar({ user }) {
  const avatarText = user.avatar && user.avatar.length <= 2 ? user.avatar : (user.name ? user.name[0].toUpperCase() : "⚔️");
  return (
    <span className={`leaderboard-avatar ${user.color || "coral"}`} aria-hidden="true">
      {avatarText}
    </span>
  );
}

function Podium({ users }) {
  const order = [users[1], users[0], users[2]].filter(Boolean);
  return (
    <section className="leaderboard-podium" aria-label="Top three learners">
      {order.map((user) => (
        <motion.article
          key={user.id || user.rank}
          className={`podium-card rank-${user.rank}`}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <span className="podium-rank">{user.rank === 1 ? "♛" : `0${user.rank}`}</span>
          <Avatar user={user} />
          <h2>{user.name}</h2>
          <span>Level {String(user.level).padStart(2, "0")}</span>
          <strong>{(user.xp || 0).toLocaleString()} XP</strong>
        </motion.article>
      ))}
    </section>
  );
}

function LeaderboardRow({ user }) {
  return (
    <motion.div
      className={`leaderboard-row ${user.current ? "current-user" : ""}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <strong className="leaderboard-rank">#{String(user.rank).padStart(2, "0")}</strong>
      <div className="leaderboard-player">
        <Avatar user={user} />
        <span>{user.name}</span>
        {user.current && <Badge tone="accent">YOU</Badge>}
      </div>
      <span>Level {String(user.level).padStart(2, "0")}</span>
      <strong>{(user.xp || 0).toLocaleString()} XP</strong>
      <span>🔥 {user.streak || 0}d</span>
      <span>🏆 {user.achievements || 0}</span>
    </motion.div>
  );
}