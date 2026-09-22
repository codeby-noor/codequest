import { mentorCategories } from "../data/mentor";
import { getCurrentLessonForWorld } from "../data/lessonsIndex";
import { projects } from "../data/projects";

function findCategory(id) {
  return mentorCategories.find((category) => category.id === id);
}

function categoryResponse(id, index = 0) {
  const category = findCategory(id);
  return category.responses[index % category.responses.length];
}

export function getNextQuest(context) {
  const { progress } = context;
  const worlds = ["village", "workshop", "city"];
  const currentWorld = worlds.find((world) => getCurrentLessonForWorld(world, progress));
  if (currentWorld) {
    const lesson = getCurrentLessonForWorld(currentWorld, progress);
    return { label: `Continue ${currentWorld === "village" ? "The Village" : currentWorld === "workshop" ? "The Workshop" : "The City"}`, to: `/learn/${currentWorld}/${lesson.id}` };
  }
  const nextProject = projects.find((project) => !(progress.completedProjects || []).includes(project.id));
  if (nextProject) return { label: `Start ${nextProject.title}`, to: `/projects/${nextProject.id}` };
  return { label: "Review Your Progress", to: "/achievements" };
}

export function getMentorResponse(message, context = { progress: {} }) {
  const text = (message || "").toLowerCase();
  const progress = context.progress || {};
  if (/(error|bug|broken|not working|failed)/.test(text)) {
    return "UNDERSTAND\n-> An error means one part of the program behaved differently than expected.\n\nCHECK\n-> Read the exact message and inspect the smallest related line.\n\nTRY\n-> Test that line with one simple value, then change one thing at a time.\n\nLEARN\n-> Debugging works best when you compare the expected result with the actual result. I have not inspected your code, so share the message if you want more targeted guidance.";
  }
  if (text.includes("what should i learn") || text.includes("what next")) {
    const quest = getNextQuest(context);
    return `Your next quest is ${quest.label}. Follow the current objective, then run its challenge before moving on.`;
  }
  if (text.includes("xp") || text.includes("earn")) return `${categoryResponse("progress")} You currently have ${progress.xp || 0} XP and a ${progress.streak || 0}-day streak.`;
  if (text.includes("html") || text.includes("css")) return categoryResponse("html-css");
  if (text.includes("javascript") || text.includes("function") || text.includes("array")) return categoryResponse("javascript");
  if (text.includes("challenge") || text.includes("hint")) return categoryResponse("code-arena");
  if (text.includes("project")) return categoryResponse("projects");
  if (text.includes("stuck") || text.includes("start")) {
    if (!(progress.completedLessons || []).length) return "You've just started your journey. Begin with The Village and complete your first lesson. Read the objective, try the starter code, and make one small change.";
    return categoryResponse("getting-started");
  }
  if (text.includes("progress")) return categoryResponse("progress");
  return "Tell me what you are working on: a concept, a challenge, a project, or an error. I will offer a small next step rather than give away the solution.";
}
