import React, { useState, useEffect } from 'react';
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
  return (
    <div>AllRecipes</div>
  )
}


export default AllRecipes;