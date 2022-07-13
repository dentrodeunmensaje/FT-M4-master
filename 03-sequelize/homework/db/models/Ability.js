const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('Ability', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compoundIndex',
    },
    description: {
      type: DataTypes.TEXT, 
    },
    mana_cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: 'compoundIndex',
      //el valor debe estar entre 10.0 y 250.0
      validate: {
        min: 10.0,
        max: 250.0,
      },
    },
    //la combinación mana_cost + name debe ser única
    //Ahora crearemos un campo virtual para el modelo de Ability que será como un mini resumen de la habilidad y lo llamaremos "summary", deberá retornar "{name} (name({mana_cost} points of mana) - Description: ${description}" (La mana tienen que ser solo la parte entera).
    summary: {
      type: DataTypes.VIRTUAL,
      get() { 
        return `${this.name} (${this.mana_cost} points of mana) - Description: ${this.description}`;
      }
    }
  })
}