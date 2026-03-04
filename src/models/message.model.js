import { pool } from "../config/db.js";

// Tạo tin nhắn mới
export const createMessage = async (conversationId, senderId, content) => {
    const query = {
        text: `
      INSERT INTO messages (conversation_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
        values: [conversationId, senderId, content],
    };
    const response = await pool.query(query);
    return response.rows[0];
};

// Lấy tin nhắn theo conversationId, cursor-based (nextCursor = id nhỏ hơn → cũ hơn)
export const getMessagesByConversationId = async (
    conversationId,
    limit = 30,
    nextCursor = null
) => {
    let query;
    if (nextCursor) {
        query = {
            text: `
        SELECT * FROM messages
        WHERE conversation_id = $1
          AND deleted_at IS NULL
          AND id < $3
        ORDER BY id DESC
        LIMIT $2
      `,
            values: [conversationId, limit, nextCursor],
        };
    } else {
        query = {
            text: `
        SELECT * FROM messages
        WHERE conversation_id = $1
          AND deleted_at IS NULL
        ORDER BY id DESC
        LIMIT $2
      `,
            values: [conversationId, limit],
        };
    }

    const response = await pool.query(query);
    // Trả về ASC để client hiển thị từ cũ → mới
    return response.rows.reverse();
};
