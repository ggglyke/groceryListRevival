const db = require("../models");
const mongoose = require("mongoose");
const Rayon = db.rayons;

// Create and Save a new Rayon
/*exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty" });
    return;
  }

  // Create new rayon
  const rayon = new Rayon({
    title: req.body.title,
    user: req.body.user,
    published: req.body.published ? req.body.published : false,
  });

  // Save rayon in database
  rayon
    .save(rayon)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating the rayon",
      });
    });
};*/

exports.create = async (req, res) => {
  // Create new rayon
  try {
    const { userId, title, isDefault } = req.body;
    const objectIdUserId = mongoose.Types.ObjectId(userId);
    console.log("about to create :", {
      user: objectIdUserId,
      title,
      isDefault,
    });
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
    const rayons = await Rayon.insertMany(rayonsData);
    res.status(201).json({ rayons, rayonsCreated: true });
  } catch (err) {
    console.error(err);
    const errors = handleErrors(err);
    res.json({ errors, rayonsCreated: false });
  }
};

// Retrieve all Rayons from the database.
exports.findAll = (req, res) => {
  title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  Rayon.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving rayons",
      });
    });
};

exports.getAllUserAisles = (req, res) => {
  const userId = req.params.id;
  const objectIdUserId = mongoose.Types.ObjectId(userId);
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
exports.findOne = (req, res) => {
  const id = req.params.id;

  Rayon.findById(id)
    .populate("rayon")
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Rayon with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Rayon with id=" + id });
    });
};

// Update a Rayon by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Rayon.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Rayon with id=${id}. Maybe Rayon was not found!`,
        });
      } else res.send({ message: "Rayon was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Rayon with id=" + id,
      });
    });
};

// Delete a Rayon with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Rayon.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Rayon with id=${id}. Maybe Rayon was not found!`,
        });
      } else {
        res.send({
          message: "Rayon was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Rayon with id=" + id,
      });
    });
};

// Delete all Rayons from the database.
exports.deleteAll = (req, res) => {
  Rayon.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Rayons were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all rayons.",
      });
    });
};
/*
// Find all published Rayons
exports.findAllPublished = (req, res) => {};

db.lists.updateMany(
  { _id: ObjectId("64cce1fbde2b400041b554e4") },
  {
    $set: {
      customProducts: [{ rayon: "ObjectId('656df56fc9e6fb41ec6cca8b')" }],
    },
  }
);

*/
