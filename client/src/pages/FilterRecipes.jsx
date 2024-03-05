// import React, { useState, useEffect } from 'react';
// /*
// Get Recipes Page:
// 1. Need a form.
// 2. Dropdown to select ingredients name with the id. (router.get('/ingredients').
//     - select button
//     - list of all recipes (name)
// 3. Button to submit the selected ingredients which will update the post('/generate-recipe'.
//     - req.body (ingredients)

// Section to display generated recipe

// */
// // Form
// // useEffect

// function GetRecipes() {
//   return (
//     <div>GetRecipes</div>
//   )
// }
// export default GetRecipes;

import React, { useState, useEffect } from "react";

function FilterRecipes() {
  // State variables
  const [ingredients, setIngredients] = useState([]); //Stores the list of available ingredients fetched from an API.
  const [selectedIngredients, setSelectedIngredients] = useState([]); //Keeps track of the ingredients selected by the user.
  const [generatedRecipes, setGeneratedRecipes] = useState([]); //Stores the list of recipes generated based on the selected ingredients.

  // Effect hook to fetch ingredients data from the backend when component mounts
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    let options = {
      method: "GET",
    };
    try {
      const response = await fetch("/api/ingredients", options);
      const data = await response.json();
      data.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      setIngredients(data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  // Function to handle selection of ingredients
  //  This function is called when the user selects ingredients from the dropdown.
  // It extracts the values of the selected options and updates the selectedIngredients state accordingly.
  const handleIngredientSelect = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedIngredients(selectedValues);
  };

  // Function to submit selected ingredients and generate recipe
  //  This function is called when the user clicks the "Generate Recipe" button.
  // It sends a POST request to /api/generate-recipe with the selected ingredients in the request body.
  // Upon receiving a successful response, it updates the generatedRecipes state with the generated recipes.
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: selectedIngredients,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedRecipes(data.recipes.data); // Update state with generated recipe
      } else {
        console.error("Error generating recipe");
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };

  // The component renders a form with a dropdown menu allowing users to select multiple ingredients.
  //It renders a button labeled "Generate Recipe" which triggers the handleSubmit function when clicked.
  //If there are generated recipes (generatedRecipes array is not empty), it renders them in a section titled "Generated Recipes".
  //The generated recipes are displayed with their names and instructions.
  //{generatedRecipes.length !== 0 && (...)}: This is a conditional rendering in JSX. It checks whether the length of the generatedRecipes array is not equal to 0.
  // If this condition is true, the JSX code inside the parentheses ((...)) is rendered; otherwise, nothing is rendered.
  return (
    <div className="container mt-5 text-bg-dark p-3 border border-info border-3">
      <h2 className="text-info mb-3">Filter Recipes</h2>

      {/* Form for selecting ingredients */}
      <div className="mb-3">
        <label className="form-label text-info">Select Ingredients:</label>
        <select
          multiple
          className="form-control"
          value={selectedIngredients}
          onChange={handleIngredientSelect}
        >
          {ingredients.map((ingredient, index) => (
            <option key={index} value={ingredient.name}>
              {ingredient.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button to submit selected ingredients */}
      <button className="btn btn-outline-info" onClick={handleSubmit}>
        Filter Recipes
      </button>

      {/* Section to display generated recipe */}
      {generatedRecipes.length !== 0 && (
        <div className="mt-3">
          <h3>Filtered Recipes</h3>
          {generatedRecipes.map((recipe) => (
            <div key={recipe.RecipeID}>
              <p>
                <strong>Title:</strong> {recipe.Name}
              </p>
              <p>
                <strong>Instructions:</strong> {recipe.Instructions}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default FilterRecipes;
