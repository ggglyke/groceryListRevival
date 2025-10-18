import http from "../http-common";

const login = (payload) => http.post("/users/login", payload);
const logout = () => http.post("/users/logout");
const register = (payload) => http.post("users/register", payload);
const verify = () => http.get("/users/verify");

export default { login, logout, register, verify };
