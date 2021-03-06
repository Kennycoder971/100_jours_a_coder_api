"use strict";
const { Model } = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");
module.exports = (sequelize, DataTypes) => {

  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Friend.init(
    {
      user_id_requester: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id_requested: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Friend",
      tableName: "friends",
    }
  );
  sequelizePaginate.paginate(Friend);
  return Friend;
};
