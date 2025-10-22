const db = require("../models");
const mongoose = require("mongoose");
const Magasin = db.magasins;

exports.create = async (req, res) => {
  // Create new magasin
  try {
    const { user, title, isDefault } = req.body;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const magasin = await Magasin.create({
      user: objectIdUserId,
      title,
      default: isDefault,
    });
    res.status(200).json({ magasin: magasin._id, created: true });
  } catch (err) {
    console.error(err);
    res.json({
      message: "Erreur lors de la création du magasin",
      created: false,
    });
  }
};

exports.findOneByCondition = async (req, res, next) => {
  try {
    const bodyCondition = req.body;
    const condition = {
      ...bodyCondition,
      user: new mongoose.Types.ObjectId(bodyCondition.user),
    };
    await Magasin.findOne(condition).then((data) => {
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    res.json({ err, magasinFound: false });
  }
};

exports.findManyByCondition = async (req, res, next) => {
  try {
    const bodyCondition = req.body;
    const condition = {
      ...bodyCondition,
      user: new mongoose.Types.ObjectId(bodyCondition.user),
    };
    await Magasin.find(condition).then((data) => {
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    res.json({ err, found: false });
  }
};

// Find a single Magasin with an id
exports.findOneById = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const magasin = await Magasin.findById(id);
    if (!magasin) {
      return res
        .status(404)
        .send({ message: "Magasin not found with id: " + id });
    }

    if (magasin.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized access to this magasin" });
    }

    res.send(magasin);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Magasin with id=" + id });
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
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).send({ message: "User ID required" });
  }

  try {
    const magasin = await Magasin.findById(id);

    if (!magasin) {
      return res.status(404).send({
        message: `Cannot update Magasin with id=${id}. Magasin not found!`,
      });
    }

    if (magasin.user.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this magasin" });
    }

    const updatedMagasin = await Magasin.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    });

    res.send({
      message: "Magasin was updated successfully.",
      magasin: updatedMagasin,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating Magasin with id=" + id,
    });
  }
};
