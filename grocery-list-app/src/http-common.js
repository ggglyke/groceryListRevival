import axios from "axios";
import API_BASE_URL from "./config/api.config";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

// CSRF Protection désactivée en développement
// En production, vous devrez activer la gestion des tokens CSRF

export default http;
