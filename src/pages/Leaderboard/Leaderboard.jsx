import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../../components/Badge/Badge";
import PageHeader from "../../components/PageHeader/PageHeader";
import { demoLeaderboardUsers } from "../../data/leaderboard";
import { getLeaderboard, getLeaderboardStats, createCurrentUser } from "../../engine/leaderboardEngine";
import { useProgress } from "../../context/ProgressContext";

export default function Leaderboard() {
  const [filter, setFilter] = useState("global");
  const { progress, levelInfo } = useProgress();
  const currentUser = createCurrentUser(progress, levelInfo);
  const rankedUsers = getLeaderboard(demoLeaderboardUsers, currentUser, filter);
  const { current, next, xpToNext } = getLeaderboardStats(rankedUsers);

  return <div className="container leaderboard-page">
    <PageHeader eyebrow="Leaderboard" title="Climb the Ranks" description="See how you're progressing alongside other CodeQuest learners." />
    <div className="leaderboard-demo-label">Local Demo Rankings <span>Fictional learners for comparison</span></div>
    <div className="leaderboard-filters" role="group" aria-label="Leaderboard view"><FilterButton active={filter === "global"} onClick={() => setFilter("global")}>GLOBAL</FilterButton><FilterButton active={filter === "weekly"} onClick={() => setFilter("weekly")}>WEEKLY</FilterButton><FilterButton active={filter === "friends"} onClick={() => setFilter("friends")}>FRIENDS</FilterButton></div>
    <div className="leaderboard-stats"><Stat label="Your Rank" value={`#${current.rank}`} /><Stat label="Total XP" value={`${current.xp.toLocaleString()} XP`} /><Stat label="Current Level" value={`Level ${String(current.level).padStart(2, "0")}`} /><Stat label="Day Streak" value={`🔥 ${current.streak}`} /></div>
    <Podium users={rankedUsers.slice(0, 3)} />
    <section className="leaderboard-list-section"><div className="section-header"><div><span className="section-eyebrow">Standings</span><h2>CodeQuest Learners</h2></div></div><div className="leaderboard-list"><div className="leaderboard-list-head"><span>Rank</span><span>Player</span><span>Level</span><span>XP</span><span>Streak</span><span>Achievements</span></div>{rankedUsers.map((user) => <LeaderboardRow key={user.id} user={user} />)}</div></section>
    <aside className="leaderboard-position"><span className="section-eyebrow">Your Position</span><div className="leaderboard-position-main"><strong>#{current.rank}</strong><div><h2>You</h2><span>Level {String(current.level).padStart(2, "0")} · {current.xp.toLocaleString()} XP</span></div></div><p>{next ? `You're ${xpToNext.toLocaleString()} XP away from the next rank.` : "You're currently at the top!"}</p></aside>
  </div>;
}

function FilterButton({ active, onClick, children }) { return <button className={`leaderboard-filter ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active}>{children}</button>; }
function Stat({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function Avatar({ user }) { return <span className={`leaderboard-avatar ${user.color}`} aria-hidden="true">{user.avatar}</span>; }

function Podium({ users }) {
  const order = [users[1], users[0], users[2]].filter(Boolean);
  return <section className="leaderboard-podium" aria-label="Top three learners">{order.map((user) => <motion.article key={user.id} className={`podium-card rank-${user.rank}`} whileHover={{ y: -4 }}><span className="podium-rank">{user.rank === 1 ? "♛" : `0${user.rank}`}</span><Avatar user={user} /><h2>{user.name}</h2><span>Level {String(user.level).padStart(2, "0")}</span><strong>{user.xp.toLocaleString()} XP</strong></motion.article>)}</section>;
}

function LeaderboardRow({ user }) {
  return <motion.div className={`leaderboard-row ${user.current ? "current-user" : ""}`} whileHover={{ y: -2 }}><strong className="leaderboard-rank">{String(user.rank).padStart(2, "0")}</strong><div className="leaderboard-player"><Avatar user={user} /><span>{user.name}</span>{user.current && <Badge tone="accent">YOU</Badge>}</div><span>Level {String(user.level).padStart(2, "0")}</span><strong>{user.xp.toLocaleString()} XP</strong><span>🔥 {user.streak}</span><span>🏆 {user.achievements}</span></motion.div>;
}