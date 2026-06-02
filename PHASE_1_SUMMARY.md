# Phase 1: Foundation - AI Knowledge Base
**Tanggal:** 2 Juni 2026
**Status:** ✅ SELESAI

## Overview
Setup fondasi aplikasi AI Knowledge Base. Upload dokumen, extract teks, chunking, dan generate embeddings.

## Tech Stack
- **Backend:** Express.js + JavaScript
- **Database:** PostgreSQL 18 + pgvector
- **AI:** @xenova/transformers (local embeddings, offline)
- **ORM:** Sequelize (hybrid dengan raw SQL untuk vector ops)

## Struktur Folder
```
ai-knowledge-base/
├── src/
│   ├── config/
│   │   ├── database.js      # Sequelize connection
│   │   └── init-db.js       # DB initialization script
│   ├── models/
│   │   ├── document.js      # Document model
│   │   ├── chunk.js         # Chunk model (document_id, chunk_index mapped to snake_case)
│   │   └── index.js         # Relationships
│   ├── controllers/         # Route handlers
│   ├── middleware/
│   │   └── upload.js        # Multer config (PDF, TXT, MD)
│   ├── routes/
│   │   └── documents.js     # Upload & health endpoints
│   ├── services/
│   │   ├── documentProcessor.js  # PDF text extraction (pdf-parse@1.1.1)
│   │   ├── embeddingService.js   # Local embeddings via @xenova/transformers
│   │   └── documentService.js    # Main pipeline (chunk + embed + save)
│   ├── utils/
│   │   └── chunker.js       # Text chunking (800 tokens, 100 overlap, sentence boundary aware)
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point
├── uploads/                 # Temporary storage
├── .env                     # DB_URL, PORT, etc.
└── package.json
```

## Database Schema
- **documents**: id, filename, file_type, content_text, created_at, updated_at
- **chunks**: id, document_id (FK), content, chunk_index, embedding (vector 384), created_at
- **Index**: `ivfflat` on `embedding` for cosine similarity search

## Dependencies Installed
- `express`, `cors`, `dotenv`, `multer`, `path`
- `sequelize`, `pg`, `pg-hstore`
- `pdf-parse@1.1.1` (versi 3.x incompatible)
- `@xenova/transformers` (local embeddings, offline, 384 dim)
- `nodemon` (dev)

## API Endpoints
- `POST /api/documents/upload` - Upload PDF/TXT/MD
- `GET /api/documents/health` - Health check

## Issues & Solutions Encountered
1. **pdf-parse v3 export object**: Versi baru export `PDFParse` class. Install `pdf-parse@1.1.1` untuk compatibility.
2. **Sequelize tidak support vector type**: Gunakan raw SQL `INSERT` untuk menyimpan embeddings. Kolom `embedding` harus dibuat manual via `ALTER TABLE` atau `DO $$` block di init script.
3. **Missing `path` module di routes**: Lupa `require('path')` di `documents.js`.
4. **Typo `lastIndex` vs `lastIndexOf`**: Di `chunker.js` baris 17.
5. **Column mismatch (camelCase vs snake_case)**: Sequelize default `documentId`, tapi SQL pakai `document_id`. Fix: tambahkan `field: 'document_id'` di model definition.
6. **OpenAI Rate Limit (429)**: Switch ke local embeddings via `@xenova/transformers` (100% offline, gratis).
7. **HuggingFace API DNS Error**: `ENOTFOUND api-inference.huggingface.co`. Network tidak bisa resolve. Solusi: pakai local model.

## Cara Menjalankan
```bash
npm run dev
# Terminal lain:
curl -X POST http://localhost:3000/api/documents/upload -F "file=@/path/to/doc.pdf"
```

## Catatan Penting
- Model embedding: `Xenova/all-MiniLM-L6-v2` (384 dimensi, quantized)
- Chunk size: ~800 tokens (2400 chars), overlap: 100 tokens (300 chars)
- Split di sentence boundary (`. ` atau `

`) untuk chunk lebih natural
- Processing chunks jalan di background (non-blocking) untuk UX lebih baik

## Next Steps (Fase 2)
- Semantic search endpoint
- Cosine similarity query
- Metadata filtering
