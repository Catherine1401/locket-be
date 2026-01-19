import {
  getFriendShip,
  getFriendShips,
  getUser,
} from "../models/user.model.js";

export const getFriends = async (userId) => {
  const friendShips = await getFriendShips(userId);

  if (!friendShips) return [];

  return friendShips.map(async (record) => {
    const friendId =
      record.user_id1 === userId ? record.user_id2 : record.user_id1;
    return await getUser({ id: friendId });
  });
};

export const isFriend = async (userId1, userId2) => {
  const friendShip = await getFriendShip(userId1, userId2);
  return !!friendShip;
};

