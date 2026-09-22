/**
 * CodeQuest execution worker.
 *
 * Executes user challenge code in an isolated Web Worker thread.
 * Captures console output and returns structured results.
 *
 * SECURITY NOTE:
 * This client-side Worker execution is intended for controlled
 * educational challenges. It prevents main-thread freezing and
 * enforces timeouts, but it is NOT a complete security sandbox.
 * For untrusted production user code, replace this provider with
 * a server-side isolated sandbox/container execution environment.
 */

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

self.onmessage = (e) => {
  const { code, assertionBody } = e.data || {};
  const start = performance.now();
  const logs = [];

  // Capture console in the worker's own scope (not the main thread).
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
    // If an assertion body is provided, compile user code + assertion together
    // so variables/functions declared by the user are accessible to the assertion.
    const body = assertionBody
      ? `"use strict";\n${code}\n${assertionBody}`
      : code;
    const fn = new Function(body);
    const result = fn.call({
      window: undefined,
      document: undefined,
      localStorage: undefined,
      navigator: undefined,
    });

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