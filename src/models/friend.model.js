import { pool } from "../config/db.js";

// get friendships
export const getFriendShips = async (userId) => {
  const query = {
    text: `SELECT * FROM friends WHERE user_id1 = $1 OR user_id2 = $1`,
    values: [userId],
  };

  const response = await pool.query(query);
  return response.rows;
};

// get friendship
export const getFriendShip = async (userId1, userId2) => {
  const query = {
    text: `SELECt * FROM friends
          WHERE (user_id1 = $1 AND user_id2 = $2) 
          OR (user_id1 = $2 AND user_id2 = $1)`,
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
          ON CONFLICT (
            LEAST(from_user_id, to_user_id),
            GREATEST(from_user_id, to_user_id)
          )
          DO UPDATE SET status = 'pending'
          WHERE request_friends.status = 'rejected'
          RETURNING *`,
    values: [fromUserId, toUserId],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// get list friend request by toUserId
export const getFriendRequestsByToUserId = async (userId) => {
  const query = {
    text: `SELECT * FROM request_friends
            WHERE to_user_id = $1 AND status = 'pending'`,
    values: [userId],
  };

  const response = await pool.query(query);
  return response.rows;
};

// get list friend request by fromUserId
export const getFriendRequestsByFromUserId = async (userId) => {
  const query = {
    text: `SELECT * FROM request_friends
            WHERE from_user_id = $1 AND status = 'pending'`,
    values: [userId],
  };

  const response = await pool.query(query);
  return response.rows;
};

// get friend request
export const getFriendRequest = async (fromUserId, toUserId) => {
  const query = {
    text: `SELECT * FROM request_friends
            WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'pending'`,
    values: [fromUserId, toUserId],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// get friend request both
export const getFriendRequestsBoth = async (userId1, userId2) => {
  const query = {
    text: `SELECT * FROM request_friends
            WHERE (from_user_id = $1 AND to_user_id = $2) 
            OR (from_user_id = $2 AND to_user_id = $1)`,
    values: [userId1, userId2],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// get friend request by id
export const getFriendRequestById = async (id) => {
  const query = {
    text: `SELECT * FROM request_friends
            WHERE id = $1`,
    values: [id],
  };

  const response = await pool.query(query);
  return response.rows[0];
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

// response request friend by id
export const responseFriendRequestById = async (id, message) => {
  if (message !== "accept" && message !== "reject") return null;
  const realMessage = message === "accept" ? "accepted" : "rejected";

  const query = {
    text: `UPDATE request_friends
            SET status = $2
            WHERE id = $1  AND status = 'pending'
            RETURNING *`,
    values: [id, realMessage],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// delete friend request
export const deleteFriendRequest = async (id) => {
  const query = {
    text: `DELETE FROM request_friends
            WHERE id = $1`,
    values: [id],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// create friend
export const createFriend = async (userId1, userId2) => {
  const query = {
    text: `INSERT INTO friends (user_id1, user_id2)
            VALUES ($1, $2)
            ON CONFLICT (
              LEAST(user_id1, user_id2),
              GREATEST(user_id1, user_id2)
            )
            DO UPDATE SET status = 'friend', updated_at = now()
            WHERE friends.status = 'unfriend'
            RETURNING *`,
    values: [userId1, userId2],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// get friendships by userId
export const getFriendShipsByUserId = async (userId) => {
  const query = {
    text: `SELECT * FROM friends
            WHERE user_id1 = $1 OR user_id2 = $1`,
    values: [userId],
  };

  const response = await pool.query(query);
  return response.rows;
};

// unfriend
export const unfriend = async (userId1, userId2) => {
  const query = {
    text: `UPDATE friends
          SET status = 'unfriend', updated_at = now()
          WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1)
          RETURNING *`,
    values: [userId1, userId2],
  };

  const response = await pool.query(query);
  return response.rows[0];
};
