const db = require("../models");
const mongoose = require("mongoose");
const axios = require("axios");
const List = db.lists;
const Magasin = db.magasins;

// Create and Save a new List
exports.create = async (req, res) => {
  // Create new list
  try {
    const { title, magasin } = req.body;
    // Use req.userId from requireAuth middleware
    const objectIdUserId = new mongoose.Types.ObjectId(req.userId);
    const objectIdMagasinId = magasin
      ? new mongoose.Types.ObjectId(magasin)
      : null;
    const list = await List.create({
      user: objectIdUserId,
      title,
      magasin: objectIdMagasinId,
    });
    return res.status(200).json({ list: list._id, created: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while creating the List.",
    });
  }
};

exports.getAllUserLists = async (req, res) => {
  try {
    // Use req.userId from requireAuth middleware
    const lists = await List.find({ user: req.userId }).populate("products", "title");
    return res.send(lists);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while retrieving lists.",
    });
  }
};

// Find a single List with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const list = await List.findById(id)
      .populate("magasin")
      .populate({
        path: "products",
        populate: { path: "rayon" },
      })
      .populate({
        path: "customProducts.rayon",
      });
    if (!list) {
      return res.status(404).send({ message: "List not found with id: " + id });
    }
    // Verify ownership using req.userId from requireAuth middleware
    if (list.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this list" });
    }
    return res.send(list);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error retrieving List with id=" + id,
    });
  }
};

// Update a List by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  try {
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).send({ message: "List not found with id: " + id });
    }
    // Verify ownership using req.userId from requireAuth middleware
    if (list.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this list" });
    }
    const updatedList = await List.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });
    return res.send(updatedList);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error updating List with id=" + id,
    });
  }
};

// Delete a List with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).send({ message: "List not found with id: " + id });
    }
    // Verify ownership using req.userId from requireAuth middleware
    if (list.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this list" });
    }
    await List.findByIdAndDelete(id);
    return res.send({ message: "List was deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Could not delete List with id=" + id,
    });
  }
};
