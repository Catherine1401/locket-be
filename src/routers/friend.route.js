import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  createFriendRequestController,
  getFriendRequestsController,
  responseFriendRequestController,
} from "../controllers/friend.controller.js";
import { checkUserExistsById } from "../middlewares/user.middleware.js";
import {
  checkRequestFriendExits,
  checkRequestFriendResponse,
} from "../middlewares/friend.middleware.js";

const friendRouter = express.Router();

friendRouter.post(
  "/friend-request",
  isAuth,
  checkUserExistsById,
  createFriendRequestController,
);
friendRouter.get(
  "/friend-request/incoming",
  isAuth,
  getFriendRequestsController,
);
friendRouter.put(
  "/friend-request/:id",
  isAuth,
  checkRequestFriendExits,
  checkRequestFriendResponse,
  responseFriendRequestController,
);

export { friendRouter };
