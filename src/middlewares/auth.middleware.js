import { jwtVerifyAccessToken } from "../utils/jwt.util.js";

const isAuth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token from isAuth", token);
  if (!token) return res.sendStatus(401);

  const payload = jwtVerifyAccessToken(token);
  console.log("payload from isAuth", payload);
  req.userId = payload.userId;

  next();
};

export { isAuth };
