import React from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { projects } from "../../data/projects";
import { getProjectStatus } from "../../engine/projectEngine";
import { useProgress } from "../../context/ProgressContext";

export default function Projects() {
  const { progress } = useProgress();
  const completedCount = projects.filter((project) => getProjectStatus(project, progress) === "completed").length;
  const inProgressCount = projects.filter((project) => getProjectStatus(project, progress) === "in-progress").length;
  const projectXp = projects.filter((project) => (progress.completedProjects || []).includes(project.id)).reduce((total, project) => total + project.xp, 0);

  return (
    <div className="container">
      <PageHeader
        eyebrow="Build Real Things"
        title="Projects"
        description="Turn your skills into real products. Complete worlds to unlock each project and earn major XP."
      />

      <div className="project-stats" aria-label="Project statistics">
        <div><strong>{completedCount}</strong><span>Projects Completed</span></div>
        <div><strong>{inProgressCount}</strong><span>Projects In Progress</span></div>
        <div><strong>{projectXp} XP</strong><span>Total Project XP</span></div>
      </div>
      <div className="project-roadmap">
        {projects.map((project, index) => (
          <React.Fragment key={project.id}>
            <ProjectCard project={project} index={index} />
            {index < projects.length - 1 && <div className="project-roadmap-arrow" aria-hidden="true">↓</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}