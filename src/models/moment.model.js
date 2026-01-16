import { pool } from "../config/db.js";
import { uploadImage } from "../utils/cloudinary.util.js";

export const createMoment = async (userId, image, caption = "") => {
  const { public_id, url } = await uploadImage(image); 

  const query = {
    text: "INSERT INTO moments (user_id, image_url, image_public_id, caption) VALUES ($1, $2, $3, $4) RETURNING *",
    values: [userId, url, public_id, caption],
  };
  const response = await pool.query(query);
  return response.rows[0];
}

export const deleteMoment = async (momentId) => {
  const query = {
    text: "DELETE FROM moments WHERE id = $1 RETURNING *",
    values: [momentId],
  };
  const response = await pool.query(query);
  return response.rows[0];
}
