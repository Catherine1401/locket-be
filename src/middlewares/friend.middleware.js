import {
  getFriendRequestsBoth,
  getFriendShip,
} from "../models/friend.model.js";
import { getUser } from "../models/user.model.js";

export const checkFriendShip = async (req, res, next) => {
  const { userId } = req;
  const { sharecode } = req.params;
  const targetUser = await getUser({ share_code: sharecode });

  if (!targetUser) return res.status(404).json({ message: "user not found" });
  if (targetUser.id === userId)
    return res
      .status(409)
      .json({ message: "you can not be friend with yourself" });
  req.user = targetUser;
  const targetUserId = targetUser.id;

  // check friend
  const friendShip = await getFriendShip(userId, targetUserId);
  if (friendShip && friendShip.status === "friend") {
    req.friendShip = "friend";
    next();
  }

  // check friend request
  const friendRequest = await getFriendRequestsBoth(userId, targetUserId);
  if (friendRequest) {
    if (friendRequest.from_user_id === userId) {
      req.friendShip = "incoming";
      next();
    } else if (friendRequest.to_user_id === userId) {
      req.friendShip = "outgoing";
      next();
    }
  }

  req.friendShip = "stranger";
  next();
};
