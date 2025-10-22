const db = require("../models");
const mongoose = require("mongoose");
const axios = require("axios");
const List = db.lists;
const Magasin = db.magasins;

// Create and Save a new List
exports.create = async (req, res) => {
  // Create new list
  try {
    const { user, title, magasin } = req.body;
    if (!user) {
      return res.status(401).send({ message: "User ID required" });
    }
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const objectIdMagasinId = magasin
      ? new mongoose.Types.ObjectId(magasin)
      : null;
    const list = await List.create({
      user: objectIdUserId,
      title,
      magasin: objectIdMagasinId,
    });
    res.status(201).json({ list: list._id, listCreated: true });
  } catch (err) {
    console.error(err);
    res.json({
      message: err.message,
      created: false,
    });
  }
};

exports.getAllUserLists = (req, res) => {
  const userId = req.params.id;

  // Validation simple de l'ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  List.find({ user: userId }) // ← inutile de caster à la main
    .populate("products", "title")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error("Error retrieving user lists:", err);
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving user lists",
      });
    });
};

// Find a single List with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const list = await List.findById(id)
      .populate({
        path: "products",
        populate: { path: "rayon" },
      })
      .populate({
        path: "customProducts",
        populate: { path: "rayon" },
      });
    if (!list) {
      return res.status(404).send({ message: "List not found with id: " + id });
    }
    if (list.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this list" });
    }
    res.send(list);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving List with id=" + id });
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
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).send({
        message: `Cannot update List with id=${id}. List not found!`,
      });
    }
    if (list.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this list" });
    }
    const updatedList = await List.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });
    res.send({ message: "List was updated successfully.", list: updatedList });
  } catch (err) {
    res.status(500).send({
      message: "Error updating List with id=" + id,
    });
  }
};

// Delete a List with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).send({
        message: `Cannot delete List with id=${id}. List not found!`,
      });
    }
    if (list.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this list" });
    }
    await List.findByIdAndRemove(id);
    res.send({ message: "List was deleted successfully!" });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete List with id=" + id,
    });
  }
};
