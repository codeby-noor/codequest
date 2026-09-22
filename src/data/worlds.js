/**
 * CodeQuest World System
 *
 * Defines the main progression path across the CodeQuest universe:
 * World 1: JavaScript Village (18 Lessons) -> World 2: The Logic Forest ->
 * World 3: The Web Kingdom -> World 4: The API Harbor ->
 * World 5: The Backend Citadel -> World 6: The Developer Realm.
 */

export const worlds = [
  {
    id: "village",
    number: "01",
    name: "JavaScript Village",
    title: "JavaScript Village",
    subtitle: "Programming Fundamentals",
    description:
      "Your journey begins here. Master variables, data types, logic, loops, functions, and objects to build your computational foundation.",
    icon: "🏘️",
    theme: "emerald",
    difficulty: "Beginner",
    difficultyTone: "success",
    requiredLevel: 1,
    requiredWorld: null,
    totalLessons: 18,
    missions: 18,
    xpReward: 3000,
    skills: [
      "Variables & Constants",
      "Data Types",
      "Operators & Math",
      "Comparisons",
      "Conditionals",
      "Strings",
      "Arrays & Methods",
      "Objects",
      "Loops",
      "Functions & Scope",
      "DOM & Events",
      "Debugging",
    ],
    bossLessonId: "lesson-18",
    reward: {
      xp: 500,
      achievement: "village-graduate",
      title: "Village Master",
    },
    status: "active",
  },
  {
    id: "logic-forest",
    number: "02",
    name: "The Logic Forest",
    title: "The Logic Forest",
    subtitle: "Algorithms & Problem Solving",
    description:
      "Venture deep into the canopy of algorithmic thinking. Master problem decomposition, search strategies, uniqueness, sorting, reduce, and fast lookups.",
    icon: "🌲",
    theme: "cyan",
    difficulty: "Intermediate",
    difficultyTone: "warning",
    requiredLevel: 3,
    requiredWorld: "village",
    totalLessons: 15,
    missions: 15,
    xpReward: 3000,
    skills: [
      "Algorithmic Thinking",
      "Boolean Reasoning",
      "Number Classification",
      "Guard Clauses",
      "Linear Search",
      "Sets & Uniqueness",
      "Custom Comparators",
      "Collection Filtering",
      "Data Transformation",
      "Aggregation & Reduce",
      "Deep Traversal",
      "Algorithm Efficiency",
    ],
    bossLessonId: "forest-15",
    reward: {
      xp: 600,
      achievement: "forest-conqueror",
      title: "Logic Ranger",
    },
    status: "active",
  },
  {
    id: "web-kingdom",
    number: "03",
    name: "The Web Kingdom",
    title: "The Web Kingdom",
    subtitle: "HTML, CSS & Modern Web UI",
    description:
      "Construct the visual layer of the web. Forge semantic markup, responsive Grid & Flexbox layouts, DOM manipulation, interactive events, and browser storage.",
    icon: "🏰",
    theme: "amber",
    difficulty: "Intermediate",
    difficultyTone: "warning",
    requiredLevel: 5,
    requiredWorld: "logic-forest",
    totalLessons: 16,
    missions: 16,
    xpReward: 3500,
    skills: [
      "Semantic HTML5",
      "Form Controls",
      "CSS Selectors & Colors",
      "Box Model Spacing",
      "Flexbox Layouts",
      "CSS Grid Systems",
      "Responsive Design",
      "DOM Manipulation",
      "Browser Events",
      "Form Validation",
      "Dynamic Rendering",
      "LocalStorage Vault",
      "Browser Debugging",
    ],
    bossLessonId: "web-16",
    reward: {
      xp: 700,
      achievement: "web-sovereign",
      title: "Web Architect",
    },
    status: "active",
  },
  {
    id: "api-harbor",
    number: "04",
    name: "The API Harbor",
    title: "The API Harbor",
    subtitle: "HTTP, REST & Async JavaScript",
    description:
      "Sail across the data seas. Master asynchronous Promises, async/await workflows, HTTP protocols, Fetch API, and RESTful architectures.",
    icon: "⚓",
    theme: "blue",
    difficulty: "Advanced",
    difficultyTone: "danger",
    requiredLevel: 8,
    requiredWorld: "web-kingdom",
    totalLessons: 16,
    missions: 16,
    xpReward: 3800,
    skills: [
      "Asynchronous JS",
      "Promises & Async/Await",
      "Fetch API & HTTP",
      "REST Endpoints",
      "JSON & Data Pipelines",
      "Error Handling & Retries",
      "Bearer Authentication",
    ],
    bossLessonId: "harbor-16",
    reward: {
      xp: 800,
      achievement: "harbor-captain",
      title: "Data Navigator",
    },
    status: "active",
  },
  {
    id: "backend-citadel",
    number: "05",
    name: "The Backend Citadel",
    title: "The Backend Citadel",
    subtitle: "Node.js, Express & Databases",
    description:
      "Fortify the server stronghold. Build resilient backends with Node.js & Express, relational & document databases, authentication, and secure APIs.",
    icon: "🛡️",
    theme: "purple",
    difficulty: "Advanced",
    difficultyTone: "danger",
    requiredLevel: 10,
    requiredWorld: "api-harbor",
    totalLessons: 16,
    missions: 16,
    xpReward: 4200,
    skills: [
      "Node.js Runtime",
      "Express Middleware",
      "Databases (SQL & NoSQL)",
      "Authentication & Security",
      "Server-side CRUD APIs",
    ],
    bossLessonId: "citadel-16",
    reward: {
      xp: 900,
      achievement: "citadel-warden",
      title: "Citadel Warden",
    },
    status: "active",
  },
  {
    id: "developer-realm",
    number: "06",
    name: "The Developer Realm",
    title: "The Developer Realm",
    subtitle: "Architecture & Production Engineering",
    description:
      "The final ascent to engineering excellence. Master Git version control, CI/CD automated pipelines, unit testing, performance, and system design.",
    icon: "👑",
    theme: "rose",
    difficulty: "Expert",
    difficultyTone: "purple",
    requiredLevel: 12,
    requiredWorld: "backend-citadel",
    totalLessons: 16,
    missions: 16,
    xpReward: 5000,
    skills: [
      "Developer Workflow & Git",
      "Systematic Debugging",
      "Code Review & Refactoring",
      "Software Testing & QA",
      "Application Security",
      "Software Architecture",
      "Full-Stack Engineering",
    ],
    bossLessonId: "realm-16",
    reward: {
      xp: 1000,
      achievement: "codequest-grandmaster",
      title: "CodeQuest Developer",
    },
    status: "active",
  },
];

/** Get world by ID */
export function getWorldById(worldId) {
  return worlds.find((w) => w.id === worldId);
}

/** Get the next world in the journey */
export function getNextWorld(worldId) {
  const index = worlds.findIndex((w) => w.id === worldId);
  if (index === -1 || index >= worlds.length - 1) return null;
  return worlds[index + 1];
}

/** Get prerequisite world */
export function getWorldPrerequisite(worldId) {
  const world = getWorldById(worldId);
  if (!world || !world.requiredWorld) return null;
  return getWorldById(world.requiredWorld);
}