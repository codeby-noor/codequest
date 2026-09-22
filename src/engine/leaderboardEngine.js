import { getLevelInfo } from "./levelEngine";

export function createCurrentUser(progress, levelInfo) {
  return {
    id: "current-user",
    name: "You",
    avatar: "Y",
    color: "coral",
    level: levelInfo?.level ?? getLevelInfo(progress.xp || 0).level,
    xp: progress.xp || 0,
    streak: progress.streak || 0,
    completedLessons: (progress.completedLessons || []).length,
    completedProjects: (progress.completedProjects || []).length,
    achievements: (progress.achievements || []).length,
    weeklyXp: progress.xp || 0,
    current: true,
  };
}

function compareUsers(left, right, filter) {
  const primary = filter === "friends" ? "xp" : filter === "weekly" ? "weeklyXp" : filter;
  return (right[primary] - left[primary]) || (right.achievements - left.achievements) || (right.completedProjects - left.completedProjects) || left.name.localeCompare(right.name);
}

export function getLeaderboard(users, currentUser, filter = "global") {
  const source = filter === "friends" ? users.filter((user) => user.friends).concat(currentUser) : users.concat(currentUser);
  const uniqueUsers = source.filter((user, index, all) => all.findIndex((candidate) => candidate.id === user.id) === index);
  const sorted = uniqueUsers.slice().sort((left, right) => compareUsers(left, right, filter));
  return sorted.map((user, index) => ({ ...user, rank: index + 1 }));
}

export function getLeaderboardStats(rankedUsers, currentUserId = "current-user") {
  const current = rankedUsers.find((user) => user.id === currentUserId);
  const next = current ? rankedUsers.find((user) => user.rank === current.rank - 1) : null;
  return { current, next, xpToNext: next ? Math.max(0, next.xp - current.xp) : 0 };
}
