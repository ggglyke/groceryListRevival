/**
 * Middleware de validation générique avec Joi
 * Valide les données de la requête (body, params, query) selon un schéma Joi
 */

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(
      {
        body: req.body,
        params: req.params,
        query: req.query,
      },
      {
        abortEarly: false, // Retourner toutes les erreurs, pas seulement la première
        stripUnknown: false, // NE PAS supprimer les champs - garder compatibilité avec frontend
      }
    );

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors,
      });
    }

    // Ne pas remplacer req.body pour garder tous les champs
    // req.body = value.body || {};
    // req.params = value.params || {};
    // req.query = value.query || {};

    next();
  };
};

module.exports = validate;
