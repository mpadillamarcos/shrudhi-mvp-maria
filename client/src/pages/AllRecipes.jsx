import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
  const [recipe, setRecipe] = useState([]);
  const [show, setShow] = useState(false);

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

  function handleShow(recipe) {
    setRecipe(recipe);
    setShow(true);
  }

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id} className="card" onClick={() => setShow(true)}>
          <h3>{recipe.title}</h3>
          <p>{recipe.instructions.slice(0, 20)}...</p>
          <Button onClick={() => handleShow(recipe)}>More information</Button>
        </div>
      ))}
      <Modal
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>{recipe.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{recipe.instructions}</Modal.Body>
      </Modal>
    </div>
  );
}

export default AllRecipes;
