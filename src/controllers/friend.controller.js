import {
  createFriend,
  createFriendRequest,
  getFriendRequestsByToUserId,
  responseFriendRequest,
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

export const getFriendRequestsController = async (req, res) => {
  const { userId } = req;

  try {
    const friendRequests = await getFriendRequestsByToUserId(userId);
    if (friendRequests.length === 0)
      return res.status(404).json({ message: "no friend request found" });

    const senders = await Promise.all(
      friendRequests.map(async (request) => {
        const user = await getUser({ id: request.from_user_id });

        return {
          id: user.id,
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
