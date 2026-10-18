import { useState, useEffect, useCallback, useRef,useLayoutEffect ,useMemo} from "react";
import { 
  Trophy, Zap, ArrowRight, Sparkles, Loader2, BrainCircuit, Check, X, Info, Copy,
  Home, ChevronRight, LayoutGrid, Brain, ArrowUpNarrowWide, BarChart3, Settings2, 
  Play, Pause, SkipBack, SkipForward, RotateCcw, Wand2, Activity, 
  ArrowUpDown, ArrowLeftRight, RotateCw, ArrowDownWideNarrow, Clock, Scan,
  Maximize, CheckCircle2, XCircle, Share2, Code2, Download,Binary,
  MessageSquare, Terminal, Printer, Trash2, Bug, HelpCircle,Search, Info, Wand2,Layout,Target,Fingerprint
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; 
import { useNavigate } from "react-router"; 
import { motion, AnimatePresence } from "framer-motion";
import { completeAlgorithm } from '../../Stores/authSlice';
import QuizArena from "../Utils/QuizArena";
import Editor from "@monaco-editor/react";
import PremiumCodeReference from "../Utils/PremiumCodeReference";
import SortingLogView from "../Utils/SortingLogView";
import GlossyButton from "../Utils/GlossyButton";
import SearchingControls from "../Utils/SearchingControl";



const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

// Breadcrumb

const Breadcrumb = ({ isDark }) => (
  <nav aria-label="Breadcrumb">
    <ol className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
      <li><a href="/" className="flex items-center gap-2 hover:text-purple-600"><Home size={16} /><span>Home</span></a></li>
      <li><ChevronRight size={14} /></li>
      <li><a href="/algorithms" className="flex items-center gap-2 hover:text-purple-600"><LayoutGrid size={16} /><span>Dashboard</span></a></li>
      <li><ChevronRight size={14} /></li>
      <li>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border backdrop-blur-md ${isDark ? "bg-white/5 border-white/10 text-white shadow-lg" : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}>
          <Search size={16} className="text-purple-500" />
          <span className="font-semibold">Linear Search</span>
        </div>
      </li>
    </ol>
  </nav>
);

// ExampleCell Component

const WalkthroughStep = ({
  array,
  target,
  comparingIndex,
  foundIndex,
  description,
  isFinished,
  isDark
}) => {
  const getItemClass = (index, value) => {
    let classes = 'relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg shadow-lg transition-all duration-300 ease-in-out border-2 ';

    const isCurrentlyComparing = comparingIndex === index;
    const isTargetFound = foundIndex === index;

    if (isTargetFound) {
      // Element found - Emerald Green
      classes += 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white transform scale-110 shadow-green-500/40 ';
    } else if (isCurrentlyComparing) {
      // Current Comparison - Amber/Yellow
      classes += 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 transform -translate-y-2 scale-105 shadow-amber-500/40 ';
    } else if (isFinished && foundIndex === null) {
      // Search finished, not found - Muted Gray
      classes += isDark ? 'bg-gray-800 border-gray-700 text-gray-500 opacity-40 ' : 'bg-slate-200 border-slate-300 text-slate-400 opacity-40 ';
    } else {
      // Default - Bubble Sort Purple/Indigo
      classes += isDark 
        ? 'bg-gradient-to-br from-purple-900 to-indigo-950 border-purple-800 text-purple-300 ' 
        : 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400 text-white ';
    }
    return classes;
  };

  const containerClasses = `flex flex-col items-center gap-6 p-6 rounded-2xl border transition-all duration-300 ${
    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
  }`;

  return (
    <div className={containerClasses}>
      <div className="w-full text-center">
        <p className={`text-sm md:text-base leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
          {description}
        </p>
      </div>

      <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-2">
          {array.map((val, idx) => (
            <div key={`array-${idx}`} className={getItemClass(idx, val)}>
              {val}
              {comparingIndex === idx && !isFinished && (
                 <div className="absolute -top-8 animate-bounce text-amber-500">
                    <Fingerprint size={20} />
                 </div>
              )}
            </div>
          ))}
      </div>

      {target !== undefined && (
        <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl border mt-2 ${
          isDark ? 'bg-teal-500/10 border-teal-500/20' : 'bg-teal-50 border-teal-200'
        }`}>
          <Target size={16} className="text-teal-500" />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
            Searching For:
          </span>
          <div className="text-xl font-black text-teal-500">
            {target}
          </div>
        </div>
      )}
    </div>
  );
};



// UI Section Components


// AnimatedNumber
const AnimatedNumber = ({ value }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const prevValueRef = useRef(value);
    useEffect(() => {
      const previousValue = prevValueRef.current;
      let startTime;
      const animationDuration = 300; 
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / animationDuration, 1);
        const nextValue = Math.floor(previousValue + (value - previousValue) * percentage);
        setCurrentValue(nextValue);
        if (progress < animationDuration) requestAnimationFrame(animate);
        else { setCurrentValue(value); prevValueRef.current = value; }
      };
      requestAnimationFrame(animate);
      return () => { prevValueRef.current = value; };
    }, [value]);
    return <>{currentValue}</>;
};



const ComplexityDisplay = ({ complexity, isDark }) => {
  const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const titleClass = isDark ? "text-gray-300" : "text-slate-700";
  return (
    <section className={`${cardClass} rounded-xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20`}>
      <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}><BarChart3 className="w-5 h-5 text-purple-500" />Complexity Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3 rounded-lg border border-indigo-700/50">
          <h3 className="flex items-center gap-2 text-xs text-indigo-400 mb-1"><Target className="w-4 h-4"/>Current Target</h3>
          <span className="text-xl font-bold text-indigo-400"><AnimatedNumber value={complexity.target || 0} /></span>
        </div>
        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3 rounded-lg border border-pink-700/50">
          <h3 className="flex items-center gap-2 text-xs text-pink-400 mb-1"><Activity className="w-4 h-4"/>Comparisons</h3>
          <span className="text-xl font-bold text-pink-400"><AnimatedNumber value={complexity.comparisons} /></span>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-3 rounded-lg border border-purple-700/50">
          <h3 className="flex items-center gap-2 text-xs text-purple-400 mb-1"><Clock className="w-4 h-4"/>Efficiency</h3>
          <span className="text-xl font-bold text-purple-400">O(N)</span>
        </div>
      </div>
    </section>
  );
};

// Visualisation Area
// ⭐ NEW FULLY-UPGRADED LINEAR SEARCH VISUALIZATION AREA ⭐
// Matches insertion-sort visual quality, animations, and message-box system.

const VisualizationArea = ({ array, steps, currentStep, target, isDark }) => {
  const [elementPositions, setElementPositions] = useState({});
  const [overlay, setOverlay] = useState({ show: false, type: "", message: "", x1: 0, midX: 0, y: 0 });
  const [overlayPos, setOverlayPos] = useState({ clampedMidX: 0, opacity: 0 });
  const containerRef = useRef(null);
  const messageBoxRef = useRef(null);
  const elementWidth = 64;
  const elementGap = 8;
  const elementHeight = 64;
  const lift = 40;
  const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

  const foundIndex = useMemo(() => steps.slice(0, currentStep + 1).find(s => s.type === "found")?.index ?? null, [steps, currentStep]);
  const activeIndex = steps[currentStep]?.index ?? null;

  useEffect(() => {
    const pos = {};
    array.forEach((it, i) => (pos[it.id] = i));
    setElementPositions(pos);
  }, [array]);

  useEffect(() => {
    const step = steps[currentStep];
    if (!step) return;
    const center = totalWidth / 2;
    const getX = (idx) => idx * (elementWidth + elementGap) + elementWidth / 2;
    if (step.type === "start") setOverlay({ show: true, type: "start", message: `🔍 Searching for ${target}...`, x1: center, midX: center, y: elementHeight / 2 });
    else if (step.type === "compare") setOverlay({ show: true, type: "compare", message: `Comparing ${array[step.index]?.value} == ${target}?`, x1: getX(step.index), midX: getX(step.index), y: (elementHeight / 2) - lift });
    else if (step.type === "found") setOverlay({ show: true, type: "found", message: `🎯 Found ${target} at Index ${step.index}!`, x1: getX(step.index), midX: getX(step.index), y: (elementHeight / 2) - lift });
    else if (step.type === "notfound") setOverlay({ show: true, type: "notfound", message: `❌ ${target} not found.`, x1: center, midX: center, y: elementHeight / 2 });
    else if (step.type === "finish") setOverlay({ show: true, type: foundIndex !== null ? "found" : "notfound", message: foundIndex !== null ? "Search Complete — Element Found" : "Search Complete — Target Missing", x1: foundIndex !== null ? getX(foundIndex) : center, midX: foundIndex !== null ? getX(foundIndex) : center, y: elementHeight / 2 });
  }, [currentStep, steps, array, target, totalWidth, foundIndex]);

  useLayoutEffect(() => {
    if (overlay.show && messageBoxRef.current && containerRef.current) {
        const msgWidth = messageBoxRef.current.offsetWidth;
        const clampedMidX = Math.max(msgWidth/2 + 10, Math.min(overlay.midX, totalWidth - msgWidth/2 - 10));
        setOverlayPos({ clampedMidX, opacity: 1 });
    } else setOverlayPos({ clampedMidX: 0, opacity: 0 });
  }, [overlay, totalWidth]);

  const getAbsoluteX = (relX) => containerRef.current ? ((containerRef.current.getBoundingClientRect().width - totalWidth) / 2) + relX : 0;
  const getAbsoluteY = (relY) => containerRef.current ? (containerRef.current.getBoundingClientRect().height / 2) + relY : 0;

  return (
    <section className={`rounded-xl p-8 border h-full flex flex-col min-h-[32rem] relative overflow-hidden backdrop-blur-md ${isDark ? "bg-[#0A0A0A]/60 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />
      <h2 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${isDark ? "text-gray-300" : "text-slate-700"}`}><Activity className="w-4 h-4 text-purple-500" />Sequential Scan Engine</h2>
      <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-visible">
        <AnimatePresence>
          {overlay.show && (
            <motion.div ref={messageBoxRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute z-50 pointer-events-none"
              style={{ top: getAbsoluteY(overlay.y - lift - 100), left: getAbsoluteX(overlayPos.clampedMidX), transform: "translateX(-50%)" }}>
              <div className={`px-4 py-2 rounded-xl border shadow-2xl text-sm font-bold backdrop-blur-xl ${overlay.type === 'found' ? "bg-green-500 border-green-400 text-white" : overlay.type === 'notfound' ? "bg-red-500 border-red-400 text-white" : "bg-purple-600 border-purple-400 text-white"}`}>
                {overlay.message}<div className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-inherit rotate-45 -translate-x-1/2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {overlay.show && messageBoxRef.current && (
             <motion.path d={`M ${getAbsoluteX(overlayPos.clampedMidX)} ${getAbsoluteY(overlay.y - lift - 100) + 40} C ${getAbsoluteX(overlayPos.clampedMidX)} ${getAbsoluteY(overlay.y - lift - 100) + 70}, ${getAbsoluteX(overlay.x1)} ${getAbsoluteY(overlay.y - 40)}, ${getAbsoluteX(overlay.x1)} ${getAbsoluteY(overlay.y - 10)}`} stroke={overlay.type === 'found' ? "#4ade80" : "#a855f7"} strokeWidth="2" fill="none" strokeDasharray="5,5" />
          )}
        </svg>
        <div className="relative flex gap-[8px]" style={{ width: totalWidth }}>
          {array.map((item, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < (activeIndex ?? array.length) && foundIndex === null;
            return (
              <motion.div key={item.id} layout className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-all duration-500 ${idx === foundIndex ? "bg-green-500 border-green-300 text-white scale-110 shadow-lg" : isActive ? "bg-purple-600 border-purple-400 text-white -translate-y-6 shadow-xl" : isPast ? "opacity-30 grayscale" : isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                {item.value}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className={`mt-4 flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-slate-400"}`}>
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Unchecked</span>
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-600"></span> Scanning</span>
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Found</span>
      </div>
    </section>
  );
};

const WalkthroughStepComp = ({ array, target, comparingIndex, foundIndex, description, isFinished, isDark }) => {
  const getItemClass = (index, value) => {
    let classes = 'relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg shadow-lg transition-all duration-300 ease-in-out border-2 ';
    const isCurrentlyComparing = comparingIndex === index;
    const isTargetFound = foundIndex === index;
    if (isTargetFound) classes += 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white transform scale-110 shadow-green-500/40 ';
    else if (isCurrentlyComparing) classes += 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 transform -translate-y-2 scale-105 shadow-amber-500/40 ';
    else if (isFinished && foundIndex === null) classes += isDark ? 'bg-gray-800 border-gray-700 text-gray-500 opacity-40 ' : 'bg-slate-200 border-slate-300 text-slate-400 opacity-40 ';
    else classes += isDark ? 'bg-gradient-to-br from-purple-900 to-indigo-950 border-purple-800 text-purple-300 ' : 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400 text-white ';
    return classes;
  };
  return (
    <div className={`flex flex-col items-center gap-6 p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
      <div className="w-full text-center"><p className={`text-sm md:text-base leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{description}</p></div>
      <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-2">{array.map((val, idx) => (<div key={idx} className={getItemClass(idx, val)}>{val}{comparingIndex === idx && !isFinished && (<div className="absolute -top-8 animate-bounce text-amber-500"><Fingerprint size={20} /></div>)}</div>))}</div>
      {target !== undefined && (<div className={`flex items-center gap-3 px-5 py-2 rounded-2xl border mt-2 ${isDark ? 'bg-teal-500/10 border-teal-500/20' : 'bg-teal-50 border-teal-200'}`}><Target size={16} className="text-teal-500" /><span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>Searching For:</span><div className="text-xl font-black text-teal-500">{target}</div></div>)}
    </div>
  );
};


// --- REFERENCE CODE DATA ---
const LINEAR_SEARCH_CODE = {
    javascript: `/**
 * LINEAR SEARCH - JAVASCRIPT
 * Sequentially checks each element of the list until a match is found.
 */

function linearSearch(arr, target) {
    // Iterate through the entire array
    for (let i = 0; i < arr.length; i++) {
        // Check if the current element matches the target
        if (arr[i] === target) {
            // Return the index if found
            return i;
        }
    }
    // Return -1 if the target is not in the array
    return -1;
}

// --- MAIN EXECUTION ---
const data = [10, 50, 30, 70, 80, 60, 20, 90, 40];
const target = 30;

console.log("Array:", data);
console.log("Searching for:", target);

const result = linearSearch(data, target);

if (result !== -1) {
    console.log(\`Element found at index: \${result}\`);
} else {
    console.log("Element not found in the array.");
}`,

    python: `"""
LINEAR SEARCH - PYTHON
A simple search algorithm that passes through a list item by item.
"""

def linear_search(arr, target):
    # Loop through the indices of the list
    for i in range(len(arr)):
        # If the element at the current index matches target
        if arr[i] == target:
            return i  # Return the index
            
    return -1  # Target not found

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    data = [10, 50, 30, 70, 80, 60, 20, 90, 40]
    target = 30
    
    print(f"List: {data}")
    print(f"Searching for: {target}")
    
    result = linear_search(data, target)
    
    if result != -1:
        print(f"Element found at index: {result}")
    else:
        print("Element not found in the list.")`,

    cpp: `/**
 * LINEAR SEARCH - C++
 * Uses a basic loop to traverse a vector and find a target value.
 */

#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    // Iterate through the vector using size_t for safe indexing
    for (int i = 0; i < arr.size(); i++) {
        // Compare current element with target
        if (arr[i] == target) {
            return i; // Found target, return index
        }
    }
    return -1; // Not found
}

// --- MAIN EXECUTION ---
int main() {
    std::vector<int> data = {10, 50, 30, 70, 80, 60, 20, 90, 40};
    int target = 30;
    
    std::cout << "Searching for " << target << " in array...\\n";
    
    int result = linearSearch(data, target);
    
    if (result != -1) {
        std::cout << "Element found at index: " << result << std::endl;
    } else {
        std::cout << "Element not found." << std::endl;
    }
    
    return 0;
}`,

    java: `/**
 * LINEAR SEARCH - JAVA
 * A standard implementation within a class structure.
 */

import java.util.Arrays;

public class Main {
    
    // Linear Search Logic
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i; // Return index of match
            }
        }
        return -1; // Match not found
    }

    // --- MAIN EXECUTION ---
    public static void main(String[] args) {
        int[] data = {10, 50, 30, 70, 80, 60, 20, 90, 40};
        int target = 30;
        
        System.out.println("Array: " + Arrays.toString(data));
        
        int result = linearSearch(data, target);
        
        if (result != -1) {
            System.out.println("Element found at index: " + result);
        } else {
            System.out.println("Element not found.");
        }
    }
}`,

    c: `/**
 * LINEAR SEARCH - C
 * Procedural search through an integer array.
 */

#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    // Standard loop to check each element
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Found
        }
    }
    return -1; // Not found
}

// --- MAIN EXECUTION ---
int main() {
    int data[] = {10, 50, 30, 70, 80, 60, 20, 90, 40};
    int n = sizeof(data) / sizeof(data[0]);
    int target = 30;
    
    printf("Searching for %d...\\n", target);
    
    int result = linearSearch(data, n, target);
    
    if (result != -1) {
        printf("Element found at index: %d\\n", result);
    } else {
        printf("Element not found.\\n");
    }
    
    return 0;
}`
};


// 2. Define the complexity stats
const LINEAR_SEARCH_STATS = {
    time: "O(n)",
    space: "O(1)",
    bestCase: "O(1)",
    type: "Sequential Search"
};


// INteractive graph

const InteractiveComplexityGraph = ({ isDark }) => {
  const [hoverData, setHoverData] = useState(null);
  const [animate, setAnimate] = useState(false);
  const graphRef = useRef(null);

  const maxN = 25;
  const maxOps = maxN + 5; 
  const padding = { top: 40, right: 80, bottom: 50, left: 60 };

  const [size, setSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (graphRef.current) {
      const resize = () => {
        setSize({
          width: graphRef.current.offsetWidth,
          height: graphRef.current.offsetHeight,
        });
      };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        } else {
          setAnimate(false); 
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;

  const nToX = (n) =>
    padding.left +
    ((n - 1) / (maxN - 1)) * (width - padding.left - padding.right);

  const opsToY = (ops) =>
    height -
    padding.bottom -
    (ops / maxOps) * (height - padding.top - padding.bottom);

  const xToN = (x) =>
    Math.round(
      1 +
        ((x - padding.left) / (width - padding.left - padding.right)) *
          (maxN - 1)
    );

  const handleMouseMove = (e) => {
    const rect = graphRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < padding.left || x > width - padding.right || y < padding.top || y > height - padding.bottom) {
      setHoverData(null);
      return;
    }

    const n = xToN(x);
    if (n >= 1 && n <= maxN) {
      setHoverData({
        n,
        best: 1, 
        avg: Math.round(n ), 
        worst: n, 
        x: nToX(n),
        y, 
      });
    } else {
      setHoverData(null);
    }
  };

  const getPath = (fn) => {
    let pts = [];
    for (let n = 1; n <= maxN; n++) {
      pts.push(`${nToX(n)},${opsToY(fn(n))}`);
    }
    return `M ${pts.join(" L ")}`;
  };

  // Theme-based colors
  const axisColor = isDark ? "white" : "#475569";
  const gridColor = isDark ? "#4b5563" : "#cbd5e1";
  const textColor = isDark ? "#d1d5db" : "#475569";
  const containerClass = isDark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-slate-200 shadow-xl";
  const titleClass = isDark ? "text-gray-100" : "text-slate-800";
  const tooltipBg = isDark ? "black" : "white";

  return (
    <div className={`${containerClass} p-4 rounded-2xl border relative`}>
      <h3 className={`text-2xl font-bold text-center mb-4 ${titleClass}`}>
        Linear Search Time Complexity
      </h3>

      <div
        ref={graphRef}
        className="relative w-full h-[450px] cursor-crosshair" 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverData(null)}
      >
        <svg width={width} height={height}>
          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke={axisColor}
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke={axisColor}
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 5, 10, 15, 20, 25].map((val) => (
            <g key={val}>
              <text
                x={padding.left - 10}
                y={opsToY(val) + 4}
                textAnchor="end"
                className="text-xs"
                fill={textColor}
              >
                {val}
              </text>
              <line
                x1={padding.left}
                y1={opsToY(val)}
                x2={width - padding.right}
                y2={opsToY(val)}
                stroke={gridColor}
                strokeDasharray="3 3"
              />
            </g>
          ))}
          <text
            x="20"
            y={height / 2}
            transform={`rotate(-90 20 ${height / 2})`}
            textAnchor="middle"
            fill={textColor}
            className="font-medium"
          >
            Operations
          </text>

          {/* X-axis labels */}
          {[1, 5, 10, 15, 20, 25].map((val) => (
            <g key={val}>
              <text
                x={nToX(val)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-xs"
                fill={textColor}
              >
                {val}
              </text>
              <line
                x1={nToX(val)}
                y1={height - padding.bottom}
                x2={nToX(val)}
                y2={height - padding.bottom + 6}
                stroke={axisColor}
              />
            </g>
          ))}
          <text
            x={padding.left + (width - padding.left - padding.right) / 2}
            y={height - 10}
            textAnchor="middle"
            fill={textColor}
            className="font-medium"
          >
            Input Size (n)
          </text>

          {/* Curves */}
          <path
            d={getPath((n) => 1)} 
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
          <path
            d={getPath((n) => n)} 
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }}
          />
          <path
            d={getPath((n) => n)} 
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{ transition: "stroke-dashoffset 2s ease-out 1s" }}
          />

          <text x={nToX(maxN) + 5} y={opsToY(1) - 3} textAnchor="start" className="fill-green-400 text-xs">Best O(1)</text>
          <text x={nToX(maxN) + 5} y={opsToY(9.5*maxN/10) - 3} textAnchor="start" className="fill-blue-400 text-xs">Avg O(n)</text>
          <text x={nToX(maxN) + 5} y={opsToY(maxN) - 3} textAnchor="start" className="fill-red-400 text-xs">Worst O(n)</text>

          {/* Hover markers + tooltip */}
          {hoverData && (
            <g>
              <line
                x1={hoverData.x}
                y1={padding.top}
                x2={hoverData.x}
                y2={height - padding.bottom}
                stroke={axisColor}
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {[
                { y: opsToY(hoverData.best), color: "#22c55e" },
                { y: opsToY(hoverData.avg), color: "#3b82f6" },
                { y: opsToY(hoverData.worst), color: "#ef4444" }
              ].map((point, i) => (
                <circle
                  key={i}
                  cx={hoverData.x}
                  cy={point.y}
                  r={5}
                  fill={point.color}
                  stroke={tooltipBg}
                  strokeWidth="1.5"
                />
              ))}

              {(() => {
                const boxWidth = 120;
                const boxHeight = 70;
                let tooltipX = hoverData.x + 15;
                let tooltipY = opsToY(hoverData.worst) - boxHeight - 10;
                if (tooltipX + boxWidth > width - padding.right) tooltipX = hoverData.x - boxWidth - 15;
                tooltipX = Math.max(padding.left, tooltipX);
                if (tooltipY < padding.top) tooltipY = opsToY(hoverData.best) + 15;
                if (tooltipY + boxHeight > height - padding.bottom) tooltipY = height - padding.bottom - boxHeight;

                return (
                  <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                    <rect x="0" y="0" width={boxWidth} height={boxHeight} rx="6" fill={tooltipBg} stroke={gridColor} opacity="0.9" />
                    <text x="8" y="18" className="text-xs" fill={isDark ? "white" : "black"}>n = {hoverData.n}</text>
                    <text x="8" y="34" className="fill-green-500 text-xs">Best: {hoverData.best}</text>
                    <text x="8" y="48" className="fill-blue-500 text-xs">Avg: {hoverData.avg}</text>
                    <text x="8" y="62" className="fill-red-500 text-xs">Worst: {hoverData.worst}</text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};



const ExplanationTab = ({ isDark }) => {
  const walkthroughData = [
    { type: 'initial', array: [10, 50, 30, 70, 25, 60], target: 25, description: "The array is initialized. We are looking for '25'. Sequential scan begins at Index 0.", isSummary: true },
    { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 25, comparingIndex: 0, description: "Check Index 0: 10 is not 25. Moving to next index." },
    { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 25, comparingIndex: 4, foundIndex: 4, description: "Check Index 4: 25 matches the target! Search terminates with success.", isFinished: true },
    { type: 'final', array: [10, 50, 30, 70, 25, 60], target: 99, foundIndex: null, description: "Not Found Scenario: If we reach the end without a match, the algorithm returns -1.", isFinished: true },
  ];
  const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md shadow-2xl" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const sectionClasses = `${cardClass} p-8 md:p-10 rounded-3xl border transition-all duration-300 hover:-translate-y-1`;
  const textColor = isDark ? "text-gray-400" : "text-slate-500";
  const titleColor = isDark ? "text-white" : "text-slate-800";

  return (
    <section className="animate-fadeIn space-y-12 pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className={sectionClasses}>
          <h2 className="flex items-center justify-center gap-3 text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                                  <Search className="w-6 h-6 text-purple-400"/>What is Linear Search?
          </h2>          
          <p className={`text-center leading-relaxed text-lg max-w-4xl mx-auto ${textColor}`}>Linear Search (or Sequential Search) is the simplest method for finding an element within a list. It checks every item in order until a match is found or the list ends. It is the "brute force" approach to searching.</p>
        </div>
        
        <div className={sectionClasses}>
          <h3 className={`flex items-center justify-center gap-3 text-2xl font-bold mb-10 ${titleColor}`}><Wand2 className="w-7 h-7 text-purple-500" /> Sequential Breakdown</h3>
          <div className="grid grid-cols-1 gap-8">{walkthroughData.map((item, index) => (<WalkthroughStepComp key={index} {...item} isDark={isDark} />))}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ label: "Best Case", value: "O(1)", desc: "Target is at the first index.", color: "text-green-400" }, { label: "Average Case", value: "O(n/2)", desc: "Target is in the middle.", color: "text-blue-400" }, { label: "Worst Case", value: "O(n)", desc: "Target is last or missing.", color: "text-red-400" }].map((item, i) => (
            <div key={i} className={`${cardClass} p-6 rounded-2xl border text-center`}><Clock size={24} className="mx-auto mb-4 text-purple-500" /><h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest">{item.label}</h4><div className={`text-3xl font-black my-2 ${item.color}`}>{item.value}</div><p className="text-xs text-gray-500">{item.desc}</p></div>
          ))}
        </div>

        <div className={sectionClasses}>
          <h3 className={`flex items-center gap-3 text-2xl font-bold mb-4 ${titleColor}`}><BarChart3 size={24} className="text-purple-500" /> Performance Analysis</h3>
          <InteractiveComplexityGraph isDark={isDark} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`${cardClass} p-8 rounded-3xl border-l-4 border-green-500`}><h4 className="text-xl font-bold text-green-500 mb-6 flex items-center gap-2"><CheckCircle2 /> Advantages</h4><ul className={`space-y-4 text-sm ${textColor}`}><li>• No sorting required; works on any random data.</li><li>• Extremely simple logic and easy to implement.</li><li>• Space complexity is <strong>O(1)</strong> (In-place search).</li></ul></div>
            <div className={`${cardClass} p-8 rounded-3xl border-l-4 border-red-500`}><h4 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2"><XCircle /> Disadvantages</h4><ul className={`space-y-4 text-sm ${textColor}`}><li>• Very slow for large datasets ($10^6$ checks for $10^6$ items).</li><li>• Inefficient compared to Binary Search ($O(\log n)$).</li></ul></div>
        </div>
      </div>
    </section>
  );
};


// Main LinearSearchVisualizer Component

const LinearSearchVisualizer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State
  const [array, setArray] = useState([]);
  const [targetValue, setTargetValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(70);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("visualization");
  const [copyTooltipText, setCopyTooltipText] = useState("Copy");
  const [complexity, setComplexity] = useState({ comparisons: 0, target: 0 });
  const [highlightedIndex, setHighlightedIndex] = useState(null); 
  const [customInput, setCustomInput] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const createArrayFromValues = (values) => values.map((value, index) => ({ id: `ls-${index}-${Date.now()}-${Math.random()}`, value }));

  const addStep = useCallback((message, type, arr, index, foundIdx, currentComplexity) => {
    const newStep = { message, type: type.toLowerCase(), arrState: arr.map(item => ({ ...item })), highlights: index !== null ? [index] : [], index, found: foundIdx, complexity: { ...currentComplexity } };
    setSteps(prev => [...prev, newStep]);
  }, []);

  const handleReset = useCallback(() => {
    const newValues = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    const newArr = createArrayFromValues(newValues);
    const randTarget = newValues[Math.floor(Math.random() * 10)];
    setArray(newArr); setTargetValue(randTarget.toString()); setHighlightedIndex(null); setIsSearching(false); setIsPaused(true); setIsFinished(false);
    setComplexity({ comparisons: 0, target: randTarget });
    setSteps([{ message: "Search initialized. Press Play.", type: "start", arrState: newArr, highlights: [], index: null, found: null, complexity: { comparisons: 0, target: randTarget } }]);
    setCurrentStep(0);
  }, []);

  useEffect(() => { handleReset(); }, [handleReset]);

  useEffect(() => {
    if (isFinished && steps.some(s => s.type === "found") && isAuthenticated) {
        dispatch(completeAlgorithm("Linear-Search")).unwrap().then(() => setShowCelebration(true)).catch(err => console.error(err));
    }
  }, [isFinished, steps, isAuthenticated, dispatch]);

  const runSearchStep = useCallback(() => {
    if (isFinished || isPaused || array.length === 0) return;
    const nextIdx = highlightedIndex === null ? 0 : highlightedIndex + 1;
    const target = Number(targetValue);
    if (nextIdx >= array.length) {
      setIsFinished(true); setIsSearching(false);
      addStep("Search complete. Target not found.", "notfound", array, null, null, complexity);
      setCurrentStep(prev => prev + 1); return;
    }
    const newComp = { ...complexity, comparisons: complexity.comparisons + 1 };
    setComplexity(newComp); setHighlightedIndex(nextIdx);
    if (array[nextIdx].value === target) {
      setIsFinished(true); setIsSearching(false);
      addStep(`🎯 Found ${targetValue} at index ${nextIdx}!`, "found", array, nextIdx, nextIdx, newComp);
      addStep("Search terminated successfully.", "finish", array, nextIdx, nextIdx, newComp);
      setCurrentStep(prev => prev + 2);
    } else {
      addStep(`Checking index ${nextIdx}: ${array[nextIdx].value} ≠ ${targetValue}`, "compare", array, nextIdx, null, newComp);
      setCurrentStep(prev => prev + 1);
    }
  }, [array, highlightedIndex, targetValue, complexity, isFinished, isPaused, addStep]);

  useEffect(() => {
    let timer;
    if (isSearching && !isPaused && !isFinished) timer = setTimeout(runSearchStep, 1100 - speed * 10);
    return () => clearTimeout(timer);
  }, [isSearching, isPaused, isFinished, runSearchStep, speed]);

  const handleCustomArray = useCallback(() => {
    const vals = customInput.split(/[, ]+/).map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0 && v <= 100);
    if (vals.length === 0 || vals.length > 12) return alert("Please enter 1-12 valid numbers.");
    const newArr = createArrayFromValues(vals);
    setArray(newArr); setHighlightedIndex(null); setIsFinished(false); setComplexity({ comparisons: 0, target: Number(targetValue) });
    setSteps([{ message: "Custom array loaded.", type: "start", arrState: newArr, highlights: [], index: null, found: null, complexity: { comparisons: 0, target: Number(targetValue) } }]);
    setCurrentStep(0);
  }, [customInput, targetValue]);

  const goToStep = (idx) => {
    if (idx < 0 || idx >= steps.length) return;
    const s = steps[idx]; setIsPaused(true); setCurrentStep(idx); setArray(s.arrState); setHighlightedIndex(s.index); setComplexity(s.complexity);
  };

  const handleCopy = () => { navigator.clipboard.writeText(window.location.href); setCopyTooltipText("Copied!"); setTimeout(() => setCopyTooltipText("Copy"), 2000); };
  const getTabClass = (tabName) => activeTab === tabName ? "text-purple-500 border-b-2 border-purple-500" : (isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-purple-600");

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`} style={{ backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center">
        <header className="w-full max-w-7xl mx-auto py-10 animate-fadeIn relative mb-8 mt-15">
            <div className="flex flex-col md:flex-row md:items-start md:justify-center relative">
                <div className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1"><Breadcrumb isDark={isDark} /></div>
                <div className="text-center w-full">
                    <div className={`inline-block text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border backdrop-blur-sm ${isDark ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-green-50 text-green-600 border-green-200"}`}>Searching</div>
                    <h1 className={`text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Linear Search Visualizer</h1>
                    <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-slate-500"} max-w-2xl mx-auto mt-4`}>An interactive tool to visualize the step-by-step discovery process of the Linear Search algorithm.</p>
                    <div className="mt-6 flex justify-center items-center gap-4">
                      <GlossyButton onClick={handleCopy} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Copy className="w-4 h-4" /><span>{copyTooltipText}</span></GlossyButton>
                      <GlossyButton onClick={() => {}} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Share2 className="w-4 h-4" /><span>Share</span></GlossyButton>
                    </div>
                </div>
            </div>
        </header>

        <div className="w-full space-y-6 mt-6">
          <div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
            <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("visualization")}`} onClick={() => setActiveTab("visualization")}>Visualization</button>
            <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("explanation")}`} onClick={() => setActiveTab("explanation")}>Explanation</button>
            <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("code")}`} onClick={() => setActiveTab("code")}>Code & Practice</button>
            <button className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${getTabClass("quiz")}`} onClick={() => setActiveTab("quiz")}><BrainCircuit size={16} /> Mastery Arena</button>
          </div>

          {activeTab === "visualization" ? (
            <div className="animate-fadeIn">
              <ComplexityDisplay complexity={steps[currentStep]?.complexity || complexity} isDark={isDark} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2"><VisualizationArea array={array} steps={steps} currentStep={currentStep} target={targetValue} isDark={isDark} /></div>
                <div className="lg:col-span-1">
                   <SearchingControls isFinished={isFinished} isPaused={isPaused} isSearching={isSearching} currentStep={currentStep} totalSteps={steps.length} speed={speed} customInput={customInput} targetValue={targetValue} onTogglePlay={() => { if(isFinished) handleReset(); setIsSearching(true); setIsPaused(!isPaused); }} onStepBack={() => goToStep(currentStep - 1)} onStepForward={() => goToStep(currentStep + 1)} onReset={handleReset} onExample={handleReset} onTargetChange={setTargetValue} onSpeedChange={setSpeed} onCustomInputChange={setCustomInput} onApplyCustom={handleCustomArray} isDark={isDark} />
                </div>
              </div>
              <div className="mt-6"><SortingLogView steps={steps} currentStep={currentStep} goToStep={goToStep} isDark={isDark} /></div>
            </div>
          ) : activeTab === "explanation" ? (<ExplanationTab isDark={isDark} />) : activeTab === "code" ? (
            <PremiumCodeReference codeData={LINEAR_SEARCH_CODE} complexity={LINEAR_SEARCH_STATS} isDark={isDark} />
          ) : (<QuizArena algoKey="Linear-Search" isDark={isDark} onMasteryComplete={() => navigate('/dashboard')} />)}
        </div>
        <footer className={`mt-16 text-center text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}><p>Linear Search Visualizer - Interactive Algorithm Demonstration</p></footer>
      </main>
    </div>
  );
};


export default LinearSearchVisualizer;