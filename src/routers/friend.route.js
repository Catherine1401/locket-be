import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { createFriendRequestController } from "../controllers/friend.controller.js";

const friendRouter = express.Router();

friendRouter.post("/friend-request", isAuth, createFriendRequestController);

export { friendRouter };
