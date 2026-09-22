/**
 * Safe client-side challenge validation engine.
 *
 * Each challenge defines one or more tests. To verify a test, the user's
 * code and test assertion are compiled together into a single controlled
 * Function scope inside a Web Worker, so variables declared with
 * let/const/function are directly accessible to the assertion.
 *
 * Supported test types:
 *  - output:      checks console.log captured output
 *  - variable:    checks a variable equals an expected value
 *  - function:    calls a user-defined function and checks the return value
 *  - array:       checks an array state (e.g. includes)
 *  - expression:  evaluates a boolean expression in user scope
 *
 * Everything runs inside a Web Worker with a hard timeout, so the main
 * thread stays responsive even if user code loops forever.
 */

import { executeInWorker } from "./workerCodeRunner";

class ChallengeError extends Error {
  constructor(message, kind = "error") {
    super(message);
    this.kind = kind;
  }
}

function stringifyValue(value) {
  if (typeof value === "string") return `"${value}"`;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) <= Number.EPSILON * Math.max(1, Math.abs(a), Math.abs(b)) * 4;
  }
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const k1 = Object.keys(a);
    const k2 = Object.keys(b);
    if (k1.length !== k2.length) return false;
    return k1.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

function argsList(args = []) {
  return args
    .map((a) => {
      if (typeof a === "string") return JSON.stringify(a);
      if (Array.isArray(a)) return JSON.stringify(a);
      if (a && typeof a === "object") return JSON.stringify(a);
      return String(a);
    })
    .join(", ");
}

/**
 * Run user code + assertion body in the worker.
 * Returns the assertion's return value, or throws ChallengeError.
 */
async function runSingleAssertion(code, assertionBody) {
  const result = await executeInWorker(code, { assertionBody });

  if (result.timedOut) {
    throw new ChallengeError(
      "Execution timed out. Your code took too long to finish.",
      "timeout"
    );
  }

  if (result.error) {
    if (result.error.type === "SYNTAX_ERROR") {
      throw new ChallengeError(`Syntax error: ${result.error.message}`, "syntax");
    }
    throw new ChallengeError(result.error.message, "error");
  }

  return result.result;
}

/** Run a single test against user code. */
async function runTest(test, code) {
  switch (test.type) {
    case "output": {
      const result = await executeInWorker(code);

      if (result.timedOut) {
        return {
          success: false,
          actual: "Execution timed out",
          expected: test.expected ?? test.contains,
          message: test.message,
        };
      }

      if (result.error) {
        return {
          success: false,
          actual: `Error: ${result.error.message}`,
          expected: test.expected ?? test.contains,
          message: test.message,
        };
      }

      const output = (result.logs || [])
        .map((entry) => (entry.values || []).join(" "))
        .join("\n")
        .trim();

      const pass =
        test.contains
          ? output.includes(test.contains)
          : typeof test.expected === "string" && output.includes(test.expected);

      return pass
        ? { success: true, message: test.message || "Output matched." }
        : {
            success: false,
            actual: output || "(no output)",
            expected: test.expected ?? test.contains,
            message: test.message,
          };
    }

    case "variable": {
      let check;
      try {
        check = await runSingleAssertion(
          code,
          `
            return {
              hasValue: typeof ${test.name} !== 'undefined',
              value: typeof ${test.name} !== 'undefined' ? ${test.name} : null
            };
          `
        );
      } catch (e) {
        return {
          success: false,
          actual: e.message,
          expected: stringifyValue(test.expected),
          message: test.message,
        };
      }

      if (!check.hasValue) {
        return {
          success: false,
          actual: `"${test.name}" is not declared`,
          expected: stringifyValue(test.expected),
          message: test.message,
        };
      }

      const pass = deepEqual(check.value, test.expected);
      return {
        success: pass,
        actual: stringifyValue(check.value),
        expected: stringifyValue(test.expected),
        message: test.message,
      };
    }

    case "function": {
      const fnName = test.functionName;
      let check;
      try {
        check = await runSingleAssertion(
          code,
          `
            return (async () => {
              const fn = typeof ${fnName} !== 'undefined' ? ${fnName} : null;
              if (typeof fn !== 'function') {
                return { isFunction: false, value: null };
              }
              const res = await fn(${argsList(test.args)});
              return { isFunction: true, value: res };
            })();
          `
        );
      } catch (e) {
        return {
          success: false,
          actual: e.message,
          expected: "a defined function",
          message: test.message,
        };
      }

      if (!check.isFunction) {
        return {
          success: false,
          actual: `"${fnName}" is not a function`,
          expected: "a defined function",
          message: test.message,
        };
      }

      const pass = deepEqual(check.value, test.expected);
      return {
        success: pass,
        actual: stringifyValue(check.value),
        expected: stringifyValue(test.expected),
        message: test.message,
      };
    }

    case "array": {
      const arrName = test.name;
      let check;
      try {
        check = await runSingleAssertion(
          code,
          `
            const __arr = typeof ${arrName} !== 'undefined' ? ${arrName} : undefined;
            if (__arr === undefined) return { defined: false, notArray: false, arr: null };
            return {
              defined: true,
              notArray: !Array.isArray(__arr),
              arr: __arr,
              includes: Array.isArray(__arr)
                ? __arr.includes(${JSON.stringify(test.includes)})
                : null
            };
          `
        );
      } catch (e) {
        return {
          success: false,
          actual: e.message,
          expected: "an array",
          message: test.message,
        };
      }

      if (!check.defined) {
        return {
          success: false,
          actual: `"${arrName}" is not declared`,
          expected: "an array",
          message: test.message,
        };
      }
      if (check.notArray) {
        return {
          success: false,
          actual: `"${arrName}" is not an array`,
          expected: "an array",
          message: test.message,
        };
      }

      const pass = test.includes
        ? check.includes === true
        : deepEqual(check.arr, test.expected);
      return {
        success: pass,
        actual: JSON.stringify(check.arr),
        expected: test.includes
          ? `contains "${test.includes}"`
          : JSON.stringify(test.expected),
        message: test.message,
      };
    }

    case "expression": {
      let check;
      try {
        check = await runSingleAssertion(code, `return Boolean(${test.expression});`);
      } catch (e) {
        return { success: false, expected: "true", actual: "false", message: test.message };
      }
      return {
        success: check === true,
        expected: "true",
        actual: check === true ? "true" : "false",
        message: test.message,
      };
    }

    default:
      return { success: true };
  }
}

/**
 * Main entry: validate a user's code against a challenge definition.
 * Returns a Promise resolving to { passed, results, error? }
 */
export async function validateChallenge(code, challenge) {
  if (!challenge || !Array.isArray(challenge.tests)) {
    return { passed: false, results: [], error: { kind: "error", message: "Invalid challenge." } };
  }

  try {
    const results = await Promise.all(challenge.tests.map((test) => runTest(test, code)));
    const passed = results.every((r) => r.success);
    return { passed, results, error: null };
  } catch (e) {
    return {
      passed: false,
      results: [],
      error: {
        kind: e instanceof ChallengeError ? e.kind : "error",
        message: e.message || "An unexpected error occurred.",
      },
    };
  }
}