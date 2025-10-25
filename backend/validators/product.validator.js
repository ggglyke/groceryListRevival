const Joi = require("joi");

// Schéma pour MongoDB ObjectId
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

// Schéma pour créer un produit
const createProductSchema = Joi.object({
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
    rayon: Joi.string()
      .allow("")
      .max(50)
      .messages({
        "string.max": "Le rayon ne peut pas dépasser 50 caractères",
      }),
    magasin: objectIdSchema.allow("").messages({
      "string.pattern.base": "L'ID du magasin est invalide",
    }),
  }).required(),
  params: Joi.object({}),
  query: Joi.object({}),
});

// Schéma pour mettre à jour un produit
const updateProductSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .min(1)
      .max(100)
      .messages({
        "string.min": "Le nom ne peut pas être vide",
        "string.max": "Le nom ne peut pas dépasser 100 caractères",
      }),
    rayon: Joi.string()
      .allow("")
      .max(50)
      .messages({
        "string.max": "Le rayon ne peut pas dépasser 50 caractères",
      }),
    magasin: objectIdSchema.allow("").messages({
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
      "string.pattern.base": "L'ID du produit est invalide",
      "any.required": "L'ID du produit est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour récupérer un produit par ID
const getProductByIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: objectIdSchema.required().messages({
      "string.pattern.base": "L'ID du produit est invalide",
      "any.required": "L'ID du produit est requis",
    }),
  }).required(),
  query: Joi.object({}),
});

// Schéma pour supprimer un produit
const deleteProductSchema = getProductByIdSchema;

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  deleteProductSchema,
};
