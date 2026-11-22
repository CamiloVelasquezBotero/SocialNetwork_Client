# ChatApp — Real-Time Social Network Client

A full-featured real-time chat application built with **Next.js 15**, **Socket.io**, and **PostgreSQL**. Users can register, search for friends, send friend requests, and exchange messages instantly — with live notifications, dark mode, and a fully responsive interface.

> This repository is the **frontend client**.
> The backend WebSocket server lives at [SocialNetwork_Server](https://github.com/CamiloVelasquezBotero/SocialNetwork_Server).

---

## Features

- **Real-time messaging** — Messages are delivered instantly via Socket.io with optimistic UI (the message appears immediately without waiting for the server response).
- **Live online presence** — See which contacts are currently online in real time.
- **Friend system** — Send and receive friend requests, accept or decline them, and remove contacts.
- **Floating message notifications** — When a message arrives from a contact whose chat is not open, a toast notification appears at the bottom-right corner with the sender's name, avatar, and message preview.
- **Profile picture upload** — Users can upload a profile photo from the Settings page. Avatars appear across the app: chat headers, message bubbles, online contact list, and notifications.
- **Change password** — Users can update their password from the Settings page, with current password verification via bcrypt.
- **Dark mode** — Full light/dark theme toggle with preference persisted in `localStorage`.
- **Responsive design** — Works correctly on mobile, tablet, and desktop, including split-screen browser windows.
- **JWT Authentication** — Stateless token-based session stored in `localStorage`.
- **Data validation** — All forms are validated on the client and server side using Zod schemas.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Heroicons |
| Real-time | Socket.io Client |
| State management | Zustand |
| Database ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password hashing | bcrypt |
| Schema validation | Zod |
| HTTP client | Axios |
| Alerts | SweetAlert2 + React Toastify |

---

## Project Structure

```
Client_NextJS_SocialNetwork/
├── actions/               # Next.js Server Actions (business logic)
│   ├── createUserAction.ts
│   ├── getOrCreateChat.ts
│   ├── loginUserAction.ts
│   ├── newMessageAction.tsx
│   └── sendFriendRequestAction.ts
├── app/                   # App Router pages and API routes
│   ├── api/
│   │   ├── add-contact/   # Search users endpoint
│   │   ├── change-password/
│   │   ├── upload-image/  # Profile picture upload (Base64)
│   │   └── user/          # User data & friend request management
│   ├── dashboard/         # Main chat page
│   ├── add-contact/
│   ├── contact-list/
│   ├── recover-password/
│   ├── settings/          # Profile & password settings
│   ├── sign-up/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── chats/             # Chat panel, message list, chat history
│   ├── add-contact/       # User search and results
│   ├── contact-list/      # Friends list
│   ├── users/             # Login and register forms
│   └── ui/                # Shared UI: Header, DarkModeInit, Notifications
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── store.ts           # Zustand global state
    ├── types/
    ├── schema-zod/
    └── lib/
```

---

## Database Schema

```prisma
model User {
  id              Int       @id @default(autoincrement())
  name            String
  email           String    @unique
  password        String
  profileImage    String?   // Stored as Base64 Data URL
  friends         User[]    @relation("Friends")
  requestsReceived User[]   @relation("Requests")
  chats           ChatUser[]
  messages        Message[]
}

model Message {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  chatId    Int
  senderId  Int
}

model Chat {
  id        Int        @id @default(autoincrement())
  createdAt DateTime   @default(now())
  users     ChatUser[]
  messages  Message[]
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech) — free tier)
- The [backend server](https://github.com/CamiloVelasquezBotero/SocialNetwork_Server) running on port `4000`

### Installation

```bash
git clone https://github.com/CamiloVelasquezBotero/SocialNetwork_Client.git
cd SocialNetwork_Client
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
SECRET_KEY=your_jwt_secret_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> Make sure the WebSocket backend server is also running. See the [SocialNetwork_Server](https://github.com/CamiloVelasquezBotero/SocialNetwork_Server) repository for setup instructions.

---

## Related Repository

| Repository | Description |
| :--- | :--- |
| [SocialNetwork_Client](https://github.com/CamiloVelasquezBotero/SocialNetwork_Client) | This repository — Next.js frontend |
| [SocialNetwork_Server](https://github.com/CamiloVelasquezBotero/SocialNetwork_Server) | Express + Socket.io WebSocket backend |

---

## Author

**Camilo Velasquez Botero**
