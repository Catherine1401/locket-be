import { getUser } from "../models/user.model.js";

export const getUserByShareCodeMiddleware = async (req, res, next) => {
  const { sharecode } = req.params;
  const user = await getUser({ share_code: sharecode });
  if (!user) return res.status(404).json({ message: "user not found" });
  if (user.id === req.userId)
    return res.status(403).json({ message: "you can't invite yourself" });
  req.user = user;
  next();
};

export const checkUserExistsById = async (req, res, next) => {
  const { toUserId } = req.body;
  const user = await getUser({ id: toUserId });
  if (!user) return res.status(404).json({ message: "user not found" });
  if (user.id === req.userId)
    return res.status(409).json({ message: "you can't invite yourself" });
  next();
};
