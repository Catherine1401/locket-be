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
export const deleteMoment = async (momentId) => {
  const query = {
    text: "UPDATE moments SET deleted_at = now() WHERE id = $1 RETURNING *",
    values: [momentId],
  };
  const response = await pool.query(query);
  return response.rows[0];
};
