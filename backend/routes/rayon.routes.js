const { requireAuth } = require("../middlewares/auth.middleware.js");

module.exports = (app) => {
  const rayons = require("../controllers/rayon.controller.js");

  var router = require("express").Router();

  // Apply authentication middleware to all routes
  router.use(requireAuth);

  // Create a new Rayon
  router.post("/", rayons.create);

  // Create multiple new Rayons
  router.post("/many", rayons.insertMany);

  //retrieve all user Aisles
  router.get("/user/:id", rayons.getAllUserAisles);

  // Retrieve a single Rayon with id
  router.get("/:id", rayons.findOne);

  // Update a Rayon with id
  router.put("/:id", rayons.update);

  // Delete a Rayon with id
  router.delete("/:id", rayons.delete);

  // Delete all Rayons
  router.delete("/", rayons.deleteAll);

  app.use("/api/rayons", router);
};
