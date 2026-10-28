import { villageLessons } from "./lessons";
import { logicForestLessons } from "./logicForestLessons";
import { webKingdomLessons } from "./webKingdomLessons";
import { apiHarborLessons } from "./apiHarborLessons";
import { backendCitadelLessons } from "./backendCitadelLessons";
import { developerRealmLessons } from "./developerRealmLessons";
import { workshopLessons } from "./workshopLessons";
import { cityLessons } from "./cityLessons";
import { arenaChallenges } from "./arenaChallenges";
import { projects } from "./projects";

const count = (items, completed = []) => items.filter((item) => completed.includes(item.id)).length;
const lessonsCompleted = (progress) => progress.completedLessons || [];
const projectsCompleted = (progress) => progress.completedProjects || [];
const challengesCompleted = (progress) => progress.completedChallenges || [];

export const achievements = [
  { id: "first-steps", title: "First Steps", description: "Complete your first lesson.", icon: "🌱", category: "Learning", rarity: "Common", xp: 25, required: 1, progress: (p) => ({ current: Math.min(lessonsCompleted(p).length, 1), required: 1 }), isComplete: (p) => lessonsCompleted(p).length >= 1, path: "/learn" },
  { id: "village-graduate", title: "Village Graduate", description: "Complete all Village lessons and defeat the Village Master.", icon: "🏘️", category: "Worlds", rarity: "Rare", xp: 100, required: villageLessons.length, progress: (p) => ({ current: count(villageLessons, lessonsCompleted(p)), required: villageLessons.length }), isComplete: (p) => count(villageLessons, lessonsCompleted(p)) === villageLessons.length, path: "/learn/village" },
  { id: "forest-conqueror", title: "Forest Conqueror", description: "Complete all Logic Forest missions and defeat the Forest Guardian.", icon: "🌲", category: "Worlds", rarity: "Rare", xp: 150, required: logicForestLessons.length, progress: (p) => ({ current: count(logicForestLessons, lessonsCompleted(p)), required: logicForestLessons.length }), isComplete: (p) => count(logicForestLessons, lessonsCompleted(p)) === logicForestLessons.length, path: "/learn/logic-forest" },
  { id: "web-sovereign", title: "Web Sovereign", description: "Complete all Web Kingdom missions and defeat the Web Kingdom Guardian.", icon: "🏰", category: "Worlds", rarity: "Rare", xp: 175, required: webKingdomLessons.length, progress: (p) => ({ current: count(webKingdomLessons, lessonsCompleted(p)), required: webKingdomLessons.length }), isComplete: (p) => count(webKingdomLessons, lessonsCompleted(p)) === webKingdomLessons.length, path: "/learn/web-kingdom" },
  { id: "harbor-captain", title: "Harbor Captain", description: "Complete all API Harbor missions and defeat the API Harbor Guardian.", icon: "⚓", category: "Worlds", rarity: "Rare", xp: 200, required: apiHarborLessons.length, progress: (p) => ({ current: count(apiHarborLessons, lessonsCompleted(p)), required: apiHarborLessons.length }), isComplete: (p) => count(apiHarborLessons, lessonsCompleted(p)) === apiHarborLessons.length, path: "/learn/api-harbor" },
  { id: "citadel-warden", title: "Citadel Warden", description: "Complete all Backend Citadel missions and defeat the Citadel Guardian.", icon: "🛡️", category: "Worlds", rarity: "Rare", xp: 225, required: backendCitadelLessons.length, progress: (p) => ({ current: count(backendCitadelLessons, lessonsCompleted(p)), required: backendCitadelLessons.length }), isComplete: (p) => count(backendCitadelLessons, lessonsCompleted(p)) === backendCitadelLessons.length, path: "/learn/backend-citadel" },
  { id: "codequest-grandmaster", title: "Grandmaster Developer", description: "Complete all Developer Realm missions, defeat the Developer Guardian, and graduate as a CodeQuest Developer.", icon: "👑", category: "Worlds", rarity: "Legendary", xp: 300, required: developerRealmLessons.length, progress: (p) => ({ current: count(developerRealmLessons, lessonsCompleted(p)), required: developerRealmLessons.length }), isComplete: (p) => count(developerRealmLessons, lessonsCompleted(p)) === developerRealmLessons.length, path: "/learn/developer-realm" },
  { id: "workshop-graduate", title: "Workshop Graduate", description: "Complete all Workshop lessons.", icon: "🛠️", category: "Worlds", rarity: "Rare", xp: 100, required: workshopLessons.length, progress: (p) => ({ current: count(workshopLessons, lessonsCompleted(p)), required: workshopLessons.length }), isComplete: (p) => count(workshopLessons, lessonsCompleted(p)) === workshopLessons.length, path: "/learn/workshop" },
  { id: "city-explorer", title: "City Explorer", description: "Complete your first City lesson.", icon: "🏙️", category: "Worlds", rarity: "Common", xp: 50, required: 1, progress: (p) => ({ current: Math.min(count(cityLessons, lessonsCompleted(p)), 1), required: 1 }), isComplete: (p) => count(cityLessons, lessonsCompleted(p)) >= 1, path: "/learn/city" },
  { id: "arena-rookie", title: "Code Arena Rookie", description: "Complete your first Code Arena challenge.", icon: "⚔️", category: "Arena", rarity: "Common", xp: 40, required: 1, progress: (p) => ({ current: Math.min(challengesCompleted(p).length, 1), required: 1 }), isComplete: (p) => challengesCompleted(p).length >= 1, path: "/code-arena" },
  { id: "arena-master", title: "Arena Master", description: "Complete every available Arena challenge.", icon: "🏆", category: "Arena", rarity: "Epic", xp: 200, required: arenaChallenges.length, progress: (p) => ({ current: count(arenaChallenges, challengesCompleted(p)), required: arenaChallenges.length }), isComplete: (p) => count(arenaChallenges, challengesCompleted(p)) === arenaChallenges.length, path: "/code-arena" },
  { id: "project-builder", title: "Project Builder", description: "Complete your first project.", icon: "🔨", category: "Projects", rarity: "Common", xp: 75, required: 1, progress: (p) => ({ current: Math.min(projectsCompleted(p).length, 1), required: 1 }), isComplete: (p) => projectsCompleted(p).length >= 1, path: "/projects" },
  { id: "portfolio-complete", title: "Portfolio Complete", description: "Complete Personal Portfolio.", icon: "💼", category: "Projects", rarity: "Rare", xp: 100, required: 1, progress: (p) => ({ current: projectsCompleted(p).includes("personal-portfolio") ? 1 : 0, required: 1 }), isComplete: (p) => projectsCompleted(p).includes("personal-portfolio"), path: "/projects/personal-portfolio" },
  { id: "full-journey", title: "Full Stack Journey", description: "Complete all four projects.", icon: "🚀", category: "Projects", rarity: "Legendary", xp: 300, required: projects.length, progress: (p) => ({ current: count(projects, projectsCompleted(p)), required: projects.length }), isComplete: (p) => count(projects, projectsCompleted(p)) === projects.length, path: "/projects" },
  { id: "xp-hunter", title: "XP Hunter", description: "Reach 500 XP.", icon: "⚡", category: "Milestones", rarity: "Common", xp: 25, required: 500, progress: (p) => ({ current: Math.min(p.xp || 0, 500), required: 500 }), isComplete: (p) => (p.xp || 0) >= 500 },
  { id: "xp-master", title: "XP Master", description: "Reach 1000 XP.", icon: "✨", category: "Milestones", rarity: "Rare", xp: 75, required: 1000, progress: (p) => ({ current: Math.min(p.xp || 0, 1000), required: 1000 }), isComplete: (p) => (p.xp || 0) >= 1000 },
  { id: "skill-builder", title: "Skill Builder", description: "Reach 25% in three skills.", icon: "🧩", category: "Skills", rarity: "Rare", xp: 75, required: 3, progress: (p) => ({ current: Object.values(p.skillProgress || {}).filter((value) => value >= 25).length, required: 3 }), isComplete: (p) => Object.values(p.skillProgress || {}).filter((value) => value >= 25).length >= 3, path: "/skill-tree" },
  { id: "first-challenge", title: "First Challenge", description: "Complete your first verified challenge in the Code Arena.", icon: "🌱", category: "Arena", rarity: "Common", xp: 50, required: 1, progress: (p) => ({ current: Math.min(challengesCompleted(p).length, 1), required: 1 }), isComplete: (p) => challengesCompleted(p).length >= 1, path: "/challenges" },
  { id: "five-challenges", title: "Five Challenges Completed", description: "Solve five coding challenges across any world.", icon: "⚡", category: "Arena", rarity: "Common", xp: 100, required: 5, progress: (p) => ({ current: Math.min(challengesCompleted(p).length, 5), required: 5 }), isComplete: (p) => challengesCompleted(p).length >= 5, path: "/challenges" },
  { id: "ten-challenges", title: "Ten Challenges Completed", description: "Solve ten coding challenges to demonstrate growing mastery.", icon: "🔥", category: "Arena", rarity: "Rare", xp: 200, required: 10, progress: (p) => ({ current: Math.min(challengesCompleted(p).length, 10), required: 10 }), isComplete: (p) => challengesCompleted(p).length >= 10, path: "/challenges" },
  { id: "first-boss", title: "First Difficult Challenge", description: "Conquer a Boss-level challenge to prove your advanced capabilities.", icon: "⚔️", category: "Milestones", rarity: "Rare", xp: 150, required: 1, progress: (p) => ({ current: challengesCompleted(p).some((id) => id.includes("boss") || id === "lesson-18-challenge" || id === "forest-15-challenge" || id === "web-16-challenge" || id === "harbor-16-challenge" || id === "citadel-16-challenge" || id === "realm-16-challenge") ? 1 : 0, required: 1 }), isComplete: (p) => challengesCompleted(p).some((id) => id.includes("boss") || id === "lesson-18-challenge" || id === "forest-15-challenge" || id === "web-16-challenge" || id === "harbor-16-challenge" || id === "citadel-16-challenge" || id === "realm-16-challenge"), path: "/challenges" },
  { id: "learning-milestone", title: "Learning Milestone", description: "Reach Level 3 and accumulate over 2,500 verified XP.", icon: "✨", category: "Milestones", rarity: "Rare", xp: 100, required: 2500, progress: (p) => ({ current: Math.min(p.xp || 0, 2500), required: 2500 }), isComplete: (p) => (p.xp || 0) >= 2500, path: "/profile" },
  { id: "streak-starter", title: "Streak Starter", description: "Maintain a 3-day streak.", icon: "🔥", category: "Consistency", rarity: "Common", xp: 40, required: 3, progress: (p) => ({ current: Math.min(p.streak || 0, 3), required: 3 }), isComplete: (p) => (p.streak || 0) >= 3 },
  { id: "streak-master", title: "Seven-Day Streak", description: "Maintain a 7-day streak.", icon: "🌟", category: "Consistency", rarity: "Epic", xp: 150, required: 7, progress: (p) => ({ current: Math.min(p.streak || 0, 7), required: 7 }), isComplete: (p) => (p.streak || 0) >= 7 },
  { id: "world-explorer", title: "World Explorer", description: "Complete lessons in all three learning worlds.", icon: "🗺️", category: "Worlds", rarity: "Epic", xp: 150, required: 3, progress: (p) => ({ current: [villageLessons, workshopLessons, cityLessons].filter((world) => count(world, lessonsCompleted(p)) > 0).length, required: 3 }), isComplete: (p) => [villageLessons, workshopLessons, cityLessons].every((world) => count(world, lessonsCompleted(p)) > 0), path: "/worlds" },
];

export function getAchievementById(id) {
  return achievements.find((achievement) => achievement.id === id);
}

export function getAchievementState(achievement, progress) {
  const progressValue = achievement.progress ? achievement.progress(progress) : { current: 0, required: 1 };
  const unlocked = (progress.achievements || []).includes(achievement.id) || achievement.isComplete(progress);
  return { ...achievement, unlocked, progress: progressValue };
}

export function reconcileAchievements(progress) {
  let next = progress;
  const newlyUnlocked = [];
  achievements.forEach((achievement) => {
    if (achievement.isComplete(next) && !(next.achievements || []).includes(achievement.id)) {
      next = {
        ...next,
        achievements: [...(next.achievements || []), achievement.id],
        achievementMeta: { ...(next.achievementMeta || {}), [achievement.id]: { unlockedAt: new Date().toISOString() } },
        xp: next.xp + achievement.xp,
      };
      newlyUnlocked.push(achievement);
    }
  });
  return { progress: next, newlyUnlocked };
}
