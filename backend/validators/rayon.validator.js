const Joi = require("joi");

// Schéma pour MongoDB ObjectId
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

// Schéma pour créer un rayon
const createRayonSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.min": "Le nom ne peut pas être vide",
        "string.max": "Le nom ne peut pas dépasser 100 caractères",
        "any.required": "Le nom est requis",
      }),
    order: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        "number.base": "L'ordre doit être un nombre",
        "number.integer": "L'ordre doit être un entier",
        "number.min": "L'ordre doit être au moins 0",
      }),
    magasinId: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID du magasin est invalide",
      "any.required": "L'ID du magasin est requis",
    }),
  }).required(),
  params: Joi.object({}),
  query: Joi.object({}),
});

// Schéma pour mettre à jour un rayon
const updateRayonSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .messages({
        "string.min": "Le nom ne peut pas être vide",
        "string.max": "Le nom ne peut pas dépasser 100 caractères",
      }),
    order: Joi.number()
      .integer()
      .min(0)
      .messages({
        "number.base": "L'ordre doit être un nombre",
        "number.integer": "L'ordre doit être un entier",
        "number.min": "L'ordre doit être au moins 0",
      }),
    magasinId: objectIdSchema.messages({
      "string.pattern.base": "L'ID du magasin est invalide",
    }),
  })
    .min(1)
    .required()
    .messages({
      "object.min": "Au moins un champ doit être fourni pour la mise à jour",
    }),
  params: Joi.object({
    id: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID du rayon est invalide",
      "any.required": "L'ID du rayon est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour récupérer un rayon par ID
const getRayonByIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID du rayon est invalide",
      "any.required": "L'ID du rayon est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour récupérer les rayons par magasin ID
const getRayonsByMagasinSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    magasinId: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID du magasin est invalide",
      "any.required": "L'ID du magasin est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour supprimer un rayon
const deleteRayonSchema = getRayonByIdSchema;

module.exports = {
  createRayonSchema,
  updateRayonSchema,
  getRayonByIdSchema,
  getRayonsByMagasinSchema,
  deleteRayonSchema,
};
