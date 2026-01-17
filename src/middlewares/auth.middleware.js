import { jwtVerifyAccessToken } from "../utils/jwt.util.js";

export const isAuth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token from isAuth", token);
  if (!token) return res.status(401).json({ message: "unauthorized" });

  const payload = jwtVerifyAccessToken(token);
  if (!payload) return res.status(401).json({ message: "unauthorized" });

  console.log("payload from isAuth", payload);
  req.userId = payload.userId;

  next();
};
