"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Likes }) {}
  }
  Message.init(
    {
      user_id_from: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le champ texte est requis",
          },
          notNull: {
            msg: "Le champ texte est requis",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "messages",
      modelName: "Message",
    }
  );
  return Message;
};
