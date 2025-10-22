const { checkUser } = require("../middlewares/auth.middleware.js");

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // Create a new User
  router.post("/register", users.register);

  // Login User
  router.post("/login", users.login);

  // Logout User
  router.post("/logout", users.logout);

  // Check User
  router.post("/checkUser", checkUser);

  // Vérification simple (répond toujours JSON 200)
  router.get("/verify", users.verify);

  app.use("/api/users", router);
};
