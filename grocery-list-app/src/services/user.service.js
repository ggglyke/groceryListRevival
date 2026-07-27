import http from "../http-common";

const login = (payload) => http.post("/users/login", payload);
const logout = () => http.post("/users/logout");
const register = (payload) => http.post("users/register", payload);
const verify = () => http.get("/users/verify");
const forgotPassword = (payload) => http.post("/users/forgot-password", payload);
const resetPassword = (payload) => http.post("/users/reset-password", payload);
const verifyEmail = (token) => http.get(`/users/verify-email?token=${token}`);
const resendVerification = (payload) => http.post("/users/resend-verification", payload);

export default {
  login,
  logout,
  register,
  verify,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
};
