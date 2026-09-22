import React from "react";
import { useProgress } from "../../context/ProgressContext";
import { useAuth } from "../../context/AuthContext";
import "./SyncStatusBadge.css";

/**
 * SyncStatusBadge
 *
 * Micro indicator for cloud synchronization status.
 * States:
 * - "synced": ☁ Synced (Backed up to cloud)
 * - "syncing": 🔄 Syncing... (Active sync in progress)
 * - "offline": ⚠ Saved locally (Saved on device)
 * - "idle": ☁ Ready
 */
export default function SyncStatusBadge({ className = "", showLabel = true }) {
  const { syncStatus } = useProgress();
  const { isAuthenticated } = useAuth();

  let icon = "☁";
  let text = "Synced";
  let title = "Cloud progress is synced";
  let statusClass = "synced";

  if (syncStatus === "syncing") {
    icon = "🔄";
    text = "Syncing…";
    title = "Saving progress to cloud…";
    statusClass = "syncing";
  } else if (syncStatus === "offline") {
    icon = "💾";
    text = isAuthenticated ? "Offline" : "Saved locally";
    title = isAuthenticated
      ? "Offline mode — progress saved locally until reconnected"
      : "Saved on this device — create an account to sync across devices";
    statusClass = "offline";
  } else if (!isAuthenticated) {
    icon = "💾";
    text = "Saved locally";
    title = "Saved on this device — create an account to sync across devices";
    statusClass = "local";
  }

  return (
    <div
      className={`sync-status-badge sync-${statusClass} ${className}`}
      title={title}
      aria-label={`Cloud sync status: ${text}`}
      role="status"
    >
      <span className={`sync-icon ${statusClass === "syncing" ? "spinning" : ""}`} aria-hidden="true">
        {icon}
      </span>
      {showLabel && <span className="sync-label">{text}</span>}
    </div>
  );
}
