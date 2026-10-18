import { useState, useEffect } from "react";
import { Moon, Sun, Terminal, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../Stores/slice";
import { logoutUser } from "../Stores/authSlice"; // Import logout thunk
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.value);
  
  // --- NEW: Auth State ---
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const isDark = theme === "dark";
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

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
            <span className={`text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r 
              ${isDark 
                ? "from-white via-purple-200 to-indigo-200" 
                : "from-slate-900 via-purple-700 to-indigo-600"}
            `}>
              AlgoArena
            </span>
          </Link>

          {/* --- CENTER: NAVIGATION --- */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-transparent">
            <NavLink to={isAuthenticated ? "/dashboard" : "/"} label="Visualizer" />
            <Divider />
            <NavLink to="/blogs" label="Blogs" />
          </div>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                ${isDark ? "text-gray-400 hover:text-yellow-300 hover:bg-white/10" : "text-slate-400 hover:text-purple-600 hover:bg-slate-100"}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={theme} initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.15 }}>
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* --- NEW: AUTHENTICATED STATE --- */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                {/* Streak Badge */}
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-xs font-black shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                >
                   🔥 {user?.currentStreak || 0}
                </motion.div>

                {/* Profile Link */}
                <Link to="/profile">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group">
                    <img 
                      src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}&background=a855f7&color=fff`} 
                      alt="Profile" 
                      className={`w-9 h-9 rounded-full object-cover border-2 ${isDark ? 'border-white/10 group-hover:border-purple-500' : 'border-slate-200 group-hover:border-purple-600'} transition-colors`}
                    />
                  </motion.div>
                </Link>

                {/* Logout Button */}
                <button 
                   onClick={handleLogout}
                   className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-600'}`}
                   title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              /* --- GUEST STATE --- */
              <Link to="/login" className="hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-2.5 rounded-full font-bold text-sm shadow-xl overflow-hidden group ${isDark ? "bg-white text-black" : "bg-[#0f172a] text-white"}`}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.2s_infinite]" />
                  <span className="relative">Get Started</span>
                </motion.button>
              </Link>
            )}

            {/* Mobile: Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full ${isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"}`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-4 right-4 z-40 rounded-3xl p-6 border backdrop-blur-3xl shadow-2xl md:hidden ${isDark ? "bg-[#111]/95 border-white/10" : "bg-white/95 border-slate-200"}`}
          >
            <div className="flex flex-col gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-3 text-lg font-medium p-2">Visualizer</Link>
              <Link to="/blogs" className="flex items-center gap-3 text-lg font-medium p-2">Blogs</Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="flex items-center gap-3 text-lg font-medium p-2"><UserIcon size={20}/> Profile</Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-medium p-2 text-red-500"><LogOut size={20}/> Logout</button>
                </>
              )}
              {!isAuthenticated && (
                <Link to="/login" className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 text-center">Get Started</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}