import React from "react";
import { captureClientException } from "../../services/errorMonitoring";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    captureClientException(error, {
      componentName: "ErrorBoundary",
      componentStack: errorInfo?.componentStack?.slice(0, 300),
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            color: "#e2e8f0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "540px",
              background: "#121826",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "1rem",
              padding: "2.5rem 2rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }} aria-hidden="true">
              🛡️
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#f87171",
                marginBottom: "0.75rem",
                fontFamily: "var(--font-display, inherit)",
              }}
            >
              Something Went Astray
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#94a3b8",
                lineHeight: "1.6",
                marginBottom: "1.75rem",
              }}
            >
              A quest anomaly occurred. Don't worry — your progress and achievements remain safe in local storage.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-secondary"
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn btn-primary"
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Return to Base
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
