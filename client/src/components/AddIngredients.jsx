import { Typeahead } from "react-bootstrap-typeahead";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

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
        <Row key={index} className="mb-3">
          <Form.Group as={Col} md="6">
            <Typeahead
              allowNew
              id={`name-${index}`}
              labelKey="name"
              onChange={(selected) => handleChange(index, "name", selected)}
              newSelectionPrefix="Add a new item: "
              options={
                ingredients.length > 0
                  ? // If the ingredients list from the DB isn't showing up, maybe it's because of the ingredient.name
                    ingredients.map((ingredient) =>
                      ingredient.name === null ? "" : ingredient.name
                    )
                  : []
              }
              placeholder="Write one ingredient"
              value={field.name}
              inputProps={{ required: true }}
            />
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Form.Control
              type="text"
              placeholder="Quantity"
              id={`quantity-${index}`}
              value={field.quantity}
              onChange={(event) =>
                handleChange(index, "quantity", event.target.value)
              }
            ></Form.Control>
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Form.Control
              type="text"
              placeholder="Units"
              id={`units-${index}`}
              value={field.units}
              onChange={(event) =>
                handleChange(index, "units", event.target.value)
              }
            ></Form.Control>
          </Form.Group>
        </Row>
      ))}
      <button type="button" onClick={handleAddField}>
        New Ingredient
      </button>
    </div>
  );
}
