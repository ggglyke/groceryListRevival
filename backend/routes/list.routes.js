const { requireAuth } = require("../middlewares/auth.middleware.js");

module.exports = (app) => {
  const lists = require("../controllers/list.controller.js");

  var router = require("express").Router();

  // Apply authentication middleware to all routes
  router.use(requireAuth);

  // Create a new List
  router.post("/", lists.create);

  //retrieve all user Lists
  router.get("/user/:id", lists.getAllUserLists);

  // Retrieve a single List with id
  router.get("/:id", lists.findOne);

  // Update a List with id
  router.put("/:id", lists.update);

  // Delete a List with id
  router.delete("/:id", lists.delete);

  app.use("/api/lists", router);
};
