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

function GetRecipes() {
  // State variables
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);

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
      console.log(response);
      setIngredients(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  // Function to handle selection of ingredients
  const handleIngredientSelect = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedIngredients(selectedValues);
  };

  // Function to submit selected ingredients and generate recipe
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

  return (
    <div className="container mt-5 text-bg-dark p-3">
      <h2 className="mb-3">Get Recipes</h2>

      {/* Form for selecting ingredients */}
      <div className="mb-3">
        <label className="form-label">Select Ingredients:</label>
        <select
          multiple
          className="form-control"
          value={selectedIngredients}
          onChange={handleIngredientSelect}
        >
          {ingredients.map((ingredient) => (
            <option
              key={ingredient.IngredientID}
              value={ingredient.IngredientID}
            >
              {ingredient.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Button to submit selected ingredients */}
      <button className="btn btn-outline-info" onClick={handleSubmit}>
        Generate Recipe
      </button>

      {/* Section to display generated recipe */}
      {
        <div className="mt-3">
          <h3>Generated Recipes</h3>
          <p>{generatedRecipes.map((r) => r.Name)}</p>
        </div>
      }
    </div>
  );
}

export default GetRecipes;

// import React, { useState, useEffect } from 'react';

// function GetRecipes() {
//   const [ingredients, setIngredients] = useState([]);
//   const [selectedIngredients, setSelectedIngredients] = useState([]);
//   const [generatedRecipe, setGeneratedRecipe] = useState(null);

//   useEffect(() => {
//     const fetchIngredients = async () => {
//       try {
//         const response = await fetch('/ingredients');
//         const data = await response.json();
//         setIngredients(data);
//       } catch (error) {
//         console.error('Error fetching ingredients:', error);
//       }
//     };

//     fetchIngredients();
//   }, []);

//   const handleIngredientSelect = (ingredientId) => {
//     if (selectedIngredients.includes(ingredientId)) {
//       setSelectedIngredients(selectedIngredients.filter((id) => id !== ingredientId));
//     } else {
//       setSelectedIngredients([...selectedIngredients, ingredientId]);
//     }
//   };

//   const handleGenerateRecipe = async () => {
//     try {
//       const response = await fetch('/api/generate-recipe', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ingredients: selectedIngredients }),
//       });
//       const data = await response.json();
//       setGeneratedRecipe(data);
//     } catch (error) {
//       console.error('Error generating recipe:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Get Recipes</h1>

//       <h2>Select Ingredients</h2>
//       <ul>
//         {ingredients.map((ingredient) => (
//           <li key={ingredient.IngredientID}>
//             <button
//               type="button"
//               onClick={() => handleIngredientSelect(ingredient.IngredientID)}
//               className={selectedIngredients.includes(ingredient.IngredientID) ? 'active' : ''}
//             >
//               {ingredient.Name}
//             </button>
//           </li>
//         ))}
//       </ul>

//       <button type="button" onClick={handleGenerateRecipe}>
//         Generate Recipe
//       </button>

//       {generatedRecipe && (
//         <div>
//           <h2>Generated Recipe</h2>
//           <h3>{generatedRecipe.Name}</h3>
//           <p>{generatedRecipe.Instructions}</p>
//         </div>
//       )}

//       <button type="button" onClick={() => window.history.back()}>
//         Back to Home
//       </button>
//     </div>
//   );
// }

// export default GetRecipes;
