const { checkUser } = require("../middlewares/auth.middleware.js");
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resendVerificationLimiter,
} = require("../middlewares/rateLimiter.middleware.js");
const validate = require("../middlewares/validate.middleware.js");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} = require("../validators/user.validator.js");

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // Create a new User (avec rate limiting + validation)
  router.post("/register", registerLimiter, validate(registerSchema), users.register);

  // Login User (avec rate limiting strict anti-brute force + validation)
  router.post("/login", loginLimiter, validate(loginSchema), users.login);

  // Logout User
  router.post("/logout", users.logout);

  // Check User
  router.post("/checkUser", checkUser);

  // Vérification simple (répond toujours JSON 200)
  router.get("/verify", users.verify);

  // Demande de réinitialisation de mot de passe (avec rate limiting + validation)
  router.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), users.forgotPassword);

  // Réinitialisation du mot de passe (avec validation)
  router.post("/reset-password", validate(resetPasswordSchema), users.resetPassword);

  // Vérification de l'email (token en query, envoyé par email à l'inscription)
  router.get("/verify-email", validate(verifyEmailSchema), users.verifyEmailToken);

  // Renvoi de l'email de vérification (avec rate limiting + validation)
  router.post("/resend-verification", resendVerificationLimiter, validate(resendVerificationSchema), users.resendVerification);

  app.use("/api/users", router);
};
