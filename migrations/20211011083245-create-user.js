"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
          isPhoneNum(value) {
            if (!validator.isMobilePhone(value, "any"))
              throw new Error("Le numéro de téléphone n'est pas valide");
          },
          len: {
            args: [8, 16],
            msg: "Le numéro de téléphone n'est pas valide ou doit être entre 8 et 16 chiffres",
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
        },
      },
      birth_date: {
        type: DataTypes.STRING,
        validate: {
          is: {
            args: /^([0-2][0-9]|(3)[0-1])(\/|-)(((0)[0-9])|((1)[0-2]))(\/|-)\d{4}$/,
            msg: "La date doit être au format JJ/MM/AAAA",
          },
        },
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("users");
  },
};
