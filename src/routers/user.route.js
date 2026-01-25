import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  getMe,
  getUserByShareCodeController,
  updateMe,
} from "../controllers/user.controller.js";
import { validateUserInfo } from "../middlewares/validator.middleware.js";
import { checkFriendShip } from "../middlewares/friend.middleware.js";

const userRouter = express.Router();

userRouter.get("/users/me", isAuth, getMe);
userRouter.put("/users/me", isAuth, validateUserInfo, updateMe);
userRouter.get(
  "/users/:sharecode",
  isAuth,
  checkFriendShip,
  getUserByShareCodeController,
);

export { userRouter };
