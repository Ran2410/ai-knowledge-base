# Phase 3: RAG Pipeline - AI Knowledge Base
**Tanggal:** 3 Juni 2026
**Status:** ✅ SELESAI

## Overview
Implementasi Retrieval-Augmented Generation (RAG) pipeline — user tanya, sistem ambil chunks relevan via semantic search, kirim ke LLM sebagai context, dan return jawaban grounded ke dokumen beserta source citations.

## Yang Dibangun
- `chatService.js` — orchestration RAG: query → search chunks → build context → call LLM → return answer + sources
- Route `POST /api/documents/chat` — chat endpoint dengan question + sources response
- OpenRouter integration dengan free model (Llama 3.2 3B / Mistral 7B)

## API Endpoints (baru)
```
POST /api/documents/chat
Content-Type: application/json

{
  "question": "Apa isi dokumen ini?",
  "limit": 5
}
```

Response:
```json
{
  "question": "Apa isi dokumen ini?",
  "answer": "Berdasarkan dokumen yang tersedia...",
  "sources": [
    {
      "chunkId": 4,
      "content": "1. Normalized Database...",
      "document": "sample.pdf",
      "similarity": 0.87
    }
  ]
}
```

## RAG Pipeline Flow
```
User Question
     │
     ▼
getEmbedding() → Query Vector (384 dims)
     │
     ▼
searchChunks() → Top-K Relevant Chunks (cosine similarity)
     │
     ▼
Build Context String → "[1] (filename, similarity: 0.87)\ncontent..."
     │
     ▼
System Prompt + Context + User Question
     │
     ▼
OpenRouter API (LLM) → Grounded Answer + Source Citations
```

## File yang Dibuat/Diubah
- **Baru:** `src/services/chatService.js` — RAG pipeline dengan OpenRouter
- **Diubah:** `src/routes/documents.js` — tambah route `/chat` + import chatService

## Config Tambahan (.env)
```
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

## Issues & Solutions
1. **`searchChunks is not defined`** — Export typo: `searchChunk` vs `searchChunks`. Fix: samakan nama export.
2. **`column documents.file_type does not exist`** — Model `Document` pakai camelCase (`fileType`). Fix: `documents."fileType"` dengan double quotes.
3. **OpenRouter 429 Rate Limit** — Free model sering di-limit. Fix: tunggu 12 detik atau ganti model ke `mistralai/mistral-7b-instruct:free`.
4. **`Cannot read properties of undefined (reading 'content')`** — Salah tulis `data.choices[0].messages.content`. Fix: `data.choices[0].message.content` (singular).
5. **`c.context` vs `c.content`** — Typo di context builder. Fix: `c.content`.

## Free Models di OpenRouter
- `meta-llama/llama-3.1-8b-instruct:free` — paling stabil
- `mistralai/mistral-7b-instruct:free` — alternatif bagus
- `qwen/qwen-2-7b-instruct:free` — alternatif
- `meta-llama/llama-3.2-3b-instruct:free` — ringan tapi sering rate-limited

## Catatan Teknis
- **Grounded answering:** LLM hanya boleh jawab berdasarkan context dokumen. Kalau tidak ada info relevan, LLM harus bilang "tidak ditemukan".
- **Temperature 0.3** — rendah biar jawaban konsisten dan tidak mengarang.
- **Source citations** — response termasuk array `sources` dengan chunk content (200 char preview) dan similarity score.
- **Similarity threshold implisit** — tidak ada hard cutoff, tapi LLM akan menilai relevansi dari context yang diberikan.

## Next Steps (Fase 4)
- Conversation history & context management
- Tabel `conversations` untuk simpan chat history
- Sliding window atau summary-based context management
