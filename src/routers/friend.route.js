import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  createFriendRequestController,
  deleteFriendRequestController,
  deleteFriendsController,
  getFriendRequestsIncomingController as getFriendRequestsIncomingController,
  getFriendRequestsOutgoingController,
  getFriendsController,
  responseFriendRequestController,
} from "../controllers/friend.controller.js";
import { checkUserExistsById } from "../middlewares/user.middleware.js";
import {
  checkRequestFriendExits,
  checkRequestFriendResponse,
  isSenderRequestMiddleware,
} from "../middlewares/friend.middleware.js";

const friendRouter = express.Router();

// create friend request
friendRouter.post(
  "/friend-request",
  isAuth,
  checkUserExistsById,
  createFriendRequestController,
);

// get friend request
friendRouter.get(
  "/friend-request/incoming",
  isAuth,
  getFriendRequestsIncomingController,
);

// get friend request outgoing
friendRouter.get(
  "/friend-request/outgoing",
  isAuth,
  getFriendRequestsOutgoingController,
);

// response friend request
friendRouter.put(
  "/friend-request/:id",
  isAuth,
  checkRequestFriendExits,
  checkRequestFriendResponse,
  responseFriendRequestController,
);

// delete friend request
friendRouter.delete(
  "/friend-request/:id",
  isAuth,
  isSenderRequestMiddleware,
  deleteFriendRequestController,
);

// get friends
friendRouter.get("/friends", isAuth, getFriendsController);

// delete friend
friendRouter.delete("/friends/:id", isAuth, deleteFriendsController);

export { friendRouter };
