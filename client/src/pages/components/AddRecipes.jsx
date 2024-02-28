import React, { useState, useEffect } from 'react';

function AddRecipes() {
  const [recipeName, setRecipeName] = useState(""); //Stores the name of the recipe.
  const [recipeInstructions, setRecipeInstructions] = useState(""); //Stores the instructions for preparing the recipe.
  const [ingredients, setIngredients] = useState([]); //Holds an array of available ingredients fetched from the database.
  const [selectedIngredients, setSelectedIngredients] = useState([]); //Keeps track of the ingredients selected by the user.
  const [ingredientQuantities, setIngredientQuantities] = useState([]); //Stores the quantities corresponding to each selected ingredient.
  const [ingredientUnits, setIngredientUnits] = useState([]); //Stores the units of measurement for the ingredients.
  const [newIngredientIndex, setNewIngredientIndex] = useState(0); //Tracks the index of a newly added ingredient (New Ingredient Button)


// fetch the list of ingredients from an API when the component mounts. 
// The fetched data is then stored in the ingredients state variable.
  useEffect(() => {
    fetchIngredients(); 
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch('/api/ingredients');
      const data = await response.json();
      setIngredients(data.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

// This function is called when the user submits the form. 
// It first validates whether all required fields (recipe name, instructions, selected ingredients, 
// quantities, and units) are filled. If validation passes, it constructs a JSON object containing 
// recipe details and sends a POST request to an API endpoint (/api/recipes) to add the recipe.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeName || !recipeInstructions || !selectedIngredients.length || !ingredientQuantities.length || !ingredientUnits.length) {
      console.error('Please fill in all required fields');
      return;
    }
    try {
      const response = await fetch('/api/recipes', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: recipeName,
          instructions: recipeInstructions,
          ingredients: selectedIngredients.map((ingredient, index) => ({
            ingredientId: ingredient,
            quantity: ingredientQuantities[index],
            unit: ingredientUnits[index]
          }))
        })
      });
      if (response.ok) {
        console.log("Recipe and ingredients added successfully");
        setRecipeName('');
        setRecipeInstructions('');
        setSelectedIngredients([]);
        setIngredientQuantities([]);
        setIngredientUnits([]);
        setNewIngredientIndex(0);
      } else {
        console.error('Error inserting recipe and ingredients');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

// These functions handle changes to the selected ingredients, quantities, and units respectively. 
// They update the corresponding state variables as the user interacts with the form inputs.
  const handleIngredient = (index, e) => {
    if (e.target.value === 'newIngredient') {
      setNewIngredientIndex(prevState => prevState + 1);
      return;
    }
    const newSelectedIngredients = [...selectedIngredients];
    if (index === newIngredientIndex) {
      newSelectedIngredients[newIngredientIndex] = e.target.value;
    } else {
      newSelectedIngredients[index] = e.target.value;
    }
    setSelectedIngredients(newSelectedIngredients);
    handleIngredientChange(index, e.target.value, setIngredientQuantities);
    handleIngredientChange(index, '', setIngredientUnits);
  };

  const handleIngredientQuantity = (index, e) => {
    const newIngredientQuantities = [...ingredientQuantities];
    newIngredientQuantities[index] = e.target.value;
    setIngredientQuantities(newIngredientQuantities);
  };

  const handleIngredientUnit = (index, e) => {
    const newIngredientUnits = [...ingredientUnits];
    newIngredientUnits[index] = e.target.value;
    setIngredientUnits(newIngredientUnits);
  };
// This function adds a new set of ingredient input fields dynamically when 
// the user clicks the "New Ingredient" button.
  const addNewIngredientInput = () => {
    setSelectedIngredients([...selectedIngredients, '']);
    setIngredientQuantities([...ingredientQuantities, '']);
    setIngredientUnits([...ingredientUnits, '']);
    setNewIngredientIndex(prevState => prevState + 1);
  };

  return (
    <div className="container mt-5 text-bg-dark p-3 border border-info border-3">
      <h2 className="text-info mb-3">Add Recipes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-info">Recipe Name:</label>
          <input type="text" className="form-control" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label text-info">Recipe Instructions:</label>
          <textarea className="form-control" value={recipeInstructions} onChange={(e) => setRecipeInstructions(e.target.value)}></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label text-info">Ingredients:</label>
          {selectedIngredients.map((selectedIngredient, index) => (
            <div key={index} className={`row ${index !== 0 ? 'mt-3' : ''}`}>
              <div className="col-4">
                <select className="form-control" value={selectedIngredient} onChange={(e) => handleIngredient(index, e)}>
                  <option disabled value="">Select an ingredient</option>
                  {ingredients.map(ingredient => (
                    <option key={ingredient.IngredientID} value={ingredient.IngredientID}>
                      {ingredient.Name}
                    </option>
                  ))}
                  <option value="newIngredient">New Ingredient</option>
                </select>
              </div>
              <div className="col-2">
                <input type="text" className="form-control" placeholder="Quantity" value={ingredientQuantities[index]} onChange={(e) => handleIngredientQuantity(index, e)} />
              </div>
              <div className="col-2">
                <input type="text" className="form-control" placeholder="Unit" value={ingredientUnits[index]} onChange={(e) => handleIngredientUnit(index, e)} />
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center">
            <button type="button" className="btn btn-outline-info" onClick={addNewIngredientInput} style={{ marginTop: '30px' }}>New Ingredient</button>
            <div style={{ flexGrow: 1 }}></div>
            <button type="submit" className="btn btn-outline-info" style={{ marginTop: '30px' }}>Add Recipe</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddRecipes;
// import React, { useState, useEffect } from 'react';
// /*
// Add Recipes Page:
// Input field for recipe name
// Input field for recipe instructions
// Dropdown to select ingredients name with the id. (router.get('/ingredients')
// Input field for ingredient quantity
// Input field for ingredient units
// Button to submit all which will update the post("/recipes") 


// For the drop down: 
// Need a list of ingredients from the database to appear. (router.get('/ingredients')
// I need the IngredientID to appear and name to appear. 

// Need a form to submit. 
// The handlesubmit function should update the recipes table and the recipeingredients table. 
// The update to the recipes table would be name and instructions. (post("/recipes") )
// The update to the recipesingredients table would be the newly created recipes id, ingredient id, quantity and unit.(post("/recipes") )

// */

//  function AddRecipes() {
//   //State variables to manage the input field values (getter & setter)
//   const[recipeName, setRecipeName] = useState(""); //Input field for recipe name
//   const[recipeInstructions, setRecipeInstructions] = useState(""); //Input field for recipe instructions
//   const [ingredients, setIngredients] = useState([]); //Holds the list of ingredients fetched from the backend
//   const [selectedIngredients, setSelectedIngredients] = useState([]); //Dropdown to select ingredients name with the id.
//   const [ingredientQuantity, setIngredientQuantity] = useState([]);//Input field for ingredient quantity
//   // const [ingredientQuantity, setIngredientQuantity] = useState('');//Input field for ingredient quantity
//   const [ingredientUnit, setIngredientUnit] = useState([]); //Input field for ingredient units
//   // const [ingredientUnit, setIngredientUnit] = useState(''); //Input field for ingredient units


//   // Use the Effect hook to fetch ingredients list when component mounts
//   useEffect(() => {
//     // Fetch ingredients data from the backend
//     fetch('/ingredients')// Sending GET request to fetch ingredients
//       .then(response => response.json())
//       .then(data => setIngredients(data))//Setting ingredients state with fetched data
//       .catch(error => console.error('Error fetching ingredients'));// Handling errors
//   }, []); // Empty array to ensure it runs only once when the component mounts



//   // Function to handle form submission
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//         // Check for empty fields
//       if (!recipeName || !recipeInstructions || !selectedIngredients || !ingredientQuantity || !ingredientUnit) {
//        // Display error message or take appropriate action
//       console.error('Please fill in all required fields');
//       return; // Prevent form submission
//   }
//     // Send POST request to add recipe endpoint
//     try{
//     const response = await fetch('/api/recipes', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(//follow postman body
//         { name: recipeName, 
//           instructions: recipeInstructions, 
//           ingredients: 
//           [{
//             ingredientId: selectedIngredients, 
//             quantity: ingredientQuantity, 
//             unit: ingredientUnit
//           }
//         ]
//       })});
//       if(response.ok){
//         // Recipe and ingredients inserted successfully
//         console.log("Recipe and ingredients added successfully");
//         // Reset form fields
//         setRecipeName('');
//         setRecipeInstructions('');
//         setSelectedIngredients([]);
//         setIngredientQuantity([]);
//         setIngredientUnit([]);
//         // setIngredientQuantity('');
//         // setIngredientUnit('');
//       }else {
//         // Error inserting recipe and ingredients
//         console.error('Error inserting recipe and ingredients');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Function for multiple ingredient selection
//   // Use the setter method to return a new array. don't 
//   const handleIngredient = (e) => {
//     setSelectedIngredients(
//       [...e.target.selectedOptions].map(option => option.value))
//   };
// //
//   const handleInputChange = (e) => {
//     setRecipeName(e.target.value);
//     setRecipeInstructions(e.target.value);
//     setIngredientQuantity(e.target.value);
//     setIngredientUnit(e.target.value);
//    };
  

//   return (
//     <div className="container mt-5" class="text-bg-dark p-3">
//       <h2>AddRecipes</h2>
//     <form onSubmit={handleSubmit}>

//     <div class="mb-3">
//       <label className="form-label"> Recipe Name:</label>
//         <input type="text" className="form-control" value={recipeName} onChange={(e) => handleInputChange(e)}/>      
//       </div>            


//     <div class="mb-3">
//       <label className="form-label"> Recipe Instructions:</label>
//         <textarea className="form-control" value={recipeInstructions} onChange={(e) => handleInputChange(e)}/>
//        </div>
                  
//     <div className="mb-3">
//        <label className="form-label"> Select Ingredients: </label>
//         <select multiple className="form-control" value={selectedIngredients} onChange={handleIngredient} isMulti>
//         {ingredients.map(ingredient =>(
//           <option key={ingredient.IngredientID} value= {ingredient.IngredientID}>
//             {ingredient.Name}</option>
//           ))}
//         </select>    
//     </div> 
      
//     <div className="mb-3">
//        <label className="form-label">Quantity:</label>       
//         <input type="text" className="form-control" value={ingredientQuantity} onChange={(e) => handleInputChange(e)}/>
//     </div>  

//     <div className="mb-3">        
//       <label className="form-label">Unit:</label>       
//         <input type="text" className="form-control" value={ingredientUnit} onChange={(e) => handleInputChange(e)}/>
//     </div>

//       <button type="submit" class="btn btn-outline-info">Add Recipe</button>

//     </form>
//     </div>
//   );
// }
// export default AddRecipes;
