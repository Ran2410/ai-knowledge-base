const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chunk = sequelize.define('Chunk', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  documentId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    field: 'document_id'
  },
  content: { type: DataTypes.TEXT, allowNull: false },
  chunkIndex: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    field: 'chunk_index'
  },
}, {
  tableName: 'chunks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Chunk;
