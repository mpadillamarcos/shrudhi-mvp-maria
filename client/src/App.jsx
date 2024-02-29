import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AllRecipes from "./pages/AllRecipes";
import GetRecipes from "./pages/GetRecipes";
import AddRecipes from "./pages/AddRecipes";
import Page404 from "./pages/Page404";
import "bootstrap/dist/css/bootstrap.min.css";
/*
Home Page:
Three buttons: 
"Get Recipes", 
"Add Recipes", and 
"All Recipes"
*/

/* 
  1. Do we need a new state?  = Yes
  2. What is the initial value? = Null
  3. What will the function be? = The buttons should have onClick handlers that call handleChangeView function 
     to toggle the view
*/

function App() {
  return (
    <div className="App">
      <div
        className="card bg-dark border-info"
        style={{
          backgroundColor: "#FFA07A",
          borderWidth: "3px",
          borderStyle: "solid",
          borderRadius: "10px",
        }}
      >
        <div className="card-body">
          <div className="text-center mb-4 mt-2">
            {" "}
            {/* Wrap the heading in its own container */}
            <h1 className="text-info">My Recipe Book</h1>{" "}
            {/* Keep the heading without margin classes */}
          </div>
          <ul className="d-flex justify-content-center">
            <button className="btn btn-outline-info mx-2 ">
              <Link to="/" className="text-info">
                Home
              </Link>
            </button>
            <button className="btn btn-outline-info mx-2">
              <Link to="/all-recipes" className="text-info">
                All Recipes
              </Link>
            </button>
            <button className="btn btn-outline-info mx-2">
              <Link to="/get-recipes" className="text-info">
                Get Recipes
              </Link>
            </button>
            <button className="btn btn-outline-info mx-2">
              <Link to="/add-recipes" className="text-info">
                Add Recipes
              </Link>
            </button>
          </ul>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-recipes" element={<AllRecipes />} />
        <Route path="/get-recipes" element={<GetRecipes />} />
        <Route path="/add-recipes" element={<AddRecipes />} />
        {/* <Route path="/recipes/:id" element={OneRecipe />} /> */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
