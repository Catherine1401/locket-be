const { pool } = require("../config/db");

// getuser
const getUserById = async (id) => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };
  const response = await pool.query(query);
  return response.rows[0];
};

// get user by email
const getUserByEmail = async (email) => {
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };
  const response = await pool.query(query);
  return response.rows[0];
};

const getUserByGoogleId = async (googleId) => {
  const query = {
    text: "SELECT * FROM users WHERE google_id = $1",
    values: [googleId],
  };
  const response = await pool.query(query);
  return response.rows[0];
};

// update refresh token
const updateRefreshToken = async (id, refreshToken) => {
  const query = {
    text: "UPDATE users SET refresh_token = $1, updated_at = now() WHERE id = $2",
    values: [refreshToken, id],
  };
  await pool.query(query);
};

// create user
const createUser = async (googleId, email, avatarUrl) => {
  const query = {
    text: "INSERT INTO users (email, avatar_url, google_id) VALUES ($1, $2, $3) RETURNING *",
    values: [email, avatarUrl, googleId],
  };
  const response = await pool.query(query);
  return response.rows[0];
};

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByGoogleId,
  createUser,
  updateRefreshToken,
};

// test
// async function test() {
//   // const user = await createUser("huyv@gmail.com", "", "2000-01-01");
//   // console.log(await getUser("036a7d5b-8be4-4b51-8569-11fd52c15204"));
//   // console.log(typeof (await getUser("036a7d5b-8be4-4b51-8569-11fd52c15204")));
//   // console.log(Boolean(await getUser("036a7d5b-8be4-4b51-8569-11fd52c15201")));
//   const user = await getUser("036a7d5b-8be4-4b51-8569-11fd52c15209");
//   if (user) {
//     console.log(user);
//   } else {
//     console.log("not found");
//   }
// }

// test();
