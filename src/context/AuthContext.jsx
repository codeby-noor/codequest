/**
 * AuthContext.jsx
 *
 * Authentication State Provider for CodeQuest.
 * Manages user credentials, token hydration, login/register actions,
 * modal triggers, and anonymous account linking.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  linkAnonymousProgress,
  getAuthToken,
  clearAuthToken,
} from "../services/apiClient";
import { getPlayerId, setPlayerId } from "../services/cloudSync";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getAuthToken());
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login"); // "login" | "register"

  // 1. Hydrate authentication session on startup
  useEffect(() => {
    let isMounted = true;
    const existingToken = getAuthToken();

    if (existingToken) {
      getMe()
        .then((res) => {
          if (!isMounted) return;
          if (res.success && res.user) {
            setUser(res.user);
            setToken(existingToken);
            // Ensure player ID points to authenticated user
            if (res.user.id) {
              setPlayerId(res.user.id);
            }
          } else {
            clearAuthToken();
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          if (isMounted) {
            setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const openLoginModal = useCallback(() => {
    setAuthModalTab("login");
    setAuthModalOpen(true);
  }, []);

  const openRegisterModal = useCallback(() => {
    setAuthModalTab("register");
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  /**
   * Register a new account, linking existing anonymous progress if present.
   */
  const register = useCallback(async (credentials) => {
    const anonymousPlayerId = getPlayerId();
    const payload = {
      ...credentials,
      anonymousPlayerId: anonymousPlayerId || undefined,
    };

    const res = await registerUser(payload);
    if (res.success && res.user) {
      setUser(res.user);
      setToken(res.token);
      if (res.user.id) {
        setPlayerId(res.user.id);
      }
      setAuthModalOpen(false);
    }
    return res;
  }, []);

  /**
   * Login an existing account, linking existing anonymous progress if present.
   */
  const login = useCallback(async (credentials) => {
    const anonymousPlayerId = getPlayerId();
    const payload = {
      ...credentials,
      anonymousPlayerId: anonymousPlayerId || undefined,
    };

    const res = await loginUser(payload);
    if (res.success && res.user) {
      setUser(res.user);
      setToken(res.token);
      if (res.user.id) {
        setPlayerId(res.user.id);
      }
      setAuthModalOpen(false);
    }
    return res;
  }, []);

  /**
   * Logout authenticated user.
   */
  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
  }, []);

  /**
   * Explicitly link anonymous progress.
   */
  const linkAnonymous = useCallback(async (anonymousPlayerId) => {
    const res = await linkAnonymousProgress(anonymousPlayerId);
    if (res.success && res.user) {
      setUser(res.user);
      if (res.user.id) {
        setPlayerId(res.user.id);
      }
    }
    return res;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
    register,
    login,
    logout,
    linkAnonymous,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
