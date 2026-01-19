import { getUser, updateUser } from "../models/user.model.js";

export const getMe = async (req, res) => {
  const user = await getUser({ id: req.userId });

  if (!user) return res.sendStatus(404);
  console.log("user from get me", user);

  const userResponse = {
    id: user.id,
    email: user.email,
    avatarUrl: user.avatar_url,
    birthday: user.birthday,
    displayName: user.display_name,
    shareCode: user.share_code,
  };

  res.json(userResponse);
};

export const updateMe = async (req, res) => {
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

export const getUserByShareCode = async (req, res) => {
  const { shareCode } = req.params;
  const user = await getUser({ share_code: shareCode });
  if (!user) return res.status(404).json({ message: "user not found" });
  const userResponse = {
    id: user.id,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
  }
  res.json(userResponse);
};
