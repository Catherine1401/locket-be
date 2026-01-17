import { pool } from "../config/db.js";

// getuser
const getUser = async (field) => {
  const filters = [
    "id",
    "google_id",
    "refresh_token",
    "share_code",
    "email",
    "avatar_url",
    "birthday",
    "display_name",
    "created_at",
    "updated_at",
  ];

  const key = Object.keys(field)[0];
  if (filters.includes(key)) {
    const query = {
      text: `SELECT * FROM users WHERE ${key} = $1`,
      values: [field[key]],
    };
    const response = await pool.query(query);
    return response.rows[0];
  }
};

// update user
const updateUser = async (id, fields) => {
  const filters = [
    "display_name",
    "email",
    "avatar_url",
    "google_id",
    "refresh_token",
    "birthday",
  ];

  // build update clause
  let counter = 0;
  let claude = "";
  let values = [];
  for (const field in fields) {
    if (filters.includes(field)) {
      claude += `${field} = $${++counter},`;
      values.push(fields[field]);
    }
  }

  if (claude === "") {
    return null;
  }

  // build query
  const query = {
    text: `UPDATE users SET ${claude} updated_at = now() WHERE id = $${counter + 1} RETURNING *`,
    values: [...values, id],
  };

  const response = await pool.query(query);
  return response.rows[0];
};

// create user
const createUser = async (fields) => {
  const filters = [
    "google_id",
    "refresh_token",
    "email",
    "avatar_url",
    "birthday",
    "display_name",
  ];

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return null;
  }

  const keysMatch = keys.filter((key) => filters.includes(key));
  if (keysMatch.length === 0) {
    return null;
  }

  const valuesMatch = keysMatch.map((key) => fields[key]);
  const placeholders = keysMatch.map((_, index) => `$${index + 1}`);

  const query = {
    text: `INSERT INTO users (${keysMatch.join(", ")})
           VALUES (${placeholders.join(", ")})
            RETURNING *`,
    values: valuesMatch,
  };
  const response = await pool.query(query);
  return response.rows[0];
};

export { getUser, createUser, updateUser };

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
