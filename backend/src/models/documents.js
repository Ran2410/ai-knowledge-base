const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Document = sequelize.define('Document', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    filename: {type: DataTypes.STRING, allowNull: false},
    fileType: {type: DataTypes.TEXT, allowNull: false},
    contentText: {type: DataTypes.TEXT, allowNull: false},
}, {
    tableName: 'documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = Document;