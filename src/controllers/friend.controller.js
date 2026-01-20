import { createFriendRequest } from "../models/friend.model.js";

export const createFriendRequestController = async (req, res) => {
  const { userId } = req;
  const { toUserId } = req.body;

  try {
    await createFriendRequest(userId, toUserId);

    res.status(201).json({ message: "friend request created" });
  } catch (e) {
    console.error("error from create friend request", e);
    res.status(500).json({ message: "error from create friend request" });
  }
};
