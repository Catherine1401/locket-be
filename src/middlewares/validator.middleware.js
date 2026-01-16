import { isDate, isEmail } from "../utils/validator.js";

export const validateUserInfo = (req, res, next) => {
  const { email, avatarUrl, birthday } = req.body;

  if (!email || !isEmail(email)) {
    return res.status(400).json({ message: "email is invalid" });
  }
  if (!avatarUrl) {
    return res.status(400).json({ message: "avatarUrl is invalid" });
  }
  if (!birthday || !isDate(birthday)) {
    return res.status(400).json({ message: "birthday is invalid" });
  }
  next();
};
