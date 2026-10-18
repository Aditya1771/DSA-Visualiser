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
          <span className="font-semibold">Insertion Sort</span>
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
          <h3 className="flex items-center gap-2 text-xs text-pink-400 mb-1"><ArrowLeftRight className="w-4 h-4"/>Shifts</h3>
          <span className="text-xl font-bold text-pink-400"><AnimatedNumber value={complexity.swaps} /></span>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-3 rounded-lg border border-purple-700/50">
          <h3 className="flex items-center gap-2 text-xs text-purple-400 mb-1"><RotateCw className="w-4 h-4"/>Elements Sorted</h3>
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
            const shouldShift = sortOrder === 'ascending' ? item1.value > item2.value : item1.value < item2.value;
            const message = `Comparing ${item2.value} with sorted part element ${item1.value}`;
            
            setAnimationState({ phase: 'comparing', itemIds: [item1.id, item2.id], result: shouldShift, prevPositions: {} });
            setOverlayContent({ show: true, x1, x2, midX, message, isSwap: false });

        } else if (lastStep.type === 'swap') {
            const message = `Shifting ${item1.value} right to insert ${item2.value}`;
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
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Sorted Part</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Unprocessed</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></span> Current Key</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-500 border border-pink-600"></span> Shifting</span>
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
    if (n >= 1 && n <= maxN) setHoverData({ n, best: n, avg: (n * n)/2, worst: n * n, x: nToX(n), y });
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
      <h3 className={`text-xl font-bold text-center mb-4 ${titleClass}`}>Insertion Sort Time Complexity</h3>
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
          <path d={getPath((n) => (n * n)/2)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }} />
          <path d={getPath((n) => n * n)} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 1s" }} />
          <text x={nToX(maxN) + 5} y={opsToY(maxN) - 3} textAnchor="start" className="fill-green-500 text-xs">Best O(n)</text>
          <text x={nToX(maxN) + 5} y={opsToY((maxN * maxN)/2) - 3} textAnchor="start" className="fill-blue-500 text-xs">Avg O(n²)</text>
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
        { type: 'initial', before: [12, 11, 13, 5, 6], description: 'Initially, we assume the first element (12) is already in the "sorted" portion.' },
        { type: 'step', before: [12, 11, 13, 5, 6], after: [11, 12, 13, 5, 6], comparing: [0, 1], swapped: [0], sorted: [0], description: 'We pick 11. It is smaller than 12, so we shift 12 to the right and insert 11.' },
        { type: 'summary', before: [11, 12, 13, 5, 6], sorted: [0, 1], description: 'Now [11, 12] is the sorted part.', isSummary: true },
        { type: 'step', before: [11, 12, 13, 5, 6], after: [11, 12, 13, 5, 6], comparing: [1, 2], sorted: [0, 1], description: 'Next is 13. It is larger than 12, so it stays in place.' },
        { type: 'summary', before: [11, 12, 13, 5, 6], sorted: [0, 1, 2], description: 'Sorted part grows to [11, 12, 13].', isSummary: true },
        { type: 'step', before: [11, 12, 13, 5, 6], after: [5, 11, 12, 13, 6], comparing: [2, 3], swapped: [0, 1, 2], sorted: [0, 1, 2], description: 'We pick 5. It bubbles back past 13, 12, and 11 to the very front.' },
        { type: 'final', before: [5, 6, 11, 12, 13], sorted: [0, 1, 2, 3, 4], description: 'Repeating this for 6, the entire array becomes sorted!', isSummary: true },
    ];
    
    const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md shadow-2xl" : "bg-white border-slate-200 shadow-xl backdrop-blur-2xl";
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
                        <ArrowUpNarrowWide className="w-6 h-6 text-purple-400"/>What is Insertion Sort?
                    </h2>
                    <p className={`text-sm text-center leading-relaxed ${textColor}`}>Insertion Sort is a comparison-based sorting algorithm that builds a sorted sub-array one element at a time. It "picks" an element from the unsorted part and "inserts" it into the correct position in the sorted part by shifting larger elements one position to the right. It is very intuitive—similar to how most people sort a hand of playing cards. While inefficient for massive datasets (O(n²)), it is incredibly fast for small arrays or lists that are already mostly sorted.</p>
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
                        <li><strong>Step 1:</strong> Assume the first element is already sorted.</li>
                        <li><strong>Step 2:</strong> Move to the next element (the "key").</li>
                        <li><strong>Step 3:</strong> Compare the "key" with elements in the sorted sub-array (to its left).</li>
                        <li><strong>Step 4:</strong> If an element is larger than the key, shift it one position to the right.</li>
                        <li><strong>Step 5:</strong> Repeat Step 4 until you find an element smaller than the key or reach the start.</li>
                        <li><strong>Step 6:</strong> Insert the "key" at that position. Repeat for all elements.</li>
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
            Occurs when the array is in <span className="text-red-400">reverse order</span>.
          </p>
        </div>
        <div className="text-center p-3 bg-orange-800/20 rounded-md">
          <p className="font-bold text-lg text-orange-400">O(n²)</p>
          <p className="text-xs text-orange-500">Average Case</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
            Happens when elements are in <span className="text-orange-400">random order</span>.
          </p>
        </div>
        <div className="text-center p-3 bg-green-800/20 rounded-md">
          <p className="font-bold text-lg text-green-400">O(n)</p>
          <p className="text-xs text-green-500">Best Case</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
            Occurs when the array is already <span className="text-green-400">sorted</span>.
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
          Insertion Sort sorts the array <span className="text-sky-400">in-place </span> 
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
                                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Online Algorithm:</strong> It can sort a list as it receives it.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Stable:</strong> Does not change the relative order of elements with equal keys.</span></li>
                                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Efficient for Small Data:</strong> Faster than QuickSort for tiny datasets.</span></li>
                            </ul>
                        </div>
                        <div className={`p-6 rounded-lg border-l-4 border-red-500 ${innerCardClass}`}>
                            <h4 className="text-base font-semibold text-red-500 mb-4">Disadvantages</h4>
                            <ul className={`space-y-3 text-sm ${textColor}`}>
                               <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Quadratic Complexity:</strong> Takes O(n²) time in average and worst cases.</span></li>
                               <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Not Practical:</strong> Not suitable for massive datasets.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==========================================
// --- 4. ADVANCED CODE DATA ---
// ==========================================

const INSERTION_SORT_CODE = {
    javascript: `/**
 * INSERTION SORT - JAVASCRIPT
 * Complexity: Time O(n²), Space O(1)
 */
function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i]; // Pick current element
        let j = i - 1;

        /* Move elements of arr[0..i-1], that are 
           greater than key, to one position ahead 
           of their current position */
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key; // Insert at final spot
    }
    return arr;
}

// --- MAIN EXECUTION ---
const data = [12, 11, 13, 5, 6];
console.log("Original Array:", data);
const sorted = insertionSort(data);
console.log("Sorted Array:  ", sorted);`,

    python: `"""
INSERTION SORT - PYTHON
A simple comparison-based sorting algorithm.
"""

def insertion_sort(arr):
    # Start from the second element
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        # Compare key with each element on the left
        # and shift if key is smaller
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Place key in its sorted position
        arr[j + 1] = key

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    data = [12, 11, 13, 5, 6]
    print("Original List:", data)
    insertion_sort(data)
    print("Sorted List:  ", data)`,

    cpp: `/**
 * INSERTION SORT - C++
 * Uses vectors and a classic while-loop shift.
 */

#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& arr) {
    for (size_t i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// --- MAIN EXECUTION ---
int main() {
    std::vector<int> data = {12, 11, 13, 5, 6};
    
    std::cout << "Original array: ";
    for (int x : data) std::cout << x << " ";
    
    insertionSort(data);
    
    std::cout << "\\nSorted array:   ";
    for (int x : data) std::cout << x << " ";
    
    return 0;
}`,

    java: `/**
 * INSERTION SORT - JAVA
 * Complete class-based implementation.
 */

import java.util.Arrays;

public class Main {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    // --- MAIN EXECUTION ---
    public static void main(String[] args) {
        int[] data = {12, 11, 13, 5, 6};
        System.out.println("Original Array: " + Arrays.toString(data));
        insertionSort(data);
        System.out.println("Sorted Array:   " + Arrays.toString(data));
    }
}`,

    c: `/**
 * INSERTION SORT - C
 * Procedural implementation for newcomers.
 */

#include <stdio.h>

void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// --- MAIN EXECUTION ---
int main() {
    int data[] = {12, 11, 13, 5, 6};
    int n = sizeof(data) / sizeof(data[0]);
    
    printf("Original array: ");
    for (int i = 0; i < n; i++) printf("%d ", data[i]);
    
    insertionSort(data, n);
    
    printf("\\nSorted array:   ");
    for (int i = 0; i < n; i++) printf("%d ", data[i]);
    
    return 0;
}`
};

const INSERTION_SORT_STATS = {
    time: "O(n²)",
    space: "O(1)",
    stable: "Yes"
};

// ==========================================
// --- 5. MAIN VISUALIZER CONTAINER ---
// ==========================================

const InsertionSortVisualizer = () => {
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
  
  // Logical state for the Insertion Algorithm
  const [sortState, setSortState] = useState({ i: 1, j: 0 });
  const [nextAction, setNextAction] = useState('compare');
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([0]);
  const [complexity, setComplexity] = useState({ comparisons: 0, swaps: 0, passes: 1 });
  
  const [exampleIndex, setExampleIndex] = useState(0);
  const [copyTooltipText, setCopyTooltipText] = useState("Copy");
  const [showCelebration, setShowCelebration] = useState(false);
  const logViewRef = useRef(null);

  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";
  const { isAuthenticated } = useSelector((state) => state.auth);

  // --- LOGIC TO TRIGGER BACKEND UPDATE ---
  useEffect(() => {
    if (isFinished && !isReviewingPastStep && isAuthenticated) {
        const syncProgress = async () => {
            try {
                await dispatch(completeAlgorithm("Insertion-Sort")).unwrap();
                setShowCelebration(true);
            } catch (err) {
                console.error("Progress sync failed:", err);
            }
        };
        syncProgress();
    }
  }, [isFinished, isReviewingPastStep, isAuthenticated, dispatch]);

  const addStep = useCallback((message, type, arr, highlights, sorted, currentComplexity, currentSortState) => {
    if (isReviewingPastStep) return;
    const newStep = { message, type, arrState: arr.map(item => ({...item})), highlights, sorted: [...sorted], complexity: { ...currentComplexity }, sortState: { ...currentSortState } };
    setSteps(prev => [...prev, newStep]);
    setCurrentStep(prev => prev + 1);
  }, [isReviewingPastStep]);

  const runSortStep = useCallback(() => {
    let arr = [...array];
    const len = arr.length;
    let { i, j } = sortState;
    let currComplexity = { ...complexity };

    if (i >= len) { setIsFinished(true); return; }

    if (nextAction === 'compare') {
        setHighlightedIndices([j, j + 1]);
        currComplexity.comparisons++;
        setComplexity(currComplexity);
        
        const shouldSwap = sortOrder === 'ascending' ? arr[j].value > arr[j + 1].value : arr[j].value < arr[j + 1].value;
        addStep(`Comparing index ${j+1} (${arr[j+1].value}) with sorted index ${j} (${arr[j].value}).`, "compare", arr, [j, j+1], sortedIndices, currComplexity, sortState);
        
        if (shouldSwap) { setNextAction('swap'); } 
        else {
            const nextI = i + 1;
            const newSorted = Array.from({ length: nextI }, (_, idx) => idx);
            setSortedIndices(newSorted);
            const nextSortState = { i: nextI, j: nextI - 1 };
            setSortState(nextSortState);
            currComplexity.passes = nextI;
            setComplexity(currComplexity);
            addStep(`Key ${arr[j+1].value} is in correct position. Moving to next unsorted element at index ${nextI}.`, "sorted", arr, [], newSorted, currComplexity, nextSortState);
        }
    } else if (nextAction === 'swap') {
        const val1 = arr[j].value;
        const val2 = arr[j+1].value;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]);
        currComplexity.swaps++;
        setComplexity(currComplexity);
        
        addStep(`Shifting ${val1} right and moving ${val2} left.`, "swap", arr, [j, j + 1], sortedIndices, currComplexity, sortState);
        
        const nextJ = j - 1;
        if (nextJ < 0) {
            const nextI = i + 1;
            const newSorted = Array.from({ length: nextI }, (_, idx) => idx);
            setSortedIndices(newSorted);
            const nextSortState = { i: nextI, j: nextI - 1 };
            setSortState(nextSortState);
            currComplexity.passes = nextI;
            setComplexity(currComplexity);
            addStep(`Key reached the start. Moving to next unsorted element at index ${nextI}.`, "sorted", arr, [], newSorted, currComplexity, nextSortState);
            setNextAction('compare');
        } else {
            setSortState({ ...sortState, j: nextJ });
            setNextAction('compare');
        }
    }
  }, [sortState, nextAction, array, sortedIndices, complexity, addStep, sortOrder]);

  useEffect(() => {
    if (isFinished && steps.length > 0 && steps[steps.length - 1]?.type !== 'finish') {
      const finalSorted = Array.from({ length: array.length }, (_, idx) => idx);
      setSortedIndices(finalSorted);
      setHighlightedIndices([]);
      addStep("All elements inserted. Insertion Sort Complete!", "finish", array, [], finalSorted, complexity, sortState);
    }
  }, [isFinished, array, complexity, addStep, steps, sortState]);

  useEffect(() => {
    let timer;
    if (isSorting && !isPaused && !isFinished) { timer = setTimeout(runSortStep, 1100 - speed * 10); }
    return () => clearTimeout(timer);
  }, [isSorting, isPaused, isFinished, runSortStep, speed]);

  const resetToState = (values, message) => {
    const newArray = values.map((v, idx) => ({ id: idx, value: v }));
    setArray(newArray); setCustomInput(values.join(', '));
    setIsSorting(false); setIsPaused(true); setIsFinished(false); setIsReviewingPastStep(false);
    setNextAction('compare'); setSortState({ i: 1, j: 0 });
    setHighlightedIndices([]); setSortedIndices([0]);
    setComplexity({ comparisons: 0, swaps: 0, passes: 1 });
    const initialStep = { message, type: "start", arrState: newArray, highlights: [], sorted: [0], complexity: { comparisons: 0, swaps: 0, passes: 1 }, sortState: { i: 1, j: 0 } };
    setSteps([initialStep]); setCurrentStep(0);
  };

  const handleReset = useCallback(() => { resetToState(Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10), "Random array generated."); }, []);
  const handleCustomArray = () => { const v = customInput.split(/[, ]+/).map(i => parseInt(i)).filter(i => !isNaN(i) && i > 0 && i <= 100); if (v.length < 2 || v.length > 12) return alert("2-12 numbers only."); resetToState(v, "Custom array loaded."); };
  const loadExampleArray = () => { const ex = [[12, 11, 13, 5, 6], [50, 40, 30, 20, 10], [1, 2, 3, 4, 5]]; resetToState(ex[exampleIndex], `Example #${exampleIndex + 1} loaded.`); setExampleIndex(p => (p + 1) % ex.length); };
  const goToStep = (idx) => { if (idx < 0 || idx >= steps.length) return; const s = steps[idx]; setIsPaused(true); setIsReviewingPastStep(true); if(isFinished) setIsFinished(false); setCurrentStep(idx); setArray(s.arrState); setHighlightedIndices(s.highlights || []); setSortedIndices(s.sorted || []); setComplexity(s.complexity); if (s.sortState) setSortState(s.sortState); };

  useEffect(handleReset, []);

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
            <div className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1"><Breadcrumb isDark={isDark} /></div>
            <div className="text-center w-full">
                <div className={`inline-block text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border backdrop-blur-sm ${isDark ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-green-50 text-green-600 border-green-200"}`}>
                    Sorting 
                </div>
                <h1 className={`text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Insertion Sort Visualizer
                </h1>
                <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-slate-500"} max-w-2xl mx-auto mt-4`}>
                    Watch how elements find their perfect home in the sorted part of the array, one by one.
                </p>
                <div className="mt-6 flex justify-center items-center gap-4">
                  <GlossyButton onClick={() => navigator.clipboard.writeText(window.location.href)} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Copy className="w-4 h-4" /><span>{copyTooltipText}</span></GlossyButton>
                  <GlossyButton onClick={() => navigator.share({ url: window.location.href })} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Share2 className="w-4 h-4" /><span>Share</span></GlossyButton>
                </div>
            </div>
        </div>
      </header>

      <div className="w-full space-y-6 mt-6">
        <div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("visualization")}`} onClick={() => setActiveTab("visualization")}>Visualization</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("explanation")}`} onClick={() => setActiveTab("explanation")}>Explanation</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("code")}`} onClick={() => setActiveTab("code")}>Code & Reference</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${getTabClass("quiz")}`} onClick={() => setActiveTab("quiz")}>
                <BrainCircuit size={16} /> Mastery Arena
          </button>
        </div>

        {activeTab === "visualization" ? (
          <div className="animate-fadeIn">
            <ComplexityDisplay complexity={steps[currentStep]?.complexity || complexity} isDark={isDark} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <VisualizationArea array={array} highlights={highlightedIndices} sorted={sortedIndices} steps={[steps[currentStep] || {}]} sortOrder={sortOrder} isDark={isDark} />
              </div>
              <div className="lg:col-span-1">
                    <SortingControls isFinished={isFinished} isPaused={isPaused} isSorting={isSorting} currentStep={currentStep} totalSteps={steps.length} speed={speed} customInput={customInput} sortOrder={sortOrder} onTogglePlay={() => { if (isFinished) return; setIsSorting(true); setIsPaused(!isPaused); }} onStepBack={() => goToStep(currentStep - 1)} onStepForward={() => goToStep(currentStep + 1)} onReset={handleReset} onExample={loadExampleArray} onToggleOrder={() => setSortOrder(p => p === 'ascending' ? 'descending' : 'ascending')} onSpeedChange={setSpeed} onCustomInputChange={setCustomInput} onApplyCustom={handleCustomArray} isDark={isDark} />
                </div>
            </div>
            <div className="mt-6">
                <SortingLogView steps={steps} currentStep={currentStep} goToStep={goToStep} isDark={isDark} />
            </div>
          </div>
        ) : activeTab === "explanation" ? (
          <ExplanationTab isDark={isDark} />
        ) : activeTab === "code" ? (
            <PremiumCodeReference codeData={INSERTION_SORT_CODE} complexity={INSERTION_SORT_STATS} isDark={isDark} />
        ) : (
            <QuizArena algoKey="Insertion-Sort" isDark={isDark} onMasteryComplete={() => navigate('/dashboard')} />
        )}
      </div>

      <footer className={`mt-16 text-center text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}>
        <p>Insertion Sort Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
      </main>
    </div>
  );
};

export default InsertionSortVisualizer;