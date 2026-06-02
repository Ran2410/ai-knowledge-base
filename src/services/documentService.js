const { Document, Chunk } = require("../models");
const { extractText } = require("./documentProcessor");
const { chunkText } = require("../utils/chunker");
const { getEmbedding } = require("./embeddingService");
const sequelize = require("../config/database");

async function processDocument(documentId, filePath, text) {
  try {
    const chunks = chunkText(text);
    console.log(
      `Document ${chunks.length} chunks created for document ${documentId}`,
    );

    const embeddingPromises = chunks.map(async (content, index) => {
      const embedding = await getEmbedding(content);

      await sequelize.query(
        `
    INSERT INTO chunks (document_id, content, embedding, "chunkIndex", created_at)
    VALUES ($1, $2, $3, $4, NOW())`,
        {
          bind: [documentId, content, JSON.stringify(embedding), index],
        },
      );
    });

    await Promise.all(embeddingPromises);
    console.log(
      `All chunks for document ${documentId} processed and stored successfully.`,
    );
  } catch (error) {
    await Document.destroy({ where: { id: documentId } });
    throw error;
  }
}

module.exports = {
  processDocument,
};
