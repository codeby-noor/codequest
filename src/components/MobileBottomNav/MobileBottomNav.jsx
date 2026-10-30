import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useProgress } from "../../context/ProgressContext";
import { useAuth } from "../../context/AuthContext";
import "./MobileBottomNav.css";

const bottomNavItems = [
  {
    to: "/",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    match: (pathname) => pathname === "/",
  },
  {
    to: "/learn",
    label: "Learn",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    match: (pathname) => pathname.startsWith("/learn") || pathname.startsWith("/worlds"),
  },
  {
    to: "/challenges",
    label: "Challenges",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
    match: (pathname) => pathname.startsWith("/challenges"),
  },
  {
    to: "/code-arena",
    label: "Arena",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
    match: (pathname) => pathname.startsWith("/code-arena"),
  },
  {
    to: "/profile",
    label: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    match: (pathname) => pathname === "/profile" || pathname.startsWith("/achievements") || pathname.startsWith("/leaderboard"),
  },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { progress } = useProgress();
  const { isAuthenticated, user } = useAuth();

  const streak = progress.streak || 0;

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile primary navigation">
      <div className="mobile-bottom-nav-inner">
        {bottomNavItems.map((item) => {
          const isActive = item.match(location.pathname);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`mobile-bottom-nav-link ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="mobile-bottom-nav-icon-wrap">
                {item.icon}
                {item.to === "/" && streak > 0 && (
                  <span className="mobile-bottom-nav-badge" title={`${streak} day streak`}>
                    {streak}
                  </span>
                )}
              </div>
              <span className="mobile-bottom-nav-label">{item.label}</span>
              {isActive && <span className="mobile-bottom-nav-indicator" aria-hidden="true" />}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
