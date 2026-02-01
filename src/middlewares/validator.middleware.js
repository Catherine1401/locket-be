import { isDate, isEmail, isUrl } from "../utils/validator.js";

export const validateUserInfo = (req, res, next) => {
  const { email, avatarUrl, birthday } = req.body;

  if (!email || !isEmail(email)) {
    return res.status(400).json({ message: "email is invalid" });
  }
  if (!avatarUrl || !isUrl(avatarUrl)) {
    return res.status(400).json({ message: "avatarUrl is invalid" });
  }
  if (!birthday || !isDate(birthday)) {
    return res.status(400).json({ message: "birthday is invalid" });
  }

  next();
};

export const validateName = (req, res, next) => {
  const { displayName: name } = req.body;

  if (!name && name.trim().length > 0) {
    return res.status(400).json({ message: "name is required" });
  }

  next();
};

export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email || !isEmail(email)) {
    return res.status(400).json({ message: "email is invalid" });
  }

  next();
};

export const validateBirthday = (req, res, next) => {
  const { birthday } = req.body;

  if (!birthday || !isDate(birthday)) {
    return res.status(400).json({ message: "birthday is invalid" });
  }

  next();
};
