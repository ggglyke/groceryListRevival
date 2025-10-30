import React, { createContext, useContext, useState, useCallback } from "react";
import http from "../http-common";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    authenticated: false,
    user: null,
  });

  const verify = useCallback(async () => {
    try {
      // Timeout de 5s pour éviter d'attendre indéfiniment si Render.com démarre
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      const verifyPromise = http.get("/users/verify"); // { authenticated, userId? }

      const { data } = await Promise.race([verifyPromise, timeoutPromise]);

      if (data?.authenticated) {
        setState({
          loading: false,
          authenticated: true,
          user: { _id: data.userId },
        });
      } else {
        setState({ loading: false, authenticated: false, user: null });
      }
    } catch (err) {
      // En cas d'erreur ou timeout, on considère non authentifié
      if (err.message === "Timeout") {
        console.log("[Auth] Timeout verify() - serveur Render.com peut être en démarrage");
      }
      setState({ loading: false, authenticated: false, user: null });
    }
  }, []);

  const setAuthenticated = useCallback((user) => {
    // Permet à Login de basculer en "auth=true" immédiatement après POST /login
    setState({ loading: false, authenticated: true, user: user || null });
  }, []);

  const logoutLocal = useCallback(() => {
    setState({ loading: false, authenticated: false, user: null });
  }, []);

  const value = { ...state, verify, setAuthenticated, logoutLocal };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
