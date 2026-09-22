import { validateUserChallenge } from "./challengeValidator";
import { isWorkshopComplete, isCityComplete, isWorldUnlocked } from "./progressEngine";

export function isProjectUnlocked(project, progress) {
  if (!project) return false;
  if (project.requiredWorld === "workshop") return isWorkshopComplete(progress);
  if (project.requiredWorld === "city") return isCityComplete(progress);
  return isWorldUnlocked(project.requiredWorld, progress);
}

export function getProjectProgress(project, progress) {
  if (!project) return 0;
  if ((progress.completedProjects || []).includes(project.id)) return 100;
  return progress.projectProgress?.[project.id] || 0;
}

export function getProjectSteps(project, progress) {
  return progress.projectSteps?.[project.id] || project.steps.map(() => false);
}

export function getProjectStatus(project, progress) {
  if ((progress.completedProjects || []).includes(project.id)) return "completed";
  if (!isProjectUnlocked(project, progress)) return "locked";
  return getProjectProgress(project, progress) > 0 ? "in-progress" : "available";
}

export async function validateProject(project, code) {
  if (!project?.challenge) return { passed: false, results: [], error: { kind: "unsupported", message: "This project is not ready for submission yet." } };
  return validateUserChallenge(code, project.challenge);
}
