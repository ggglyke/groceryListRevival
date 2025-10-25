const { requireAuth } = require("../middlewares/auth.middleware.js");

module.exports = (app) => {
  const products = require("../controllers/product.controller.js");

  var router = require("express").Router();

  // Apply authentication middleware to all routes
  router.use(requireAuth);

  // Create a new Product
  router.post("/", products.create);

  //retrieve all user Products
  router.get("/user/:id", products.getAllUserProducts);

  // Retrieve a single Product with id
  router.get("/:id", products.findOne);

  // Update a Product with id
  router.put("/:id", products.update);

  // Delete a Product with id
  router.delete("/:id", products.delete);

  // Delete all Products
  router.delete("/", products.deleteAll);

  app.use("/api/products", router);
};
