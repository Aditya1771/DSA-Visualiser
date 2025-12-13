import { useState, useEffect } from "react";
import { Moon, Sun, Terminal, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../Stores/slice";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // --- SUB-COMPONENTS ---

  const NavLink = ({ to, label }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link to={to} className="relative group px-1">
        <motion.div
          whileHover={{ y: -2 }}
          className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 z-10
            ${isActive 
               ? (isDark ? "text-white" : "text-slate-900") 
               : (isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-purple-700")
            }
          `}
        >
          {label}

          {/* Active State Indicator (Glowing Dot) */}
          {isActive && (
            <motion.div
              layoutId="active-nav-indicator"
              className={`absolute -bottom-2 left-0 right-0 mx-auto w-1 h-1 rounded-full
                ${isDark ? "bg-purple-400 shadow-[0_0_10px_#a855f7]" : "bg-purple-600"}
              `}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  const Divider = () => (
    <div className={`h-3 w-[1.5px] rounded-full opacity-20 mx-1
      ${isDark ? "bg-white" : "bg-black"}
    `} />
  );

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`
            relative flex items-center justify-between w-full max-w-5xl pl-2 pr-2 py-2 rounded-full border backdrop-blur-2xl transition-all duration-500
            ${isDark 
              ? "bg-[#050505]/80 border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]" 
              : "bg-white/80 border-white/60 shadow-[0_20px_40px_-10px_rgba(100,100,111,0.1)] ring-1 ring-white/50"
            }
          `}
        >
          
          {/* --- LEFT: BRAND --- */}
          <Link to="/" className="flex items-center gap-3 pl-2 group">
            {/* <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className={`
                p-2.5 rounded-full transition-all duration-300
                ${isDark 
                  ? "bg-white/5 border border-white/5 group-hover:border-purple-500/30 group-hover:bg-purple-500/10" 
                  : "bg-slate-50 border border-slate-100 group-hover:border-purple-200 group-hover:bg-purple-50"}
              `}
            >
              <Terminal size={18} className={`transition-colors ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            </motion.div> */}
            
            <span className={`text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r 
              ${isDark 
                ? "from-white via-purple-200 to-indigo-200" 
                : "from-slate-900 via-purple-700 to-indigo-600"}
            `}>
              AlgoArena
            </span>
          </Link>

          {/* --- CENTER: DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-transparent">
            <NavLink to="/algorithms" label="Visualizer" />
            <Divider />
            <NavLink to="/blogs" label="Blogs" />
          </div>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`
                w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                ${isDark 
                  ? "text-gray-400 hover:text-yellow-300 hover:bg-white/10" 
                  : "text-slate-400 hover:text-purple-600 hover:bg-slate-100"}
              `}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Desktop: Get Started Button */}
            <Link to="/auth" className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-6 py-2.5 rounded-full font-bold text-sm shadow-xl overflow-hidden group
                  ${isDark 
                    ? "bg-white text-black shadow-purple-500/20" 
                    : "bg-[#0f172a] text-white shadow-purple-900/20"
                  }
                `}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.2s_infinite]" />
                <span className="relative flex items-center gap-2">
                  Get Started
                </span>
              </motion.button>
            </Link>

            {/* Mobile: Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full
                ${isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"}
              `}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
            
          </div>
        </motion.nav>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed top-24 left-4 right-4 z-40 rounded-3xl p-4 border backdrop-blur-3xl shadow-2xl md:hidden
              ${isDark 
                ? "bg-[#111]/90 border-white/10 shadow-purple-900/20" 
                : "bg-white/90 border-white/60 shadow-xl"
              }
            `}
          >
            <div className="flex flex-col gap-2">
              <Link to="/algorithms" className={`p-4 rounded-2xl font-medium transition-colors ${isDark ? "hover:bg-white/10 text-gray-200" : "hover:bg-slate-50 text-slate-800"}`}>
                Visualizer
              </Link>
              <Link to="/blogs" className={`p-4 rounded-2xl font-medium transition-colors ${isDark ? "hover:bg-white/10 text-gray-200" : "hover:bg-slate-50 text-slate-800"}`}>
                Blogs
              </Link>
              <div className={`h-[1px] w-full my-2 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
              <Link to="/auth">
                <button className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}