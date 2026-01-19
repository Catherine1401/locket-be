import { getUser, updateUser } from "../models/user.model.js";
import { isFriend } from "../utils/user.util.js";

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

export const getUserByShareCodeController = async (req, res) => {
  const { user } = req;

  let response = {
    user: {
      id: user.id,
      avatarUrl: user.avatar_url,
      displayName: user.display_name,
    },
  };
  const status = await isFriend(user.id, req.userId);

  if (status) {
    response.isFriend = true;
  } else {
    response.isFriend = false;
  }

  res.json(response);
};
