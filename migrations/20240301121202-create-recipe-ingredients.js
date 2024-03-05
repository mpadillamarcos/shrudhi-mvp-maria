"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("RecipeIngredients", {
      RecipeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "recipes",
          key: "id",
        },
        allowNull: false,
      },
      IngredientId: {
        type: Sequelize.INTEGER,
        references: {
          model: "ingredients",
          key: "id",
        },
        allowNull: false,
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Units: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("RecipeIngredients");
  },
};
