import {
    getConversationsByUserId,
    getConversationById,
    getOrCreateConversation,
    markConversationRead,
} from "../models/conversation.model.js";
import {
    createMessage,
    getMessagesByConversationId,
} from "../models/message.model.js";
import { getIO } from "../socket/socket.js";

// GET /conversations/me — Lấy danh sách conversations của user hiện tại
export const getConversationsController = async (req, res) => {
    const { userId } = req;
    try {
        const conversations = await getConversationsByUserId(userId);
        // isUnread đã được tính toán trong model
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
            messages: messages.map((m) => {
                const isReply = m.reply_to_moment_id !== null;
                return {
                    id: m.id.toString(),
                    conversationId: m.conversation_id.toString(),
                    senderId: m.sender_id.toString(),
                    content: m.content,
                    createdAt: m.created_at,
                    isDeleted: m.deleted_at !== null,
                    replyToMoment: isReply ? {
                        id: m.reply_to_moment_id.toString(),
                        imageUrl: m.moment_image_url,
                        createdAt: m.moment_created_at,
                        authorName: m.moment_author_name,
                        authorAvatar: m.moment_author_avatar
                    } : null
                };
            }),
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
    const { conversationId, content, replyToMomentId } = req.body;

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
            content.trim(),
            replyToMomentId
        );

        const messageData = {
            id: message.id.toString(),
            conversationId: message.conversation_id.toString(),
            senderId: message.sender_id.toString(),
            content: message.content,
            createdAt: message.created_at,
            isDeleted: false,
            replyToMoment: replyToMomentId ? { id: replyToMomentId.toString() } : null
        };

        // Emit realtime tới tất cả clients trong room của conversation
        // VÀ tới personal room của người nhận (để nhận ngay cả khi không ở trong ChatScreen)
        try {
            const io = getIO();
            // Xác định receiverId (người không phải sender)
            const receiverId = conversation.user_id1 === senderId
                ? conversation.user_id2
                : conversation.user_id1;

            // 1. Emit tới conversation room → cho user đang mở ChatScreen
            io.to(`conversation:${conversationId}`).emit("new_message", messageData);

            // 2. Emit tới personal room của receiver → cho ConversationsScreen / bất kỳ màn hình nào
            io.to(`user:${receiverId}`).emit("new_message", messageData);

            // 3. Emit tới personal room của sender → để ConversationsScreen của sender
            //    cũng cập nhật lastMessage ngay lập tức
            io.to(`user:${senderId}`).emit("new_message", messageData);
        } catch (_) {
            // Socket.IO không bắt buộc phải được init (dev mode)
        }

        res.status(201).json(messageData);
    } catch (e) {
        console.error("error from sendMessageController", e);
        res.status(500).json({ message: "error from send message" });
    }
};

// PUT /conversations/:id/read — Đánh dấu đã đọc
export const markReadController = async (req, res) => {
    const { userId } = req;
    const { id: conversationId } = req.params;

    try {
        const conversation = await getConversationById(conversationId);
        if (!conversation) return res.status(404).json({ message: "not found" });

        const isParticipant =
            conversation.user_id1 === userId || conversation.user_id2 === userId;
        if (!isParticipant) return res.status(403).json({ message: "forbidden" });

        await markConversationRead(conversationId, userId);
        res.sendStatus(204);
    } catch (e) {
        console.error("error from markReadController", e);
        res.status(500).json({ message: "internal server error" });
    }
};
