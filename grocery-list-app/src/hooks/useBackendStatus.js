import { useState, useEffect, useCallback } from "react";
import http from "../http-common";

const BACKEND_STATUS = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  STARTING: "starting",
};

/**
 * Hook pour surveiller l'état du backend
 * @param {number} checkInterval - Intervalle de vérification en ms (défaut: 30s)
 * @returns {object} { status: 'connected'|'disconnected'|'starting', lastCheck: Date }
 */
export default function useBackendStatus(checkInterval = 30000) {
  const [status, setStatus] = useState(BACKEND_STATUS.CONNECTED);
  const [lastCheck, setLastCheck] = useState(null);

  const checkBackendHealth = useCallback(async () => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      // Utilise /csrf-token qui est léger et existe dans /api
      const healthPromise = http.get("/csrf-token", { timeout: 5000 });

      await Promise.race([healthPromise, timeoutPromise]);

      // Backend répond correctement
      setStatus(BACKEND_STATUS.CONNECTED);
      setLastCheck(new Date());
    } catch (err) {
      setLastCheck(new Date());

      if (err.message === "Timeout" || err.code === "ECONNABORTED") {
        // Timeout = probablement en train de démarrer (Render.com)
        setStatus(BACKEND_STATUS.STARTING);
      } else if (err.response) {
        // Backend répond mais avec une erreur (toujours mieux que rien)
        setStatus(BACKEND_STATUS.CONNECTED);
      } else {
        // Pas de réponse = backend déconnecté ou problème réseau
        setStatus(BACKEND_STATUS.DISCONNECTED);
      }
    }
  }, []);

  // Vérification initiale au montage
  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  // Vérification périodique
  useEffect(() => {
    const interval = setInterval(checkBackendHealth, checkInterval);
    return () => clearInterval(interval);
  }, [checkBackendHealth, checkInterval]);

  return { status, lastCheck, BACKEND_STATUS };
}
