import { getUser, updateUser } from "../models/user.model.js";
import {
  deleteImage,
  extractPublicId,
  uploadAvatarBuffer,
  uploadImage,
} from "../utils/cloudinary.util.js";

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

export const updateAvatar = async (req, res) => {
  const { userId } = req;
  try {
    if (!req.file) return res.status(400).json({ message: "no image provided" });

    // Xoá avatar cũ trên Cloudinary (nếu có)
    const currentUser = await getUser({ id: userId });
    if (currentUser?.avatar_url) {
      const oldPublicId = extractPublicId(currentUser.avatar_url);
      if (oldPublicId) await deleteImage(oldPublicId);
    }

    // Upload ảnh mới từ buffer với transformations
    const { secure_url } = await uploadAvatarBuffer(req.file.buffer);

    const user = await updateUser(userId, { avatar_url: secure_url });
    if (!user) return res.status(404).json({ message: "user not found" });

    res.json({ avatarUrl: user.avatar_url });
  } catch (error) {
    console.error("error from updateAvatar", error);
    res.status(500).json({ message: "internal server error" });
  }
};
