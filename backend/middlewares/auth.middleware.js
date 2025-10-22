const User = require("../models/user.model");

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
        res.clearCookie("jwt");
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        if (user) res.json({ status: true, user: user.username });
        else res.json({ status: false });
        next();
      }
    });
  } else {
    res.json({ status: false });
    next();
  }
};
