import React from "react";
import { motion } from "framer-motion";
import Button from "../Button/Button";
import { arenaChallenges } from "../../data/arenaChallenges";

/**
 * Visual preview of the future coding environment.
 * Static preview only — no code execution in Step 1.
 */
export default function CodeArenaPreview() {
  return (
    <motion.div
      className="code-arena"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      aria-label="Preview of the CodeQuest coding environment"
    >
      <div className="code-arena-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <div className="code-arena-tabs">
          <span className="code-arena-tab active">mission.js</span>
          <span className="code-arena-tab">preview</span>
        </div>
      </div>

      <div className="code-arena-body">
        <div className="code-arena-pane">
          <span className="code-arena-pane-label">Mission</span>
          <p style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>
            Build a button
          </p>
          <span className="code-arena-pane-label">Code</span>
          <div className="code-arena-code">
            <div>
              <span className="keyword">const</span>{" "}
              <span className="variable">button</span>{" "}
              <span className="punctuation">=</span>{" "}
              <span className="punctuation">{"{"}</span>
            </div>
            <div style={{ paddingLeft: "1.5rem" }}>
              <span className="variable">label</span>
              <span className="punctuation">:</span>{" "}
              <span className="string">"Click Me"</span>
              <span className="punctuation">,</span>
            </div>
            <div style={{ paddingLeft: "1.5rem" }}>
              <span className="variable">onClick</span>
              <span className="punctuation">:</span>{" "}
              <span className="punctuation">()</span>{" "}
              <span className="punctuation">{"=>"}</span>{" "}
              <span className="punctuation">{"{"}</span>
            </div>
            <div style={{ paddingLeft: "3rem" }}>
              <span className="variable">console</span>
              <span className="punctuation">.</span>
              <span className="variable">log</span>
              <span className="punctuation">(</span>
              <span className="string">"clicked!"</span>
              <span className="punctuation">)</span>
            </div>
            <div style={{ paddingLeft: "1.5rem" }}>
              <span className="punctuation">{"}"}</span>
              <span className="punctuation">,</span>
            </div>
            <div>
              <span className="punctuation">{"}"}</span>
              <span className="punctuation">;</span>
            </div>
          </div>
        </div>

        <div className="code-arena-preview">
          <div className="code-arena-pane">
            <span className="code-arena-pane-label">Live Preview</span>
          </div>
          <div className="code-arena-preview-content">
            <button className="preview-button" type="button" tabIndex={-1} aria-hidden="true">
              CLICK ME
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
        <Button to={`/code-arena/${arenaChallenges[0].id}`} variant="ghost" size="sm">
          Enter the Arena →
        </Button>
      </div>
    </motion.div>
  );
}