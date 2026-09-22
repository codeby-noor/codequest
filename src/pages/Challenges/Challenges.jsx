import React from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import MissionCard from "../../components/MissionCard/MissionCard";
import { challenges } from "../../data/challenges";

export default function Challenges() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="Daily Briefing"
        title="Challenges"
        description="Sharpen your skills with focused missions. Complete them to earn XP and keep your streak alive."
      />

      <div className="grid-2">
        {challenges.map((challenge, index) => (
          <MissionCard key={challenge.id} challenge={challenge} index={index} />
        ))}
      </div>
    </div>
  );
}