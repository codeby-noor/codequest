import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "../../context/ProgressContext";
import { useAuth } from "../../context/AuthContext";
import { isSoundEnabled, toggleSound } from "../../engine/soundEffects";
import SyncStatusBadge from "../SyncStatusBadge/SyncStatusBadge";

const navItems = [
  { to: "/learn", label: "Learn" },
  { to: "/worlds", label: "Worlds" },
  { to: "/skill-tree", label: "Skill Tree" },
  { to: "/challenges", label: "Challenges" },
  { to: "/code-arena", label: "Code Arena" },
  { to: "/projects", label: "Projects" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const location = useLocation();
  const { progress, levelInfo } = useProgress();
  const { user, isAuthenticated, openLoginModal } = useAuth();

  function handleToggleSound() {
    const next = toggleSound();
    setSoundOn(next);
  }

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape key closes mobile menu
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const avatarDisplay = isAuthenticated && user?.username
    ? user.username.charAt(0).toUpperCase()
    : progress.avatarInitial || "⚔️";

  return (
    <>
      <header className="navbar" role="banner">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="CodeQuest home">
            <span className="navbar-logo-mark" aria-hidden="true">
              {"</>"}
            </span>
            CODEQUEST
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="navbar-links">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `navbar-link${isActive ? " active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="navbar-right">
            {/* Desktop Full Stats */}
            <div className="navbar-stats">
              <span className="navbar-streak" title={`${progress.streak || 0} day streak`}>
                🔥 {progress.streak || 0}
              </span>
              <span className="navbar-xp" title={`${progress.xp} XP`}>
                ⚡ {progress.xp} XP
              </span>
              <span className="navbar-level" title={`Level ${levelInfo.level} - ${levelInfo.title}`}>
                LVL {levelInfo.level}
              </span>
            </div>

            {/* Mobile Compact Stats Pill */}
            <Link to="/profile" className="navbar-mobile-stats" aria-label={`Level ${levelInfo.level}, ${progress.streak || 0} day streak`}>
              <span className="mobile-stat-streak">🔥 {progress.streak || 0}</span>
              <span className="mobile-stat-divider">·</span>
              <span className="mobile-stat-lvl">LVL {levelInfo.level}</span>
            </Link>

            {/* Cloud Sync Status micro badge */}
            <div className="navbar-sync-wrap">
              <SyncStatusBadge showLabel={false} />
            </div>

            <button
              type="button"
              className="navbar-sound-toggle"
              onClick={handleToggleSound}
              title={soundOn ? "Mute audio effects" : "Enable audio effects"}
              aria-label={soundOn ? "Mute sound effects" : "Unmute sound effects"}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>

            {!isAuthenticated ? (
              <button
                type="button"
                className="navbar-auth-btn"
                onClick={openLoginModal}
              >
                <span aria-hidden="true">🛡️</span> Sign In
              </button>
            ) : (
              <Link
                to="/profile"
                className="navbar-avatar"
                aria-label={`View profile for ${user.username}`}
                title={`Logged in as ${user.username} (${user.email || "Explorer"})`}
              >
                {avatarDisplay}
              </Link>
            )}

            <button
              type="button"
              className="navbar-toggle"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>

          <div
            className="navbar-progress"
            style={{ width: `${levelInfo.percent}%` }}
            aria-hidden="true"
          />
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav open"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Safe-area mobile header status card */}
            <div className="mobile-nav-status-header">
              <div className="mobile-nav-user-stats">
                <span>🔥 {progress.streak || 0}d Streak</span>
                <span>⚡ {progress.xp} XP</span>
                <span>LVL {levelInfo.level}</span>
              </div>
              <SyncStatusBadge />
            </div>

            <div className="mobile-nav-category-title">Core Quests</div>
            <ul className="mobile-nav-links">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index, duration: 0.18 }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `mobile-nav-link${isActive ? " active" : ""}`
                    }
                  >
                    <span>{item.label}</span>
                    <span className="arrow" aria-hidden="true">→</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="mobile-nav-category-title mt-4">Rankings & Companions</div>
            <ul className="mobile-nav-links">
              {[
                { to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
                { to: "/achievements", label: "Achievements", icon: "🎖️" },
                { to: "/mentor", label: "Mentor Companion", icon: "🤖" },
                { to: "/profile", label: "Player Profile", icon: "🧙‍♂️" },
              ].map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + 0.03 * index, duration: 0.18 }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `mobile-nav-link${isActive ? " active" : ""}`
                    }
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span aria-hidden="true">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="arrow" aria-hidden="true">→</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="mobile-nav-footer-actions mt-4">
              <div className="mobile-nav-sound-row">
                <span className="text-secondary small">Sound Effects</span>
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="btn btn-secondary btn-sm"
                  style={{ minHeight: "40px", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  aria-label={soundOn ? "Disable sound effects" : "Enable sound effects"}
                >
                  {soundOn ? "🔊 Enabled" : "🔇 Muted"}
                </button>
              </div>

              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openLoginModal();
                  }}
                  className="btn btn-primary w-full mt-3"
                  style={{ minHeight: "48px", fontWeight: 600 }}
                >
                  <span aria-hidden="true">🛡️</span> Sign In / Register Account
                </button>
              ) : (
                <div className="mobile-nav-logged-in-banner mt-3">
                  <span>Logged in as <strong>{user.username}</strong></span>
                  <Link to="/profile" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>
                    View Ledger →
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}