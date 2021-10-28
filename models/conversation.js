"use strict";
const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Reply }) {
      // define association here
      this.hasMany(Reply, {
        foreignKey: "conversation_id",
        onDelete: "cascade",
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
      user_two: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "L'utilisateur 2 est requis.",
          },
          notEmpty: {
            msg: "L'utilisateur 2 est requis.",
          },
        },
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
