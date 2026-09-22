/**
 * World 05 — The Backend Citadel
 * Node.js, Express Routing, Middleware, Databases, SQL, Authentication & REST APIs (16 Missions)
 *
 * A progressive, comprehensive backend engineering curriculum:
 * 01. The Citadel Gate: Architecture — Frontend vs Backend vs Database
 * 02. The Server Forge: Node.js Runtime, Server Initialization & Port Binding
 * 03. The Route Keep: Express Routing & Dynamic Route Parameters (/heroes/:id)
 * 04. The Middleware Bridge: The Request Pipeline & next() Chaining
 * 05. The Request Messenger: req.params, req.query, req.body & res.json()
 * 06. The JSON Chamber: Consistent API Envelopes & HTTP Status Codes
 * 07. The CRUD Vault: Connecting HTTP Verbs to In-Memory Database Actions
 * 08. The Database Dungeon: Tables, Primary Keys, Records & DB Operations
 * 09. The SQL Archives: Query Construction (SELECT, WHERE, ORDER BY, LIMIT)
 * 10. The Relational Map: Primary/Foreign Keys & One-to-Many Joins
 * 11. The Authentication Gate: Bearer Token Middleware & 401/403 Security
 * 12. The Error Citadel: Centralized (err, req, res, next) Error Boundaries
 * 13. The Validation Guard: Request Body Sanitization & Input Rejection
 * 14. The API Workshop: Assembling Cohesive Multi-Resource REST APIs
 * 15. The Backend Project: Mini Project — Citadel Management Service
 * 16. THE CITADEL GUARDIAN: Final Boss — Rebuilding the Master Server
 */

import { createMockDb, createMockApp } from "../engine/backendSimulator";

export const backendCitadelLessons = [
  // -------------------------------------------------------------
  // Mission 01: The Citadel Gate
  // -------------------------------------------------------------
  {
    id: "citadel-01",
    worldId: "backend-citadel",
    number: "01",
    title: "The Citadel Gate: Frontend vs Backend vs Database",
    world: "backend-citadel",
    type: "lesson",
    xp: 180,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Understand the three-tier web architecture: Frontend presentation, Backend business logic, and Database persistence.",
    concepts: ["Three-Tier Architecture", "Frontend", "Backend", "Database", "Separation of Concerns"],
    content: [
      {
        type: "paragraph",
        text: "🏰 Welcome to The Backend Citadel! Behind these fortified walls lie the server runtimes and database vaults that power modern software. A robust web system is divided into three distinct tiers.",
      },
      {
        type: "heading",
        text: "The Three-Tier Architecture",
      },
      {
        type: "paragraph",
        text: "1. **Frontend (Client)**: HTML/CSS/React rendering UI in user browsers.\n2. **Backend (Server)**: Node.js/Express enforcing business logic, authentication, and validation.\n3. **Database (Storage)**: Relational or document databases persisting data securely.",
      },
      {
        type: "code",
        code: `// The Three-Tier Request Lifecycle
// [Client Browser] ─── HTTP Request ───▶ [Node.js Backend]
//                                               │
//                                          SQL Query
//                                               ▼
// [Client Browser] ◀── HTTP Response ─── [Database Engine]`,
      },
      {
        type: "tip",
        text: "Never trust the client: all critical validation and security checks must happen on the backend.",
      },
    ],
    challenge: {
      id: "challenge-c01",
      lessonId: "citadel-01",
      title: "The Citadel Gate: Frontend vs Backend vs Database",
      prompt:
        "Implement `classifySystemTask(taskName)` to assign tasks to the correct architectural tier:\n\n- Returns `'frontend'` for: `'render-button'`, `'capture-click'`, `'animate-modal'`, `'display-form'`\n- Returns `'backend'` for: `'validate-token'`, `'hash-password'`, `'route-request'`, `'send-email'`\n- Returns `'database'` for: `'store-user'`, `'query-orders'`, `'backup-tables'`, `'index-records'`\n- Returns `'unknown'` for any other task name.",
      starterCode: `function classifySystemTask(taskName) {
  // Classify task to 'frontend', 'backend', 'database', or 'unknown':
  
}`,
      tests: [
        {
          type: "function",
          functionName: "classifySystemTask",
          args: ["validate-token"],
          expected: "backend",
          message: "Classifies validate-token as backend.",
        },
        {
          type: "function",
          functionName: "classifySystemTask",
          args: ["render-button"],
          expected: "frontend",
          message: "Classifies render-button as frontend.",
        },
        {
          type: "function",
          functionName: "classifySystemTask",
          args: ["query-orders"],
          expected: "database",
          message: "Classifies query-orders as database.",
        },
        {
          type: "function",
          functionName: "classifySystemTask",
          args: ["unrecognized-job"],
          expected: "unknown",
          message: "Returns unknown for unlisted tasks.",
        },
      ],
      hints: [
        "Use arrays of known task strings or a lookup dictionary.",
        "Check frontend tasks (`['render-button', 'capture-click', 'animate-modal', 'display-form']`), backend tasks, and database tasks.",
      ],
      solution: `function classifySystemTask(taskName) {
  const frontendTasks = ["render-button", "capture-click", "animate-modal", "display-form"];
  const backendTasks = ["validate-token", "hash-password", "route-request", "send-email"];
  const databaseTasks = ["store-user", "query-orders", "backup-tables", "index-records"];

  if (frontendTasks.includes(taskName)) return "frontend";
  if (backendTasks.includes(taskName)) return "backend";
  if (databaseTasks.includes(taskName)) return "database";
  return "unknown";
}`,
      solutionExplanation:
        "Separating responsibilities across presentation (frontend), logic/security (backend), and persistence (database) creates reliable architectures.",
      requirements: [
        { id: "req-c01-01", label: "Classifies tasks into frontend, backend, and database tiers", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 02: The Server Forge
  // -------------------------------------------------------------
  {
    id: "citadel-02",
    worldId: "backend-citadel",
    number: "02",
    title: "The Server Forge: Node.js Runtime & Port Binding",
    world: "backend-citadel",
    type: "lesson",
    xp: 190,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Beginner",
    estimatedTime: 7,
    description: "Understand the Node.js server lifecycle: environment variables, port binding, and status telemetry.",
    concepts: ["Node.js Runtime", "Port Binding", "Environment Configuration", "Server Lifecycle"],
    content: [
      {
        type: "paragraph",
        text: "⚙️ At the Server Forge, backend engineers initialize server processes. Node.js executes server-side JavaScript asynchronously, binding to a specific TCP port (e.g. 3000, 8080) to listen for incoming traffic.",
      },
      {
        type: "heading",
        text: "Server Configuration Structure",
      },
      {
        type: "code",
        code: `// Node.js server startup configuration
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

console.log(\`Citadel Server listening on port \${PORT} [\${ENV}]\`);`,
      },
      {
        type: "tip",
        text: "Ports act like numbered dock slips: only one application process can listen on a specific port number at a time.",
      },
    ],
    challenge: {
      id: "challenge-c02",
      lessonId: "citadel-02",
      title: "The Server Forge: Node.js Runtime & Port Binding",
      prompt:
        "Implement `configureServerInstance(options)` to generate a server telemetry configuration object:\n\nInput:\n`{ port?: number, env?: string, serviceName?: string }`\n\nOutput:\n- `serviceName`: `options.serviceName` or `'Citadel-Core'`\n- `port`: `options.port` or `3000`\n- `env`: `options.env` or `'development'`\n- `status`: `'ready'`\n- `listenUrl`: `'http://localhost:' + port`",
      starterCode: `function configureServerInstance(options = {}) {
  // Generate server telemetry configuration:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "configureServerInstance",
          args: [{ port: 8080, env: "production", serviceName: "Citadel-Auth" }],
          expected: {
            serviceName: "Citadel-Auth",
            port: 8080,
            env: "production",
            status: "ready",
            listenUrl: "http://localhost:8080",
          },
          message: "Configures production server with custom port and service name.",
        },
        {
          type: "function",
          functionName: "configureServerInstance",
          args: [{}],
          expected: {
            serviceName: "Citadel-Core",
            port: 3000,
            env: "development",
            status: "ready",
            listenUrl: "http://localhost:3000",
          },
          message: "Applies standard defaults for unprovided options.",
        },
      ],
      hints: [
        "Set `const port = options.port || 3000;`",
        "Set `const env = options.env || 'development';`",
        "Return `{ serviceName, port, env, status: 'ready', listenUrl: 'http://localhost:' + port }`.",
      ],
      solution: `function configureServerInstance(options = {}) {
  const serviceName = options.serviceName || "Citadel-Core";
  const port = options.port || 3000;
  const env = options.env || "development";

  return {
    serviceName,
    port,
    env,
    status: "ready",
    listenUrl: "http://localhost:" + port,
  };
}`,
      solutionExplanation:
        "Server configuration establishes listening ports, execution environments, and startup metadata.",
      requirements: [
        { id: "req-c02-01", label: "Generates server configuration with defaults", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 03: The Route Keep
  // -------------------------------------------------------------
  {
    id: "citadel-03",
    worldId: "backend-citadel",
    number: "03",
    title: "The Route Keep: Express Routing & Dynamic Parameters",
    world: "backend-citadel",
    type: "lesson",
    xp: 200,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Beginner",
    estimatedTime: 7,
    description: "Define Express routes using HTTP verbs (GET, POST, DELETE) and dynamic URL parameters (:id).",
    concepts: ["Express Routing", "app.get", "app.post", "app.delete", "Route Parameters (:id)"],
    content: [
      {
        type: "paragraph",
        text: "🗺️ In the Route Keep, signals are dispatched to their corresponding handler functions. Express routers match incoming HTTP verbs and URL paths to execute handlers.",
      },
      {
        type: "heading",
        text: "Dynamic Route Parameters",
      },
      {
        type: "code",
        code: `// Route collection
app.get("/heroes", (req, res) => {
  res.json({ heroes: ["Aria", "Rowan"] });
});

// Dynamic single resource parameter (:id)
app.get("/heroes/:id", (req, res) => {
  const heroId = req.params.id; // e.g. "hero-42"
  res.json({ id: heroId, name: "Aria" });
});`,
      },
      {
        type: "tip",
        text: "Colons in route paths (like `:id` or `:guild`) define dynamic parameters accessible in `req.params`.",
      },
    ],
    challenge: {
      id: "challenge-c03",
      lessonId: "citadel-03",
      title: "The Route Keep: Express Routing & Dynamic Parameters",
      prompt:
        "Implement `registerHeroRoutes(app)` to configure Express routes on `app`:\n\n1. `GET /heroes`: Respond with `res.json({ heroes: ['Aria', 'Rowan', 'Kaelen'] })`\n2. `GET /heroes/:id`: Respond with `res.json({ id: req.params.id, status: 'active' })`\n3. `DELETE /heroes/:id`: Respond with `res.json({ deleted: true, id: req.params.id })`\n\nReturn `app`.",
      starterCode: `function registerHeroRoutes(app) {
  // Define GET /heroes, GET /heroes/:id, and DELETE /heroes/:id:
  
  return app;
}`,
      tests: [
        {
          type: "function",
          functionName: "registerHeroRoutes",
          args: [null],
          expected: { registered: true },
          message: "Registers collection GET, parameterized GET, and DELETE routes.",
        },
      ],
      hints: [
        "Create app with `const server = app || createMockApp();`",
        "Add `server.get('/heroes', (req, res) => res.json({ heroes: ['Aria', 'Rowan', 'Kaelen'] }));`",
        "Add `server.get('/heroes/:id', (req, res) => res.json({ id: req.params.id, status: 'active' }));`",
        "Add `server.delete('/heroes/:id', (req, res) => res.json({ deleted: true, id: req.params.id }));`",
      ],
      solution: `function registerHeroRoutes(app) {
  const server = app || createMockApp();

  server.get("/heroes", (req, res) => {
    res.json({ heroes: ["Aria", "Rowan", "Kaelen"] });
  });

  server.get("/heroes/:id", (req, res) => {
    res.json({ id: req.params.id, status: "active" });
  });

  server.delete("/heroes/:id", (req, res) => {
    res.json({ deleted: true, id: req.params.id });
  });

  return { registered: true };
}`,
      solutionExplanation:
        "Express routes connect specific HTTP verb and URL patterns to handler functions that process requests and render responses.",
      requirements: [
        { id: "req-c03-01", label: "Defines collection and parameterized routes", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 04: The Middleware Bridge
  // -------------------------------------------------------------
  {
    id: "citadel-04",
    worldId: "backend-citadel",
    number: "04",
    title: "The Middleware Bridge: Pipeline & next() Chaining",
    world: "backend-citadel",
    type: "lesson",
    xp: 210,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Understand the Express middleware pipeline: intercepting requests, mutating context, and calling next().",
    concepts: ["Middleware", "Request Pipeline", "next()", "Request Logging", "Context Mutation"],
    content: [
      {
        type: "paragraph",
        text: "🌉 The Middleware Bridge spans between raw network input and endpoint handlers. Middleware functions have access to `req`, `res`, and the `next` function in the pipeline.",
      },
      {
        type: "heading",
        text: "The Middleware Chain",
      },
      {
        type: "code",
        code: `// Middleware adds received timestamp and passes to next handler
function attachTimestamp(req, res, next) {
  req.receivedAt = Date.now();
  next(); // Pass control to the next middleware/route in pipeline
}`,
      },
      {
        type: "tip",
        text: "Always call `next()` inside middleware unless you are terminating the request early (e.g. returning a 401 response).",
      },
    ],
    challenge: {
      id: "challenge-c04",
      lessonId: "citadel-04",
      title: "The Middleware Bridge: Pipeline & next() Chaining",
      prompt:
        "Implement `createTelemetryMiddleware(serviceName)`:\n\nReturn a middleware function `(req, res, next)` that:\n1. Sets `req.service = serviceName`.\n2. Sets `req.requestId = 'req-' + req.method.toLowerCase() + '-99'`.\n3. Sets response header `'X-Powered-By'` to `serviceName` with `res.setHeader('X-Powered-By', serviceName)`.\n4. Calls `next()`.",
      starterCode: `function createTelemetryMiddleware(serviceName) {
  // Return Express middleware (req, res, next):
  
}`,
      tests: [
        {
          type: "function",
          functionName: "createTelemetryMiddleware",
          args: ["Citadel-Vanguard"],
          expected: { isMiddleware: true },
          message: "Creates telemetry middleware that mutates request context and headers.",
        },
      ],
      hints: [
        "Return `function(req, res, next) { ... }`.",
        "Inside, set `req.service = serviceName; req.requestId = 'req-' + req.method.toLowerCase() + '-99';`.",
        "Call `res.setHeader('X-Powered-By', serviceName); next();`.",
      ],
      solution: `function createTelemetryMiddleware(serviceName) {
  const mw = function(req, res, next) {
    req.service = serviceName;
    req.requestId = "req-" + (req.method || "get").toLowerCase() + "-99";
    if (res && res.setHeader) {
      res.setHeader("X-Powered-By", serviceName);
    }
    if (typeof next === "function") {
      next();
    }
  };
  mw.isMiddleware = true;
  return mw;
}`,
      solutionExplanation:
        "Middleware functions intercept incoming requests, enrich the `req` object with metadata, and invoke `next()` to continue pipeline execution.",
      requirements: [
        { id: "req-c04-01", label: "Creates functional Express middleware attaching metadata", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 05: The Request Messenger
  // -------------------------------------------------------------
  {
    id: "citadel-05",
    worldId: "backend-citadel",
    number: "05",
    title: "The Request Messenger: Params, Query, Body & JSON",
    world: "backend-citadel",
    type: "lesson",
    xp: 220,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Read parameters from URL paths, query strings, and request bodies to formulate tailored JSON responses.",
    concepts: ["req.params", "req.query", "req.body", "res.status()", "res.json()"],
    content: [
      {
        type: "paragraph",
        text: "📨 The Request Messenger carries orders from across the kingdom. Express routes inspect inputs from three primary locations: route parameters (`req.params`), query strings (`req.query`), and JSON payloads (`req.body`).",
      },
      {
        type: "heading",
        text: "Extracting Request Inputs",
      },
      {
        type: "code",
        code: `// Route: POST /guilds/:guildId/recruits?priority=high
// Body:  { name: "Aria", role: "Ranger" }

app.post("/guilds/:guildId/recruits", (req, res) => {
  const guild = req.params.guildId;  // From URL path parameter
  const priority = req.query.priority; // From query string parameter
  const heroName = req.body.name;     // From JSON request body

  res.status(201).json({ guild, priority, heroName });
});`,
      },
      {
        type: "tip",
        text: "`req.params` comes from the URL path pattern, `req.query` comes after `?` in the URL, and `req.body` contains parsed JSON payload data.",
      },
    ],
    challenge: {
      id: "challenge-c05",
      lessonId: "citadel-05",
      title: "The Request Messenger: Params, Query, Body & JSON",
      prompt:
        "Implement `handleRecruitmentRoute(req, res)`:\n1. Extract `guildId` from `req.params.guildId`.\n2. Extract `tier` from `req.query.tier` (default to `'standard'` if missing).\n3. Extract `heroName` and `power` from `req.body`.\n4. Send HTTP status 201 with JSON:\n`{ enrolled: true, guildId, tier, recruit: { heroName, power } }`.",
      starterCode: `function handleRecruitmentRoute(req, res) {
  // Extract inputs and respond with status 201:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "handleRecruitmentRoute",
          args: [
            {
              params: { guildId: "valkyrie" },
              query: { tier: "elite" },
              body: { heroName: "Lyra", power: 850 },
            },
          ],
          expected: {
            enrolled: true,
            guildId: "valkyrie",
            tier: "elite",
            recruit: { heroName: "Lyra", power: 850 },
          },
          message: "Extracts params, query, and body and returns status 201 response.",
        },
      ],
      hints: [
        "Extract `const guildId = req.params.guildId;`",
        "Extract `const tier = (req.query && req.query.tier) || 'standard';`",
        "Call `res.status(201).json({ enrolled: true, guildId, tier, recruit: { heroName: req.body.heroName, power: req.body.power } });`",
      ],
      solution: `function handleRecruitmentRoute(req, res) {
  const guildId = req?.params?.guildId;
  const tier = req?.query?.tier || "standard";
  const { heroName, power } = req?.body || {};

  const payload = {
    enrolled: true,
    guildId,
    tier,
    recruit: { heroName, power },
  };

  if (res && typeof res.status === "function") {
    res.status(201).json(payload);
  }
  return payload;
}`,
      solutionExplanation:
        "Express routes combine path parameters, query modifiers, and body data to perform business logic and construct 201 Created responses.",
      requirements: [
        { id: "req-c05-01", label: "Extracts params, query, and body into 201 response", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 06: The JSON Chamber
  // -------------------------------------------------------------
  {
    id: "citadel-06",
    worldId: "backend-citadel",
    number: "06",
    title: "The JSON Chamber: Consistent API Response Envelopes",
    world: "backend-citadel",
    type: "lesson",
    xp: 220,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Design uniform API response envelopes distinguishing success payloads from structured error contracts.",
    concepts: ["API Response Contracts", "Envelope Pattern", "Consistent Error Format", "HTTP Status Synchronization"],
    content: [
      {
        type: "paragraph",
        text: "📦 In the JSON Chamber, responses are sealed in consistent envelopes. Professional REST APIs always wrap payloads in predictable structures so clients know exactly how to handle success and error states.",
      },
      {
        type: "heading",
        text: "The JSend Envelope Standard",
      },
      {
        type: "code",
        code: `// Success Response (200 / 201)
{
  "success": true,
  "data": { "hero": "Aria", "level": 12 },
  "error": null
}

// Error Response (400 / 404 / 500)
{
  "success": false,
  "data": null,
  "error": "Hero not found"
}`,
      },
      {
        type: "tip",
        text: "Consistent response envelopes make frontend data fetching predictable and eliminate unexpected null reference errors.",
      },
    ],
    challenge: {
      id: "challenge-c06",
      lessonId: "citadel-06",
      title: "The JSON Chamber: Consistent API Response Envelopes",
      prompt:
        "Implement `buildApiResponse(data, error, statusCode)`:\n\n1. If `error` is null/undefined:\nReturn `{ success: true, statusCode: statusCode || 200, data, error: null }`.\n2. If `error` is provided:\nReturn `{ success: false, statusCode: statusCode || 400, data: null, error: String(error) }`.",
      starterCode: `function buildApiResponse(data, error = null, statusCode) {
  // Construct standardized API response envelope:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "buildApiResponse",
          args: [{ id: "hero-1", name: "Aria" }, null, 200],
          expected: {
            success: true,
            statusCode: 200,
            data: { id: "hero-1", name: "Aria" },
            error: null,
          },
          message: "Builds success envelope with data.",
        },
        {
          type: "function",
          functionName: "buildApiResponse",
          args: [null, "Resource not found", 404],
          expected: {
            success: false,
            statusCode: 404,
            data: null,
            error: "Resource not found",
          },
          message: "Builds error envelope with 404 status.",
        },
      ],
      hints: [
        "Check `if (!error)` to create the success envelope.",
        "Set `statusCode` to 200 on success (if undefined) and 400 on error (if undefined).",
      ],
      solution: `function buildApiResponse(data, error = null, statusCode) {
  if (!error) {
    return {
      success: true,
      statusCode: statusCode || 200,
      data,
      error: null,
    };
  }
  return {
    success: false,
    statusCode: statusCode || 400,
    data: null,
    error: String(error),
  };
}`,
      solutionExplanation:
        "Enveloping responses guarantees that client applications can reliably inspect `response.success` and handle errors cleanly.",
      requirements: [
        { id: "req-c06-01", label: "Generates standardized success and error envelopes", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 07: The CRUD Vault
  // -------------------------------------------------------------
  {
    id: "citadel-07",
    worldId: "backend-citadel",
    number: "07",
    title: "The CRUD Vault: Connecting HTTP to Database Operations",
    world: "backend-citadel",
    type: "lesson",
    xp: 230,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Map CRUD actions (Create, Read, Update, Delete) to database records and return correct status codes.",
    concepts: ["CRUD", "Database Operations", "HTTP Status 200/201/404", "REST Controllers"],
    content: [
      {
        type: "paragraph",
        text: "🔐 Inside the CRUD Vault, server controllers execute database queries. Each HTTP method pairs with a corresponding database operation to manage records.",
      },
      {
        type: "heading",
        text: "CRUD Matrix",
      },
      {
        type: "paragraph",
        text: "- **Create**: `POST /heroes` ──▶ `db.insert('heroes', data)` (Status 201)\n- **Read**: `GET /heroes/:id` ──▶ `db.findById('heroes', id)` (Status 200 / 404)\n- **Update**: `PATCH /heroes/:id` ──▶ `db.update('heroes', id, data)` (Status 200 / 404)\n- **Delete**: `DELETE /heroes/:id` ──▶ `db.delete('heroes', id)` (Status 200 / 404)",
      },
      {
        type: "tip",
        text: "If `db.findById` or `db.update` returns null (meaning the record does not exist), return an HTTP 404 Not Found response.",
      },
    ],
    challenge: {
      id: "challenge-c07",
      lessonId: "citadel-07",
      title: "The CRUD Vault: Connecting HTTP to Database Operations",
      prompt:
        "Implement `getHeroByIdController(db, req, res)`:\n1. Extract `id` from `req.params.id`.\n2. Query database with `db.findById('heroes', id)`.\n3. If found: `res.status(200).json({ success: true, hero })`.\n4. If not found: `res.status(404).json({ success: false, error: 'Hero not found' })`.",
      starterCode: `function getHeroByIdController(db, req, res) {
  // Query db and return 200 with hero or 404 with error:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "getHeroByIdController",
          args: [null, { params: { id: "hero-1" } }],
          expected: { success: true, hero: { id: "hero-1", name: "Aria" } },
          message: "Returns 200 with hero when found.",
        },
        {
          type: "function",
          functionName: "getHeroByIdController",
          args: [null, { params: { id: "missing-hero" } }],
          expected: { success: false, error: "Hero not found" },
          message: "Returns 404 when hero record is missing.",
        },
      ],
      hints: [
        "Call `const hero = (db || createMockDb({ heroes: [{ id: 'hero-1', name: 'Aria' }] })).findById('heroes', req.params.id);`",
        "If `hero`, respond `res.status(200).json({ success: true, hero });`",
        "Else respond `res.status(404).json({ success: false, error: 'Hero not found' });`",
      ],
      solution: `function getHeroByIdController(db, req, res) {
  const database = db || createMockDb({ heroes: [{ id: "hero-1", name: "Aria" }] });
  const id = req?.params?.id;
  const hero = database.findById("heroes", id);

  if (hero) {
    const payload = { success: true, hero };
    if (res && typeof res.status === "function") {
      res.status(200).json(payload);
    }
    return payload;
  }

  const errorPayload = { success: false, error: "Hero not found" };
  if (res && typeof res.status === "function") {
    res.status(404).json(errorPayload);
  }
  return errorPayload;
}`,
      solutionExplanation:
        "Controllers bridge HTTP requests to database layers, inspecting query outcomes to return appropriate status codes.",
      requirements: [
        { id: "req-c07-01", label: "Queries database and returns 200 or 404 status", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 08: The Database Dungeon
  // -------------------------------------------------------------
  {
    id: "citadel-08",
    worldId: "backend-citadel",
    number: "08",
    title: "The Database Dungeon: Tables, Records & DB Operations",
    world: "backend-citadel",
    type: "lesson",
    xp: 230,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Understand database architecture: tables, records, unique primary keys, and data mutation.",
    concepts: ["Database Tables", "Primary Keys", "Insert", "Update", "Delete", "Data State"],
    content: [
      {
        type: "paragraph",
        text: "🗄️ Deep in the Database Dungeon, structured ledgers persist application state. Tables organize records into rows and columns, each uniquely identified by a **Primary Key** (`id`).",
      },
      {
        type: "heading",
        text: "Database Operations",
      },
      {
        type: "code",
        code: `// Insert record
const newHero = db.insert("heroes", { name: "Kaelen", role: "Paladin" });

// Find by Primary Key
const hero = db.findById("heroes", newHero.id);

// Update record
db.update("heroes", newHero.id, { role: "Grand Paladin" });

// Delete record
db.delete("heroes", newHero.id);`,
      },
      {
        type: "tip",
        text: "Primary keys must be unique to ensure database operations update exactly one intended record.",
      },
    ],
    challenge: {
      id: "challenge-c08",
      lessonId: "citadel-08",
      title: "The Database Dungeon: Tables, Records & DB Operations",
      prompt:
        "Implement `manageGarrisonDatabase(db, action, payload)`:\n\n- `'insert'`: `db.insert('garrison', payload)` and return `{ created: true, name: payload.name }`\n- `'find'`: `db.findById('garrison', payload.id)` and return `{ found: true, record }` (or `{ found: false, record: null }`)\n- `'update'`: `db.update('garrison', payload.id, payload.updates)` and return `{ updated: true, record }`\n- `'delete'`: `db.delete('garrison', payload.id)` and return `{ deleted: true, id: payload.id }`",
      starterCode: `function manageGarrisonDatabase(db, action, payload) {
  // Execute database action:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "manageGarrisonDatabase",
          args: [null, "insert", { name: "Knights", count: 20 }],
          expected: { created: true, name: "Knights" },
          message: "Inserts new garrison squad into database.",
        },
        {
          type: "function",
          functionName: "manageGarrisonDatabase",
          args: [null, "find", { id: "g1" }],
          expected: { found: true, record: { id: "g1", name: "Archers", count: 50 } },
          message: "Finds squad by primary key.",
        },
        {
          type: "function",
          functionName: "manageGarrisonDatabase",
          args: [null, "delete", { id: "g1" }],
          expected: { deleted: true, id: "g1" },
          message: "Deletes squad record by ID.",
        },
      ],
      hints: [
        "Use a switch statement matching `action` ('insert', 'find', 'update', 'delete').",
        "Call the appropriate `db` method and wrap the return object.",
      ],
      solution: `function manageGarrisonDatabase(db, action, payload) {
  const database = db || createMockDb({ garrison: [{ id: "g1", name: "Archers", count: 50 }] });
  switch (action) {
    case "insert": {
      const record = database.insert("garrison", payload);
      return { created: true, name: record.name };
    }
    case "find": {
      const record = database.findById("garrison", payload.id);
      return { found: Boolean(record), record };
    }
    case "update": {
      const record = database.update("garrison", payload.id, payload.updates);
      return { updated: Boolean(record), record };
    }
    case "delete": {
      const deleted = database.delete("garrison", payload.id);
      return { deleted: Boolean(deleted), id: payload.id };
    }
    default:
      return null;
  }
}`,
      solutionExplanation:
        "Database abstraction layers encapsulate storage mechanics, providing clean data manipulation routines for backend applications.",
      requirements: [
        { id: "req-c08-01", label: "Executes CRUD database operations", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 09: The SQL Archives
  // -------------------------------------------------------------
  {
    id: "citadel-09",
    worldId: "backend-citadel",
    number: "09",
    title: "The SQL Archives: Querying & Filtering Records",
    world: "backend-citadel",
    type: "lesson",
    xp: 240,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Write SQL-style query builders supporting SELECT, WHERE filters, ORDER BY, and LIMIT.",
    concepts: ["SQL", "SELECT", "WHERE Clause", "ORDER BY", "LIMIT", "Data Filtering"],
    content: [
      {
        type: "paragraph",
        text: "📜 In the SQL Archives, ancient tomes store relational data queries. Structured Query Language (SQL) allows backends to filter, sort, and slice datasets with precision.",
      },
      {
        type: "heading",
        text: "SQL Query Anatomy",
      },
      {
        type: "code",
        code: `// Retrieve up to 5 active heroes sorted by level descending
SELECT * FROM heroes WHERE role = 'Knight' ORDER BY level DESC LIMIT 5;`,
      },
      {
        type: "tip",
        text: "WHERE filters rows by conditions, ORDER BY sorts the results, and LIMIT caps the maximum number of returned rows.",
      },
    ],
    challenge: {
      id: "challenge-c09",
      lessonId: "citadel-09",
      title: "The SQL Archives: Querying & Filtering Records",
      prompt:
        "Implement `filterAndSortHeroes(heroes, criteria)`:\n\nCriteria:\n`{ role?: string, minLevel?: number, sortBy?: 'level' | 'name', limit?: number }`\n\n1. Filter by `role` (if provided)\n2. Filter by `level >= minLevel` (if provided)\n3. Sort by `sortBy` field (if `'level'`, sort descending; if `'name'`, sort alphabetically ascending)\n4. Slice up to `limit` items (if provided)\n5. Return the resulting array.",
      starterCode: `function filterAndSortHeroes(heroes, criteria = {}) {
  // Filter, sort, and limit heroes array:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "filterAndSortHeroes",
          args: [
            [
              { id: 1, name: "Rowan", role: "Knight", level: 14 },
              { id: 2, name: "Aria", role: "Ranger", level: 16 },
              { id: 3, name: "Kaelen", role: "Knight", level: 10 },
              { id: 4, name: "Lyra", role: "Knight", level: 20 },
            ],
            { role: "Knight", minLevel: 12, sortBy: "level", limit: 2 },
          ],
          expected: [
            { id: 4, name: "Lyra", role: "Knight", level: 20 },
            { id: 1, name: "Rowan", role: "Knight", level: 14 },
          ],
          message: "Filters by role and minLevel, sorts by level descending, and limits to 2.",
        },
      ],
      hints: [
        "Use `let result = [...heroes];`",
        "Apply `.filter(h => (!criteria.role || h.role === criteria.role) && (criteria.minLevel === undefined || h.level >= criteria.minLevel))`",
        "Apply `.sort(...)` and `.slice(0, criteria.limit)`.",
      ],
      solution: `function filterAndSortHeroes(heroes, criteria = {}) {
  let result = [...heroes];

  if (criteria.role) {
    result = result.filter((h) => h.role === criteria.role);
  }

  if (criteria.minLevel !== undefined) {
    result = result.filter((h) => h.level >= criteria.minLevel);
  }

  if (criteria.sortBy === "level") {
    result.sort((a, b) => b.level - a.level);
  } else if (criteria.sortBy === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (criteria.limit && criteria.limit > 0) {
    result = result.slice(0, criteria.limit);
  }

  return result;
}`,
      solutionExplanation:
        "SQL-like operations filter datasets by criteria, sort results, and restrict row count to deliver optimized payloads.",
      requirements: [
        { id: "req-c09-01", label: "Filters, sorts, and limits dataset using query criteria", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 10: The Relational Map
  // -------------------------------------------------------------
  {
    id: "citadel-10",
    worldId: "backend-citadel",
    number: "10",
    title: "The Relational Map: Foreign Keys & One-to-Many Joins",
    world: "backend-citadel",
    type: "lesson",
    xp: 250,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 9,
    description: "Model relational data structures: Foreign Keys and joining related tables into unified API responses.",
    concepts: ["Relational Data", "Primary Key", "Foreign Key", "One-to-Many Relationships", "Data Joining"],
    content: [
      {
        type: "paragraph",
        text: "🗺️ Relational databases connect distinct tables through keys. A hero can undertake multiple quests: the `quests` table stores a **Foreign Key** (`heroId`) pointing to the hero's primary key.",
      },
      {
        type: "heading",
        text: "One-to-Many Joining",
      },
      {
        type: "code",
        code: `// Heroes Table: { id: "hero-1", name: "Aria" }
// Quests Table: { id: "q-101", heroId: "hero-1", title: "Dragon Hunt" }

// Joined Result:
{
  id: "hero-1",
  name: "Aria",
  quests: [{ id: "q-101", title: "Dragon Hunt" }]
}`,
      },
      {
        type: "tip",
        text: "Foreign keys allow normalized data storage without duplicating hero details inside every quest record.",
      },
    ],
    challenge: {
      id: "challenge-c10",
      lessonId: "citadel-10",
      title: "The Relational Map: Foreign Keys & One-to-Many Joins",
      prompt:
        "Implement `joinHeroWithQuests(db, heroId)`:\n1. Look up hero with `db.findById('heroes', heroId)`.\n2. If not found, return `null`.\n3. Find all quests matching `db.find('quests', q => q.heroId === heroId)`.\n4. Return `{ ...hero, quests }`.",
      starterCode: `function joinHeroWithQuests(db, heroId) {
  // Join hero with their assigned quests:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "joinHeroWithQuests",
          args: [null, "hero-1"],
          expected: {
            id: "hero-1",
            name: "Aria",
            role: "Ranger",
            quests: [
              { id: "q-1", heroId: "hero-1", title: "Scout Northern Forest", reward: 250 },
              { id: "q-2", heroId: "hero-1", title: "Retrieve Ancient Compass", reward: 400 },
            ],
          },
          message: "Joins hero record with related quests matching heroId foreign key.",
        },
      ],
      hints: [
        "Call `const database = db || createMockDb({ ... });`",
        "Call `const hero = database.findById('heroes', heroId);`",
        "If `!hero`, return `null`.",
        "Find quests with `const quests = database.find('quests', q => q.heroId === heroId);` and return `{ ...hero, quests }`.",
      ],
      solution: `function joinHeroWithQuests(db, heroId) {
  const database = db || createMockDb({
    heroes: [{ id: "hero-1", name: "Aria", role: "Ranger" }],
    quests: [
      { id: "q-1", heroId: "hero-1", title: "Scout Northern Forest", reward: 250 },
      { id: "q-2", heroId: "hero-1", title: "Retrieve Ancient Compass", reward: 400 },
      { id: "q-3", heroId: "hero-2", title: "Guard High Citadel", reward: 300 },
    ],
  });
  const hero = database.findById("heroes", heroId);
  if (!hero) return null;

  const quests = database.find("quests", (q) => String(q.heroId) === String(heroId));
  return {
    ...hero,
    quests,
  };
}`,
      solutionExplanation:
        "Relational joins connect parent entities to child collections via foreign keys, producing unified API responses.",
      requirements: [
        { id: "req-c10-01", label: "Joins hero parent record with related child quests", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 11: The Authentication Gate
  // -------------------------------------------------------------
  {
    id: "citadel-11",
    worldId: "backend-citadel",
    number: "11",
    title: "The Authentication Gate: Bearer Security & Protected Routes",
    world: "backend-citadel",
    type: "lesson",
    xp: 260,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 10,
    description: "Guard endpoints using token authentication middleware, rejecting unauthorized requests with 401 and 403 status codes.",
    concepts: ["Authentication Middleware", "Bearer Tokens", "401 Unauthorized", "403 Forbidden", "Protected Endpoints"],
    content: [
      {
        type: "paragraph",
        text: "🛡️ The Authentication Gate protects Citadel vaults. In backend development, authentication middleware verifies incoming tokens before allowing requests to reach sensitive route handlers.",
      },
      {
        type: "heading",
        text: "Auth Middleware Pattern",
      },
      {
        type: "code",
        code: `function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== VALID_SECRET_TOKEN) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
  req.user = { id: "user-1", role: "commander" };
  next();
}`,
      },
      {
        type: "tip",
        text: "HTTP 401 means unauthenticated (missing/invalid credentials), while 403 means forbidden (authenticated, but lacking required permissions).",
      },
    ],
    challenge: {
      id: "challenge-c11",
      lessonId: "citadel-11",
      title: "The Authentication Gate: Bearer Security & Protected Routes",
      prompt:
        "Implement `createAuthGuard(validToken, requiredRole)`:\n\nReturn Express middleware `(req, res, next)`:\n1. Check `req.headers['authorization']` for `'Bearer <token>'`.\n2. If header is missing or token !== `validToken`: `res.status(401).json({ success: false, error: 'Unauthorized' })`.\n3. If `requiredRole` is provided and `req.headers['x-user-role'] !== requiredRole`: `res.status(403).json({ success: false, error: 'Forbidden' })`.\n4. If valid, set `req.user = { authenticated: true, role: req.headers['x-user-role'] || 'user' }` and call `next()`.",
      starterCode: `function createAuthGuard(validToken, requiredRole) {
  // Return auth middleware guarding against 401 and 403:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "createAuthGuard",
          args: ["citadel-secret-key", "commander"],
          expected: { isAuthGuard: true },
          message: "Creates authentication guard enforcing Bearer token and role requirements.",
        },
      ],
      hints: [
        "Extract auth header and check `if (!authHeader || !authHeader.includes('Bearer ' + validToken)) return res.status(401).json({ success: false, error: 'Unauthorized' });`",
        "Check role: `if (requiredRole && req.headers['x-user-role'] !== requiredRole) return res.status(403).json({ success: false, error: 'Forbidden' });`",
        "Set `req.user = ...` and call `next()`.",
      ],
      solution: `function createAuthGuard(validToken, requiredRole) {
  const guard = function(req, res, next) {
    const authHeader = req.headers ? (req.headers["authorization"] || req.headers["Authorization"]) : null;
    if (!authHeader || !authHeader.includes("Bearer " + validToken)) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const role = req.headers ? req.headers["x-user-role"] : null;
    if (requiredRole && role !== requiredRole) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    req.user = { authenticated: true, role: role || "user" };
    if (typeof next === "function") {
      next();
    }
  };
  guard.isAuthGuard = true;
  return guard;
}`,
      solutionExplanation:
        "Authentication guards inspect credentials at the middleware layer, terminating unauthorized requests before they consume backend resources.",
      requirements: [
        { id: "req-c11-01", label: "Enforces 401 token authentication and 403 role authorization", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 12: The Error Citadel
  // -------------------------------------------------------------
  {
    id: "citadel-12",
    worldId: "backend-citadel",
    number: "12",
    title: "The Error Citadel: Centralized Error Middleware",
    world: "backend-citadel",
    type: "lesson",
    xp: 260,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 10,
    description: "Implement centralized Express error-handling middleware (err, req, res, next) to prevent server crashes.",
    concepts: ["Error Middleware (err, req, res, next)", "Centralized Error Handling", "500 Internal Error", "Error Status Codes"],
    content: [
      {
        type: "paragraph",
        text: "⚡ An unhandled exception can crash an entire server process. Express provides a specialized 4-parameter error middleware signature `(err, req, res, next)` that catches all forwarded errors.",
      },
      {
        type: "heading",
        text: "Express Error Handler Signature",
      },
      {
        type: "code",
        code: `// Express recognizes error middleware by its 4 arguments:
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});`,
      },
      {
        type: "tip",
        text: "Passing any argument to `next(err)` bypasses normal route handlers and jumps straight to error middleware.",
      },
    ],
    challenge: {
      id: "challenge-c12",
      lessonId: "citadel-12",
      title: "The Error Citadel: Centralized Error Middleware",
      prompt:
        "Implement `createCentralizedErrorHandler()`:\n\nReturn an Express error middleware function with exactly 4 parameters: `(err, req, res, next)` that:\n1. Extracts `status = err.statusCode || err.status || 500`.\n2. Sends status code and JSON:\n`{ success: false, statusCode: status, error: err.message || 'Internal Server Error' }`.",
      starterCode: `function createCentralizedErrorHandler() {
  // Return 4-argument error handler middleware (err, req, res, next):
  
}`,
      tests: [
        {
          type: "function",
          functionName: "createCentralizedErrorHandler",
          args: [],
          expected: { isErrorHandler: true, arity: 4 },
          message: "Creates 4-parameter error handler middleware returning structured error JSON.",
        },
      ],
      hints: [
        "Define function with exactly four arguments: `function(err, req, res, next) { ... }`.",
        "Respond with `res.status(status).json({ success: false, statusCode: status, error: err.message || 'Internal Server Error' });`.",
      ],
      solution: `function createCentralizedErrorHandler() {
  const handler = function(err, req, res, next) {
    const status = (err && (err.statusCode || err.status)) || 500;
    const errorMsg = (err && err.message) || "Internal Server Error";
    res.status(status).json({
      success: false,
      statusCode: status,
      error: errorMsg,
    });
  };
  handler.isErrorHandler = true;
  handler.arity = handler.length;
  return handler;
}`,
      solutionExplanation:
        "Express detects error middleware by function arity (4 arguments), routing unhandled exceptions into a single structured response pipeline.",
      requirements: [
        { id: "req-c12-01", label: "Creates 4-argument centralized error middleware", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 13: The Validation Guard
  // -------------------------------------------------------------
  {
    id: "citadel-13",
    worldId: "backend-citadel",
    number: "13",
    title: "The Validation Guard: Request Body Sanitization",
    world: "backend-citadel",
    type: "lesson",
    xp: 270,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 10,
    description: "Validate and sanitize request payloads before database mutations, rejecting invalid input with 400 Bad Request.",
    concepts: ["Input Validation", "400 Bad Request", "Schema Checking", "Data Sanitization"],
    content: [
      {
        type: "paragraph",
        text: "🛡️ Malformed or malicious input must never reach the database. Validation middleware verifies types, presence, and value bounds, returning `400 Bad Request` with actionable error messages.",
      },
      {
        type: "heading",
        text: "Validation Schema Checklist",
      },
      {
        type: "paragraph",
        text: "1. **Presence**: Required fields (`name`, `role`) must exist.\n2. **Type**: Numbers must be numbers, strings must be strings.\n3. **Range**: `level` must be an integer between 1 and 100.\n4. **Enum**: `role` must match allowed categories (`'Knight'`, `'Ranger'`, `'Mage'`).",
      },
      {
        type: "tip",
        text: "Return descriptive validation error lists so clients can highlight which form fields need correction.",
      },
    ],
    challenge: {
      id: "challenge-c13",
      lessonId: "citadel-13",
      title: "The Validation Guard: Request Body Sanitization",
      prompt:
        "Implement `validateHeroInput(payload)`:\n\nValidate `payload` rules:\n1. `name`: string, trimmed length >= 2\n2. `role`: must be one of `['Knight', 'Ranger', 'Mage', 'Paladin']`\n3. `level`: integer number between 1 and 100\n\nReturn:\n- If valid: `{ valid: true, errors: [] }`\n- If invalid: `{ valid: false, errors: string[] }` (containing descriptive error messages).",
      starterCode: `function validateHeroInput(payload) {
  // Validate presence, types, enums, and ranges:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "validateHeroInput",
          args: [{ name: "Aria", role: "Ranger", level: 15 }],
          expected: { valid: true, errors: [] },
          message: "Validates correct hero payload.",
        },
        {
          type: "function",
          functionName: "validateHeroInput",
          args: [{ name: "A", role: "Sorcerer", level: 150 }],
          expected: {
            valid: false,
            errors: [
              "Name must be at least 2 characters",
              "Role must be Knight, Ranger, Mage, or Paladin",
              "Level must be between 1 and 100",
            ],
          },
          message: "Rejects short name, invalid role enum, and out-of-range level.",
        },
      ],
      hints: [
        "Collect errors into an array `const errors = [];`.",
        "Check `if (!payload.name || String(payload.name).trim().length < 2) errors.push('Name must be at least 2 characters');`",
        "Check `['Knight', 'Ranger', 'Mage', 'Paladin'].includes(payload.role)` and level range.",
      ],
      solution: `function validateHeroInput(payload) {
  const errors = [];
  const allowedRoles = ["Knight", "Ranger", "Mage", "Paladin"];

  if (!payload || !payload.name || String(payload.name).trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!payload || !allowedRoles.includes(payload.role)) {
    errors.push("Role must be Knight, Ranger, Mage, or Paladin");
  }

  if (
    !payload ||
    typeof payload.level !== "number" ||
    payload.level < 1 ||
    payload.level > 100 ||
    !Number.isInteger(payload.level)
  ) {
    errors.push("Level must be between 1 and 100");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}`,
      solutionExplanation:
        "Input validation prevents corrupt data from entering persistence layers by enforcing type, length, and enumeration rules.",
      requirements: [
        { id: "req-c13-01", label: "Enforces presence, enum, and range validation rules", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 14: The API Workshop
  // -------------------------------------------------------------
  {
    id: "citadel-14",
    worldId: "backend-citadel",
    number: "14",
    title: "The API Workshop: Multi-Resource REST APIs",
    world: "backend-citadel",
    type: "lesson",
    xp: 280,
    skillId: "backend-databases",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 11,
    description: "Construct a cohesive multi-resource REST backend combining routing, validation, error codes, and database state.",
    concepts: ["Multi-Resource Architecture", "REST Controllers", "Database Integration", "Status Code Coordination"],
    content: [
      {
        type: "paragraph",
        text: "🛠️ In the API Workshop, all backend components unite into a functioning web service. A complete backend coordinates routes, databases, status codes, and JSON envelopes.",
      },
      {
        type: "heading",
        text: "Citadel API Specification",
      },
      {
        type: "paragraph",
        text: "- `GET /heroes`: Return all heroes\n- `POST /heroes`: Validate body & insert (201 on success, 400 on invalid)\n- `GET /heroes/:id`: Return hero by ID (200 on success, 404 if missing)\n- `DELETE /heroes/:id`: Delete hero (200 on success, 404 if missing)",
      },
      {
        type: "tip",
        text: "Keep route controllers focused: validate input first, execute database calls, and format responses.",
      },
    ],
    challenge: {
      id: "challenge-c14",
      lessonId: "citadel-14",
      title: "The API Workshop: Multi-Resource REST APIs",
      prompt:
        "Implement `buildCitadelApi(app, db)` to wire up the complete `/heroes` REST API:\n\n1. `GET /heroes`: `res.status(200).json({ success: true, data: db.find('heroes') })`\n2. `POST /heroes`: If `!req.body.name`, respond `res.status(400).json({ success: false, error: 'Name required' })`. Otherwise `db.insert('heroes', req.body)` and respond `res.status(201).json({ success: true, data: created })`.\n3. `GET /heroes/:id`: Find by ID. If found, respond 200 with `{ success: true, data: hero }`. If missing, respond 404 with `{ success: false, error: 'Not found' }`.\n\nReturn `{ isCitadelApi: true }`.",
      starterCode: `function buildCitadelApi(app, db) {
  // Wire up GET /heroes, POST /heroes, and GET /heroes/:id:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "buildCitadelApi",
          args: [null, null],
          expected: { isCitadelApi: true },
          message: "Constructs complete Citadel REST API with validation and database lookups.",
        },
      ],
      hints: [
        "Register `app.get('/heroes', (req, res) => res.status(200).json({ success: true, data: db.find('heroes') }))`.",
        "Register `app.post('/heroes', ...)` with 400 check on missing name and 201 insert.",
        "Register `app.get('/heroes/:id', ...)` with 404 check.",
      ],
      solution: `function buildCitadelApi(app, db) {
  const database = db || createMockDb({ heroes: [{ id: "h1", name: "Aria" }] });
  const server = app || createMockApp(database);

  server.get("/heroes", (req, res) => {
    res.status(200).json({ success: true, data: database.find("heroes") });
  });

  server.post("/heroes", (req, res) => {
    if (!req.body || !req.body.name) {
      return res.status(400).json({ success: false, error: "Name required" });
    }
    const created = database.insert("heroes", req.body);
    res.status(201).json({ success: true, data: created });
  });

  server.get("/heroes/:id", (req, res) => {
    const hero = database.findById("heroes", req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.status(200).json({ success: true, data: hero });
  });

  return { isCitadelApi: true };
}`,
      solutionExplanation:
        "Cohesive REST APIs combine routing patterns, request validation, and database operations into predictable service contracts.",
      requirements: [
        { id: "req-c14-01", label: "Constructs multi-route REST API with validation and error handling", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 15: The Backend Project (Mini Project)
  // -------------------------------------------------------------
  {
    id: "citadel-15",
    worldId: "backend-citadel",
    number: "15",
    title: "The Backend Project: Citadel Management Service",
    world: "backend-citadel",
    type: "lesson",
    xp: 320,
    skillId: "backend-databases",
    skillProgress: 8,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 12,
    description: "Build a complete Citadel Management Service combining auth guards, validation, relational joins, and CRUD endpoints.",
    concepts: ["Mini Project", "Service Architecture", "Authentication Middleware", "Relational Queries", "Full CRUD Pipeline"],
    content: [
      {
        type: "paragraph",
        text: "🏰 You have arrived at the Grand Citadel Engineering Guild! Here you unify all your backend competencies — routing, middleware pipelines, authentication tokens, validation guards, and relational data management — into a complete Citadel Management Service.",
      },
      {
        type: "heading",
        text: "Service Interface Requirements",
      },
      {
        type: "paragraph",
        text: "The service provides:\n- `getGarrisonStats()`: Returns summary counts from database\n- `recruitChampion(payload)`: Validates input, inserts champion (201 Created), or throws 400\n- `getChampionQuests(championId)`: Performs relational join between champion and quests",
      },
      {
        type: "tip",
        text: "Layering business logic inside service methods creates modular, testable backend systems.",
      },
    ],
    challenge: {
      id: "challenge-c15",
      lessonId: "citadel-15",
      title: "The Backend Project: Citadel Management Service",
      prompt:
        "Implement `createCitadelService(db)` that returns a service object with methods:\n\n1. `getGarrisonStats()`: returns `{ totalChampions: db.find('champions').length, totalQuests: db.find('quests').length }`.\n2. `recruitChampion(payload)`: if `!payload.name`, returns `{ success: false, error: 'Name required' }`. Else inserts into `'champions'` and returns `{ success: true, champion: created }`.\n3. `getChampionQuests(championId)`: looks up champion by ID, finds quests where `q.championId === championId`, and returns `{ ...champion, quests }` (or `null` if champion missing).",
      starterCode: `function createCitadelService(db) {
  // Return Citadel Service with getGarrisonStats, recruitChampion, and getChampionQuests:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "createCitadelService",
          args: [null],
          expected: { isCitadelService: true },
          message: "Instantiates complete Citadel Management Service with operational methods.",
        },
      ],
      hints: [
        "Return an object containing `isCitadelService: true`, `getGarrisonStats`, `recruitChampion`, and `getChampionQuests`.",
        "Implement `getGarrisonStats` querying counts from champions and quests tables.",
        "Implement `recruitChampion` with validation and `getChampionQuests` with relational join.",
      ],
      solution: `function createCitadelService(db) {
  const database = db || createMockDb({
    champions: [{ id: "c1", name: "Aria", role: "Ranger" }],
    quests: [{ id: "q1", championId: "c1", title: "Patrol Border" }],
  });

  return {
    isCitadelService: true,
    getGarrisonStats() {
      const champions = database.find("champions");
      const quests = database.find("quests");
      return {
        totalChampions: champions.length,
        totalQuests: quests.length,
      };
    },
    recruitChampion(payload) {
      if (!payload || !payload.name) {
        return { success: false, error: "Name required" };
      }
      const created = database.insert("champions", payload);
      return { success: true, champion: created };
    },
    getChampionQuests(championId) {
      const champion = database.findById("champions", championId);
      if (!champion) return null;
      const quests = database.find("quests", (q) => String(q.championId) === String(championId));
      return {
        ...champion,
        quests,
      };
    },
  };
}`,
      solutionExplanation:
        "The Citadel Management Service coordinates relational data queries, payload validation, and resource creation into a unified backend model.",
      requirements: [
        { id: "req-c15-01", label: "Builds complete Citadel Management backend service", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 16: THE CITADEL GUARDIAN (Final Boss)
  // -------------------------------------------------------------
  {
    id: "citadel-16",
    worldId: "backend-citadel",
    number: "16",
    title: "The Citadel Guardian: Rebuilding the Master Server",
    world: "backend-citadel",
    type: "boss",
    xp: 800,
    skillId: "backend-databases",
    skillProgress: 10,
    challengeType: "javascript",
    difficulty: "Boss",
    estimatedTime: 15,
    description: "Defeat the Citadel Guardian by rebuilding the master backend server with routing, auth middleware, relational joins, and error handling to unlock World 6: The Developer Realm!",
    concepts: ["Boss Battle", "Express Router", "Bearer Authentication", "Relational Joins", "Centralized Error Handling", "Production Architecture"],
    content: [
      {
        type: "paragraph",
        text: "👑 The Citadel Guardian commands the High Keep! A rogue malware attack has corrupted the kingdom's central backend server. To restore peace and unlock World 6: The Developer Realm, you must rebuild the Master Citadel Server.",
      },
      {
        type: "heading",
        text: "The Guardian's Server Blueprint",
      },
      {
        type: "paragraph",
        text: "1. **Auth Guard**: Require `Authorization: Bearer imperial-citadel-secret` on protected routes.\n2. **Telemetry Middleware**: Attach `req.receivedAt` timestamp on all requests.\n3. **Relational Route**: `GET /champions/:id/quests` returns champion joined with their quests.\n4. **Mutation Route**: `POST /champions` validates name presence (400 if missing, 201 Created on insert).\n5. **Centralized Error Boundary**: Return uniform `{ success: false, statusCode, error }` on unhandled faults.",
      },
      {
        type: "tip",
        text: "Combine middleware registration, routing endpoints, relational joins, validation guards, and error boundaries into a single resilient server.",
      },
    ],
    challenge: {
      id: "challenge-c16",
      lessonId: "citadel-16",
      title: "The Citadel Guardian: Rebuilding the Master Server",
      prompt:
        "Defeat the Citadel Guardian by implementing `buildMasterCitadelServer(app, db, authToken)`:\n\n1. Attach middleware setting `req.serverName = 'Citadel-Master'` on all requests.\n2. Protected route `GET /admin/status`: requires `Authorization: Bearer ' + authToken` (401 if missing/invalid). Returns `{ status: 'operational', activeTables: Object.keys(db.getTables ? db.getTables() : {}).length }`.\n3. `GET /champions/:id`: Returns champion by ID (200 on success, 404 if missing).\n4. `POST /champions`: If `!req.body.name`, respond 400 with `{ error: 'Name required' }`. Else insert and respond 201 with `{ success: true, champion: created }`.\n5. Attach error handler middleware `(err, req, res, next)` returning status 500 with `{ success: false, error: err.message }`.\n\nReturn `{ isMasterServer: true }`.",
      starterCode: `function buildMasterCitadelServer(app, db, authToken = "imperial-citadel-secret") {
  // Rebuild the master Citadel server:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "buildMasterCitadelServer",
          args: [null, null, "imperial-citadel-secret"],
          expected: { isMasterServer: true },
          message: "Constructs master backend server, passes security audits, and defeats the Citadel Guardian.",
        },
      ],
      hints: [
        "Use `app.use((req, res, next) => { req.serverName = 'Citadel-Master'; next(); });`",
        "Add auth check in `app.get('/admin/status', (req, res) => { ... })` checking `req.headers['authorization']`.",
        "Add `app.get('/champions/:id', ...)` and `app.post('/champions', ...)`.",
        "Add 4-argument error handler at the end: `app.use((err, req, res, next) => res.status(500).json({ success: false, error: err.message }));`",
      ],
      solution: `function buildMasterCitadelServer(app, db, authToken = "imperial-citadel-secret") {
  const database = db || createMockDb({
    champions: [{ id: "c1", name: "Rowan", role: "Knight" }],
    quests: [{ id: "q1", championId: "c1", title: "Defeat Guardian" }],
  });
  const server = app || createMockApp(database);

  // 1. Telemetry Middleware
  server.use((req, res, next) => {
    req.serverName = "Citadel-Master";
    if (typeof next === "function") next();
  });

  // 2. Protected Route
  server.get("/admin/status", (req, res) => {
    const auth = req.headers ? (req.headers["authorization"] || req.headers["Authorization"]) : "";
    if (!auth || !auth.includes("Bearer " + authToken)) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const tableCount = typeof database.getTables === "function" ? Object.keys(database.getTables()).length : 2;
    res.status(200).json({ status: "operational", activeTables: tableCount });
  });

  // 3. Read Route
  server.get("/champions/:id", (req, res) => {
    const champion = database.findById("champions", req.params.id);
    if (!champion) {
      return res.status(404).json({ success: false, error: "Champion not found" });
    }
    res.status(200).json({ success: true, champion });
  });

  // 4. Create Route
  server.post("/champions", (req, res) => {
    if (!req.body || !req.body.name) {
      return res.status(400).json({ success: false, error: "Name required" });
    }
    const created = database.insert("champions", req.body);
    res.status(201).json({ success: true, champion: created });
  });

  // 5. Centralized Error Boundary
  server.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.message || "Server Error" });
  });

  return { isMasterServer: true };
}`,
      solutionExplanation:
        "The Master Citadel Server integrates authentication middleware, resource controllers, input validation, and centralized error handling into a production-grade backend architecture.",
      requirements: [
        { id: "req-c16-01", label: "Defeats the Citadel Guardian by rebuilding master backend server", type: "function" },
      ],
    },
  },
];

/** Get Backend Citadel lesson by ID */
export function getBackendCitadelLessonById(lessonId) {
  return backendCitadelLessons.find((l) => l.id === lessonId);
}

/** Get next Backend Citadel lesson ID */
export function getNextBackendCitadelLessonId(lessonId) {
  const index = backendCitadelLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= backendCitadelLessons.length - 1) return null;
  return backendCitadelLessons[index + 1].id;
}

/** Get progress percentage for Backend Citadel */
export function getBackendCitadelProgress(progress = {}) {
  const completed = backendCitadelLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.min(100, Math.round((completed / backendCitadelLessons.length) * 100));
}

/** Check if Backend Citadel is fully complete */
export function isBackendCitadelComplete(progress = {}) {
  return (
    backendCitadelLessons.length > 0 &&
    backendCitadelLessons.every((l) => (progress.completedLessons || []).includes(l.id))
  );
}
