const db = require("../models");
const mongoose = require("mongoose");
const Magasin = db.magasins;

exports.create = async (req, res) => {
  // Create new magasin
  try {
    const { user, title, isDefault } = req.body;
    const objectIdUserId = mongoose.Types.ObjectId(user);
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

// Retrieve all Magasins from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  Magasin.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving magasins",
      });
    });
};

exports.findOneByCondition = async (req, res, next) => {
  try {
    const bodyCondition = req.body;
    const condition = {
      ...bodyCondition,
      user: mongoose.Types.ObjectId(bodyCondition.user),
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
    const condition = req.body;
    await Magasin.find(condition).then((data) => {
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    /*const errors = handleErrors(err);
    res.json({ errors, found: false });*/
    res.json({ err, found: false });
  }
};

// Find a single Magasin
/*exports.findOne = (req, res) => {
  const id = req.params.id;

  Magasin.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Magasin with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Magasin with id=" + id });
    });
};*/

// Find a single Magasin with an id
exports.findOneById = (req, res) => {
  const id = req.params.id;

  Magasin.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Magasin with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Magasin with id=" + id });
    });
};

// Update a Magasin by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  Magasin.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Magasin with id=${id}. Maybe Magasin was not found!`,
        });
      } else res.send({ message: "Magasin was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Magasin with id=" + id,
      });
    });
};
