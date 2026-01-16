import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { getMe, updateMe } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/users/me", isAuth, getMe);
userRouter.put("/users/me", isAuth, updateMe);

export { userRouter };
