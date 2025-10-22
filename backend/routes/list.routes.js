module.exports = (app) => {
  const lists = require("../controllers/list.controller.js");

  var router = require("express").Router();

  // Create a new List
  router.post("/", lists.create);

  //retrieve all user Lists
  router.get("/user/:id", lists.getAllUserLists);

  router.get("/:id", lists.findOne);

  // Update a List with id
  router.put("/:id", lists.update);

  app.use("/api/lists", router);

  // Delete a List with id
  router.delete("/:id", lists.delete);
};
