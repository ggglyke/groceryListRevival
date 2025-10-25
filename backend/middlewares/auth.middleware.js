const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware pour vérifier l'authentification (ancienne version)
 * @deprecated Utiliser requireAuth à la place
 */
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
        res.clearCookie("jwt");
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        if (user) res.json({ status: true, user: user.username });
        else res.json({ status: false });
        next();
      }
    });
  } else {
    res.json({ status: false });
    next();
  }
};

/**
 * Middleware pour protéger les routes nécessitant une authentification
 * Vérifie le JWT dans le cookie et attache req.userId
 */
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({
      message: "Non authentifié - Token manquant",
      authenticated: false,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // Attache l'ID utilisateur à la requête
    next();
  } catch (err) {
    res.clearCookie("jwt");
    return res.status(401).json({
      message: "Non authentifié - Token invalide ou expiré",
      authenticated: false,
    });
  }
};

/**
 * Middleware pour vérifier que l'utilisateur a le droit d'accéder à une ressource
 * Vérifie que req.userId correspond au userId dans le body/query
 */
module.exports.checkResourceOwnership = (req, res, next) => {
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(400).json({
      message: "userId requis",
    });
  }

  if (req.userId !== userId) {
    return res.status(403).json({
      message: "Accès interdit - Vous n'êtes pas autorisé à accéder à cette ressource",
    });
  }

  next();
};
