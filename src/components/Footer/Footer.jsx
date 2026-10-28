import React from "react";
import { Link } from "react-router-dom";

const footerNavLinks = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learning Quest" },
  { to: "/worlds", label: "Learning Paths" },
  { to: "/challenges", label: "Challenges Hub" },
  { to: "/code-arena", label: "Code Arena" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/achievements", label: "Achievements" },
  { to: "/projects", label: "Projects" },
  { to: "/profile", label: "Player Profile" },
];

export default function Footer({ onOpenFeedback }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="container">
        {/* Top Section: Brand identity, platform summary, and verified links */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="CodeQuest Home">
              <span className="footer-logo-icon" aria-hidden="true">⚔️</span>
              <span>CODEQUEST</span>
            </Link>
            <p className="footer-description">
              A gamified coding education platform designed to make learning programming engaging, interactive, and rewarding. Master real-world code through story-driven quests, hands-on challenges, and verified progression.
            </p>
            {onOpenFeedback && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={onOpenFeedback}
                  className="btn btn-outline-secondary btn-sm"
                  style={{
                    fontSize: "0.825rem",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "0.5rem",
                    borderColor: "var(--cq-border, #334155)",
                    color: "var(--cq-text-secondary, #94a3b8)",
                  }}
                  aria-label="Submit tester feedback or bug report"
                >
                  💬 Give Feedback / Report Bug
                </button>
              </div>
            )}
          </div>

          <div className="footer-nav-col">
            <span className="footer-nav-heading">Platform Navigation</span>
            <nav aria-label="Footer navigation">
              <ul className="footer-links-grid">
                {footerNavLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="footer-link">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Subtle dividing line */}
        <div className="footer-divider" />

        {/* Bottom Section: Developer Credit, Legal Links, and Dynamic Copyright */}
        <div className="footer-bottom">
          <div className="footer-credit">
            <div className="footer-credit-badge">
              <span className="footer-credit-heart" aria-hidden="true">✨</span>
              <span className="footer-credit-title">
                Built with care by <strong>Mahenoor Shaikh</strong>
              </span>
            </div>
            <p className="footer-credit-sub">
              Designed and developed with a passion for coding and learning.
            </p>
          </div>

          <div className="d-flex flex-column align-items-md-end gap-1">
            <div className="d-flex gap-3 small">
              <Link to="/privacy" className="footer-link text-muted">
                Privacy
              </Link>
              <span className="text-muted" aria-hidden="true">&bull;</span>
              <Link to="/terms" className="footer-link text-muted">
                Terms
              </Link>
              {onOpenFeedback && (
                <>
                  <span className="text-muted" aria-hidden="true">&bull;</span>
                  <button
                    type="button"
                    onClick={onOpenFeedback}
                    className="footer-link text-muted p-0 border-0 bg-transparent"
                    style={{ cursor: "pointer", fontSize: "inherit" }}
                  >
                    Feedback
                  </button>
                </>
              )}
            </div>
            <div className="footer-copyright">
              © {currentYear} CodeQuest. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}