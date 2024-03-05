import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";

function FilterRecipes() {
  // State variables
  const [ingredients, setIngredients] = useState([]); //Stores the list of available ingredients fetched from an API.
  const [selectedIngredients, setSelectedIngredients] = useState([]); //Keeps track of the IDs of the ingredients selected by the user.
  const [ingredientFields, setIngredientFields] = useState([{ name: null }]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); //Stores the list of recipes generated based on the selected ingredients.

  const handleAddField = () => {
    setIngredientFields([...ingredientFields, { name: null }]);
  };

  const handleChange = (index, selected) => {
    const ingredientInformation = [...ingredientFields];
    ingredientInformation[index] = selected;
    setIngredientFields(ingredientInformation);

    const ingredientName = ingredientInformation[index][0];
    const ingredientID = ingredients.find(
      (ingredient) => ingredient.name === ingredientName
    ).id;
    setSelectedIngredients([...selectedIngredients, ingredientID]);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ingredients: selectedIngredients.map((ingredient) => ingredient),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setFilteredRecipes(data);
      } else {
        console.error("Error generating recipe");
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };

  return (
    <div className="container mt-5 text-bg-dark p-3 border border-info border-3">
      <h2 className="text-info mb-3">Filter Recipes</h2>
      <Form onSubmit={handleSubmit}>
        <div>
          <label className="form-label text-info">Select Ingredients:</label>
          <div>
            {ingredientFields.map((field, index) => (
              <div className="mb-3">
                <Typeahead
                  id={`name-${index}`}
                  labelKey="name"
                  onChange={(selected) => handleChange(index, selected)}
                  newSelectionPrefix="Add a new item: "
                  options={
                    ingredients.length > 0
                      ? ingredients.map((ingredient) =>
                          ingredient.name === null ? "" : ingredient.name
                        )
                      : []
                  }
                  placeholder="Write one ingredient"
                  value={field.name}
                  inputProps={{ required: true }}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddField}>
            Add Ingredient
          </button>
        </div>
        <button className="btn btn-outline-info mt-3">Filter Recipes</button>
      </Form>

      {filteredRecipes.length !== 0 && (
        <div className="mt-3">
          <h3>Filtered Recipes</h3>
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id}>
              <p>
                <strong>Title:</strong> {recipe.title}
              </p>
              <p>
                <strong>Instructions:</strong> {recipe.instructions}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default FilterRecipes;
