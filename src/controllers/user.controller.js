import { getUser, updateUser } from "../models/user.model.js";
import { isDate, isEmail } from "../utils/validator.js";

const getMe = async (req, res) => {
  const user = await getUser({ id: req.userId });

  if (!user) return res.sendStatus(404);

  res.json(user);
};

const updateMe = async (req, res) => {
  const { email, avatarUrl, birthday } = req.body;

  const user = await updateUser(req.userId, {
    email: email,
    avatar_url: avatarUrl,
    birthday: birthday,
  });

  if (!user) return res.sendStatus(404);

  res.json(user);
};

export { getMe, updateMe };
