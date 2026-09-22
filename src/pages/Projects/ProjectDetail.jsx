import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import CodePlayground from "../../components/CodePlayground/CodePlayground";
import { getProjectById, projects } from "../../data/projects";
import { getProjectProgress, getProjectSteps, isProjectUnlocked } from "../../engine/projectEngine";
import { useProgress } from "../../context/ProgressContext";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const project = getProjectById(projectId);
  const { progress, setProjectProgress, setProjectSteps, completeProjectAndReward } = useProgress();
  const [showComplete, setShowComplete] = useState(false);
  const unlocked = project ? isProjectUnlocked(project, progress) : false;
  const completed = project ? (progress.completedProjects || []).includes(project.id) : false;
  const percent = project ? getProjectProgress(project, progress) : 0;
  const stepStatuses = project ? getProjectSteps(project, progress) : [];
  const currentStepIndex = stepStatuses.findIndex((status) => !status);
  const nextProject = project ? projects[projects.findIndex((item) => item.id === project.id) + 1] : null;
  const playableChallenge = project?.challenge
    ? { ...project.challenge, starterCode: project.challenge.starterCode || project.starterCode }
    : null;

  useEffect(() => {
    if (project && unlocked && !completed && percent === 0) setProjectProgress(project.id, 1);
  }, [completed, percent, project, setProjectProgress, unlocked]);

  if (!project) return <div className="container"><div className="placeholder-page"><div><span className="placeholder-icon">?</span><h1>Project not found</h1><p>That project is not part of the CodeQuest path.</p><Button to="/projects" variant="primary">Back to Projects</Button></div></div></div>;

  if (!unlocked) return <div className="container"><div className="placeholder-page"><div><span className="placeholder-icon">🔒</span><h1>Project Locked</h1><p>Complete {project.requiredWorldName} to unlock this project.</p><Button to="/projects" variant="primary">Back to Projects</Button></div></div></div>;

  function handleSolved() {
    if (!completed) completeProjectAndReward(project);
    setProjectProgress(project.id, 100);
    setShowComplete(true);
  }

  function handleValidation(validation) {
    if (!project.steps || !validation.results) return;
    const nextStatuses = project.steps.map((step) => step.testIndexes.every((index) => validation.results[index]?.success));
    setProjectSteps(project.id, nextStatuses);
    setProjectProgress(project.id, Math.round((nextStatuses.filter(Boolean).length / project.steps.length) * 100));
  }

  function handleReset() {
    if (window.confirm(`Reset your ${project.title} code and step progress? Completed project history will stay safe.`)) {
      setProjectSteps(project.id, project.steps.map(() => false));
      setProjectProgress(project.id, 0);
      return true;
    }
    return false;
  }

  return <div className="container project-detail-page">
    <Link to="/projects" className="lesson-back">← PROJECTS</Link>
    <PageHeader eyebrow={project.number} title={project.title} description={project.description} />
    <div className="project-workspace">
      <aside className="project-brief card card-elevated">
        <div className="project-detail-meta"><Badge tone={project.difficultyTone}>{project.difficulty}</Badge><Badge tone="warning">⚡ {project.xp} XP</Badge><span>{project.estimatedTime}</span></div>
        <h2>Project Brief</h2><h3>Objective</h3><p>{project.completionCriteria}</p>
        <h3>Skills</h3><div className="project-tech">{project.skills.map((skill) => <Badge key={skill} tone="accent">{skill}</Badge>)}</div>
        <h3>Learning Objectives</h3><ul>{project.learningObjectives.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3>Guided Steps</h3><ol className="project-steps">{project.steps.map((step, index) => <li key={step.id} className={stepStatuses[index] ? "completed" : !stepStatuses.slice(0, index).some((status) => !status) ? "current" : "incomplete"}><span className="project-step-status">{stepStatuses[index] ? "✓" : index === stepStatuses.findIndex((status) => !status) ? "●" : "○"}</span><strong>{step.title}</strong><span>{step.explanation}</span></li>)}</ol>
        <h3>Completion Checklist</h3><ul className="project-checklist">{project.requirements.map((item) => <li key={item}>□ {item}</li>)}</ul>
        <p className="project-validation-summary">{completed ? "✓ Requirements passed" : `${stepStatuses.filter(Boolean).length} of ${project.steps.length} steps complete`}</p>
      </aside>
      <main className="project-editor card card-elevated"><div className="project-editor-header"><div><span className="section-eyebrow">Workspace</span><h2>{completed ? "Project Complete" : currentStepIndex === -1 ? "Final Review" : project.steps[currentStepIndex].title}</h2></div><Badge tone={completed ? "success" : "accent"}>{completed ? "100% complete" : `${Math.max(percent, 1)}% in progress`}</Badge></div>{playableChallenge ? <CodePlayground challenge={playableChallenge} challengeType={playableChallenge.challengeType} onSolved={handleSolved} onValidation={handleValidation} onReset={handleReset} /> : <div className="project-unavailable"><h3>Project workspace coming next</h3><p>This project has its full brief ready. Its guided executable workspace will unlock in a later CodeQuest phase.</p></div>}</main>
    </div>
    {showComplete && <div className="modal-overlay" onClick={() => setShowComplete(false)}><div className="modal-card" role="dialog" onClick={(event) => event.stopPropagation()}><div className="modal-icon">✓</div><h2>PROJECT COMPLETE</h2><div className="modal-xp">+{project.xp} XP</div><p className="modal-title">{project.title}</p><p className="project-reward-copy">Skills unlocked: {project.skillRewards.map((reward) => reward.id).join(", ")}</p><div className="modal-actions"><Button to="/projects" variant="primary">Back to Projects →</Button>{nextProject && <Button to={`/projects/${nextProject.id}`} variant="secondary">View Next Project →</Button>}</div></div></div>}
  </div>;
}