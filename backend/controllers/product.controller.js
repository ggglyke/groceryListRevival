const db = require("../models");
const mongoose = require("mongoose");
const Product = db.products;

// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    const { title, rayon } = req.body;
    // Use req.userId from requireAuth middleware
    const product = await Product.create({ user: req.userId, title, rayon });
    return res.status(200).json({ product: product._id, created: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while creating the Product.",
    });
  }
};

exports.getAllUserProducts = async (req, res) => {
  try {
    // Use req.userId from requireAuth middleware
    const objectIdUserId = new mongoose.Types.ObjectId(req.userId);
    const condition = { user: objectIdUserId };
    const products = await Product.find(condition).populate("rayon", "title");
    return res.send(products);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while retrieving products.",
    });
  }
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id).populate("rayon", "title");

    if (!product) {
      return res.status(404).send({ message: "Product not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (product.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this product" });
    }
    return res.send(product);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error retrieving Product with id=" + id,
    });
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

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({ message: "Product not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (product.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this product" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });
    return res.send(updatedProduct);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};

// Delete a Product with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({ message: "Product not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (product.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this product" });
    }
    await Product.findByIdAndDelete(id);
    return res.send({ message: "Product was deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Could not delete Product with id=" + id,
    });
  }
};

// Delete all Products from a user from the database.
exports.deleteAll = async (req, res) => {
  // Use req.userId from requireAuth middleware
  const objectIdUserId = new mongoose.Types.ObjectId(req.userId);
  try {
    const result = await Product.deleteMany({ user: objectIdUserId });
    return res.send({
      message: `${result.deletedCount} Product(s) were deleted successfully!`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while removing all products.",
    });
  }
};

// Find all published Products
exports.findAllPublished = (req, res) => {};
