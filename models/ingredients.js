"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ingredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ingredients.belongsToMany(models.recipes, {
      //   through: "recipeIngredients",
      // });
    }
  }
  ingredients.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ingredients",
    }
  );
  return ingredients;
};
