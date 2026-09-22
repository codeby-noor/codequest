import React from "react";
import { Link } from "react-router-dom";

/**
 * Breadcrumb navigation for the Code Arena.
 * Shows: World > Lesson > Challenge
 * Fully data-driven — works for any world.
 */
export default function ArenaBreadcrumbs({ challenge }) {
  const worldPath = challenge.world === "workshop" ? "/learn/workshop" : "/learn/village";
  const worldName = challenge.worldName || "The Village";

  return (
    <nav className="arena-breadcrumbs" aria-label="Breadcrumb">
      <Link to={worldPath} className="arena-crumb">
        {worldName}
      </Link>
      <span className="arena-crumb-sep" aria-hidden="true">›</span>
      <Link to={`${worldPath}/${challenge.lessonId}`} className="arena-crumb">
        Lesson {challenge.lessonId.replace(/^[a-z]+-/, "")}
      </Link>
      <span className="arena-crumb-sep" aria-hidden="true">›</span>
      <span className="arena-crumb current">{challenge.title}</span>
    </nav>
  );
}