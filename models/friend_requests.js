"use strict";
const { Model } = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    static associate({ User }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: "request_id_to",
        onDelete: "cascade",
      });
    }
  }

  FriendRequest.init(
    {
      request_id_from: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      request_id_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["p", "a"],
        validate: {
          isIn: {
            args: [["p", "a"]],
            msg: "Le status doit être p (pending),a (accepted) . ",
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
  sequelizePaginate.paginate(FriendRequest);
  return FriendRequest;
};
