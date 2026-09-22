/**
 * Worker-based code execution provider.
 *
 * Executes user code in a Web Worker thread with a hard timeout.
 * The main thread stays responsive even if user code loops forever.
 *
 * SECURITY NOTE:
 * This client-side Worker execution is intended for controlled
 * educational challenges. It prevents main-thread freezing and
 * enforces timeouts, but it is NOT a complete security sandbox.
 * For untrusted production user code, replace this provider with
 * a server-side isolated sandbox/container execution environment.
 */

import { createMockDb, createMockApp } from "./backendSimulator";
import { createMockGitRepo } from "./gitSimulator";

const DEFAULT_TIMEOUT = 2000;

const WORKER_SCRIPT = `
function stringifyValue(value) {
  if (typeof value === "string") return value;
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

const MOCK_DATA = {
  "/ships": [
    { id: "ship-01", name: "The Sea Serpent", captain: "Rowan", cargo: "Lapis Lazuli", status: "docked" },
    { id: "ship-02", name: "Northern Star", captain: "Aria", cargo: "Spices", status: "sailing" },
    { id: "ship-03", name: "Golden Galleon", captain: "Lyra", cargo: "Gold Bullion", status: "loading" },
  ],
  "/harbor/status": { status: "clear", activeShips: 12, portOpen: true, windSpeed: "14 knots" },
  "/cargo/manifest": {
    port: "Eldoria Harbor",
    totalWeight: 4200,
    items: [
      { id: "item-1", name: "Ancient Relic", weight: 350, destination: "High Citadel" },
      { id: "item-2", name: "Silk Bundles", weight: 1200, destination: "Merchant Guild" },
      { id: "item-3", name: "Iron Ores", weight: 2650, destination: "Forge Quarter" },
    ],
  },
};

function cloneData(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const mockApi = {
  get: async (endpoint, options = {}) => {
    const cleanEp = (endpoint || "").split("?")[0];
    if (cleanEp === "/ships") {
      const data = cloneData(MOCK_DATA["/ships"]);
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/harbor/status") {
      const data = cloneData(MOCK_DATA["/harbor/status"]);
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/cargo/manifest") {
      const data = cloneData(MOCK_DATA["/cargo/manifest"]);
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/admin/manifest") {
      const auth = options.headers?.Authorization || options.headers?.authorization;
      if (!auth || !auth.includes("Bearer imperial-token-99")) {
        return {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
          data: { error: "Unauthorized access" },
          json: async () => ({ error: "Unauthorized access" }),
        };
      }
      const data = { clearance: "Imperial", fleetCode: "VANGUARD-77", confidential: true };
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/temp/error") {
      return {
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        data: { error: "Temporary storm disruption" },
        json: async () => ({ error: "Temporary storm disruption" }),
      };
    }
    const data = { message: "Resource found", endpoint };
    return { ok: true, status: 200, data, json: async () => data };
  },
  post: async (endpoint, body = {}, options = {}) => {
    const createdId = "ship-" + (body.name ? body.name.toLowerCase().replace(/\\s+/g, "-") : "registered");
    const data = { id: createdId, ...body, registered: true };
    return { ok: true, status: 201, data, json: async () => data };
  },
  patch: async (endpoint, body = {}, options = {}) => {
    const data = { updated: true, endpoint, ...body };
    return { ok: true, status: 200, data, json: async () => data };
  },
  put: async (endpoint, body = {}, options = {}) => {
    const data = { replaced: true, endpoint, ...body };
    return { ok: true, status: 200, data, json: async () => data };
  },
  delete: async (endpoint, options = {}) => {
    const data = { deleted: true, endpoint };
    return { ok: true, status: 200, data, json: async () => data };
  },
};

function createMockDb(initialData = {}) {
  const tables = {};
  for (const [table, rows] of Object.entries(initialData)) {
    tables[table] = JSON.parse(JSON.stringify(rows));
  }
  const getTable = (t) => {
    if (!tables[t]) tables[t] = [];
    return tables[t];
  };
  return {
    find(t, p) {
      const table = getTable(t);
      if (!p) return JSON.parse(JSON.stringify(table));
      const filtered = table.filter(typeof p === "function" ? p : (row) => Object.entries(p).every(([k, v]) => row[k] === v));
      return JSON.parse(JSON.stringify(filtered));
    },
    findById(t, id) {
      const table = getTable(t);
      const found = table.find((r) => String(r.id) === String(id));
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },
    insert(t, item) {
      const table = getTable(t);
      const doc = { id: item.id || (t.slice(0, 3) + '-' + Date.now() + '-' + (table.length + 1)), ...item };
      table.push(doc);
      return JSON.parse(JSON.stringify(doc));
    },
    update(t, id, updates) {
      const table = getTable(t);
      const idx = table.findIndex((r) => String(r.id) === String(id));
      if (idx === -1) return null;
      table[idx] = { ...table[idx], ...updates, id: table[idx].id };
      return JSON.parse(JSON.stringify(table[idx]));
    },
    delete(t, id) {
      const table = getTable(t);
      const idx = table.findIndex((r) => String(r.id) === String(id));
      if (idx === -1) return false;
      table.splice(idx, 1);
      return true;
    }
  };
}

function createMockApp(db = createMockDb()) {
  const stack = [];
  function addRoute(method, path, handlers) {
    const paramNames = [];
    const patternStr = path.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    const regex = new RegExp("^" + patternStr + "$");
    handlers.forEach((h) => {
      stack.push({
        type: "route",
        method: method.toUpperCase(),
        path,
        regex,
        paramNames,
        handler: h,
      });
    });
  }
  const app = {
    db,
    use(...args) {
      if (typeof args[0] === "string") {
        const prefix = args[0];
        args.slice(1).forEach((h) => stack.push({ type: "middleware", prefix, handler: h }));
      } else {
        args.forEach((h) => stack.push({ type: "middleware", prefix: "/", handler: h }));
      }
      return app;
    },
    get(p, ...h) { addRoute("GET", p, h); return app; },
    post(p, ...h) { addRoute("POST", p, h); return app; },
    put(p, ...h) { addRoute("PUT", p, h); return app; },
    patch(p, ...h) { addRoute("PATCH", p, h); return app; },
    delete(p, ...h) { addRoute("DELETE", p, h); return app; },
    async handleRequest(reqOpt = {}) {
      const method = (reqOpt.method || "GET").toUpperCase();
      const rawUrl = reqOpt.url || "/";
      const [urlPath, queryString] = rawUrl.split("?");
      const query = {};
      if (queryString) {
        queryString.split("&").forEach((pair) => {
          const [k, v] = pair.split("=");
          if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
        });
      }
      const req = { method, url: rawUrl, path: urlPath, params: {}, query, headers: reqOpt.headers || {}, body: reqOpt.body || {}, user: null };
      let statusCode = 200;
      let headers = { "Content-Type": "application/json" };
      let responseBody = null;
      let ended = false;
      const res = {
        status(c) { statusCode = c; return res; },
        setHeader(k, v) { headers[k] = v; return res; },
        json(d) { responseBody = d; ended = true; return res; },
        send(d) { responseBody = d; ended = true; return res; },
        end() { ended = true; return res; },
        get statusCode() { return statusCode; },
        get body() { return responseBody; },
      };
      for (const layer of stack) {
        if (layer.type === "route" && (layer.method === method || layer.method === "ALL")) {
          const m = urlPath.match(layer.regex);
          if (m) {
            const params = {};
            layer.paramNames.forEach((name, i) => { params[name] = m[i + 1]; });
            req.params = params;
            break;
          }
        }
      }
      let error = null;
      let idx = 0;
      async function next(err) {
        if (ended) return;
        if (err) {
          error = err;
          while (idx < stack.length) {
            const layer = stack[idx++];
            if (layer.handler.length === 4) {
              try { await layer.handler(error, req, res, next); return; } catch (e) { error = e; }
            }
          }
          if (!ended) res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
          return;
        }
        while (idx < stack.length) {
          const layer = stack[idx++];
          if (layer.handler.length === 4) continue;
          if (layer.type === "middleware") {
            if (urlPath.startsWith(layer.prefix) || layer.prefix === "/") {
              try { await layer.handler(req, res, next); return; } catch (e) { await next(e); return; }
            }
          } else if (layer.type === "route") {
            if (layer.method === method || layer.method === "ALL") {
              const m = urlPath.match(layer.regex);
              if (m) {
                const params = {};
                layer.paramNames.forEach((name, i) => { params[name] = m[i + 1]; });
                req.params = params;
                try { await layer.handler(req, res, next); return; } catch (e) { await next(e); return; }
              }
            }
          }
        }
        if (!ended) res.status(404).json({ success: false, error: "Route " + method + " " + urlPath + " not found" });
      }
      await next();
      return { status: statusCode, statusCode, headers, body: responseBody, data: responseBody, ended };
    }
  };
  return app;
}

function createMockGitRepo(initialFiles = {}) {
  let workingTree = { ...initialFiles };
  let stagingIndex = {};
  let branches = { main: [] };
  let currentBranch = "main";
  let commitHistory = [];
  let commitCounter = 1000;
  return {
    getCurrentBranch() { return currentBranch; },
    getBranches() { return Object.keys(branches); },
    getWorkingTree() { return { ...workingTree }; },
    getStaging() { return { ...stagingIndex }; },
    getLog() { return [...commitHistory]; },
    writeFile(filePath, content) {
      workingTree[filePath] = content;
      return { success: true, filePath, status: "modified" };
    },
    add(filePath) {
      if (filePath === ".") {
        stagingIndex = { ...workingTree };
        return { success: true, staged: Object.keys(stagingIndex) };
      }
      if (workingTree[filePath] !== undefined) {
        stagingIndex[filePath] = workingTree[filePath];
        return { success: true, staged: [filePath] };
      }
      return { success: false, error: "File not found" };
    },
    commit(message) {
      if (Object.keys(stagingIndex).length === 0) {
        return { success: false, error: "Nothing to commit" };
      }
      commitCounter += 1;
      const hash = "c" + commitCounter.toString(16);
      const commitObj = { hash, message, branch: currentBranch, files: { ...stagingIndex } };
      commitHistory.unshift(commitObj);
      if (!branches[currentBranch]) branches[currentBranch] = [];
      branches[currentBranch].unshift(commitObj);
      stagingIndex = {};
      return { success: true, commit: commitObj };
    },
    createBranch(name) {
      if (branches[name]) return { success: false, error: "Branch exists" };
      branches[name] = branches[currentBranch] ? [...branches[currentBranch]] : [];
      return { success: true, branch: name };
    },
    checkout(name, createNew = false) {
      if (createNew) this.createBranch(name);
      if (!branches[name]) return { success: false, error: "Branch not found" };
      currentBranch = name;
      return { success: true, currentBranch };
    },
    merge(source) {
      if (!branches[source]) return { success: false, error: "Branch not found" };
      const sourceCommits = branches[source];
      if (sourceCommits.length > 0) {
        workingTree = { ...workingTree, ...(sourceCommits[0].files || {}) };
      }
      commitCounter += 1;
      const mergeCommit = { hash: "m" + commitCounter.toString(16), message: "Merge " + source, branch: currentBranch, files: { ...workingTree } };
      commitHistory.unshift(mergeCommit);
      branches[currentBranch].unshift(mergeCommit);
      stagingIndex = {};
      return { success: true, mergeCommit };
    },
    status() {
      const stagedKeys = Object.keys(stagingIndex);
      return { currentBranch, stagedCount: stagedKeys.length, stagedFiles: stagedKeys, isClean: stagedKeys.length === 0 };
    }
  };
}

self.onmessage = async (e) => {
  const { code, assertionBody } = e.data || {};
  const start = performance.now();
  const logs = [];

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => {
    logs.push({ level: "log", values: args.map(stringifyValue) });
  };
  console.warn = (...args) => {
    logs.push({ level: "warn", values: args.map(stringifyValue) });
  };
  console.error = (...args) => {
    logs.push({ level: "error", values: args.map(stringifyValue) });
  };

  try {
    const body = assertionBody
      ? '"use strict";\\n' + code + '\\n' + assertionBody
      : code;
    const fn = new Function("mockApi", "createMockDb", "createMockApp", "createMockGitRepo", body);
    const rawResult = fn.call({
      window: undefined,
      document: undefined,
      localStorage: undefined,
      navigator: undefined,
    }, mockApi, createMockDb, createMockApp, createMockGitRepo);

    const result = (rawResult && typeof rawResult.then === "function")
      ? await rawResult
      : rawResult;

    const duration = performance.now() - start;

    self.postMessage({
      type: "result",
      success: true,
      logs,
      result: result !== undefined ? result : undefined,
      error: null,
      timedOut: false,
      duration,
    });
  } catch (err) {
    const duration = performance.now() - start;
    const isSyntax = err instanceof SyntaxError;

    self.postMessage({
      type: "result",
      success: false,
      logs,
      result: undefined,
      error: {
        type: isSyntax ? "SYNTAX_ERROR" : "RUNTIME_ERROR",
        message: err.message || String(err),
        stack: err.stack,
      },
      timedOut: false,
      duration,
    });
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
};
`;

/**
 * Creates a Web Worker from inline blob.
 */
function createWorker() {
  if (
    typeof window !== "undefined" &&
    typeof window.Worker !== "undefined" &&
    typeof window.Blob !== "undefined" &&
    typeof window.URL !== "undefined" &&
    typeof window.URL.createObjectURL === "function"
  ) {
    try {
      const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      const worker = new Worker(blobUrl);
      return { worker, blobUrl };
    } catch {
      return null;
    }
  }
  return null;
}

export const MOCK_API_DATA = {
  "/ships": [
    { id: "ship-01", name: "The Sea Serpent", captain: "Rowan", cargo: "Lapis Lazuli", status: "docked" },
    { id: "ship-02", name: "Northern Star", captain: "Aria", cargo: "Spices", status: "sailing" },
    { id: "ship-03", name: "Golden Galleon", captain: "Lyra", cargo: "Gold Bullion", status: "loading" },
  ],
  "/harbor/status": { status: "clear", activeShips: 12, portOpen: true, windSpeed: "14 knots" },
  "/cargo/manifest": {
    port: "Eldoria Harbor",
    totalWeight: 4200,
    items: [
      { id: "item-1", name: "Ancient Relic", weight: 350, destination: "High Citadel" },
      { id: "item-2", name: "Silk Bundles", weight: 1200, destination: "Merchant Guild" },
      { id: "item-3", name: "Iron Ores", weight: 2650, destination: "Forge Quarter" },
    ],
  },
};

export const defaultMockApi = {
  get: async (endpoint, options = {}) => {
    const cleanEp = (endpoint || "").split("?")[0];
    if (cleanEp === "/ships") {
      const data = JSON.parse(JSON.stringify(MOCK_API_DATA["/ships"]));
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/harbor/status") {
      const data = JSON.parse(JSON.stringify(MOCK_API_DATA["/harbor/status"]));
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/cargo/manifest") {
      const data = JSON.parse(JSON.stringify(MOCK_API_DATA["/cargo/manifest"]));
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/admin/manifest") {
      const auth = options.headers?.Authorization || options.headers?.authorization;
      if (!auth || !auth.includes("Bearer imperial-token-99")) {
        return {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
          data: { error: "Unauthorized access" },
          json: async () => ({ error: "Unauthorized access" }),
        };
      }
      const data = { clearance: "Imperial", fleetCode: "VANGUARD-77", confidential: true };
      return { ok: true, status: 200, data, json: async () => data };
    }
    if (cleanEp === "/temp/error") {
      return {
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        data: { error: "Temporary storm disruption" },
        json: async () => ({ error: "Temporary storm disruption" }),
      };
    }
    const data = { message: "Resource found", endpoint };
    return { ok: true, status: 200, data, json: async () => data };
  },
  post: async (endpoint, body = {}, options = {}) => {
    const createdId = "ship-" + (body.name ? body.name.toLowerCase().replace(/\s+/g, "-") : "registered");
    const data = { id: createdId, ...body, registered: true };
    return { ok: true, status: 201, data, json: async () => data };
  },
  patch: async (endpoint, body = {}, options = {}) => {
    const data = { updated: true, endpoint, ...body };
    return { ok: true, status: 200, data, json: async () => data };
  },
  put: async (endpoint, body = {}, options = {}) => {
    const data = { replaced: true, endpoint, ...body };
    return { ok: true, status: 200, data, json: async () => data };
  },
  delete: async (endpoint, options = {}) => {
    const data = { deleted: true, endpoint };
    return { ok: true, status: 200, data, json: async () => data };
  },
};

/**
 * Execute code in a Web Worker with a timeout.
 * Returns a Promise resolving to a structured result.
 *
 * @param {string} code - The JavaScript code to execute.
 * @param {object} [options]
 * @param {number} [options.timeout=2000] - Max execution time in ms.
 * @param {string} [options.assertionBody] - Optional assertion code appended to user code.
 * @returns {Promise<object>} Structured result.
 */
export function executeInWorker(code, { timeout = DEFAULT_TIMEOUT, assertionBody } = {}) {
  return new Promise((resolve) => {
    let workerHandle = null;
    let settled = false;
    const start = performance.now();

    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (workerHandle) {
        if (workerHandle.worker) workerHandle.worker.terminate();
        if (workerHandle.blobUrl && typeof URL !== "undefined" && URL.revokeObjectURL) {
          URL.revokeObjectURL(workerHandle.blobUrl);
        }
        workerHandle = null;
      }
      resolve(result);
    };

    try {
      workerHandle = createWorker();

      if (!workerHandle || !workerHandle.worker) {
        // Fallback for Node/Jest or non-Worker environments
        const logs = [];
        const origLog = console.log;
        const origWarn = console.warn;
        const origError = console.error;

        console.log = (...args) => logs.push({ level: "log", values: args.map(String) });
        console.warn = (...args) => logs.push({ level: "warn", values: args.map(String) });
        console.error = (...args) => logs.push({ level: "error", values: args.map(String) });

        (async () => {
          try {
            const body = assertionBody ? `"use strict";\n${code}\n${assertionBody}` : code;
            const fn = new Function("mockApi", "createMockDb", "createMockApp", "createMockGitRepo", body);
            const rawResult = fn(defaultMockApi, createMockDb, createMockApp, createMockGitRepo);
            const result = (rawResult && typeof rawResult.then === "function")
              ? await rawResult
              : rawResult;

            const duration = performance.now() - start;
            console.log = origLog;
            console.warn = origWarn;
            console.error = origError;
            return finish({
              success: true,
              logs,
              result: result !== undefined ? result : undefined,
              error: null,
              timedOut: false,
              duration,
            });
          } catch (err) {
            const duration = performance.now() - start;
            console.log = origLog;
            console.warn = origWarn;
            console.error = origError;
            return finish({
              success: false,
              logs,
              result: undefined,
              error: {
                type: err instanceof SyntaxError ? "SYNTAX_ERROR" : "RUNTIME_ERROR",
                message: err.message || String(err),
              },
              timedOut: false,
              duration,
            });
          }
        })();
        return;
      }

      const { worker } = workerHandle;

      const timeoutId = setTimeout(() => {
        finish({
          success: false,
          logs: [],
          result: undefined,
          error: {
            type: "TIMEOUT",
            message: "Execution timed out.",
            hint: "Your code took too long to finish. This can happen when a loop never ends.",
          },
          timedOut: true,
          duration: timeout,
        });
      }, timeout);

      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        const data = e.data || {};
        if (data.type === "result") {
          finish({
            success: data.success,
            logs: data.logs || [],
            result: data.result,
            error: data.error,
            timedOut: false,
            duration: data.duration,
          });
        } else {
          finish({
            success: false,
            logs: [],
            result: undefined,
            error: {
              type: "WORKER_ERROR",
              message: "The execution worker returned an unexpected response.",
            },
            timedOut: false,
            duration: performance.now() - start,
          });
        }
      };

      worker.onerror = (err) => {
        clearTimeout(timeoutId);
        finish({
          success: false,
          logs: [],
          result: undefined,
          error: {
            type: "WORKER_ERROR",
            message: err.message || "The execution worker failed to start.",
          },
          timedOut: false,
          duration: performance.now() - start,
        });
      };

      worker.postMessage({ code, assertionBody });
    } catch (err) {
      finish({
        success: false,
        logs: [],
        result: undefined,
        error: {
          type: "WORKER_ERROR",
          message: err.message || "Could not create the execution worker.",
        },
        timedOut: false,
        duration: performance.now() - start,
      });
    }
  });
}