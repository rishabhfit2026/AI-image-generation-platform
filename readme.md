# 🎨 Imagine — AI Image Generation Platform

A full-stack platform where users generate images from text prompts, organise them into chat-style sessions, and browse their complete generation history. Built with a MERN-style stack using PostgreSQL + Prisma.

> Assignment submission — AI Full Stack Practical Task

---

## ✨ Features

- 🔐 **JWT Authentication** — secure register / login with hashed passwords (bcrypt)
- 🖼️ **Prompt-based image generation** — pluggable AI providers (Pollinations / Stability AI / Hugging Face)
- 💬 **Chat-style sessions** — prompts grouped into conversations
- ✏️ **Rename & delete sessions**
- 📜 **History page** with **search** + **pagination**
- ⬇️ **Download** generated images
- ↻ **Regenerate** from a previous prompt
- ⚡ **Loading states** everywhere
- 📱 **Fully responsive** dark UI (mobile sidebar drawer)
- 🐳 **Docker** deployment + ✅ **unit tests**

---

## 🧱 Tech Stack

| Layer     | Technology                                           |
|-----------|------------------------------------------------------|
| Frontend  | React 18 (Vite), React Router, Axios                 |
| Backend   | Node.js, Express (ES Modules)                        |
| Database  | PostgreSQL + Prisma ORM                              |
| Auth      | JWT + bcryptjs                                       |
| AI        | Pollinations (default) / Stability AI / Hugging Face |
| Tests     | Vitest + Supertest                                   |
| DevOps    | Docker + Docker Compose                              |

---

## 📁 Project Structure

```
.
├── client/                  # React (Vite) frontend
│   ├── src/
│   │   ├── pages/           # Login, Register, Chat, History
│   │   ├── components/      # Sidebar, ImageCard
│   │   ├── context/         # AuthContext
│   │   └── api.js           # Axios instance + download helper
│   ├── Dockerfile
│   └── nginx.conf
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # auth, sessions, images
│   │   ├── routes/
│   │   ├── middleware/      # JWT protect, error handler
│   │   ├── services/        # AI image providers
│   │   └── utils/
│   ├── prisma/schema.prisma # Users, ChatSessions, ImageGenerations
│   ├── tests/               # Vitest + Supertest unit tests
│   ├── .env.example
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🚀 Quick Start (Docker — recommended)

```bash
git clone https://github.com/rishabhfit2026/AI-image-generation-platform.git
cd AI-image-generation-platform
docker compose up --build
```

Then open **http://localhost:8080**. That's it — Postgres, migrations, API and UI all come up together.

---

## 🛠️ Local Development Setup

**Prerequisites:** Node.js ≥ 18, PostgreSQL running locally.

### 1. Backend

```bash
cd server
cp .env.example .env        # then edit values (DATABASE_URL, JWT_SECRET)
npm install
npx prisma migrate dev      # creates the tables
npm run dev                 # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :5000)
```

### 3. Run tests

```bash
cd server
npm test
```

---

## 🔑 Environment Variables (`server/.env.example`)

| Variable            | Description                                              |
|---------------------|----------------------------------------------------------|
| `PORT`              | API port (default `5000`)                                |
| `DATABASE_URL`      | PostgreSQL connection string                             |
| `JWT_SECRET`        | Secret for signing tokens                                |
| `JWT_EXPIRES_IN`    | Token lifetime (default `7d`)                            |
| `CLIENT_URL`        | Allowed CORS origin                                      |
| `BASE_URL`          | Public URL used for locally saved images                 |
| `IMAGE_PROVIDER`    | `pollinations` (free, no key) / `stability` / `huggingface` |
| `STABILITY_API_KEY` | Only if using Stability AI                               |
| `HF_API_KEY`        | Only if using Hugging Face inference API                 |

> **Note:** the default provider is [Pollinations](https://pollinations.ai) because it is free and needs **no API key**, so the project runs out of the box. Switch `IMAGE_PROVIDER` to use Stability AI or Hugging Face with your own key.

---

## 📡 API Reference

### Auth
| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| POST   | `/api/auth/register` | Register, returns JWT + user   |
| POST   | `/api/auth/login`    | Login, returns JWT + user      |
| GET    | `/api/auth/me`       | Current user (requires token)  |

### Sessions (all require `Authorization: Bearer <token>`)
| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | `/api/sessions`     | Create a chat session                |
| GET    | `/api/sessions`     | List my sessions (+ image counts)    |
| GET    | `/api/sessions/:id` | Session detail with its generations  |
| PATCH  | `/api/sessions/:id` | Rename a session                     |
| DELETE | `/api/sessions/:id` | Delete a session (cascades images)   |

### Images (all require token)
| Method | Endpoint                    | Description                                     |
|--------|-----------------------------|-------------------------------------------------|
| POST   | `/api/images/generate`      | `{ prompt, sessionId? }` → generates an image (creates a session if none given) |
| POST   | `/api/images/:id/regenerate`| Re-run the same prompt, new image               |
| GET    | `/api/images/history`       | `?page=&limit=&search=` — paginated, searchable |

---

## 🗄️ Database Schema

```
User 1 ──── * ChatSession 1 ──── * ImageGeneration
```

- **User**: id, email (unique), name, password (hashed), timestamps
- **ChatSession**: id, title, userId (FK, cascade delete), timestamps
- **ImageGeneration**: id, prompt, imageUrl, status, sessionId (FK, cascade delete), createdAt

---

## 🎬 Demo Video

_A 3–5 minute walkthrough covering register/login, image generation, sessions (rename/delete), history search + pagination, and download/regenerate._
