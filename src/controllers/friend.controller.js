import {
  createFriendRequest,
  getFriendRequests,
} from "../models/friend.model.js";

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

export const getFriendRequestsController = async (req, res) => {
  const { userId } = req;

  try {
    const friendRequests = await getFriendRequests(userId);
    const senderIds = friendRequests.map((request) => {
      return request.from_user_id;
    });

    res.json(senderIds);
  } catch (e) {
    console.error("error from get friend requests", e);
    res.status(500).json({ message: "error from get friend requests" });
  }
};
