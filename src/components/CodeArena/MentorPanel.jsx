import React, { useState } from "react";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";

/**
 * AI Mentor preview panel.
 * UI architecture for future AI assistance — no real AI yet.
 */
export default function MentorPanel({ challenge }) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);

  function handleAsk() {
    if (!question.trim()) return;

    // Local placeholder response system — NOT real AI.
    // Clearly labeled as preview.
    const lower = question.toLowerCase();
    let reply;

    if (lower.includes("hint") || lower.includes("help")) {
      reply = `Here's a hint for "${challenge.title}": ${challenge.hints[0]}`;
    } else if (lower.includes("variable") || lower.includes("create")) {
      reply = "Think about what values you need to store, then use let to create each variable.";
    } else if (lower.includes("function")) {
      reply = "Start with the function keyword, give it a name, and think about what it should return.";
    } else if (lower.includes("loop")) {
      reply = "A for loop needs three parts: a start, a condition, and an update. Try counting from 0.";
    } else {
      reply = "Try breaking the problem into smaller steps. What's the first thing your code needs to do?";
    }

    setResponse(reply);
  }

  return (
    <div className="mentor-panel">
      <div className="mentor-header">
        <div className="mentor-title">
          <span className="mentor-icon" aria-hidden="true">🤖</span>
          <div>
            <strong>CodeQuest Mentor</strong>
            <Badge tone="warning">MENTOR PREVIEW</Badge>
          </div>
        </div>
        <span className="mentor-note">AI assistance coming soon.</span>
      </div>

      <p className="mentor-intro">
        I'm here to help you think through the problem — not give you the answer.
      </p>

      <label className="mentor-label" htmlFor="mentor-question">
        What are you stuck on?
      </label>
      <textarea
        id="mentor-question"
        className="mentor-input"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Describe your problem..."
        rows={3}
      />

      <Button variant="secondary" onClick={handleAsk} disabled={!question.trim()}>
        Ask Mentor
      </Button>

      {response && (
        <div className="mentor-response" role="status">
          <span className="mentor-response-label">Mentor says:</span>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}