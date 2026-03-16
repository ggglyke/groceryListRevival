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

      const verifyPromise = http.get("/users/verify");

      const { data } = await Promise.race([verifyPromise, timeoutPromise]);

      if (data?.authenticated) {
        // Sauvegarder en cache local pour les cold starts
        localStorage.setItem("auth_cache", JSON.stringify({
          userId: data.userId,
          username: data.username,
          ts: Date.now(),
        }));
        setState({
          loading: false,
          authenticated: true,
          user: { _id: data.userId, username: data.username },
        });
      } else {
        localStorage.removeItem("auth_cache");
        setState({ loading: false, authenticated: false, user: null });
      }
    } catch (err) {
      if (err.message === "Timeout") {
        console.log("[Auth] Timeout verify() - serveur Render.com en démarrage, vérification du cache");
        // Cold start : utiliser le cache si récent (< 30 jours)
        const cached = localStorage.getItem("auth_cache");
        if (cached) {
          const { userId, username, ts } = JSON.parse(cached);
          const age = Date.now() - ts;
          const maxCacheAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
          if (age < maxCacheAge) {
            console.log("[Auth] Cache valide, utilisateur considéré connecté");
            setState({ loading: false, authenticated: true, user: { _id: userId, username } });
            return;
          }
        }
      }
      localStorage.removeItem("auth_cache");
      setState({ loading: false, authenticated: false, user: null });
    }
  }, []);

  const setAuthenticated = useCallback((user) => {
    // Permet à Login de basculer en "auth=true" immédiatement après POST /login
    setState({ loading: false, authenticated: true, user: user || null });
  }, []);

  const logoutLocal = useCallback(() => {
    localStorage.removeItem("auth_cache");
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
