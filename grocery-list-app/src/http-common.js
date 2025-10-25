import axios from "axios";

const http = axios.create({
  //baseURL: "https://grocery-list-app-backend.onrender.com/api",
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

// CSRF Protection désactivée en développement
// En production, vous devrez activer la gestion des tokens CSRF

export default http;
