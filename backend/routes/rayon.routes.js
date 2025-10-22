module.exports = (app) => {
  const rayons = require("../controllers/rayon.controller.js");

  var router = require("express").Router();

  // Create a new Rayon
  router.post("/", rayons.create);

  // Create multiple new Rayons
  router.post("/many", rayons.insertMany);

  //retrieve all user Products
  router.get("/user/:id", rayons.getAllUserAisles);

  // Retrieve a single Product with id
  router.get("/:id", rayons.findOne);

  // Update a Product with id
  router.put("/:id", rayons.update);

  // Delete a Product with id
  router.delete("/:id", rayons.delete);

  // Create a new Product
  router.delete("/", rayons.deleteAll);

  app.use("/api/rayons", router);
};
