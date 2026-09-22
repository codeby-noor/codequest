import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import { mentorSuggestions } from "../../data/mentor";
import { getMentorResponse, getNextQuest } from "../../engine/mentorEngine";
import { getCurrentLessonForWorld } from "../../data/lessonsIndex";
import { arenaChallenges } from "../../data/arenaChallenges";
import { useProgress } from "../../context/ProgressContext";

const worlds = ["village", "workshop", "city"];
const worldNames = { village: "The Village", workshop: "The Workshop", city: "The City" };

export default function Mentor() {
  const { progress, levelInfo } = useProgress();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ role: "mentor", text: "Hi, Coder! I can help you understand concepts, debug problems, choose your next quest, and explain mistakes." }]);
  const context = { progress, levelInfo };
  const nextQuest = getNextQuest(context);
  const currentWorld = worlds.find((world) => getCurrentLessonForWorld(world, progress));
  const currentLesson = currentWorld ? getCurrentLessonForWorld(currentWorld, progress) : null;

  function ask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((items) => [...items, { role: "user", text: trimmed }, { role: "mentor", text: getMentorResponse(trimmed, context) }]);
    setMessage("");
  }

  return <div className="container mentor-page">
    <PageHeader eyebrow="CodeQuest Mentor" title="Learn faster with guidance" description="Learn faster with guidance when you get stuck." />
    <div className="mentor-layout">
      <main>
        <div className="mentor-hero card card-elevated"><span className="mentor-hero-icon" aria-hidden="true">👋</span><div><h2>Hi, Coder!</h2><p>Your guided learning companion. I offer local, rule-based guidance from your CodeQuest progress and learning content.</p></div></div>
        <section className="mentor-chat card card-elevated"><div className="mentor-chat-header"><div><span className="section-eyebrow">Conversation</span><h2>Ask your mentor</h2></div><Badge tone="warning">Local guidance</Badge></div><div className="mentor-messages" aria-live="polite">{messages.map((item, index) => <div key={`${item.role}-${index}`} className={`mentor-message ${item.role}`}><span className="mentor-message-label">{item.role === "mentor" ? "Mentor" : "You"}</span><p>{item.text}</p></div>)}</div><form className="mentor-form" onSubmit={(event) => { event.preventDefault(); ask(message); }}><label className="sr-only" htmlFor="mentor-message">Ask CodeQuest Mentor</label><input id="mentor-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What are you working on?" /><Button type="submit" disabled={!message.trim()}>Ask Mentor</Button></form></section>
        <section className="mentor-suggestions"><span className="section-eyebrow">Quick Questions</span><div>{mentorSuggestions.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div></section>
      </main>
      <aside className="mentor-sidebar"><div className="mentor-journey card card-elevated"><span className="section-eyebrow">Your Journey</span><h2>Level {String(levelInfo.level).padStart(2, "0")}</h2><strong>⚡ {(progress.xp || 0).toLocaleString()} XP</strong><p className="mentor-current-label">Current</p><h3>{currentWorld ? worldNames[currentWorld] : "All worlds complete"}</h3>{currentLesson && <p>{currentLesson.title}</p>}<p>🔥 {progress.streak || 0} Day Streak</p><p>{(progress.completedLessons || []).length} lessons · {(progress.completedProjects || []).length} projects</p><p>{(progress.completedChallenges || []).length} / {arenaChallenges.length} challenges</p><p>{(progress.achievements || []).length} achievements</p><p className="mentor-current-label">Next milestone</p><p>{levelInfo.needed - levelInfo.current} XP to the next level</p></div><div className="mentor-next card card-elevated"><span className="section-eyebrow">Next Quest</span><h2>Based on your progress</h2><p>{nextQuest.label}</p><Link className="btn btn-primary" to={nextQuest.to}>Continue Learning →</Link></div></aside>
    </div>
  </div>;
}