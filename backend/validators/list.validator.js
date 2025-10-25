const Joi = require("joi");

// Schéma pour MongoDB ObjectId
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

// Schéma pour créer une liste
const createListSchema = Joi.object({
  body: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.min": "Le titre ne peut pas être vide",
        "string.max": "Le titre ne peut pas dépasser 100 caractères",
        "any.required": "Le titre est requis",
      }),
    magasin: objectIdSchema.allow("", null).messages({
      "string.pattern.base": "L'ID du magasin est invalide",
    }),
  }).unknown(true).required(),
  params: Joi.object({}),
  query: Joi.object({}),
});

// Schéma pour mettre à jour une liste - TRÈS PERMISSIF pour compatibilité frontend
const updateListSchema = Joi.object({
  body: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .messages({
        "string.min": "Le titre ne peut pas être vide",
        "string.max": "Le titre ne peut pas dépasser 100 caractères",
      }),
    magasin: objectIdSchema.allow("", null).messages({
      "string.pattern.base": "L'ID du magasin est invalide",
    }),
    products: Joi.array().items(objectIdSchema),
    customProducts: Joi.array(),
    checkedProducts: Joi.array(),
    productCustomNames: Joi.object(),
    hasAisles: Joi.boolean(),
    user: objectIdSchema,
    _id: objectIdSchema,
  })
    .unknown(true) // Accepter tous les autres champs
    .required(),
  params: Joi.object({
    id: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID de la liste est invalide",
      "any.required": "L'ID de la liste est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour récupérer une liste par ID
const getListByIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID de la liste est invalide",
      "any.required": "L'ID de la liste est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour supprimer une liste
const deleteListSchema = getListByIdSchema;

module.exports = {
  createListSchema,
  updateListSchema,
  getListByIdSchema,
  deleteListSchema,
};
