// Mêmes origines que la allowlist CORS de server.js, mappées vers l'URL
// frontend complète (avec sous-chemin en prod, cf. FRONTEND_URL/.env.example).
const ORIGIN_TO_FRONTEND_URL = {
  "http://localhost:3000": "http://localhost:3000/groceryListRevival",
  "https://www.guillaumejarry.com": "https://www.guillaumejarry.com/groceryListRevival",
  "https://guillaumejarry.com": "https://guillaumejarry.com/groceryListRevival",
};

// Déduit l'URL du frontend à partir de l'origine de la requête (localhost en dev,
// domaine de prod sinon), pour que les liens envoyés par email pointent vers
// l'environnement d'où la demande est partie. Fallback sur FRONTEND_URL si
// l'origine est absente ou non reconnue (ex. appel serveur-à-serveur).
const getFrontendUrl = (req) => {
  const origin = req.headers.origin;
  if (origin && ORIGIN_TO_FRONTEND_URL[origin]) {
    return ORIGIN_TO_FRONTEND_URL[origin];
  }
  return process.env.FRONTEND_URL;
};

module.exports = { getFrontendUrl };
