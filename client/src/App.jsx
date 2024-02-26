import React, { useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AllRecipes from './pages/components/AllRecipes';
import GetRecipes from './pages/components/GetRecipes';
import AddRecipes from './pages/components/AddRecipes';
import Page404 from "./pages/Page404";
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <>
      <h1>Recipe App</h1>

      <ul> 
       
          <Link to="/">Home</Link>
        
     
          <Link to="/all-recipes">All Recipes</Link>
      
        
          <Link to="/get-recipes">Get Recipes</Link>
       
      
          <Link to="/add-recipes">Add Recipes</Link>
       
      </ul>


      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/all-recipes" element={<AllRecipes/>} />
        <Route path="/get-recipes" element={<GetRecipes/>} />
        <Route path="/add-recipes" element={<AddRecipes/>} />
        <Route path="*" element={<Page404 />}/> 
        

      </Routes>
    </>
  );
}

export default App;