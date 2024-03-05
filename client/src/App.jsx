import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AllRecipes from "./pages/AllRecipes";
import FilterRecipes from "./pages/FilterRecipes";
import AddRecipes from "./pages/AddRecipes";
import Page404 from "./pages/Page404";
import "bootstrap/dist/css/bootstrap.min.css";
import { Book } from "react-flaticons";
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
      <div className="text-center">
        <div className="text-center mb-1 mt-2">
          <div className=" text-center">
            <h1 className="text-danger mb-3">
              My Recipe Book <Book size="35px" />
            </h1>
          </div>
          <div className="text-center">
            <ul>
              <button className="btn btn-warning ms-1">
                <Link to="/" className="text-body">
                  Home
                </Link>
              </button>
              <button className="btn btn-warning ms-1">
                <Link to="/add-recipes" className="text-body">
                  Add Recipes
                </Link>
              </button>
              <button className="btn btn-warning ms-1">
                <Link to="/all-recipes" className="text-body">
                  All Recipes
                </Link>
              </button>
              <button className="btn btn-warning ms-1">
                <Link to="/get-recipes" className="text-body">
                  Filter Recipes
                </Link>
              </button>
            </ul>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-recipes" element={<AllRecipes />} />
        <Route path="/get-recipes" element={<FilterRecipes />} />
        <Route path="/add-recipes" element={<AddRecipes />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
