/**
 * apiClient.js
 *
 * Client service for interacting with the CodeQuest Express REST API.
 * Never connects directly to MongoDB; communicates purely over HTTP.
 * Supports Bearer token authentication and anonymous account linking.
 */

export const AUTH_TOKEN_KEY = "codequest_auth_token";

export function getAuthToken() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (typeof window === "undefined" || !window.localStorage) return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, String(token));
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function clearAuthToken() {
  if (typeof window === "undefined" || !window.localStorage) return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

const API_BASE =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "/api");

/**
 * Returns default headers with optional Authorization Bearer token.
 */
function getHeaders(extraHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Handle fetch response safely.
 * Gracefully parses JSON or non-JSON (HTML/text) without crashing,
 * mapping status codes to clear, user-friendly error messages.
 */
async function handleResponse(response) {
  if (!response) {
    return {
      success: false,
      status: 0,
      message: "No response received from API server",
      offline: true,
    };
  }

  const status = response.status || 500;
  let data = null;

  try {
    if (typeof response.json === "function") {
      data = await response.json();
    } else if (typeof response.text === "function") {
      const text = await response.text();
      data = JSON.parse(text);
    }
  } catch (err) {
    // Non-JSON response (e.g. 405 Method Not Allowed HTML, or malformed proxy error)
    let fallbackMessage = "Failed to parse API response";
    if (status === 405) {
      fallbackMessage = "Endpoint method not supported by server. Please verify deployment routing.";
    } else if (status === 404) {
      fallbackMessage = "Requested API endpoint not found.";
    }
    return {
      success: false,
      status,
      message: fallbackMessage,
    };
  }

  if (!response.ok) {
    let errorMessage = "";
    if (data && (data.message || data.error)) {
      errorMessage = data.message || data.error;
    } else if (status === 405) {
      errorMessage = "Endpoint method not supported by server. Please verify deployment routing.";
    } else if (status === 404) {
      errorMessage = "Requested API endpoint not found.";
    } else if (status === 401) {
      errorMessage = "Invalid email or password.";
    } else if (status === 403) {
      errorMessage = "Access forbidden.";
    } else if (status === 409) {
      errorMessage = "An account with this email or username already exists.";
    } else if (status === 429) {
      errorMessage = "Too many attempts. Please wait a few minutes before trying again.";
    } else if (status === 502 || status === 503 || status === 504) {
      errorMessage = "Cloud service temporarily unavailable. Progress is safely saved locally.";
    } else {
      errorMessage = `Request failed with status ${status}`;
    }

    return {
      success: false,
      status,
      message: errorMessage,
      ...(data && typeof data === "object" ? data : {}),
    };
  }

  return {
    success: true,
    status,
    ...(data && typeof data === "object" ? data : {}),
  };
}

/**
 * Health check endpoint.
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "API server unreachable",
      offline: true,
    };
  }
}

/**
 * Create a new anonymous player account on the backend.
 *
 * @param {object} [userData={}] - Initial player details.
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
export async function createPlayer(userData = {}) {
  try {
    const payload = {
      username: userData.username || `Adventurer_${Date.now().toString(36).toUpperCase()}`,
      email: userData.email || null,
      avatar: userData.avatar || "⚔️",
    };

    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Could not create player profile on cloud server",
      offline: true,
    };
  }
}

/**
 * Retrieve player profile and progress from the backend.
 *
 * @param {string} playerId - The player ID.
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
export async function getPlayer(playerId) {
  if (!playerId) {
    return { success: false, message: "Player ID is required" };
  }

  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(playerId)}`, {
      headers: getHeaders(),
    });
    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Could not fetch cloud progress",
      offline: true,
    };
  }
}

/**
 * Update player progress in the cloud database.
 *
 * @param {string} playerId - The player ID.
 * @param {object} progress - Progress fields (xp, level, streak, completedLessons, etc.)
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
export async function updatePlayerProgress(playerId, progress = {}) {
  if (!playerId) {
    return { success: false, message: "Player ID is required" };
  }

  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(playerId)}/progress`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(progress),
    });

    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Cloud sync failed; saved locally",
      offline: true,
    };
  }
}

/**
 * Submit verified challenge completion to the backend server.
 * Atomically awards XP, advances streaks, evaluates achievements, and updates level.
 *
 * @param {string} playerId
 * @param {string} challengeId
 * @param {object} metadata - { lessonId, difficulty, xp, skillId, skillProgress }
 * @returns {Promise<object>} Server decision and award summary
 */
export async function completeChallenge(playerId, challengeId, metadata = {}) {
  if (!playerId) {
    return { success: false, message: "Player ID is required", offline: true };
  }
  if (!challengeId) {
    return { success: false, message: "Challenge ID is required" };
  }

  try {
    const res = await fetch(
      `${API_BASE}/users/${encodeURIComponent(playerId)}/challenges/${encodeURIComponent(challengeId)}/complete`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(metadata),
      }
    );

    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Network error submitting challenge completion. Progress saved locally.",
      offline: true,
    };
  }
}

/**
 * Fetch real-time public leaderboard standings.
 *
 * @param {object} [params] - { limit, page, userId }
 * @returns {Promise<object>}
 */
export async function getLeaderboard(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    if (params.userId) query.set("userId", String(params.userId));

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE}/leaderboard${qs}`, {
      headers: getHeaders(),
    });

    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Could not fetch online leaderboard standings",
      offline: true,
    };
  }
}

// =========================================================================
// Authentication Client Methods
// =========================================================================

/**
 * Register a new user account with password.
 */
export async function registerUser(credentials = {}) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const result = await handleResponse(res);
    if (result.success && result.token) {
      setAuthToken(result.token);
    }
    return result;
  } catch (err) {
    return {
      success: false,
      message: "Registration request failed",
      offline: true,
    };
  }
}

/**
 * Login existing user with email/username and password.
 */
export async function loginUser(credentials = {}) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const result = await handleResponse(res);
    if (result.success && result.token) {
      setAuthToken(result.token);
    }
    return result;
  } catch (err) {
    return {
      success: false,
      message: "Login request failed",
      offline: true,
    };
  }
}

/**
 * Retrieve current authenticated user profile.
 */
export async function getMe() {
  const token = getAuthToken();
  if (!token) {
    return { success: false, message: "No auth token" };
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });

    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Failed to verify authenticated session",
      offline: true,
    };
  }
}

/**
 * Logout user.
 */
export async function logoutUser() {
  clearAuthToken();
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
    });
  } catch (e) {
    // Non-fatal
  }
  return { success: true };
}

/**
 * Explicitly link anonymous progress to the authenticated account.
 */
export async function linkAnonymousProgress(anonymousPlayerId) {
  try {
    const res = await fetch(`${API_BASE}/auth/link-anonymous`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ anonymousPlayerId }),
    });

    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Account linking request failed",
      offline: true,
    };
  }
}

/**
 * Submit feedback or bug report to the server.
 */
export async function submitFeedback(feedbackData) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(feedbackData),
    });

    return await handleResponse(res);
  } catch (err) {
    return {
      success: false,
      message: "Feedback submission failed. Please try again later.",
      offline: true,
    };
  }
}

export const apiClient = {
  checkApiHealth,
  createPlayer,
  getPlayer,
  updatePlayerProgress,
  completeChallenge,
  getLeaderboard,
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  linkAnonymousProgress,
  submitFeedback,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};

export default apiClient;
