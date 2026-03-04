import { Server } from "socket.io";
import { jwtVerifyAccessToken } from "../utils/jwt.util.js";

let io;

/**
 * Khởi tạo Socket.IO server
 * @param {import('http').Server} httpServer
 */
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // ── JWT Auth Middleware ────────────────────────────────────────────────────
    io.use((socket, next) => {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) {
            return next(new Error("unauthorized: no token"));
        }

        const payload = jwtVerifyAccessToken(token);
        if (!payload) {
            return next(new Error("unauthorized: invalid token"));
        }

        socket.userId = payload.userId;
        next();
    });

    // ── Connection ─────────────────────────────────────────────────────────────
    io.on("connection", (socket) => {
        console.log(`[Socket] User connected: ${socket.userId} (${socket.id})`);

        // Client gọi để join vào room của một conversation
        socket.on("join_conversation", (conversationId) => {
            const roomId = `conversation:${conversationId}`;
            socket.join(roomId);
            console.log(`[Socket] User ${socket.userId} joined room ${roomId}`);
        });

        socket.on("leave_conversation", (conversationId) => {
            const roomId = `conversation:${conversationId}`;
            socket.leave(roomId);
        });

        socket.on("disconnect", () => {
            console.log(`[Socket] User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

/**
 * Lấy instance Socket.IO đã khởi tạo
 */
export const getIO = () => {
    if (!io) throw new Error("Socket.IO not initialized");
    return io;
};
