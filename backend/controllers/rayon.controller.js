const db = require("../models");
const mongoose = require("mongoose");
const Rayon = db.rayons;

exports.create = async (req, res) => {
  // Create new rayon
  try {
    const { userId, title, isDefault } = req.body;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const magasin = await Rayon.create({
      user: objectIdUserId,
      title,
      isDefault,
    });
    res.status(200).json({ magasin: magasin._id, created: true });
  } catch (err) {
    console.error(err);
    res.json({
      message: "Erreur lors de la création du rayon",
      created: false,
    });
  }
};

exports.insertMany = async (req, res) => {
  try {
    const rayonsData = req.body;
    const hasInvalidData = rayonsData.some((rayon) => !rayon.user);
    if (hasInvalidData) {
      return res.status(400).json({
        message: "Tous les rayons doivent avoir un user ID",
        rayonsCreated: false,
      });
    }
    const rayons = await Rayon.insertMany(rayonsData);
    res.status(201).json({ rayons, rayonsCreated: true });
  } catch (err) {
    console.error(err);
    res.json({
      message:
        err.message ||
        "Erreur lors de la création des rayons du magasin par défaut ",
      rayonsCreated: false,
    });
  }
};

exports.getAllUserAisles = (req, res) => {
  const userId = req.params.id;
  const objectIdUserId = new mongoose.Types.ObjectId(userId);
  var condition = { user: objectIdUserId };
  Rayon.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving user aisles",
      });
    });
};

// Find a single Rayon with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const rayon = await Rayon.findById(id);
    if (!rayon) {
      return res
        .status(404)
        .send({ message: "Rayon not found with id: " + id });
    }
    if (rayon.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this rayon" });
    }

    res.send(rayon);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Rayon with id=" + id });
  }
};

// Update a Rayon by the id in the request
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
    const rayon = await Rayon.findById(id);

    if (!rayon) {
      return res.status(404).send({
        message: `Cannot update Rayon with id=${id}. Rayon not found!`,
      });
    }

    if (rayon.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this rayon" });
    }

    const updatedRayon = await Rayon.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });

    res.send({
      message: "Rayon was updated successfully.",
      rayon: updatedRayon,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating Rayon with id=" + id,
    });
  }
};

// Delete a Rayon with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const rayon = await Rayon.findById(id);

    if (!rayon) {
      return res.status(404).send({
        message: `Cannot delete Rayon with id=${id}. Rayon not found!`,
      });
    }

    if (rayon.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this rayon" });
    }

    await Rayon.findByIdAndDelete(id);
    res.send({ message: "Rayon was deleted successfully!" });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Rayon with id=" + id,
    });
  }
};

// Delete all Rayons from the database.
exports.deleteAll = async (req, res) => {
  const userId = req.body.user || req.query.userId;
  if (!userId) {
    return res.status(400).send({
      message: "User ID is required to delete rayons",
    });
  }

  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  try {
    const result = await Rayon.deleteMany({ user: objectIdUserId });
    res.send({
      message: `${result.deletedCount} Rayons were deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all rayons.",
    });
  }
};
