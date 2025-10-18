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

  // Retrieve all Users
  /* router.get("/", users.findAll);

  // Retrieve one user
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);*/

  app.use("/api/users", router);
};
