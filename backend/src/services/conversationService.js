const { Conversation, Message } = require("../models");

function generateTitle(question) {
  const cleaned = question.trim().replace(/\n/g, " ");
  if (cleaned.length <= 60) return cleaned;
  return cleaned.substring(0, 57) + "...";
}

async function createConversation(firstQuestion) {
  const title = generateTitle(firstQuestion);
  const conversation = await Conversation.create({ title });
  return conversation;
}

async function listConversations() {
  const conversations = await Conversation.findAll({
    order: [["created_at", "DESC"]],
    attributes: ["id", "title", "created_at", "updated_at"],
  });
  return conversations;
}

async function getConversation(conversationId) {
  const conversation = await Conversation.findByPk(conversationId, {
    include: [
      {
        model: Message,
        as: "messages",
        attributes: ["id", "role", "content", "created_at"],
        order: [["created_at", "ASC"]],
      },
    ],
  });
  return conversation;
}

async function getRecentMessages(conversationId, limit = 10) {
  const messages = await Message.findAll({
    where: { conversationId },
    order: [["created_at", "DESC"]],
    limit,
    attributes: ["role", "content"],
  });

  return messages.reverse();
}

async function saveMessage(conversationId, role, content) {
  const message = await Message.create({ conversationId, role, content });
  return message;
}

async function deleteConversation(conversationId) {
  const deleted = await Conversation.destroy({
    where: { id: conversationId },
  });
  if (deleted) {
    await Message.destroy({ where: { conversationId } });
  }
  return deleted;
}

module.exports = {
  createConversation,
  listConversations,
  getConversation,
  getRecentMessages,
  saveMessage,
  deleteConversation,
};
