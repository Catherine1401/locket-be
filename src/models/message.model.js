import { pool } from "../config/db.js";

// Tạo tin nhắn mới
export const createMessage = async (conversationId, senderId, content, replyToMomentId = null) => {
    const query = {
        text: `
      INSERT INTO messages (conversation_id, sender_id, content, reply_to_moment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
        values: [conversationId, senderId, content, replyToMomentId],
    };
    const response = await pool.query(query);
    return response.rows[0];
};

// Lấy tin nhắn theo conversationId, cursor-based (nextCursor = created_at của tin nhắn cũ nhất trong batch hiện tại)
// → page sau sẽ lấy những tin nhắn cũ hơn (created_at < cursor)
export const getMessagesByConversationId = async (
    conversationId,
    limit = 30,
    nextCursor = null
) => {
    let query;
    const baseSelect = `
        SELECT m.*, 
               mo.image_url as moment_image_url, 
               mo.created_at as moment_created_at,
               u.display_name as moment_author_name,
               u.avatar_url as moment_author_avatar
        FROM messages m
        LEFT JOIN moments mo ON m.reply_to_moment_id = mo.id
        LEFT JOIN users u ON mo.user_id = u.id
    `;

    if (nextCursor) {
        query = {
            text: `
        ${baseSelect}
        WHERE m.conversation_id = $1
          AND m.deleted_at IS NULL
          AND m.created_at < $3
        ORDER BY m.created_at DESC, m.id DESC
        LIMIT $2
      `,
            values: [conversationId, limit, nextCursor],
        };
    } else {
        query = {
            text: `
        ${baseSelect}
        WHERE m.conversation_id = $1
          AND m.deleted_at IS NULL
        ORDER BY m.created_at DESC, m.id DESC
        LIMIT $2
      `,
            values: [conversationId, limit],
        };
    }

    const response = await pool.query(query);
    // Trả về ASC để client hiển thị từ cũ → mới
    return response.rows.reverse();
};
