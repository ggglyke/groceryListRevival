const db = require("../models");
const mongoose = require("mongoose");
const Rayon = db.rayons;

exports.create = async (req, res) => {
  // Create new rayon
  try {
    const { title, isDefault } = req.body;
    // Use req.userId from requireAuth middleware
    const objectIdUserId = new mongoose.Types.ObjectId(req.userId);
    const rayon = await Rayon.create({
      user: objectIdUserId,
      title,
      isDefault,
    });
    res.status(201).json({ rayon: rayon._id, created: true });
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
    // Use req.userId from requireAuth middleware and attach to all rayons
    const objectIdUserId = new mongoose.Types.ObjectId(req.userId);
    const rayonsWithUser = rayonsData.map((rayon) => ({
      ...rayon,
      user: objectIdUserId,
    }));
    const rayons = await Rayon.insertMany(rayonsWithUser);
    res.status(201).send(rayons);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Rayons.",
    });
  }
};

exports.getAllUserAisles = async (req, res) => {
  try {
    // Use req.userId from requireAuth middleware
    const objectIdUserId = new mongoose.Types.ObjectId(req.userId);
    const condition = { user: objectIdUserId };
    await Rayon.find(condition).then((data) => {
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving rayons.",
    });
  }
};

// Find a single Rayon with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const rayon = await Rayon.findById(id);
    if (!rayon) {
      return res
        .status(404)
        .send({ message: "Rayon not found with id: " + id });
    }
    // Verify ownership using req.userId from requireAuth middleware
    if (rayon.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this rayon" });
    }

    res.send(rayon);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error retrieving Rayon with id=" + id,
    });
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

  try {
    const rayon = await Rayon.findById(id);

    if (!rayon) {
      return res
        .status(404)
        .send({ message: "Rayon not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (rayon.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this rayon" });
    }

    const updatedRayon = await Rayon.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });

    res.send(updatedRayon);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error updating Rayon with id=" + id,
    });
  }
};

// Delete a Rayon with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const rayon = await Rayon.findById(id);

    if (!rayon) {
      return res
        .status(404)
        .send({ message: "Rayon not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (rayon.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this rayon" });
    }

    await Rayon.findByIdAndDelete(id);
    res.send({ message: "Rayon was deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Could not delete Rayon with id=" + id,
    });
  }
};

// Delete all Rayons from the database.
exports.deleteAll = async (req, res) => {
  // Use req.userId from requireAuth middleware
  const objectIdUserId = new mongoose.Types.ObjectId(req.userId);

  try {
    const result = await Rayon.deleteMany({ user: objectIdUserId });
    res.send({
      message: `${result.deletedCount} Rayon(s) were deleted successfully!`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Some error occurred while removing all rayons.",
    });
  }
};
