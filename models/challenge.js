"use strict";
const sequelizePaginate = require("sequelize-paginate");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comment, LikeChallenge }) {
      this.hasMany(Comment, { foreignKey: "challenge_id" });
      this.hasMany(LikeChallenge, { foreignKey: "challenge_id" });
    }
  }
  Challenge.init(
    {
      text: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: {
            msg: "Le champ texte est requis",
            args: true,
          },
        },
      },
      technologies: DataTypes.STRING,
      succeeded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hours_a_day: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Vous devez entrer une durée en temps.",
            args: true,
          },
          notNull: {
            msg: "Vous devez entrer une durée en temps. Ex(10:30)",
          },
        },
      },
      start_date: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: "La date doit être valide",
          },
        },
      },
      end_date: {
        type: DataTypes.DATE,
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

      hooks: {
        afterCreate: async function (challenge, options) {
          await challenge.update({
            start_date: sequelize.fn("NOW"),
            end_date: sequelize.fn(
              "DATE_ADD",
              sequelize.literal("NOW()"),
              sequelize.literal("INTERVAL 100 DAY")
            ),
          });
        },
      },
    }
  );
  sequelizePaginate.paginate(Challenge);
  return Challenge;
};
