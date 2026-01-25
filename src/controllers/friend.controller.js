import {
  createFriend,
  createFriendRequest,
  getFriendRequests,
  responseFriendRequest,
} from "../models/friend.model.js";

export const createFriendRequestController = async (req, res) => {
  const { userId } = req;
  const { toUserId } = req.body;

  try {
    const friendRequest = await createFriendRequest(userId, toUserId);

    if (!friendRequest)
      return res.status(409).json({ message: "friend request already sended" });

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
      return { id: request.id, senderId: request.from_user_id };
    });

    res.json(senderIds);
  } catch (e) {
    console.error("error from get friend requests", e);
    res.status(500).json({ message: "error from get friend requests" });
  }
};

export const responseFriendRequestController = async (req, res) => {
  const { userId: myId, friendRequest } = req;
  const { status } = req.body;

  try {
    await responseFriendRequest(friendRequest.from_user_id, myId, status);

    if (status === "accepted") {
      const friendship = await createFriend(myId, friendRequest.from_user_id);
      if (!friendship)
        return res.status(409).json({ message: "friendship already created" });

      res.json({ message: "friendship created" });
    } else {
      res.json({ message: "friend request rejected" });
    }
  } catch (e) {
    console.error("error from response friend request", e);
    res.status(500).json({ message: "error from response friend request" });
  }
};

