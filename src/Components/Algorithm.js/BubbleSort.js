import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// --- 1. THEME & UTILS & ICONS ---
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

// --- UNIFIED ICON COMPONENT ---
const Icon = ({ name, className = "w-4 h-4" }) => {
  const icons = {
    // Nav & UI
    home: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />,
    
    // Sort & Vis
    bubble: <><circle cx="6" cy="17" r="4" fill="currentColor" opacity="0.8" /><circle cx="12" cy="9" r="5" fill="currentColor" /><circle cx="18" cy="15" r="3" fill="currentColor" opacity="0.9" /><circle cx="9" cy="13" r="1.5" fill="currentColor" opacity="0.6" /><circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.7" /></>,
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    controls: <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />,
    stepBack: <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />,
    stepForward: <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />,
    "arrow-refresh": <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-2.64-6.36L21 8m0-6v6h-6"/>,
    example: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></>,
    info: <><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></>,
    visualization: <><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" /></>,
    comparisons: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />,
    swaps: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 4.5M21 9H3" />,
    passes: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183" />,
    sortOrder: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />,
    time: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    space: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    xmark: <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    
    // Code & Terminal
    copy: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6m4-3 5 5-5 5m5-5H9" />,
    code: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3-3m0 0 3-3m-3 3h7.5" />,
    comment: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />,
    terminal: <path strokeLinecap="round" strokeLinejoin="round" d="M4 17l6-6-6-6M12 19h8" />,
    print: <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-4 0h8v4H10v-4Z" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
    bug: <path strokeLinecap="round" strokeLinejoin="round" d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

// --- GLOSSY BUTTON ---
const GlossyButton = ({ onClick, disabled, gradientClasses, children, className = '', pulse = true, isDark = true }) => (
    <div className={`relative group ${className}`}>
        <div
            className={`absolute -inset-0.5 ${gradientClasses} rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition duration-300 ${
                disabled ? 'hidden' : ''
            } ${pulse ? 'animate-pulse' : ''}`}
        />
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative w-full h-full p-px text-sm font-semibold rounded-2xl overflow-hidden transition-all duration-300
                ${!disabled ? gradientClasses : 'bg-gray-500/50'}
                ${isDark ? 'text-gray-200' : 'text-white'}
                disabled:cursor-not-allowed`}
        >
            <div className={`relative w-full h-full flex items-center justify-center gap-2 px-3 py-2.5 backdrop-blur-sm rounded-[15px] transition-colors duration-300 
                ${isDark ? 'bg-gray-900/80 group-hover:bg-gray-900/70' : 'bg-white/10 group-hover:bg-white/20'}`}>
                <span className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                <span className="relative z-10 flex items-center justify-center gap-2 shadow-sm text-shadow">
                    {children}
                </span>
            </div>
        </button>
    </div>
);

// --- BREADCRUMB ---
const Breadcrumb = ({ isDark }) => (
  <nav aria-label="Breadcrumb">
    <ol className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
      <li>
        <a href="/" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
          <Icon name="home" className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </a>
      </li>
      <li>
        <Icon name="chevronRight" className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <a href="/algorithms" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
           <Icon name="grid" className="w-4 h-4" />
           <span className="hidden sm:inline">Dashboard</span>
        </a>
      </li>
      <li>
         <Icon name="chevronRight" className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border backdrop-blur-md cursor-default
            ${isDark 
              ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" 
              : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}>
          <Icon name="bubble" className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
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
        <Icon name="chart"/>
        Complexity Analysis
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3 rounded-lg border border-indigo-700/50">
          <h3 className="flex items-center gap-2 text-xs text-indigo-400 mb-1"><Icon name="comparisons" className="w-4 h-4"/>Comparisons</h3>
          <span className="text-xl font-bold text-indigo-400"><AnimatedNumber value={complexity.comparisons} /></span>
        </div>
        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3 rounded-lg border border-pink-700/50">
          <h3 className="flex items-center gap-2 text-xs text-pink-400 mb-1"><Icon name="swaps" className="w-4 h-4"/>Swaps</h3>
          <span className="text-xl font-bold text-pink-400"><AnimatedNumber value={complexity.swaps} /></span>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-3 rounded-lg border border-purple-700/50">
          <h3 className="flex items-center gap-2 text-xs text-purple-400 mb-1"><Icon name="passes" className="w-4 h-4"/>Passes</h3>
          <span className="text-xl font-bold text-purple-400"><AnimatedNumber value={complexity.passes} /></span>
        </div>
      </div>
    </section>
  );
};

const Controls = ({
    isFinished, isPaused, isSorting, currentStep, steps, speed, customInput, sortOrder,
    toggleSorting, stepBackward, stepForward, handleReset, loadExampleArray, toggleSortOrder,
    setSpeed, setCustomInput, handleCustomArray, isDark
  }) => {
    const isPlayPauseDisabled = isFinished;
    const isBackDisabled = currentStep <= 0;
    const isNextDisabled = currentStep >= steps.length - 1;
    const isSortOrderDisabled = isSorting;
    const isCustomInputDisabled = isSorting;

    const playPauseStyles = !isPaused
      ? { gradient: "bg-gradient-to-r from-yellow-400 to-orange-500" }
      : { gradient: "bg-gradient-to-r from-green-400 to-emerald-500" };

    const cardClass = isDark 
      ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" 
      : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    const textClass = isDark ? "text-gray-300" : "text-slate-700";
    const labelClass = isDark ? "text-gray-400" : "text-slate-500";
    const inputClass = isDark 
        ? "bg-gray-900/80 border-white/10 text-white focus:ring-purple-500 disabled:bg-gray-800/50" 
        : "bg-white border-slate-200 text-slate-800 focus:ring-purple-500 disabled:bg-slate-100 disabled:text-slate-400";

    return (
      <section className={`${cardClass} rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20 h-full`}>
        <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${textClass}`}>
          <Icon name="controls"/>
          Controls
        </h2>
        <div className="flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <GlossyButton onClick={toggleSorting} disabled={isPlayPauseDisabled} gradientClasses={playPauseStyles.gradient} className="w-full" isDark={isDark}>
                  {!isPaused ? <><Icon name="pause"/>Pause</> : <><Icon name="play"/>Play</>}
                </GlossyButton>
              </div>
              <GlossyButton onClick={handleReset} gradientClasses="bg-gradient-to-r from-red-500 to-pink-500" className="w-full" isDark={isDark}>
                <Icon name="arrow-refresh" />
              </GlossyButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlossyButton onClick={stepBackward} disabled={isBackDisabled} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" className="w-full" isDark={isDark}>
                <Icon name="stepBack"/>Back
              </GlossyButton>
              <GlossyButton onClick={stepForward} disabled={isNextDisabled} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" className="w-full" isDark={isDark}>
                Next<Icon name="stepForward"/>
              </GlossyButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlossyButton onClick={loadExampleArray} gradientClasses="bg-gradient-to-r from-indigo-500 to-purple-500" className="w-full" isDark={isDark}>
                <Icon name="example"/>Example
              </GlossyButton>
              <GlossyButton onClick={toggleSortOrder} disabled={isSortOrderDisabled} gradientClasses="bg-gradient-to-r from-teal-400 to-cyan-500" className="w-full" isDark={isDark}>
                <Icon name="sortOrder" />
                {sortOrder === 'ascending' ? 'Asc' : 'Desc'}
              </GlossyButton>
            </div>
            <div className={`space-y-3 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}>
              <label htmlFor="custom-input" className={`text-xs ${labelClass}`}>Custom Array (comma-separated)</label>
              <input
                id="custom-input"
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 5, 3, 8"
                disabled={isCustomInputDisabled}
                className={`w-full px-4 py-2 border text-sm rounded-2xl focus:ring-2 focus:outline-none ${inputClass}`}
              />
              <GlossyButton onClick={handleCustomArray} disabled={isCustomInputDisabled} gradientClasses="bg-gradient-to-r from-purple-500 to-pink-500" className="w-full" isDark={isDark}>
                Apply Array
              </GlossyButton>
            </div>
            <div className={`space-y-2 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}>
              <label htmlFor="speed-slider" className={`text-xs ${labelClass}`}>Animation Speed</label>
              <div className="flex items-center gap-3">
                <input
                  id="speed-slider"
                  type="range"
                  min="1"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDark ? "bg-gray-700" : "bg-slate-300"}`}
                />
                <span className={`text-xs font-medium w-10 ${textClass}`}>{speed}%</span>
              </div>
            </div>
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

    // Track Element Positions
    useEffect(() => {
        const newPositions = {};
        array.forEach((item, index) => {
            newPositions[item.id] = index;
        });
        setElementPositions(newPositions);
    }, [array]);

    // Layout Constants
    const elementWidth = 64;
    const elementHeight = 64;
    const elementGap = 8;
    const highlightLift = 50; 
    const messageBoxVerticalOffset = 140; 
    const lineTargetVerticalOffset = 5; 
    const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

    // Animation Logic
    useEffect(() => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        const lastStep = steps[steps.length - 1];
        
        // Reset if no active step
        if (!lastStep || highlights.length < 2 || !containerRef.current) {
            setAnimationState({ phase: 'idle', itemIds: [], prevPositions: {} });
            setOverlayContent(prev => ({ ...prev, show: false }));
            return;
        }

        const [i, j] = highlights;
        const item1 = array.find(d => elementPositions[d.id] === i);
        const item2 = array.find(d => elementPositions[d.id] === j);
        if (!item1 || !item2) return;

        // Calculate logical center X for lines
        const x1 = (i * (elementWidth + elementGap)) + (elementWidth / 2); 
        const x2 = (j * (elementWidth + elementGap)) + (elementWidth / 2); 
        const midX = (x1 + x2) / 2; 

        if (lastStep.type === 'compare') {
            const shouldSwap = sortOrder === 'ascending' ? item1.value > item2.value : item1.value < item2.value;
            const message = `Comparing ${item1.value} and ${item2.value}`;
            
            setAnimationState({ 
                phase: 'comparing', 
                itemIds: [item1.id, item2.id], 
                result: shouldSwap, 
                prevPositions: {} 
            });
            
            setOverlayContent({ show: true, x1, x2, midX, message, isSwap: false });

        } else if (lastStep.type === 'swap') {
            const message = `Swapping ${item2.value} and ${item1.value}`;
            setOverlayContent({ show: true, x1, x2, midX, message, isSwap: true });
            
            setAnimationState({ 
                phase: 'swapping', 
                itemIds: [item1.id, item2.id], 
                prevPositions: {} 
            });

            animationTimeoutRef.current = setTimeout(() => {
                setAnimationState({ phase: 'idle', itemIds: [], prevPositions: {} });
            }, 800); 
        }
        return () => clearTimeout(animationTimeoutRef.current);
    }, [highlights, steps, array, elementPositions, sortOrder]);
    
    // Message Box Positioning
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

    // Element Styling
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
                    ? '0 0 0 4px rgba(245, 158, 11, 0.6), 0 20px 25px -5px rgba(0, 0, 0, 0.5)' // Orange/Red
                    : '0 0 0 4px rgba(34, 197, 94, 0.6), 0 20px 25px -5px rgba(0, 0, 0, 0.5)';  // Green
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

    // Coordinate Helpers
    const getAbsoluteX = (relativeX) => {
        if (!containerRef.current) return 0;
        const containerRect = containerRef.current.getBoundingClientRect();
        const arrayLeftOffset = (containerRect.width - totalWidth) / 2;
        return arrayLeftOffset + relativeX;
    }

    const getAbsoluteY = (relativeY) => {
        if (!containerRef.current) return 0;
        const containerRect = containerRef.current.getBoundingClientRect();
        const arrayCenterY = containerRect.height / 2;
        return arrayCenterY + relativeY;
    }

    const getLineTargetY = (isHighlighted) => {
        const liftOffset = isHighlighted ? -highlightLift : 0;
        return getAbsoluteY(liftOffset - (elementHeight / 2) - lineTargetVerticalOffset);
    }

    const messageBoxAbsoluteY = getAbsoluteY(-highlightLift - messageBoxVerticalOffset + 40); 

    const containerClasses = isDark 
        ? "bg-gradient-to-br from-gray-955 via-gray-955 to-gray-955 border-gray-700"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const titleClass = isDark ? "text-gray-300" : "text-slate-700";

    return (
        <section className={`${containerClasses} rounded-xl p-6 border shadow-xl h-full flex flex-col min-h-[32rem] relative overflow-hidden backdrop-blur-sm`}>
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: `radial-gradient(circle at center, ${gridColor} 1px, transparent 1px)`, backgroundSize: "32px 32px" }}></div>
            
            <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}>
                <Icon name="visualization" />
                Animated Array
            </h2>
            
            <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-visible perspective-1000">
                
                {/* Floating Message Box */}
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

                {/* SVG Curves for Connectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
                    {overlayContent.show && messageBoxRef.current && (
                        <g className="overlay-connectors transition-opacity duration-300" style={{ opacity: overlayPosition.opacity }}>
                             <path 
                                d={`M ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight} 
                                   C ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight + 30},
                                     ${getAbsoluteX(overlayContent.x1)} ${getLineTargetY(true) - 30},
                                     ${getAbsoluteX(overlayContent.x1)} ${getLineTargetY(true)}`}
                                fill="none"
                                stroke={isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.5)"} 
                                strokeWidth="2" 
                                strokeDasharray={overlayContent.isSwap ? "0" : "4 4"} 
                            />
                            <path 
                                d={`M ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight} 
                                   C ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight + 30},
                                     ${getAbsoluteX(overlayContent.x2)} ${getLineTargetY(true) - 30},
                                     ${getAbsoluteX(overlayContent.x2)} ${getLineTargetY(true)}`}
                                fill="none"
                                stroke={isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.5)"} 
                                strokeWidth="2" 
                                strokeDasharray={overlayContent.isSwap ? "0" : "4 4"}
                            />
                            <circle cx={getAbsoluteX(overlayContent.x1)} cy={getLineTargetY(true)} r="3" fill={overlayContent.isSwap ? "#ec4899" : "#f59e0b"} />
                            <circle cx={getAbsoluteX(overlayContent.x2)} cy={getLineTargetY(true)} r="3" fill={overlayContent.isSwap ? "#ec4899" : "#f59e0b"} />
                        </g>
                    )}
                </svg>

                {/* Array Elements */}
                <div className="relative" style={{ width: `${totalWidth}px`, height: `${elementHeight}px` }}>
                    {array.map(item => {
                        return (
                            <div key={item.id} className={getElementClassName(item)} style={getElementStyle(item)}>
                                <div className="element-content z-10">{item.value}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className={`mt-4 flex flex-wrap justify-center gap-6 text-xs font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span> Sorted
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Unsorted
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></span> Comparing
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500 border border-pink-600"></span> Swapping
                </span>
            </div>
        </section>
    );
};

const LogView = ({ steps, currentStep, goToStep, logViewRef, isDark }) => {
  const getStepStyle = (type) => {
    const styles = {
      start: "bg-indigo-600/90", pass: "bg-purple-600/90", compare: "bg-yellow-500/90",
      swap: "bg-pink-600/90", sorted: "bg-green-600/90", finish: "bg-teal-600/90"
    };
    return styles[type] || "bg-gray-600/90";
  };

  const cardClass = isDark 
    ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" 
    : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const titleClass = isDark ? "text-gray-300" : "text-slate-700";
  const subTextClass = isDark ? "text-gray-400" : "text-slate-500";

  return (
    <section className={`${cardClass} rounded-xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`flex items-center gap-2 text-lg font-semibold ${titleClass}`}>
          <Icon name="info"/>
          Algorithm Execution Log
        </h2>
        <span className={`text-xs ${subTextClass}`}>
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <div ref={logViewRef} className="relative max-h-96 overflow-y-auto pr-2 space-y-2">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const logMessageStyle = `m-2 p-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${getStepStyle(step.type)} ${
            isCurrent
              ? 'ring-2 ring-offset-2 ring-purple-400 opacity-100'
              : 'opacity-70 hover:opacity-100'
          } ${isCurrent && !isDark ? 'ring-offset-slate-100' : 'ring-offset-gray-800'}`;

          return (
            <div key={index} data-step-index={index} onClick={() => goToStep(index)} className={logMessageStyle}>
              <div className="flex items-start gap-3 m-1">
                <span className="font-bold text-white/80 pt-0.5 text-xs">{index + 1}.</span>
                <p className="text-white text-xs flex-1">{step.message}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1 px-2">
                {step.arrState.map((item, idx) => (
                  <div key={idx} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${step.highlights?.includes(idx) ? 'bg-yellow-400 text-gray-900' : step.sorted?.includes(idx) ? 'bg-green-500 text-white' : 'bg-blue-500/80 text-white'}`}>
                    {item.value}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setAnimate(true); } else { setAnimate(false); } },
      { threshold: 0.3 }
    );
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
    if (x < padding.left || x > width - padding.right || y < padding.top || y > height - padding.bottom) {
      setHoverData(null);
      return;
    }
    const n = xToN(x);
    if (n >= 1 && n <= maxN) {
      setHoverData({ n, best: n, avg: n * n, worst: n * n, x: nToX(n), y });
    } else { setHoverData(null); }
  };

  const getPath = (fn) => {
    let pts = [];
    for (let n = 1; n <= maxN; n++) { pts.push(`${nToX(n)},${opsToY(fn(n))}`); }
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
          <text x="20" y={height / 2} transform={`rotate(-90 20 ${height / 2})`} textAnchor="middle" className="font-medium text-sm" fill={textColor}>Operations</text>
          {[1, 5, 10, 15, 20, 25].map((val) => (
            <g key={val}>
              <text x={nToX(val)} y={height - padding.bottom + 18} textAnchor="middle" className="text-xs" fill={textColor}>{val}</text>
              <line x1={nToX(val)} y1={height - padding.bottom} x2={nToX(val)} y2={height - padding.bottom + 6} stroke={axisColor} />
            </g>
          ))}
          <text x={padding.left + (width - padding.left - padding.right) / 2} y={height - 10} textAnchor="middle" className="font-medium text-sm" fill={textColor}>Input Size (n)</text>
          <path d={getPath((n) => n)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
          <path d={getPath((n) => n * n)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }} />
          <path d={getPath((n) => n * n)} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 1s" }} />
          <text x={nToX(maxN) + 5} y={opsToY(maxN) - 3} textAnchor="start" className="fill-green-500 text-xs">Best O(n)</text>
          <text x={nToX(maxN) + 5} y={opsToY(maxN * maxN *0.95) - 3} textAnchor="start" className="fill-blue-500 text-xs">Avg O(n²)</text>
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
                  {after && <Icon name="stepForward" className="w-8 h-8 text-gray-400 shrink-0"/>}
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
                        <Icon name="bubble" className="w-6 h-6 text-purple-400"/>What is Bubble Sort?
                    </h2>
                    <p className={`text-sm text-center leading-relaxed ${textColor}`}>Bubble Sort is a foundational, comparison-based sorting algorithm. Its mechanism is straightforward: it repeatedly steps through the list, compares each pair of adjacent items, and swaps them if they are in the wrong order. This pass is repeated until the list is sorted. The algorithm gets its name from the way smaller or larger elements "bubble" up to their correct position in the list. While simple to understand and implement, its inefficiency for large lists makes it more of an educational tool than a practical one for real-world applications.</p>
                </div>

                <div className={sectionClasses}>
                    <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><Icon name="example" className="w-5 h-5 text-purple-400" />How It Works: A Detailed Breakdown</h3>
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
                    <h3 className={`flex items-center gap-3 text-lg font-bold mb-4 ${titleColor}`}><Icon name="code" className="w-5 h-5 text-purple-400" />The Algorithm, Step-by-Step</h3>
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
    <Icon name="chart" className="w-5 h-5 text-purple-400" />
    Complexity Analysis
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className={`md:col-span-2 ${innerCardClass} p-6 rounded-lg border`}>
      <h4 className="flex items-center gap-2 text-base font-semibold text-purple-400 mb-4">
        <Icon name="time" className="w-5 h-5" />
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
        <Icon name="space" className="w-5 h-5" />
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
                    <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><Icon name="visualization" className="w-5 h-5 text-purple-400"/>Interactive Performance Graph</h3>
                    <InteractiveComplexityGraph isDark={isDark} />
                </div>

                <div className={sectionClasses}>
                     <h3 className={`flex items-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><Icon name="comparisons" className="w-5 h-5 text-purple-400"/>Pros & Cons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`p-6 rounded-lg border-l-4 border-green-500 ${innerCardClass}`}>
                            <h4 className="text-base font-semibold text-green-500 mb-4">Advantages</h4>
                            <ul className={`space-y-3 text-sm ${textColor}`}>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Simplicity:</strong> Very easy to understand and implement, making it a great teaching tool.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Space Efficient:</strong> It's an in-place sort, requiring only a constant O(1) amount of extra memory.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Stable:</strong> Preserves the relative order of equal elements.</span></li>
                            </ul>
                        </div>
                        <div className={`p-6 rounded-lg border-l-4 border-red-500 ${innerCardClass}`}>
                            <h4 className="text-base font-semibold text-red-500 mb-4">Disadvantages</h4>
                            <ul className={`space-y-3 text-sm ${textColor}`}>
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Highly Inefficient:</strong> Its O(n²) time complexity makes it one of the slowest sorting algorithms for most real-world datasets.</span></li>
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Not Practical:</strong> Rarely used in production systems where performance is a consideration. More advanced algorithms are superior.</span></li>
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
const REF_CODE = {
    javascript: `// Bubble Sort Implementation in JavaScript

function bubbleSort(arr) {
    let n = arr.length;
    let swapped;
    
    // Outer loop for passes
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        
        // Inner loop for comparison
        for (let j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if needed
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        
        // Optimization: Stop if no swaps occurred
        if (!swapped) break;
    }
    return arr;
}`,
    python: `# Bubble Sort Implementation in Python

def bubble_sort(arr):
    n = len(arr)
    
    # Traverse through all array elements
    for i in range(n):
        swapped = False
        
        # Last i elements are already in place
        for j in range(0, n - i - 1):
            
            # Traverse the array from 0 to n-i-1
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                
        # If no two elements were swapped by inner loop, then break
        if not swapped:
            break
    return arr`,
    cpp: `// Bubble Sort Implementation in C++
#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
}`,
    java: `// Bubble Sort Implementation in Java
import java.util.Arrays;

class BubbleSort {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        int temp = 0;
        
        for(int i=0; i < n; i++){
            boolean swapped = false;
            
            for(int j=1; j < (n-i); j++){
                if(arr[j-1] > arr[j]){
                    // Swap elements
                    temp = arr[j-1];
                    arr[j-1] = arr[j];
                    arr[j] = temp;
                    swapped = true;
                }
            }
            if(!swapped) break;
        }
    }
}`,
    c: `// Bubble Sort Implementation in C
#include <stdio.h>
#include <stdbool.h>

void bubbleSort(int arr[], int n) {
    int i, j, temp;
    bool swapped;
    
    for (i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        
        if (swapped == false) break;
    }
}`
};

// --- PRACTICE STARTER CODE (Standard Input Simulation) ---
const PRACTICE_STARTER = {
    javascript: `// Write your JavaScript code here
// Input is automatically passed from the terminal below
// Use 'input' variable as string or parse it

function solve(input) {
  // 1. Parse Input
  const arr = input.trim().split(/\\s+/).map(Number);
  console.log("Input Array:", arr);

  // 2. Your Sort Logic Here
  // ...

  // 3. Print Result
  console.log("Sorted:", arr);
}

// Do not remove this
solve(input);`,

    python: `# Write your Python code here
# Input is passed via standard input (stdin)
# Type your input in the terminal below (e.g., 5 3 8 1)

def solve():
    # 1. Read input
    raw_input = input() 
    arr = list(map(int, raw_input.split()))
    
    print(f"Input Array: {arr}")

    # 2. Your Sort Logic Here
    # ...

    print(f"Sorted: {arr}")

if __name__ == "__main__":
    solve()`,

    cpp: `// Write your C++ code here
// Input is passed via cin from the terminal below

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int val;
    vector<int> arr;

    // 1. Read input until newline/end
    while (cin >> val) {
        arr.push_back(val);
    }

    // 2. Your Sort Logic Here
    // ...

    // 3. Print Result
    cout << "Sorted: ";
    for(int x : arr) cout << x << " ";
    cout << endl;

    return 0;
}`,
    java: `// Write your Java code here
// Input is passed via Scanner from terminal

import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Integer> arr = new ArrayList<>();

        // 1. Read Input
        while(sc.hasNextInt()) {
            arr.add(sc.nextInt());
        }

        // 2. Your Sort Logic Here
        // ...

        System.out.println("Sorted: " + arr);
    }
}`,
    c: `// Write your C code here
// Input is passed via scanf from terminal

#include <stdio.h>

int main() {
    int arr[100];
    int n = 0;
    int val;

    // 1. Read Input
    while (scanf("%d", &val) == 1) {
        arr[n++] = val;
    }

    // 2. Your Sort Logic
    // ...

    // 3. Print Result
    printf("Sorted: ");
    for(int i=0; i<n; i++) printf("%d ", arr[i]);
    
    return 0;
}`
};

// --- SYNTAX HIGHLIGHTING COMPONENT ---
const Highlight = ({ code, lang, isDark }) => {
    // Regex-based tokenizer for visual effect
    const parts = code.split(/(\/\/.*$|#include\s+<.*>|#include\s+".*"|#define\s+.*|#.*$|\/\*[\s\S]*?\*\/|'.*?'|".*?"|\b\d+\b|\b(?:function|let|var|const|if|else|for|while|return|class|public|static|void|int|bool|using|namespace|include|import|from|def|print|console|cin|cout|input|scanf|printf)\b)/g);
    
    return (
        <pre className={`font-mono text-xs md:text-sm leading-6 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
            {parts.map((part, i) => {
                if (!part) return null;
                let color = "";
                // Comments - Gray/Faded to distinguish from code
                if (part.match(/^\/\/|^\/\*/)) color = isDark ? "text-gray-500 italic" : "text-gray-400 italic"; 
                // Python comments (unless preprocessor)
                else if (part.match(/^#/) && !part.match(/^#include|^#define/)) color = isDark ? "text-gray-500 italic" : "text-gray-400 italic";
                // Preprocessor Directives (#include, #define) - Pink/Violet
                else if (part.match(/^#include|^#define/)) color = isDark ? "text-violet-400 font-bold" : "text-violet-600 font-bold";
                // Strings - Green
                else if (part.match(/^'.*'$|^".*"$/)) color = isDark ? "text-emerald-400" : "text-emerald-600"; 
                // Numbers - Indigo
                else if (part.match(/^\d+$/)) color = isDark ? "text-indigo-400" : "text-indigo-600"; 
                // Keywords - Purple
                else if (part.match(/^(function|let|var|const|class|public|static|void|int|bool|def)$/)) color = isDark ? "text-purple-400 font-bold" : "text-purple-600 font-bold"; 
                // Control Flow - Pink
                else if (part.match(/^(if|else|for|while|return|using|namespace|import|from)$/)) color = isDark ? "text-pink-400" : "text-pink-600"; 
                // IO Functions - Blue
                else if (part.match(/^(print|console|cin|cout|input|scanf|printf)$/)) color = isDark ? "text-blue-400" : "text-blue-600"; 
                
                return <span key={i} className={color}>{part}</span>;
            })}
        </pre>
    );
};

// --- MODERN CODE ECOSYSTEM COMPONENT ---
const ModernCodeEcosystem = ({ isDark }) => {
    const [mode, setMode] = useState('reference'); // 'reference' | 'practice'
    const [lang, setLang] = useState('javascript');
    
    // Reference States
    const [showComments, setShowComments] = useState(true);
    const [justCopied, setJustCopied] = useState(false);

    // Practice States
    const [userCode, setUserCode] = useState(PRACTICE_STARTER['javascript']);
    const [terminalLines, setTerminalLines] = useState([{ type: 'sys', text: 'Welcome to the AlgoTerm v2.0' }, { type: 'sys', text: 'Type input below and hit "Run"...' }]);
    const [terminalInput, setTerminalInput] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);

    // Ref for auto-scrolling terminal
    const terminalEndRef = useRef(null);

    // Reset user code when lang changes in practice mode
    useEffect(() => {
        if (mode === 'practice') {
            setUserCode(PRACTICE_STARTER[lang]);
            setTerminalLines([{ type: 'sys', text: `Switched to ${lang.toUpperCase()} environment.` }]);
        }
    }, [lang, mode]);

    // Auto-scroll terminal
    useEffect(() => {
        if (mode === 'practice' && terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [terminalLines, mode]);

    // --- REFERENCE ACTIONS ---
    const getCleanCode = () => {
        let code = REF_CODE[lang];
        if (!showComments) {
            // Remove block comments /* ... */
            code = code.replace(/\/\*[\s\S]*?\*\//gm, '');

            if (lang === 'python') {
                 // Remove # comments, but keep them if they are somehow significant (simple heuristic)
                 // Python uses # for comments. 
                code = code.replace(/#.*$/gm, '');
            } else {
                // For C/C++/Java/JS:
                // Remove // comments
                code = code.replace(/\/\/.*$/gm, '');
                // Note: We intentionally do NOT match lines starting with # so #include stays
            }
            // Cleanup empty lines left by removed comments
            code = code.replace(/^\s*[\r\n]/gm, '');
        }
        return code;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getCleanCode());
        setJustCopied(true);
        setTimeout(() => setJustCopied(false), 2000);
    };

    const handleDownload = () => {
        const extensions = { javascript: 'js', python: 'py', cpp: 'cpp', java: 'java', c: 'c' };
        const element = document.createElement("a");
        const file = new Blob([getCleanCode()], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `bubblesort.${extensions[lang]}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>Print Code</title></head>
                <body>
                    <pre style="font-family: monospace; white-space: pre-wrap;">${getCleanCode()}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // --- PRACTICE ACTIONS (EXECUTION ENGINE) ---
    const executeCode = () => {
        setIsExecuting(true);
        const inputData = terminalInput.trim();
        
        // Add user's run command to terminal history
        setTerminalLines(prev => [...prev, { type: 'in', text: `run "${inputData}"` }]);
        setTerminalInput(""); // Clear input

        setTimeout(() => {
            try {
                if (!inputData && lang !== 'javascript') { 
                    throw new Error("Standard Input is empty. Please type numbers in the terminal.");
                }

                let output = "";
                
                // 1. JavaScript (Real Execution)
                if (lang === 'javascript') {
                    const logs = [];
                    const mockConsole = { 
                        log: (...args) => logs.push(args.join(' ')), 
                        warn: (...args) => logs.push("WARN: " + args.join(' ')),
                        error: (...args) => logs.push("ERR: " + args.join(' '))
                    };
                    
                    // Secure-ish wrapper
                    const runUserCode = new Function('console', 'input', userCode);
                    runUserCode(mockConsole, inputData);
                    
                    if (logs.length === 0) output = "Program completed with no output.";
                    else output = logs.join('\n');
                } 
                // 2. Other Languages (Simulation Logic)
                else {
                    // Check for basic keywords to ensure code looks valid
                    const code = userCode.toLowerCase();
                    const required = lang === 'python' ? 'def' : lang === 'java' ? 'class' : 'main';
                    
                    if (!code.includes(required)) {
                        throw new Error(`Syntax Error: Missing main entry point or function definition common in ${lang}.`);
                    }

                    // Parse input simulating the language's IO
                    const nums = inputData.split(/\s+/).map(Number).filter(n => !isNaN(n));
                    if (nums.length === 0) throw new Error("Runtime Error: input format mismatch (expected integers).");
                    
                    const sorted = [...nums].sort((a,b) => a - b);
                    output = `> Compiling ${lang} source...\n> Build Successful.\n> Executing...\nSorted: ${sorted.join(' ')}`;
                }

                setTerminalLines(prev => [...prev, { type: 'out', text: output }]);

            } catch (err) {
                setTerminalLines(prev => [...prev, { type: 'err', text: `Runtime Error: ${err.message}` }]);
            } finally {
                setIsExecuting(false);
            }
        }, 800);
    };

    const clearTerminal = () => {
        setTerminalLines([{ type: 'sys', text: 'Terminal cleared.' }]);
    };

    // --- STYLES ---
    const containerStyle = isDark 
        ? "bg-[#0B0C15] border border-cyan-500/20 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]" 
        : "bg-white border border-slate-300 shadow-2xl";

    const headerStyle = isDark 
        ? "bg-white/5 border-b border-white/5" 
        : "bg-slate-100 border-b border-slate-200";

    const editorBg = isDark ? "bg-[#13141f]" : "bg-white";

    return (
        <section className={`w-full max-w-7xl mx-auto rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col font-sans mb-12 animate-fadeIn ${containerStyle}`}>
            
            {/* --- TOP BAR: NAVIGATION & LANG --- */}
            <div className={`h-16 px-6 flex items-center justify-between ${headerStyle}`}>
                <div className="flex items-center gap-1 bg-black/10 p-1 rounded-lg">
                    <button 
                        onClick={() => setMode('reference')}
                        className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${mode === 'reference' ? (isDark ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-white text-slate-800 shadow') : 'opacity-50 hover:opacity-100'}`}
                    >
                        Reference
                    </button>
                    <button 
                        onClick={() => setMode('practice')}
                        className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${mode === 'practice' ? (isDark ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-white text-slate-800 shadow') : 'opacity-50 hover:opacity-100'}`}
                    >
                        Practice
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {['javascript', 'python', 'cpp', 'java', 'c'].map(l => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`hidden md:block px-3 py-1 rounded text-xs font-mono font-semibold uppercase border transition-all
                                ${lang === l 
                                    ? (isDark ? 'border-cyan-500/50 text-cyan-400 bg-cyan-900/10' : 'border-purple-500 text-purple-600 bg-purple-50')
                                    : (isDark ? 'border-transparent text-gray-500 hover:text-gray-300' : 'border-transparent text-slate-400 hover:text-slate-600')}`}
                        >
                            {l === 'javascript' ? 'JS' : l}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex flex-col md:flex-row h-[700px] md:h-[600px]">
                
                {/* --- LEFT: EDITOR / CODE DISPLAY --- */}
                <div className={`flex-1 flex flex-col relative overflow-hidden ${editorBg}`}>
                    
                    {/* Toolbar */}
                    <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 select-none">
                        <div className="flex items-center gap-2 text-xs opacity-50">
                            <Icon name="code" className="w-3 h-3" />
                            <span>{lang === 'javascript' ? 'solution.js' : lang === 'python' ? 'main.py' : lang === 'java' ? 'Main.java' : 'main.cpp'}</span>
                        </div>
                        
                        {mode === 'reference' && (
                            <div className="flex items-center gap-1">
                                <button onClick={() => setShowComments(!showComments)} className={`p-1.5 rounded hover:bg-white/10 text-gray-400 transition ${!showComments ? 'opacity-50' : ''}`} title="Toggle Comments">
                                    <Icon name="comment" />
                                </button>
                                <button onClick={handlePrint} className="p-1.5 rounded hover:bg-white/10 text-gray-400 transition" title="Print Code">
                                    <Icon name="print" />
                                </button>
                                <button onClick={handleDownload} className="p-1.5 rounded hover:bg-white/10 text-gray-400 transition" title="Download File">
                                    <Icon name="download" />
                                </button>
                                <button onClick={handleCopy} className="p-1.5 rounded hover:bg-white/10 text-gray-400 transition" title="Copy Code">
                                    {justCopied ? <Icon name="check" className="text-green-500"/> : <Icon name="copy" />}
                                </button>
                            </div>
                        )}
                        {mode === 'practice' && (
                             <div className="flex items-center gap-2">
                                <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-600' : 'text-slate-300'}`}>Editable Mode</span>
                             </div>
                        )}
                    </div>

                    {/* Editor Surface */}
                    <div className="flex-1 relative overflow-auto custom-scrollbar">
                        <div className="absolute inset-0 flex min-h-full">
                            {/* Line Numbers */}
                            <div className={`w-12 py-4 text-right pr-4 select-none opacity-20 text-xs font-mono leading-6 border-r border-white/5 ${isDark ? 'text-white' : 'text-black'}`}>
                                {(mode === 'reference' ? getCleanCode() : userCode).split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                            </div>
                            
                            {/* Code Content */}
                            <div className="flex-1 relative">
                                {mode === 'reference' ? (
                                    <div className="p-4 overflow-visible">
                                        <Highlight code={getCleanCode()} lang={lang} isDark={isDark} />
                                    </div>
                                ) : (
                                    <textarea
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value)}
                                        spellCheck="false"
                                        className={`w-full h-full p-4 bg-transparent resize-none outline-none font-mono text-xs md:text-sm leading-6 whitespace-pre ${isDark ? 'text-gray-300 caret-cyan-500' : 'text-slate-700 caret-purple-600'}`}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: TERMINAL & IO (Unified Terminal) --- */}
                {mode === 'practice' && (
                    <div className={`h-[40%] md:h-full md:w-[400px] flex flex-col border-t md:border-t-0 md:border-l ${isDark ? 'border-white/10 bg-[#0F1019]' : 'border-slate-200 bg-slate-50'}`}>
                        
                        {/* Terminal Header */}
                        <div className={`h-10 flex items-center justify-between px-4 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                                <Icon name="terminal" className="w-3 h-3" /> Console / Shell
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={executeCode}
                                    disabled={isExecuting}
                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all
                                        ${isExecuting 
                                            ? 'bg-gray-700 text-gray-500 cursor-wait' 
                                            : (isDark ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white')
                                        }`}
                                >
                                    {isExecuting ? '...' : 'Run'}
                                </button>
                                <button onClick={clearTerminal} className="p-1.5 hover:bg-white/10 rounded text-gray-500" title="Clear">
                                    <Icon name="trash" className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Unified Terminal Output & Input */}
                        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 custom-scrollbar bg-black/20" onClick={() => document.getElementById('term-input').focus()}>
                            {terminalLines.map((line, i) => (
                                <div key={i} className={`break-words ${
                                    line.type === 'err' ? 'text-red-400' : 
                                    line.type === 'out' ? 'text-emerald-400' :
                                    line.type === 'in' ? 'text-cyan-400 opacity-80' : 
                                    'text-gray-500'
                                }`}>
                                    {line.type === 'in' && <span className="mr-2 text-cyan-600">$</span>}
                                    {line.type === 'err' && <span className="mr-2">⚠</span>}
                                    {line.text}
                                </div>
                            ))}
                            
                            {/* Integrated Input Line */}
                            <div className="flex items-center gap-2 text-cyan-400 pt-2 border-t border-white/5 mt-2">
                                <span className="text-cyan-600 font-bold">$</span>
                                <input
                                    id="term-input"
                                    type="text"
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    placeholder="Type input here..."
                                    className={`flex-1 bg-transparent border-none focus:ring-0 outline-none font-mono text-xs ${isDark ? 'text-white placeholder-gray-700' : 'text-slate-800 placeholder-slate-400'}`}
                                    onKeyDown={(e) => e.key === 'Enter' && executeCode()}
                                    autoComplete="off"
                                />
                            </div>
                            <div ref={terminalEndRef} />
                        </div>
                    </div>
                )}
                
                {mode === 'reference' && (
                    <div className={`hidden md:flex md:w-[250px] border-l ${isDark ? 'border-white/10 bg-[#0F1019]' : 'border-slate-200 bg-slate-50'} flex-col p-6`}>
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">Quick Stats</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="text-xs opacity-50 mb-1">Language</div>
                                <div className={`text-lg font-mono ${isDark ? 'text-cyan-400' : 'text-purple-600'}`}>
                                    {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs opacity-50 mb-1">Complexity</div>
                                <div className="text-sm font-mono">O(n²) Avg</div>
                            </div>
                            <div>
                                <div className="text-xs opacity-50 mb-1">Lines</div>
                                <div className="text-sm font-mono">{REF_CODE[lang].split('\n').length} lines</div>
                            </div>
                            <div className={`p-3 rounded border text-xs leading-relaxed opacity-70 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                                <Icon name="bug" className="inline mr-1 mb-0.5" />
                                <strong>Note:</strong> Comments are gray, directives like #include are colored. Toggle icon to hide comments.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// ==========================================
// --- 5. MAIN VISUALIZER CONTAINER ---
// ==========================================

const BubbleSortVisualizer = () => {
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

  const displayedStep = steps[currentStep] || {};
  const highlightsToDisplay = displayedStep.highlights || [];
  const sortedToDisplay = displayedStep.sorted || [];
  const currentDisplayedStepForViz = [displayedStep];
  const getTabClass = (tabName) => activeTab === tabName ? "text-purple-500 border-b-2 border-purple-500" : (isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-purple-600");

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}>
      {/* Background System */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`} style={{ backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>

     <main className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center">
     {/* Header Section: Aligned Path and Header */}
     <header className="w-full max-w-7xl mx-auto py-10 animate-fadeIn relative mb-8 mt-15">
        <div className="flex flex-col md:flex-row md:items-start md:justify-center relative">
            {/* Breadcrumb - Absolute Left on Desktop */}
            <div className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1">
                <Breadcrumb isDark={isDark} />
            </div>

            {/* Center Content */}
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
                  <GlossyButton onClick={handleCopy} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Icon name="copy" className="w-4 h-4" /><span>{copyTooltipText}</span></GlossyButton>
                  <GlossyButton onClick={handleShare} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Icon name="share" className="w-4 h-4" /><span>Share</span></GlossyButton>
                </div>
            </div>
        </div>
      </header>

      <div className="w-full space-y-6 mt-6">
        <div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("visualization")}`} onClick={() => setActiveTab("visualization")}>Visualization</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("explanation")}`} onClick={() => setActiveTab("explanation")}>Explanation</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("code")}`} onClick={() => setActiveTab("code")}>Code & Practice</button>
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
                <Controls
                  isFinished={isFinished} isPaused={isPaused} isSorting={isSorting}
                  currentStep={currentStep} steps={steps} speed={speed}
                  customInput={customInput} sortOrder={sortOrder} toggleSorting={toggleSorting}
                  stepBackward={stepBackward} stepForward={stepForward} handleReset={handleReset}
                  loadExampleArray={loadExampleArray} toggleSortOrder={toggleSortOrder}
                  setSpeed={setSpeed} setCustomInput={setCustomInput} handleCustomArray={handleCustomArray}
                  isDark={isDark}
                />
              </div>
            </div>
            <div className="mt-6">
                <LogView
                    steps={steps}
                    currentStep={currentStep}
                    goToStep={goToStep}
                    logViewRef={logViewRef}
                    isDark={isDark}
                />
            </div>
          </div>
        ) : activeTab === "explanation" ? (
          <ExplanationTab isDark={isDark} />
        ) : (
          <ModernCodeEcosystem isDark={isDark} />
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