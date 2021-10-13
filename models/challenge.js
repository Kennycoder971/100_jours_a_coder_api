"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Challenge.init(
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: DataTypes.STRING,
      succeeded: DataTypes.BOOLEAN,
      hours_a_day: DataTypes.TIME,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Challenge",
    }
  );
  return Challenge;
};
