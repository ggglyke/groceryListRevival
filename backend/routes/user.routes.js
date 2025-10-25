const { checkUser } = require("../middlewares/auth.middleware.js");
const {
  loginLimiter,
  registerLimiter,
} = require("../middlewares/rateLimiter.middleware.js");
const validate = require("../middlewares/validate.middleware.js");
const {
  registerSchema,
  loginSchema,
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

  app.use("/api/users", router);
};
