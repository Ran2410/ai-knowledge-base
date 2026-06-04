# Phase 4: Memory & Context — AI Knowledge Base
**Tanggal:** 4 Juni 2026
**Status:** ✅ SELESAI

## Overview
Implementasi memory & context management — setiap percakapan sekarang punya history yang tersimpan di DB. LLM mendapat konteks dari percakapan sebelumnya via sliding window (10 message terakhir), sehingga user bisa melakukan multi-turn conversation yang natural.

## Yang Dibangun

### Database Schema Baru
- **`conversations`** — id, title (auto-generate dari pertanyaan pertama), created_at, updated_at
- **`messages`** — id, conversation_id (FK), role (user/assistant), content, created_at

### New Files
- `src/models/conversation.js` — Sequelize model untuk conversations
- `src/models/message.js` — Sequelize model untuk messages
- `src/services/conversationService.js` — CRUD conversations + sliding window
- `src/routes/conversations.js` — endpoint list, detail, delete conversations

### Updated Files
- `src/models/index.js` — tambah relasi Conversation ↔ Message
- `src/services/chatService.js` — load history, build messages array dengan context, save user + assistant messages
- `src/routes/documents.js` — terima `conversationId` optional di `/chat`
- `src/app.js` — register conversations router
- `src/config/init-db.js` — hapus `force: true` (data aman)

## API Endpoints (baru)

### Chat dengan Memory
```
POST /api/documents/chat
Content-Type: application/json

{
  "question": "Apa isi dokumen ini?",
  "conversationId": 1,   // optional — omit untuk auto-create
  "limit": 5
}
```

Response:
```json
{
  "conversationId": 1,
  "question": "Apa isi dokumen ini?",
  "answer": "Berdasarkan dokumen...",
  "sources": [...],
  "isNewConversation": false
}
```

### Conversations CRUD
```
GET    /api/conversations        — List semua conversations (terbaru dulu)
GET    /api/conversations/:id    — Detail conversation + messages
DELETE /api/conversations/:id    — Hapus conversation + messages
```

## Memory & Context Flow

```
User kirim pertanyaan (tanpa conversationId)
  │
  ▼
Auto-create conversation baru (title = pertanyaan pertama)
  │
  ▼
Load 10 message terakhir dari DB (sliding window)
  │
  ▼
Search chunks relevan dari dokumen (cosine similarity)
  │
  ▼
Build messages array:
  [system prompt + document context]
  [history: user msg 1, assistant msg 1, ...]
  [current question]
  │
  ▼
OpenRouter LLM call
  │
  ▼
Save user message + assistant response ke DB
  │
  ▼
Return { conversationId, answer, sources }
```

## Sliding Window Strategy
- **10 message terakhir** per conversation di-load ke LLM context
- History di-load dari DB dalam urutan chronologis (lama → baru)
- Trade-off: simple, predictable, hemat token — tapi konteks lama (>10 msgs) hilang
- Upgrade path: nanti bisa pakai token-based window atau summary-based context

## Auto-Create Conversation
- Tanpa `conversationId` → sistem auto-buat conversation baru
- Title di-generate dari pertanyaan pertama (maks 60 karakter, potong "..." kalau lebih)
- Dengan `conversationId` → lanjut conversation yang sudah ada
- Frontend nanti tinggal tambah tombol "New Chat" untuk reset

## Config
Tidak ada perubahan `.env` — hanya butuh tabel baru di DB. Jalankan `node src/config/init-db.js` untuk sync.

## Issues & Solutions
1. **`column "chunk_index" contains null values`** — Data existing punya NULL di `chunk_index`. Fix: `UPDATE chunks SET chunk_index = 0 WHERE chunk_index IS NULL;` sebelum sync.
2. **`force: true` di init-db.js** — Akan drop semua data. Fix: dihapus, hanya pakai `alter: true`.

## Next Steps (Fase 5)
- React + Vite + Tailwind frontend
- UI chat dengan conversation sidebar
- Upload dokumen page
- Search results visualization
