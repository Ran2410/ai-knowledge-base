const sequelize = require('../config/database');
const { getEmbedding } = require('./embeddingService');

async function searchChunks(queryText, limit = 5) {
  const queryEmbedding = await getEmbedding(queryText);
  const embeddingStr = `[${queryEmbedding.join(',')}]`;

  const results = await sequelize.query(`
    SELECT 
      chunks.id,
      chunks.content,
      chunks.chunk_index,
      chunks.document_id,
      documents.filename,
      documents."fileType",
      1 - (chunks.embedding <=> :embedding::vector) AS similarity
    FROM chunks
    JOIN documents ON chunks.document_id = documents.id
    WHERE chunks.embedding IS NOT NULL
    ORDER BY chunks.embedding <=> :embedding::vector
    LIMIT :limit
  `, {
    replacements: { embedding: embeddingStr, limit },
    type: sequelize.QueryTypes.SELECT,
  });

  return results;
}

module.exports = { searchChunks };
