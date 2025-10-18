const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.products = require("./product.model")(mongoose);
db.rayons = require("./rayon.model")(mongoose);
db.lists = require("./list.model")(mongoose);
db.magasins = require("./magasin.model")(mongoose);
db.users = require("./user.model")(mongoose);

module.exports = db;
