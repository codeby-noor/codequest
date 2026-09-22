/**
 * authService.js
 *
 * Cryptographic authentication utilities for CodeQuest.
 * Implements salted PBKDF2 password hashing, constant-time verification,
 * and signed authentication tokens (HMAC-SHA256) without external native dependencies.
 */

const crypto = require("crypto");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const AUTH_SECRET = process.env.AUTH_SECRET || "codequest_default_secret_key_change_in_prod";
const TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";

/**
 * Generate cryptographic salt and PBKDF2 password hash.
 *
 * @param {string} password - Raw plaintext password.
 * @returns {{ hash: string, salt: string }}
 */
function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex");

  return { hash, salt };
}

/**
 * Verify password against stored hash and salt using timing-safe comparison.
 *
 * @param {string} password - Input password.
 * @param {string} storedHash - Existing hash.
 * @param {string} salt - Stored salt.
 * @returns {boolean} Whether password matches.
 */
function verifyPassword(password, storedHash, salt) {
  if (!password || !storedHash || !salt) return false;

  try {
    const computedHash = crypto
      .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
      .toString("hex");

    const storedBuffer = Buffer.from(storedHash, "hex");
    const computedBuffer = Buffer.from(computedHash, "hex");

    if (storedBuffer.length !== computedBuffer.length) return false;
    return crypto.timingSafeEqual(storedBuffer, computedBuffer);
  } catch (err) {
    return false;
  }
}

/**
 * Create a secure HMAC-SHA256 signed auth token.
 *
 * @param {object} payload - Token payload (userId, username, email).
 * @returns {string} Signed token format: base64(payload).signature
 */
function generateAuthToken(payload = {}) {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Date.now() + TOKEN_EXPIRY_MS;
  const tokenData = {
    ...payload,
    exp,
    iat: Date.now(),
  };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(tokenData)).toString("base64url");
  const dataToSign = `${headerB64}.${payloadB64}`;

  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(dataToSign)
    .digest("base64url");

  return `${dataToSign}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed auth token.
 *
 * @param {string} token - Signed auth token.
 * @returns {object|null} Decoded payload or null if invalid/expired.
 */
function verifyAuthToken(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signature] = parts;
  const dataToSign = `${headerB64}.${payloadB64}`;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(dataToSign)
      .digest("base64url");

    const sigBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  verifyAuthToken,
  AUTH_SECRET,
};
