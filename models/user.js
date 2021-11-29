const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Model } = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Returns jsonwebtoken
     */
    getSignedJwtToken() {
      return jwt.sign(
        {
          id: this.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
    }

    /**
     * Match the string password with then ecrypted one in the database
     * @param  {string} enteredPassword
     */
    async matchPassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }
    /**
     * Generate and hash password token
     */
    getResetToken() {
      // Generate token
      const resetToken = crypto.randomBytes(20).toString("hex");

      // Hash token and set to resetPasswordToken field
      this.token = crypto.createHash("sha256").update(resetToken).digest("hex");
      // Set the expire
      this.reset_password_expire = Date.now() + 10 * 60 * 1000;

      return resetToken;
    }

    static associate({
      FriendRequest,
      Friend,
      Challenge,
      Message,
      resetPasswordToken,
      Conversation,
      LikeChallenge,
      LikeComment,
      Reply,
      Comment,
    }) {
      // define association here
      this.hasMany(FriendRequest, {
        foreignKey: "request_id_to",
        onDelete: "cascade",
      });
      this.hasMany(Friend, {
        foreignKey: "user_id_requester",
        onDelete: "cascade",
      });
      this.hasMany(Challenge, { foreignKey: "user_id", onDelete: "cascade" });
      this.hasMany(Message, { foreignKey: "user_id_to" });
      this.hasMany(resetPasswordToken, {
        foreignKey: "user_id",
        onDelete: "cascade",
      });
      this.hasMany(Conversation, { foreignKey: "user_id" });
      this.hasMany(LikeChallenge, {
        foreignKey: "user_id",
        onDelete: "cascade",
      });
      this.hasMany(LikeComment, {
        foreignKey: "user_id",
        onDelete: "cascade",
      });
      this.hasMany(Reply, {
        foreignKey: "user_id",
        onDelete: "cascade",
      });
      this.hasMany(Comment, {
        foreignKey: "user_id",
        onDelete: "cascade",
      });
    }
  }
  User.init(
    {
      firstname: {
        type: DataTypes.STRING,
        validate: {
          is: {
            args: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            msg: "Le prénom n'est pas valide",
          },
        },
      },
      lastname: {
        type: DataTypes.STRING,
        validate: {
          is: {
            args: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            msg: "Le nom de famille n'est pas valide",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
        validate: {
          is: {
            args: /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            msg: "Le nom d'utilisateur n'est pas valide",
          },
          notNull: {
            msg: "Le nom d'utilisateur est requis.",
          },
          isUnique: async function (value) {
            const user = await User.findOne({
              where: {
                username: value,
              },
            });

            if (user) throw new Error("Cet utilisateur existe déjà");
          },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        validate: {
          isNumeric: {
            msg: "Le numéro de téléphone n'est pas valide",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "L'email n'est pas valide",
          },
          notNull: {
            msg: "L'email est requis",
          },
          isUnique: async function (value) {
            const user = await User.findOne({
              where: {
                email: value,
              },
            });
            if (user) throw new Error("Cet email existe déjà");
          },
        },
      },
      intro: DataTypes.TEXT,
      profile: DataTypes.TEXT,
      profile_picture: {
        type: DataTypes.STRING,
      },
      profile_cover: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      postal_code: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["m", "f"],
        validate: {
          isIn: {
            args: [["m", "f"]],
            msg: "Le genre doit être m ou f. Mâle ou femelle.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 128],
            msg: "Le mot de passe doit être entre 6 et 128 charactères",
          },
          notNull: {
            msg: "Le mot de passe est requis.",
          },
        },
      },
      birth_date: {
        type: DataTypes.STRING,
        validate: {
          isDate: {
            msg: "La date doit être valide",
          },
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ["user", "admin"],
        defaultValue: "user",
      },
    },
    {
      hooks: {
        beforeSave: async function (user, options) {
          // Hash the password
          user.password = await bcrypt.hash(user.password, 10);
        },
      },

      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  sequelizePaginate.paginate(User);

  return User;
};
