const express = require("express");
const router = express.Router();
const {
  listConversations,
  getConversation,
  deleteConversation,
} = require("../services/conversationService");

// GET /api/conversations — list semua conversations
router.get("/", async (req, res) => {
  try {
    const conversations = await listConversations();
    res.json({ conversations });
  } catch (error) {
    console.error("List conversations error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/conversations/:id — detail conversation + messages
router.get("/:id", async (req, res) => {
  try {
    const conversation = await getConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json({ conversation });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/conversations/:id — hapus conversation + messages
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteConversation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
