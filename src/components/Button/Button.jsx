import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable button component.
 * Renders a Link when `to` is provided, otherwise a button element.
 */
export default function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  onClick,
  type = "button",
  ariaLabel,
  className = "",
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size !== "md" ? `btn-${size}` : "",
    block ? "btn-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}