const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "conversations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Conversation;
