import React, { useState } from "react";
import { apiClient } from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";
import "./FeedbackModal.css";

export default function FeedbackModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [type, setType] = useState("bug");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setErrorMessage("Please enter at least 10 characters to describe your feedback.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await apiClient.submitFeedback({
        type,
        rating: rating || null,
        message: message.trim(),
        email: email.trim() || undefined,
        metadata: {
          path: typeof window !== "undefined" ? window.location.pathname : "/",
        },
      });

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  const handleResetAndClose = () => {
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <div
      className="feedback-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div className="feedback-modal-content">
        <div className="feedback-modal-header">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "1.5rem" }} aria-hidden="true">
              {type === "bug" ? "🐛" : type === "feature" ? "💡" : "💬"}
            </span>
            <h2 id="feedback-modal-title" className="h5 mb-0 text-white">
              Tester Feedback &amp; Bug Report
            </h2>
          </div>
          <button
            type="button"
            className="feedback-close-btn"
            onClick={handleResetAndClose}
            aria-label="Close feedback modal"
          >
            ✕
          </button>
        </div>

        {status === "success" ? (
          <div className="feedback-success-state text-center py-4">
            <div className="mb-3" style={{ fontSize: "2.5rem" }} aria-hidden="true">
              🎉
            </div>
            <h3 className="h5 text-white mb-2">Thank You for Your Feedback!</h3>
            <p className="text-secondary small mb-4">
              Your feedback helps us continuously improve the CodeQuest learning experience.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetAndClose}
            >
              Back to Quest
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            {errorMessage && (
              <div className="alert alert-danger py-2 small" role="alert">
                {errorMessage}
              </div>
            )}

            {/* Feedback Type Tabs */}
            <div className="mb-3">
              <label className="form-label small text-muted mb-2">Category</label>
              <div className="feedback-type-selector">
                <button
                  type="button"
                  className={`feedback-type-btn ${type === "bug" ? "active" : ""}`}
                  onClick={() => setType("bug")}
                >
                  🐛 Bug Report
                </button>
                <button
                  type="button"
                  className={`feedback-type-btn ${type === "feature" ? "active" : ""}`}
                  onClick={() => setType("feature")}
                >
                  💡 Suggestion
                </button>
                <button
                  type="button"
                  className={`feedback-type-btn ${type === "general" ? "active" : ""}`}
                  onClick={() => setType("general")}
                >
                  💬 Experience
                </button>
              </div>
            </div>

            {/* Satisfaction Rating */}
            <div className="mb-3">
              <label htmlFor="feedback-rating" className="form-label small text-muted mb-1">
                Satisfaction Rating: <strong>{rating} / 5</strong>
              </label>
              <div className="d-flex align-items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="feedback-star-btn"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5`}
                  >
                    {star <= rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label htmlFor="feedback-message" className="form-label small text-muted mb-1">
                  Details <span className="text-danger">*</span>
                </label>
                <span className="small text-muted">{message.length}/2000</span>
              </div>
              <textarea
                id="feedback-message"
                className="form-control feedback-textarea"
                rows={4}
                maxLength={2000}
                required
                placeholder={
                  type === "bug"
                    ? "Describe what happened, steps to reproduce, or unexpected behavior..."
                    : type === "feature"
                    ? "What feature or challenge topic would you like to see?"
                    : "Tell us about your learning experience on CodeQuest..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Optional Email */}
            <div className="mb-4">
              <label htmlFor="feedback-email" className="form-label small text-muted mb-1">
                Your Email (Optional, for follow-up)
              </label>
              <input
                id="feedback-email"
                type="email"
                className="form-control feedback-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetAndClose}
                disabled={status === "submitting"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={status === "submitting" || message.trim().length < 10}
              >
                {status === "submitting" ? "Submitting..." : "Send Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
