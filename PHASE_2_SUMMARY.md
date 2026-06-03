# Phase 2: Retrieval Engine - AI Knowledge Base
**Tanggal:** 3 Juni 2026
**Status:** ✅ SELESAI

## Overview
Implementasi semantic search engine — user kirim query teks, sistem generate embedding lokal, lalu cosine similarity search ke PostgreSQL dan return top-k chunks beserta metadata dokumen.

## Yang Dibangun
- `searchService.js` — orchestration: query embedding + raw SQL cosine similarity + JOIN metadata
- Route `POST /api/documents/search` — endpoint search dengan top-k results dan similarity score
- Perbaikan import, export typo, SQL injection, dan column naming di search pipeline

## API Endpoints (baru)
```
POST /api/documents/search
Content-Type: application/json

{
  "query": "machine learning",
  "limit": 5
}
```

Response:
```json
{
  "query": "machine learning",
  "results": [
    {
      "chunkId": 12,
      "content": "Supervised learning involves training models...",
      "chunkIndex": 3,
      "document": {
        "id": 1,
        "filename": "ml-paper.pdf",
        "fileType": ".pdf"
      },
      "similarity": 0.8732
    }
  ]
}
```

## File yang Dibuat/Diubah
- **Baru:** `src/services/searchService.js` — search chunks via cosine similarity
- **Diubah:** `src/routes/documents.js` — tambah route `/search` + import searchService

## Database Query
```sql
SELECT 
  chunks.id, chunks.content, chunks.chunk_index, chunks.document_id,
  documents.filename, documents."fileType",
  1 - (chunks.embedding <=> $1::vector) AS similarity
FROM chunks
JOIN documents ON chunks.document_id = documents.id
WHERE chunks.embedding IS NOT NULL
ORDER BY chunks.embedding <=> $1::vector
LIMIT $2
```

**Operator `<=>`** = cosine distance (0 = identik, 2 = berlawanan). Score di-invert jadi similarity (1 - distance).

## Issues & Solutions
1. **`searchChunks is not defined`** — Export typo: `searchChunk` vs `searchChunks`. Fix: samakan nama export.
2. **Wrong import `require('sequelize')`** — Import library bukan instance koneksi. Fix: `require('../config/database')`.
3. **Extra semicolon di embeddingStr** — `[$1,$2];` bukan format vector valid. Fix: hapus `;`.
4. **SQL injection via string interpolation** — Embedding di-interpolate langsung ke SQL. Fix: pakai parameterized query `:embedding::vector`.
5. **`column documents.file_type does not exist`** — Model `Document` tidak punya `field: 'file_type'`, jadi kolom di DB namanya `fileType` (camelCase). Fix: pakai `documents."fileType"` (double quotes untuk case-sensitive).
6. **`column documents.filetype does not exist`** — Salah tulis huruf kecil semua. PostgreSQL case-sensitive. Fix: huruf besar `T` + double quotes.

## Catatan Teknis
- Similarity threshold: `0.87+` = relevan, `0.5-0.7` = longgar
- First search call lambat (~2-5 detik) karena ONNX model load. Sesudahnya cepat (~50ms) karena pipeline sudah ter-cache.
- `LIMIT 20` max untuk search results
- Kolom camelCase di raw SQL wajib pakai double quotes: `documents."fileType"`

## Next Steps (Fase 3)
- Chat endpoint dengan context-augmented LLM responses
- Ambil chunks relevan → kirim sebagai context ke LLM → return jawaban grounded ke dokumen
- Source citation (sumber jawaban dari dokumen mana)
