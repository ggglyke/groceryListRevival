/**
 * Configuration des URLs API selon l'environnement
 *
 * Bascule automatiquement entre dev et prod :
 * - npm start → utilise l'URL de développement (localhost)
 * - npm run build → utilise l'URL de production
 *
 * Pour forcer un environnement spécifique, définir REACT_APP_ENV dans .env :
 * REACT_APP_ENV=production  → force prod même en développement
 * REACT_APP_ENV=development → force dev même pour le build
 */

const API_URLS = {
  development: "http://localhost:8080/api",
  production: "https://grocery-list-app-backend.onrender.com/api",
};

// Déterminer l'environnement
// 1. Utilise REACT_APP_ENV si défini (permet de forcer manuellement)
// 2. Sinon utilise NODE_ENV (automatique : 'development' avec npm start, 'production' avec npm run build)
const ENV = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

// Sélectionner l'URL correspondante
const API_BASE_URL = API_URLS[ENV] || API_URLS.development;

// Log en développement pour vérifier quelle URL est utilisée
if (ENV === 'development') {
  console.log(`[API Config] Environnement: ${ENV}`);
  console.log(`[API Config] URL de l'API: ${API_BASE_URL}`);
}

export default API_BASE_URL;
