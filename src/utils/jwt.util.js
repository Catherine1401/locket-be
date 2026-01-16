import jwt from "jsonwebtoken";

const createAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_SECRET,
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.EXPIRE_REFRESH_SECRET,
  });
};

const jwtVerifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export { createAccessToken, createRefreshToken, jwtVerifyToken };
