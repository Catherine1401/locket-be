import jwt from "jsonwebtoken";

export const createAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_SECRET,
  });
};

export const createRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.EXPIRE_REFRESH_SECRET,
  });
};

export const jwtVerifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const jwtVerifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
