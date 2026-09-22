/**
 * Unified challenge validation dispatcher.
 *
 * Routes validation to the correct engine based on challengeType:
 *  - javascript:  Web Worker execution (existing challengeEngine)
 *  - html:        sandboxed iframe preview + HTML validation
 *  - css:         sandboxed iframe preview + CSS validation
 *  - html-css:    sandboxed iframe preview + combined validation
 *  - dom:         sandboxed iframe preview + DOM/events/storage validation
 *
 * The UI consumes this single entry point — adding a new challenge type
 * only requires adding a new provider here, never touching components.
 */

import { validateChallenge as validateJsChallenge } from "./challengeEngine";
import { validateHtmlCssChallenge } from "./htmlCssValidator";

export const CHALLENGE_TYPES = {
  JAVASCRIPT: "javascript",
  HTML: "html",
  CSS: "css",
  HTML_CSS: "html-css",
  DOM: "dom",
};

/**
 * Validate user code against a challenge definition.
 * Dispatches to the appropriate engine based on challenge.challengeType.
 *
 * @param {string|object} codeOrOptions - The user's code or an options object.
 * @param {object} [challenge] - Challenge with .challengeType and .tests.
 * @returns {Promise<{passed: boolean, results: Array, error: object|null}>}
 */
export async function validateUserChallenge(codeOrOptions, challenge) {
  let code = codeOrOptions;
  let chal = challenge;

  if (typeof codeOrOptions === "object" && codeOrOptions !== null && !challenge) {
    code = codeOrOptions.userCode || codeOrOptions.code;
    chal = codeOrOptions.challenge;
  }

  const type = chal?.challengeType || CHALLENGE_TYPES.JAVASCRIPT;

  switch (type) {
    case CHALLENGE_TYPES.HTML:
    case CHALLENGE_TYPES.CSS:
    case CHALLENGE_TYPES.HTML_CSS:
    case CHALLENGE_TYPES.DOM:
      return validateHtmlCssChallenge(code, chal);

    case CHALLENGE_TYPES.JAVASCRIPT:
    default:
      return validateJsChallenge(code, chal);
  }
}

/**
 * Alias for validateUserChallenge.
 */
export const validateChallenge = validateUserChallenge;

/**
 * Whether a challenge uses the sandboxed HTML/CSS/DOM preview.
 * Used by the UI to decide whether to show a live preview panel.
 */
export function isHtmlCssChallenge(challenge) {
  const type = challenge?.challengeType;
  return (
    type === CHALLENGE_TYPES.HTML ||
    type === CHALLENGE_TYPES.CSS ||
    type === CHALLENGE_TYPES.HTML_CSS ||
    type === CHALLENGE_TYPES.DOM
  );
}