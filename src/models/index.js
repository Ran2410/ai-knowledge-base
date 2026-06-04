const Document = require("./documents");
const Chunk = require("./chunk");
const Conversation = require("./conversation");
const Message = require("./message");

Document.hasMany(Chunk, { foreignKey: "documentId", as: "chunks" });
Chunk.belongsTo(Document, { foreignKey: "documentId", as: "document" });

Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages" });
Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

module.exports = {
  Document,
  Chunk,
  Conversation,
  Message,
};
