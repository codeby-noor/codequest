import React from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import SkillTreeComponent from "../../components/SkillTree/SkillTree";
import Button from "../../components/Button/Button";
import { useProgress } from "../../context/ProgressContext";
import { getAllSkillsWithProgress } from "../../data/skills";

export default function SkillTreePage() {
  const { progress } = useProgress();
  const allSkills = getAllSkillsWithProgress(progress);
  const masteredCount = allSkills.filter((s) => s.progress >= 100).length;
  const inProgressSkill = allSkills.find((s) => s.status === "current") || allSkills[0];

  return (
    <div className="container">
      <PageHeader
        eyebrow="Mastery"
        title="Skill Tree"
        description="Every mission sharpens a skill. Master each node to unlock the next stage of your engineering journey."
      />

      <div className="card card-elevated mb-8" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <span className="section-eyebrow" style={{ marginBottom: "0.25rem" }}>Skill Progress</span>
          <h3 style={{ fontSize: "1.25rem" }}>{masteredCount} of {allSkills.length} Skills Mastered</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Current Focus: <strong style={{ color: "var(--text-primary)" }}>{inProgressSkill.name}</strong> ({inProgressSkill.progress}%)
          </p>
        </div>
        <Button to="/learn" variant="primary">
          Continue Quest →
        </Button>
      </div>

      <SkillTreeComponent />
    </div>
  );
}