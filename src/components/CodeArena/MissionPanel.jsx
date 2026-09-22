import React from "react";
import Badge from "../Badge/Badge";

/**
 * Mission briefing panel for the Code Arena.
 * Shows mission info, objective, requirements, and hints.
 */
export default function MissionPanel({ challenge, testResults, hintIndex, onRevealHint }) {
  const { title, difficulty, xp, objective, requirements, hints, estimatedTime } = challenge;

  const passedCount = testResults ? testResults.filter((r) => r.success).length : 0;

  return (
    <div className="arena-mission-panel">
      <div className="arena-panel-header">
        <span className="arena-panel-label">Mission Brief</span>
        <Badge tone={difficulty === "Boss" ? "danger" : "success"}>{difficulty}</Badge>
      </div>

      <h2 className="arena-mission-title">{title}</h2>

      <div className="arena-mission-meta">
        <div className="arena-meta-item">
          <span className="arena-meta-label">Reward</span>
          <span className="arena-meta-value">⚡ +{xp} XP</span>
        </div>
        <div className="arena-meta-item">
          <span className="arena-meta-label">Estimated time</span>
          <span className="arena-meta-value">{estimatedTime} min</span>
        </div>
      </div>

      <div className="arena-section">
        <span className="arena-section-label">Objective</span>
        <p className="arena-objective">{objective}</p>
      </div>

      <div className="arena-section">
        <span className="arena-section-label">Requirements</span>
        <ul className="arena-requirements">
          {requirements.map((req, i) => {
            const passed = testResults && testResults[i]?.success;
            return (
              <li key={i} className={`arena-requirement ${passed ? "passed" : ""}`}>
                <span className="arena-req-icon" aria-hidden="true">
                  {passed ? "✓" : "○"}
                </span>
                {typeof req === "string" ? req : req.label || req.id}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="arena-section">
        <span className="arena-section-label">Need help?</span>
        <div className="arena-hints">
          {hints.slice(0, hintIndex + 1).map((hint, i) => (
            <div key={i} className="arena-hint">
              <span className="arena-hint-label">💡 Hint {i + 1}</span>
              <p>{hint}</p>
            </div>
          ))}
          {hintIndex < hints.length - 1 && (
            <button className="arena-hint-btn" onClick={onRevealHint}>
              Reveal Hint {hintIndex + 2}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}