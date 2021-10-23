"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Reply, User, UserHasConversation }) {
      // define association here
      this.hasMany(Reply, {
        foreignKey: "conversation_id",
        onDelete: "cascade",
      });
      this.belongsToMany(User, {
        through: UserHasConversation,
      });
    }
  }
  Conversation.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "conversations",
      modelName: "Conversation",
    }
  );
  return Conversation;
};
