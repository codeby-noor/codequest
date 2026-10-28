import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button/Button";
import { trackEvent, ANALYTICS_EVENTS } from "../../services/analytics";
import "./AuthModal.css";

/**
 * Humanizes backend/network errors for user-facing UI.
 */
function humanizeError(rawError) {
  if (!rawError) return "An unexpected error occurred. Please try again.";
  const str = String(rawError).toLowerCase();

  if (str.includes("invalid") || str.includes("credentials") || str.includes("401") || str.includes("not found")) {
    return "Email or password is incorrect.";
  }
  if (str.includes("already") || str.includes("exists") || str.includes("409") || str.includes("taken")) {
    return "An account with this email or username already exists.";
  }
  if (str.includes("network") || str.includes("failed to fetch") || str.includes("unreachable") || str.includes("offline")) {
    return "Unable to connect. Please check your internet connection and try again.";
  }
  if (str.includes("rate limit") || str.includes("too many requests") || str.includes("429")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (str.includes("at least 6 characters") || str.includes("password")) {
    return "Password must be at least 6 characters long.";
  }

  return rawError;
}

export default function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && authModalOpen) {
        closeAuthModal();
      }
    }
    if (authModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [authModalOpen, closeAuthModal]);

  // Reset form when modal opens or tab changes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
  }, [authModalTab, authModalOpen]);

  if (!authModalOpen) return null;

  const isLogin = authModalTab === "login";

  // Form Validation checks
  const isEmailValid = isLogin
    ? identifier.trim().length > 0
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isUsernameValid = isLogin ? true : username.trim().length >= 2 && username.trim().length <= 30;
  const isPasswordValid = password.length >= 6;
  const isFormValid = isLogin
    ? identifier.trim().length > 0 && isPasswordValid
    : isUsernameValid && isEmailValid && isPasswordValid;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const res = await login({ identifier: identifier.trim(), password });
        if (!res.success) {
          setError(humanizeError(res.message));
        } else {
          trackEvent(ANALYTICS_EVENTS.AUTH_LOGIN_COMPLETED);
          setSuccessMessage("Signed in successfully — your quest ledger is ready!");
        }
      } else {
        const res = await register({
          username: username.trim(),
          email: email.trim(),
          password,
        });
        if (!res.success) {
          setError(humanizeError(res.message));
        } else {
          trackEvent(ANALYTICS_EVENTS.AUTH_REGISTER_COMPLETED);
          setSuccessMessage("Account created — your CodeQuest progress is now linked.");
        }
      }
    } catch (err) {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <div
        className="auth-modal-backdrop"
        onClick={closeAuthModal}
        role="presentation"
      >
        <motion.div
          ref={modalRef}
          className="auth-modal-card card card-elevated"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            className="auth-modal-close"
            onClick={closeAuthModal}
            aria-label="Close authentication window"
          >
            ✕
          </button>

          <div className="auth-modal-header">
            <div className="auth-modal-icon" aria-hidden="true">🛡️</div>
            <h2 id="auth-modal-title">{isLogin ? "Welcome Back" : "Begin Your Adventure"}</h2>
            <p className="auth-modal-subtitle">
              {isLogin
                ? "Sign in to access your cloud progress and continue your quests."
                : "Create an account to securely save your XP, skills, and conquered worlds."}
            </p>
          </div>

          <div className="auth-modal-tabs" role="tablist" aria-label="Authentication Options">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={`auth-tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => {
                setError(null);
                setAuthModalTab("login");
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={`auth-tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => {
                setError(null);
                setAuthModalTab("register");
              }}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="auth-error-banner" role="alert">
              <span aria-hidden="true">⚠️</span> {error}
            </div>
          )}

          {successMessage && (
            <div className="auth-success-banner" role="status">
              <span aria-hidden="true">✨</span> {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {!isLogin && (
              <div className="auth-input-group">
                <label htmlFor="auth-username">
                  Adventurer Name
                  <span className="auth-field-hint">(2–30 characters)</span>
                </label>
                <input
                  id="auth-username"
                  type="text"
                  placeholder="e.g. CodeKnight"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  minLength={2}
                  maxLength={30}
                  aria-invalid={username.length > 0 && !isUsernameValid}
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="auth-input-group">
              <label htmlFor="auth-email">
                {isLogin ? "Email or Username" : "Email Address"}
              </label>
              <input
                id="auth-email"
                type={isLogin ? "text" : "email"}
                placeholder={isLogin ? "you@example.com or username" : "you@example.com"}
                value={isLogin ? identifier : email}
                onChange={(e) =>
                  isLogin ? setIdentifier(e.target.value) : setEmail(e.target.value)
                }
                required
                autoComplete={isLogin ? "username" : "email"}
                aria-invalid={!isLogin && email.length > 0 && !isEmailValid}
                disabled={isSubmitting}
              />
              {!isLogin && email.length > 0 && !isEmailValid && (
                <span className="auth-field-error">Please enter a valid email address</span>
              )}
            </div>

            <div className="auth-input-group">
              <div className="auth-label-row">
                <label htmlFor="auth-password">Password</label>
                {!isLogin && (
                  <span className="auth-field-hint">Min. 6 characters</span>
                )}
              </div>
              <div className="auth-password-wrapper">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  minLength={6}
                  aria-invalid={password.length > 0 && !isPasswordValid}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {!isLogin && password.length > 0 && !isPasswordValid && (
                <span className="auth-field-error">Password must be at least 6 characters</span>
              )}
            </div>

            <div className="auth-sync-hint">
              <span aria-hidden="true">✨</span>
              <span>
                {isLogin
                  ? "Your local device progress will be merged automatically."
                  : "Your progress is saved locally — create an account to link it seamlessly across devices."}
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isFormValid || isSubmitting}
              className="w-full mt-2 auth-submit-btn"
            >
              {isSubmitting ? (
                <span className="auth-btn-loading">
                  <span className="auth-spinner" aria-hidden="true" />
                  {isLogin ? "Signing in…" : "Creating account…"}
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account & Link Progress"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
