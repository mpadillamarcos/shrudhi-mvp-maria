var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const models = require("../models");
const { Op } = require("sequelize");
const recipeIdInDatabase = require("../guards/recipeIdInDatabase");

router.get("/", function (req, res, next) {
  res.send({ title: "Express" });
});

/* 1. GET /recipes: Get all recipes*/

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await models.recipes.findAll();
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* 2. GET /recipes/:id: Get a specific recipe*/

router.get("/recipes/:id", recipeIdInDatabase, async (req, res) => {
  try {
    res.send(req.result);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* 3 POST /recipes: Add a new recipe & update ingredients table and recipeingredients table */
router.post("/recipes", async (req, res) => {
  try {
    const { title, instructions, ingredients } = req.body;

    const recipe = await models.recipes.findOrCreate({
      where: { title: title },
      defaults: { title: title, instructions: instructions },
    });

    for (let i = 0; i < ingredients.length; i++) {
      const [ingredient] = await models.ingredients.findOrCreate({
        where: { name: ingredients[i].name },
        defaults: { name: ingredients[i].name },
      });

      await models.recipeIngredients.create({
        recipeId: recipe[0].id,
        ingredientId: ingredient.id,
        quantity: ingredients[i].quantity,
        units: ingredients[i].units,
      });
    }
    res.send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* 4. GET /ingredients */
router.get("/ingredients", async (req, res) => {
  try {
    const ingredients = await models.ingredients.findAll();
    res.send(ingredients);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* 5. Generate recipe */
router.post("/generate-recipe", async (req, res) => {
  try {
    const { ingredients } = req.body;
    const recipes = await models.recipes.findAll({
      include: [
        {
          model: models.ingredients,
          where: {
            id: {
              [Op.in]: ingredients,
            },
          },
          through: {
            model: models.recipeIngredients,
          },
        },
      ],
    });
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});
// SQL query to fetch recipes based on ingredients
//   const query = ` SELECT r.*
//   FROM recipes AS r
//   INNER JOIN recipeingredients ri ON r.RecipeID = ri.RecipeID
//   WHERE IngredientID IN (${ingredients.join(",")})
//   GROUP BY r.RecipeID
//   HAVING COUNT(*) <= (${ingredients.length})
// `;

/* Get Recipe Ingredients table */
/* 6. GET /recipeingredients: Get all recipe ingredients */
router.post("/recipeingredients", async (req, res) => {
  try {
    const { recipeId } = req.body;
    const recipe = await models.recipes.findOne({
      where: { id: recipeId },
      include: [
        {
          model: models.ingredients,
          through: {
            model: models.recipeIngredients,
            attributes: ["quantity", "units"],
          },
        },
      ],
    });
    const ingredientsWithDetails = recipe ? recipe.ingredients : [];
    res.send(ingredientsWithDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
