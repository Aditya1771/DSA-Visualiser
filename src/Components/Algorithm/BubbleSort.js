import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { useNavigate } from "react-router"; 
import { motion, AnimatePresence } from "framer-motion";
import { completeAlgorithm } from '../../Stores/authSlice';
import { 
  Trophy, Zap, ArrowRight, Sparkles, Loader2, BrainCircuit, Check, X, Info, Copy,
  Home, ChevronRight, LayoutGrid, Brain, ArrowUpNarrowWide, BarChart3, Settings2, 
  Play, Pause, SkipBack, SkipForward, RotateCcw, Wand2, Activity, 
  ArrowUpDown, ArrowLeftRight, RotateCw, ArrowDownWideNarrow, Clock, 
  Maximize, CheckCircle2, XCircle, Share2, Code2, Download, 
  MessageSquare, Terminal, Printer, Trash2, Bug, HelpCircle
} from "lucide-react";

import QuizArena from "../Utils/QuizArena";
import Editor from "@monaco-editor/react";
import PremiumCodeReference from "../Utils/PremiumCodeReference";
import SortingLogView from "../Utils/SortingLogView";
import GlossyButton from "../Utils/GlossyButton";
import SortingControls from "../Utils/SortingControls";

// ==========================================
// --- 1. THEME & UTILS ---
// ==========================================

const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    x: [0, 50, 0],
    y: [0, -50, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

// --- BREADCRUMB ---
const Breadcrumb = ({ isDark }) => (
  <nav aria-label="Breadcrumb">
    <ol className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
      <li>
        <a href="/" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </a>
      </li>
      <li>
        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <a href="/algorithms" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
           <LayoutGrid className="w-4 h-4" />
           <span className="hidden sm:inline">Dashboard</span>
        </a>
      </li>
      <li>
         <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border backdrop-blur-md cursor-default
            ${isDark 
              ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" 
              : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}>
          <ArrowUpNarrowWide className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <span className="font-semibold">Bubble Sort</span>
        </div>
      </li>
    </ol>
  </nav>
);

// --- ANIMATED NUMBER ---
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

        if (progress < animationDuration) {
          requestAnimationFrame(animate);
        } else {
          setCurrentValue(value);
          prevValueRef.current = value;
        }
      };
      requestAnimationFrame(animate);
      return () => { prevValueRef.current = value; };
    }, [value]);

    return <>{currentValue}</>;
};

// ==========================================
// --- 2. MAIN VISUALIZATION COMPONENTS ---
// ==========================================

const ComplexityDisplay = ({ complexity, isDark }) => {
  const cardClass = isDark 
    ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" 
    : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const titleClass = isDark ? "text-gray-300" : "text-slate-700";

  return (
    <section className={`${cardClass} rounded-xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20`}>
      <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}>
        <BarChart3 className="w-4 h-4"/>
        Complexity Analysis
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3 rounded-lg border border-indigo-700/50">
          <h3 className="flex items-center gap-2 text-xs text-indigo-400 mb-1"><ArrowUpDown className="w-4 h-4"/>Comparisons</h3>
          <span className="text-xl font-bold text-indigo-400"><AnimatedNumber value={complexity.comparisons} /></span>
        </div>
        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3 rounded-lg border border-pink-700/50">
          <h3 className="flex items-center gap-2 text-xs text-pink-400 mb-1"><ArrowLeftRight className="w-4 h-4"/>Swaps</h3>
          <span className="text-xl font-bold text-pink-400"><AnimatedNumber value={complexity.swaps} /></span>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-3 rounded-lg border border-purple-700/50">
          <h3 className="flex items-center gap-2 text-xs text-purple-400 mb-1"><RotateCw className="w-4 h-4"/>Passes</h3>
          <span className="text-xl font-bold text-purple-400"><AnimatedNumber value={complexity.passes} /></span>
        </div>
      </div>
    </section>
  );
};

const VisualizationArea = ({ array, highlights, sorted, steps, sortOrder, isDark }) => {
    const [elementPositions, setElementPositions] = useState({});
    const [animationState, setAnimationState] = useState({ phase: 'idle', itemIds: [], prevPositions: {} });
    const [overlayContent, setOverlayContent] = useState({ show: false, x1: 0, x2: 0, y: 0, message: '', isSwap: false });
    const [overlayPosition, setOverlayPosition] = useState({ clampedMidX: 0, opacity: 0 });
    
    const containerRef = useRef(null);
    const messageBoxRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    useEffect(() => {
        const newPositions = {};
        array.forEach((item, index) => {
            newPositions[item.id] = index;
        });
        setElementPositions(newPositions);
    }, [array]);

    const elementWidth = 64;
    const elementHeight = 64;
    const elementGap = 8;
    const highlightLift = 50; 
    const messageBoxVerticalOffset = 140; 
    const lineTargetVerticalOffset = 5; 
    const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

    useEffect(() => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        const lastStep = steps[steps.length - 1];
        
        if (!lastStep || highlights.length < 2 || !containerRef.current) {
            setAnimationState({ phase: 'idle', itemIds: [], prevPositions: {} });
            setOverlayContent(prev => ({ ...prev, show: false }));
            return;
        }

        const [i, j] = highlights;
        const item1 = array.find(d => elementPositions[d.id] === i);
        const item2 = array.find(d => elementPositions[d.id] === j);
        if (!item1 || !item2) return;

        const x1 = (i * (elementWidth + elementGap)) + (elementWidth / 2); 
        const x2 = (j * (elementWidth + elementGap)) + (elementWidth / 2); 
        const midX = (x1 + x2) / 2; 

        if (lastStep.type === 'compare') {
            const shouldSwap = sortOrder === 'ascending' ? item1.value > item2.value : item1.value < item2.value;
            const message = `Comparing ${item1.value} and ${item2.value}`;
            
            setAnimationState({ phase: 'comparing', itemIds: [item1.id, item2.id], result: shouldSwap, prevPositions: {} });
            setOverlayContent({ show: true, x1, x2, midX, message, isSwap: false });

        } else if (lastStep.type === 'swap') {
            const message = `Swapping ${item2.value} and ${item1.value}`;
            setOverlayContent({ show: true, x1, x2, midX, message, isSwap: true });
            
            setAnimationState({ phase: 'swapping', itemIds: [item1.id, item2.id], prevPositions: {} });

            animationTimeoutRef.current = setTimeout(() => {
                setAnimationState({ phase: 'idle', itemIds: [], prevPositions: {} });
            }, 800); 
        }
        return () => clearTimeout(animationTimeoutRef.current);
    }, [highlights, steps, array, elementPositions, sortOrder]);
    
    useLayoutEffect(() => {
        if (overlayContent.show && messageBoxRef.current && containerRef.current) {
            const messageBoxWidth = messageBoxRef.current.offsetWidth;
            const halfBox = messageBoxWidth / 2;
            const padding = 20;

            let clampedMidX = Math.max(
                halfBox + padding, 
                Math.min(overlayContent.midX, totalWidth - halfBox - padding)
            );
            
            setOverlayPosition({ clampedMidX, opacity: 1 });
        } else {
            setOverlayPosition({ clampedMidX: 0, opacity: 0 });
        }
    }, [overlayContent, totalWidth]); 

    const getElementStyle = (item) => {
        let currentVisualIndex = elementPositions[item.id];
        let targetX = currentVisualIndex * (elementWidth + elementGap);
        let targetY = 0; 
        let scale = 1;
        const isHighlighted = animationState.itemIds.includes(item.id);
        
        let dynamicBoxShadow = isDark 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';

        if (isHighlighted) {
            if (animationState.phase === 'comparing') {
                targetY = -highlightLift;
                scale = 1.1; 
                dynamicBoxShadow = animationState.result 
                    ? '0 0 0 4px rgba(245, 158, 11, 0.6), 0 20px 25px -5px rgba(0, 0, 0, 0.5)' 
                    : '0 0 0 4px rgba(34, 197, 94, 0.6), 0 20px 25px -5px rgba(0, 0, 0, 0.5)';
            } else if (animationState.phase === 'swapping') {
                targetY = -highlightLift;
                scale = 1.1;
                dynamicBoxShadow = '0 0 0 4px rgba(236, 72, 153, 0.6), 0 20px 25px -5px rgba(236, 72, 153, 0.3)';
            }
        }

        return { 
            transform: `translate(${targetX}px, ${targetY}px) scale(${scale})`, 
            boxShadow: dynamicBoxShadow, 
            zIndex: isHighlighted ? 50 : 1, 
            transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms ease' 
        };
    };

    const getElementClassName = (item) => {
        const isSorted = sorted.includes(elementPositions[item.id]);
        const isHighlighted = animationState.itemIds.includes(item.id);
        const isSwapping = isHighlighted && animationState.phase === 'swapping';
        const isComparing = isHighlighted && animationState.phase === 'comparing';
        let baseClasses = 'absolute flex items-center justify-center w-16 h-16 rounded-xl font-bold text-xl border-2 transition-colors duration-300 ';
        if (isSwapping) return baseClasses + (isDark ? 'bg-pink-900 border-pink-500 text-pink-100' : 'bg-pink-100 border-pink-400 text-pink-700');
        if (isComparing) return baseClasses + (isDark ? 'bg-amber-900 border-amber-500 text-amber-100' : 'bg-amber-100 border-amber-400 text-amber-700');
        if (isSorted) return baseClasses + (isDark ? 'bg-emerald-900 border-emerald-500 text-emerald-100' : 'bg-emerald-100 border-emerald-400 text-emerald-700');
        return baseClasses + (isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-200 text-slate-700');
    };

    const getAbsoluteX = (relativeX) => {
        if (!containerRef.current) return 0;
        const containerRect = containerRef.current.getBoundingClientRect();
        const arrayLeftOffset = (containerRect.width - totalWidth) / 2;
        return arrayLeftOffset + relativeX;
    }
    const getAbsoluteY = (relativeY) => {
        if (!containerRef.current) return 0;
        const containerRect = containerRef.current.getBoundingClientRect();
        return (containerRect.height / 2) + relativeY;
    }
    const getLineTargetY = (isHighlighted) => getAbsoluteY((isHighlighted ? -highlightLift : 0) - (elementHeight / 2) - lineTargetVerticalOffset);
    const messageBoxAbsoluteY = getAbsoluteY(-highlightLift - messageBoxVerticalOffset + 40); 

    const containerClasses = isDark 
        ? "bg-gradient-to-br from-gray-955 via-gray-955 to-gray-955 border-gray-700"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const titleClass = isDark ? "text-gray-300" : "text-slate-700";

    return (
        <section className={`${containerClasses} rounded-xl p-6 border shadow-xl h-full flex flex-col min-h-[32rem] relative overflow-hidden backdrop-blur-sm`}>
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: `radial-gradient(circle at center, ${gridColor} 1px, transparent 1px)`, backgroundSize: "32px 32px" }}></div>
            <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}>
                <Activity className="w-4 h-4" />
                Animated Array
            </h2>
            <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-visible perspective-1000">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 transition-opacity duration-300" style={{ opacity: overlayPosition.opacity }}>
                    <div ref={messageBoxRef} className="absolute transition-transform duration-300 ease-out" 
                         style={{ top: messageBoxAbsoluteY, left: getAbsoluteX(overlayPosition.clampedMidX), transform: `translateX(-50%)` }}>
                        <div className={`font-semibold px-4 py-2 rounded-lg shadow-xl border text-center text-sm max-w-xs backdrop-blur-md
                            ${overlayContent.isSwap 
                                ? (isDark ? 'bg-pink-900/80 border-pink-500 text-pink-100' : 'bg-pink-100 border-pink-300 text-pink-800')
                                : (isDark ? 'bg-amber-900/80 border-amber-500 text-amber-100' : 'bg-amber-100 border-amber-300 text-amber-800')
                            }`}>
                            {overlayContent.message}
                            <div className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-inherit border-r border-b border-inherit transform -translate-x-1/2 rotate-45"></div>
                        </div>
                    </div>
                </div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
                    {overlayContent.show && messageBoxRef.current && (
                        <g className="overlay-connectors transition-opacity duration-300" style={{ opacity: overlayPosition.opacity }}>
                             <path d={`M ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight} C ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight + 30}, ${getAbsoluteX(overlayContent.x1)} ${getLineTargetY(true) - 30}, ${getAbsoluteX(overlayContent.x1)} ${getLineTargetY(true)}`} fill="none" stroke={isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.5)"} strokeWidth="2" strokeDasharray={overlayContent.isSwap ? "0" : "4 4"} />
                            <path d={`M ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight} C ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight + 30}, ${getAbsoluteX(overlayContent.x2)} ${getLineTargetY(true) - 30}, ${getAbsoluteX(overlayContent.x2)} ${getLineTargetY(true)}`} fill="none" stroke={isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.5)"} strokeWidth="2" strokeDasharray={overlayContent.isSwap ? "0" : "4 4"} />
                            <circle cx={getAbsoluteX(overlayContent.x1)} cy={getLineTargetY(true)} r="3" fill={overlayContent.isSwap ? "#ec4899" : "#f59e0b"} />
                            <circle cx={getAbsoluteX(overlayContent.x2)} cy={getLineTargetY(true)} r="3" fill={overlayContent.isSwap ? "#ec4899" : "#f59e0b"} />
                        </g>
                    )}
                </svg>
                <div className="relative" style={{ width: `${totalWidth}px`, height: `${elementHeight}px` }}>
                    {array.map(item => (
                        <div key={item.id} className={getElementClassName(item)} style={getElementStyle(item)}>
                            <div className="element-content z-10">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`mt-4 flex flex-wrap justify-center gap-6 text-xs font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Sorted</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Unsorted</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></span> Comparing</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-500 border border-pink-600"></span> Swapping</span>
            </div>
        </section>
    );
};

const InteractiveComplexityGraph = ({ isDark }) => {
  const [hoverData, setHoverData] = useState(null);
  const [animate, setAnimate] = useState(false);
  const graphRef = useRef(null);
  const maxN = 25;
  const maxOps = (maxN * maxN) + 100; 
  const padding = { top: 40, right: 80, bottom: 50, left: 60 };
  const [size, setSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (graphRef.current) {
      const resize = () => { setSize({ width: graphRef.current.offsetWidth, height: graphRef.current.offsetHeight }); };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) setAnimate(true); else setAnimate(false); }, { threshold: 0.3 });
    observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const nToX = (n) => padding.left + ((n - 1) / (maxN - 1)) * (width - padding.left - padding.right);
  const opsToY = (ops) => height - padding.bottom - (ops / maxOps) * (height - padding.top - padding.bottom);
  const xToN = (x) => Math.round(1 + ((x - padding.left) / (width - padding.left - padding.right)) * (maxN - 1));

  const handleMouseMove = (e) => {
    const rect = graphRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < padding.left || x > width - padding.right || y < padding.top || y > height - padding.bottom) { setHoverData(null); return; }
    const n = xToN(x);
    if (n >= 1 && n <= maxN) setHoverData({ n, best: n, avg: n * n, worst: n * n, x: nToX(n), y });
    else setHoverData(null);
  };

  const getPath = (fn) => {
    let pts = [];
    for (let n = 1; n <= maxN; n++) pts.push(`${nToX(n)},${opsToY(fn(n))}`);
    return `M ${pts.join(" L ")}`;
  };

  const axisColor = isDark ? "white" : "#475569";
  const gridColor = isDark ? "#4b5563" : "#cbd5e1";
  const textColor = isDark ? "#d1d5db" : "#475569";
  const containerClass = isDark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-slate-200 shadow-xl";
  const titleClass = isDark ? "text-gray-100" : "text-slate-800";

  return (
    <div className={`${containerClass} p-4 rounded-2xl border relative`}>
      <h3 className={`text-xl font-bold text-center mb-4 ${titleClass}`}>Bubble Sort Time Complexity</h3>
      <div ref={graphRef} className="relative w-full h-[450px] cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
        <svg width={width} height={height}>
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          {[0, 150, 300, 450, 600].map((val) => (
            <g key={val}>
              <text x={padding.left - 10} y={opsToY(val) + 4} textAnchor="end" className="text-xs" fill={textColor}>{val}</text>
              <line x1={padding.left} y1={opsToY(val)} x2={width - padding.right} y2={opsToY(val)} stroke={gridColor} strokeDasharray="3 3" />
            </g>
          ))}
          <text x={padding.left + (width - padding.left - padding.right) / 2} y={height - 10} textAnchor="middle" className="font-medium text-sm" fill={textColor}>Input Size (n)</text>
          <path d={getPath((n) => n)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
          <path d={getPath((n) => n * n)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }} />
          <path d={getPath((n) => n * n)} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 1s" }} />
          <text x={nToX(maxN) + 5} y={opsToY(maxN) - 3} textAnchor="start" className="fill-green-500 text-xs">Best O(n)</text>
          <text x={nToX(maxN) + 5} y={opsToY(maxN * maxN * 0.95) - 3} textAnchor="start" className="fill-blue-500 text-xs">Avg O(n²)</text>
          <text x={nToX(maxN) + 5} y={opsToY(maxN * maxN) - 3} textAnchor="start" className="fill-red-500 text-xs">Worst O(n²)</text>
          {hoverData && (
            <g>
              <line x1={hoverData.x} y1={padding.top} x2={hoverData.x} y2={height - padding.bottom} stroke={axisColor} strokeDasharray="4 4" opacity="0.6" />
              {[{ y: opsToY(hoverData.best), color: "#22c55e" }, { y: opsToY(hoverData.avg ), color: "#3b82f6" }, { y: opsToY(hoverData.worst), color: "#ef4444" }].map((point, i) => (
                <circle key={i} cx={hoverData.x} cy={point.y} r={5} fill={point.color} stroke="white" strokeWidth="1.5" className="transition-all duration-300 ease-out" />
              ))}
              {(() => {
                const boxWidth = 120; const boxHeight = 70; let tooltipX = hoverData.x + 15; let tooltipY = opsToY(hoverData.worst) - boxHeight - 10;
                if (tooltipX + boxWidth > width - padding.right) tooltipX = hoverData.x - boxWidth - 15;
                tooltipX = Math.max(padding.left, tooltipX);
                if (tooltipY < padding.top) tooltipY = opsToY(hoverData.best) + 15;
                if (tooltipY + boxHeight > height - padding.bottom) tooltipY = height - padding.bottom - boxHeight;
                return (
                  <g transform={`translate(${tooltipX}, ${tooltipY})`} className="transition-transform duration-100 ease-out">
                    <rect x="0" y="0" width={boxWidth} height={boxHeight} rx="6" fill={isDark ? "black" : "white"} stroke={isDark ? "none" : "#cbd5e1"} opacity="0.9" />
                    <text x="8" y="18" className="text-xs" fill={isDark ? "white" : "black"}>n = {hoverData.n}</text>
                    <text x="8" y="34" className="fill-green-500 text-xs">Best: {hoverData.best}</text>
                    <text x="8" y="48" className="fill-blue-500 text-xs">Avg: {Math.round(hoverData.avg )}</text>
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

// ==========================================
// --- 3. EXPLANATION & WALKTHROUGH ---
// ==========================================

const WalkthroughStep = ({ before, after, comparing, swapped, sorted, description, isSummary, isDark }) => {
    const getItemClass = (index, value, arrayType) => {
        let classes = 'relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg shadow-lg transition-all duration-300 ease-in-out border-2 ';
        const isSorted = sorted && sorted.includes(index);
        const isComparing = comparing && comparing.includes(index);
        const isSwapped = arrayType === 'after' && swapped && swapped.includes(index);
        if (isSorted) classes += 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white ';
        else if (isComparing) classes += 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 transform -translate-y-3 scale-110 shadow-yellow-400/50 ';
        else if (isSwapped) classes += 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400 animate-pulse ';
        else classes += 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white ';
        return classes;
    };
    const containerClasses = `flex flex-col items-center gap-4 p-4 rounded-lg ${isSummary ? (isDark ? 'bg-purple-900/20 border-t-2 border-b-2 border-purple-800/50' : 'bg-purple-100 border-t-2 border-b-2 border-purple-200') : (isDark ? 'bg-gray-900/40' : 'bg-slate-100')}`;
    const textClass = isDark ? "text-gray-300" : "text-slate-600";
    return (
        <div className={containerClasses}>
            <div className="w-full text-center"><p className={`text-sm ${textClass}`}>{description}</p></div>
            {!isSummary && (
              <div className="w-full flex items-center justify-center gap-3 md:gap-6 mt-2">
                  <div className="flex items-center justify-center gap-2">{before.map((val, idx) => <div key={`before-${idx}`} className={getItemClass(idx, val, 'before')}>{val}</div>)}</div>
                  {after && <SkipForward className="w-8 h-8 text-gray-400 shrink-0"/>}
                  {after && (<div className="flex items-center justify-center gap-2">{after.map((val, idx) => <div key={`after-${idx}`} className={getItemClass(idx, val, 'after')}>{val}</div>)}</div>)}
              </div>
            )}
            {isSummary && (<div className="w-full flex items-center justify-center gap-2 mt-2">{before.map((val, idx) => <div key={`summary-${idx}`} className={getItemClass(idx, val, 'summary')}>{val}</div>)}</div>)}
        </div>
    );
};

const ExplanationTab = ({ isDark }) => {
    const walkthroughData = [
        { type: 'initial', before: [64, 34, 25, 12, 22, 11], description: 'Our journey begins with this unsorted array. The goal is to arrange these numbers in ascending order.' },
        { type: 'pass', text: 'Pass 1: Bubbling the largest element to the end' },
        { type: 'step', before: [64, 34, 25, 12, 22, 11], after: [34, 64, 25, 12, 22, 11], comparing: [0, 1], swapped: [0, 1], description: 'First, we compare the adjacent elements 64 and 34. Since 64 > 34, they are swapped to place the larger number to the right.' },
        { type: 'step', before: [34, 64, 25, 12, 22, 11], after: [34, 25, 64, 12, 22, 11], comparing: [1, 2], swapped: [1, 2], description: 'Next, we compare 64 and 25. Again, 64 is larger, so we swap them. Notice how 64 is "bubbling" towards the end.' },
        { type: 'step', before: [34, 25, 64, 12, 22, 11], after: [34, 25, 12, 64, 22, 11], comparing: [2, 3], swapped: [2, 3], description: 'The comparison continues with 64 and 12. A swap is necessary.' },
        { type: 'step', before: [34, 25, 12, 64, 22, 11], after: [34, 25, 12, 22, 64, 11], comparing: [3, 4], swapped: [3, 4], description: 'Now, we compare 64 and 22. Once more, 64 moves to the right after a swap.' },
        { type: 'step', before: [34, 25, 12, 22, 64, 11], after: [34, 25, 12, 22, 11, 64], comparing: [4, 5], swapped: [4, 5], description: 'Finally, 64 is compared with 11. They are swapped, and 64 reaches the end of the array.' },
        { type: 'summary', before: [34, 25, 12, 22, 11, 64], sorted: [5], description: 'After the first full pass, the largest element, 64, has settled into its final sorted position. We now only need to sort the remaining unsorted portion.', isSummary: true },
        { type: 'pass', text: 'Pass 2: Sorting the next largest element' },
        { type: 'step', before: [34, 25, 12, 22, 11, 64], after: [25, 34, 12, 22, 11, 64], comparing: [0, 1], swapped: [0, 1], sorted: [5], description: 'Compare (34, 25). Swap.' },
        { type: 'step', before: [25, 34, 12, 22, 11, 64], after: [25, 12, 34, 22, 11, 64], comparing: [1, 2], swapped: [1, 2], sorted: [5], description: 'Compare (34, 12). Swap.' },
        { type: 'step', before: [25, 12, 34, 22, 11, 64], after: [25, 12, 22, 34, 11, 64], comparing: [2, 3], swapped: [2, 3], sorted: [5], description: 'Compare (34, 22). Swap.' },
        { type: 'step', before: [25, 12, 22, 34, 11, 64], after: [25, 12, 22, 11, 34, 64], comparing: [3, 4], swapped: [3, 4], sorted: [5], description: 'Compare (34, 11). Swap.' },
        { type: 'summary', before: [25, 12, 22, 11, 34, 64], sorted: [4, 5], description: 'Pass 2 is complete. The second-largest element, 34, is now sorted.', isSummary: true },
        { type: 'pass', text: 'Pass 3' },
        { type: 'step', before: [25, 12, 22, 11, 34, 64], after: [12, 25, 22, 11, 34, 64], comparing: [0, 1], swapped: [0, 1], sorted: [4, 5], description: 'Compare (25, 12). Swap.' },
        { type: 'step', before: [12, 25, 22, 11, 34, 64], after: [12, 22, 25, 11, 34, 64], comparing: [1, 2], swapped: [1, 2], sorted: [4, 5], description: 'Compare (25, 22). Swap.' },
        { type: 'step', before: [12, 22, 25, 11, 34, 64], after: [12, 22, 11, 25, 34, 64], comparing: [2, 3], swapped: [2, 3], sorted: [4, 5], description: 'Compare (25, 11). Swap.' },
        { type: 'summary', before: [12, 22, 11, 25, 34, 64], sorted: [3, 4, 5], description: 'Pass 3 concludes, placing 25 in its correct spot.', isSummary: true },
        { type: 'pass', text: 'Pass 4' },
        { type: 'step', before: [12, 22, 11, 25, 34, 64], after: [12, 11, 22, 25, 34, 64], comparing: [1, 2], swapped: [1, 2], sorted: [3, 4, 5], description: 'Compare (22, 11). Swap.' },
        { type: 'summary', before: [12, 11, 22, 25, 34, 64], sorted: [2, 3, 4, 5], description: 'After Pass 4, 22 is sorted.', isSummary: true },
        { type: 'pass', text: 'Pass 5' },
        { type: 'step', before: [12, 11, 22, 25, 34, 64], after: [11, 12, 22, 25, 34, 64], comparing: [0, 1], swapped: [0, 1], sorted: [2, 3, 4, 5], description: 'Compare (12, 11). Swap.' },
        { type: 'summary', before: [11, 12, 22, 25, 34, 64], sorted: [1, 2, 3, 4, 5], description: 'Pass 5 sorts the element 12.', isSummary: true },
        { type: 'final', before: [11, 12, 22, 25, 34, 64], sorted: [0, 1, 2, 3, 4, 5], description: 'With all elements in their correct places, the array is now fully sorted!', isSummary: true },
    ];
    
    const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    const sectionClasses = `${cardClass} p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20`;
    const titleColor = isDark ? "text-gray-200" : "text-slate-800";
    const textColor = isDark ? "text-gray-300" : "text-slate-600";
    const listColor = isDark ? "text-gray-400" : "text-slate-500";
    const innerCardClass = isDark ? "bg-gray-900/50 border-gray-700" : "bg-slate-50 border-slate-200";

    return (
        <section className={`${isDark ? 'text-gray-300' : 'text-slate-600'} animate-fadeIn`}>
            <div className="max-w-6xl mx-auto space-y-12">
                <div className={sectionClasses}>
                    <h2 className="flex items-center justify-center gap-3 text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        <ArrowUpNarrowWide className="w-6 h-6 text-purple-400"/>What is Bubble Sort?
                    </h2>
                    <p className={`text-sm text-center leading-relaxed ${textColor}`}>Bubble Sort is a foundational, comparison-based sorting algorithm. Its mechanism is straightforward: it repeatedly steps through the list, compares each pair of adjacent items, and swaps them if they are in the wrong order. This pass is repeated until the list is sorted. The algorithm gets its name from the way smaller or larger elements "bubble" up to their correct position in the list. While simple to understand and implement, its inefficiency for large lists makes it more of an educational tool than a practical one for real-world applications.</p>
                </div>

                <div className={sectionClasses}>
                    <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><Wand2 className="w-5 h-5 text-purple-400" />How It Works: A Detailed Breakdown</h3>
                    <div className="space-y-4">
                        {walkthroughData.map((item, index) => {
                             if (item.type === 'initial') return <div key={index}><h4 className="text-lg text-center font-semibold text-purple-400 mb-2">Initial State</h4><WalkthroughStep {...item} isSummary={true} isDark={isDark} /></div>;
                             if (item.type === 'pass') return <h4 key={index} className="text-lg text-center font-semibold text-purple-400 pt-4 mt-4">{item.text}</h4>;
                             if (item.type === 'final') return <div key={index} className="pt-4"><h4 className="text-lg text-center font-semibold text-green-500 mb-2">Final Sorted State</h4><WalkthroughStep {...item} isDark={isDark} /></div>;
                             return <WalkthroughStep key={index} {...item} isDark={isDark} />;
                        })}
                    </div>
                </div>
                
                <div className={sectionClasses}>
                    <h3 className={`flex items-center gap-3 text-lg font-bold mb-4 ${titleColor}`}><Code2 className="w-5 h-5 text-purple-400" />The Algorithm, Step-by-Step</h3>
                    <ol className={`list-decimal list-inside space-y-4 ${textColor} text-sm leading-relaxed`}>
                        <li><strong>Initialization</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>Start with the entire array considered as the "unsorted" portion.</li>
                           </ul>
                        </li>
                        <li><strong>Outer Loop (The "Passes")</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>Begin a pass through the unsorted portion of the array. With each complete pass, the unsorted portion will shrink by one from the end.</li>
                             <li>Keep a flag, for instance `swappedThisPass`, set to `false` at the start of each pass.</li>
                           </ul>
                        </li>
                        <li><strong>Inner Loop (Comparisons & Swaps)</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>Starting from the first element, compare it with the adjacent element to its right.</li>
                             <li>If the pair is in the wrong order (e.g.,<code>left &gt; right</code> for ascending sort), swap them.</li>
                             <li>If a swap occurs, set the `swappedThisPass` flag to `true`.</li>
                             <li>Move one position to the right and repeat the comparison until you reach the end of the unsorted portion.</li>
                           </ul>
                        </li>
                        <li><strong>Termination & Optimization</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>After the inner loop (one full pass) is complete, check the `swappedThisPass` flag.</li>
                             <li>If it is still `false`, it means no swaps were made, and the array is fully sorted. The algorithm can terminate early.</li>
                             <li>Otherwise, continue with the next pass.</li>
                           </ul>
                        </li>
                    </ol>
                </div>
                
               <div className={sectionClasses}>
  <h3 className={`flex items-center gap-3 text-lg font-bold mb-6 ${titleColor}`}>
    <BarChart3 className="w-5 h-5 text-purple-400" />
    Complexity Analysis
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className={`md:col-span-2 ${innerCardClass} p-6 rounded-lg border`}>
      <h4 className="flex items-center gap-2 text-base font-semibold text-purple-400 mb-4">
        <Clock className="w-5 h-5" />
        Time Complexity
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-red-800/20 rounded-md">
          <p className="font-bold text-lg text-red-400">O(n²)</p>
          <p className="text-xs text-red-500">Worst Case</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
            Occurs when the array is in <span className="text-red-400">reverse order</span>, 
            requiring maximum swaps.
          </p>
        </div>
        <div className="text-center p-3 bg-orange-800/20 rounded-md">
          <p className="font-bold text-lg text-orange-400">O(n²)</p>
          <p className="text-xs text-orange-500">Average Case</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
            Happens when elements are in <span className="text-orange-400">random order</span>, 
            so about half of the elements need swapping.
          </p>
        </div>
        <div className="text-center p-3 bg-green-800/20 rounded-md">
          <p className="font-bold text-lg text-green-400">O(n)</p>
          <p className="text-xs text-green-500">Best Case</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
            Occurs when the array is already <span className="text-green-400">sorted</span>, 
            needing only one pass.
          </p>
        </div>
      </div>
    </div>
    <div className={`md:col-span-1 ${innerCardClass} p-6 rounded-lg border`}>
      <h4 className="flex items-center gap-2 text-base font-semibold text-sky-400 mb-4">
        <Maximize className="w-5 h-5" />
        Space Complexity
      </h4>
      <div className="text-center p-3 bg-sky-800/20 rounded-md">
        <p className="font-bold text-lg text-sky-400">O(1)</p>
        <p className="text-xs text-sky-500">Constant Space</p>
        <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
          Bubble Sort sorts the array <span className="text-sky-400">in-place </span> 
          without extra memory.
        </p>
      </div>
    </div>
  </div>
</div>

                <div className={sectionClasses}>
                    <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><Activity className="w-5 h-5 text-purple-400"/>Interactive Performance Graph</h3>
                    <InteractiveComplexityGraph isDark={isDark} />
                </div>

                <div className={sectionClasses}>
                     <h3 className={`flex items-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><ArrowUpDown className="w-5 h-5 text-purple-400"/>Pros & Cons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`p-6 rounded-lg border-l-4 border-green-500 ${innerCardClass}`}>
                            <h4 className="text-base font-semibold text-green-500 mb-4">Advantages</h4>
                            <ul className={`space-y-3 text-sm ${textColor}`}>
                                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Simplicity:</strong> Very easy to understand and implement, making it a great teaching tool.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Space Efficient:</strong> It's an in-place sort, requiring only a constant O(1) amount of extra memory.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Stable:</strong> Preserves the relative order of equal elements.</span></li>
                            </ul>
                        </div>
                        <div className={`p-6 rounded-lg border-l-4 border-red-500 ${innerCardClass}`}>
                            <h4 className="text-base font-semibold text-red-500 mb-4">Disadvantages</h4>
                            <ul className={`space-y-3 text-sm ${textColor}`}>
                               <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Highly Inefficient:</strong> Its O(n²) time complexity makes it one of the slowest sorting algorithms for most real-world datasets.</span></li>
                               <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Not Practical:</strong> Rarely used in production systems where performance is a consideration. More advanced algorithms are superior.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==========================================
// --- 4. ADVANCED CODE & PRACTICE ECOSYSTEM ---
// ==========================================

// --- REFERENCE CODE DATA ---
const BUBBLE_SORT_CODE = {
    javascript: `/**
 * BUBBLE SORT - JAVASCRIPT
 * A simple way to sort an array by repeatedly swapping adjacent elements.
 */

function bubbleSort(arr) {
    let n = arr.length;
    
    for (let i = 0; i < n; i++) {
        // Optimization: if no two elements were swapped in a pass, the array is sorted.
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            // Compare the current element with the next one
            if (arr[j] > arr[j + 1]) {
                // Swap them using a temporary variable
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        
        // If we didn't swap anything, we can stop early!
        if (!swapped) break;
    }
    return arr;
}

// --- MAIN EXECUTION ---
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original Array:", numbers);

const sortedNumbers = bubbleSort(numbers);
console.log("Sorted Array:  ", sortedNumbers);`,

    python: `"""
BUBBLE SORT - PYTHON
A simple comparison-based sorting algorithm.
"""

def bubble_sort(arr):
    n = len(arr)
    
    # Outer loop to access each array element
    for i in range(n):
        # Keep track of swapping
        swapped = False
        
        # Inner loop to compare array elements
        # The last i elements are already in place
        for j in range(0, n - i - 1):
            
            # Compare two adjacent elements
            if arr[j] > arr[j + 1]:
                
                # Swap if elements are in the wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                
        # If no elements were swapped, the array is already sorted
        if not swapped:
            break

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print("Original List:", data)
    
    bubble_sort(data)
    print("Sorted List:  ", data)`,

    cpp: `/**
 * BUBBLE SORT - C++
 * Uses vectors and a simple swap logic.
 */

#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Standard swap function
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
}

// --- MAIN EXECUTION ---
int main() {
    std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original array: ";
    for (int x : data) std::cout << x << " ";
    
    bubbleSort(data);
    
    std::cout << "\\nSorted array:   ";
    for (int x : data) std::cout << x << " ";
    
    return 0;
}`,

    java: `/**
 * BUBBLE SORT - JAVA
 * A complete class-based implementation.
 */

import java.util.Arrays;

public class Main {
    
    // The Bubble Sort Logic
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            
            // If no two elements were swapped by inner loop, then break
            if (!swapped) break;
        }
    }

    // --- MAIN EXECUTION ---
    public static void main(String[] args) {
        int[] data = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("Original Array: " + Arrays.toString(data));
        
        bubbleSort(data);
        
        System.out.println("Sorted Array:   " + Arrays.toString(data));
    }
}`,

    c: `/**
 * BUBBLE SORT - C
 * A classic procedural implementation.
 */

#include <stdio.h>
#include <stdbool.h>

void bubbleSort(int arr[], int n) {
    int i, j, temp;
    bool swapped;
    
    for (i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Manually swapping elements
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        
        // If no elements were swapped, array is sorted
        if (swapped == false) break;
    }
}

// --- MAIN EXECUTION ---
int main() {
    int data[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(data) / sizeof(data[0]);
    
    printf("Original array: ");
    for (int i = 0; i < n; i++) printf("%d ", data[i]);
    
    bubbleSort(data, n);
    
    printf("\\nSorted array:   ");
    for (int i = 0; i < n; i++) printf("%d ", data[i]);
    
    return 0;
}`
};


// 2. Define the complexity stats
const BUBBLE_SORT_STATS = {
    time: "O(n²)",
    space: "O(1)",
    stable: "Yes"
};



// ==========================================
// --- 5. MAIN VISUALIZER CONTAINER ---
// ==========================================

const BubbleSortVisualizer = () => {
   const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [customInput, setCustomInput] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [activeTab, setActiveTab] = useState("visualization");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReviewingPastStep, setIsReviewingPastStep] = useState(false);
  const [sortState, setSortState] = useState({ pass: 0, comparison: 0, swappedInPass: false });
  const [nextAction, setNextAction] = useState('compare');
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [complexity, setComplexity] = useState({ comparisons: 0, swaps: 0, passes: 0 });
  const [exampleIndex, setExampleIndex] = useState(0);
  const [copyTooltipText, setCopyTooltipText] = useState("Copy");
  const logViewRef = useRef(null);
  const wasSwappedInLastPass = useRef(false);

  // --- THEME STATE ---
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";
  const { isAuthenticated } = useSelector((state) => state.auth);

  // --- LOGIC TO TRIGGER BACKEND UPDATE ---
  useEffect(() => {
    if (isFinished && !isReviewingPastStep && isAuthenticated) {
        const syncProgress = async () => {
            try {
                await dispatch(completeAlgorithm("Bubble-Sort")).unwrap();
                setShowCelebration(true);
            } catch (err) {
                console.error("Progress sync failed:", err);
            }
        };
        syncProgress();
    }
  }, [isFinished, isReviewingPastStep, isAuthenticated, dispatch]);

  const exampleArrays = [[65, 55, 45, 35, 25, 15, 10], [22, 11, 88, 33, 77, 44, 66, 55], [5, 8, 2, 10, 1, 9, 4, 7, 3, 6], [10, 20, 30, 40, 50], [10, 20, 30, 50, 40]];

  const addStep = useCallback((message, type, arr, highlights, sorted, currentComplexity, currentSortState) => {
    if (isReviewingPastStep) return;
    const newStep = { message, type, arrState: arr.map(item => ({...item})), highlights, sorted: [...sorted], complexity: { ...currentComplexity }, sortState: { ...currentSortState } };
    setSteps(prev => [...prev, newStep]);
    setCurrentStep(prev => prev + 1);
  }, [isReviewingPastStep]);

  const runSortStep = useCallback(() => {
    let arr = [...array];
    const len = arr.length;
    let { pass, comparison, swappedInPass } = sortState;
    let currentComplexity = { ...complexity };

    if (pass >= len - 1) { setIsFinished(true); return; }
    if (comparison >= len - pass - 1) {
        const nextPass = pass + 1;
        const justSortedIndex = len - pass - 1;
        if (justSortedIndex >= 0 && arr[justSortedIndex]) {
            const newSorted = [...sortedIndices, justSortedIndex];
            setSortedIndices(newSorted);
            addStep(`End of Pass ${pass + 1}. Element ${arr[justSortedIndex].value} is sorted.`, "sorted", arr, [], newSorted, currentComplexity, sortState);
            wasSwappedInLastPass.current = swappedInPass;
        } else { wasSwappedInLastPass.current = swappedInPass; }
        if (!wasSwappedInLastPass.current || nextPass >= len - 1) { setIsFinished(true); return; }
        const newSortState = { pass: nextPass, comparison: 0, swappedInPass: false };
        setSortState(newSortState);
        currentComplexity.passes = nextPass + 1;
        setComplexity(currentComplexity);
        addStep(`Starting Pass ${nextPass + 1}.`, "pass", arr, [], sortedIndices, currentComplexity, newSortState);
        return;
    }
    const i = comparison;
    const j = comparison + 1;
    if (nextAction === 'compare') {
        setHighlightedIndices([i, j]);
        currentComplexity.comparisons++;
        setComplexity(currentComplexity);
        const shouldSwap = sortOrder === 'ascending' ? arr[i].value > arr[j].value : arr[i].value < arr[j].value;
        addStep(`Comparing elements at index ${i} (${arr[i].value}) and ${j} (${arr[j].value}).`, "compare", arr, [i, j], sortedIndices, currentComplexity, sortState);
        if (shouldSwap) { setNextAction('swap'); } else { setSortState({ ...sortState, comparison: comparison + 1 }); }
    } else if (nextAction === 'swap') {
        const val1 = arr[i].value;
        const val2 = arr[j].value;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        currentComplexity.swaps++;
        setComplexity(currentComplexity);
        const newSwappedInPass = true;
        addStep(`Swapping ${val1} and ${val2}.`, "swap", arr, [i, j], sortedIndices, currentComplexity, sortState);
        setSortState({ pass, comparison: comparison + 1, swappedInPass: newSwappedInPass });
        setNextAction('compare');
    }
  }, [sortState, nextAction, array, sortedIndices, complexity, addStep, sortOrder]);

  useEffect(() => {
    if (isFinished && steps.length > 0 && steps[steps.length - 1]?.type !== 'finish') {
      const finalSorted = Array.from({ length: array.length }, (_, i) => i);
      setSortedIndices(finalSorted);
      setHighlightedIndices([]);
      addStep("Sorting complete!", "finish", array, [], finalSorted, complexity, sortState);
    }
  }, [isFinished, array, complexity, addStep, steps, sortState]);

  useEffect(() => {
    let timer;
    if (isSorting && !isPaused && !isFinished) { timer = setTimeout(runSortStep, 1100 - speed * 10); }
    return () => clearTimeout(timer);
  }, [isSorting, isPaused, isFinished, runSortStep, speed]);

  useEffect(() => {
    if (logViewRef.current) {
      const container = logViewRef.current;
      const currentStepElement = container.querySelector(`[data-step-index="${currentStep}"]`);
      if (currentStepElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = currentStepElement.getBoundingClientRect();
        const isVisible = (elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom);
        if (!isVisible) { container.scrollTo({ top: currentStepElement.offsetTop - container.offsetTop - 20, behavior: 'smooth' }); }
      }
    }
  }, [currentStep]);

  const createArrayFromValues = (values) => values.map((value, index) => ({ id: index, value }));
  const resetToState = (values, message) => {
    const newArray = createArrayFromValues(values);
    setArray(newArray);
    setCustomInput(values.join(', '));
    setIsSorting(false);
    setIsPaused(true);
    setIsFinished(false);
    setIsReviewingPastStep(false);
    setNextAction('compare');
    const initialSortState = { pass: 0, comparison: 0, swappedInPass: false };
    setSortState(initialSortState);
    setHighlightedIndices([]);
    setSortedIndices([]);
    setComplexity({ comparisons: 0, swaps: 0, passes: 1 });
    const initialStep = { message, type: "start", arrState: newArray, highlights: [], sorted: [], complexity: { comparisons: 0, swaps: 0, passes: 1 }, sortState: initialSortState };
    setSteps([initialStep]);
    setCurrentStep(0);
  };
  const handleReset = useCallback(() => { const newValues = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10); resetToState(newValues, "Generated a new random array. Press Play to start sorting."); }, []);
  const handleCustomArray = () => { const newValues = customInput.split(/[, ]+/).map(item => parseInt(item.trim())).filter(item => !isNaN(item) && item > 0 && item <= 100); if (newValues.length === 0 || newValues.length > 12) { alert("Please enter between 1 and 12 valid numbers (1-100)."); return; } resetToState(newValues, "Custom array loaded. Press Play to start sorting."); };
  const loadExampleArray = () => { resetToState(exampleArrays[exampleIndex], `Example array #${exampleIndex + 1} loaded. Press Play to start sorting.`); setExampleIndex(prev => (prev + 1) % exampleArrays.length); };
  const toggleSortOrder = () => !isSorting && setSortOrder(prev => (prev === 'ascending' ? 'descending' : 'ascending'));
  const toggleSorting = () => { if (isFinished) return; if (isReviewingPastStep) { const lastValidStep = steps[currentStep]; if (lastValidStep) { setSortState(lastValidStep.sortState); } setIsReviewingPastStep(false); } setIsSorting(true); setIsPaused(!isPaused); };
  const goToStep = (stepIndex) => { if (stepIndex < 0 || stepIndex >= steps.length) return; const step = steps[stepIndex]; setIsPaused(true); setIsReviewingPastStep(true); if(isFinished) setIsFinished(false); setCurrentStep(stepIndex); setArray(step.arrState); setHighlightedIndices(step.highlights || []); setSortedIndices(step.sorted || []); setComplexity(step.complexity); if (step.sortState) { setSortState(step.sortState); } setNextAction('compare'); };
  const stepForward = () => goToStep(currentStep + 1);
  const stepBackward = () => goToStep(currentStep - 1);
  const handleCopy = () => { navigator.clipboard.writeText(window.location.href).then(() => { setCopyTooltipText("Copied!"); setTimeout(() => setCopyTooltipText("Copy"), 2000); }); };
  const handleShare = () => { if (navigator.share) { navigator.share({ title: "Bubble Sort Visualizer", text: "Check out this interactive Bubble Sort visualizer!", url: window.location.href, }); } else { alert("Web Share API not supported in your browser. You can manually copy the URL."); } };
  useEffect(handleReset, []);
  const [showCelebration, setShowCelebration] = useState(false);
  const displayedStep = steps[currentStep] || {};
  const highlightsToDisplay = displayedStep.highlights || [];
  const sortedToDisplay = displayedStep.sorted || [];
  const currentDisplayedStepForViz = [displayedStep];
  const getTabClass = (tabName) => activeTab === tabName ? "text-purple-500 border-b-2 border-purple-500" : (isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-purple-600");
 
  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`} style={{ backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>

     <main className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center">
     <header className="w-full max-w-7xl mx-auto py-10 animate-fadeIn relative mb-8 mt-15">
        <div className="flex flex-col md:flex-row md:items-start md:justify-center relative">
            <div className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1">
                <Breadcrumb isDark={isDark} />
            </div>
            <div className="text-center w-full">
                <div className={`inline-block text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border backdrop-blur-sm ${isDark ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-green-50 text-green-600 border-green-200"}`}>
                    Sorting 
                </div>
                <h1 className={`text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Bubble Sort Visualizer
                </h1>
                <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-slate-500"} max-w-2xl mx-auto mt-4`}>
                    An interactive tool to visualize the step-by-step process of the Bubble Sort algorithm.
                </p>
                <div className="mt-6 flex justify-center items-center gap-4">
                  <GlossyButton onClick={handleCopy} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Copy className="w-4 h-4" /><span>{copyTooltipText}</span></GlossyButton>
                  <GlossyButton onClick={handleShare} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Share2 className="w-4 h-4" /><span>Share</span></GlossyButton>
                </div>
            </div>
        </div>
      </header>

      <div className="w-full space-y-6 mt-6">
        <div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("visualization")}`} onClick={() => setActiveTab("visualization")}>Visualization</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("explanation")}`} onClick={() => setActiveTab("explanation")}>Explanation</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("code")}`} onClick={() => setActiveTab("code")}>Code & Practice</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${getTabClass("quiz")}`} onClick={() => setActiveTab("quiz")}>
                <BrainCircuit size={16} /> Mastery Arena
          </button>
        </div>

        {activeTab === "visualization" ? (
          <div className="animate-fadeIn">
            <ComplexityDisplay complexity={displayedStep.complexity || complexity} isDark={isDark} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <VisualizationArea
                  array={array}
                  highlights={highlightsToDisplay}
                  sorted={sortedToDisplay}
                  steps={currentDisplayedStepForViz}
                  sortOrder={sortOrder}
                  isDark={isDark}
                />
              </div>
              <div className="lg:col-span-1">
                    <SortingControls
                        isFinished={isFinished}
                        isPaused={isPaused}
                        isSorting={isSorting}
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        speed={speed}
                        customInput={customInput}
                        sortOrder={sortOrder}
                        onTogglePlay={toggleSorting}
                        onStepBack={stepBackward}
                        onStepForward={stepForward}
                        onReset={handleReset}
                        onExample={loadExampleArray}
                        onToggleOrder={toggleSortOrder}
                        onSpeedChange={setSpeed}
                        onCustomInputChange={setCustomInput}
                        onApplyCustom={handleCustomArray}
                        isDark={isDark}
                    />
                </div>
            </div>
            <div className="mt-6">
                <SortingLogView
                    steps={steps}
                    currentStep={currentStep}
                    goToStep={goToStep}
                    isDark={isDark}
                />
            </div>
          </div>
        ) : activeTab === "explanation" ? (
          <ExplanationTab isDark={isDark} />
        ) : activeTab === "code" ? (
            <PremiumCodeReference 
                codeData={BUBBLE_SORT_CODE} 
                complexity={BUBBLE_SORT_STATS} 
                isDark={isDark} 
            />
        ) : (
            <QuizArena 
            algoKey="Bubble-Sort" 
            isDark={isDark} 
            onMasteryComplete={() => navigate('/dashboard')} 
            />
        )}
      </div>

      <footer className={`mt-16 text-center text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}>
        <p>Bubble Sort Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
      </main>
    </div>
  );
};

export default BubbleSortVisualizer;