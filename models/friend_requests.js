"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FriendRequest.init(
    {
      request_id_from: {
        type: DataTypes.INTEGER,
      },
      request_id_to: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["p", "a"],
        validate: {
          isIn: {
            args: [["p", "a"]],
            msg: "Le status doit être p (pending) ou a (accepted). ",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "friend_requests",
      modelName: "FriendRequest",
    }
  );
  return FriendRequest;
};
