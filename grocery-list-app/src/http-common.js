import axios from "axios";

export default axios.create({
  //baseURL: "https://grocery-list-app-backend.onrender.com/api",
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});
