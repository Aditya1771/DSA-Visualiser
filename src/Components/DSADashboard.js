import React, { useState } from "react";
import {
  List, ArrowUpDown, Search, Rows, Link2,
  Layers, ListOrdered, TreePine, Network, SquareStack, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router";
import { dsaAlgorithms } from "./Utils/dsaalgo.js";
import { algoDescriptions } from "./Utils/AlgoDescription";


const categories = [
  // ... (category data remains the same)
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

const DSADashboard = () => {
  const [activeCategory, setActiveCategory] = useState("All Algorithms");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredAlgorithms = dsaAlgorithms.filter((algo) => {
    const matchesCategory = activeCategory === "All Algorithms" || algo.category === activeCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- REFACTORED ALGORITHM CARD ---
  const AlgorithmCard = ({ algo, index }) => {
    const IconComp = getCategoryIcon(algo.category);

    return (
      <div
        className="
          group relative flex flex-col justify-between overflow-hidden
          h-80 p-6 rounded-2xl bg-slate-900 
          border border-slate-800 
          transition-all duration-300 ease-in-out
          hover:border-blue-500/40 hover:-translate-y-2
          hover:shadow-2xl hover:shadow-blue-900/50
          animate-fadeInUp will-change-transform"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Decorative background glow that appears on hover */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-900/50 to-purple-900/50 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        
        {/* Content container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Top Section */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-slate-800/70 border border-slate-700 rounded-lg">
                <IconComp className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-full">
                {algo.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{algo.name}</h3>
          </div>

          {/* Middle Section (Description) - This part will grow */}
          <div className="flex-grow">
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
              {algoDescriptions[algo.name] || "Explore this algorithm's visualization."}
            </p>
          </div>

          {/* Bottom Section (Button) */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate(`/algorithms/${algo.name}`)}
              className="w-full mt-4 px-4 py-3 rounded-lg 
              flex items-center justify-center gap-2
              bg-gradient-to-r from-blue-500 to-purple-600 
              text-white font-semibold shadow-lg 
              hover:shadow-blue-500/40
              scale-100 group-hover:scale-105 
              transition-all duration-300 ease-in-out"
            >
              Visualize
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="px-4 sm:px-6 lg:px-8">
       
        {/* ... (Header and search section remains the same) ... */}
        <div className="text-center py-10 pt-34 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
            Visualizer Dashboard
          </h1>

          {/* Search Bar */}
          <div className="relative w-full md:w-200 mx-auto mt-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-12 py-3 rounded-lg bg-gray-800/90 border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform
                flex items-center gap-2 border-2
                ${activeCategory === cat.name
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 text-white shadow-lg scale-105"
                    : "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/80 hover:border-blue-400 hover:text-blue-300 hover:shadow-lg hover:scale-105"
                  }`}
              >
                <cat.icon className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        {/* --- UPDATED ALGORITHM GRID --- */}
        <h2 className="text-2xl font-bold mb-6 text-blue-400 border-t border-gray-800 pt-8">{activeCategory}</h2>
        {filteredAlgorithms.length > 0 ? (
          // Increased gap for more breathing room between the larger cards
         <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12 justify-items-center">
            {filteredAlgorithms.map((algo, index) => (
            <AlgorithmCard key={algo.name} algo={algo} index={index} />
             ))}
         </div>

        ) : (
          // ... (No results component remains the same) ...
          <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700 animate-fadeIn">
            <h3 className="text-xl font-medium text-gray-300 mb-2">No Algorithms Found</h3>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All Algorithms");
              }}
              className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors font-semibold duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DSADashboard;