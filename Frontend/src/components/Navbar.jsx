import { useEffect, useState } from "react";
import { ThemeProvider } from "../contexts/theme.js";
import ThemeBtn from "../components/Themebtn";
import { FaBars, FaTimes } from "react-icons/fa";



function Navbar({ setPage }) {
  const [themeMode, setThemeMode] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lightTheme = () => setThemeMode("light");
  const darkTheme = () => setThemeMode("dark");

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  return (
    <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
      <div className="fixed top-0 w-full bg-white dark:bg-gray-900 text-black border-b-2 dark:text-white shadow-lg z-50">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-3 md:px-10">
          <h1 className="text-2xl font-bold">
            File<span className="text-3xl text-green-500">To</span>File
          </h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            <button onClick={() => setPage('home')} className="text-xl font-bold cursor-pointer hover:scale-110 transition-transform">Home</button>
            <button onClick={() => setPage('contact')} className="text-xl font-bold cursor-pointer hover:scale-110 transition-transform">Contact</button>
            <button onClick={() => setPage('about')} className="text-xl font-bold cursor-pointer hover:scale-110 transition-transform">About</button>
            <ThemeBtn />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden text-2xl cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col items-start gap-4 px-6 pb-4 text-black dark:text-white font-bold bg-white dark:bg-gray-900">
            <button onClick={() => setPage('home')}>Home</button>
            <button onClick={() => setPage('contact')}>Contact</button>
            <button onClick={() => setPage('about')}>About</button>
            <ThemeBtn />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default Navbar;





