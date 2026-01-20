import { createUser, getUser, updateUser } from "../models/user.model.js";
import { verifyToken } from "../utils/auth.util.js";
import {
  createAccessToken,
  createRefreshToken,
  jwtVerifyRefreshToken,
} from "../utils/jwt.util.js";

const googleLogin = async (req, res) => {
  try {
    // get toekn
    const { idToken } = req.body;
    console.log("idToken from google", idToken);

    // get info from google
    const { sub, email, picture, name } = await verifyToken(idToken);

    console.log("sub", sub);
    console.log("email", email);
    console.log("picture", picture);

    // đoạn này có thể thay thế sang logic upsert
    let user = await getUser({ google_id: sub });

    if (!user) {
      user = await createUser({
        google_id: sub,
        email,
        avatar_url: picture,
        display_name: name,
      });
    }

    // sign jwt
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    await updateUser(user.id, {
      refresh_token: refreshToken,
    });
    res.json({ accessToken, refreshToken });
  } catch (e) {
    console.error("error from google login", e);
    res.status(500).json({ message: "error from google login" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log("refreshToken: ", refreshToken);
    if (!refreshToken) return res.sendStatus(401);

    const payload = jwtVerifyRefreshToken(refreshToken);
    console.log("payload: ", payload);

    const user = await getUser({ id: payload.userId });
    console.log("user: ", user);
    if (!user || user.refresh_token !== refreshToken)
      return res.sendStatus(403);

    const newAccessToken = createAccessToken(user.id);
    console.log("newAccessToken: ", newAccessToken);

    res.json({ accessToken: newAccessToken });
  } catch (e) {
    console.error("error from refresh token", e);
    res.status(500).json({ message: "error from refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(400);
    const user = await getUser({ refresh_token: refreshToken });
    if (!user) return res.sendStatus(403);
    await updateUser(user.id, { refresh_token: null });
    res.sendStatus(204);
  } catch (e) {
    console.error("error from logout", e);
    res.status(500).json({ message: "error from logout" });
  }
};

export { googleLogin, refreshToken, logout };
