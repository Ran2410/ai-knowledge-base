# AI Knowledge Base

A self-hosted AI document search and retrieval system that lets you upload PDFs, TXT, or Markdown files, then perform semantic search over their contents using local embeddings.

Built as a production-grade foundation for RAG (Retrieval-Augmented Generation) pipelines, this system processes documents offline — no external AI API required for embeddings.

## Features

- **Document Upload:** Support for `.pdf`, `.txt`, and `.md` files via REST API
- **Local Embeddings:** Uses `@xenova/transformers` (all-MiniLM-L6-v2, 384 dims) — runs entirely offline after first model download
- **Semantic Search:** PostgreSQL `pgvector` with IVFFLAT index for fast cosine similarity queries — query in, ranked results out
- **Background Processing:** Upload responds instantly; chunking & embedding runs async in the background
- **Smart Chunking:** Sentence-aware text splitting with configurable overlap to preserve context
- **Memory & Context:** Multi-turn conversation with sliding window history (last 10 messages) and auto-created sessions

## Tech Stack

| Layer        | Technology                              |
|-------------|-----------------------------------------|
| Runtime     | Node.js 26, Express.js                  |
| Database    | PostgreSQL 18 + `pgvector` extension    |
| ORM         | Sequelize (hybrid: model management + raw SQL for vector ops) |
| ML/AI       | `@xenova/transformers` — local ONNX embeddings |
| PDF Parser  | `pdf-parse` v1.1.1                      |
| LLM         | OpenRouter (RAG chat)                   |
| Dev Tools   | Nodemon, dotenv, CORS                   |

## Architecture

```
Upload (.pdf/.txt/.md)
       │
       ▼
┌─────────────────────┐
│  DocumentProcessor  │  Extract raw text from file
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│     Chunker         │  Split into overlapping segments
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ EmbeddingService    │  Generate 384-dim vectors locally
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   PostgreSQL DB     │  Store chunks + vectors (pgvector)
│   (documents/chunks)│  IVFFLAT index for fast search
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   SearchService     │  Cosine similarity search + JOIN metadata
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   ChatService       │  RAG: search → build context → LLM → answer
│   + Conversation    │  Memory: sliding window (10 msgs), auto-session
└─────────────────────┘
```

## Prerequisites

- **Node.js** >= 18 (tested on v26)
- **PostgreSQL** 18 with `pgvector` extension installed

### Installing pgvector (Ubuntu)

```bash
sudo apt install postgresql-18-pgvector
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-knowledge-base
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:***@localhost:5432/ai_knowledge
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
   ```

4. **Initialize the database**
   ```bash
   node src/config/init-db.js
   ```

   This script will:
   - Create the `ai_knowledge` database
   - Enable the `vector` extension
   - Sync all Sequelize models (`documents`, `chunks`, `conversations`, `messages`)
   - Add the `embedding` column with `vector(384)` type
   - Create the IVFFLAT index

5. **Start the server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
```
GET /api/health
```

### Upload Document
```
POST /api/documents/upload
Content-Type: multipart/form-data

Field: file (PDF, TXT, or MD)
```

### Semantic Search
```
POST /api/documents/search
Content-Type: application/json

{
  "query": "What is machine learning?",
  "limit": 5
}
```

### Chat (RAG + Memory)
```
POST /api/documents/chat
Content-Type: application/json

{
  "question": "Apa isi dokumen ini?",
  "conversationId": 1,   // optional — omit to auto-create new conversation
  "limit": 5
}
```

Response:
```json
{
  "conversationId": 1,
  "question": "Apa isi dokumen ini?",
  "answer": "Berdasarkan dokumen yang tersedia...",
  "sources": [
    {
      "chunkId": 4,
      "content": "1. Normalized Database...",
      "document": "sample.pdf",
      "similarity": 0.87
    }
  ],
  "isNewConversation": false
}
```

### Conversations

```
GET  /api/conversations           — List all conversations
GET  /api/conversations/:id       — Get conversation with messages
DELETE /api/conversations/:id     — Delete conversation + messages
```

## Project Structure

```
ai-knowledge-base/
├── src/
│   ├── config/
│   │   ├── database.js           # Sequelize connection
│   │   └── init-db.js            # DB initialization script
│   ├── models/
│   │   ├── document.js           # Document model
│   │   ├── chunk.js              # Chunk model (with vector field)
│   │   ├── conversation.js       # Conversation model
│   │   ├── message.js            # Message model
│   │   └── index.js              # Model associations
│   ├── routes/
│   │   ├── documents.js          # Upload, search, chat routes
│   │   └── conversations.js      # Conversation CRUD routes
│   ├── services/
│   │   ├── documentService.js    # Upload & ingestion orchestration
│   │   ├── documentProcessor.js  # File text extraction
│   │   ├── embeddingService.js   # Local embedding generation
│   │   ├── searchService.js      # Semantic search with cosine similarity
│   │   ├── chatService.js        # RAG pipeline with memory & context
│   │   └── conversationService.js # Conversation CRUD + sliding window
│   ├── utils/
│   │   └── chunker.js            # Text splitting logic
│   └── middleware/
│       └── upload.js             # Multer file upload config
├── uploads/                      # Temporary upload storage
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Environment template
├── .gitignore
├── app.js                        # Express app setup
└── server.js                     # Server entry point
```

## Roadmap

- [x] **Phase 1: Foundation** — Project setup, DB schema, upload pipeline, local embeddings
- [x] **Phase 2: Retrieval Engine** — Semantic search endpoint with cosine similarity
- [x] **Phase 3: RAG Pipeline** — Chat interface with context-augmented LLM responses
- [x] **Phase 4: Memory & Context** — Conversation history, sliding window, auto-created sessions
- [ ] **Phase 5: Frontend** — React UI for upload, search, and chat
- [ ] **Phase 6: Production** — Caching, rate limiting, error handling, deployment

## Notes

- **Embedding model:** First run downloads ~20MB model cache to `~/.cache/xenova`. Subsequent runs use the cached model.
- **Vector index:** Uses IVFFLAT with 100 lists. For datasets >10k chunks, consider tuning or switching to HNSW.
- **Hybrid approach:** Sequelize handles table creation and relations, but all vector operations use raw SQL queries since Sequelize doesn't support PostgreSQL `vector` type natively.
- **Memory:** Sliding window of 10 messages per conversation. History is loaded from DB and included in LLM context.

## License

MIT
