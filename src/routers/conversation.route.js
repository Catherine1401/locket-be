import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
    getConversationsController,
    getMessagesController,
    sendMessageController,
    markReadController,
} from "../controllers/conversation.controller.js";

const conversationRouter = express.Router();

// Lấy danh sách conversations của user hiện tại
conversationRouter.get("/conversations/me", isAuth, getConversationsController);

// Lấy messages trong một conversation
conversationRouter.get(
    "/conversations/:id/messages",
    isAuth,
    getMessagesController
);

// Gửi tin nhắn
conversationRouter.post("/messages", isAuth, sendMessageController);

// Đánh dấu conversation đã đọc
conversationRouter.put("/conversations/:id/read", isAuth, markReadController);

export { conversationRouter };
