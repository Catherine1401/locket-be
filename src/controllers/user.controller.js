import { getUser, updateUser } from "../models/user.model.js";

export const getMe = async (req, res) => {
  const user = await getUser({ id: req.userId });

  if (!user) return res.sendStatus(404);

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
    status: req.friendShip,
  };

  res.json(response);
};

// update name
export const updateName = async (req, res) => {
  const { displayName } = req.body;
  const { userId } = req;

  try {
    const user = await updateUser(userId, {
      display_name: displayName,
    });

    if (!user) return res.status(409).json({ message: "some error" });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateBirthday = async (req, res) => {
  const { birthday } = req.body;
  const { userId } = req;

  try {
    const user = await updateUser(userId, {
      birthday: birthday,
    });

    if (!user) return res.status(409).json({ message: "some error" });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
