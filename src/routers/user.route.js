import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  getMe,
  getUserByShareCodeController,
  updateMe,
} from "../controllers/user.controller.js";
import { validateUserInfo } from "../middlewares/validator.middleware.js";
import { getUserByShareCodeMiddleware } from "../middlewares/user.middleware.js";

const userRouter = express.Router();

userRouter.get("/users/me", isAuth, getMe);
userRouter.put("/users/me", isAuth, validateUserInfo, updateMe);
userRouter.get(
  "/users/:shareCode",
  isAuth,
  getUserByShareCodeMiddleware,
  getUserByShareCodeController,
);

export { userRouter };
