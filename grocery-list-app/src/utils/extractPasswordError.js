// Le backend renvoie les erreurs de validation sous deux formats différents :
// - le middleware Joi (validate.middleware.js) renvoie errors: [{ field, message }]
// - les contrôleurs (user.controller.js) renvoient errors: { password: "...", ... }
export default function extractPasswordError(errors) {
  if (!errors) return null;

  if (Array.isArray(errors)) {
    const passwordError = errors.find((e) => e.field === "body.password");
    return passwordError?.message || null;
  }

  return errors.password || null;
}
