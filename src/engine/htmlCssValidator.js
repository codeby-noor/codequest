/**
 * HTML/CSS & DOM challenge validation engine.
 *
 * Workshop and Web Kingdom challenges (HTML, CSS, DOM, Events, Storage)
 * are evaluated safely in an isolated execution environment.
 *
 * In browser runtime:
 *  - Code renders inside a sandboxed <iframe> (without allow-same-origin)
 *  - Communication with parent occurs over a strict, tokenized postMessage protocol
 *  - An in-memory mock provides isolated localStorage without touching parent storage
 *  - The user's code cannot navigate parent, read parent cookies, or escape sandbox
 *
 * In Jest / Node test runner:
 *  - Fast direct validation parses DOM and simulates events/forms/storage
 */

const SANDBOX_ATTRS = "allow-scripts allow-modals allow-forms allow-popups";

/**
 * Build a full HTML document from user code.
 * Wraps raw fragments, styles, and scripts appropriately.
 */
export function buildPreviewDocument(code, challengeType = "html-css") {
  const trimmed = (code || "").trim();

  // If the code already looks like a full document, use it as-is.
  if (/<!DOCTYPE\s+html/i.test(trimmed) || /<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  // If the code is DOM/JS only (no HTML tags, or challengeType === "dom" without <html>)
  if (challengeType === "dom" && !/<html[\s>]/i.test(trimmed) && !/<!DOCTYPE/i.test(trimmed)) {
    if (/<script[\s>]/i.test(trimmed) || /<div[\s>]|<button[\s>]|<form[\s>]|<input[\s>]/i.test(trimmed)) {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
${trimmed}
  </body>
</html>`;
    }

    // Pure JavaScript DOM manipulation
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <div id="app"></div>
    <script>
${trimmed}
    </script>
  </body>
</html>`;
  }

  // If the code is CSS-only (a <style> block or raw CSS), wrap it.
  if (challengeType === "css" || /<style[\s>]/i.test(trimmed) || /^[.#@a-zA-Z][^{]*\{/m.test(trimmed)) {
    if (/<style[\s>]/i.test(trimmed)) {
      const styleBlocks = trimmed.match(/<style[\s\S]*?<\/style>/gi) || [];
      const bodyContent = trimmed.replace(/<style[\s\S]*?<\/style>/gi, "").trim();
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
${styleBlocks.join("\n")}
  </head>
  <body>
${bodyContent}
  </body>
</html>`;
    }
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
${trimmed}
    </style>
  </head>
  <body>
    <!-- CSS challenge preview -->
  </body>
</html>`;
  }

  // Otherwise treat it as an HTML fragment and wrap it.
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
${trimmed}
  </body>
</html>`;
}

/**
 * Direct evaluation helper used for testing and Node environments.
 */
export function runDirectValidation(code, tests, challengeType = "html-css") {
  if (!tests || !Array.isArray(tests)) {
    return { passed: true, results: [], passCount: 0, error: null };
  }

  const _storage = new Map();
  const mockLocalStorage = {
    getItem: (key) => (_storage.has(String(key)) ? _storage.get(String(key)) : null),
    setItem: (key, val) => {
      _storage.set(String(key), String(val));
    },
    removeItem: (key) => {
      _storage.delete(String(key));
    },
    clear: () => {
      _storage.clear();
    },
    get length() {
      return _storage.size;
    },
    key: (i) => Array.from(_storage.keys())[i] || null,
  };

  const fullHtml = buildPreviewDocument(code, challengeType);
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullHtml, "text/html");

  // Execute scripts in isolated document context
  const scripts = Array.from(doc.querySelectorAll("script"));
  for (const script of scripts) {
    const scriptCode = script.textContent || "";
    if (scriptCode.trim()) {
      try {
        const fn = new Function(
          "document",
          "window",
          "localStorage",
          `"use strict";
           const querySelector = document.querySelector.bind(document);
           const querySelectorAll = document.querySelectorAll.bind(document);
           const getElementById = document.getElementById.bind(document);
           ${scriptCode}`
        );
        fn(doc, { ...window, document: doc, localStorage: mockLocalStorage }, mockLocalStorage);
      } catch (err) {
        // Continue to evaluate tests
      }
    }
  }

  const query = (selector) => {
    try {
      return doc.querySelector(selector);
    } catch {
      return null;
    }
  };
  const queryAll = (selector) => {
    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch {
      return [];
    }
  };
  const normalize = (value) => (value || "").toLowerCase().replace(/\s+/g, " ").trim();

  const styleText = Array.from(doc.querySelectorAll("style"))
    .map((s) => s.textContent || "")
    .join("\n");

  const hasCss = (selector, property, expected) => {
    const normExp = expected !== undefined ? normalize(expected) : null;
    const cleanSel = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cleanProp = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(
      cleanSel + "\\s*\\{[^}]*?" + cleanProp + "\\s*:\\s*([^;]+)",
      "i"
    );
    const match = styleText.match(pattern);
    if (match) {
      const val = normalize(match[1]);
      if (!normExp || val === normExp || val.startsWith(normExp) || val.includes(normExp)) {
        return true;
      }
    }

    const el = query(selector);
    if (el && el.style) {
      const inlineVal = normalize(el.style.getPropertyValue(property));
      if (inlineVal && (!normExp || inlineVal === normExp || inlineVal.startsWith(normExp))) {
        return true;
      }
    }
    return false;
  };

  const hasMedia = (minWidth, selector, property) => {
    const cleanSel = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cleanProp = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const mediaPattern = new RegExp(
      "@media[^{]*min-width\\s*:\\s*" + minWidth + "px[^{]*\\{[\\s\\S]*?" +
        cleanSel +
        "\\s*\\{[^}]*?" +
        cleanProp +
        "\\s*:",
      "i"
    );
    return mediaPattern.test(styleText);
  };

  const results = tests.map((test) => {
    if (test.type === "element") {
      const found = Boolean(query(test.selector));
      return {
        passed: found,
        success: found,
        message: test.message,
        expected: 'an element matching "' + test.selector + '"',
        actual: found ? "found" : "not found",
      };
    }
    if (test.type === "count") {
      const actual = queryAll(test.selector).length;
      const min = test.min || 1;
      const pass = actual >= min;
      return {
        passed: pass,
        success: pass,
        message: test.message,
        expected: "at least " + min + ' element(s) matching "' + test.selector + '"',
        actual: actual + " found",
      };
    }
    if (test.type === "text") {
      const element = query(test.selector);
      const actual = element ? (element.textContent || "").trim() : "";
      const pass = Boolean(element) && actual.includes(test.contains);
      return {
        passed: pass,
        success: pass,
        message: test.message,
        expected: 'text containing "' + test.contains + '"',
        actual: actual || "not found",
      };
    }
    if (test.type === "attribute") {
      const element = query(test.selector);
      const actual = element ? element.getAttribute(test.attribute) : null;
      const pass =
        Boolean(element) &&
        (test.value === undefined ? actual !== null : actual === test.value);
      return {
        passed: pass,
        success: pass,
        message: test.message,
        expected:
          test.attribute +
          (test.value === undefined ? " attribute" : '="' + test.value + '"'),
        actual: actual === null ? "(missing)" : actual,
      };
    }
    if (test.type === "css") {
      const pass = hasCss(test.selector, test.property, test.value);
      return {
        passed: pass,
        success: pass,
        message: test.message,
        expected: test.selector + " has " + test.property,
        actual: pass ? "applied" : "not applied",
      };
    }
    if (test.type === "media") {
      const pass = hasMedia(test.minWidth, test.selector, test.property);
      return {
        passed: pass,
        success: pass,
        message: test.message,
        expected: "responsive rule",
        actual: pass ? "applied" : "not applied",
      };
    }
    if (test.type === "event") {
      const target = query(test.selector);
      if (!target)
        return {
          passed: false,
          success: false,
          message: test.message,
          expected: "target element exists",
          actual: "not found",
        };
      try {
        if (test.action === "click") target.click();
        else if (test.action === "input") {
          if (test.value !== undefined) target.value = test.value;
          target.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (test.postCheck) {
          const checkEl = query(test.postCheck.selector);
          const checkText = checkEl ? (checkEl.textContent || "").trim() : "";
          const pass =
            Boolean(checkEl) &&
            (test.postCheck.contains
              ? checkText.includes(test.postCheck.contains)
              : true);
          return {
            passed: pass,
            success: pass,
            message: test.message,
            expected: "event updates DOM",
            actual: pass ? "updated" : "no change",
          };
        }
        return { passed: true, success: true, message: test.message };
      } catch (e) {
        return {
          passed: false,
          success: false,
          message: test.message,
          expected: "event executes without error",
          actual: e.message,
        };
      }
    }
    if (test.type === "form") {
      try {
        if (test.inputs) {
          for (const [sel, val] of Object.entries(test.inputs)) {
            const input = query(sel);
            if (input) {
              input.value = val;
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        }
        if (test.submitSelector) {
          const btn = query(test.submitSelector);
          if (btn) btn.click();
        } else {
          const form = query(test.formSelector || "form");
          if (form)
            form.dispatchEvent(
              new Event("submit", { bubbles: true, cancelable: true })
            );
        }
        if (test.postCheck) {
          const checkEl = query(test.postCheck.selector);
          const checkText = checkEl ? (checkEl.textContent || "").trim() : "";
          const pass =
            Boolean(checkEl) &&
            (test.postCheck.contains
              ? checkText.includes(test.postCheck.contains)
              : true);
          return {
            passed: pass,
            success: pass,
            message: test.message,
            expected: "form submission updates UI",
            actual: pass ? "verified" : "not verified",
          };
        }
        return { passed: true, success: true, message: test.message };
      } catch (e) {
        return {
          passed: false,
          success: false,
          message: test.message,
          expected: "form submission handles validation",
          actual: e.message,
        };
      }
    }
    if (test.type === "storage") {
      const stored = _storage.get(test.key) || "";
      const pass = test.contains ? stored.includes(test.contains) : Boolean(stored);
      return {
        passed: pass,
        success: pass,
        message: test.message,
        expected: 'localStorage key "' + test.key + '" set',
        actual: stored || "(empty)",
      };
    }
    return { passed: true, success: true, message: test.message };
  });

  const passed = results.every((r) => r.passed);
  const passCount = results.filter((r) => r.passed).length;

  return {
    passed,
    results,
    passCount,
    error: null,
  };
}

/**
 * Render user code into a sandboxed iframe and run validation checks.
 * Returns a Promise resolving to { passed, results, passCount, error }.
 *
 * @param {string} code - The user's HTML/CSS/DOM code.
 * @param {object|Array} challengeOrTests - The challenge definition or tests array.
 */
export function validateHtmlCssChallenge(code, challengeOrTests) {
  const tests = Array.isArray(challengeOrTests)
    ? challengeOrTests
    : challengeOrTests?.tests || [];
  const challengeType = Array.isArray(challengeOrTests)
    ? "html-css"
    : challengeOrTests?.challengeType || "html-css";

  if (!tests || tests.length === 0) {
    return Promise.resolve({
      passed: true,
      results: [],
      passCount: 0,
      error: null,
    });
  }

  // Use direct DOM evaluation in Node/Jest test environments
  if (
    (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "test") ||
    typeof window === "undefined" ||
    !document ||
    typeof document.createElement !== "function"
  ) {
    return Promise.resolve(runDirectValidation(code, tests, challengeType));
  }

  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", SANDBOX_ATTRS);
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;visibility:hidden;";

    const token = `codequest-html-${Date.now()}-${Math.random()}`;
    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };
    const timeoutId = setTimeout(() => {
      cleanup();
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      resolve({
        passed: false,
        results: [],
        passCount: 0,
        error: { kind: "timeout", message: "Preview timed out while rendering your code." },
      });
    }, 3000);

    function handleMessage(event) {
      if (event.source !== iframe.contentWindow || event.data?.token !== token) return;
      clearTimeout(timeoutId);
      cleanup();
      const results = event.data.results || [];
      const passed = Boolean(event.data.passed);
      const passCount = results.filter((r) => r.success || r.passed).length;
      resolve({ passed, results, passCount, error: event.data.error || null });
    }

    window.addEventListener("message", handleMessage);
    iframe.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      resolve({
        passed: false,
        results: [],
        passCount: 0,
        error: { kind: "error", message: "The preview failed to load." },
      });
    };

    document.body.appendChild(iframe);

    const doc = buildPreviewDocument(code, challengeType);
    const validationScript = `<script>${buildValidationScript(tests, token)}</script>`;
    const documentWithValidator = /<\/body>/i.test(doc)
      ? doc.replace(/<\/body>/i, `${validationScript}</body>`)
      : `${doc}${validationScript}`;
    iframe.srcdoc = documentWithValidator;
  });
}

function buildValidationScript(tests, token) {
  const serializedTests = JSON.stringify(tests).replace(/</g, "\\u003c");
  return `(() => {
    // Isolated in-memory storage sandbox for user code
    const _storage = new Map();
    try {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (key) => _storage.has(String(key)) ? _storage.get(String(key)) : null,
          setItem: (key, val) => { _storage.set(String(key), String(val)); },
          removeItem: (key) => { _storage.delete(String(key)); },
          clear: () => { _storage.clear(); },
          get length() { return _storage.size; },
          key: (i) => Array.from(_storage.keys())[i] || null,
        },
        writable: false,
        configurable: true,
      });
    } catch (e) {}

    const tests = ${serializedTests};
    const query = (selector) => { try { return document.querySelector(selector); } catch { return null; } };
    const queryAll = (selector) => { try { return Array.from(document.querySelectorAll(selector)); } catch { return []; } };
    const normalize = (value) => (value || '').toLowerCase().replace(/\\s+/g, ' ').trim();
    const selectorMatches = (actual, expected) => normalize(actual) === normalize(expected);
    const rules = () => Array.from(document.styleSheets || []).flatMap((sheet) => {
      try { return Array.from(sheet.cssRules || []); } catch { return []; }
    });
    const hasCss = (selector, property, expected) => {
      for (const rule of rules()) {
        if (rule.type !== 1 || !selectorMatches(rule.selectorText, selector)) continue;
        const value = normalize(rule.style.getPropertyValue(property));
        if (value && (expected === undefined || value === normalize(expected) || value.startsWith(normalize(expected)) || normalize(rule.style.cssText).includes(normalize(expected)))) return true;
      }
      const element = query(selector);
      if (!element) return false;
      try {
        const value = normalize(getComputedStyle(element).getPropertyValue(property));
        return Boolean(value) && (expected === undefined || value === normalize(expected) || value.startsWith(normalize(expected)));
      } catch { return false; }
    };
    const hasMedia = (minWidth, selector, property) => {
      try {
        return rules().some((rule) => rule.type === 4 && normalize(rule.conditionText).replace(/\\s*:\\s*/g, ':').includes('min-width:' + minWidth + 'px') && Array.from(rule.cssRules || []).some((inner) => inner.type === 1 && selectorMatches(inner.selectorText, selector) && Boolean(inner.style.getPropertyValue(property))));
      } catch { return false; }
    };

    const run = (test) => {
      if (test.type === 'element') {
        const found = Boolean(query(test.selector));
        return { success: found, passed: found, message: test.message, expected: 'an element matching "' + test.selector + '"', actual: found ? 'found' : 'not found' };
      }
      if (test.type === 'count') {
        const actual = queryAll(test.selector).length;
        const min = test.min || 1;
        const pass = actual >= min;
        return { success: pass, passed: pass, message: test.message, expected: 'at least ' + min + ' element(s) matching "' + test.selector + '"', actual: actual + ' found' };
      }
      if (test.type === 'text') {
        const element = query(test.selector);
        const actual = element ? (element.textContent || '').trim() : '';
        const pass = Boolean(element) && actual.includes(test.contains);
        return { success: pass, passed: pass, message: test.message, expected: 'text containing "' + test.contains + '"', actual: actual || 'not found' };
      }
      if (test.type === 'attribute') {
        const element = query(test.selector);
        const actual = element ? element.getAttribute(test.attribute) : null;
        const pass = Boolean(element) && (test.value === undefined ? actual !== null : actual === test.value);
        return { success: pass, passed: pass, message: test.message, expected: test.attribute + (test.value === undefined ? ' attribute' : '="' + test.value + '"'), actual: actual === null ? '(missing)' : actual };
      }
      if (test.type === 'css') {
        const success = hasCss(test.selector, test.property, test.value);
        return { success, passed: success, message: test.message, expected: test.selector + ' has ' + test.property, actual: success ? 'applied' : 'not applied' };
      }
      if (test.type === 'media') {
        const success = hasMedia(test.minWidth, test.selector, test.property);
        return { success, passed: success, message: test.message, expected: 'responsive rule', actual: success ? 'applied' : 'not applied' };
      }
      if (test.type === 'event') {
        const target = query(test.selector);
        if (!target) return { success: false, passed: false, message: test.message, expected: 'target element exists', actual: 'not found' };
        try {
          if (test.action === 'click') target.click();
          else if (test.action === 'input') {
            if (test.value !== undefined) target.value = test.value;
            target.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (test.postCheck) {
            const checkEl = query(test.postCheck.selector);
            const checkText = checkEl ? (checkEl.textContent || '').trim() : '';
            const pass = Boolean(checkEl) && (test.postCheck.contains ? checkText.includes(test.postCheck.contains) : true);
            return { success: pass, passed: pass, message: test.message, expected: 'event updates DOM', actual: pass ? 'updated' : 'no change' };
          }
          return { success: true, passed: true, message: test.message };
        } catch (e) {
          return { success: false, passed: false, message: test.message, expected: 'event executes without error', actual: e.message };
        }
      }
      if (test.type === 'form') {
        try {
          if (test.inputs) {
            for (const [sel, val] of Object.entries(test.inputs)) {
              const input = query(sel);
              if (input) {
                input.value = val;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }
          }
          if (test.submitSelector) {
            const btn = query(test.submitSelector);
            if (btn) btn.click();
          } else {
            const form = query(test.formSelector || 'form');
            if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
          if (test.postCheck) {
            const checkEl = query(test.postCheck.selector);
            const checkText = checkEl ? (checkEl.textContent || '').trim() : '';
            const pass = Boolean(checkEl) && (test.postCheck.contains ? checkText.includes(test.postCheck.contains) : true);
            return { success: pass, passed: pass, message: test.message, expected: 'form submission updates UI', actual: pass ? 'verified' : 'not verified' };
          }
          return { success: true, passed: true, message: test.message };
        } catch (e) {
          return { success: false, passed: false, message: test.message, expected: 'form submission handles validation', actual: e.message };
        }
      }
      if (test.type === 'storage') {
        const stored = _storage.get(test.key) || '';
        const pass = test.contains ? stored.includes(test.contains) : Boolean(stored);
        return { success: pass, passed: pass, message: test.message, expected: 'localStorage key "' + test.key + '" set', actual: stored || '(empty)' };
      }
      return { success: true, passed: true, message: test.message };
    };

    try {
      const results = tests.map(run);
      parent.postMessage({ token: '${token}', passed: results.every((result) => result.passed || result.success), results }, '*');
    } catch (error) {
      parent.postMessage({ token: '${token}', passed: false, results: [], error: { kind: 'error', message: error.message || 'Validation failed.' } }, '*');
    }
  })();`;
}