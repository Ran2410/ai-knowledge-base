const { pipeline } = require('@xenova/transformers');

let pipe = null;

async function getEmbedding(text) {
  try {
    if (!pipe) {
      pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true,
      });
    }

    const output = await pipe(text, { pooling: 'mean', normalize: true });
    
    return Array.from(output.data);
    
  } catch (error) {
    console.error('Embedding generation failed:', error);
    throw error;
  }
}

module.exports = { getEmbedding };
