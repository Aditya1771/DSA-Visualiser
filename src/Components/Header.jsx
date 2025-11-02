import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../Stores/slice";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlgorithms, setFilteredAlgorithms] = useState([]);

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.value);

  return (
    <div
      className="fixed top-4 w-[98%] max-w-7xl left-1/2 -translate-x-1/2 z-50 
      bg-gray-900/50 backdrop-blur-md border border-gray-700 
      rounded-2xl shadow-lg animate-fade-in"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-3 gap-3">

        {/* Logo */}
        <div>
          <Link to="/">
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-wide 
              text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500
              animate-gradient bg-[length:200%_200%]"
            >
              AlgoArena
            </h1>
          </Link>
          <h2 className="italic text-gray-400 text-xs md:text-sm">
            Visual learning for smarter coding
          </h2>
        </div>

        {/* Nav + Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4">

          {/* Visualiser */}
          <Link
            to="/algorithms"
            className="px-4 py-2 rounded-lg text-gray-300 font-medium 
            transition-all duration-500
            hover:text-pink-400 hover:bg-pink-500/20 
            hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]"
          >
            Visualiser
          </Link>

          {/* Blogs */}
          <Link
            to="/blogs"
            className="px-4 py-2 rounded-lg text-gray-300 font-medium 
            transition-all duration-500
            hover:text-purple-400 hover:bg-purple-500/20 
            hover:shadow-[0_0_15px_rgba(147,51,234,0.7)]"
          >
            Blogs
          </Link>

          {/* Auth Button */}
          <Link
            to="/auth"
            className="px-5 py-2 font-medium rounded-xl text-white
            bg-gradient-to-r from-pink-600 to-purple-600
            hover:from-pink-500 hover:to-purple-500
            transition-all duration-500 hover:scale-105 
            hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]"
          >
            Login / Sign Up
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-full border border-gray-600 
            transition-all duration-500 hover:scale-110 hover:rotate-90"
          >
            {theme === "dark" ? (
              <Sun className="w-6 h-6 text-yellow-400 animate-pulse" />
            ) : (
              <Moon className="w-6 h-6 text-gray-200 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
