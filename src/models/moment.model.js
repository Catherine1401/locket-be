import { pool } from "../config/db.js";
import { getThumbnail, uploadImage } from "../utils/cloudinary.util.js";

// create moment
export const createMoment = async (userId, image, caption = "") => {
  const { public_id, url } = await uploadImage(image);
  const thumbnail = getThumbnail(public_id);

  console.log("thumbnail from create moment", thumbnail);
  console.log("url from create moment", url);

  const query = {
    text: `INSERT INTO moments (user_id, image_url, thumbnail, image_public_id, caption) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
    values: [userId, url, thumbnail, public_id, caption],
  };
  const response = await pool.query(query);
  return response.rows[0];
};

// get moment
export const getMoment = async (field) => {
  const filters = [
    "id",
    "user_id",
    "image_url",
    "image_public_id",
    "caption",
    "created_at",
    "updated_at",
  ];

  const key = Object.keys(field)[0];
  if (filters.includes(key)) {
    const query = {
      text: `SELECT * FROM moments WHERE ${key} = $1 AND deleted_at IS NULL`,
      values: [field[key]],
    };
    const response = await pool.query(query);
    return response.rows[0];
  }
};

// delete moment
export const deleteMomentByIdAndUserId = async (momentId, userId) => {
  const query = {
    text: `UPDATE moments SET deleted_at = now()
          WHERE id = $1 AND user_id = $2
          RETURNING *`,
    values: [momentId, userId],
  };
  const response = await pool.query(query);
  return response.rows[0];
};

// get moments by friendId and myId
export const getMomentsByFriendIdAndMyId = async (friendIds, myId, limit) => {
  const query = {
    text: `SELECT * FROM moments
            WHERE (user_id = ANY($1) OR user_id = $2)
            AND deleted_at IS NULL
            ORDER BY id DESC
            LIMIT $3`,

    values: [friendIds, myId, limit],
  };
  const response = await pool.query(query);
  return response.rows;
};

export const getMomentsByUserId = async (userId, limit) => {
  const query = {
    text: `SELECT * FROM moments
            WHERE user_id = $1
            AND deleted_at IS NULL
            ORDER BY id DESC
            LIMIT $2`,
    values: [userId, limit],
  };
  const response = await pool.query(query);
  return response.rows;
};

// get moments by next cursor
export const getMomentsByNextCursor = async (
  nextCursor,
  myId,
  friendIds,
  limit,
) => {
  const query = {
    text: `SELECT * FROM moments
            WHERE  id < $3
            AND (user_id = ANY($1) OR user_id = $2)
            AND deleted_at IS NULL
            ORDER BY id DESC 
            LIMIT $4`,
    values: [friendIds, myId, nextCursor, limit],
  };
  const response = await pool.query(query);
  return response.rows;
};

export const getMomentsByPrevCursor = async (
  prevCursor,
  myId,
  friendIds,
  limit,
) => {
  const query = {
    text: `
      SELECT *
      FROM moments
      WHERE id > $3
        AND (user_id = ANY($1) OR user_id = $2)
        AND deleted_at IS NULL
      ORDER BY id ASC
      LIMIT $4
    `,
    values: [friendIds, myId, prevCursor, limit],
  };

  const response = await pool.query(query);

  // đảo lại để client luôn nhận DESC (mới → cũ)
  return response.rows.reverse();
};

export const getMomentById = async (id) => {
  const query = {
    text: `SELECT * FROM moments
            WHERE id = $1`,
    values: [id],
  };
  const response = await pool.query(query);
  return response.rows[0];
};
