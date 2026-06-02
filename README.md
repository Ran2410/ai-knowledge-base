# AI Knowledge Base

A self-hosted AI document search and retrieval system that lets you upload PDFs, TXT, or Markdown files, then perform semantic search over their contents using local embeddings.

Built as a production-grade foundation for RAG (Retrieval-Augmented Generation) pipelines, this system processes documents offline — no external AI API required for embeddings.

## Features

- **Document Upload:** Support for `.pdf`, `.txt`, and `.md` files via REST API
- **Local Embeddings:** Uses `@xenova/transformers` (all-MiniLM-L6-v2, 384 dims) — runs entirely offline after first model download
- **Semantic Search:** PostgreSQL `pgvector` with IVFFLAT index for fast cosine similarity queries
- **Background Processing:** Upload responds instantly; chunking & embedding runs async in the background
- **Smart Chunking:** Sentence-aware text splitting with configurable overlap to preserve context

## Tech Stack

| Layer        | Technology                              |
|-------------|-----------------------------------------|
| Runtime     | Node.js 26, Express.js                  |
| Database    | PostgreSQL 18 + `pgvector` extension    |
| ORM         | Sequelize (hybrid: model management + raw SQL for vector ops) |
| ML/AI       | `@xenova/transformers` — local ONNX embeddings |
| PDF Parser  | `pdf-parse` v1.1.1                      |
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
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ai_knowledge
   ```

4. **Initialize the database**
   ```bash
   node src/config/init-db.js
   ```

   This script will:
   - Create the `ai_knowledge` database
   - Enable the `vector` extension
   - Sync Sequelize models (`documents`, `chunks` tables)
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

Response:
```json
{
  "message": "Document uploaded and queued for processing",
  "document": {
    "id": 1,
    "title": "sample.pdf",
    "type": "pdf",
    "status": "processing",
    "createdAt": "2025-06-02T10:00:00.000Z"
  }
}
```

### Search (Coming Soon)
```
POST /api/search
{
  "query": "What is machine learning?",
  "limit": 5
}
```

## Project Structure

```
ai-knowledge-base/
├── src/
│   ├── config/
│   │   ├── database.js       # Sequelize connection
│   │   └── init-db.js        # DB initialization script
│   ├── models/
│   │   ├── document.js       # Document model
│   │   ├── chunk.js          # Chunk model (with vector field)
│   │   └── index.js          # Model associations
│   ├── routes/
│   │   └── documents.js      # API routes
│   ├── services/
│   │   ├── documentService.js    # Upload & ingestion orchestration
│   │   ├── documentProcessor.js  # File text extraction
│   │   └── embeddingService.js   # Local embedding generation
│   ├── utils/
│   │   └── chunker.js        # Text splitting logic
│   └── middleware/
│       └── upload.js         # Multer file upload config
├── uploads/                  # Temporary upload storage
├── .env                      # Environment variables (DO NOT COMMIT)
├── .gitignore
├── app.js                    # Express app setup
└── server.js                 # Server entry point
```

## Roadmap

- [x] **Phase 1: Foundation** — Project setup, DB schema, upload pipeline, local embeddings
- [ ] **Phase 2: Retrieval Engine** — Semantic search endpoint with cosine similarity
- [ ] **Phase 3: RAG Pipeline** — Chat interface with context-augmented LLM responses
- [ ] **Phase 4: Memory & Context** — Conversation history & context management
- [ ] **Phase 5: Frontend** — React UI for upload, search, and chat
- [ ] **Phase 6: Production** — Caching, rate limiting, error handling, deployment

## Notes

- **Embedding model:** First run downloads ~20MB model cache to `~/.cache/xenova`. Subsequent runs use the cached model.
- **Vector index:** Uses IVFFLAT with 100 lists. For datasets >10k chunks, consider tuning or switching to HNSW.
- **Sequ Hybrid approach:** Sequelize handles table creation and relations, but all vector operations use raw SQL queries since Sequelize doesn't support PostgreSQL `vector` type natively.

## License

MIT
