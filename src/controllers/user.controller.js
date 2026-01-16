import { getUser, updateUser } from "../models/user.model.js";
import { isDate, isEmail } from "../utils/validator.js";

const getMe = async (req, res) => {
  const user = await getUser({ id: req.userId });

  if (!user) return res.sendStatus(404);

  res.json(user);
};

const updateMe = async (req, res) => {
  const { email, avatarUrl, birthday } = req.body;
  const fields = {};
  
  // validate 
  if (!email || !isEmail(email))
    return res.status(400).json({ message: "email is invalid" });
  fields.email = email;

  if (!avatarUrl)
    return res.status(400).json({ message: "avatarUrl is invalid" });
  fields.avatar_url = avatarUrl;

  if (!birthday || !isDate(birthday))
    return res.status(400).json({ message: "birthday is invalid" });
  fields.birthday = birthday;

  const user = await updateUser(req.userId, fields);

  if (!user) return res.sendStatus(404);

  res.json(user);
};

export { getMe, updateMe };
