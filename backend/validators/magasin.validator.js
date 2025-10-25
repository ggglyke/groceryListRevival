const Joi = require("joi");

// Schéma pour MongoDB ObjectId
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

// Schéma pour créer un magasin
const createMagasinSchema = Joi.object({
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
    isDefault: Joi.boolean()
      .default(false)
      .messages({
        "boolean.base": "isDefault doit être un booléen",
      }),
  }).required(),
  params: Joi.object({}),
  query: Joi.object({}),
});

// Schéma pour mettre à jour un magasin
const updateMagasinSchema = Joi.object({
  body: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .messages({
        "string.min": "Le titre ne peut pas être vide",
        "string.max": "Le titre ne peut pas dépasser 100 caractères",
      }),
    isDefault: Joi.boolean()
      .messages({
        "boolean.base": "isDefault doit être un booléen",
      }),
  })
    .min(1)
    .required()
    .messages({
      "object.min": "Au moins un champ doit être fourni pour la mise à jour",
    }),
  params: Joi.object({
    id: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID du magasin est invalide",
      "any.required": "L'ID du magasin est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour récupérer un magasin par ID
const getMagasinByIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID du magasin est invalide",
      "any.required": "L'ID du magasin est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour supprimer un magasin
const deleteMagasinSchema = getMagasinByIdSchema;

module.exports = {
  createMagasinSchema,
  updateMagasinSchema,
  getMagasinByIdSchema,
  deleteMagasinSchema,
};
