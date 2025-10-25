/**
 * Utilitaire de gestion d'erreurs
 * - Log les erreurs complètes côté serveur
 * - Retourne des messages génériques au client pour éviter les fuites d'information
 */

/**
 * Gère les erreurs et retourne une réponse sécurisée
 * @param {Error} err - L'erreur capturée
 * @param {Object} res - L'objet response Express
 * @param {String} context - Contexte de l'erreur (ex: "Récupération des magasins")
 * @param {Number} statusCode - Code HTTP par défaut (500 si non spécifié)
 */
const handleError = (err, res, context = "Opération", statusCode = 500) => {
  // Log l'erreur complète côté serveur (avec stack trace)
  console.error(`[ERROR] ${context}:`, {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  // Déterminer le message utilisateur selon le type d'erreur
  let userMessage = `Une erreur est survenue lors de ${context.toLowerCase()}`;
  let actualStatusCode = statusCode;

  // Gestion d'erreurs spécifiques MongoDB
  if (err.name === "CastError") {
    userMessage = "L'identifiant fourni est invalide";
    actualStatusCode = 400;
  } else if (err.name === "ValidationError") {
    userMessage = "Les données fournies sont invalides";
    actualStatusCode = 400;
  } else if (err.code === 11000) {
    // Duplicate key error
    userMessage = "Cette ressource existe déjà";
    actualStatusCode = 409;
  }

  // Retourner une réponse sécurisée au client
  return res.status(actualStatusCode).json({
    success: false,
    message: userMessage,
    // En développement uniquement, on peut ajouter plus de détails
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      errorType: err.name,
    }),
  });
};

/**
 * Gère les erreurs de ressource non trouvée
 */
const handleNotFound = (res, resourceName = "Ressource") => {
  return res.status(404).json({
    success: false,
    message: `${resourceName} non trouvée`,
  });
};

/**
 * Réponse de succès standardisée
 */
const handleSuccess = (res, data, message = "Opération réussie", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = {
  handleError,
  handleNotFound,
  handleSuccess,
};
