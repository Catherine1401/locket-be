import { getUser } from "../models/user.model.js";

export const getUserByShareCodeMiddleware = async (req, res, next) => {
  const { shareCode } = req.params;
  const user = await getUser({ share_code: shareCode });
  if (!user) return res.status(404).json({ message: "user not found" });
  req.user = user;
  next();
};
