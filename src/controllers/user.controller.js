import { getUser, updateUser } from "../models/user.model.js";

const getMe = async (req, res) => {
  const user = await getUser({ id: req.userId });

  if (!user) return res.sendStatus(404);
  console.log("user from get me", user);

  const userResponse = {
    id: user.id,
    email: user.email,
    avatarUrl: user.avatar_url,
    birthday: user.birthday,
    displayName: user.display_name,
  };

  res.json(userResponse);
};

const updateMe = async (req, res) => {
  const { email, avatarUrl, birthday } = req.body;

  const user = await updateUser(req.userId, {
    email: email,
    avatar_url: avatarUrl,
    birthday: birthday,
  });

  if (!user) return res.sendStatus(404);
  console.log("user from update me", user);

  const userResponse = {
    id: user.id,
    email: user.email,
    avatarUrl: user.avatar_url,
    birthday: user.birthday,
    displayName: user.display_name,
  };

  res.json(userResponse);
};

export { getMe, updateMe };
