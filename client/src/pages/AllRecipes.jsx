import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { Info } from "react-flaticons";
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
  const [ingredientInformation, setIngredientInformation] = useState([]);

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

  async function handleShow(recipe) {
    setRecipe(recipe);
    try {
      const response = await fetch("/api/recipeingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          recipeId: recipe.id,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setIngredientInformation(data);
      } else {
        console.error("Error generating recipe");
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
    setShow(true);
  }

  return (
    <div className="container">
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="grid p-2 m-2 col border rounded">
            <h3>{recipe.title}</h3>
            <p>{recipe.instructions.slice(0, 20)}...</p>
            <div>
              <Button
                className="btn btn-primary"
                onClick={() => handleShow(recipe)}
              >
                <Info />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={show} onHide={() => setShow(false)} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>{recipe.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{recipe.instructions}</p>
          <Table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {ingredientInformation.map((ingredient) => (
                <tr key={ingredient.id}>
                  <td>{ingredient.name}</td>
                  <td>
                    {ingredient.recipeIngredients.quantity
                      ? ingredient.recipeIngredients.quantity
                      : "No quantities available"}
                  </td>
                  <td>
                    {ingredient.recipeIngredients.units
                      ? ingredient.recipeIngredients.units
                      : "No units available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AllRecipes;
