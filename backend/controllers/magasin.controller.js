const db = require("../models");
const mongoose = require("mongoose");
const Magasin = db.magasins;

exports.create = async (req, res) => {
  // Create new magasin
  try {
    const { title, isDefault } = req.body;
    // Use req.userId from requireAuth middleware
    const objectIdUserId = new mongoose.Types.ObjectId(req.userId);
    const magasin = await Magasin.create({
      user: objectIdUserId,
      title,
      default: isDefault,
    });
    return res.status(200).json({ magasin: magasin._id, created: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while creating the Magasin.",
    });
  }
};

exports.findOneByCondition = async (req, res, next) => {
  try {
    const bodyCondition = req.body;
    // Use req.userId from requireAuth middleware
    const condition = {
      ...bodyCondition,
      user: new mongoose.Types.ObjectId(req.userId),
    };
    const magasin = await Magasin.findOne(condition);
    if (!magasin) {
      return res.status(404).send({ message: "Magasin not found" });
    }
    return res.send(magasin);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while retrieving magasin.",
    });
  }
};

exports.findManyByCondition = async (req, res, next) => {
  try {
    const bodyCondition = req.body;
    // Use req.userId from requireAuth middleware
    const condition = {
      ...bodyCondition,
      user: new mongoose.Types.ObjectId(req.userId),
    };
    const magasins = await Magasin.find(condition);
    return res.send(magasins);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while retrieving magasins.",
    });
  }
};

// Find a single Magasin with an id
exports.findOneById = async (req, res) => {
  const id = req.params.id;

  try {
    const magasin = await Magasin.findById(id);
    if (!magasin) {
      return res.status(404).send({ message: "Magasin not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (magasin.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this magasin" });
    }

    return res.send(magasin);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error retrieving Magasin with id=" + id,
    });
  }
};

// Update a Magasin by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  try {
    const magasin = await Magasin.findById(id);

    if (!magasin) {
      return res.status(404).send({ message: "Magasin not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (magasin.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this magasin" });
    }

    const updatedMagasin = await Magasin.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });

    return res.send(updatedMagasin);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error updating Magasin with id=" + id,
    });
  }
};

// Delete a Magasin with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const magasin = await Magasin.findById(id);

    if (!magasin) {
      return res.status(404).send({ message: "Magasin not found with id: " + id });
    }

    // Verify ownership using req.userId from requireAuth middleware
    if (magasin.user.toString() !== req.userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this magasin" });
    }

    await Magasin.findByIdAndDelete(id);
    return res.send({ message: "Magasin was deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Could not delete Magasin with id=" + id,
    });
  }
};
