import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
        <h1 className="h2 fw-bold text-white mb-2">Privacy Policy (Draft for Review)</h1>
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
        <strong>Important Notice:</strong> This document is a technical and product draft describing CodeQuest&apos;s
        actual data collection, storage, and processing practices. It must undergo formal legal review by the platform
        owner before commercial launch or legal compliance claims.
      </div>

      {/* Section 1: Overview */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">1. Overview and Core Philosophy</h2>
        <p className="text-secondary leading-relaxed">
          CodeQuest is designed as an interactive coding education platform. We operate on a privacy-first,
          offline-capable model: you can learn, solve coding challenges, and track your skills completely anonymously
          without creating a registered account. When you choose to create an account, we collect only the minimal data
          required to authenticate you and sync your progress securely.
        </p>
      </section>

      {/* Section 2: Data We Collect */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">2. Information We Collect and Process</h2>
        <p className="text-secondary">Depending on how you use CodeQuest, we process the following categories of data:</p>

        <div className="card bg-dark border-secondary p-3 mb-3">
          <h3 className="h6 text-info mb-2">A. Anonymous Players</h3>
          <p className="text-secondary small mb-2">
            If you explore CodeQuest without registering, an anonymous identifier (e.g., <code>anon_...</code>) is
            generated locally to preserve your quest progression across page reloads.
          </p>
          <ul className="text-secondary small ps-3 mb-0">
            <li>No email address or real name is collected.</li>
            <li>Progress (XP, lessons completed, unlocked worlds) is stored directly in your browser.</li>
          </ul>
        </div>

        <div className="card bg-dark border-secondary p-3 mb-3">
          <h3 className="h6 text-info mb-2">B. Registered Account Information</h3>
          <p className="text-secondary small mb-2">When you register or convert an anonymous account:</p>
          <ul className="text-secondary small ps-3 mb-0">
            <li><strong>Username:</strong> Chosen by you for display on the leaderboard and profile.</li>
            <li><strong>Email Address:</strong> Used strictly for account identification, login, and communication.</li>
            <li><strong>Password:</strong> Never stored in plaintext. Hashed cryptographically using PBKDF2 with 100,000 SHA-512 iterations and a cryptographically random salt.</li>
            <li><strong>Avatar Selection:</strong> A choice from predefined platform avatars.</li>
          </ul>
        </div>

        <div className="card bg-dark border-secondary p-3 mb-3">
          <h3 className="h6 text-info mb-2">C. Gameplay, Learning, and Code Execution Data</h3>
          <p className="text-secondary small mb-2">
            We record learning milestones to calculate your level, streak, and achievements:
          </p>
          <ul className="text-secondary small ps-3 mb-0">
            <li>Lessons and challenges marked as completed.</li>
            <li>Calculated XP, current level, current streak, and longest streak.</li>
            <li>Unlocked achievements and skill tree progress.</li>
            <li><strong>Your Code Submissions:</strong> Evaluated in-browser within an isolated web worker / iframe sandbox. Your solution code is not permanently stored on third-party servers or used for AI training.</li>
          </ul>
        </div>
      </section>

      {/* Section 3: Browser Storage and Cookies */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">3. Local Browser Storage &amp; Cookies</h2>
        <p className="text-secondary">
          CodeQuest does not use invasive cross-site advertising cookies. We use modern browser <code>localStorage</code>{" "}
          strictly for core functionality:
        </p>

        <div className="table-responsive">
          <table className="table table-dark table-bordered table-sm small">
            <thead>
              <tr className="text-light">
                <th>Storage Key</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>codequest-progress-v1</code></td>
                <td>localStorage</td>
                <td>Stores your offline XP, unlocked lessons, streak, and achievements.</td>
                <td>Persistent until cleared</td>
              </tr>
              <tr>
                <td><code>codequest_player_id</code></td>
                <td>localStorage</td>
                <td>Links your browser session to your anonymous cloud progress profile.</td>
                <td>Persistent until cleared</td>
              </tr>
              <tr>
                <td><code>codequest_auth_token</code></td>
                <td>localStorage</td>
                <td>Holds your cryptographically signed HMAC-SHA256 session token when logged in.</td>
                <td>Expires in 30 days</td>
              </tr>
              <tr>
                <td><code>codequest_analytics_consent</code></td>
                <td>localStorage</td>
                <td>Records your preference (granted / denied) for anonymous platform telemetry.</td>
                <td>Persistent until cleared</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Third-Party Infrastructure */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">4. Infrastructure and Third-Party Sub-processors</h2>
        <p className="text-secondary">We rely on reputable infrastructure providers to deliver CodeQuest reliably:</p>
        <ul className="text-secondary small">
          <li className="mb-2">
            <strong>Vercel Inc.:</strong> Application hosting, edge delivery, and serverless execution. Vercel processes
            incoming HTTP requests and serves frontend static assets.
          </li>
          <li className="mb-2">
            <strong>MongoDB Atlas:</strong> Cloud database provider. Registered accounts and synchronized player profiles
            are stored in encrypted clusters with TLS 1.3 in-transit and AES-256 encryption at-rest.
          </li>
          <li className="mb-2">
            <strong>Error Monitoring &amp; Analytics (Configurable):</strong> Privacy-conscious, anonymized telemetry
            used solely to catch broken code links or system crashes. Telemetry never records passwords, tokens, or personal emails.
          </li>
        </ul>
      </section>

      {/* Section 5: Data Retention & User Rights */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">5. Data Retention, Deletion, and User Control</h2>
        <p className="text-secondary leading-relaxed">
          You retain full control over your data:
        </p>
        <ul className="text-secondary small">
          <li className="mb-2">
            <strong>Local Storage Deletion:</strong> You can clear all local progress at any time by clearing your browser
            storage or using your browser developer tools.
          </li>
          <li className="mb-2">
            <strong>Account Deletion &amp; Export:</strong> If you created an account and wish to delete your profile and
            associated cloud progress permanently, contact us at <code>[Owner Contact Email Placeholder]</code>. All
            database records associated with your account ID will be purged.
          </li>
          <li className="mb-2">
            <strong>Opting Out of Telemetry:</strong> You can toggle your analytics preference in your profile or by clearing
            the consent flag.
          </li>
        </ul>
      </section>

      {/* Section 6: Security Safeguards */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">6. Security Safeguards &amp; Limitations</h2>
        <p className="text-secondary leading-relaxed">
          We implement technical safeguards including rate-limiting against credential attacks, NoSQL injection
          sanitization, HTTP security headers, and strict CORS policies. However, no internet transmission or electronic
          storage method is 100% impenetrable. We encourage users to use unique, robust passwords.
        </p>
      </section>

      {/* Section 7: Contact & Inquiries */}
      <section className="mb-5">
        <h2 className="h4 text-white mb-3">7. Contact and Inquiries</h2>
        <p className="text-secondary">
          For privacy inquiries, data deletion requests, or questions regarding our data practices:
        </p>
        <div className="card bg-dark border-secondary p-3">
          <p className="mb-1 text-light"><strong>Project:</strong> CodeQuest</p>
          <p className="mb-1 text-light"><strong>Developer / Owner:</strong> Mahenoor Shaikh ([Owner / Legal Entity Placeholder])</p>
          <p className="mb-1 text-light"><strong>Contact Email:</strong> [Owner Contact Email Placeholder, e.g., support@codequest.dev]</p>
          <p className="mb-0 text-muted small">Responses to verified deletion requests are provided within 30 days.</p>
        </div>
      </section>
    </div>
  );
}
