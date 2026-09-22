/**
 * World 04 — The API Harbor
 * HTTP, REST APIs, Asynchronous JavaScript, JSON & Remote Data (16 Missions)
 *
 * A complete, hands-on API and asynchronous engineering curriculum:
 * 01. The Harbor Gate: What is an API? Client, Server, Request & Response
 * 02. Message in a Bottle: HTTP Envelopes, Headers, URLs & Body
 * 03. The Route Map: REST Endpoints & HTTP Methods (GET, POST, PUT, PATCH, DELETE)
 * 04. The JSON Cargo: Serialization, Parsing & Deep Manifest Transforms
 * 05. The GET Expedition: Fetching Remote Data with async/await
 * 06. The POST Dock: Sending Payloads & Content-Type Headers
 * 07. The Update Wharf: Modifying Resources with PUT vs PATCH
 * 08. The Delete Dock: Decommissioning Records & Status Codes
 * 09. The Status Lighthouse: Interpreting HTTP Status Code Categories
 * 10. The Error Storm: try/catch, response.ok & Graceful Network Fallbacks
 * 11. The Async Tide: Concurrent Requests with Promise.all
 * 12. The Harbor Guard: Authorization Headers & Bearer Tokens
 * 13. The Data Pipeline: Normalizing, Filtering & Aggregating Payloads
 * 14. The API Testing Bay: Resilient Retry Algorithms & Network Probes
 * 15. The Harbor Project: Mini Project — Port Dispatcher Engine
 * 16. THE API HARBOR GUARDIAN: Final Boss — Rebuilding the Port Network
 */

export const apiHarborLessons = [
  // -------------------------------------------------------------
  // Mission 01: The Harbor Gate
  // -------------------------------------------------------------
  {
    id: "harbor-01",
    worldId: "api-harbor",
    number: "01",
    title: "The Harbor Gate: What is an API?",
    world: "api-harbor",
    type: "lesson",
    xp: 150,
    skillId: "async-apis",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Beginner",
    estimatedTime: 6,
    description: "Understand the core architecture of APIs: clients, servers, requests, responses, and data exchange.",
    concepts: ["API", "Client", "Server", "Request", "Response", "Endpoint"],
    content: [
      {
        type: "paragraph",
        text: "⚓ Welcome to The API Harbor! In previous worlds, your code lived entirely within its own computer. The API Harbor connects your application to distant servers across the global data sea.",
      },
      {
        type: "heading",
        text: "The Client-Server Dialogue",
      },
      {
        type: "paragraph",
        text: "An **API** (Application Programming Interface) is a formal contract between systems. The **Client** (browser or mobile app) sends a **Request** to a **Server**, which processes the request and returns a **Response**.",
      },
      {
        type: "code",
        code: `// The Request/Response Cycle
// Client  ─── [HTTP Request]  ───▶  Server (Processes data)
// Client  ◀── [HTTP Response] ───  Server (Returns JSON payload)`,
      },
      {
        type: "tip",
        text: "Every API communication has two distinct sides: the requester (client) and the provider (server).",
      },
    ],
    challenge: {
      id: "challenge-h01",
      lessonId: "harbor-01",
      title: "The Harbor Gate: What is an API?",
      prompt:
        "Implement `inspectApiMessage(message)` to classify harbor transmissions. Given an object `{ type: 'request' | 'response', endpoint: string, method?: string, statusCode?: number, data?: any }`:\n\n1. If `type === 'request'`, return `{ isRequest: true, endpoint: message.endpoint, method: (message.method || 'GET').toUpperCase() }`.\n2. If `type === 'response'`, return `{ isRequest: false, isSuccess: message.statusCode >= 200 && message.statusCode < 300, statusCode: message.statusCode }`.",
      starterCode: `function inspectApiMessage(message) {
  // Inspect and classify the API message:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "inspectApiMessage",
          args: [{ type: "request", endpoint: "/ships", method: "get" }],
          expected: { isRequest: true, endpoint: "/ships", method: "GET" },
          message: "Classifies GET request correctly.",
        },
        {
          type: "function",
          functionName: "inspectApiMessage",
          args: [{ type: "request", endpoint: "/cargo/load", method: "post" }],
          expected: { isRequest: true, endpoint: "/cargo/load", method: "POST" },
          message: "Classifies POST request correctly.",
        },
        {
          type: "function",
          functionName: "inspectApiMessage",
          args: [{ type: "response", statusCode: 200, data: { port: "Eldoria" } }],
          expected: { isRequest: false, isSuccess: true, statusCode: 200 },
          message: "Classifies 200 OK response as success.",
        },
        {
          type: "function",
          functionName: "inspectApiMessage",
          args: [{ type: "response", statusCode: 404 }],
          expected: { isRequest: false, isSuccess: false, statusCode: 404 },
          message: "Classifies 404 Not Found response as failure.",
        },
      ],
      hints: [
        "Check `if (message.type === 'request')` and return `{ isRequest: true, endpoint: message.endpoint, method: (message.method || 'GET').toUpperCase() }`.",
        "Check `if (message.type === 'response')` and check `message.statusCode >= 200 && message.statusCode < 300`.",
      ],
      solution: `function inspectApiMessage(message) {
  if (message.type === "request") {
    return {
      isRequest: true,
      endpoint: message.endpoint,
      method: (message.method || "GET").toUpperCase(),
    };
  }
  if (message.type === "response") {
    return {
      isRequest: false,
      isSuccess: message.statusCode >= 200 && message.statusCode < 300,
      statusCode: message.statusCode,
    };
  }
  return null;
}`,
      solutionExplanation:
        "APIs distinguish between outgoing requests (with endpoints and HTTP verbs) and incoming responses (with status codes).",
      requirements: [
        { id: "req-h01-01", label: "Inspects and classifies request vs response messages", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 02: Message in a Bottle
  // -------------------------------------------------------------
  {
    id: "harbor-02",
    worldId: "api-harbor",
    number: "02",
    title: "Message in a Bottle: HTTP Request Anatomy",
    world: "api-harbor",
    type: "lesson",
    xp: 160,
    skillId: "async-apis",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Beginner",
    estimatedTime: 7,
    description: "Deconstruct HTTP envelopes: URLs, headers, body, and protocol structures.",
    concepts: ["HTTP", "Headers", "Request Body", "Content-Type", "URL Anatomy"],
    content: [
      {
        type: "paragraph",
        text: "📜 Bottles floating into the harbor carry standardized HTTP envelopes. HTTP (HyperText Transfer Protocol) defines the structure of web communication.",
      },
      {
        type: "heading",
        text: "Anatomy of an HTTP Envelope",
      },
      {
        type: "code",
        code: `// HTTP Request Envelope
GET /api/v1/ships?dock=north HTTP/1.1
Host: harbor.codequest.io
Accept: application/json
User-Agent: CodeQuest-Client/1.0`,
      },
      {
        type: "tip",
        text: "Headers act like postage stamps on an envelope: they provide metadata such as format, authorization, and timestamps.",
      },
    ],
    challenge: {
      id: "challenge-h02",
      lessonId: "harbor-02",
      title: "Message in a Bottle: HTTP Request Anatomy",
      prompt:
        "Implement `parseHttpEnvelope(rawEnvelope)` to parse an HTTP envelope object `{ method, url, headers, body }`.\n\nReturn an object:\n- `method`: uppercase string (e.g. `'GET'`)\n- `pathname`: URL path without query params (e.g. `'/ships'` from `'/ships?dock=north'`)\n- `contentType`: value of `'content-type'` header (case-insensitive) or `'text/plain'`\n- `hasBody`: boolean indicating if `body` exists and is non-empty.",
      starterCode: `function parseHttpEnvelope(rawEnvelope) {
  // Parse and extract HTTP envelope components:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "parseHttpEnvelope",
          args: [
            {
              method: "get",
              url: "/api/ships?dock=north&active=true",
              headers: { "Accept": "application/json", "Content-Type": "application/json" },
              body: null,
            },
          ],
          expected: {
            method: "GET",
            pathname: "/api/ships",
            contentType: "application/json",
            hasBody: false,
          },
          message: "Parses GET request with query params and content type.",
        },
        {
          type: "function",
          functionName: "parseHttpEnvelope",
          args: [
            {
              method: "post",
              url: "/api/cargo/dispatch",
              headers: { "content-type": "application/json" },
              body: '{"shipId":"ship-01"}',
            },
          ],
          expected: {
            method: "POST",
            pathname: "/api/cargo/dispatch",
            contentType: "application/json",
            hasBody: true,
          },
          message: "Parses POST request with body and lowercase header key.",
        },
      ],
      hints: [
        "Extract pathname with `rawEnvelope.url.split('?')[0]`.",
        "Look for `headers['content-type']` or `headers['Content-Type']`.",
        "Check `hasBody: Boolean(rawEnvelope.body && String(rawEnvelope.body).trim().length > 0)`.",
      ],
      solution: `function parseHttpEnvelope(rawEnvelope) {
  const method = (rawEnvelope.method || "GET").toUpperCase();
  const pathname = (rawEnvelope.url || "").split("?")[0];
  
  let contentType = "text/plain";
  if (rawEnvelope.headers) {
    for (const [key, val] of Object.entries(rawEnvelope.headers)) {
      if (key.toLowerCase() === "content-type") {
        contentType = val;
        break;
      }
    }
  }

  const hasBody = Boolean(rawEnvelope.body && String(rawEnvelope.body).trim().length > 0);

  return {
    method,
    pathname,
    contentType,
    hasBody,
  };
}`,
      solutionExplanation:
        "HTTP envelopes separate methods, URLs, headers, and payload bodies to deliver clear instructions to backend servers.",
      requirements: [
        { id: "req-h02-01", label: "Parses HTTP envelope components cleanly", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 03: The Route Map
  // -------------------------------------------------------------
  {
    id: "harbor-03",
    worldId: "api-harbor",
    number: "03",
    title: "The Route Map: Endpoints & HTTP Methods",
    world: "api-harbor",
    type: "lesson",
    xp: 170,
    skillId: "rest-architecture",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Beginner",
    estimatedTime: 7,
    description: "Map CRUD operations to RESTful HTTP verbs: GET, POST, PUT, PATCH, and DELETE.",
    concepts: ["REST", "GET", "POST", "PUT", "PATCH", "DELETE", "Resource Endpoints"],
    content: [
      {
        type: "paragraph",
        text: "🗺️ Harbor masters navigate with the Route Map. In RESTful API architecture, HTTP methods indicate the desired action on a resource endpoint.",
      },
      {
        type: "heading",
        text: "The REST Method Matrix",
      },
      {
        type: "paragraph",
        text: "- `GET /ships`: Read ship collection\n- `GET /ships/42`: Read single ship #42\n- `POST /ships`: Create a new ship\n- `PUT /ships/42`: Completely replace ship #42\n- `PATCH /ships/42`: Partially update ship #42 (e.g. status only)\n- `DELETE /ships/42`: Remove ship #42",
      },
      {
        type: "tip",
        text: "Endpoints represent *nouns* (resources like `/ships`, `/cargo`), while HTTP methods represent *verbs* (actions).",
      },
    ],
    challenge: {
      id: "challenge-h03",
      lessonId: "harbor-03",
      title: "The Route Map: Endpoints & HTTP Methods",
      prompt:
        "Implement `buildRestRoute(resource, action, id)` to construct standardized REST endpoints:\n\n- `'list'`: `{ method: 'GET', endpoint: '/' + resource }`\n- `'read'`: `{ method: 'GET', endpoint: '/' + resource + '/' + id }`\n- `'create'`: `{ method: 'POST', endpoint: '/' + resource }`\n- `'update'`: `{ method: 'PUT', endpoint: '/' + resource + '/' + id }`\n- `'patch'`: `{ method: 'PATCH', endpoint: '/' + resource + '/' + id }`\n- `'delete'`: `{ method: 'DELETE', endpoint: '/' + resource + '/' + id }`",
      starterCode: `function buildRestRoute(resource, action, id) {
  // Return the REST route definition:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "buildRestRoute",
          args: ["ships", "list"],
          expected: { method: "GET", endpoint: "/ships" },
          message: "Builds GET collection route.",
        },
        {
          type: "function",
          functionName: "buildRestRoute",
          args: ["ships", "create"],
          expected: { method: "POST", endpoint: "/ships" },
          message: "Builds POST create route.",
        },
        {
          type: "function",
          functionName: "buildRestRoute",
          args: ["ships", "read", "ship-01"],
          expected: { method: "GET", endpoint: "/ships/ship-01" },
          message: "Builds GET single item route with ID.",
        },
        {
          type: "function",
          functionName: "buildRestRoute",
          args: ["cargo", "patch", "cargo-99"],
          expected: { method: "PATCH", endpoint: "/cargo/cargo-99" },
          message: "Builds PATCH route with ID.",
        },
        {
          type: "function",
          functionName: "buildRestRoute",
          args: ["cargo", "delete", "cargo-99"],
          expected: { method: "DELETE", endpoint: "/cargo/cargo-99" },
          message: "Builds DELETE route with ID.",
        },
      ],
      hints: [
        "Use a switch or object lookup for the action.",
        "Append `id` to the endpoint for item-level actions like read, update, patch, and delete.",
      ],
      solution: `function buildRestRoute(resource, action, id) {
  const base = "/" + resource;
  switch (action) {
    case "list":
      return { method: "GET", endpoint: base };
    case "create":
      return { method: "POST", endpoint: base };
    case "read":
      return { method: "GET", endpoint: base + "/" + id };
    case "update":
      return { method: "PUT", endpoint: base + "/" + id };
    case "patch":
      return { method: "PATCH", endpoint: base + "/" + id };
    case "delete":
      return { method: "DELETE", endpoint: base + "/" + id };
    default:
      return { method: "GET", endpoint: base };
  }
}`,
      solutionExplanation:
        "REST APIs pair consistent resource endpoints with standard HTTP verbs to create predictable interfaces.",
      requirements: [
        { id: "req-h03-01", label: "Generates correct REST method and endpoint pairs", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 04: The JSON Cargo
  // -------------------------------------------------------------
  {
    id: "harbor-04",
    worldId: "api-harbor",
    number: "04",
    title: "The JSON Cargo: Serialization & Manifest Transforms",
    world: "api-harbor",
    type: "lesson",
    xp: 180,
    skillId: "json-data-pipelines",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Beginner",
    estimatedTime: 8,
    description: "Parse incoming JSON data, manipulate nested objects and arrays, and serialize payloads.",
    concepts: ["JSON.parse()", "JSON.stringify()", "Data Serialization", "Deep Manifest Transformation"],
    content: [
      {
        type: "paragraph",
        text: "📦 Cargo manifests are transported across the network as serialized JSON (JavaScript Object Notation) text. Applications must parse JSON strings into objects, update them, and serialize them back.",
      },
      {
        type: "heading",
        text: "JSON Parsing and Stringifying",
      },
      {
        type: "code",
        code: `// JSON String from server
const rawJson = '{"port":"Eldoria","items":["Timber","Silk"]}';

// Parse into live JS Object
const manifest = JSON.parse(rawJson);
manifest.items.push("Spices");

// Serialize back into JSON String
const payload = JSON.stringify(manifest);`,
      },
      {
        type: "tip",
        text: "JSON supports strings, numbers, booleans, arrays, objects, and `null`, but cannot store functions or undefined values.",
      },
    ],
    challenge: {
      id: "challenge-h04",
      lessonId: "harbor-04",
      title: "The JSON Cargo: Serialization & Manifest Transforms",
      prompt:
        "Implement `processCargoManifest(jsonString, newItem)`:\n1. Parse `jsonString` into an object with `{ port, items: [{ name, weight }] }`.\n2. Append `newItem` (`{ name, weight }`) to `manifest.items`.\n3. Compute `totalWeight`: sum of all item weights.\n4. Add `totalWeight` and `updatedAt: '2026-09-19'` to the manifest object.\n5. Return the updated manifest as a serialized JSON string.",
      starterCode: `function processCargoManifest(jsonString, newItem) {
  // Parse JSON, append newItem, compute totalWeight, and return JSON string:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "processCargoManifest",
          args: [
            '{"port":"Eldoria Harbor","items":[{"name":"Timber","weight":500},{"name":"Iron","weight":1200}]}',
            { name: "Silk", weight: 300 },
          ],
          expected: JSON.stringify({
            port: "Eldoria Harbor",
            items: [
              { name: "Timber", weight: 500 },
              { name: "Iron", weight: 1200 },
              { name: "Silk", weight: 300 },
            ],
            totalWeight: 2000,
            updatedAt: "2026-09-19",
          }),
          message: "Parses manifest, appends item, calculates total weight, and serializes JSON.",
        },
      ],
      hints: [
        "Use `const data = JSON.parse(jsonString);`",
        "Add item with `data.items.push(newItem);`",
        "Compute `data.totalWeight = data.items.reduce((sum, item) => sum + item.weight, 0);`",
        "Return `JSON.stringify(data);`",
      ],
      solution: `function processCargoManifest(jsonString, newItem) {
  const data = JSON.parse(jsonString);
  data.items.push(newItem);
  data.totalWeight = data.items.reduce((sum, item) => sum + item.weight, 0);
  data.updatedAt = "2026-09-19";
  return JSON.stringify(data);
}`,
      solutionExplanation:
        "JSON.parse converts network string payloads into mutable JavaScript structures, while JSON.stringify encodes objects for transmission.",
      requirements: [
        { id: "req-h04-01", label: "Parses, transforms, and stringifies JSON manifest", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 05: The GET Expedition
  // -------------------------------------------------------------
  {
    id: "harbor-05",
    worldId: "api-harbor",
    number: "05",
    title: "The GET Expedition: Fetching Remote Data",
    world: "api-harbor",
    type: "lesson",
    xp: 190,
    skillId: "fetch-http",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Fetch remote resources asynchronously using the Fetch API and async/await syntax.",
    concepts: ["fetch()", "GET Request", "response.json()", "async / await", "Promises"],
    content: [
      {
        type: "paragraph",
        text: "⛵ Scouts embark on the GET Expedition to retrieve ship registries from the harbor master API. `fetch()` sends an HTTP GET request and returns a Promise resolving to a Response.",
      },
      {
        type: "heading",
        text: "Async Fetching Pattern",
      },
      {
        type: "code",
        code: `async function loadShips() {
  const response = await mockApi.get("/ships");
  const ships = await response.json();
  return ships;
}`,
      },
      {
        type: "tip",
        text: "Notice there are two `await` calls: one to await the network Response headers, and a second `await response.json()` to parse the incoming JSON stream.",
      },
    ],
    challenge: {
      id: "challenge-h05",
      lessonId: "harbor-05",
      title: "The GET Expedition: Fetching Remote Data",
      prompt:
        "Implement `fetchShipRegistry(mockApi)` as an `async` function. Send a GET request to `'/ships'`, parse the JSON response, and return an array of ship names (e.g. `['The Sea Serpent', 'Northern Star', 'Golden Galleon']`).",
      starterCode: `async function fetchShipRegistry(api) {
  // Fetch /ships, parse JSON, and return array of ship names:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "fetchShipRegistry",
          args: [null],
          expected: ["The Sea Serpent", "Northern Star", "Golden Galleon"],
          message: "Fetches ships and extracts ship name strings.",
        },
      ],
      hints: [
        "Call `const response = await (api || mockApi).get('/ships');`",
        "Parse data with `const ships = await response.json();`",
        "Return `ships.map(s => s.name);`",
      ],
      solution: `async function fetchShipRegistry(api) {
  const client = api || mockApi;
  const response = await client.get("/ships");
  const ships = await response.json();
  return ships.map((ship) => ship.name);
}`,
      solutionExplanation:
        "Async/await provides clean, readable syntax for handling asynchronous network requests and JSON deserialization.",
      requirements: [
        { id: "req-h05-01", label: "Fetches remote data and extracts ship names with async/await", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 06: The POST Dock
  // -------------------------------------------------------------
  {
    id: "harbor-06",
    worldId: "api-harbor",
    number: "06",
    title: "The POST Dock: Sending Data to the Server",
    world: "api-harbor",
    type: "lesson",
    xp: 200,
    skillId: "fetch-http",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Send POST requests with JSON payloads and Content-Type headers to create new records.",
    concepts: ["POST", "Content-Type: application/json", "body: JSON.stringify", "201 Created"],
    content: [
      {
        type: "paragraph",
        text: "🏗️ At the POST Dock, new vessels register in the harbor database. Creating new resources requires sending an HTTP POST request containing headers and a serialized body.",
      },
      {
        type: "heading",
        text: "POST Request Architecture",
      },
      {
        type: "code",
        code: `const newShip = { name: "Storm Chaser", captain: "Rowan", cargo: "Spices" };

const response = await mockApi.post("/ships", newShip, {
  headers: { "Content-Type": "application/json" }
});
const created = await response.json();`,
      },
      {
        type: "tip",
        text: "A successful POST request typically returns an HTTP status code of `201 Created` along with the created object containing a server-generated ID.",
      },
    ],
    challenge: {
      id: "challenge-h06",
      lessonId: "harbor-06",
      title: "The POST Dock: Sending Data to the Server",
      prompt:
        "Implement `registerNewShip(api, shipData)` as an `async` function. Send a POST request to `'/ships'` with `shipData`. Parse and return the newly created ship record, ensuring it has `{ success: true, ship: createdRecord }`.",
      starterCode: `async function registerNewShip(api, shipData) {
  // Send POST request with shipData and return confirmation object:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "registerNewShip",
          args: [
            null,
            { name: "Kraken Voyager", captain: "Lyra", cargo: "Lapis Lazuli" },
          ],
          expected: {
            success: true,
            ship: {
              id: "ship-kraken-voyager",
              name: "Kraken Voyager",
              captain: "Lyra",
              cargo: "Lapis Lazuli",
              registered: true,
            },
          },
          message: "Posts new ship data and returns standardized confirmation object.",
        },
      ],
      hints: [
        "Call `const client = api || mockApi;`",
        "Send POST with `const res = await client.post('/ships', shipData);`",
        "Parse with `const created = await res.json();` and return `{ success: true, ship: created }`.",
      ],
      solution: `async function registerNewShip(api, shipData) {
  const client = api || mockApi;
  const response = await client.post("/ships", shipData);
  const ship = await response.json();
  return {
    success: true,
    ship,
  };
}`,
      solutionExplanation:
        "POST requests deliver payload data to the server endpoint, receiving back confirmation and generated entity keys.",
      requirements: [
        { id: "req-h06-01", label: "Sends POST request and returns created record confirmation", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 07: The Update Wharf
  // -------------------------------------------------------------
  {
    id: "harbor-07",
    worldId: "api-harbor",
    number: "07",
    title: "The Update Wharf: Modifying Resources with PUT & PATCH",
    world: "api-harbor",
    type: "lesson",
    xp: 210,
    skillId: "rest-architecture",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Distinguish and apply PUT (full replacement) and PATCH (partial update) requests.",
    concepts: ["PUT (Full Replacement)", "PATCH (Partial Update)", "Resource IDs", "Status 200 OK"],
    content: [
      {
        type: "paragraph",
        text: "🛠️ Ships docked at the Update Wharf receive maintenance. When updating data on a server, REST defines two distinct methods: `PUT` for complete record replacement and `PATCH` for partial field updates.",
      },
      {
        type: "heading",
        text: "PUT vs PATCH",
      },
      {
        type: "code",
        code: `// PATCH: updates only the status field
await mockApi.patch("/ships/ship-01", { status: "maintenance" });

// PUT: replaces the entire ship object
await mockApi.put("/ships/ship-01", {
  id: "ship-01",
  name: "The Sea Serpent",
  captain: "Rowan",
  cargo: "Timber",
  status: "repaired"
});`,
      },
      {
        type: "tip",
        text: "Use `PATCH` whenever you only need to change one or two properties without sending the whole object.",
      },
    ],
    challenge: {
      id: "challenge-h07",
      lessonId: "harbor-07",
      title: "The Update Wharf: Modifying Resources with PUT & PATCH",
      prompt:
        "Implement `updateShipStatus(api, shipId, newStatus)` as an `async` function:\n1. Send a PATCH request to `'/ships/' + shipId` with payload `{ status: newStatus }`.\n2. Parse the JSON response.\n3. Return `{ updated: true, shipId, status: newStatus }`.",
      starterCode: `async function updateShipStatus(api, shipId, newStatus) {
  // Send PATCH request and return update confirmation:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "updateShipStatus",
          args: [null, "ship-01", "ready-to-sail"],
          expected: { updated: true, shipId: "ship-01", status: "ready-to-sail" },
          message: "Sends PATCH request to update status of ship-01.",
        },
      ],
      hints: [
        "Target endpoint `'/ships/' + shipId`.",
        "Call `const res = await (api || mockApi).patch('/ships/' + shipId, { status: newStatus });`",
        "Return `{ updated: true, shipId, status: newStatus }`.",
      ],
      solution: `async function updateShipStatus(api, shipId, newStatus) {
  const client = api || mockApi;
  const res = await client.patch("/ships/" + shipId, { status: newStatus });
  await res.json();
  return {
    updated: true,
    shipId,
    status: newStatus,
  };
}`,
      solutionExplanation:
        "PATCH requests target a specific resource URI and update only the provided fields in the database.",
      requirements: [
        { id: "req-h07-01", label: "Sends PATCH request to modify resource status", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 08: The Delete Dock
  // -------------------------------------------------------------
  {
    id: "harbor-08",
    worldId: "api-harbor",
    number: "08",
    title: "The Delete Dock: Removing Resources",
    world: "api-harbor",
    type: "lesson",
    xp: 210,
    skillId: "rest-architecture",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Send DELETE requests to remove resources and handle 204 No Content responses.",
    concepts: ["DELETE Method", "204 No Content", "Resource Decommissioning", "Idempotence"],
    content: [
      {
        type: "paragraph",
        text: "🗑️ Decommissioning derelict ships frees valuable slip space at the harbor docks. Sending an HTTP `DELETE` request asks the server to remove a designated resource.",
      },
      {
        type: "heading",
        text: "DELETE Request Flow",
      },
      {
        type: "code",
        code: `const response = await mockApi.delete("/ships/ship-03");
if (response.ok) {
  console.log("Ship deleted successfully.");
}`,
      },
      {
        type: "tip",
        text: "DELETE responses often return HTTP status `204 No Content` (meaning deletion succeeded with no body returned) or `200 OK` with confirmation JSON.",
      },
    ],
    challenge: {
      id: "challenge-h08",
      lessonId: "harbor-08",
      title: "The Delete Dock: Removing Resources",
      prompt:
        "Implement `decommissionShip(api, shipId)` as an `async` function. Send a DELETE request to `'/ships/' + shipId`. If the response is successful (`response.ok`), return `{ decommissioned: true, shipId }`. Otherwise, return `{ decommissioned: false, error: 'Failed to decommission' }`.",
      starterCode: `async function decommissionShip(api, shipId) {
  // Send DELETE request and return decommission result:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "decommissionShip",
          args: [null, "ship-03"],
          expected: { decommissioned: true, shipId: "ship-03" },
          message: "Decommissions ship-03 and returns success confirmation.",
        },
      ],
      hints: [
        "Call `const res = await (api || mockApi).delete('/ships/' + shipId);`",
        "Check `if (res.ok)` return `{ decommissioned: true, shipId }`.",
      ],
      solution: `async function decommissionShip(api, shipId) {
  const client = api || mockApi;
  const res = await client.delete("/ships/" + shipId);
  if (res.ok) {
    return {
      decommissioned: true,
      shipId,
    };
  }
  return {
    decommissioned: false,
    error: "Failed to decommission",
  };
}`,
      solutionExplanation:
        "DELETE requests remove records by targeting their unique URL path and checking response.ok for confirmation.",
      requirements: [
        { id: "req-h08-01", label: "Executes DELETE request and handles response status", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 09: The Status Lighthouse
  // -------------------------------------------------------------
  {
    id: "harbor-09",
    worldId: "api-harbor",
    number: "09",
    title: "The Status Lighthouse: HTTP Status Code Categories",
    world: "api-harbor",
    type: "lesson",
    xp: 220,
    skillId: "api-error-handling",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 8,
    description: "Master HTTP status codes across 2xx (Success), 3xx (Redirect), 4xx (Client Errors), and 5xx (Server Errors).",
    concepts: ["HTTP Status Codes", "200 OK", "201 Created", "400 Bad Request", "401 Unauthorized", "404 Not Found", "500 Server Error"],
    content: [
      {
        type: "paragraph",
        text: "🗼 The Status Lighthouse flashes color-coded signals to ships entering port. HTTP status codes inform clients about the outcome of their requests.",
      },
      {
        type: "heading",
        text: "Status Code Numbering Families",
      },
      {
        type: "paragraph",
        text: "- **2xx Success**: `200 OK`, `201 Created`, `204 No Content`\n- **3xx Redirection**: `301 Moved Permanently`, `304 Not Modified`\n- **4xx Client Error**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`\n- **5xx Server Error**: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`",
      },
      {
        type: "tip",
        text: "4xx errors mean the client sent an invalid request (bad data, missing token), while 5xx errors mean the server crashed or encountered an internal fault.",
      },
    ],
    challenge: {
      id: "challenge-h09",
      lessonId: "harbor-09",
      title: "The Status Lighthouse: HTTP Status Code Categories",
      prompt:
        "Implement `interpretStatusCode(status)` to translate status codes into diagnostics:\n\n- `200`: `{ category: 'Success', meaning: 'OK', canRetry: false }`\n- `201`: `{ category: 'Success', meaning: 'Created', canRetry: false }`\n- `400`: `{ category: 'Client Error', meaning: 'Bad Request', canRetry: false }`\n- `401`: `{ category: 'Client Error', meaning: 'Unauthorized', canRetry: false }`\n- `404`: `{ category: 'Client Error', meaning: 'Not Found', canRetry: false }`\n- `500`: `{ category: 'Server Error', meaning: 'Internal Server Error', canRetry: true }`\n- `503`: `{ category: 'Server Error', meaning: 'Service Unavailable', canRetry: true }`\n- Any other code: `{ category: 'Unknown', meaning: 'Unknown Status', canRetry: false }`",
      starterCode: `function interpretStatusCode(status) {
  // Return status diagnostic object:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "interpretStatusCode",
          args: [200],
          expected: { category: "Success", meaning: "OK", canRetry: false },
          message: "Interprets 200 OK.",
        },
        {
          type: "function",
          functionName: "interpretStatusCode",
          args: [404],
          expected: { category: "Client Error", meaning: "Not Found", canRetry: false },
          message: "Interprets 404 Not Found.",
        },
        {
          type: "function",
          functionName: "interpretStatusCode",
          args: [503],
          expected: { category: "Server Error", meaning: "Service Unavailable", canRetry: true },
          message: "Interprets 503 Service Unavailable.",
        },
      ],
      hints: [
        "Use a switch statement matching `status` numbers.",
        "Server errors (500, 503) indicate temporary issues and allow `canRetry: true`.",
      ],
      solution: `function interpretStatusCode(status) {
  switch (status) {
    case 200:
      return { category: "Success", meaning: "OK", canRetry: false };
    case 201:
      return { category: "Success", meaning: "Created", canRetry: false };
    case 400:
      return { category: "Client Error", meaning: "Bad Request", canRetry: false };
    case 401:
      return { category: "Client Error", meaning: "Unauthorized", canRetry: false };
    case 404:
      return { category: "Client Error", meaning: "Not Found", canRetry: false };
    case 500:
      return { category: "Server Error", meaning: "Internal Server Error", canRetry: true };
    case 503:
      return { category: "Server Error", meaning: "Service Unavailable", canRetry: true };
    default:
      return { category: "Unknown", meaning: "Unknown Status", canRetry: false };
  }
}`,
      solutionExplanation:
        "Categorizing status codes allows clients to react appropriately — updating state on success or prompting re-authentication on 401.",
      requirements: [
        { id: "req-h09-01", label: "Maps HTTP status codes to categories and retry policies", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 10: The Error Storm
  // -------------------------------------------------------------
  {
    id: "harbor-10",
    worldId: "api-harbor",
    number: "10",
    title: "The Error Storm: try/catch & Graceful Fallbacks",
    world: "api-harbor",
    type: "lesson",
    xp: 230,
    skillId: "api-error-handling",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Intermediate",
    estimatedTime: 9,
    description: "Handle network disconnects and HTTP error codes using try/catch blocks and fallback state.",
    concepts: ["try ... catch", "response.ok", "Network Failures", "Fallback UI State"],
    content: [
      {
        type: "paragraph",
        text: "⛈️ Violent storm squalls sever communication wires. In production web applications, network requests will occasionally fail. Robust software always wraps requests in `try ... catch` and checks `response.ok`.",
      },
      {
        type: "heading",
        text: "The Two Types of Fetch Errors",
      },
      {
        type: "paragraph",
        text: "1. **Network Disconnect / Timeout**: `fetch()` throws an exception (handled by `catch`).\n2. **HTTP Errors (404, 500)**: `fetch()` does *not* throw! It returns a response where `response.ok === false`.",
      },
      {
        type: "code",
        code: `try {
  const res = await mockApi.get("/harbor/status");
  if (!res.ok) {
    throw new Error("HTTP error " + res.status);
  }
  const data = await res.json();
  return { success: true, data };
} catch (err) {
  return { success: false, fallback: defaultStatus };
}`,
      },
      {
        type: "tip",
        text: "Always check `response.ok` before calling `response.json()`.",
      },
    ],
    challenge: {
      id: "challenge-h10",
      lessonId: "harbor-10",
      title: "The Error Storm: try/catch & Graceful Fallbacks",
      prompt:
        "Implement `safeFetchData(api, endpoint, fallbackData)` as an `async` function:\n1. Use `try ... catch` to execute `await api.get(endpoint)`.\n2. If `res.ok`, parse and return `{ success: true, data: await res.json() }`.\n3. If `!res.ok` or if an error is thrown, catch it and return `{ success: false, data: fallbackData, error: true }`.",
      starterCode: `async function safeFetchData(api, endpoint, fallbackData) {
  // Fetch with try/catch and fallback data:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "safeFetchData",
          args: [null, "/harbor/status", { status: "offline" }],
          expected: {
            success: true,
            data: { status: "clear", activeShips: 12, portOpen: true, windSpeed: "14 knots" },
          },
          message: "Returns successful data when endpoint is reachable.",
        },
        {
          type: "function",
          functionName: "safeFetchData",
          args: [null, "/temp/error", { status: "offline", activeShips: 0 }],
          expected: {
            success: false,
            data: { status: "offline", activeShips: 0 },
            error: true,
          },
          message: "Catches 503 error and returns fallback data safely.",
        },
      ],
      hints: [
        "Wrap the get and json call in `try { ... } catch (e) { ... }`.",
        "Check `if (!res.ok) throw new Error();` inside try.",
        "In catch, return `{ success: false, data: fallbackData, error: true }`.",
      ],
      solution: `async function safeFetchData(api, endpoint, fallbackData) {
  const client = api || mockApi;
  try {
    const res = await client.get(endpoint);
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const data = await res.json();
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      data: fallbackData,
      error: true,
    };
  }
}`,
      solutionExplanation:
        "Safe fetch pipelines catch network failures and non-200 responses, preventing uncaught exceptions and ensuring UI stability.",
      requirements: [
        { id: "req-h10-01", label: "Handles network errors and returns fallback payloads", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 11: The Async Tide
  // -------------------------------------------------------------
  {
    id: "harbor-11",
    worldId: "api-harbor",
    number: "11",
    title: "The Async Tide: Concurrent Requests with Promise.all",
    world: "api-harbor",
    type: "lesson",
    xp: 240,
    skillId: "promises-async-await",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 9,
    description: "Execute concurrent requests in parallel using Promise.all to optimize data loading times.",
    concepts: ["Promise.all()", "Concurrent Fetching", "Data Aggregation", "Performance"],
    content: [
      {
        type: "paragraph",
        text: "🌊 When the high tide rises, multiple supply ships dock at once. Fetching requests sequentially (one after another) is slow. `Promise.all()` fires all requests concurrently.",
      },
      {
        type: "heading",
        text: "Sequential vs Concurrent Loading",
      },
      {
        type: "code",
        code: `// SLOW: Sequential (Total time = t1 + t2)
const ships = await (await mockApi.get("/ships")).json();
const status = await (await mockApi.get("/harbor/status")).json();

// FAST: Concurrent (Total time = max(t1, t2))
const [shipsRes, statusRes] = await Promise.all([
  mockApi.get("/ships"),
  mockApi.get("/harbor/status")
]);
const ships = await shipsRes.json();
const status = await statusRes.json();`,
      },
      {
        type: "tip",
        text: "Use `Promise.all` whenever requests are independent of each other.",
      },
    ],
    challenge: {
      id: "challenge-h11",
      lessonId: "harbor-11",
      title: "The Async Tide: Concurrent Requests with Promise.all",
      prompt:
        "Implement `loadHarborDashboard(api)` as an `async` function. Concurrently fetch `'/harbor/status'` and `'/ships'` using `Promise.all()`. Return an aggregated dashboard object:\n\n`{ portStatus: statusData.status, shipCount: shipsData.length, ships: shipsData.map(s => s.name) }`.",
      starterCode: `async function loadHarborDashboard(api) {
  // Concurrently load status and ships with Promise.all:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "loadHarborDashboard",
          args: [null],
          expected: {
            portStatus: "clear",
            shipCount: 3,
            ships: ["The Sea Serpent", "Northern Star", "Golden Galleon"],
          },
          message: "Loads status and ships concurrently and aggregates dashboard.",
        },
      ],
      hints: [
        "Call `const [res1, res2] = await Promise.all([client.get('/harbor/status'), client.get('/ships')]);`",
        "Parse both responses: `const status = await res1.json(); const ships = await res2.json();`",
        "Return the aggregated summary object.",
      ],
      solution: `async function loadHarborDashboard(api) {
  const client = api || mockApi;
  const [statusRes, shipsRes] = await Promise.all([
    client.get("/harbor/status"),
    client.get("/ships"),
  ]);

  const statusData = await statusRes.json();
  const shipsData = await shipsRes.json();

  return {
    portStatus: statusData.status,
    shipCount: shipsData.length,
    ships: shipsData.map((s) => s.name),
  };
}`,
      solutionExplanation:
        "Promise.all runs promises in parallel, dramatically cutting dashboard load times by eliminating sequential network waiting.",
      requirements: [
        { id: "req-h11-01", label: "Fetches endpoints concurrently with Promise.all", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 12: The Harbor Guard
  // -------------------------------------------------------------
  {
    id: "harbor-12",
    worldId: "api-harbor",
    number: "12",
    title: "The Harbor Guard: Authorization & Bearer Tokens",
    world: "api-harbor",
    type: "lesson",
    xp: 250,
    skillId: "fetch-http",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 9,
    description: "Secure API communication with Authorization headers, Bearer tokens, and 401 handling.",
    concepts: ["Authorization Header", "Bearer Tokens", "401 Unauthorized", "Protected Endpoints"],
    content: [
      {
        type: "paragraph",
        text: "🛡️ The Royal Citadel gates are watched by the Harbor Guard. Confidential manifests require authorization tokens sent inside HTTP request headers.",
      },
      {
        type: "heading",
        text: "Bearer Token Authentication",
      },
      {
        type: "code",
        code: `const token = "secret-token-xyz";

const response = await mockApi.get("/admin/manifest", {
  headers: {
    "Authorization": \`Bearer \${token}\`
  }
});`,
      },
      {
        type: "tip",
        text: "The standard format for token auth is `Authorization: Bearer <token_string>`.",
      },
    ],
    challenge: {
      id: "challenge-h12",
      lessonId: "harbor-12",
      title: "The Harbor Guard: Authorization & Bearer Tokens",
      prompt:
        "Implement `fetchAuthorizedManifest(api, token)` as an `async` function:\n1. Send GET request to `'/admin/manifest'` with `headers: { 'Authorization': 'Bearer ' + token }`.\n2. If response status is 401, return `{ authorized: false, error: 'Invalid or missing credentials' }`.\n3. If `response.ok`, parse and return `{ authorized: true, manifest: await response.json() }`.",
      starterCode: `async function fetchAuthorizedManifest(api, token) {
  // Fetch /admin/manifest with Bearer authorization header:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "fetchAuthorizedManifest",
          args: [null, "imperial-token-99"],
          expected: {
            authorized: true,
            manifest: { clearance: "Imperial", fleetCode: "VANGUARD-77", confidential: true },
          },
          message: "Authenticates with valid token and retrieves protected manifest.",
        },
        {
          type: "function",
          functionName: "fetchAuthorizedManifest",
          args: [null, "invalid-token"],
          expected: {
            authorized: false,
            error: "Invalid or missing credentials",
          },
          message: "Rejects invalid token and returns authorization error.",
        },
      ],
      hints: [
        "Include `headers: { 'Authorization': 'Bearer ' + token }` in options.",
        "Check `if (res.status === 401)` return `{ authorized: false, error: 'Invalid or missing credentials' }`.",
      ],
      solution: `async function fetchAuthorizedManifest(api, token) {
  const client = api || mockApi;
  const res = await client.get("/admin/manifest", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (res.status === 401) {
    return {
      authorized: false,
      error: "Invalid or missing credentials",
    };
  }

  const manifest = await res.json();
  return {
    authorized: true,
    manifest,
  };
}`,
      solutionExplanation:
        "Authorization headers authenticate requests on protected endpoints, allowing servers to verify identity before granting access.",
      requirements: [
        { id: "req-h12-01", label: "Sends Bearer token in Authorization header", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 13: The Data Pipeline
  // -------------------------------------------------------------
  {
    id: "harbor-13",
    worldId: "api-harbor",
    number: "13",
    title: "The Data Pipeline: Transforming API Payloads",
    world: "api-harbor",
    type: "lesson",
    xp: 250,
    skillId: "json-data-pipelines",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 10,
    description: "Normalize raw, nested backend payloads into clean data models optimized for UI components.",
    concepts: ["Data Normalization", "Array Mapping", "Aggregations", "Payload Sanitization"],
    content: [
      {
        type: "paragraph",
        text: "⚡ Raw backend feeds contain redundant IDs, snake_case keys, and nested structures. Data pipelines sanitize and project server payloads into sleek frontend data models.",
      },
      {
        type: "heading",
        text: "Payload Normalization",
      },
      {
        type: "code",
        code: `// Raw Backend Feed ──▶ [Transformation Pipeline] ──▶ UI Component State`,
      },
      {
        type: "tip",
        text: "Transform raw data immediately upon receiving it so your UI components receive clean, predictable props.",
      },
    ],
    challenge: {
      id: "challenge-h13",
      lessonId: "harbor-13",
      title: "The Data Pipeline: Transforming API Payloads",
      prompt:
        "Implement `transformShipManifest(rawPayload)` to transform an API manifest object:\n\nInput:\n`{ port: string, items: [{ id, name, weight, destination }] }`\n\nOutput:\n- `portName`: uppercase string (e.g. `'ELDORIA HARBOR'`)\n- `itemCount`: total number of items\n- `heavyItems`: array of item names where `weight >= 1000`\n- `destinations`: array of unique destination strings",
      starterCode: `function transformShipManifest(rawPayload) {
  // Transform and normalize manifest payload:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "transformShipManifest",
          args: [
            {
              port: "Eldoria Harbor",
              items: [
                { id: "item-1", name: "Ancient Relic", weight: 350, destination: "High Citadel" },
                { id: "item-2", name: "Silk Bundles", weight: 1200, destination: "Merchant Guild" },
                { id: "item-3", name: "Iron Ores", weight: 2650, destination: "Forge Quarter" },
                { id: "item-4", name: "Spices", weight: 1500, destination: "Merchant Guild" },
              ],
            },
          ],
          expected: {
            portName: "ELDORIA HARBOR",
            itemCount: 4,
            heavyItems: ["Silk Bundles", "Iron Ores", "Spices"],
            destinations: ["High Citadel", "Merchant Guild", "Forge Quarter"],
          },
          message: "Transforms raw manifest into normalized statistics and unique destinations.",
        },
      ],
      hints: [
        "Get unique destinations using `Array.from(new Set(rawPayload.items.map(i => i.destination)))`.",
        "Filter `heavyItems` with `rawPayload.items.filter(i => i.weight >= 1000).map(i => i.name)`.",
      ],
      solution: `function transformShipManifest(rawPayload) {
  const items = rawPayload.items || [];
  const portName = (rawPayload.port || "").toUpperCase();
  const itemCount = items.length;
  const heavyItems = items.filter((i) => i.weight >= 1000).map((i) => i.name);
  const destinations = Array.from(new Set(items.map((i) => i.destination)));

  return {
    portName,
    itemCount,
    heavyItems,
    destinations,
  };
}`,
      solutionExplanation:
        "Data pipelines isolate backend schema details from frontend presentation logic, improving maintainability.",
      requirements: [
        { id: "req-h13-01", label: "Normalizes payload into clean summary model", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 14: The API Testing Bay
  // -------------------------------------------------------------
  {
    id: "harbor-14",
    worldId: "api-harbor",
    number: "14",
    title: "The API Testing Bay: Resilient Retry Algorithms",
    world: "api-harbor",
    type: "lesson",
    xp: 260,
    skillId: "api-error-handling",
    skillProgress: 6,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 10,
    description: "Implement exponential retry loops to automatically recover from temporary 503 server glitches.",
    concepts: ["Retry Loops", "Transient Fault Handling", "Service Resilience", "Async Recursion"],
    content: [
      {
        type: "paragraph",
        text: "🔬 In the Testing Bay, harbor telemetry engineers build resilient request wrappers. When servers encounter temporary glitches (503), automated retry loops re-attempt the request.",
      },
      {
        type: "heading",
        text: "Retry Loop Pattern",
      },
      {
        type: "code",
        code: `for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
    const res = await api.get(url);
    if (res.ok) return await res.json();
  } catch (err) {
    if (attempt === maxRetries) throw err;
  }
}`,
      },
      {
        type: "tip",
        text: "Only retry idempotent operations (like GET) or transient server errors (like 503 Service Unavailable).",
      },
    ],
    challenge: {
      id: "challenge-h14",
      lessonId: "harbor-14",
      title: "The API Testing Bay: Resilient Retry Algorithms",
      prompt:
        "Implement `fetchWithRetry(api, endpoint, maxRetries)` as an `async` function:\n1. Attempt to fetch `endpoint` using `api.get(endpoint)` up to `maxRetries` times.\n2. If `res.ok`, parse and return `{ success: true, attempts: currentAttemptNumber, data: await res.json() }`.\n3. If after `maxRetries` all attempts fail, return `{ success: false, attempts: maxRetries, error: 'Max retries exceeded' }`.",
      starterCode: `async function fetchWithRetry(api, endpoint, maxRetries = 3) {
  // Implement retry loop:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "fetchWithRetry",
          args: [null, "/ships", 3],
          expected: {
            success: true,
            attempts: 1,
            data: [
              { id: "ship-01", name: "The Sea Serpent", captain: "Rowan", cargo: "Lapis Lazuli", status: "docked" },
              { id: "ship-02", name: "Northern Star", captain: "Aria", cargo: "Spices", status: "sailing" },
              { id: "ship-03", name: "Golden Galleon", captain: "Lyra", cargo: "Gold Bullion", status: "loading" },
            ],
          },
          message: "Succeeds on first attempt for healthy endpoint.",
        },
        {
          type: "function",
          functionName: "fetchWithRetry",
          args: [null, "/temp/error", 3],
          expected: {
            success: false,
            attempts: 3,
            error: "Max retries exceeded",
          },
          message: "Retries up to maxRetries on 503 before returning structured error.",
        },
      ],
      hints: [
        "Use a loop `for (let i = 1; i <= maxRetries; i++)`.",
        "Inside, `const res = await (api || mockApi).get(endpoint);`",
        "If `res.ok`, return `{ success: true, attempts: i, data: await res.json() }`.",
      ],
      solution: `async function fetchWithRetry(api, endpoint, maxRetries = 3) {
  const client = api || mockApi;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await client.get(endpoint);
      if (res && res.ok) {
        const data = await res.json();
        return {
          success: true,
          attempts: attempt,
          data,
        };
      }
    } catch (err) {
      // transient failure, continue loop
    }
  }

  return {
    success: false,
    attempts: maxRetries,
    error: "Max retries exceeded",
  };
}`,
      solutionExplanation:
        "Retry logic provides resilience against transient connection drops and server blips without crashing client applications.",
      requirements: [
        { id: "req-h14-01", label: "Implements resilient retry loop with attempt tracking", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 15: The Harbor Project (Mini Project)
  // -------------------------------------------------------------
  {
    id: "harbor-15",
    worldId: "api-harbor",
    number: "15",
    title: "The Harbor Project: Port Dispatcher Engine",
    world: "api-harbor",
    type: "lesson",
    xp: 300,
    skillId: "async-apis",
    skillProgress: 8,
    challengeType: "javascript",
    difficulty: "Advanced",
    estimatedTime: 12,
    description: "Combine GET, POST, error handling, and payload transforms into a unified Port Dispatcher client.",
    concepts: ["Mini Project", "API Client Architecture", "CRUD Operations", "Data Aggregation"],
    content: [
      {
        type: "paragraph",
        text: "🚢 You have arrived at the Grand Dispatcher Guild! Here you unify all your network engineering skills — GET querying, POST resource registration, error guards, and payload aggregation — into a complete Port Dispatcher Client.",
      },
      {
        type: "heading",
        text: "The Port Dispatcher Interface",
      },
      {
        type: "paragraph",
        text: "The client will encapsulate methods:\n- `getFleetOverview()`: loads ships and returns total count and active names\n- `dispatchNewVessel(vessel)`: posts a new ship to the harbor\n- `getManifestWeight()`: calculates total cargo weight across the port",
      },
      {
        type: "tip",
        text: "Encapsulating API calls inside an API Client object keeps components decoupled and easy to test.",
      },
    ],
    challenge: {
      id: "challenge-h15",
      lessonId: "harbor-15",
      title: "The Harbor Project: Port Dispatcher Engine",
      prompt:
        "Implement `createHarborDispatcher(api)` that returns an API client object with methods:\n\n1. `async getFleetOverview()`: GET `'/ships'`, returns `{ total: number, names: string[] }`.\n2. `async dispatchNewVessel(vessel)`: POST `'/ships'` with `vessel`, returns created record.\n3. `async getManifestWeight()`: GET `'/cargo/manifest'`, returns `manifest.totalWeight` number.",
      starterCode: `function createHarborDispatcher(api) {
  // Return harbor dispatcher client with getFleetOverview, dispatchNewVessel, and getManifestWeight:
  
}`,
      tests: [
        {
          type: "expression",
          expression: "typeof createHarborDispatcher === 'function' && typeof createHarborDispatcher(mockApi).getFleetOverview === 'function'",
          message: "Dispatcher client includes getFleetOverview() method.",
        },
        {
          type: "expression",
          expression: "typeof createHarborDispatcher === 'function' && typeof createHarborDispatcher(mockApi).dispatchNewVessel === 'function'",
          message: "Dispatcher client includes dispatchNewVessel() method.",
        },
        {
          type: "expression",
          expression: "typeof createHarborDispatcher === 'function' && typeof createHarborDispatcher(mockApi).getManifestWeight === 'function'",
          message: "Dispatcher client includes getManifestWeight() method.",
        },
      ],
      hints: [
        "Return an object containing `isDispatcher: true`, `getFleetOverview`, `dispatchNewVessel`, and `getManifestWeight`.",
        "Implement each method as an `async` function using the passed `api || mockApi`.",
      ],
      solution: `function createHarborDispatcher(api) {
  const client = api || mockApi;

  return {
    isDispatcher: true,
    async getFleetOverview() {
      const res = await client.get("/ships");
      const ships = await res.json();
      return {
        total: ships.length,
        names: ships.map((s) => s.name),
      };
    },
    async dispatchNewVessel(vessel) {
      const res = await client.post("/ships", vessel);
      return await res.json();
    },
    async getManifestWeight() {
      const res = await client.get("/cargo/manifest");
      const manifest = await res.json();
      return manifest.totalWeight;
    },
  };
}`,
      solutionExplanation:
        "The Dispatcher client encapsulates network endpoints, providing clean domain-level functions for application components.",
      requirements: [
        { id: "req-h15-01", label: "Constructs complete Port Dispatcher API client", type: "function" },
      ],
    },
  },

  // -------------------------------------------------------------
  // Mission 16: THE API HARBOR GUARDIAN (Final Boss)
  // -------------------------------------------------------------
  {
    id: "harbor-16",
    worldId: "api-harbor",
    number: "16",
    title: "The API Harbor Guardian: Rebuilding the Port Network",
    world: "api-harbor",
    type: "boss",
    xp: 750,
    skillId: "async-apis",
    skillProgress: 10,
    challengeType: "javascript",
    difficulty: "Boss",
    estimatedTime: 15,
    description: "Defeat the Harbor Guardian by rebuilding the master port network orchestrator to unlock World 5: The Backend Citadel!",
    concepts: ["Boss Battle", "Authentication", "Concurrent Requests", "PATCH Mutations", "Payload Normalization", "Error Recovery"],
    content: [
      {
        type: "paragraph",
        text: "👑 The API Harbor Guardian towers above the Great Tidal Gate! A rogue electromagnetic storm has scrambled the port's network transmissions. To restore trade and unlock World 5: The Backend Citadel, you must orchestrate the complete Harbor Recovery Protocol.",
      },
      {
        type: "heading",
        text: "The Guardian's Protocol Checklist",
      },
      {
        type: "paragraph",
        text: "1. **Authenticate**: Fetch protected manifest from `'/admin/manifest'` with Bearer token `'imperial-token-99'`.\n2. **Concurrent Telemetry**: Fetch `'/harbor/status'` and `'/ships'` concurrently using `Promise.all()`.\n3. **Repair Status**: Send a PATCH request to `'/harbor/status'` setting `{ status: 'operational' }`.\n4. **Compile Report**: Return `{ authorized: true, portStatus: 'operational', fleetSize: ships.length, fleetClearance: manifest.clearance, healthy: true }`.",
      },
      {
        type: "tip",
        text: "Combine Bearer authentication, concurrent fetching, PATCH updating, and payload consolidation into a single master recovery routine.",
      },
    ],
    challenge: {
      id: "challenge-h16",
      lessonId: "harbor-16",
      title: "The API Harbor Guardian: Rebuilding the Port Network",
      prompt:
        "Defeat the Harbor Guardian by implementing `repairHarborNetwork(api, token)` as an `async` function:\n\n1. Authenticate with `api.get('/admin/manifest', { headers: { Authorization: 'Bearer ' + token } })`. If unauthorized (status 401), return `{ authorized: false, error: 'Authentication Failed' }`.\n2. Concurrently fetch `'/harbor/status'` and `'/ships'` using `Promise.all`.\n3. Send PATCH request to `'/harbor/status'` with `{ status: 'operational' }`.\n4. Return the consolidated report:\n`{ authorized: true, portStatus: 'operational', fleetSize: ships.length, fleetClearance: manifest.clearance, healthy: true }`.",
      starterCode: `async function repairHarborNetwork(api, token) {
  // Master Harbor Recovery Protocol:
  
}`,
      tests: [
        {
          type: "function",
          functionName: "repairHarborNetwork",
          args: [null, "imperial-token-99"],
          expected: {
            authorized: true,
            portStatus: "operational",
            fleetSize: 3,
            fleetClearance: "Imperial",
            healthy: true,
          },
          message: "Executes full network recovery protocol and defeats the Harbor Guardian.",
        },
        {
          type: "function",
          functionName: "repairHarborNetwork",
          args: [null, "bad-token"],
          expected: {
            authorized: false,
            error: "Authentication Failed",
          },
          message: "Rejects unauthorized token and aborts protocol safely.",
        },
      ],
      hints: [
        "Check auth with `const adminRes = await client.get('/admin/manifest', { headers: { Authorization: 'Bearer ' + token } });`",
        "If `adminRes.status === 401`, return `{ authorized: false, error: 'Authentication Failed' }`.",
        "Use `const [statusRes, shipsRes] = await Promise.all([client.get('/harbor/status'), client.get('/ships')]);`",
        "Send patch with `await client.patch('/harbor/status', { status: 'operational' });`",
      ],
      solution: `async function repairHarborNetwork(api, token) {
  const client = api || mockApi;

  // 1. Authenticate
  const adminRes = await client.get("/admin/manifest", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (adminRes.status === 401) {
    return {
      authorized: false,
      error: "Authentication Failed",
    };
  }

  const manifest = await adminRes.json();

  // 2. Concurrent Telemetry
  const [statusRes, shipsRes] = await Promise.all([
    client.get("/harbor/status"),
    client.get("/ships"),
  ]);

  const ships = await shipsRes.json();

  // 3. Repair Status
  await client.patch("/harbor/status", { status: "operational" });

  // 4. Compile Report
  return {
    authorized: true,
    portStatus: "operational",
    fleetSize: ships.length,
    fleetClearance: manifest.clearance,
    healthy: true,
  };
}`,
      solutionExplanation:
        "The master orchestrator authenticates protected endpoints, leverages Promise.all for high performance, executes resource mutations, and compiles mission telemetry to defeat the Harbor Guardian.",
      requirements: [
        { id: "req-h16-01", label: "Defeats the API Harbor Guardian with master network recovery orchestrator", type: "function" },
      ],
    },
  },
];

/** Get API Harbor lesson by ID */
export function getApiHarborLessonById(lessonId) {
  return apiHarborLessons.find((l) => l.id === lessonId);
}

/** Get next API Harbor lesson ID */
export function getNextApiHarborLessonId(lessonId) {
  const index = apiHarborLessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index >= apiHarborLessons.length - 1) return null;
  return apiHarborLessons[index + 1].id;
}

/** Get progress percentage for API Harbor */
export function getApiHarborProgress(progress = {}) {
  const completed = apiHarborLessons.filter((l) => (progress.completedLessons || []).includes(l.id)).length;
  return Math.min(100, Math.round((completed / apiHarborLessons.length) * 100));
}

/** Check if API Harbor is fully complete */
export function isApiHarborComplete(progress = {}) {
  return (
    apiHarborLessons.length > 0 &&
    apiHarborLessons.every((l) => (progress.completedLessons || []).includes(l.id))
  );
}
