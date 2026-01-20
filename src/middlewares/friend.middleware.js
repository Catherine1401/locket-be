import { createFriendRequest } from "../models/friend.model.js";

export const sendedRequest = async (req, res, next) => {
  const { userId } = req;
  const { toUserId } = req.body;

  const friendRequest = await createFriendRequest(userId, toUserId);

  if (!friendRequest)
    return res.status(409).json({ message: "friend request already sended" });

  next();
};
