import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/learn", label: "Learn" },
  { to: "/worlds", label: "Worlds" },
  { to: "/challenges", label: "Challenges" },
  { to: "/projects", label: "Projects" },
  { to: "/profile", label: "Profile" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <span className="footer-logo">CODEQUEST</span>
          <p className="footer-tagline">Learn code. Play. Build. Master.</p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="footer-links">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}