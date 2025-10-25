const { doubleCsrf } = require("csrf-csrf");

// Configuration CSRF pour la production
const csrfConfig = {
  secret: process.env.CSRF_SECRET || "default-csrf-secret-change-in-production",
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
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