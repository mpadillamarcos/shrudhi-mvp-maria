var express = require("express");
var router = express.Router();
const db = require("../model/helper");

/* Routes Needed: 
    1. Get Recipes Page:
      - 5. POST /generate-recipe: Generate a recipe based on input ingredients
      - 2. GET /recipes/:id: Get a specific recipe

    2. Add Recipes Page:
      - 3. POST /recipes: Add a new recipe & update recipeingredients table
      - 4. GET /ingredients

    3. All Recipes:
      - 1. GET /recipes: Get all recipes
      - 2. GET /recipes/:id: Get a specific recipe
*/

/*Routes 

1. GET /recipes: Get all recipes
2. GET /recipes/:id: Get a specific recipe
3. POST /recipes: Add a new recipe & update recipeingredients table
4. GET /ingredients
5. POST /generate-recipe: Generate a recipe based on input ingredients
*/

/* 1. GET /recipes: Get all recipes*/

router.get("/recipes", async (req, res) => {
  try {
    //Search the database to retrieve all the recipes
    const recipes = await db("SELECT * FROM recipes");
    //Send the retrieved recipes as a JSON response
    res.json(recipes);
  } catch (error) {
    //Handle database error
    console.error("Error retrieving recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* 2. GET /recipes/:id: Get a specific recipe*/

router.get("/recipes/:id", async (req, res) => {
  try {
    // Extract the ID params from request URL
    const recipeId = req.params.id;

    // Query the database to retrieve the specific recipe by its ID
    const query = `SELECT * FROM Recipes WHERE RecipeID = ${recipeId}`;
    const recipes = await db(query);

    // Check if the recipe exists
    if (recipes.length === 0) {
      // If not found, return a 404 Not Found response
      res.status(404).json({ message: "Recipe not found" });
    } else {
      // If found, send the recipe as a JSON response
      res.json(recipes.data);
    }
  } catch (error) {
    // Handle database errors
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* 3 POST /recipes: Add a new recipe & update recipeingredients table */
router.post("/recipes", async (req, res) => {
  try {
    const { name, instructions, ingredients } = req.body;

    // Insert the recipe into the recipes table
    // await db(`INSERT INTO recipes (Name , Instructions) VALUES ("${name}" , "${instructions}");`);
    let results = await db(
      `INSERT INTO recipes (Name, Instructions) VALUES ("${name}", "${instructions}");SELECT LAST_INSERT_ID();`
    );
    // Get the ID of the last inserted recipe
    // const [rows] = await db(`SELECT LAST_INSERT_ID() as RecipeID;`);
    // const recipeId = rows[0].RecipeID;

    // const last_id = results.data[0].insertId;
    // console.log("last_id", last_id);
    const recipeId = results.data[0].insertId;
    // const recipeId = await db(`SELECT LAST_INSERT_ID();`);
    // console.log("recipeId", recipeId.data[0]);
    // Construct the values for all ingredients to be inserted
    for (const ingredient of ingredients) {
      const { ingredientId, quantity, unit } = ingredient;
      await db(
        `INSERT INTO recipeingredients (RecipeID, IngredientID, Quantity, Unit) VALUES (${recipeId}, ${ingredientId}, ${quantity}, "${unit}");`
      );
    }

    // for (const id of ingredientId) {
    //   // Insert all ingredients into the recipe_ingredients table in a single query
    //   await db(`INSERT INTO recipeingredients (RecipeID, IngredientID, Quantity, Unit) VALUES (${last_id}, ${id}, ${quantity}, "${unit}");`);
    // }

    res
      .status(201)
      .json({ message: "Recipe and ingredients inserted successfully" });
  } catch (error) {
    console.error("Error inserting recipe and ingredients:", error);
    res.status(500).json(error);
  }
});

/* 4. GET /ingredients */
router.get("/ingredients", async (req, res) => {
  try {
    // Query the database to fetch all available ingredients
    const ingredients = await db("SELECT * FROM ingredients");
    res.json(ingredients);
  } catch (error) {
    console.error("Error retrieving ingredients:", error);
    res.status(500).json({ error: "Error retrieving ingredients" });
  }
});

/* 5. Generate recipe */
router.post("/generate-recipe", async (req, res) => {
  const ingredients = req.body.ingredients; // An array of ingredient names

  // SQL query to fetch recipes based on ingredients
  //   const query = ` SELECT r.*
  //   FROM recipes AS r
  //   INNER JOIN recipeingredients ri ON r.RecipeID = ri.RecipeID
  //   WHERE IngredientID IN (${ingredients.join(",")})
  //   GROUP BY r.RecipeID
  //   HAVING COUNT(*) <= (${ingredients.length})
  // `;

  // SQL query to fetch recipes based on ingredients
  // the recipe needs to have some of the ingredients in our list, and none that are not in our list
  // we have to check that the recipe has all the ingredients and doesn't need more ingredients that are not in our list

  const query = `
SELECT r.*
FROM recipes AS r
INNER JOIN recipeingredients ri ON r.RecipeID = ri.RecipeID
WHERE IngredientID IN (${ingredients.join(",")})
GROUP BY r.RecipeID
HAVING COUNT(*) <= (${ingredients.length})
AND COUNT(*) = (SELECT COUNT(*) FROM recipeingredients WHERE RecipeID = r.RecipeID)
`;

  console.log("query", query);
  try {
    // Execute the SQL query
    const results = await db(query);
    // Send the results as JSON
    res.json({ recipes: results });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json(error);
  }
});

/* Get Recipe Ingredients table */
/* 6. GET /recipeingredients: Get all recipe ingredients */
router.get("/recipeingredients", async (req, res) => {
  try {
    // Query the database to fetch all recipe ingredients
    const ingredients = await db("SELECT * FROM recipeingredients");
    res.json(ingredients);
  } catch (error) {
    console.error("Error retrieving recipe ingredients");
    res.status(500).json(error);
  }
});
// const query = `
// SELECT * FROM recipes
// WHERE recipe_id IN (
//   SELECT recipe_id FROM recipe_ingredients
//   WHERE ingredient_id IN (1,2,3)
//   GROUP BY recipe_id
//   HAVING COUNT(*) <= 3
// )
// `;
// // insert a new recipe and all the ingredients that it needs
// routes.post("/recipes", (req, res) => {
//   const { name, ingredients } = req.body;

//   // insert the recipe into the recipes table
//   // INSERT INTO recipes (name) VALUES ('Pizza');

//   // select the ID of the last recipe that was inserted
//   // const recipeId = SELECT LAST_INSERT_ID() as recipe_id;

//   // insert all the ingredients in the recpie_ingredients table
//   // all the ingredient might come in an array of ingredient IDs in the req.body

//   // ingredients is an array of ingredient IDs_: [1,2,3,4]

//   // for every ingredient, create a new row in the recipe_ingredients table
//   for (const ingredientId of ingredients) {
//     // INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES (recipeId, ingredientId);
//   }
// });
// /* 3. POST /recipes: Add a new recipe*/
// router.post("/recipes", async function(req, res, next) {
//   try {
//     // Extract recipe data from request body
//     const { name, instructions } = req.body;

//     // Validate incoming data
//     if (!name || !instructions) {
//         return res.status(400).json({ message: 'Name and instructions are required' });
//     }
//     // Insert the new recipe into the database
//     const result = `INSERT INTO Recipes (Name, Instructions) VALUES ("${name}", "${instructions}");`;
//     await db(result);

//     // Send a success response
//     res.status(201).json({ message: 'Recipe added successfully'});
// } catch (error) {
//     // Handle database errors
//     console.error('Error adding recipe:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
// }
// });
/* 5. POST /ingredients: Add a new ingredient */
// router.post("/ingredients", async function(req, res, next) {
//   try {
//     // Extract ingredient data from request body
//     const { name } = req.body;

//     // Validate incoming data
//     if (!name) {
//       return res.status(400).json({ message: 'Ingredient name is required' });
//     }

//     // Check if the ingredient already exists in the database
//     const existingIngredient = await db(`SELECT * FROM Ingredients WHERE Name = "${name}"`);

//     // If the ingredient already exists, return success response without adding it again
//     if (existingIngredient.length > 0) {
//       return res.status(200).json({ message: 'Ingredient already exists' });
//     }

//     // If the ingredient does not exist, insert it into the database
//     await db(`INSERT INTO Ingredients (Name) VALUES ("${name}")`);

//     // Send a success response
//     res.status(201).json({ message: 'Ingredient added successfully' });
//   } catch (error) {
//     // Handle database errors
//     console.error('Error adding ingredient:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
module.exports = router;
