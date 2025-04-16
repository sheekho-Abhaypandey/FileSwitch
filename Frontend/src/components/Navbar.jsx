
import { useEffect, useState } from "react"
import { ThemeProvider } from "../contexts/theme.js";
import ThemeBtn from "../components/Themebtn";

function Navbar() {
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
    
    <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 shadow-lg h-16 fixed border bg-white text-black dark:bg-gray-900 dark:text-white">

      <div className="flex justify-between ">
        <h1 className="text-2xl cursor-pointer font-bold text-black dark:text-white dark:bg-gray-900">
          Word<span className="text-3xl  text-green-500">To</span>PDF
        </h1>
        <div className="flex gap-4 items-center">
          <h1 className=" text-2xl cursor-pointer font-bold hover:scale-125 duration-300 text-black dark:text-white">
            Home
          </h1>

            <ThemeBtn/>
         

         </div>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default Navbar;
