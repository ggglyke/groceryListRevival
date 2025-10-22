const db = require("../models");
const mongoose = require("mongoose");
const Product = db.products;

// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    const { user, title, rayon } = req.body;
    const product = await Product.create({ user, title, rayon });
    res.status(201).json({ product: product._id, created: true });
  } catch (err) {
    console.error(err);
    res.json({
      message: "Erreur lors de la création du produit",
      created: false,
    });
  }
};

exports.getAllUserProducts = (req, res) => {
  const userId = req.params.id;
  const objectIdUserId = new mongoose.Types.ObjectId(userId);
  var condition = { user: objectIdUserId };
  Product.find(condition)
    .populate("rayon", "title")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving user lists",
      });
    });
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const product = await Product.findById(id).populate("rayon", "title");

    if (!product) {
      return res
        .status(404)
        .send({ message: "Product not found with id : " + id });
    }

    if (product.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this product" });
    }
    res.send(product);
  } catch (err) {
    res.status(403).send({ message: "Error retrieving product with id=" + id });
  }
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({
        message: `Cannot update Product with id=${id}. Product not found!`,
      });
    }

    if (product.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this product" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });
    res.send({
      message: "Product was updated successfully.",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};

// Delete a Product with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({
        message: `Cannot delete Product with id=${id}. Product not found!`,
      });
    }

    if (product.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this product" });
    }
    await Product.findByIdAndDelete(id);
    res.send({ message: "Product was deleted successfully!" });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Product with id=" + id,
    });
  }
};

// Delete all Products from a user from the database.
exports.deleteAll = async (req, res) => {
  const userId = req.body.user || req.query.userId;
  if (!userId) {
    return res.status(400).send({
      message: "User ID is required to delete products",
    });
  }
  const objectIdUserId = new mongoose.Types.ObjectId(userId);
  try {
    const result = await Product.deleteMany({ user: objectIdUserId });

    res.send({
      message: `${result.deletedCount} Products were deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all products.",
    });
  }
};

// Find all published Products
exports.findAllPublished = (req, res) => {};
