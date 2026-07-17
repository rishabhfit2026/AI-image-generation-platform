# 🎨 Imagine — AI Image Generation Platform

A full-stack platform where users generate images from text prompts, organise them into chat-style sessions, and browse their complete generation history. Built with a MERN-style stack using PostgreSQL + Prisma.

> Assignment submission — AI Full Stack Practical Task

---

## ✨ Features

- 🔐 **JWT Authentication** — secure register / login with hashed passwords
- 🖼️ **Prompt-based image generation** — pluggable AI providers
- 💬 **Chat-style sessions** — prompts grouped into conversations
- ✏️ **Rename & delete sessions**
- 📜 **History page** with **search** + **pagination**
- ⬇️ **Download** generated images
- ↻ **Regenerate** from a previous prompt
- ⚡ **Optimistic UI** with loading states
- 📱 **Fully responsive** dark UI
- 🐳 **Docker** deployment + ✅ **unit tests**

---

## 🧱 Tech Stack

| Layer     | Technology                                           |
|-----------|------------------------------------------------------|
| Frontend  | React (Vite), React Router, Axios                    |
| Backend   | Node.js, Express (ES Modules)                        |
| Database  | PostgreSQL + Prisma ORM                              |
| Auth      | JWT + bcryptjs                                       |
| AI        | Pollinations (default) / Stability AI / Hugging Face |
| Tests     | Vitest + Supertest                                   |
| DevOps    | Docker + Docker Compose                              |

---

## 📁 Project Structure