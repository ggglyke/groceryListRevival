const { doubleCsrf } = require("csrf-csrf");

// Configuration CSRF pour la production
const csrfConfig = {
  getSecret: () => process.env.CSRF_SECRET || "default-csrf-secret-change-in-production", // Fonction qui retourne le secret
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" pour cross-domain en prod
    secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true",
    path: "/",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
};

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf(csrfConfig);

module.exports = {
  generateToken: generateCsrfToken,
  doubleCsrfProtection,
};