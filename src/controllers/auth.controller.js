import User from "../models/user.model";
import JwtUtil from "../utils/jwt.util";
import AuthUtil from "../utils/auth.util";

const googleLogin = async (req, res) => {
  try {
    // get toekn
    const { idToken } = req.body;
    // console.log("idToken", idToken);

    // get info from google
    const { sub, email, picture } = await AuthUtil.veryfy(idToken);

    console.log("sub", sub);
    console.log("email", email);
    console.log("picture", picture);

    let user = await User.getUserByGoogleId(sub);

    if (!user) {
      user = await User.createUser(sub, email, picture);
    }

    // sign jwt
    const accessToken = JwtUtil.createAccessToken(user.id);
    const refreshToken = JwtUtil.createRefreshToken(user.id);

    await User.updateRefreshToken(user.id, refreshToken);
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

    const payload = JwtUtil.verifyToken(refreshToken);
    console.log("payload: ", payload);

    const user = await User.getUserById(payload.userId);
    console.log("user: ", user);
    if (!user || user.refresh_token !== refreshToken) return res.sendStatus(403);

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
    const user = await User.getUserByRefreshToken(refreshToken);
    if (!user) return res.sendStatus(403);
    await User.updateRefreshToken(user.id, null);
    res.sendStatus(204);
  } catch (e) {
    console.error("error from logout", e);
    res.status(500).json({ message: "error from logout" });
  }
};

module.exports = { googleLogin, refreshToken, logout };
