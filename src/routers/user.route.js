import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  getMe,
  getUserByShareCodeController,
  updateBirthday,
  updateMe,
  updateName,
} from "../controllers/user.controller.js";
import {
  validateBirthday,
  validateName,
  validateUserInfo,
} from "../middlewares/validator.middleware.js";
import { checkFriendShip } from "../middlewares/friend.middleware.js";
import { imageMiddleware } from "../middlewares/image.middleware.js";

const userRouter = express.Router();

userRouter.get("/users/me", isAuth, getMe);
userRouter.put("/users/me", isAuth, validateUserInfo, updateMe);
// update name
userRouter.put("/users/me/name", isAuth, validateName, updateName);

// update birthday
userRouter.put("/users/me/birthday", isAuth, validateBirthday, updateBirthday);

// update avatar
userRouter.put("/users/me/avatar", isAuth, imageMiddleware);

userRouter.get(
  "/users/:sharecode",
  isAuth,
  checkFriendShip,
  getUserByShareCodeController,
);

export { userRouter };
