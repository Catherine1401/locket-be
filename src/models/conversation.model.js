import { pool } from "../config/db.js";
import { getUser } from "./user.model.js";

// Tạo hoặc lấy conversation đã tồn tại giữa 2 user
export const getOrCreateConversation = async (userId1, userId2) => {
    const query = {
        text: `
      INSERT INTO conversations (user_id1, user_id2)
      VALUES (LEAST($1, $2), GREATEST($1, $2))
      ON CONFLICT (LEAST(user_id1, user_id2), GREATEST(user_id1, user_id2))
      DO UPDATE SET id = conversations.id
      RETURNING *
    `,
        values: [userId1, userId2],
    };
    const response = await pool.query(query);
    return response.rows[0];
};

// Lấy tất cả conversations của một user, kèm tin nhắn cuối và thông tin partner
export const getConversationsByUserId = async (userId) => {
    const query = {
        text: `
      SELECT
        c.id,
        c.user_id1,
        c.user_id2,
        c.created_at,
        m.content      AS last_message,
        m.sender_id    AS last_sender_id,
        m.created_at   AS last_message_at
      FROM conversations c
      LEFT JOIN LATERAL (
        SELECT content, sender_id, created_at
        FROM messages
        WHERE conversation_id = c.id
          AND deleted_at IS NULL
        ORDER BY id DESC
        LIMIT 1
      ) m ON true
      WHERE c.user_id1 = $1 OR c.user_id2 = $1
      ORDER BY COALESCE(m.created_at, c.created_at) DESC
    `,
        values: [userId],
    };
    const response = await pool.query(query);

    // Enrich với thông tin partner
    const conversations = await Promise.all(
        response.rows.map(async (row) => {
            const partnerId = row.user_id1 === userId ? row.user_id2 : row.user_id1;
            const partner = await getUser({ id: partnerId });
            return {
                id: row.id,
                partnerId: partner.id,
                partnerName: partner.display_name,
                partnerAvatar: partner.avatar_url,
                lastMessage: row.last_message ?? null,
                lastMessageAt: row.last_message_at ?? row.created_at,
            };
        })
    );

    return conversations;
};

// Lấy conversation theo id (kiểm tra user có thuộc conversation không)
export const getConversationById = async (conversationId) => {
    const query = {
        text: `SELECT * FROM conversations WHERE id = $1`,
        values: [conversationId],
    };
    const response = await pool.query(query);
    return response.rows[0];
};
