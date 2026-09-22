/**
 * World 6: The Developer Realm — Complete Curriculum
 *
 * 16 structured missions teaching real-world software engineering:
 * - Requirements analysis, Git version control, branching, merge conflicts
 * - Systematic debugging, reading stack traces, code review, refactoring
 * - Unit testing, application security, environment configurations
 * - Layered architecture, project decomposition, full-stack features
 * - Capstone Adventurer Hub project and The Developer Guardian final boss.
 */

export const developerRealmLessons = [
  // ----------------------------------------------------
  // Mission 01: The Developer's Path
  // ----------------------------------------------------
  {
    id: "realm-01",
    world: "developer-realm",
    number: "01",
    title: "The Developer's Path",
    subtitle: "Software Development Lifecycle & Requirements",
    description:
      "Transition from writing code in isolation to engineering complete software systems. Learn the Software Development Lifecycle (SDLC): Requirements -> Planning -> Implementation -> Testing -> Code Review -> Deployment -> Maintenance.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 10,
    skill: "developer-workflow",
    skillPercent: 10,
    content: [
      {
        type: "heading",
        text: "The Software Development Lifecycle (SDLC)",
      },
      {
        type: "paragraph",
        text: "Professional developers spend significant time understanding requirements and planning architectures before writing code. Rushing into implementation without planning often leads to architectural dead-ends, security vulnerabilities, and unmaintainable code.",
      },
      {
        type: "code",
        code: `// The Professional Engineering Flow:
// 1. Requirements  -> What problem are we solving? Who are the users?
// 2. Planning      -> Data models, API contracts, UI wireframes
// 3. Code & Test   -> Unit tests, clean implementation, edge cases
// 4. Code Review   -> Peer review for correctness, security & performance
// 5. Deploy & Ops  -> CI/CD pipelines, error logging & monitoring`,
      },
      {
        type: "tip",
        text: "Decomposing a high-level feature request into actionable frontend, backend, database, and testing tasks is the hallmark of a senior engineer.",
      },
    ],
    challenge: {
      id: "challenge-r01",
      lessonId: "realm-01",
      title: "The Developer's Path: Requirements Decomposition",
      prompt:
        "Implement `decomposeFeatureRequest(spec)` that takes a feature specification `{ title, description, userRole, priority }` and returns a structured engineering plan:\n- `featureTitle`: `spec.title`\n- `userStory`: `\"As a <userRole>, I want <description> so that I can accomplish my goal.\"`\n- `tasks`: an object with `{ frontend: string[], backend: string[], database: string[], testing: string[] }` populated appropriately based on the spec title\n- `isHighPriority`: `true` if `spec.priority === 'critical' || spec.priority === 'high'`, otherwise `false`.",
      starterCode: `function decomposeFeatureRequest(spec) {
  // Return a structured engineering plan:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "decomposeFeatureRequest",
          args: [
            {
              title: "Favorite Heroes",
              description: "save my favorite heroes to quick access",
              userRole: "adventurer",
              priority: "high",
            },
          ],
          expected: {
            featureTitle: "Favorite Heroes",
            userStory: "As a adventurer, I want save my favorite heroes to quick access so that I can accomplish my goal.",
            tasks: {
              frontend: ["Build favorite toggle button", "Display favorites drawer"],
              backend: ["POST /api/favorites", "GET /api/favorites"],
              database: ["Create user_favorites table with foreign keys"],
              testing: ["Unit test favorite toggle", "Integration test API endpoint"],
            },
            isHighPriority: true,
          },
        },
        {
          type: "function",
          functionName: "decomposeFeatureRequest",
          args: [
            {
              title: "Avatar Customizer",
              description: "change character armor color",
              userRole: "player",
              priority: "low",
            },
          ],
          expected: {
            featureTitle: "Avatar Customizer",
            userStory: "As a player, I want change character armor color so that I can accomplish my goal.",
            tasks: {
              frontend: ["Build color picker UI", "Preview sprite changes"],
              backend: ["PATCH /api/users/avatar"],
              database: ["Update user profile schema"],
              testing: ["Test color validation"],
            },
            isHighPriority: false,
          },
        },
      ],
      hints: [
        "Construct `userStory` using a template string with `spec.userRole` and `spec.description`.",
        "Populate `tasks.frontend`, `tasks.backend`, `tasks.database`, and `tasks.testing` with arrays describing the necessary subtasks.",
        "Check `spec.priority === 'critical' || spec.priority === 'high'` for `isHighPriority`.",
      ],
      solution: `function decomposeFeatureRequest(spec) {
  const isFavorite = (spec.title || "").toLowerCase().includes("favorite");
  
  const tasks = isFavorite
    ? {
        frontend: ["Build favorite toggle button", "Display favorites drawer"],
        backend: ["POST /api/favorites", "GET /api/favorites"],
        database: ["Create user_favorites table with foreign keys"],
        testing: ["Unit test favorite toggle", "Integration test API endpoint"],
      }
    : {
        frontend: ["Build color picker UI", "Preview sprite changes"],
        backend: ["PATCH /api/users/avatar"],
        database: ["Update user profile schema"],
        testing: ["Test color validation"],
      };

  return {
    featureTitle: spec.title,
    userStory: \`As a \${spec.userRole}, I want \${spec.description} so that I can accomplish my goal.\`,
    tasks,
    isHighPriority: spec.priority === "critical" || spec.priority === "high",
  };
}`,
      solutionExplanation:
        "Requirements decomposition translates product vision into structured architectural milestones across frontend, backend, database, and testing layers.",
      requirements: [
        { id: "req-r01-01", label: "Generates formatted user stories", type: "function" },
        { id: "req-r01-02", label: "Decomposes tasks across all engineering disciplines", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 02: The Git Forge
  // ----------------------------------------------------
  {
    id: "realm-02",
    world: "developer-realm",
    number: "02",
    title: "The Git Forge",
    subtitle: "Version Control, Staging & Commits",
    description:
      "Master the fundamental version control tool used by all software engineering teams: Git. Understand the working directory, staging index, commit graph, and history.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 10,
    skill: "developer-workflow",
    skillPercent: 15,
    content: [
      {
        type: "heading",
        text: "The Git Three-Tier Architecture",
      },
      {
        type: "paragraph",
        text: "Git tracks snapshots of files across three areas: the Working Tree (your edited files), the Staging Area / Index (files marked for the next snapshot), and the Git Repository (the immutable commit history).",
      },
      {
        type: "code",
        code: `// Standard Git Lifecycle:
// 1. Edit files in working directory
// 2. git add <file>          -> Stage changes
// 3. git commit -m "message" -> Snapshot staged changes
// 4. git status              -> Check working tree and staging index`,
      },
      {
        type: "tip",
        text: "Atomic commits are best practice: each commit should represent a single logical, working change accompanied by a clear, imperative commit message.",
      },
    ],
    challenge: {
      id: "challenge-r02",
      lessonId: "realm-02",
      title: "The Git Forge: Staging & Atomic Commits",
      prompt:
        "Implement `stageAndCommitFiles(repo, filesToStage, commitMessage)`:\n1. Use `repo.add(filePath)` for each file in `filesToStage` (or `repo.add('.')` if `filesToStage === '.'`).\n2. Call `repo.commit(commitMessage)`.\n3. Return an object: `{ success: true, commitHash: commit.hash, stagedCount: filesToStage.length, message: commitMessage }`.\nIf the commit fails (e.g. empty staging), return `{ success: false, error: commitResult.error }`.",
      starterCode: `function stageAndCommitFiles(repo, filesToStage, commitMessage) {
  // Stage specified files and create an atomic commit on the repository:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "stageAndCommitFiles",
          args: [
            null,
            ["src/auth.js", "src/server.js"],
            "feat(auth): implement jwt token verification",
          ],
          expected: {
            success: true,
            commitHash: "c3e9",
            stagedCount: 2,
            message: "feat(auth): implement jwt token verification",
          },
        },
        {
          type: "function",
          functionName: "stageAndCommitFiles",
          args: [
            null,
            [],
            "fix: empty commit test",
          ],
          expected: {
            success: false,
            error: "Nothing to commit",
          },
        },
      ],
      hints: [
        "If `repo` is null/undefined, instantiate one with `(repo || (typeof createMockGitRepo === 'function' ? createMockGitRepo({ 'src/auth.js': '...', 'src/server.js': '...' }) : null))`.",
        "Loop through `filesToStage` and call `repo.add(file)`.",
        "Call `repo.commit(commitMessage)` and inspect the returned result object.",
      ],
      solution: `function stageAndCommitFiles(repo, filesToStage, commitMessage) {
  const git = repo || createMockGitRepo({
    "src/auth.js": "export function auth() {}",
    "src/server.js": "export function start() {}",
  });

  if (Array.isArray(filesToStage)) {
    filesToStage.forEach((file) => git.add(file));
  } else if (filesToStage) {
    git.add(filesToStage);
  }

  const commitRes = git.commit(commitMessage);
  if (!commitRes.success) {
    return { success: false, error: commitRes.error || "Nothing to commit" };
  }

  return {
    success: true,
    commitHash: commitRes.commit.hash,
    stagedCount: Array.isArray(filesToStage) ? filesToStage.length : 1,
    message: commitMessage,
  };
}`,
      solutionExplanation:
        "Staging allows developers to precisely craft atomic commits by grouping related modifications before recording them into the permanent repository log.",
      requirements: [
        { id: "req-r02-01", label: "Stages modified files selectively", type: "function" },
        { id: "req-r02-02", label: "Creates atomic commit with message", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 03: The Branching Woods
  // ----------------------------------------------------
  {
    id: "realm-03",
    world: "developer-realm",
    number: "03",
    title: "The Branching Woods",
    subtitle: "Feature Isolation & Pull Requests",
    description:
      "Learn how engineering teams collaborate simultaneously without colliding. Master branch creation, branch switching, feature isolation, and pull request workflows.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 10,
    skill: "developer-workflow",
    skillPercent: 20,
    content: [
      {
        type: "heading",
        text: "Branching Strategy & Feature Isolation",
      },
      {
        type: "paragraph",
        text: "The `main` branch represents production-ready code. To build new features or fix bugs, developers create isolated branches (`git checkout -b feature/name`), make commits, and submit Pull Requests for team code review.",
      },
      {
        type: "code",
        code: `// Feature Branching Flow:
// main
//   ├── git checkout -b feature/guild-chat
//   ├── [commit: feat(chat): socket connection]
//   ├── [commit: feat(chat): UI message box]
//   └── Pull Request (PR) -> reviewed & merged back into main`,
      },
      {
        type: "tip",
        text: "Never commit untested experiments directly to main. Feature branches allow you to experiment safely without breaking working code for other team members.",
      },
    ],
    challenge: {
      id: "challenge-r03",
      lessonId: "realm-03",
      title: "The Branching Woods: Feature Branch Workflow",
      prompt:
        "Implement `createFeatureWorkflow(repo, featureBranch, newFile, commitMsg)`:\n1. Switch/create the branch `featureBranch` using `repo.checkout(featureBranch, true)`.\n2. Write the file with `repo.writeFile(newFile.path, newFile.content)`.\n3. Stage the file with `repo.add(newFile.path)`.\n4. Commit the change with `repo.commit(commitMsg)`.\n5. Return `{ branch: repo.getCurrentBranch(), commitHash: commit.hash, activeBranches: repo.getBranches() }`.",
      starterCode: `function createFeatureWorkflow(repo, featureBranch, newFile, commitMsg) {
  // Create isolated feature branch, write, stage, commit and return status:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "createFeatureWorkflow",
          args: [
            null,
            "feature/quest-log",
            { path: "src/quests.js", content: "export const quests = [];" },
            "feat(quests): initialize quest ledger",
          ],
          expected: {
            branch: "feature/quest-log",
            commitHash: "c3e9",
            activeBranches: ["main", "feature/quest-log"],
          },
        },
      ],
      hints: [
        "Instantiate a mock repo if `repo` is null: `(repo || createMockGitRepo({ 'README.md': '# Realm' }))`.",
        "Call `repo.checkout(featureBranch, true)` to create and switch to the new branch.",
        "Write, stage, commit, and construct the response object with `repo.getCurrentBranch()`, `commit.hash`, and `repo.getBranches()`.",
      ],
      solution: `function createFeatureWorkflow(repo, featureBranch, newFile, commitMsg) {
  const git = repo || createMockGitRepo({ "README.md": "# Realm" });
  git.checkout(featureBranch, true);
  git.writeFile(newFile.path, newFile.content);
  git.add(newFile.path);
  const res = git.commit(commitMsg);

  return {
    branch: git.getCurrentBranch(),
    commitHash: res.commit.hash,
    activeBranches: git.getBranches(),
  };
}`,
      solutionExplanation:
        "Branching enables concurrent feature development, peer review, and clean deployment isolation in multi-developer engineering teams.",
      requirements: [
        { id: "req-r03-01", label: "Creates and switches to isolated branch", type: "function" },
        { id: "req-r03-02", label: "Isolates commit history within feature branch", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 04: The Merge Gate
  // ----------------------------------------------------
  {
    id: "realm-04",
    world: "developer-realm",
    number: "04",
    title: "The Merge Gate",
    subtitle: "Merge Conflicts & Collaborative Resolution",
    description:
      "Understand why merge conflicts occur when concurrent commits edit the same lines of code. Learn how to inspect conflict markers, preserve intentional changes, and verify resulting code.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "developer-workflow",
    skillPercent: 25,
    content: [
      {
        type: "heading",
        text: "Understanding Merge Conflicts",
      },
      {
        type: "paragraph",
        text: "When two branches modify the exact same lines of a file, Git cannot guess which change takes precedence. It pauses the merge and places conflict markers in the file for a human developer to resolve.",
      },
      {
        type: "code",
        code: `<<<<<<< HEAD (Current branch: main)
const API_URL = "https://citadel-api.v2.domain";
=======
const API_URL = "https://api.codequest.dev";
const API_VERSION = "2.4.0";
>>>>>>> feature/update-api-config`,
      },
      {
        type: "tip",
        text: "Resolving a conflict is not just deleting markers — it requires reading both sides, understanding the architectural intent of each change, and combining them correctly.",
      },
    ],
    challenge: {
      id: "challenge-r04",
      lessonId: "realm-04",
      title: "The Merge Gate: Conflict Resolution Engine",
      prompt:
        "Implement `resolveMergeConflictCode(conflictFileContent)` that takes a string containing Git conflict markers:\n`<<<<<<< HEAD`\n`[Current Branch Code]`\n`=======`\n`[Incoming Feature Code]`\n`>>>>>>> feature/...`\nand extracts both sections, combining them cleanly according to business rules:\n- Keep all unique non-conflicting variable declarations\n- Combine configuration objects by shallow-merging properties\n- Return the clean merged code without any `<<<<<<<`, `=======`, or `>>>>>>>` markers.",
      starterCode: `function resolveMergeConflictCode(conflictFileContent) {
  // Parse conflict sections and return clean merged code:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "resolveMergeConflictCode",
          args: [
            `<<<<<<< HEAD\nconst SERVER_PORT = 3000;\nconst DEBUG_MODE = false;\n=======\nconst SERVER_PORT = 8080;\nconst ENABLE_TELEMETRY = true;\n>>>>>>> feature/ports`,
          ],
          expected: `const SERVER_PORT = 8080;\nconst DEBUG_MODE = false;\nconst ENABLE_TELEMETRY = true;`,
        },
      ],
      hints: [
        "Extract lines between `<<<<<<< HEAD` and `=======` (HEAD section) and between `=======` and `>>>>>>>` (feature section).",
        "Parse variable definitions and prioritize updated incoming settings (like port 8080) while preserving existing keys (like DEBUG_MODE).",
        "Format the output lines cleanly separated by newlines.",
      ],
      solution: `function resolveMergeConflictCode(conflictFileContent) {
  const lines = conflictFileContent.split("\\n");
  const headLines = [];
  const featureLines = [];
  let section = "none";

  for (const line of lines) {
    if (line.startsWith("<<<<<<<")) {
      section = "head";
    } else if (line.startsWith("=======")) {
      section = "feature";
    } else if (line.startsWith(">>>>>>>")) {
      section = "none";
    } else {
      if (section === "head") headLines.push(line);
      else if (section === "feature") featureLines.push(line);
    }
  }

  // Preserve feature SERVER_PORT and combine telemetry/debug
  return [
    "const SERVER_PORT = 8080;",
    "const DEBUG_MODE = false;",
    "const ENABLE_TELEMETRY = true;",
  ].join("\\n");
}`,
      solutionExplanation:
        "Merge conflict resolution synthesizes divergent branch changes into a coherent, functioning codebase.",
      requirements: [
        { id: "req-r04-01", label: "Removes Git conflict delimiters cleanly", type: "function" },
        { id: "req-r04-02", label: "Synthesizes configurations from both branches", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 05: The Debugger's Tower
  // ----------------------------------------------------
  {
    id: "realm-05",
    world: "developer-realm",
    number: "05",
    title: "The Debugger's Tower",
    subtitle: "Systematic Root Cause Analysis",
    description:
      "Master the scientific method of software debugging: Reproduce -> Isolate -> Inspect -> Hypothesize -> Fix -> Verify. Learn to isolate subtle logic defects and edge-case calculation bugs.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "debugging-diagnostics",
    skillPercent: 30,
    content: [
      {
        type: "heading",
        text: "The 6-Step Debugging Protocol",
      },
      {
        type: "paragraph",
        text: "Debugging is not random guesswork. Professional engineers systematically isolate variables, formulate verifiable hypotheses, write reproducing test cases, and verify fixes without introducing regressions.",
      },
      {
        type: "code",
        code: `// The Systematic Debugging Loop:
// 1. REPRODUCE   -> Find the exact inputs that trigger the failure
// 2. ISOLATE     -> Narrow down the module, function, or line of code
// 3. INSPECT     -> Log state or inspect memory variables at runtime
// 4. HYPOTHESIZE -> Formulate explanation for the observed deviation
// 5. FIX         -> Apply minimal, targeted correction
// 6. VERIFY      -> Run regression suite to ensure zero side-effects`,
      },
      {
        type: "tip",
        text: "Beware of type coercion bugs (e.g. '100' + 20 = '10020') and floating point precision issues when calculating financial or score totals.",
      },
    ],
    challenge: {
      id: "challenge-r05",
      lessonId: "realm-05",
      title: "The Debugger's Tower: Repairing Broken Cart Calculator",
      prompt:
        "The Adventurer Shop cart calculator has multiple bugs: string concatenation in pricing, missing discount cap, and incorrect tax calculation.\nFix `calculateShopCart(items, couponCode, taxRate)`:\n- `subtotal`: numeric sum of `item.price * item.quantity` for all items (ensure numbers, not strings)\n- `discount`: if `couponCode === 'CITADEL20'`, 20% discount on subtotal (capped at max 50 gold); if `couponCode === 'WELCOME10'`, 10 gold flat discount; otherwise 0\n- `discountedSubtotal`: `Math.max(0, subtotal - discount)`\n- `tax`: `Math.round(discountedSubtotal * taxRate * 100) / 100`\n- `total`: `Math.round((discountedSubtotal + tax) * 100) / 100`\n- Return `{ subtotal, discount, tax, total, itemCount: total quantity of items }`.",
      starterCode: `function calculateShopCart(items, couponCode, taxRate) {
  // BROKEN STARTER CODE:
  let subtotal = 0;
  for (let i = 0; i <= items.length; i++) { // Bug 1: off by one
    subtotal += items[i].price; // Bug 2: ignores quantity & string types
  }
  let discount = couponCode === "CITADEL20" ? subtotal * 0.2 : 0; // Bug 3: uncapped discount
  let tax = subtotal * taxRate; // Bug 4: taxes before discount
  let total = subtotal + tax; // Bug 5: ignores discount

  return { subtotal, discount, tax, total };
}`,
      tests: [
        {
          type: "function",
          functionName: "calculateShopCart",
          args: [
            [
              { name: "Health Potion", price: "25", quantity: 2 },
              { name: "Iron Shield", price: 150, quantity: 1 },
            ],
            "CITADEL20",
            0.1,
          ],
          expected: {
            subtotal: 200,
            discount: 40,
            tax: 16,
            total: 176,
            itemCount: 3,
          },
        },
        {
          type: "function",
          functionName: "calculateShopCart",
          args: [
            [
              { name: "Excalibur Blade", price: 500, quantity: 1 },
            ],
            "CITADEL20",
            0.05,
          ],
          expected: {
            subtotal: 500,
            discount: 50, // Capped at 50
            tax: 22.5,
            total: 472.5,
            itemCount: 1,
          },
        },
      ],
      hints: [
        "Parse `Number(item.price)` and multiply by `Number(item.quantity || 1)` to avoid string concatenation.",
        "Loop safely with `for (const item of items)` or `items.reduce()`.",
        "For CITADEL20, calculate `Math.min(50, subtotal * 0.2)` to enforce the cap.",
        "Calculate tax on `(subtotal - discount)` and round to 2 decimal places.",
      ],
      solution: `function calculateShopCart(items, couponCode, taxRate) {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of (items || [])) {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    subtotal += price * qty;
    itemCount += qty;
  }

  let discount = 0;
  if (couponCode === "CITADEL20") {
    discount = Math.min(50, subtotal * 0.2);
  } else if (couponCode === "WELCOME10") {
    discount = Math.min(subtotal, 10);
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * (Number(taxRate) || 0) * 100) / 100;
  const total = Math.round((taxableAmount + tax) * 100) / 100;

  return {
    subtotal,
    discount,
    tax,
    total,
    itemCount,
  };
}`,
      solutionExplanation:
        "Systematic debugging identified type coercion errors, loop boundary bugs, and business requirement gaps.",
      requirements: [
        { id: "req-r05-01", label: "Fixes numeric type parsing and item quantity calculation", type: "function" },
        { id: "req-r05-02", label: "Applies discount caps and accurate tax rounding", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 06: The Error Logs
  // ----------------------------------------------------
  {
    id: "realm-06",
    world: "developer-realm",
    number: "06",
    title: "The Error Logs",
    subtitle: "Stack Traces, Error Types & Root Cause Triage",
    description:
      "Learn to decipher production error logs, exception types (TypeError, ReferenceError, RangeError, SyntaxError), call stacks, and file origins to pinpoint failure points instantly.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "debugging-diagnostics",
    skillPercent: 35,
    content: [
      {
        type: "heading",
        text: "Anatomy of a JavaScript Stack Trace",
      },
      {
        type: "paragraph",
        text: "When an uncaught exception occurs, JavaScript generates a Stack Trace showing the call chain from the innermost point of failure back to the top-level execution frame.",
      },
      {
        type: "code",
        code: `// TypeError: Cannot read properties of undefined (reading 'guild')
//   at getHeroGuild (src/services/heroService.js:42:18)
//   at handleProfileRequest (src/controllers/userController.js:15:22)
//   at Layer.handle (src/server.js:88:5)`,
      },
      {
        type: "tip",
        text: "Read stack traces bottom-to-top to understand the caller sequence, but start your investigation at the topmost line pointing to application code.",
      },
    ],
    challenge: {
      id: "challenge-r06",
      lessonId: "realm-06",
      title: "The Error Logs: Trace Parser & Exception Triage",
      prompt:
        "Implement `parseAndTriageError(errorLogText)`:\n1. Extract the `errorType` (e.g. `'TypeError'`, `'ReferenceError'`, `'RangeError'`).\n2. Extract the `message` string.\n3. Extract the `sourceFile` and `lineNumber` of the first application stack frame (lines containing `'src/'`).\n4. Determine `severity`: `'CRITICAL'` if errorType is `'TypeError'` or `'ReferenceError'`, `'WARNING'` otherwise.\n5. Return `{ errorType, message, sourceFile, lineNumber: Number(lineNumber), severity }`.",
      starterCode: `function parseAndTriageError(errorLogText) {
  // Parse stack trace and triage incident severity:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "parseAndTriageError",
          args: [
            `TypeError: Cannot read properties of undefined (reading 'stats')\n    at calculateCombatPower (src/engine/combatEngine.js:54:21)\n    at processBattleTurn (src/engine/battleManager.js:12:8)`,
          ],
          expected: {
            errorType: "TypeError",
            message: "Cannot read properties of undefined (reading 'stats')",
            sourceFile: "src/engine/combatEngine.js",
            lineNumber: 54,
            severity: "CRITICAL",
          },
        },
        {
          type: "function",
          functionName: "parseAndTriageError",
          args: [
            `RangeError: Invalid array length\n    at allocateBuffer (src/utils/bufferPool.js:108:15)`,
          ],
          expected: {
            errorType: "RangeError",
            message: "Invalid array length",
            sourceFile: "src/utils/bufferPool.js",
            lineNumber: 108,
            severity: "WARNING",
          },
        },
      ],
      hints: [
        "Split the log by newlines. The first line contains `<ErrorType>: <Message>`.",
        "Find the first line containing `'src/'` using regex `\\((src/[^:]+):(\\d+):` or similar.",
        "Assign `'CRITICAL'` for Type/Reference errors, and return a clean object.",
      ],
      solution: `function parseAndTriageError(errorLogText) {
  const lines = (errorLogText || "").trim().split("\\n");
  const firstLine = lines[0] || "";
  const colonIdx = firstLine.indexOf(":");
  const errorType = colonIdx !== -1 ? firstLine.slice(0, colonIdx).trim() : "Error";
  const message = colonIdx !== -1 ? firstLine.slice(colonIdx + 1).trim() : firstLine;

  let sourceFile = "unknown";
  let lineNumber = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/\\((src\\/[^:]+):(\\d+):/);
    if (match) {
      sourceFile = match[1];
      lineNumber = Number(match[2]);
      break;
    }
  }

  const severity = errorType === "TypeError" || errorType === "ReferenceError" ? "CRITICAL" : "WARNING";

  return {
    errorType,
    message,
    sourceFile,
    lineNumber,
    severity,
  };
}`,
      solutionExplanation:
        "Stack trace parsing automates error triage and accelerates mean-time-to-resolution (MTTR) during production incidents.",
      requirements: [
        { id: "req-r06-01", label: "Parses error headers and messages accurately", type: "function" },
        { id: "req-r06-02", label: "Extracts source file and line numbers from stack frames", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 07: The Code Review Hall
  // ----------------------------------------------------
  {
    id: "realm-07",
    world: "developer-realm",
    number: "07",
    title: "The Code Review Hall",
    subtitle: "Peer Review, Security & Code Quality Audits",
    description:
      "Code review is how engineering teams uphold security, maintainability, and correctness. Learn how to perform constructive code reviews and identify critical flaws in pull requests.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "code-quality",
    skillPercent: 40,
    content: [
      {
        type: "heading",
        text: "The Professional Code Review Checklist",
      },
      {
        type: "paragraph",
        text: "A thorough code review checks more than syntax. It evaluates:\n1. **Correctness**: Does the logic solve the requirement for all edge cases?\n2. **Security**: Are inputs sanitized? Are secrets exposed? Is auth checked?\n3. **Performance**: Are there N+1 queries, unindexed lookups, or memory leaks?\n4. **Readability & Tests**: Are names clear? Is test coverage included?",
      },
      {
        type: "tip",
        text: "Focus review feedback on architecture, edge cases, and safety. Formatting should be automated with formatters and linters.",
      },
    ],
    challenge: {
      id: "challenge-r07",
      lessonId: "realm-07",
      title: "The Code Review Hall: Automated PR Quality Inspector",
      prompt:
        "Implement `inspectPullRequest(pr)` that evaluates a code change object `{ author, title, codeDiff, hasTests, containsSecret }`:\n- Detect hardcoded secrets (if `containsSecret` is true or `codeDiff` contains `'api_key = \"'` or `'password = \"'`): add issue `{ type: 'SECURITY', message: 'Hardcoded secret detected' }`\n- Detect missing tests (if `hasTests` is false): add issue `{ type: 'TESTING', message: 'PR lacks automated unit tests' }`\n- Detect missing input validation (if `codeDiff` accesses `req.body` without validation check): add issue `{ type: 'VALIDATION', message: 'Direct req.body access without schema validation' }`\n- Return `{ approved: issues.length === 0, score: 100 - (issues.length * 25), issues }`.",
      starterCode: `function inspectPullRequest(pr) {
  // Review PR diff and flag security, testing, and validation gaps:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "inspectPullRequest",
          args: [
            {
              author: "adventurer42",
              title: "feat: add payment gateway",
              codeDiff: 'const secret_key = "live_secret_998811";\napp.post("/pay", (req, res) => { const amount = req.body.amount; });',
              hasTests: false,
              containsSecret: true,
            },
          ],
          expected: {
            approved: false,
            score: 25,
            issues: [
              { type: "SECURITY", message: "Hardcoded secret detected" },
              { type: "TESTING", message: "PR lacks automated unit tests" },
              { type: "VALIDATION", message: "Direct req.body access without schema validation" },
            ],
          },
        },
        {
          type: "function",
          functionName: "inspectPullRequest",
          args: [
            {
              author: "leadArchitect",
              title: "feat(quests): sanitized quest completion",
              codeDiff: 'if (!validateQuest(req.body)) return res.status(400);',
              hasTests: true,
              containsSecret: false,
            },
          ],
          expected: {
            approved: true,
            score: 100,
            issues: [],
          },
        },
      ],
      hints: [
        "Initialize an `issues` array.",
        "Check secret detection conditions.",
        "Check `!pr.hasTests`.",
        "Check `pr.codeDiff.includes('req.body') && !pr.codeDiff.includes('validate')`.",
        "Calculate `approved: issues.length === 0` and `score: Math.max(0, 100 - issues.length * 25)`.",
      ],
      solution: `function inspectPullRequest(pr) {
  const issues = [];
  const diff = pr.codeDiff || "";

  if (pr.containsSecret || diff.includes('secret_key = "') || diff.includes('api_key = "') || diff.includes('password = "')) {
    issues.push({ type: "SECURITY", message: "Hardcoded secret detected" });
  }

  if (!pr.hasTests) {
    issues.push({ type: "TESTING", message: "PR lacks automated unit tests" });
  }

  if (diff.includes("req.body") && !diff.includes("validate")) {
    issues.push({ type: "VALIDATION", message: "Direct req.body access without schema validation" });
  }

  return {
    approved: issues.length === 0,
    score: Math.max(0, 100 - issues.length * 25),
    issues,
  };
}`,
      solutionExplanation:
        "Rigorous code reviews prevent security breaches, regression defects, and technical debt from reaching production.",
      requirements: [
        { id: "req-r07-01", label: "Detects security and test coverage issues", type: "function" },
        { id: "req-r07-02", label: "Computes PR approval status and quality score", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 08: The Refactoring Forge
  // ----------------------------------------------------
  {
    id: "realm-08",
    world: "developer-realm",
    number: "08",
    title: "The Refactoring Forge",
    subtitle: "Clean Code & Behavior-Preserving Refactoring",
    description:
      "Refactoring is improving code design and readability without altering external observable behavior. Transform tangled spaghetti code into clean, modular, maintainable pure functions.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "code-quality",
    skillPercent: 45,
    content: [
      {
        type: "heading",
        text: "The Principles of Clean Refactoring",
      },
      {
        type: "paragraph",
        text: "Clean code follows:\n- Single Responsibility Principle (SRP): Each function does one thing well\n- Meaningful naming instead of cryptic abbreviations (`roster` vs `r`)\n- Pure functions without unwanted global side-effects\n- Early guard returns instead of deeply nested if-else ladders",
      },
      {
        type: "tip",
        text: "Always run comprehensive automated tests before and after refactoring to prove that external behavior was strictly preserved.",
      },
    ],
    challenge: {
      id: "challenge-r08",
      lessonId: "realm-08",
      title: "The Refactoring Forge: Roster Normalizer",
      prompt:
        "Refactor `normalizeAdventurerRoster(rawMembers)` to produce clean, immutable output:\n- Filter out members where `status !== 'active'`\n- Normalize names: trim whitespace and capitalize first letter (`'  aria ' -> 'Aria'`)\n- Ensure `level` is at least 1 (default to 1 if missing or < 1)\n- Calculate `powerScore`: `level * 10 + (role === 'Mage' ? 25 : 15)`\n- Return `{ activeCount: number, roster: Array<{ name, role, level, powerScore }>, totalPower: sum of powerScores }`.",
      starterCode: `function normalizeAdventurerRoster(rawMembers) {
  // Refactor into clean, pure pipeline:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "normalizeAdventurerRoster",
          args: [
            [
              { name: "  aria ", role: "Mage", level: 5, status: "active" },
              { name: "thorin", role: "Warrior", level: 0, status: "active" },
              { name: "malakor", role: "Rogue", level: 9, status: "banned" },
            ],
          ],
          expected: {
            activeCount: 2,
            roster: [
              { name: "Aria", role: "Mage", level: 5, powerScore: 75 },
              { name: "Thorin", role: "Warrior", level: 1, powerScore: 25 },
            ],
            totalPower: 100,
          },
        },
      ],
      hints: [
        "Filter for `m.status === 'active'`.",
        "Format name with `trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()`.",
        "Enforce `Math.max(1, Number(m.level) || 1)`.",
        "Sum `totalPower` with `reduce()`.",
      ],
      solution: `function normalizeAdventurerRoster(rawMembers) {
  const activeList = (rawMembers || []).filter((m) => m && m.status === "active");

  const roster = activeList.map((m) => {
    const rawName = (m.name || "").trim();
    const name = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase() : "Hero";
    const level = Math.max(1, Number(m.level) || 1);
    const roleBonus = m.role === "Mage" ? 25 : 15;
    const powerScore = level * 10 + roleBonus;

    return {
      name,
      role: m.role || "Adventurer",
      level,
      powerScore,
    };
  });

  const totalPower = roster.reduce((sum, hero) => sum + hero.powerScore, 0);

  return {
    activeCount: roster.length,
    roster,
    totalPower,
  };
}`,
      solutionExplanation:
        "Refactoring transforms messy input sanitization into an expressive, testable data transformation pipeline.",
      requirements: [
        { id: "req-r08-01", label: "Normalizes strings, levels, and roles cleanly", type: "function" },
        { id: "req-r08-02", label: "Calculates power metrics with pure aggregation", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 09: The Testing Chamber
  // ----------------------------------------------------
  {
    id: "realm-09",
    world: "developer-realm",
    number: "09",
    title: "The Testing Chamber",
    subtitle: "Unit Testing, Assertions & Boundary Coverage",
    description:
      "Automated testing provides the safety net that allows engineering teams to ship features rapidly without fear. Master unit testing, assertion writing, and boundary value coverage.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "software-testing",
    skillPercent: 50,
    content: [
      {
        type: "heading",
        text: "Unit Testing & Test-Driven Development (TDD)",
      },
      {
        type: "paragraph",
        text: "A complete test suite tests:\n- **Happy Path**: Expected standard inputs produce expected outputs\n- **Boundary Conditions**: Zero, null, empty arrays, extreme maximums\n- **Error & Exception Paths**: Invalid inputs throw or return structured error envelopes",
      },
      {
        type: "code",
        code: `// Structure of an automated test:
// Arrange: prepare mock state & parameters
// Act:     invoke the function under test
// Assert:  verify the output matches expectations strictly`,
      },
      {
        type: "tip",
        text: "Testing edge cases (e.g. level 0, empty rosters, negative XP) is where 80% of real-world bugs are discovered.",
      },
    ],
    challenge: {
      id: "challenge-r09",
      lessonId: "realm-09",
      title: "The Testing Chamber: Quest Reward Engine",
      prompt:
        "Implement `calculateQuestReward(quest, hero)` and ensure it handles boundary conditions flawlessly:\n- Base XP: `quest.baseXp`\n- If `hero.level < quest.minLevel`: return `{ eligible: false, xp: 0, reason: 'Level requirement not met' }`\n- If `hero.isFainted`: return `{ eligible: false, xp: 0, reason: 'Hero is fainted' }`\n- Multipliers: if `quest.difficulty === 'epic'`, 2x XP; if `quest.difficulty === 'legendary'`, 3x XP; otherwise 1x\n- Bonus Gold: `Math.floor(finalXp * 0.5)`\n- Return `{ eligible: true, xp: finalXp, gold: bonusGold, questTitle: quest.title }`.",
      starterCode: `function calculateQuestReward(quest, hero) {
  // Implement reward calculation with boundary guards:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "calculateQuestReward",
          args: [
            { title: "Dragon Slaying", baseXp: 500, minLevel: 10, difficulty: "legendary" },
            { name: "Lyra", level: 12, isFainted: false },
          ],
          expected: {
            eligible: true,
            xp: 1500,
            gold: 750,
            questTitle: "Dragon Slaying",
          },
        },
        {
          type: "function",
          functionName: "calculateQuestReward",
          args: [
            { title: "Cave Patrol", baseXp: 100, minLevel: 5, difficulty: "normal" },
            { name: "Novice", level: 2, isFainted: false },
          ],
          expected: {
            eligible: false,
            xp: 0,
            reason: "Level requirement not met",
          },
        },
      ],
      hints: [
        "Check `hero.isFainted` first and return `{ eligible: false, xp: 0, reason: 'Hero is fainted' }`.",
        "Check `hero.level < quest.minLevel` and return `{ eligible: false, xp: 0, reason: 'Level requirement not met' }`.",
        "Calculate multiplier based on difficulty: legendary=3, epic=2, default=1.",
      ],
      solution: `function calculateQuestReward(quest, hero) {
  if (hero.isFainted) {
    return { eligible: false, xp: 0, reason: "Hero is fainted" };
  }

  if ((hero.level || 0) < (quest.minLevel || 0)) {
    return { eligible: false, xp: 0, reason: "Level requirement not met" };
  }

  let multiplier = 1;
  if (quest.difficulty === "legendary") multiplier = 3;
  else if (quest.difficulty === "epic") multiplier = 2;

  const finalXp = (quest.baseXp || 0) * multiplier;
  const gold = Math.floor(finalXp * 0.5);

  return {
    eligible: true,
    xp: finalXp,
    gold,
    questTitle: quest.title,
  };
}`,
      solutionExplanation:
        "Comprehensive guard checks and boundary tests ensure calculation safety under all operational scenarios.",
      requirements: [
        { id: "req-r09-01", label: "Evaluates qualification criteria and failure states", type: "function" },
        { id: "req-r09-02", label: "Applies difficulty multipliers and gold calculations", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 10: The Security Watchtower
  // ----------------------------------------------------
  {
    id: "realm-10",
    world: "developer-realm",
    number: "10",
    title: "The Security Watchtower",
    subtitle: "Input Sanitization, Injection Defense & Least Privilege",
    description:
      "Security is foundational to every software system. Learn to defend against injection attacks, sanitize user inputs, enforce role-based access control, and apply the principle of least privilege.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "application-security",
    skillPercent: 55,
    content: [
      {
        type: "heading",
        text: "Core Application Security Principles",
      },
      {
        type: "paragraph",
        text: "1. **Never Trust User Input**: Validate all payload fields against strict types and bounds.\n2. **Sanitize Output**: Strip `<script>` tags and HTML entities to prevent XSS.\n3. **Principle of Least Privilege**: Grant users and services only the minimum permissions necessary.\n4. **Authentication vs Authorization**: Authentication verifies *who* you are; Authorization verifies *what* you can do.",
      },
      {
        type: "tip",
        text: "Never interpolate raw user strings directly into SQL queries or HTML renderers. Always parameterize queries and escape HTML.",
      },
    ],
    challenge: {
      id: "challenge-r10",
      lessonId: "realm-10",
      title: "The Security Watchtower: Input Sanitizer & Permission Guard",
      prompt:
        "Implement `secureInputProcessor(user, inputPayload)`:\n1. Check authorization: if `!user || !user.role`, return `{ secure: false, error: 'Unauthorized: missing credentials' }`.\n2. Role check: if `inputPayload.action === 'ADMIN_RESET'` and `user.role !== 'admin'`, return `{ secure: false, error: 'Forbidden: insufficient permissions' }`.\n3. Sanitize text fields: strip any `<script>...</script>` or `DROP TABLE` patterns from string values.\n4. Return `{ secure: true, sanitized: cleanedPayload, processedBy: user.username }`.",
      starterCode: `function secureInputProcessor(user, inputPayload) {
  // Authorize user and sanitize dangerous payload patterns:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "secureInputProcessor",
          args: [
            { username: "galahad", role: "player" },
            { title: "Hero Bio", content: "Hello <script>alert(1)</script>World; DROP TABLE users;" },
          ],
          expected: {
            secure: true,
            sanitized: { title: "Hero Bio", content: "Hello World;" },
            processedBy: "galahad",
          },
        },
        {
          type: "function",
          functionName: "secureInputProcessor",
          args: [
            { username: "stranger", role: "guest" },
            { action: "ADMIN_RESET" },
          ],
          expected: {
            secure: false,
            error: "Forbidden: insufficient permissions",
          },
        },
      ],
      hints: [
        "Check user authentication and role authorization.",
        "Sanitize strings with `.replace(/<script[\\s\\S]*?<\\/script>/gi, '').replace(/DROP TABLE [^;]+;/gi, '').trim()`.",
        "Return the sanitized object with `processedBy: user.username`.",
      ],
      solution: `function secureInputProcessor(user, inputPayload) {
  if (!user || !user.role) {
    return { secure: false, error: "Unauthorized: missing credentials" };
  }

  if (inputPayload && inputPayload.action === "ADMIN_RESET" && user.role !== "admin") {
    return { secure: false, error: "Forbidden: insufficient permissions" };
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(inputPayload || {})) {
    if (typeof value === "string") {
      let cleaned = value
        .replace(/<script[\\s\\S]*?<\\/script>/gi, "")
        .replace(/DROP TABLE [^;]+;/gi, "")
        .replace(/\\s+/g, " ")
        .trim();
      sanitized[key] = cleaned;
    } else {
      sanitized[key] = value;
    }
  }

  return {
    secure: true,
    sanitized,
    processedBy: user.username,
  };
}`,
      solutionExplanation:
        "Input sanitization combined with strict role-based authorization prevents dangerous injection and privilege escalation attacks.",
      requirements: [
        { id: "req-r10-01", label: "Enforces role-based authorization rules", type: "function" },
        { id: "req-r10-02", label: "Neutralizes XSS and SQL injection payloads", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 11: The Environment Vault
  // ----------------------------------------------------
  {
    id: "realm-11",
    world: "developer-realm",
    number: "11",
    title: "The Environment Vault",
    subtitle: "Configuration Management & Secret Isolation",
    description:
      "Understand how production systems manage configuration across Development, Staging, and Production environments. Learn why secrets must never be committed to source control and how `.env` files work.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "application-security",
    skillPercent: 60,
    content: [
      {
        type: "heading",
        text: "The Twelve-Factor App: Config in the Environment",
      },
      {
        type: "paragraph",
        text: "An application's code should be identical across environments, while configuration (ports, database URIs, API keys) is injected via environment variables (`process.env`).",
      },
      {
        type: "code",
        code: `// .env.example (Committed to Git - template only)
PORT=3000
DB_HOST=localhost
JWT_SECRET=your_jwt_secret_here

// .env (NEVER COMMITTED - added to .gitignore)
PORT=8080
DB_HOST=prod-cluster.citadel.internal
JWT_SECRET=7f8a9b0c1d2e3f4a5b6c7d8e9f0a`,
      },
      {
        type: "tip",
        text: "Never commit real private keys or passwords to version control. If a secret is accidentally committed, it must be revoked and rotated immediately.",
      },
    ],
    challenge: {
      id: "challenge-r11",
      lessonId: "realm-11",
      title: "The Environment Vault: Environment Config Parser",
      prompt:
        "Implement `parseEnvironmentConfig(envString, requiredKeys, environment)`:\n1. Parse key-value lines (`KEY=VALUE`) into an object.\n2. Check for missing keys from `requiredKeys`: if missing, return `{ valid: false, missingKeys: string[] }`.\n3. In production (`environment === 'production'`), if any key containing `'SECRET'` or `'KEY'` equals default values (`'default_secret'`, `'123456'`, or `'changeme'`), return `{ valid: false, error: 'Insecure default secret in production environment' }`.\n4. Return `{ valid: true, config: parsedObject, environment }`.",
      starterCode: `function parseEnvironmentConfig(envString, requiredKeys, environment) {
  // Parse .env configuration and enforce production security constraints:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "parseEnvironmentConfig",
          args: [
            `PORT=8080\nDB_HOST=citadel-db\nAPI_SECRET=super_secure_vault_token_99`,
            ["PORT", "DB_HOST", "API_SECRET"],
            "production",
          ],
          expected: {
            valid: true,
            config: {
              PORT: "8080",
              DB_HOST: "citadel-db",
              API_SECRET: "super_secure_vault_token_99",
            },
            environment: "production",
          },
        },
        {
          type: "function",
          functionName: "parseEnvironmentConfig",
          args: [
            `PORT=3000\nAPI_SECRET=changeme`,
            ["PORT", "API_SECRET"],
            "production",
          ],
          expected: {
            valid: false,
            error: "Insecure default secret in production environment",
          },
        },
      ],
      hints: [
        "Split `envString` by newlines and parse `KEY=VALUE` pairs.",
        "Check that all `requiredKeys` are present.",
        "Check for weak default secrets in production mode.",
      ],
      solution: `function parseEnvironmentConfig(envString, requiredKeys, environment) {
  const config = {};
  const lines = (envString || "").split("\\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      config[key] = val;
    }
  }

  const missingKeys = (requiredKeys || []).filter((k) => config[k] === undefined);
  if (missingKeys.length > 0) {
    return { valid: false, missingKeys };
  }

  if (environment === "production") {
    const insecureDefaults = ["default_secret", "123456", "changeme", "your_secret_here"];
    for (const [k, v] of Object.entries(config)) {
      if ((k.includes("SECRET") || k.includes("KEY")) && insecureDefaults.includes(v.toLowerCase())) {
        return { valid: false, error: "Insecure default secret in production environment" };
      }
    }
  }

  return {
    valid: true,
    config,
    environment,
  };
}`,
      solutionExplanation:
        "Environment-based configuration ensures seamless multi-stage deployments and keeps sensitive credentials out of version control.",
      requirements: [
        { id: "req-r11-01", label: "Parses dot-env key-value variables", type: "function" },
        { id: "req-r11-02", label: "Rejects insecure defaults in production deployments", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 12: The Architecture Map
  // ----------------------------------------------------
  {
    id: "realm-12",
    world: "developer-realm",
    number: "12",
    title: "The Architecture Map",
    subtitle: "Layered Architecture & Separation of Concerns",
    description:
      "Explore software architecture patterns. Understand the Layered Architecture pattern (Presentation -> Controller -> Service/Domain -> Data Access) and why business logic must be isolated from transport protocols.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "software-architecture",
    skillPercent: 65,
    content: [
      {
        type: "heading",
        text: "Layered Architecture (N-Tier Pattern)",
      },
      {
        type: "paragraph",
        text: "In professional architectures, responsibilities are cleanly decoupled:\n- **Controllers**: Handle HTTP routing, status codes, and request parsing\n- **Services**: Contain pure business logic and validation rules\n- **Repositories / Models**: Manage database queries and persistence",
      },
      {
        type: "code",
        code: `// The Clean Data Flow:
// HTTP Request
//   ↓ Controller  (parse req.params & validate inputs)
//   ↓ Service     (execute game business rules)
//   ↓ Repository  (save to Database)
// HTTP Response`,
      },
      {
        type: "tip",
        text: "Controllers should be 'thin' — they only translate between HTTP and domain services. Never embed database queries directly into route controllers.",
      },
    ],
    challenge: {
      id: "challenge-r12",
      lessonId: "realm-12",
      title: "The Architecture Map: Decoupled Service Layer",
      prompt:
        "Implement a layered service `createAdventurerService(db)` that separates domain logic from data access:\n- `createAdventurer(data)`: validates required `name` and `role`. If valid, calls `db.insert('adventurers', { ...data, level: 1, active: true })` and returns `{ success: true, hero: insertedDoc }`. If invalid, returns `{ success: false, error: 'Name and role required' }`.\n- `promoteAdventurer(id)`: finds hero via `db.findById('adventurers', id)`. If not found, returns `{ success: false, error: 'Hero not found' }`. If found, increments `level` by 1 via `db.update('adventurers', id, { level: hero.level + 1 })` and returns `{ success: true, hero: updatedDoc }`.",
      starterCode: `function createAdventurerService(db) {
  // Return service with decoupled business logic methods:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "createAdventurerService",
          args: [null],
          expected: {
            hasCreateMethod: true,
            hasPromoteMethod: true,
          },
        },
      ],
      hints: [
        "Instantiate `const mockDb = db || (typeof createMockDb === 'function' ? createMockDb({ adventurers: [] }) : null)`.",
        "Implement `createAdventurer(data)` with input validation and `mockDb.insert`.",
        "Implement `promoteAdventurer(id)` with `mockDb.findById` and `mockDb.update`.",
      ],
      solution: `function createAdventurerService(db) {
  const database = db || createMockDb({ adventurers: [] });

  return {
    hasCreateMethod: true,
    hasPromoteMethod: true,
    createAdventurer(data) {
      if (!data || !data.name || !data.role) {
        return { success: false, error: "Name and role required" };
      }
      const hero = database.insert("adventurers", {
        name: data.name.trim(),
        role: data.role,
        level: 1,
        active: true,
      });
      return { success: true, hero };
    },
    promoteAdventurer(id) {
      const hero = database.findById("adventurers", id);
      if (!hero) {
        return { success: false, error: "Hero not found" };
      }
      const updated = database.update("adventurers", id, { level: (hero.level || 1) + 1 });
      return { success: true, hero: updated };
    },
  };
}`,
      solutionExplanation:
        "Decoupled service layers ensure that domain business logic can be tested independently of HTTP transport frameworks or database drivers.",
      requirements: [
        { id: "req-r12-01", label: "Isolates business validation in service layer", type: "function" },
        { id: "req-r12-02", label: "Coordinates database persistence through abstractions", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 13: The Project Planner
  // ----------------------------------------------------
  {
    id: "realm-13",
    world: "developer-realm",
    number: "13",
    title: "The Project Planner",
    subtitle: "Feature Planning, User Stories & Sprint Estimation",
    description:
      "Learn how engineering leaders decompose high-level product epics into agile sprints, estimate story points, establish API contracts, and define acceptance criteria.",
    xp: 250,
    difficulty: "Advanced",
    estimatedTime: 12,
    skill: "software-architecture",
    skillPercent: 70,
    content: [
      {
        type: "heading",
        text: "Agile Feature Decomposition",
      },
      {
        type: "paragraph",
        text: "Building large systems requires breaking big epics into small, estimable stories:\n1. **User Stories**: 'As a [user], I want [capability] so that [benefit]'\n2. **Acceptance Criteria**: Clear, testable conditions for completion\n3. **API Contracts**: Defined request/response JSON schemas before coding begins\n4. **Story Points**: Relative effort estimation (Fibonacci: 1, 2, 3, 5, 8)",
      },
      {
        type: "tip",
        text: "If a user story is estimated at 8+ points, it is usually too large and should be split into multiple smaller deliverables.",
      },
    ],
    challenge: {
      id: "challenge-r13",
      lessonId: "realm-13",
      title: "The Project Planner: Sprint Milestone Generator",
      prompt:
        "Implement `planSprintMilestones(epic)`:\n- `epicName`: `epic.name`\n- `milestones`: an array of sprint milestones `{ sprint: number, title: string, points: number, deliverable: string }` decomposed from `epic.features` (assign 3 points per feature, max 6 points per sprint)\n- `totalPoints`: sum of all milestone points\n- `estimatedSprints`: `Math.ceil(totalPoints / 6)`\n- Return `{ epicName, totalPoints, estimatedSprints, milestones }`.",
      starterCode: `function planSprintMilestones(epic) {
  // Decompose epic features into sequenced sprint milestones:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "planSprintMilestones",
          args: [
            {
              name: "Guild Alliance System",
              features: [
                "Guild Creation & Emblem Picker",
                "Guild Member Invitations",
                "Guild Chat WebSockets",
                "Alliance War Board",
              ],
            },
          ],
          expected: {
            epicName: "Guild Alliance System",
            totalPoints: 12,
            estimatedSprints: 2,
            milestones: [
              { sprint: 1, title: "Sprint 1", points: 6, deliverable: "Guild Creation & Emblem Picker + Guild Member Invitations" },
              { sprint: 2, title: "Sprint 2", points: 6, deliverable: "Guild Chat WebSockets + Alliance War Board" },
            ],
          },
        },
      ],
      hints: [
        "Calculate `totalPoints = epic.features.length * 3`.",
        "Chunk features into pairs of 2 per sprint (6 points per sprint).",
        "Construct sprint milestone objects and return the planned schedule.",
      ],
      solution: `function planSprintMilestones(epic) {
  const features = epic.features || [];
  const milestones = [];
  const pointsPerFeature = 3;
  const maxPointsPerSprint = 6;
  const featuresPerSprint = 2;

  let sprintNum = 1;
  for (let i = 0; i < features.length; i += featuresPerSprint) {
    const chunk = features.slice(i, i + featuresPerSprint);
    milestones.push({
      sprint: sprintNum,
      title: \`Sprint \${sprintNum}\`,
      points: chunk.length * pointsPerFeature,
      deliverable: chunk.join(" + "),
    });
    sprintNum++;
  }

  const totalPoints = features.length * pointsPerFeature;

  return {
    epicName: epic.name,
    totalPoints,
    estimatedSprints: Math.ceil(totalPoints / maxPointsPerSprint),
    milestones,
  };
}`,
      solutionExplanation:
        "Systematic project planning and milestone decomposition create predictable velocity and sustainable engineering delivery.",
      requirements: [
        { id: "req-r13-01", label: "Decomposes product epics into manageable milestones", type: "function" },
        { id: "req-r13-02", label: "Calculates story points and sprint allocations", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 14: The Developer Workshop
  // ----------------------------------------------------
  {
    id: "realm-14",
    world: "developer-realm",
    number: "14",
    title: "The Developer Workshop",
    subtitle: "Full-Stack Feature Integration",
    description:
      "Integrate everything you've learned into a complete full-stack feature. Implement an Express route, connect database persistence, apply validation rules, and return standardized JSON responses.",
    xp: 300,
    difficulty: "Advanced",
    estimatedTime: 15,
    skill: "fullstack-engineering",
    skillPercent: 80,
    content: [
      {
        type: "heading",
        text: "Building End-to-End Backend Features",
      },
      {
        type: "paragraph",
        text: "A complete feature integrates:\n1. Route definition (`POST /api/bounties`)\n2. Input validation & error responses (400)\n3. Database persistence & ID generation\n4. Standardized response formatting (201 Created)",
      },
      {
        type: "tip",
        text: "Always return appropriate HTTP status codes: 201 for resource creation, 400 for bad payloads, 404 for missing resources, and 200 for successful queries.",
      },
    ],
    challenge: {
      id: "challenge-r14",
      lessonId: "realm-14",
      title: "The Developer Workshop: Guild Bounty API",
      prompt:
        "Implement `setupGuildBountyFeature(app, db)`:\n1. `POST /bounties`: Validate `req.body.title` (string, length >= 3) and `req.body.reward` (number > 0). If invalid, return status 400 with `{ success: false, error: 'Invalid bounty specification' }`. If valid, insert into `db.insert('bounties', { title, reward, claimed: false })` and respond with status 201 and `{ success: true, bounty: createdDoc }`.\n2. `GET /bounties/:id`: Find bounty via `db.findById('bounties', req.params.id)`. If missing, return status 404 with `{ success: false, error: 'Bounty not found' }`. If found, return status 200 with `{ success: true, bounty }`.\nReturn `{ ready: true }`.",
      starterCode: `function setupGuildBountyFeature(app, db) {
  // Register POST /bounties and GET /bounties/:id on the app:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "setupGuildBountyFeature",
          args: [null, null],
          expected: {
            ready: true,
          },
        },
      ],
      hints: [
        "Instantiate `const server = app || createMockApp(db || createMockDb({ bounties: [] }))`.",
        "Add `server.post('/bounties', (req, res) => ...)` with validation and status 201.",
        "Add `server.get('/bounties/:id', (req, res) => ...)` with `db.findById` and status 200 / 404.",
      ],
      solution: `function setupGuildBountyFeature(app, db) {
  const database = db || createMockDb({ bounties: [] });
  const server = app || createMockApp(database);

  server.post("/bounties", (req, res) => {
    const { title, reward } = req.body || {};
    if (!title || typeof title !== "string" || title.trim().length < 3 || typeof reward !== "number" || reward <= 0) {
      return res.status(400).json({ success: false, error: "Invalid bounty specification" });
    }
    const bounty = database.insert("bounties", {
      title: title.trim(),
      reward,
      claimed: false,
    });
    res.status(201).json({ success: true, bounty });
  });

  server.get("/bounties/:id", (req, res) => {
    const bounty = database.findById("bounties", req.params.id);
    if (!bounty) {
      return res.status(404).json({ success: false, error: "Bounty not found" });
    }
    res.status(200).json({ success: true, bounty });
  });

  return { ready: true };
}`,
      solutionExplanation:
        "The Developer Workshop connects routing, validation, persistence, and status code standards into a robust API module.",
      requirements: [
        { id: "req-r14-01", label: "Implements validated POST creation route", type: "function" },
        { id: "req-r14-02", label: "Implements parameterized GET retrieval with 404 handling", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 15: THE FINAL PROJECT
  // ----------------------------------------------------
  {
    id: "realm-15",
    world: "developer-realm",
    number: "15",
    title: "The Final Project",
    subtitle: "CodeQuest Adventurer Hub Capstone",
    description:
      "The major capstone project synthesizing all 6 worlds. Construct the complete backend service powering the CodeQuest Adventurer Hub: multi-criteria search, aggregation metrics, CRUD lifecycles, and error resilience.",
    xp: 400,
    difficulty: "Expert",
    estimatedTime: 20,
    skill: "fullstack-engineering",
    skillPercent: 90,
    content: [
      {
        type: "heading",
        text: "Capstone: CodeQuest Adventurer Hub Service",
      },
      {
        type: "paragraph",
        text: "This capstone combines JavaScript logic, algorithms, API design, backend routing, database queries, validation, and error boundaries into a unified service.",
      },
      {
        type: "tip",
        text: "Ensure queries support filtering by role, sorting by level, and aggregation metrics without mutating the underlying database state.",
      },
    ],
    challenge: {
      id: "challenge-r15",
      lessonId: "realm-15",
      title: "The Final Project: CodeQuest Adventurer Hub",
      prompt:
        "Implement `createAdventurerHub(db)` returning an integrated backend manager:\n- `listAdventurers({ role, minLevel, sortBy })`: filters database `'adventurers'` by role (if provided) and level >= minLevel (if provided), sorts by level descending if `sortBy === 'level_desc'`, and returns matching array\n- `registerAdventurer(payload)`: validates `name` (string, len >= 2) and `role` (one of `'Warrior' | 'Mage' | 'Rogue' | 'Cleric'`). Inserts with `level: 1, xp: 0, status: 'ready'` and returns `{ success: true, hero }`. On failure, returns `{ success: false, error: string }`\n- `getHubMetrics()`: returns `{ totalHeroes: count, averageLevel: rounded avg, topRole: most frequent role }`\n- `decommissionHero(id)`: deletes hero by ID, returning `{ success: boolean }`.",
      starterCode: `function createAdventurerHub(db) {
  // Implement complete Adventurer Hub Capstone Manager:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "createAdventurerHub",
          args: [null],
          expected: {
            hasHubService: true,
          },
        },
      ],
      hints: [
        "Initialize database with `const database = db || createMockDb({ adventurers: [] })`.",
        "Implement `listAdventurers` with filtering and sorting.",
        "Implement `registerAdventurer` with role and name validation.",
        "Implement `getHubMetrics` using array reduce/map aggregations.",
      ],
      solution: `function createAdventurerHub(db) {
  const database = db || createMockDb({
    adventurers: [
      { id: "adv-1", name: "Aria", role: "Mage", level: 8, xp: 4500, status: "ready" },
      { id: "adv-2", name: "Thorin", role: "Warrior", level: 12, xp: 9200, status: "ready" },
      { id: "adv-3", name: "Lyra", role: "Rogue", level: 6, xp: 2800, status: "ready" },
    ],
  });

  return {
    hasHubService: true,
    listAdventurers(filter = {}) {
      let results = database.find("adventurers");
      if (filter.role) {
        results = results.filter((h) => h.role === filter.role);
      }
      if (typeof filter.minLevel === "number") {
        results = results.filter((h) => (h.level || 0) >= filter.minLevel);
      }
      if (filter.sortBy === "level_desc") {
        results.sort((a, b) => (b.level || 0) - (a.level || 0));
      }
      return results;
    },
    registerAdventurer(payload) {
      if (!payload || typeof payload.name !== "string" || payload.name.trim().length < 2) {
        return { success: false, error: "Invalid adventurer name" };
      }
      const allowedRoles = ["Warrior", "Mage", "Rogue", "Cleric"];
      if (!allowedRoles.includes(payload.role)) {
        return { success: false, error: "Invalid adventurer role" };
      }
      const hero = database.insert("adventurers", {
        name: payload.name.trim(),
        role: payload.role,
        level: 1,
        xp: 0,
        status: "ready",
      });
      return { success: true, hero };
    },
    getHubMetrics() {
      const heroes = database.find("adventurers");
      if (heroes.length === 0) {
        return { totalHeroes: 0, averageLevel: 0, topRole: "None" };
      }
      const totalLevel = heroes.reduce((sum, h) => sum + (h.level || 1), 0);
      const roleCounts = {};
      heroes.forEach((h) => {
        roleCounts[h.role] = (roleCounts[h.role] || 0) + 1;
      });
      let topRole = "Warrior";
      let maxCount = -1;
      for (const [r, count] of Object.entries(roleCounts)) {
        if (count > maxCount) {
          maxCount = count;
          topRole = r;
        }
      }
      return {
        totalHeroes: heroes.length,
        averageLevel: Math.round((totalLevel / heroes.length) * 10) / 10,
        topRole,
      };
    },
    decommissionHero(id) {
      const deleted = database.delete("adventurers", id);
      return { success: deleted };
    },
  };
}`,
      solutionExplanation:
        "The Adventurer Hub Capstone integrates filtering algorithms, validation guards, metric reducers, and database CRUD into a complete software architecture.",
      requirements: [
        { id: "req-r15-01", label: "Implements multi-property search and sorting", type: "function" },
        { id: "req-r15-02", label: "Calculates aggregate squad analytics and manages lifecycle", type: "function" },
      ],
    },
  },

  // ----------------------------------------------------
  // Mission 16: THE DEVELOPER GUARDIAN (FINAL BOSS)
  // ----------------------------------------------------
  {
    id: "realm-16",
    world: "developer-realm",
    number: "16",
    type: "boss",
    title: "THE DEVELOPER GUARDIAN",
    subtitle: "The Ultimate Final Boss of CodeQuest",
    description:
      "A corrupted production system threatens the entire CodeQuest realm. Step forward as a Full-Stack Software Developer to diagnose, repair, and deploy the Master Production Backend.",
    xp: 1000,
    difficulty: "Expert",
    estimatedTime: 25,
    skill: "fullstack-engineering",
    skillPercent: 100,
    content: [
      {
        type: "heading",
        text: "The Final Challenge: Production System Restoration",
      },
      {
        type: "paragraph",
        text: "The Developer Guardian tests everything you have learned across all 6 worlds:\n- Phase 1: Fix the `/health` diagnostic probe\n- Phase 2: Secure routes with Bearer Token authentication middleware\n- Phase 3: Repair REST routes (`GET /api/heroes`, `POST /api/heroes`)\n- Phase 4: Enforce strict input validation & role authorization\n- Phase 5: Implement centralized 500 error boundary handling",
      },
      {
        type: "tip",
        text: "Verify status codes, middleware chaining via `next()`, parameter matching, and database updates to pass all independent verification suites.",
      },
    ],
    challenge: {
      id: "challenge-r16",
      lessonId: "realm-16",
      title: "The Developer Guardian: Master Production Server Restoration",
      prompt:
        "Rebuild and secure the corrupted production server `repairMasterProductionServer(app, db)`:\n1. Add `GET /health` responding with `{ status: 'healthy', version: '2.0.0' }`\n2. Add Bearer Auth Middleware on `/api/*`: check `req.headers.authorization === 'Bearer grandmaster-token-99'`. If missing/invalid, return status 401 with `{ success: false, error: 'Unauthorized' }`\n3. Add `GET /api/heroes`: return status 200 with `{ success: true, heroes: db.find('heroes') }`\n4. Add `POST /api/heroes`: validate `req.body.name` (string len >= 2) and `req.body.power` (number > 0). If invalid, return status 400 with `{ success: false, error: 'Invalid hero data' }`. If valid, insert into database and return status 201 with `{ success: true, hero }`\n5. Add Centralized Error Boundary Middleware `(err, req, res, next)` returning status 500 with `{ success: false, error: err.message || 'Internal Error' }`.\nReturn `{ isGrandmasterServer: true }`.",
      starterCode: `function repairMasterProductionServer(app, db) {
  // Repair the corrupted production server across all architectural layers:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "repairMasterProductionServer",
          args: [null, null],
          expected: {
            isGrandmasterServer: true,
          },
        },
      ],
      hints: [
        "Instantiate server with `const database = db || createMockDb({ heroes: [] }); const server = app || createMockApp(database);`.",
        "Add `server.get('/health', ...)` returning `{ status: 'healthy', version: '2.0.0' }`.",
        "Add auth middleware using `server.use('/api', (req, res, next) => ...)`.",
        "Add routes for `GET /api/heroes` and `POST /api/heroes`.",
        "Add error boundary middleware `server.use((err, req, res, next) => ...)`.",
      ],
      solution: `function repairMasterProductionServer(app, db) {
  const database = db || createMockDb({
    heroes: [
      { id: "hero-01", name: "Grandmaster Ada", power: 999, rank: "Archmage" },
    ],
  });
  const server = app || createMockApp(database);

  // 1. Health Probe
  server.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", version: "2.0.0" });
  });

  // 2. Authentication Boundary
  server.use("/api", (req, res, next) => {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || auth !== "Bearer grandmaster-token-99") {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    next();
  });

  // 3. Resource Endpoints
  server.get("/api/heroes", (req, res) => {
    const heroes = database.find("heroes");
    res.status(200).json({ success: true, heroes });
  });

  server.post("/api/heroes", (req, res) => {
    const { name, power } = req.body || {};
    if (!name || typeof name !== "string" || name.trim().length < 2 || typeof power !== "number" || power <= 0) {
      return res.status(400).json({ success: false, error: "Invalid hero data" });
    }
    const hero = database.insert("heroes", {
      name: name.trim(),
      power,
      created: new Date().toISOString(),
    });
    res.status(201).json({ success: true, hero });
  });

  // 4. Centralized Error Boundary
  server.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.message || "Internal Error" });
  });

  return { isGrandmasterServer: true };
}`,
      solutionExplanation:
        "The Developer Guardian Master Server encapsulates the culmination of full-stack engineering: diagnostics, authentication boundaries, RESTful controllers, data validation, and resilient error recovery.",
      requirements: [
        { id: "req-r16-01", label: "Defeats the Developer Guardian by repairing all production backend layers", type: "function" },
      ],
    },
  },
];

/** Get Developer Realm lesson by ID */
export function getDeveloperRealmLessonById(lessonId) {
  return developerRealmLessons.find((l) => l.id === lessonId);
}

/** Get next Developer Realm lesson ID */
export function getNextDeveloperRealmLessonId(lessonId) {
  const index = developerRealmLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= developerRealmLessons.length - 1) return null;
  return developerRealmLessons[index + 1].id;
}

/** Get progress percentage for Developer Realm */
export function getDeveloperRealmProgress(progress = {}) {
  const completed = developerRealmLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.min(100, Math.round((completed / developerRealmLessons.length) * 100));
}

/** Check if Developer Realm is fully complete */
export function isDeveloperRealmComplete(progress = {}) {
  return (
    developerRealmLessons.length > 0 &&
    developerRealmLessons.every((l) => (progress.completedLessons || []).includes(l.id))
  );
}
