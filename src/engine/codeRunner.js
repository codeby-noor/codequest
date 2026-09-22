/**
 * Code execution abstraction layer.
 *
 * IMPORTANT SECURITY NOTE:
 * The current client-side runner uses a Web Worker for execution.
 * This is suitable ONLY for controlled educational MVP usage.
 * It is NOT a secure production sandbox.
 *
 * The abstraction below allows swapping the execution provider
 * without rewriting the Code Arena UI. Future providers:
 *   - ServerSandboxExecutionProvider (isolated backend sandbox)
 *   - WebWorkerExecutionProvider (thread-isolated) ← current
 *
 * Challenge code must NEVER be given access to:
 *   - document
 *   - window
 *   - localStorage
 *   - network APIs (fetch, XMLHttpRequest)
 *   - cookies
 *   - browser storage
 *   - parent frames
 */

import { executeInWorker } from "./workerCodeRunner";

/**
 * WorkerExecutionProvider — executes user code in a Web Worker
 * with a hard timeout. The main thread stays responsive.
 */
const WorkerExecutionProvider = {
  name: "worker-mvp",

  /**
   * Execute user code and capture console output.
   * Returns a Promise resolving to { logs, error, timedOut, duration }.
   */
  async execute(code, options) {
    const result = await executeInWorker(code, options);

    // Normalize worker logs into the format the UI expects.
    const logs = (result.logs || []).map((entry) => {
      const values = entry.values || [];
      return values.join(" ");
    });

    if (result.timedOut) {
      return {
        logs,
        error: {
          kind: "timeout",
          message: result.error?.message || "Execution timed out.",
          hint: result.error?.hint,
        },
        timedOut: true,
        duration: result.duration,
      };
    }

    if (result.error) {
      const kind =
        result.error.type === "SYNTAX_ERROR"
          ? "syntax"
          : result.error.type === "RUNTIME_ERROR"
          ? "runtime"
          : "worker";
      return {
        logs,
        error: {
          kind,
          message: result.error.message,
          stack: result.error.stack,
        },
        timedOut: false,
        duration: result.duration,
      };
    }

    return {
      logs,
      error: null,
      timedOut: false,
      duration: result.duration,
    };
  },
};

/**
 * CodeExecutionProvider — the active execution provider.
 * Swap this to use a different provider in the future.
 */
export const CodeExecutionProvider = WorkerExecutionProvider;

/**
 * Run user code and get output + error info.
 * Returns a Promise resolving to { logs, error, timedOut, duration }.
 */
export function runUserCode(code, options) {
  return CodeExecutionProvider.execute(code, options);
}

/**
 * Format a technical error into a beginner-friendly message.
 */
export function formatErrorForBeginner(error) {
  if (!error) return null;

  if (error.kind === "syntax") {
    return {
      friendly: "Your code has a syntax error — JavaScript couldn't understand it.",
      hint: "Check for missing brackets, quotes, or semicolons.",
      technical: error.message,
    };
  }

  if (error.kind === "timeout") {
    return {
      friendly: "Execution timed out.",
      hint: error.hint || "Your code took too long to finish. This can happen when a loop never ends.",
      technical: error.message,
    };
  }

  if (error.kind === "runtime") {
    // Common beginner errors
    const refMatch = error.message.match(/(\w+) is not defined/);
    if (refMatch) {
      return {
        friendly: `Your code tried to use \`${refMatch[1]}\`, but JavaScript doesn't know what \`${refMatch[1]}\` is.`,
        hint: "Check whether you created the variable or function first.",
        technical: error.message,
      };
    }

    return {
      friendly: "Something went wrong while running your code.",
      hint: "Read the technical details below to understand what happened.",
      technical: error.message,
    };
  }

  if (error.kind === "worker") {
    return {
      friendly: "The execution environment had a problem.",
      hint: "Try running your code again.",
      technical: error.message,
    };
  }

  return {
    friendly: "Something went wrong.",
    hint: "Try reviewing your code and running it again.",
    technical: error.message,
  };
}