"use strict";
const { Model } = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ LikeComment }) {
      // define association here
      this.hasMany(LikeComment, { foreignKey: "comment_id" });
    }
  }

  Comment.init(
    {
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
      tableName: "comments",
      modelName: "Comment",
    }
  );
  sequelizePaginate.paginate(Comment);
  return Comment;
};
