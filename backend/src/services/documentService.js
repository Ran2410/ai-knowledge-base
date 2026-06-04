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
      const embeddingStr = `[${embedding.join(',')}]`;

      await sequelize.query(
        `
    INSERT INTO chunks (document_id, content, embedding, chunk_index, created_at)
    VALUES (:documentId, :content, :embedding::vector, :chunkIndex, NOW())`,
        {
          replacements: {
            documentId,
            content,
            embedding: embeddingStr,
            chunkIndex: index,
          },
        },
      );
    });

    await Promise.all(embeddingPromises);
    console.log(
      `All chunks for document ${documentId} processed and stored successfully.`,
    );
  } catch (error) {
    console.error(`Processing failed for doc ${documentId}:`, error.message);
    await Document.destroy({ where: { id: documentId } });
    throw error;
  }
}

module.exports = {
  processDocument,
};
