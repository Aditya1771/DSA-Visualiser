import React, { useState } from "react";
import {
  List, ArrowUpDown, Search, Rows, Link2,
  Layers, ListOrdered, TreePine, Network, SquareStack, ArrowRight,
  Sparkles, Home, ChevronRight, LayoutGrid
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { dsaAlgorithms } from "./Utils/dsaalgo.js"; 
import { algoDescriptions } from "./Utils/AlgoDescription"; 

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
  hover: {
    y: -6,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    x: [0, 50, 0],
    y: [0, -50, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

// --- DATA ---
const categories = [
  { name: "All Algorithms", icon: List },
  { name: "Sorting", icon: ArrowUpDown },
  { name: "Searching", icon: Search },
  { name: "Array", icon: SquareStack },
  { name: "General", icon: Rows },
  { name: "Linked List", icon: Link2 },
  { name: "Stack", icon: Layers },
  { name: "Queue", icon: ListOrdered },
  { name: "Tree", icon: TreePine },
  { name: "Graph Algorithm", icon: Network },
];

const getCategoryIcon = (categoryName) => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.icon : Rows;
};

// --- MAIN COMPONENT ---
const DSADashboard = () => {
  const [activeCategory, setActiveCategory] = useState("All Algorithms");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";

  const filteredAlgorithms = dsaAlgorithms.filter((algo) => {
    const matchesCategory = activeCategory === "All Algorithms" || algo.category === activeCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white
      ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}
    >
      {/* =========================================
          BACKGROUND SYSTEM
      ========================================= */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 
        ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
       
        {/* =========================================
            HEADER SECTION (Path + Title Aligned)
        ========================================= */}
        <div className="relative mb-13">
          
          {/* BREADCRUMBS (Absolute Left on Desktop to align with center content) */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-center relative">
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1 flex items-center gap-3 text-sm font-medium"
            >
              <Link 
                to="/" 
                className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5
                  ${isDark ? "text-gray-500 hover:text-white" : "text-slate-400 hover:text-purple-600"}
                `}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              <ChevronRight className={`w-4 h-4 ${isDark ? "text-gray-700" : "text-slate-300"}`} />
              
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md cursor-default
                ${isDark 
                  ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" 
                  : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}
              `}>
                <LayoutGrid className={`w-3.5 h-3.5 ${isDark ? "text-purple-400" : "text-purple-600"}`}/>
                <span>Dashboard</span>
              </div>
            </motion.div>

            {/* CENTER CONTENT (Badge + Title) */}
            <div className="text-center w-full">
              

              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-4xl md:text-5xl font-black tracking-tight mb-8
                ${isDark ? "text-white" : "text-slate-900"}
                `}
              >
                Algorithm <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Explorer</span>
              </motion.h1>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative w-full max-w-lg mx-auto mb-8"
          >
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none 
              ${isDark ? "text-gray-500" : "text-slate-400"}`}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search Quick Sort, BFS, Trees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium border backdrop-blur-xl transition-all duration-300 focus:outline-none 
              ${isDark 
                ? "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                : "bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-xl shadow-slate-200/60 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20"}
              `}
            />
          </motion.div>

          {/* Categories */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.name}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-300 flex items-center gap-1.5 backdrop-blur-md
                ${activeCategory === cat.name
                    ? (isDark 
                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                        : "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20")
                    : (isDark 
                        ? "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white" 
                        : "bg-white/60 border-slate-200 text-slate-500 hover:bg-white hover:text-purple-600 hover:border-purple-200 hover:shadow-md")
                  }`}
              >
                <cat.icon className="w-3 h-3" />
                {cat.name}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* =========================================
            ALGORITHM GRID
        ========================================= */}
        <div className={`flex items-center justify-between mb-6 pb-2 border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
           <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-400" : "text-slate-500"}`}>
             {activeCategory}
           </h2>
           {/* Item Count Tag - Purple Theme */}
           <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono border backdrop-blur-sm
             ${isDark 
               ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]" 
               : "bg-purple-50 text-purple-700 border-purple-200 shadow-sm"}
           `}>
             {filteredAlgorithms.length} AVAILABLE
           </span>
        </div>

        {filteredAlgorithms.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredAlgorithms.map((algo, index) => {
                 const IconComp = getCategoryIcon(algo.category);
                 return (
                  <motion.div
                    key={algo.name}
                    variants={cardVariants}
                    whileHover="hover"
                    className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 h-[240px]
                      ${isDark 
                        ? "bg-[#0A0A0A]/60 border-white/5 hover:border-purple-500/30 backdrop-blur-md" 
                        : "bg-white/80 border-slate-100 hover:border-purple-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-purple-500/5 backdrop-blur-2xl"}
                    `}
                  >
                     {/* Hover Glow Background - Purple/Gradient */}
                     <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl
                       ${isDark 
                         ? "bg-gradient-to-br from-purple-900/10 via-transparent to-transparent" 
                         : "bg-gradient-to-br from-purple-50/50 via-transparent to-transparent"}
                     `} />

                    {/* Top: Header */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        {/* Icon Container - Purple Hover */}
                        <div className={`p-2 rounded-lg border transition-colors
                          ${isDark 
                            ? "bg-white/5 border-white/10 group-hover:bg-purple-500/10 group-hover:border-purple-500/20" 
                            : "bg-slate-50 border-slate-100 group-hover:bg-white group-hover:border-purple-100 group-hover:shadow-sm"}`}>
                          <IconComp className={`w-4 h-4 transition-colors ${isDark ? "text-slate-400 group-hover:text-purple-400" : "text-slate-500 group-hover:text-purple-600"}`} />
                        </div>
                        
                        {/* CATEGORY TAG - **GLOSSY GREEN (EMERALD)** ONLY HERE */}
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-sm
                          ${isDark 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]" 
                            : "bg-emerald-50/80 border-emerald-200 text-emerald-700 shadow-sm"}
                        `}>
                          {algo.category}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className={`text-base font-bold mb-1.5 group-hover:translate-x-0.5 transition-transform
                        ${isDark ? "text-white" : "text-slate-800"}`}>
                        {algo.name}
                      </h3>
                      
                      {/* Description */}
                      <p className={`text-[11px] leading-relaxed line-clamp-3
                        ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                        {algoDescriptions[algo.name] || "Explore the inner workings of this algorithm with our step-by-step 3D visualizer."}
                      </p>
                    </div>

                    {/* Bottom: Button - Purple Hover */}
                    <div className="relative z-10 mt-2">
                      <button
                        onClick={() => navigate(`/algorithms/${algo.name}`)}
                        className={`w-full py-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 border
                          ${isDark 
                            ? "bg-white/5 border-white/10 text-white hover:bg-white hover:text-black hover:border-white" 
                            : "bg-white border-slate-200 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-lg hover:shadow-purple-200"}
                        `}
                      >
                        Visualize
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        ) : (
          // --- EMPTY STATE ---
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className={`col-span-full flex flex-col items-center justify-center py-16 rounded-3xl border border-dashed backdrop-blur-sm
              ${isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-300"}
            `}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3
              ${isDark ? "bg-white/10 text-gray-400" : "bg-white border border-slate-200 text-slate-400 shadow-sm"}`}>
              <Search className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>No Algorithms Found</h3>
            <p className={`text-xs mb-4 ${isDark ? "text-gray-500" : "text-slate-500"}`}>
              No matches for "{searchTerm}" in {activeCategory}.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All Algorithms");
              }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg
                ${isDark 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200"}
              `}
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DSADashboard;