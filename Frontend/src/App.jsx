import React, { useState, useEffect } from "react";
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Contact from './components/Contact.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';

import { ThemeProvider } from "./contexts/theme.js";

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [page, setPage] = useState("home"); // <-- New state

  const lightTheme = () => setThemeMode("light");
  const darkTheme = () => setThemeMode("dark");

  useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark");
    document.querySelector('html').classList.add(themeMode);
  }, [themeMode]);

  return (
    <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
      <Navbar setPage={setPage} />
      
      {page === "home" && <Home />};
      {page === "contact" && <Contact />};
      {page === "about" && <About />};

      <Footer />
    </ThemeProvider>
  );
}

export default App;
