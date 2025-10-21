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
    const list = await List.create({
      user: objectIdUserId,
      title,
      magasin: objectIdMagasinId,
    });
    res.status(201).json({ list: list._id, listCreated: true });
  } catch (err) {
    res.json({
      message: err.message,
      created: false,
    });
  }
};

// Retrieve all Lists from the database.
exports.findAll = (req, res) => {
  const id = req.query._id;
  var condition = id;
  List.find({ condition })
    .populate("products", "title")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving lists",
      });
    });
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
exports.findOne = (req, res) => {
  const id = req.params.id;

  List.findById(id)
    .populate({
      path: "products",
      populate: { path: "rayon" },
    })
    .populate({
      path: "customProducts",
      populate: { path: "rayon" },
    })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found List with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving List with id=" + id });
    });
};

// Update a List by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  List.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update List with id=${id}. Maybe List was not found!`,
        });
      } else res.send({ message: "List was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating List with id=" + id,
      });
    });
};

// Delete a List with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  List.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete List with id=${id}. Maybe List was not found!`,
        });
      } else {
        res.send({
          message: "List was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete List with id=" + id,
      });
    });
};
