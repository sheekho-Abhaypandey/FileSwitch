import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import React, { useState, useEffect } from "react";
// import { useEffect, useState } from "react"
import { ThemeProvider } from "./contexts/theme.js";


function App() {

  const [themeMode,setThemeMode]=useState("light");

  const lightTheme=()=>{
    setThemeMode("light");
  }

  const darkTheme=()=>{
    setThemeMode("dark");
  }


  useEffect(()=>{
    document.querySelector('html').classList.remove("light", "dark");
    document.querySelector('html').classList.add(themeMode)
  },[themeMode])

  return (
    <ThemeProvider value={{themeMode,lightTheme,darkTheme}}>
      <Navbar />
      <Home />
      <Footer />
     
    </ThemeProvider>
  )
}

export default App
