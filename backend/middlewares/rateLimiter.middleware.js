const rateLimit = require("express-rate-limit");

// Limiter général pour toutes les requêtes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par fenêtre par IP
  message: "Trop de requêtes depuis cette IP, veuillez réessayer dans 15 minutes",
  standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
});

// Limiter strict pour le login (protection brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite à 5 tentatives de login par IP
  message: "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes",
  skipSuccessfulRequests: true, // Ne compte pas les requêtes réussies
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter pour le register (éviter spam d'inscriptions)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Limite à 3 inscriptions par heure par IP
  message: "Trop d'inscriptions depuis cette IP, veuillez réessayer dans 1 heure",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
};
