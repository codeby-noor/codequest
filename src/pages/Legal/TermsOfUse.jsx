import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TermsOfUse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container py-5" style={{ maxWidth: "860px", color: "var(--cq-text, #f1f5f9)" }}>
      {/* Header */}
      <div className="mb-5 pb-3 border-bottom border-secondary">
        <nav aria-label="Breadcrumb" className="mb-3">
          <Link to="/" className="text-secondary text-decoration-none">
            ← Back to Quest Base
          </Link>
        </nav>
        <h1 className="h2 fw-bold text-white mb-2">Terms of Use (Draft for Review)</h1>
        <p className="text-muted small mb-0">
          <strong>Effective Date:</strong> [Pending Launch — Effective Date Placeholder, e.g., November 1, 2026] &bull;{" "}
          <strong>Publisher / Owner:</strong> [Owner / Entity Name Placeholder]
        </p>
      </div>

      {/* Notice Banner */}
      <div
        className="alert p-3 mb-4 rounded-3"
        style={{
          background: "rgba(99, 102, 241, 0.12)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          color: "#c7d2fe",
          fontSize: "0.9rem",
        }}
      >
        <strong>Important Notice:</strong> This document is a product terms agreement draft for CodeQuest. It reflects
        the platform&apos;s educational simulation capabilities, user guidelines, and technical boundaries. It must be
        reviewed by legal counsel prior to formal launch.
      </div>

      {/* Section 1: Acceptance of Terms */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">1. Acceptance of Terms</h2>
        <p className="text-secondary leading-relaxed">
          By accessing or using CodeQuest (&quot;the Service&quot;), whether as an anonymous visitor or registered player,
          you agree to be bound by these Terms of Use. If you do not agree to these terms, please discontinue using the
          platform.
        </p>
      </section>

      {/* Section 2: Educational Platform Disclaimer */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">2. Educational-Use Purpose and Disclaimer</h2>
        <p className="text-secondary leading-relaxed">
          CodeQuest is provided strictly for educational, learning, and self-improvement purposes:
        </p>
        <ul className="text-secondary small">
          <li className="mb-2">
            The coding challenges, browser IDE, mentor suggestions, and project simulations are pedagogical exercises.
          </li>
          <li className="mb-2">
            Code entered in the Code Arena runs directly in a client-side sandbox (such as Web Workers and isolated frames).
            While designed to simulate real-world development, it is not an enterprise staging or production execution environment.
          </li>
          <li className="mb-2">
            CodeQuest does not guarantee employment, academic certification, or specific coding outcomes.
          </li>
        </ul>
      </section>

      {/* Section 3: Accounts and Security */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">3. Accounts and Responsibilities</h2>
        <p className="text-secondary leading-relaxed">
          When creating a registered account:
        </p>
        <ul className="text-secondary small">
          <li className="mb-2">You agree to provide accurate information and maintain the security of your password.</li>
          <li className="mb-2">You are responsible for all activities occurring under your account credentials.</li>
          <li className="mb-2">You must notify the administration immediately upon discovering any unauthorized account access.</li>
        </ul>
      </section>

      {/* Section 4: Prohibited Conduct and Platform Abuse */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">4. Prohibited Conduct and Platform Abuse</h2>
        <p className="text-secondary leading-relaxed">
          To maintain a fair, safe, and fun learning environment for all quest players, you agree NOT to:
        </p>
        <ul className="text-secondary small">
          <li className="mb-2">
            Attempt to tamper with, flood, or bypass API rate limiters, authentication tokens, or progress verification mechanisms.
          </li>
          <li className="mb-2">
            Attempt NoSQL injections, SQL injections, Cross-Site Scripting (XSS), or unauthorized access to platform databases or serverless functions.
          </li>
          <li className="mb-2">
            Use automated scripts, bots, or crawlers to unfairly manipulate the global leaderboard, forge XP, or falsify challenge completions.
          </li>
          <li className="mb-2">
            Submit abusive, offensive, defamatory, or spam messages through the feedback portal or user profile fields.
          </li>
          <li className="mb-2">
            Interfere with or disrupt the servers, networks, or cloud infrastructure hosting CodeQuest.
          </li>
        </ul>
      </section>

      {/* Section 5: Intellectual Property */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">5. Intellectual Property Rights</h2>
        <div className="card bg-dark border-secondary p-3 mb-3">
          <h3 className="h6 text-info mb-2">Platform Content</h3>
          <p className="text-secondary small mb-0">
            The CodeQuest curriculum, story quests, graphics, design system, challenge definitions, and source code are
            the intellectual property of Mahenoor Shaikh and CodeQuest contributors, protected by copyright and intellectual
            property laws.
          </p>
        </div>
        <div className="card bg-dark border-secondary p-3">
          <h3 className="h6 text-info mb-2">Your Code Submissions</h3>
          <p className="text-secondary small mb-0">
            You retain ownership of the original code you write while solving challenges on CodeQuest. You grant CodeQuest
            a non-exclusive, royalty-free license to execute and validate your code locally within your browser session to
            provide the learning experience.
          </p>
        </div>
      </section>

      {/* Section 6: Service Modifications & Termination */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">6. Modifications to Service and Termination</h2>
        <p className="text-secondary leading-relaxed">
          We continuously update CodeQuest to improve learning efficacy. We reserve the right to modify, suspend, or
          discontinue any part of the platform at any time. We also reserve the right to suspend or terminate accounts that
          violate acceptable use or engage in cheating or malicious activity.
        </p>
      </section>

      {/* Section 7: Limitation of Liability */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">7. Limitation of Liability</h2>
        <p className="text-secondary small leading-relaxed">
          To the maximum extent permitted by applicable law, CodeQuest and its creator shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, use, or goodwill,
          arising from your access to or use of (or inability to access or use) the platform, even if advised of the possibility
          of such damages.
        </p>
      </section>

      {/* Section 8: Inquiries & Contact */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">8. Contact Information</h2>
        <p className="text-secondary">
          Questions or notices regarding these Terms of Use may be submitted to:
        </p>
        <div className="card bg-dark border-secondary p-3">
          <p className="mb-1 text-light"><strong>Project:</strong> CodeQuest</p>
          <p className="mb-1 text-light"><strong>Owner / Creator:</strong> Mahenoor Shaikh ([Owner / Legal Entity Placeholder])</p>
          <p className="mb-0 text-light"><strong>Email:</strong> [Owner Contact Email Placeholder, e.g., legal@codequest.dev]</p>
        </div>
      </section>
    </div>
  );
}
