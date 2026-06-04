const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { Document } = require("../models");
const { extractText } = require("../services/documentProcessor");
const { processDocument } = require("../services/documentService");
const { searchChunks } = require("../services/searchService");
const { chat } = require("../services/chatService");
const fs = require("fs").promises;
const path = require("path");

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { filename, path: filePath } = req.file;
    const fileType = path.extname(filename);

    const text = await extractText(filePath, fileType);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text content found in file" });
    }

    const doc = await Document.create({
      filename,
      fileType,
      contentText: text,
    });

    processDocument(doc.id, filePath, text)
      .then(() => console.log(`Document ${doc.id} fully processed`))
      .catch((err) =>
        console.error(`Processing failed for doc ${doc.id}:`, err),
      );

    await fs.unlink(filePath).catch(() => {});

    res.status(201).json({
      message: "Document uploaded successfully",
      document: {
        id: doc.id,
        filename: doc.filename,
        fileType: doc.fileType,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/search", async (req, res) => {
  try {
    const { query, limit } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: "Query is required" });
    }

    const topK = Math.min(limit || 5, 20);
    const results = await searchChunks(query, topK);

    res.json({
      query,
      results: results.map((r) => ({
        chunkId: r.id,
        content: r.content,
        chunkIndex: r.chunk_index,
        document: {
          id: r.document_id,
          filename: r.filename,
          fileType: r.file_type,
        },
        similarity: parseFloat(parseFloat(r.similarity).toFixed(4)),
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { question, limit, conversationId } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await chat(question, conversationId || null, limit || 5);

    res.json({
      conversationId: result.conversationId,
      question,
      answer: result.answer,
      sources: result.sources,
      isNewConversation: result.isNewConversation,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
