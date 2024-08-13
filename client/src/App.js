import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WorksList from "./js/WorksList";
import WorkDetails from "./js/WorkDetails";
import EditWorkForm from "./js/EditWorkForm";
import AddWorkForm from "./js/AddWorkForm";
import "./App.css";
import digitalArtLogo from "./images/digitalArtLogo.png";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navBar">
          <Link to="/">Digital Arts</Link>
          <Link to="/hidden">Access hidden works</Link>
          <Link to="/add">Add Work</Link>
          <img
            src={digitalArtLogo}
            alt="Digital Art Logo"
            className="imgLogo"
          />
        </nav>
        <Routes>
          <Route path="/" element={<WorksList showHidden={false} />} />
          <Route path="/hidden" element={<WorksList showHidden={true} />} />
          <Route path="/add" element={<AddWorkForm />} />
          <Route path="/works/:id" element={<WorkDetails />} />
          <Route path="/edit/:id" element={<EditWorkForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
