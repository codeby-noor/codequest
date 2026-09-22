import React from "react";
import { motion } from "framer-motion";

/**
 * Consistent page header with eyebrow, title, and description.
 */
export default function PageHeader({ eyebrow, title, description }) {
  return (
    <motion.div
      className="page-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </motion.div>
  );
}