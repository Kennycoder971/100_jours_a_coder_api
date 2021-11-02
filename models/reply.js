"use strict";
const { Model } = require("sequelize");

const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reply.init(
    {
      content: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "replies",
      modelName: "Reply",
    }
  );
  sequelizePaginate.paginate(Reply);
  return Reply;
};
