/**
 * Chunks a string into smaller segments based on max tokens and overlap.
 * * @param {string} text - The input text to be chunked.
 * @param {number} maxTokens - The maximum tokens per chunk.
 * @param {number} overlap - The number of tokens to overlap between chunks.
 * @returns {string[]} An array of text chunks.
 */
function chunkText(text, maxTokens = 800, overlap = 100) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const chunkSize = maxTokens * 3;
  const overlapSize = overlap * 3;
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex < text.length) {
      const sentenceEnd = text.lastIndexOf('. ', endIndex);
      const paragraphEnd = text.lastIndexOf('\n\n', endIndex);
      const naturalEnd = Math.max(sentenceEnd, paragraphEnd);

      if (naturalEnd > startIndex + (chunkSize * 0.5)) {
        endIndex = naturalEnd + 2;
      }
    }

    const chunk = text.slice(startIndex, endIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    startIndex = endIndex - overlapSize;

    if (startIndex <= 0) {
      startIndex = endIndex; 
    }
  }

  return chunks;
}

module.exports = { chunkText };