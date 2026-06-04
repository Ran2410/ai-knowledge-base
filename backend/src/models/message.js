const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const Message = sequelize.define(
  "Message",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "conversation_id",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [["user", "assistant"]] },
    },
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Message;
