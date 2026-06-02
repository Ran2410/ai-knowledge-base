const pdfParse = require('pdf-parse');
const fs = require('fs').promises;

async function extractText(filePath, fileType) {
  if (fileType === '.pdf') {
    const dataBuffer = await fs.readFile(filePath);
    const result = await pdfParse(dataBuffer);
    return result.text;
  }

  return await fs.readFile(filePath, 'utf-8');
}

module.exports = { extractText };
