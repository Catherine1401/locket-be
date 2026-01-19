import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  getMe,
  getUserByShareCode,
  updateMe,
} from "../controllers/user.controller.js";
import { validateUserInfo } from "../middlewares/validator.middleware.js";

const userRouter = express.Router();

userRouter.get("/users/me", isAuth, getMe);
userRouter.put("/users/me", isAuth, validateUserInfo, updateMe);
userRouter.get("/users/:shareCode", isAuth, getUserByShareCode);

export { userRouter };
