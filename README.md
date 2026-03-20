# Locket Backend 🚀

API cho ứng dụng chia sẻ khoảnh khắc [Locket](https://github.com/Catherine1401/locket), built with Node.js + Express + PostgreSQL.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue?logo=postgresql)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- [x] **Authentication** — Google Sign-In (OAuth 2.0) + JWT (access token + refresh token)
- [x] **Profile** — Xem / cập nhật tên, ngày sinh, avatar
- [x] **Friends** — Gửi / thu hồi / phản hồi yêu cầu kết bạn; xem danh sách bạn bè; hủy kết bạn
- [x] **Moments** — Tạo / xóa moment; xem feed & grid với cursor-based pagination; lọc theo user
- [x] **Conversations** — Lấy danh sách hội thoại, lấy tin nhắn (cursor), gửi tin nhắn, mark-read
- [x] **Realtime** — Socket.IO phát sự kiện tin nhắn mới đến client
- [x] **Image Upload** — Upload ảnh qua Multer → lưu trên Cloudinary
- [x] **Input Validation** — Middleware validate dữ liệu đầu vào (tên, ngày sinh, ảnh...)
- [x] **Auth guard** — Middleware `isAuth` bảo vệ toàn bộ route yêu cầu xác thực

---

## 📦 Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| **Runtime** | Node.js 20+ (ES Modules) |
| **Framework** | Express 5.x |
| **Database** | PostgreSQL 16+ · driver: `pg` (node-postgres) |
| **Auth** | Google OAuth 2.0 (`google-auth-library`) · JWT (`jsonwebtoken`) |
| **Image** | Multer (multipart) · Cloudinary (lưu trữ) |
| **Realtime** | Socket.IO 4.x |
| **Validation** | `validator` |
| **Date** | `dayjs` |
| **Dev** | `nodemon` · `jest` |

---

## 🚀 Getting Started

### Yêu cầu

- Node.js 20+
- PostgreSQL 16+
- Tài khoản Cloudinary
- Google OAuth Client ID

### Clone & cài đặt

```bash
git clone https://github.com/Catherine1401/locket-be.git
cd locket-be
npm install
```

### Cấu hình PostgreSQL

1. Tạo database:

```bash
psql -U postgres -c "CREATE DATABASE locket;"
```

2. Chạy schema để tạo toàn bộ bảng:

```bash
psql -U postgres -d locket -f schema.sql
```

> Schema tạo 6 bảng: `users`, `moments`, `request_friends`, `friends`, `conversations`, `messages`

### Cấu hình `.env`

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Điền các biến sau vào `.env`:

```env
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=locket
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
EXPIRE_SECRET=15m
EXPIRE_REFRESH_SECRET=7d

# Google OAuth (Web Client)
WEB_CLIENT_ID=your_google_web_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Chạy server

```bash
npm run dev          # Development (nodemon, tự load .env)
node --env-file=.env app.js  # Production
```

Server chạy tại: `http://localhost:3000`

---

## 🏗️ Cấu trúc dự án

Cấu trúc **layer-based** (phân theo tầng kỹ thuật):

```
locket-be/
├── app.js                     # Entry point — khởi tạo Express + routes + Socket.IO
├── package.json
├── .env
└── src/
    ├── config/
    │   ├── db.js              # Kết nối PostgreSQL (Pool)
    │   └── cloudinary.js      # Khởi tạo Cloudinary SDK (v2)
    ├── routers/               # Định nghĩa routes
    │   ├── auth.route.js
    │   ├── user.route.js
    │   ├── moment.route.js
    │   ├── friend.route.js
    │   └── conversation.route.js
    ├── controllers/           # Xử lý request → gọi model → trả response
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── moment.controller.js
    │   ├── friend.controller.js
    │   └── conversation.controller.js
    ├── middlewares/           # Middleware (auth, validate, upload)
    │   ├── auth.middleware.js
    │   ├── validator.middleware.js
    │   ├── image.middleware.js
    │   ├── user.middleware.js
    │   ├── friend.middleware.js
    │   └── moment.middleware.js
    ├── models/                # Truy vấn SQL trực tiếp (raw queries)
    │   ├── user.model.js
    │   ├── moment.model.js
    │   ├── friend.model.js
    │   ├── conversation.model.js
    │   └── message.model.js
    ├── socket/
    │   └── socket.js          # Khởi tạo Socket.IO, xử lý sự kiện realtime
    └── utils/                 # Helper functions
        ├── jwt.util.js
        ├── auth.util.js
        ├── cloudinary.util.js
        ├── friend.util.js
        ├── user.util.js
        ├── time.util.js
        └── validator.js
```

---

## 🌐 API Reference

### Auth

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/auth/google` | Đăng nhập bằng Google → trả về access + refresh token |
| `POST` | `/auth/refresh` | Lấy access token mới |
| `POST` | `/auth/logout` | Đăng xuất (xóa refresh token) |

### Users

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/users/me` | Lấy profile cá nhân |
| `PUT` | `/users/me` | Cập nhật profile |
| `PUT` | `/users/me/name` | Cập nhật tên |
| `PUT` | `/users/me/birthday` | Cập nhật ngày sinh |
| `PUT` | `/users/me/avatar` | Cập nhật ảnh đại diện |
| `GET` | `/users/:sharecode` | Lấy thông tin user khác theo share code |

### Friends

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/friend-requests` | Gửi yêu cầu kết bạn |
| `GET` | `/friend-requests/incoming` | Yêu cầu kết bạn nhận được |
| `GET` | `/friend-requests/outgoing` | Yêu cầu kết bạn đã gửi |
| `PUT` | `/friend-requests/:id` | Phản hồi yêu cầu (accept/reject) |
| `DELETE` | `/friend-requests/:id` | Thu hồi yêu cầu đã gửi |
| `GET` | `/friends` | Danh sách bạn bè |
| `DELETE` | `/friends/:id` | Hủy kết bạn |

### Moments

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/moments` | Tạo moment mới (upload ảnh) |
| `DELETE` | `/moments/:id` | Xóa moment |
| `GET` | `/moments/feed` | Feed của tất cả bạn bè (cursor pagination) |
| `GET` | `/moments/grid` | Grid của tất cả bạn bè |
| `GET` | `/moments/me/feed` | Feed của chính mình |
| `GET` | `/moments/me/grid` | Grid của chính mình |
| `GET` | `/users/:id/moments/feed` | Feed của một user cụ thể |
| `GET` | `/users/:id/moments/grid` | Grid của một user cụ thể |

### Conversations & Messages

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/conversations/me` | Danh sách cuộc hội thoại |
| `GET` | `/conversations/:id/messages` | Tin nhắn trong một hội thoại |
| `POST` | `/messages` | Gửi tin nhắn |
| `PUT` | `/conversations/:id/read` | Đánh dấu đã đọc |

> Tất cả các route (trừ `/auth/*`) đều yêu cầu header `Authorization: Bearer <access_token>`

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 📧 Contact

**Huy** · [@Catherine1401\_](https://github.com/Catherine1401)  
Frontend: [github.com/Catherine1401/locket](https://github.com/Catherine1401/locket)
