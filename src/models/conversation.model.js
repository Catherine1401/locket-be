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
// Tự động tạo conversation cho các bạn bè chưa có conversation
export const getConversationsByUserId = async (userId) => {
  // Bước 1: Đảm bảo tất cả bạn bè đều có conversation (getOrCreate)
  const friendsQuery = {
    text: `
      SELECT
        CASE WHEN user_id1 = $1 THEN user_id2 ELSE user_id1 END AS friend_id
      FROM friends
      WHERE (user_id1 = $1 OR user_id2 = $1)
        AND status = 'friend'
    `,
    values: [userId],
  };
  const friendsResult = await pool.query(friendsQuery);
  await Promise.all(
    friendsResult.rows.map((row) =>
      getOrCreateConversation(userId, row.friend_id)
    )
  );

  // Bước 2: Lấy tất cả conversations với tin nhắn cuối
  const query = {
    text: `
      SELECT
        c.id,
        c.user_id1,
        c.user_id2,
        c.created_at,
        c.last_read_user1,
        c.last_read_user2,
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

      // Xác định last_read_at của user hiện tại
      const lastReadAt = row.user_id1 === userId
        ? row.last_read_user1
        : row.last_read_user2;

      // Conversation chưa đọc nếu:
      // 1. Có tin nhắn mới (last_message_at)
      // 2. Người gửi tin cuối KHÔNG phải user hiện tại
      // 3. last_message_at > last_read_at (hoặc chưa đọc lần nào)
      const lastMsgAt = row.last_message_at;
      const isUnread = !!(
        lastMsgAt &&
        row.last_sender_id !== userId &&
        (!lastReadAt || new Date(lastMsgAt) > new Date(lastReadAt))
      );

      return {
        id: row.id,
        partnerId: partner.id,
        partnerName: partner.display_name,
        partnerAvatar: partner.avatar_url,
        lastMessage: row.last_message ?? null,
        lastMessageAt: row.last_message_at ?? row.created_at,
        isUnread,
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

// Đánh dấu conversation đã đọc cho một user
export const markConversationRead = async (conversationId, userId) => {
  // Xác định user là user1 hay user2 để update đúng cột
  const conv = await getConversationById(conversationId);
  if (!conv) return;

  const column = conv.user_id1 === userId ? "last_read_user1" : "last_read_user2";

  const query = {
    text: `UPDATE conversations SET ${column} = NOW() WHERE id = $1`,
    values: [conversationId],
  };
  await pool.query(query);
};
