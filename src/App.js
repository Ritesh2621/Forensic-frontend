import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Feature from "./components/Feature";
import Login from "./components/Login";
import SketchApp from "./components/SketchApp";
import DetailsPage from "./components/DetailsPage";


function App() {
  

  return (
    <Router>
      <ScrollToTop>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/upload" element={<UploadPage/>} />
        <Route path="/create" element={<SketchApp/>} />
        <Route path="/details" element={<DetailsPage/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/feature" element={<Feature/>} />
        <Route path="/login" element={<Login/>} />
      
      </Routes>
       <Footer/>
      </ScrollToTop>

    </Router>
  );
}

export default App;