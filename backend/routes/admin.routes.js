const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware.js");

module.exports = (app) => {
  const admin = require("../controllers/admin.controller.js");
  var router = require("express").Router();

  // Liste tous les comptes utilisateurs avec le nombre de listes/magasins/produits/rayons associés
  router.get("/users", requireAuth, requireAdmin, admin.listUsers);

  // Suppression complète d'un compte (user + listes + magasins + produits + rayons)
  router.delete("/users/:id", requireAuth, requireAdmin, admin.deleteUser);

  app.use("/api/admin", router);
};
