const Document = require('./documents');
const Chunk = require('./chunk');

Document.hasMany(Chunk, { foreignKey: 'documentId', as: 'chunks' });
Chunk.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

module.exports = {
    Document,
    Chunk,
};