"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comment }) {
      this.hasMany(Comment);
    }
  }
  Challenge.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le champ texte est requis",
          },
        },
      },
      technologies: DataTypes.STRING,
      succeeded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hours_a_day: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          is: {
            args: /^\d{1,2}:(?:[0-5]\d):(?:[0-5]\d)$/gm,
            msg: "Le temps n'est pas valide",
          },
        },
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: {
            msg: "La date doit être valide",
          },
        },
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "La date doit être valide",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "challenges",
      modelName: "Challenge",
    }
  );
  return Challenge;
};
