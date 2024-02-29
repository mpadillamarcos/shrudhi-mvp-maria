import { Typeahead } from "react-bootstrap-typeahead";

export default function AddIngredients({
  ingredients,
  setInputFields,
  inputFields,
}) {
  const handleAddField = () => {
    setInputFields([...inputFields, { name: null, quantity: "", units: "" }]);
  };

  const handleChange = (index, fieldName, selected) => {
    const ingredientInformation = [...inputFields];
    ingredientInformation[index][fieldName] = selected;
    setInputFields(ingredientInformation);
  };

  return (
    <div>
      {inputFields.map((field, index) => (
        <div key={index} className="row mb-3">
          <div className="col-6">
            <Typeahead
              allowNew
              id={`name-${index}`}
              labelKey="name"
              onChange={(selected) => handleChange(index, "name", selected)}
              newSelectionPrefix="Add a new item: "
              options={
                ingredients.length > 0
                  ? ingredients.map((ingredient) => ingredient.name)
                  : []
              }
              placeholder="Write one ingredient"
              value={field.name}
            />
          </div>
          <div className="col-3">
            <input
              id={`quantity-${index}`}
              type="text"
              className="form-control"
              placeholder="Quantity"
              value={field.quantity}
              onChange={(event) =>
                handleChange(index, "quantity", event.target.value)
              }
            />
          </div>
          <div className="col-3">
            <input
              id={`units-${index}`}
              type="text"
              className="form-control"
              placeholder="Units"
              value={field.units}
              onChange={(event) =>
                handleChange(index, "units", event.target.value)
              }
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddField}>
        New Ingredient
      </button>
    </div>
  );
}
