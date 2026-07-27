const db = require("../models");
const { users: User, magasins: Magasin, rayons: Rayon, products: Product, lists: List } = db;

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { password: 0, resetPasswordToken: 0, emailVerificationToken: 0 }
    ).lean();

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const [listsCount, magasinsCount, productsCount, rayonsCount] =
          await Promise.all([
            List.countDocuments({ user: user._id }),
            Magasin.countDocuments({ user: user._id }),
            Product.countDocuments({ user: user._id }),
            Rayon.countDocuments({ user: user._id }),
          ]);
        return {
          ...user,
          counts: {
            lists: listsCount,
            magasins: magasinsCount,
            products: productsCount,
            rayons: rayonsCount,
          },
        };
      })
    );

    return res.status(200).json(enrichedUsers);
  } catch (err) {
    console.error("Erreur listUsers:", err);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(403).json({
        message: "Impossible de supprimer son propre compte depuis cette page",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    await Promise.all([
      List.deleteMany({ user: id }),
      Magasin.deleteMany({ user: id }),
      Product.deleteMany({ user: id }),
      Rayon.deleteMany({ user: id }),
    ]);
    await User.deleteOne({ _id: id });

    return res.status(200).json({ deleted: true });
  } catch (err) {
    console.error("Erreur deleteUser:", err);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
