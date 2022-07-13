const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Character",
    {
      //code*: string (Máximo 5 caracteres) [PK]
      code: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        allowNull: false,
        unique: true,
        //vamos a hacer que no pueda ser "HENRY" pero incluyendo cualquier variación/combinación de mayúsculas y minísculas (Armar un custom validator).
        validate: {
          isNotHenry(value) {
            if (value.toLowerCase() === "henry") {
              throw new Error(
                "Any combination of HENRY characters is not allowed"
              );
            }
          },
        },
      },
      //name*: string (Debe ser único)
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        //el valor no puede ser "Henry", "SoyHenry" o "Soy Henry"
        validate: {
          notIn: ["Henry", "SoyHenry", "Soy Henry"],
        },
      },
      //age: integer
      age: {
        type: DataTypes.INTEGER,       
      },
      //race: enum (Posibles valores: 'Human', 'Elf', 'Machine', 'Demon', 'Animal', 'Other')
      //En el caso de no poner una raza ("race") por default deberían asignarle "Other"
      race: {
        type: DataTypes.ENUM(
          "Human",
          "Elf",
          "Machine",
          "Demon",
          "Animal",
          "Other"
        ),
        defaultValue: "Other",
      },
      //hp*: float
      hp: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      //mana*: float
      mana: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      //date_added: timestamp without time
      date_added: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      //quitar los timestamps automáticos
    },
    {
      timestamps: false,
    }
  );
};
