import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { Info } from "react-flaticons";

function FilterRecipes() {
  // State variables
  const [ingredients, setIngredients] = useState([]); //Stores the list of available ingredients fetched from an API.
  const [selectedIngredients, setSelectedIngredients] = useState([]); //Keeps track of the IDs of the ingredients selected by the user.
  const [ingredientFields, setIngredientFields] = useState([{ name: null }]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); //Stores the list of recipes generated based on the selected ingredients.
  const [recipe, setRecipe] = useState([]);
  const [ingredientInformation, setIngredientInformation] = useState([]);
  const [show, setShow] = useState(false);

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
    <div className="container text-center">
      <h2 className="text-success m-3">Filter Recipes</h2>
      <Form onSubmit={handleSubmit}>
        <div className="container">
          <label className="form-label text-body">Select Ingredients:</label>
          <div className="container col-6">
            {ingredientFields.map((field, index) => (
              <div className="mb-3" key={index}>
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
          <button className="btn btn-secondary" onClick={handleAddField}>
            Add Ingredient
          </button>
        </div>
        <button className="btn btn-outline-primary mt-3">Filter Recipes</button>
      </Form>

      {filteredRecipes.length !== 0 && (
        <div key={filteredRecipes.id} className="mt-3">
          <h4 className="text-success">Results</h4>
          <div className="container text-center">
            <div className="row">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="card mx-2 col">
                  <p>
                    <strong>{recipe.title}</strong>
                  </p>
                  <p>
                    <strong>Instructions:</strong>{" "}
                    {recipe.instructions.slice(0, 20)}
                    ...
                  </p>
                  <div>
                    <Button onClick={() => handleShow(recipe)}>
                      <Info />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Modal show={show} onHide={() => setShow(false)} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>{recipe.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{recipe.instructions}</p>
              <h5>Ingredients</h5>

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
      )}
    </div>
  );
}
export default FilterRecipes;
