import React from "react";
import { motion } from "framer-motion";
import SkillNode from "../SkillNode/SkillNode";
import { getAllSkillsWithProgress } from "../../data/skills";
import { useProgress } from "../../context/ProgressContext";

/**
 * Vertical skill tree with animated nodes and connecting paths.
 * Reads live skill progress from ProgressContext and lesson completion.
 */
export default function SkillTree({ limit }) {
  const { progress } = useProgress();
  const allSkills = getAllSkillsWithProgress(progress);
  const visibleSkills = limit ? allSkills.slice(0, limit) : allSkills;

  return (
    <div className="skill-tree" role="list" aria-label="Skill tree progression">
      {visibleSkills.map((skill, index) => (
        <React.Fragment key={skill.id}>
          {index > 0 && (
            <motion.div
              className={`skill-node-connector ${
                skill.status === "locked" ? "" : "completed"
              }`}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              aria-hidden="true"
            />
          )}
          <div role="listitem">
            <SkillNode skill={skill} index={index} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}