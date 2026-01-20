import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  createFriendRequestController,
  getFriendRequestsController,
} from "../controllers/friend.controller.js";

const friendRouter = express.Router();

friendRouter.post("/friend-request", isAuth, createFriendRequestController);
friendRouter.get("/friend-request", isAuth, getFriendRequestsController);

export { friendRouter };
