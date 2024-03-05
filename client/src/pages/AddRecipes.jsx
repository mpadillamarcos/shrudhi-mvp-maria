import React, { useState, useEffect } from "react";
import AddIngredients from "../components/AddIngredients";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function AddRecipes() {
  const [recipeName, setRecipeName] = useState(""); //Stores the name of the recipe.
  const [recipeInstructions, setRecipeInstructions] = useState(""); //Stores the instructions for preparing the recipe.
  const [ingredients, setIngredients] = useState([]); //Holds an array of available ingredients fetched from the database.
  const [ingredientFields, setIngredientFields] = useState([
    { name: null, quantity: undefined, units: "" },
  ]);
  const [validated, setValidated] = useState(false);

  // fetch the list of ingredients from an API when the component mounts.
  // The fetched data is then stored in the ingredients state variable.
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch("/api/ingredients");
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

  // This function is called when the user submits the form.
  // It first validates whether all required fields (recipe name, instructions, selected ingredients,
  // quantities, and units) are filled. If validation passes, it constructs a JSON object containing
  // recipe details and sends a POST request to an API endpoint (/api/recipes) to add the recipe.

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: recipeName,
          instructions: recipeInstructions,
          ingredients: ingredientFields.map((ingredient) => ({
            name: ingredient.name[0].name
              ? ingredient.name[0].name
              : ingredient.name[0],
            quantity: ingredient.quantity,
            units: ingredient.units,
          })),
        }),
      });
      if (response.ok) {
        console.log("Recipe and ingredients added successfully!");
        setRecipeName("");
        setRecipeInstructions("");
        setIngredientFields([{ name: null, quantity: undefined, units: "" }]);
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-success mb-3">Add Recipes</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <InputGroup hasValidation className="mb-3">
          <Form.Control
            type="text"
            placeholder="Recipe name"
            required
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a title for your recipe.
          </Form.Control.Feedback>
        </InputGroup>
        <InputGroup hasValidation className="mb-3">
          <Form.Control
            as="textarea"
            type="text"
            placeholder="Instructions"
            required
            value={recipeInstructions}
            onChange={(e) => setRecipeInstructions(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter the recipe instructions.
          </Form.Control.Feedback>
        </InputGroup>
        <AddIngredients
          ingredients={ingredients}
          inputFields={ingredientFields}
          setInputFields={setIngredientFields}
        />
        <button className="btn btn-outline-primary mt-3" type="submit">
          Add Recipe
        </button>
      </Form>
    </div>
  );
}

export default AddRecipes;
