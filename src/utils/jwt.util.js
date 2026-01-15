const jwt = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = { createAccessToken, createRefreshToken, verifyToken };

