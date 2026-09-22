import React from "react";
import { motion } from "framer-motion";
import Button from "../Button/Button";

/**
 * Placeholder page for future systems.
 * Shares the same design system with a clear "coming soon" state.
 */
export default function PlaceholderPage({ icon, title, description, ctaLabel, ctaTo }) {
  return (
    <div className="container">
      <motion.div
        className="placeholder-page"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div>
          <span className="placeholder-icon" aria-hidden="true">
            {icon}
          </span>
          <h1>{title}</h1>
          <p>{description}</p>
          <Button to={ctaTo} variant="primary" size="lg">
            {ctaLabel} →
          </Button>
        </div>
      </motion.div>
    </div>
  );
}