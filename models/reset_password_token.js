"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class resetPasswordToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  resetPasswordToken.init(
    {
      token: DataTypes.STRING,
      reset_password_expire: DataTypes.DATE(6),
    },
    {
      sequelize,
      tableName: "reset_password_tokens",
      modelName: "resetPasswordToken",
    }
  );
  return resetPasswordToken;
};
