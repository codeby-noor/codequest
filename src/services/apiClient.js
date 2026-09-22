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
  (typeof window !== "undefined" && window.location.hostname === "localhost"
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
 */
async function handleResponse(response) {
  try {
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data.message || `Request failed with status ${response.status}`,
      };
    }
    return {
      success: true,
      status: response.status,
      ...data,
    };
  } catch (err) {
    return {
      success: false,
      status: response?.status || 500,
      message: "Failed to parse API response",
    };
  }
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

export const apiClient = {
  checkApiHealth,
  createPlayer,
  getPlayer,
  updatePlayerProgress,
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  linkAnonymousProgress,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};

export default apiClient;
