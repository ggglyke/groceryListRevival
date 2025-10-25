const Joi = require("joi");

// Schéma pour l'enregistrement d'un utilisateur
const registerSchema = Joi.object({
  body: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_-]+$/)
      .required()
      .messages({
        "string.min": "Le nom d'utilisateur doit contenir au moins 3 caractères",
        "string.max": "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
        "string.pattern.base": "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores",
        "any.required": "Le nom d'utilisateur est requis",
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "L'email doit être valide",
        "any.required": "L'email est requis",
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.min": "Le mot de passe doit contenir au moins 8 caractères",
        "any.required": "Le mot de passe est requis",
      }),
  }).required(),
  params: Joi.object({}),
  query: Joi.object({}),
});

// Schéma pour la connexion
const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "L'email doit être valide",
        "any.required": "L'email est requis",
      }),
    password: Joi.string()
      .required()
      .messages({
        "any.required": "Le mot de passe est requis",
      }),
  }).required(),
  params: Joi.object({}),
  query: Joi.object({}),
});

module.exports = {
  registerSchema,
  loginSchema,
};
