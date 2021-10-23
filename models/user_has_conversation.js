"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserHasConversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({}) {
      // define association here
    }
  }
  UserHasConversation.init(
    {
      user_id: DataTypes.INTEGER,
      conversation_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "user_has_conversations",
      modelName: "UserHasConversation",
    }
  );
  return UserHasConversation;
};
