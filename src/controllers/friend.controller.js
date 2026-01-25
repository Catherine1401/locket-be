import {
  createFriend,
  createFriendRequest,
  deleteFriendRequestById,
  deleteFriendRequestByUserId,
  getFriendRequestsByFromUserId,
  getFriendRequestsByToUserId,
  getFriendShipsByUserId,
  responseFriendRequestById,
  unfriendById,
} from "../models/friend.model.js";
import { getUser } from "../models/user.model.js";

export const createFriendRequestController = async (req, res) => {
  const { userId: myId } = req;
  const { toUserId } = req.body;

  try {
    const friendRequest = await createFriendRequest(myId, toUserId);

    if (!friendRequest)
      return res.status(409).json({ message: "friend request already sended" });

    res.status(201).json({ message: "friend request created" });
  } catch (e) {
    console.error("error from create friend request", e);
    res.status(500).json({ message: "error from create friend request" });
  }
};

export const getFriendRequestsIncomingController = async (req, res) => {
  const { userId } = req;

  try {
    const friendRequests = await getFriendRequestsByToUserId(userId);
    if (friendRequests.length === 0)
      return res.status(404).json({ message: "no friend request found" });

    const senders = await Promise.all(
      friendRequests.map(async (request) => {
        const user = await getUser({ id: request.from_user_id });

        return {
          id: request.id,
          userId: user.id,
          name: user.display_name,
          avatar: user.avatar_url,
        };
      }),
    );

    console.log("senders from getFriendRequestsByToUserId", senders);
    if (senders.length === 0)
      return res.status(404).json({ message: "no friend request" });

    res.json(senders);
  } catch (e) {
    console.error("error from get friend requests", e);
    res.status(500).json({ message: "error from get friend requests" });
  }
};

// get friend request outgoing
export const getFriendRequestsOutgoingController = async (req, res) => {
  const { userId } = req;

  try {
    const friendRequests = await getFriendRequestsByFromUserId(userId);
    if (friendRequests.length === 0)
      return res.status(404).json({ message: "no friend request found" });

    const receivers = await Promise.all(
      friendRequests.map(async (request) => {
        const user = await getUser({ id: request.to_user_id });

        return {
          id: request.id,
          userId: user.id,
          name: user.display_name,
          avatar: user.avatar_url,
        };
      }),
    );

    console.log("receivers from getFriendRequestsByToUserId", receivers);
    if (receivers.length === 0)
      return res.status(404).json({ message: "no friend request" });

    res.json(receivers);
  } catch (e) {
    console.error("error from get friend requests", e);
    res.status(500).json({ message: "error from get friend requests" });
  }
};

// response friend request
export const responseFriendRequestController = async (req, res) => {
  const { id: requestId } = req.params;
  const { message } = req.body;
  const { userId: myId } = req;

  try {
    const request = await responseFriendRequestById(requestId, message);
    if (!request) return res.status(404).json({ message: "request not found" });

    if (message === "accept") {
      await createFriend(myId, request.from_user_id);
      res.json({ message: "friendship created" });
    } else if (message === "reject") {
      res.json({ message: "friend request rejected" });
    }
  } catch (e) {
    console.error("error from response friend request", e);
    res.status(500).json({ message: "error from response friend request" });
  }
};

// delete friend request
export const deleteFriendRequestController = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await deleteFriendRequestById(id);
    if (!request) return res.status(404).json({ message: "request not found" });

    res.json({ message: "friend request deleted" });
  } catch (e) {
    console.error("error from delete friend request", e);
    res.status(500).json({ message: "error from delete friend request" });
  }
};

export const getFriendsController = async (req, res) => {
  const { userId } = req;
  try {
    const friendships = await getFriendShipsByUserId(userId);
    if (friendships.length === 0)
      return res.status(404).json({ message: "no friendship found" });

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const partnerId =
          friendship.user_id1 === userId
            ? friendship.user_id2
            : friendship.user_id1;
        const partner = await getUser({ id: partnerId });
        return {
          id: friendship.id,
          userId: partner.id,
          name: partner.display_name,
          avatar: partner.avatar_url,
        };
      }),
    );

    res.json(friends);
  } catch (e) {
    console.error("error from get friends", e);
    res.status(500).json({ message: "error from get friends" });
  }
};

// delete friendship
export const deleteFriendsController = async (req, res) => {
  const { id } = req.params;
  try {
    const friendship = await unfriendById(id);
    if (!friendship) return res.status(404).json({ message: "friendship not found" });

    await deleteFriendRequestByUserId(friendship.user_id1, friendship.user_id2);

    res.json({ message: "friendship deleted" });
  } catch (e) {
    console.error("error from delete friendship", e);
    res.status(500).json({ message: "error from delete friendship" });
  }
};
