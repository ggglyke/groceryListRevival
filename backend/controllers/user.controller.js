require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("[AUTH] JWT_SECRET is missing");
}

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { validatePassword } = require("../utils/passwordValidator");

const maxAge = 3 * 24 * 60 * 60;

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });

const handleErrors = (err) => {
  let errors = { username: "", email: "", password: "" };
  if (err.message === "incorrect email") {
    errors.email = "On ne connait pas cet email";
  }

  if (err.message === "Incorrect password") {
    errors.password = "Mot de passe incorrect";
  }
  if (err.message === "Password is required") {
    errors.password = "Mot de passe vide, veuillez entrer un mot de passe";
  }
  if (err.message === "Email is required") {
    errors.password = "Email non renseigné, veuillez entrer une adresse email";
  }
  if (err.code === 11000) {
    errors.email = "Cet email existe déjà";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// Create and Save a new User
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        errors: { password: passwordValidation.errors.join(", ") },
        created: false,
      });
    }

    const user = await User.create({ username, email, password });
    // Return format expected by frontend
    return res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    // Use handleErrors for specific auth errors
    const errors = handleErrors(err);
    return res.status(400).json({ errors, created: false });
  }
};

exports.logout = (req, res) => {
  // Supprimer le cookie côté client
  res.clearCookie("jwt");
  res.send("Logged out successfully");
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" pour cross-domain en prod
      secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true", // OBLIGATOIRE avec sameSite=none
      path: "/",
      maxAge: maxAge * 1000,
    });
    // Return format expected by frontend
    return res.status(200).json({
      user: { _id: user._id, username: user.username },
      logged: true,
    });
  } catch (err) {
    // Use handleErrors for specific auth errors
    const errors = handleErrors(err);
    return res.status(401).json({
      errors,
      logged: false,
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.status(200).json({ authenticated: false });

    const data = jwt.verify(token, JWT_SECRET);

    // Récupère le username depuis la base de données
    const user = await User.findById(data.id);
    if (!user) return res.status(200).json({ authenticated: false });

    return res.status(200).json({
      authenticated: true,
      userId: data.id,
      username: user.username
    });
  } catch {
    return res.status(200).json({ authenticated: false });
  }
};
