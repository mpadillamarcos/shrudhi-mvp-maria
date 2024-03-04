const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class recipeIngredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.recipes.belongsToMany(models.ingredients, {
        through: recipeIngredients,
      });
      models.ingredients.belongsToMany(models.recipes, {
        through: recipeIngredients,
      });
    }
  }
  recipeIngredients.init(
    {
      quantity: DataTypes.DECIMAL,
      units: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "recipeIngredients",
    }
  );

  return recipeIngredients;
};
