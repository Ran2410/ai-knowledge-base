# AI Knowledge Base

A self-hosted AI document search and retrieval system that lets you upload PDFs, TXT, or Markdown files, then perform semantic search over their contents using local embeddings.

Built as a production-grade foundation for RAG (Retrieval-Augmented Generation) pipelines, this system processes documents offline — no external AI API required for embeddings.

## Features

- **Document Upload:** Support for `.pdf`, `.txt`, and `.md` files via REST API
- **Local Embeddings:** Uses `@xenova/transformers` (all-MiniLM-L6-v2, 384 dims) — runs entirely offline after first model download
- **Semantic Search:** PostgreSQL `pgvector` with IVFFLAT index for fast cosine similarity queries
- **RAG Chat:** Chat with your documents using OpenRouter LLM with grounded responses
- **Memory & Context:** Multi-turn conversation with sliding window history (last 10 messages)
- **Modern Frontend:** React + TailwindCSS + shadcn/ui with dark/light mode

## Tech Stack

### Backend
| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Runtime   | Node.js 26, Express.js                        |
| Database  | PostgreSQL 18 + `pgvector` extension          |
| ORM       | Sequelize (hybrid: model + raw SQL for vectors)|
| ML/AI     | `@xenova/transformers` — local ONNX embeddings|
| PDF Parser| `pdf-parse` v1.1.1                            |
| LLM       | OpenRouter (RAG chat)                         |

### Frontend
| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Framework | React 18 + Vite                               |
| Styling   | TailwindCSS v4 + shadcn/ui                    |
| Routing   | React Router v6                               |
| Icons     | Lucide React                                  |
| Design    | Claude-inspired warm palette + terracotta accent|

## Project Structure

```
ai-knowledge-base/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js           # Sequelize connection
│   │   │   └── init-db.js            # DB initialization script
│   │   ├── models/
│   │   │   ├── document.js           # Document model
│   │   │   ├── chunk.js              # Chunk model (with vector field)
│   │   │   ├── conversation.js       # Conversation model
│   │   │   ├── message.js            # Message model
│   │   │   └── index.js              # Model associations
│   │   ├── routes/
│   │   │   ├── documents.js          # Upload, search, chat routes
│   │   │   └── conversations.js      # Conversation CRUD routes
│   │   ├── services/
│   │   │   ├── documentService.js    # Upload & ingestion orchestration
│   │   │   ├── documentProcessor.js  # File text extraction
│   │   │   ├── embeddingService.js   # Local embedding generation
│   │   │   ├── searchService.js      # Semantic search
│   │   │   ├── chatService.js        # RAG pipeline with memory
│   │   │   └── conversationService.js # Conversation CRUD
│   │   ├── utils/
│   │   │   └── chunker.js            # Text splitting logic
│   │   └── middleware/
│   │       └── upload.js             # Multer file upload config
│   ├── .env                          # Backend environment variables
│   ├── package.json
│   ├── app.js                        # Express app setup
│   └── server.js                     # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── layout/               # AppLayout, Sidebar
│   │   │   ├── chat/                 # ChatArea, MessageBubble, ChatInput
│   │   │   ├── sidebar/              # ConversationList, ConversationItem
│   │   │   ├── upload/               # FileUploadZone
│   │   │   └── shared/               # ThemeToggle
│   │   ├── hooks/                    # useChat, useConversations, useTheme
│   │   ├── pages/                    # ChatPage, UploadPage, SearchPage
│   │   ├── lib/                      # api.js, utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                          # Frontend environment variables
│   └── package.json
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- **Node.js** >= 18
- **PostgreSQL** 18 with `pgvector` extension

```bash
sudo apt install postgresql-18-pgvector
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, OPENROUTER_API_KEY

# Initialize database
node src/config/init-db.js

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Start dev server
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents/health` | Health check |
| POST | `/api/documents/upload` | Upload document (multipart) |
| POST | `/api/documents/search` | Semantic search |
| POST | `/api/documents/chat` | Chat with documents (RAG) |
| GET | `/api/conversations` | List conversations |
| GET | `/api/conversations/:id` | Get conversation + messages |
| DELETE | `/api/conversations/:id` | Delete conversation |

## Roadmap

- [x] **Phase 1: Foundation** — Project setup, DB schema, upload pipeline, local embeddings
- [x] **Phase 2: Retrieval Engine** — Semantic search endpoint with cosine similarity
- [x] **Phase 3: RAG Pipeline** — Chat with context-augmented LLM responses
- [x] **Phase 4: Memory & Context** — Conversation history, sliding window, auto-created sessions
- [x] **Phase 5: Frontend** — React UI with chat, upload, search, dark/light mode
- [ ] **Phase 6: Production** — Error handling, caching, rate limiting, deployment

## Design

Frontend design inspired by **Claude (Anthropic)** — warm parchment palette (`#f5f4ed`) with terracotta accent (`#c96442`). Dark mode uses Linear-inspired deep dark surfaces with translucent borders.

## Notes

- **Embedding model:** First run downloads ~20MB model cache to `~/.cache/xenova`
- **Vector index:** Uses IVFFLAT with 100 lists. For >10k chunks, consider HNSW
- **Memory:** Sliding window of 10 messages per conversation

## License

MIT
