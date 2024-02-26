import React, { useState, useEffect } from 'react';

function AddRecipes() {
  // State variables to manage the input field values (getter & setter)
  const [recipeName, setRecipeName] = useState(""); // Input field for recipe name
  const [recipeInstructions, setRecipeInstructions] = useState(""); // Input field for recipe instructions
  const [ingredients, setIngredients] = useState([]); // Holds the list of ingredients fetched from the backend
  const [selectedIngredients, setSelectedIngredients] = useState([]); // selectedIngredients is used to hold the list of ingredients selected by the user when adding the recipe. 
  //selectedIngredients keeps track of which ingredients the user has chosen for the recipe. 
  const [ingredientQuantities, setIngredientQuantities] = useState([]); // Input field for ingredient quantity
  const [ingredientUnits, setIngredientUnits] = useState([]); // Input field for ingredient units

  // Use the Effect hook to fetch ingredients list when component mounts
  // useEffect(() => {
  //   // Fetch ingredients data from the backend
  //   fetch('/api/ingredients')
  //     .then(response => response.json())
  //     .then(data => setIngredients(data))
  //     console.log(ingredients)
  //     .catch(error => console.error('Error fetching ingredients')); // Handling errors
  // }, []); // Empty array to ensure it runs only once when the component mounts
     useEffect(() => { 

    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    let options = {
      method: "GET",
    };
    try {
      const response = await fetch('/api/ingredients', options);
      const data = await response.json();
      console.log(response)
      setIngredients(data.data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeName || !recipeInstructions || !selectedIngredients.length || !ingredientQuantities.length || !ingredientUnits.length) {
      console.error('Please fill in all required fields');//we use .length because it is an array that holds IDs of selected ingr, quants & units. If 0 means nothing is selected. 
      return;
    }
    try {
      const response = await fetch('/api/recipes', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ //copy postman body (name, instructions come from the state variables. 
          //ingredients maps over the selectedIngredients array and creates an object for ingredientId, quantity and unit)
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
        // Reset form fields
        setRecipeName('');
        setRecipeInstructions('');
        setSelectedIngredients([]);
        setIngredientQuantities([]);
        setIngredientUnits([]);
      } else {
        console.error('Error inserting recipe and ingredients');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function for handling ingredient selection
  // index => represents the index at which the state needs to be updated
  // newValue => newValue that needs to be assigned to the state at the specified index
  // setStateFunction => setter function for the corresponding state variable. 
  // to encapsulate the common logic for updating state into a reusable function, improving code organization, and reducing redundancy.
  //When the user interacts with the ingredient selection dropdown menu in the form, the selected ingredient IDs are stored in the selectedIngredients state array.
  const handleIngredientChange = (index, newValue, setStateFunction) => {
    setStateFunction(prevState => {
      const newState = [...prevState];
      newState[index] = newValue;
      return newState;
    });
  };
  // handleIngredientChange is called within the handleIngredient function whenever an 
  // ingredient-related event occurs (such as a selection change or quantity/unit modification).
  //the selectedIngredients state is updated whenever the user selects an ingredient from the dropdown menu. 
  const handleIngredient = (index, e) => {
    handleIngredientChange(index, e.target.value, setSelectedIngredients);
    //clear the corresponding quantities and units for the selected ingredient.
    //clear any previously entered quantities and units because they may not be relevant to the newly selected ingredient.
    handleIngredientChange(index, '', setIngredientQuantities);
    handleIngredientChange(index, '', setIngredientUnits);
  };

  // Function for handling ingredient quantity when user enters the quantity of an ingredient. 
  // index, which represents the index of the ingredient being modified.
  // e, which is the event triggered by the user's interaction with the quantity input field.
  const handleIngredientQuantity = (index, e) => {
    const newIngredientQuantities = [...ingredientQuantities];
    newIngredientQuantities[index] = e.target.value;
    setIngredientQuantities(newIngredientQuantities);
  };

  // Function for handling ingredient unit when user enters the unit of an ingredient. 
  const handleIngredientUnit = (index, e) => {
    const newIngredientUnits = [...ingredientUnits];
    newIngredientUnits[index] = e.target.value;
    setIngredientUnits(newIngredientUnits);
  };

  return (
    <div className="container mt-5 text-bg-dark p-3">
      <h2>AddRecipes</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label"> Recipe Name:</label>
          <input type="text" className="form-control" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label"> Recipe Instructions:</label>
          <textarea className="form-control" value={recipeInstructions} onChange={(e) => setRecipeInstructions(e.target.value)}></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Select Ingredients:</label>
          <select multiple className="form-control" value={selectedIngredients} onChange={(e) => handleIngredient(0, e)}>
            {ingredients.map(ingredient => (
              <option key={ingredient.IngredientID} value={ingredient.IngredientID}>
                {ingredient.Name}
              </option>
            ))}
          </select>
        </div>

        {selectedIngredients.map((selectedIngredientID, index) => (
          <div key={index}>
            <div className="mb-3">
              <label className="form-label">Quantity:</label>
              <input type="text" className="form-control" value={ingredientQuantities[index] || ''} onChange={(e) => handleIngredientQuantity(index, e)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Unit:</label>
              <input type="text" className="form-control" value={ingredientUnits[index] || ''} onChange={(e) => handleIngredientUnit(index, e)} />
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-outline-info">Add Recipe</button>
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
