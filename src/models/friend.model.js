import { pool } from "../config/db.js";

// ger friendships
export const getFriendShips = async (userId) => {
  const query = {
    text: `SELECT * FROM friends WHERE user_id1 = $1 OR user_id2 = $1`,
    values: [userId],
  };

  const response = await pool.query(query);
  return response.rows;
};

// get freindship
export const getFriendShip = async (userId1, userId2) => {
  const query = {
    text: `SELECT * FROM friends WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1)`,
    values: [userId1, userId2],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// create request friend
export const createFriendRequest = async (fromUserId, toUserId) => {
  const query = {
    text: `INSERT INTO request_friends (from_user_id, to_user_id, status)
          VALUES ($1, $2, 'pending')
          ON CONFLICT (from_user_id, to_user_id)
          DO UPDATE SET status = 'pending'
          WHERE request_friends.status = 'rejected'
          RETURNING *`,
    values: [fromUserId, toUserId],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// get list friend request
export const getFriendRequests = async (userId) => {
  const query = {
    text: `SELECT * FROM request_friends
            WHERE to_user_id = $1 AND status = 'pending'`,
    values: [userId],
  };

  const response = await pool.query(query);
  return response.rows;
};

// response request friend
export const responseFriendRequest = async (fromUserId, toUserId, status) => {
  if (status !== "accept" && status !== "reject") return null;

  const query = {
    text: `UPDATE request_friends
            SET status = $3
            WHERE from_user_id = $1 AND to_user_id = $2
            RETURNING *`,
    values: [fromUserId, toUserId, status],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// create friend
export const createFriend = async (userId1, userId2) => {
  const query = {
    text: `INSERT INTO friends (user_id1, user_id2)
            VALUES ($1, $2)
            ON CONFLICT (user_id1, user_id2)
            DO NOTHING
            RETURNING *`,
    values: [userId1, userId2],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// unfriend
export const unfriend = async (userId1, userId2) => {
  const query = {
    text: `UPDATE friends
          SET status = 'unfriend', last_updated_at = now()
          WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1)
          RETURNING *`,
    values: [userId1, userId2],
  };

  const response = await pool.query(query);
  return response.rows[0];
};
