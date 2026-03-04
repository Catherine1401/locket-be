import {
    getConversationsByUserId,
    getConversationById,
    getOrCreateConversation,
} from "../models/conversation.model.js";
import {
    createMessage,
    getMessagesByConversationId,
} from "../models/message.model.js";

// GET /conversations/me — Lấy danh sách conversations của user hiện tại
export const getConversationsController = async (req, res) => {
    const { userId } = req;
    try {
        const conversations = await getConversationsByUserId(userId);
        res.json(conversations);
    } catch (e) {
        console.error("error from getConversationsController", e);
        res.status(500).json({ message: "error from get conversations" });
    }
};

// GET /conversations/:id/messages — Lấy messages trong conversation
export const getMessagesController = async (req, res) => {
    const { userId } = req;
    const { id: conversationId } = req.params;
    const { limit = 30, nextcursor } = req.query;

    try {
        // Kiểm tra user có thuộc conversation không
        const conversation = await getConversationById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "conversation not found" });
        }

        const isParticipant =
            conversation.user_id1 === userId || conversation.user_id2 === userId;
        if (!isParticipant) {
            return res.status(403).json({ message: "forbidden" });
        }

        const messages = await getMessagesByConversationId(
            conversationId,
            parseInt(limit),
            nextcursor ?? null
        );

        const nextCursor =
            messages.length > 0 ? messages[0].id.toString() : null;
        const hasMore = messages.length === parseInt(limit);

        res.json({
            messages: messages.map((m) => ({
                id: m.id.toString(),
                conversationId: m.conversation_id.toString(),
                senderId: m.sender_id.toString(),
                content: m.content,
                createdAt: m.created_at,
                isDeleted: m.deleted_at !== null,
            })),
            nextCursor: hasMore ? nextCursor : null,
        });
    } catch (e) {
        console.error("error from getMessagesController", e);
        res.status(500).json({ message: "error from get messages" });
    }
};

// POST /messages — Gửi tin nhắn
export const sendMessageController = async (req, res) => {
    const { userId: senderId } = req;
    const { conversationId, content } = req.body;

    if (!conversationId || !content || content.trim() === "") {
        return res
            .status(400)
            .json({ message: "conversationId and content are required" });
    }

    try {
        // Kiểm tra quyền truy cập
        const conversation = await getConversationById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "conversation not found" });
        }

        const isParticipant =
            conversation.user_id1 === senderId ||
            conversation.user_id2 === senderId;
        if (!isParticipant) {
            return res.status(403).json({ message: "forbidden" });
        }

        const message = await createMessage(
            conversationId,
            senderId,
            content.trim()
        );

        res.status(201).json({
            id: message.id.toString(),
            conversationId: message.conversation_id.toString(),
            senderId: message.sender_id.toString(),
            content: message.content,
            createdAt: message.created_at,
            isDeleted: false,
        });
    } catch (e) {
        console.error("error from sendMessageController", e);
        res.status(500).json({ message: "error from send message" });
    }
};
