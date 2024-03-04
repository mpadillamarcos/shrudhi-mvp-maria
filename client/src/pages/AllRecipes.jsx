import React, { useState, useEffect } from "react";
/*
All Recipes:
1. Need a list of all the recipes according to the name. (GET /recipes: Get all recipes)
2. When a recipe is clicked, the name, instructions from the recipes table & the ingredients 
   from the ingredients table along with the quantity and unit shall appear. 
   - GET /recipes/:id: Get a specific recipe (RecipeID, Name)
   - GET /recipeingredients (RecipeID, IngredientID, Quantity, Unit)
   - get('/ingredients') (IngredientID, Name)

*/

function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.instructions}</p>
        </div>
      ))}
    </div>
  );
}

export default AllRecipes;
