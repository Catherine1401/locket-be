import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  createFriendRequestController,
  getFriendRequestsController,
  responseFriendRequestController,
} from "../controllers/friend.controller.js";
import { checkUserExistsById } from "../middlewares/user.middleware.js";

const friendRouter = express.Router();

friendRouter.post(
  "/friend-request",
  isAuth,
  checkUserExistsById,
  createFriendRequestController,
);
friendRouter.get("/friend-request", isAuth, getFriendRequestsController);
friendRouter.put(
  "/friend-request/:id",
  isAuth,
  responseFriendRequestController,
);

export { friendRouter };
