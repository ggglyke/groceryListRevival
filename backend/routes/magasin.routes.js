const { requireAuth } = require("../middlewares/auth.middleware.js");

module.exports = (app) => {
  const magasins = require("../controllers/magasin.controller.js");

  var router = require("express").Router();

  // Apply authentication middleware to all routes
  router.use(requireAuth);

  // Create a new Magasin
  router.post("/", magasins.create);

  // Retrieve one by condition
  router.post("/findOneByCondition", magasins.findOneByCondition);

  // Retrieve one by condition
  router.post("/findManyByCondition", magasins.findManyByCondition);

  // Retrieve a single Magasin with id
  router.get("/:id", magasins.findOneById);

  // Update a Magasin with id
  router.put("/:id", magasins.update);

  // Delete a Magasin with id
  router.delete("/:id", magasins.delete);

  // Delete all Magasins (keep commented for safety)
  /*router.delete("/", magasins.deleteAll);*/

  app.use("/api/magasins", router);
};
