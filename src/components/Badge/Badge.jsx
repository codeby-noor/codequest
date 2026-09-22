import React from "react";

/**
 * Reusable badge component for difficulty, status, and metadata labels.
 */
export default function Badge({ children, tone = "muted", icon }) {
  return (
    <span className={`badge badge-${tone}`}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}