import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

// --- THEME UTILS ---
const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    x: [0, 50, 0],
    y: [0, -50, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

// --- ICON COMPONENT ---
const Icon = ({ name, className = "w-4 h-4" }) => {
  const icons = {
    select: <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />,
    home: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />,
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
    copy: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6m4-3 5 5-5 5m5-5H9" />,
    code: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" />,
    time: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    space: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    xmark: <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
        <div className={`absolute -inset-0.5 ${gradientClasses} rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition duration-300 ${disabled ? 'hidden' : ''} ${pulse ? 'animate-pulse' : ''}`} />
        <button onClick={onClick} disabled={disabled} className={`relative w-full h-full p-px text-sm font-semibold rounded-2xl overflow-hidden transition-all duration-300 ${!disabled ? gradientClasses : 'bg-gray-500/50'} ${isDark ? 'text-gray-200' : 'text-white'} disabled:cursor-not-allowed`}>
            <div className={`relative w-full h-full flex items-center justify-center gap-2 px-3 py-2.5 backdrop-blur-sm rounded-[15px] transition-colors duration-300 ${isDark ? 'bg-gray-900/80 group-hover:bg-gray-900/70' : 'bg-white/10 group-hover:bg-white/20'}`}>
                <span className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                <span className="relative z-10 flex items-center justify-center gap-2 shadow-sm text-shadow">{children}</span>
            </div>
        </button>
    </div>
);

// --- BREADCRUMB ---
const Breadcrumb = ({ isDark }) => (
  <nav aria-label="Breadcrumb">
    <ol className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
      <li><a href="/" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}><Icon name="home" className="w-4 h-4" /><span className="hidden sm:inline">Home</span></a></li>
      <li><Icon name="chevronRight" className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} /></li>
      <li><a href="/algorithms" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}><Icon name="grid" className="w-4 h-4" /><span className="hidden sm:inline">Dashboard</span></a></li>
      <li><Icon name="chevronRight" className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} /></li>
      <li><div className={`flex items-center gap-2 px-3 py-1 rounded-lg border backdrop-blur-md cursor-default ${isDark ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}><Icon name="select" className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} /><span className="font-semibold">Selection Sort</span></div></li>
    </ol>
  </nav>
);

// --- HELPERS ---
const AnimatedNumber = ({ value }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const prevValueRef = useRef(value);
    useEffect(() => {
      const previousValue = prevValueRef.current;
      let startTime; const animationDuration = 300; 
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
      <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}><Icon name="chart"/>Complexity Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3 rounded-lg border border-indigo-700/50"><h3 className="flex items-center gap-2 text-xs text-indigo-400 mb-1"><Icon name="comparisons" className="w-4 h-4"/>Comparisons</h3><span className="text-xl font-bold text-indigo-400"><AnimatedNumber value={complexity.comparisons} /></span></div>
        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3 rounded-lg border border-pink-700/50"><h3 className="flex items-center gap-2 text-xs text-pink-400 mb-1"><Icon name="swaps" className="w-4 h-4"/>Swaps</h3><span className="text-xl font-bold text-pink-400"><AnimatedNumber value={complexity.swaps} /></span></div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-3 rounded-lg border border-purple-700/50"><h3 className="flex items-center gap-2 text-xs text-purple-400 mb-1"><Icon name="passes" className="w-4 h-4"/>Passes</h3><span className="text-xl font-bold text-purple-400"><AnimatedNumber value={complexity.passes} /></span></div>
      </div>
    </section>
  );
};

const Controls = ({ isFinished, isPaused, isSorting, currentStep, steps, speed, customInput, sortOrder, toggleSorting, stepBackward, stepForward, handleReset, loadExampleArray, toggleSortOrder, setSpeed, setCustomInput, handleCustomArray, isDark }) => {
    const isPlayPauseDisabled = isFinished;
    const isBackDisabled = currentStep <= 0;
    const isNextDisabled = currentStep >= steps.length - 1;
    const isSortOrderDisabled = isSorting;
    const isCustomInputDisabled = isSorting;
    const playPauseStyles = !isPaused ? { gradient: "bg-gradient-to-r from-yellow-400 to-orange-500" } : { gradient: "bg-gradient-to-r from-green-400 to-emerald-500" };
    const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    const textClass = isDark ? "text-gray-300" : "text-slate-700";
    const labelClass = isDark ? "text-gray-400" : "text-slate-500";
    const inputClass = isDark ? "bg-gray-900/80 border-white/10 text-white focus:ring-purple-500 disabled:bg-gray-800/50" : "bg-white border-slate-200 text-slate-800 focus:ring-purple-500 disabled:bg-slate-100 disabled:text-slate-400";

    return (
      <section className={`${cardClass} rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20 h-full`}>
        <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${textClass}`}><Icon name="controls"/>Controls</h2>
        <div className="flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2"><GlossyButton onClick={toggleSorting} disabled={isPlayPauseDisabled} gradientClasses={playPauseStyles.gradient} className="w-full" isDark={isDark}>{!isPaused ? <><Icon name="pause"/>Pause</> : <><Icon name="play"/>Play</>}</GlossyButton></div>
              <GlossyButton onClick={handleReset} gradientClasses="bg-gradient-to-r from-red-500 to-pink-500" className="w-full" isDark={isDark}><Icon name="arrow-refresh" /></GlossyButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlossyButton onClick={stepBackward} disabled={isBackDisabled} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" className="w-full" isDark={isDark}><Icon name="stepBack"/>Back</GlossyButton>
              <GlossyButton onClick={stepForward} disabled={isNextDisabled} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" className="w-full" isDark={isDark}>Next<Icon name="stepForward"/></GlossyButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlossyButton onClick={loadExampleArray} gradientClasses="bg-gradient-to-r from-indigo-500 to-purple-500" className="w-full" isDark={isDark}><Icon name="example"/>Example</GlossyButton>
              <GlossyButton onClick={toggleSortOrder} disabled={isSortOrderDisabled} gradientClasses="bg-gradient-to-r from-teal-400 to-cyan-500" className="w-full" isDark={isDark}><Icon name="sortOrder" />{sortOrder === 'ascending' ? 'Asc' : 'Desc'}</GlossyButton>
            </div>
            <div className={`space-y-3 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}><label htmlFor="custom-input" className={`text-xs ${labelClass}`}>Custom Array (comma-separated)</label><input id="custom-input" type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="e.g. 5, 3, 8" disabled={isCustomInputDisabled} className={`w-full px-4 py-2 border text-sm rounded-2xl focus:ring-2 focus:outline-none ${inputClass}`} /><GlossyButton onClick={handleCustomArray} disabled={isCustomInputDisabled} gradientClasses="bg-gradient-to-r from-purple-500 to-pink-500" className="w-full" isDark={isDark}>Apply Array</GlossyButton></div>
            <div className={`space-y-2 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}><label htmlFor="speed-slider" className={`text-xs ${labelClass}`}>Animation Speed</label><div className="flex items-center gap-3"><input id="speed-slider" type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(e.target.value)} className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDark ? "bg-gray-700" : "bg-slate-300"}`} /><span className={`text-xs font-medium w-10 ${textClass}`}>{speed}%</span></div></div>
          </div>
        </div>
      </section>
    );
};

const VisualizationArea = ({ array, sorted, sortOrder, currentMinIndex, highlightedComparison, steps, isDark }) => {
    const [elementPositions, setElementPositions] = useState({});
    const [overlayContent, setOverlayContent] = useState({ show: false, x1: 0, x2: 0, y: 0, message: '', type: 'compare' });
    const [overlayPosition, setOverlayPosition] = useState({ clampedMidX: 0, opacity: 0 });
    
    const containerRef = useRef(null);
    const messageBoxRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    // --- 1. Position Setup ---
    useEffect(() => {
        const newPositions = {};
        array.forEach((item, index) => {
            newPositions[item.id] = index;
        });
        setElementPositions(newPositions);
    }, [array]);

    // --- 2. Layout Constants ---
    const elementWidth = 64;
    const elementHeight = 64;
    const elementGap = 8;
    
    // Animation Heights
    const highlightLift = 20; 
    const swapLift = 60;      
    const messageBoxVerticalOffset = 150; 
    const lineTargetVerticalOffset = 8; 

    const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

    // --- 3. Animation Logic ---
    useEffect(() => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

        const currentStepData = steps[0];
        if (!currentStepData || !containerRef.current) {
            setOverlayContent(prev => ({ ...prev, show: false }));
            return;
        }

        const currentStepType = currentStepData.type;
        
        if (currentStepType === 'compare' && highlightedComparison.length === 1) {
            const compareIdx = highlightedComparison[0];
            const minIdx = currentMinIndex !== null ? currentMinIndex : compareIdx;
            
            const compareCenter = (compareIdx * (elementWidth + elementGap)) + (elementWidth / 2);
            const minCenter = (minIdx * (elementWidth + elementGap)) + (elementWidth / 2);

            setOverlayContent({
                show: true,
                x1: minCenter, 
                x2: compareCenter, 
                y: (elementHeight / 2) - highlightLift,
                message: currentStepData.message,
                type: 'compare'
            });
            
        } else if (currentStepType === 'swap') {
            const [idx1, idx2] = highlightedComparison;
            const x1 = (idx1 * (elementWidth + elementGap)) + (elementWidth / 2);
            const x2 = (idx2 * (elementWidth + elementGap)) + (elementWidth / 2);

            setOverlayContent({
                show: true,
                x1: x1,
                x2: x2,
                y: (elementHeight / 2) - swapLift,
                message: currentStepData.message,
                type: 'swap'
            });

        } else if (currentStepType === 'newMin') {
             const minIdx = currentMinIndex;
             const minCenter = (minIdx * (elementWidth + elementGap)) + (elementWidth / 2);
             setOverlayContent({
                show: true,
                x1: minCenter,
                x2: minCenter,
                y: (elementHeight / 2) - highlightLift,
                message: currentStepData.message,
                type: 'newMin'
            });

        } else if (currentStepType === 'finish') {
            setOverlayContent({
                show: true, x1: totalWidth / 2, x2: totalWidth / 2, y: 0, 
                message: currentStepData.message, type: 'finish'
            });
        } else {
            setOverlayContent(prev => ({ ...prev, show: false }));
        }

    }, [highlightedComparison, steps, array, elementPositions, currentMinIndex, totalWidth]);

    useLayoutEffect(() => {
        if (overlayContent.show && messageBoxRef.current && containerRef.current) {
            const messageBoxWidth = messageBoxRef.current.offsetWidth;
            const halfBox = messageBoxWidth / 2;
            let targetXForOverlay = (overlayContent.x1 + overlayContent.x2) / 2;
            const padding = 20;
            
            let clampedMidX = Math.max(
                halfBox + padding,
                Math.min(targetXForOverlay, totalWidth - halfBox - padding)
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
        let zIndex = 1;
        let scale = 1;
        let rotate = 0;
        let opacity = 1;

        let dynamicBoxShadow = isDark ? '0 0 10px rgba(0,0,0,0.5)' : '0 4px 6px rgba(0,0,0,0.1)';

        const currentStepType = steps[0]?.type;
        const isSwapping = currentStepType === 'swap' && highlightedComparison.includes(elementPositions[item.id]);
        
        if (isSwapping) {
            // SWAP ANIMATION: Calculate destination
            const [idx1, idx2] = highlightedComparison;
            const myCurrentIdx = elementPositions[item.id];
            const targetIdx = (myCurrentIdx === idx1) ? idx2 : idx1;
            targetX = targetIdx * (elementWidth + elementGap);
            
            targetY = -swapLift;
            zIndex = 50;
            scale = 1.15;
            dynamicBoxShadow = isDark 
                ? '0 0 0 4px rgba(236, 72, 153, 0.8), 0 20px 25px -5px rgba(236, 72, 153, 0.4)' 
                : '0 0 0 4px rgba(236, 72, 153, 0.6), 0 20px 25px -5px rgba(236, 72, 153, 0.3)';
                
        } else if (elementPositions[item.id] === currentMinIndex && currentMinIndex !== null) {
            // MINIMUM INDICATOR
            targetY = -highlightLift;
            zIndex = 40;
            scale = 1.1;
            dynamicBoxShadow = isDark 
                ? '0 0 0 4px rgba(168, 85, 247, 0.8), 0 15px 20px -5px rgba(168, 85, 247, 0.4)'
                : '0 0 0 4px rgba(168, 85, 247, 0.6), 0 15px 20px -5px rgba(168, 85, 247, 0.2)';
        } else if (highlightedComparison.includes(elementPositions[item.id]) && currentStepType === 'compare') {
            // SCANNER
            targetY = -highlightLift; 
            zIndex = 30; 
            scale = 1.05;
            dynamicBoxShadow = isDark
                ? '0 0 0 4px rgba(245, 158, 11, 0.8)'
                : '0 0 0 4px rgba(245, 158, 11, 0.6)';
        }

        return {
            transform: `translate(${targetX}px, ${targetY}px) rotate(${rotate}deg) scale(${scale})`,
            boxShadow: dynamicBoxShadow,
            zIndex: zIndex,
            opacity: opacity,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, opacity 0.3s ease' 
        };
    };

    const getElementClassName = (item) => {
        const idx = elementPositions[item.id];
        const isSorted = sorted.includes(idx);
        const isMin = idx === currentMinIndex;
        const currentStepType = steps[0]?.type;
        const isSwapping = currentStepType === 'swap' && highlightedComparison.includes(idx);
        const isComparing = currentStepType === 'compare' && highlightedComparison.includes(idx) && !isMin;
        
        let classes = `absolute flex items-center justify-center w-16 h-16 rounded-xl font-bold text-xl border-2 transition-colors duration-300 `;

        if (isSwapping) {
             classes += isDark ? 'bg-pink-600 border-pink-400 text-white' : 'bg-pink-100 border-pink-400 text-pink-700';
        } else if (isMin) {
            classes += isDark ? 'bg-purple-600 border-purple-400 text-white' : 'bg-purple-100 border-purple-400 text-purple-700';
        } else if (isComparing) {
             classes += isDark ? 'bg-amber-900 border-amber-500 text-amber-100' : 'bg-amber-100 border-amber-400 text-amber-700';
        } else if (isSorted) {
            classes += isDark ? 'bg-emerald-900/80 border-emerald-600/50 text-emerald-100' : 'bg-emerald-100 border-emerald-300 text-emerald-700';
        } else {
            classes += isDark ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-white border-slate-300 text-slate-600';
        }
        return classes;
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
        const arrayCenterY = containerRect.height / 2;
        return arrayCenterY + relativeY;
    }

    const getLineTargetY = (isLifted) => {
        let liftAmount = isLifted ? -highlightLift : 0;
        if (steps[0]?.type === 'swap' && isLifted) liftAmount = -swapLift;
        return getAbsoluteY(liftAmount - (elementHeight/2) - lineTargetVerticalOffset);
    }

    const messageBoxAbsoluteY = getAbsoluteY(-highlightLift - messageBoxVerticalOffset + 40); 
    
    const containerClasses = isDark 
        ? "bg-[#0f0f11] border-white/5"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";
    const gridColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";
    const titleClass = isDark ? "text-gray-300" : "text-slate-700";

    return (
        <section className={`${containerClasses} rounded-xl p-6 border shadow-xl h-full flex flex-col min-h-[32rem] relative overflow-hidden backdrop-blur-sm`}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at center, ${gridColor} 1px, transparent 1px)`, backgroundSize: "24px 24px" }}></div>
            <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}>
                <Icon name="visualization" />
                Animated Array
            </h2>
            <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-visible perspective-1000">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 transition-opacity duration-300" style={{ opacity: overlayPosition.opacity }}>
                    <div ref={messageBoxRef} className="absolute transition-transform duration-300 ease-out"
                         style={{ top: messageBoxAbsoluteY, left: getAbsoluteX(overlayPosition.clampedMidX), transform: `translateX(-50%)` }}>
                        <div className={`font-semibold px-4 py-2 rounded-lg shadow-xl border text-center text-sm max-w-xs backdrop-blur-md
                            ${overlayContent.type === 'compare' ? (isDark ? 'bg-amber-900/60 border-amber-500/50 text-amber-200' : 'bg-amber-100 border-amber-300 text-amber-800') : ''}
                            ${overlayContent.type === 'newMin' ? (isDark ? 'bg-purple-900/60 border-purple-500/50 text-purple-200' : 'bg-purple-100 border-purple-300 text-purple-800') : ''}
                            ${overlayContent.type === 'swap' ? (isDark ? 'bg-pink-900/60 border-pink-500/50 text-pink-200' : 'bg-pink-100 border-pink-300 text-pink-800') : ''}
                            ${overlayContent.type === 'finish' ? (isDark ? 'bg-green-900/60 border-green-500/50 text-green-200' : 'bg-green-100 border-green-300 text-green-800') : ''}
                        `}>
                            {overlayContent.message}
                            <div className="absolute left-1/2 -bottom-2 w-3 h-3 bg-current transform -translate-x-1/2 rotate-45 border-r border-b border-inherit opacity-50"></div>
                        </div>
                    </div>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
                    {overlayContent.show && messageBoxRef.current && (
                        <g className="overlay-connectors transition-opacity duration-300" style={{ opacity: overlayPosition.opacity }}>
                            <path
                                d={`M ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight} 
                                   C ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight + 20},
                                     ${getAbsoluteX(overlayContent.x1)} ${getLineTargetY(true) - 20},
                                     ${getAbsoluteX(overlayContent.x1)} ${getLineTargetY(true)}`}
                                fill="none"
                                stroke={isDark ? "rgba(168, 85, 247, 0.8)" : "rgba(147, 51, 234, 0.6)"} 
                                strokeWidth="2" 
                                strokeDasharray={overlayContent.type === 'swap' ? "0" : "4 4"}
                                className="animate-dash" 
                            />
                            {overlayContent.x1 !== overlayContent.x2 && (
                                <path
                                    d={`M ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight} 
                                       C ${getAbsoluteX(overlayPosition.clampedMidX)} ${messageBoxAbsoluteY + messageBoxRef.current.offsetHeight + 20},
                                         ${getAbsoluteX(overlayContent.x2)} ${getLineTargetY(true) - 20},
                                         ${getAbsoluteX(overlayContent.x2)} ${getLineTargetY(true)}`}
                                    fill="none"
                                    stroke={isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.4)"} 
                                    strokeWidth="1.5" 
                                />
                            )}
                             <circle cx={getAbsoluteX(overlayContent.x1)} cy={getLineTargetY(true)} r="3" fill={overlayContent.type === 'swap' ? "#ec4899" : (isDark ? "#d8b4fe" : "#9333ea")} />
                             {overlayContent.x1 !== overlayContent.x2 && (
                                <circle cx={getAbsoluteX(overlayContent.x2)} cy={getLineTargetY(true)} r="3" fill={overlayContent.type === 'swap' ? "#ec4899" : (isDark ? "#94a3b8" : "#64748b")} />
                             )}
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

            <div className={`mt-4 flex flex-wrap justify-center gap-4 text-xs font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                <span className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded-full ${isDark ? "bg-emerald-800" : "bg-emerald-200"}`}></span> Sorted</span>
                <span className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-300"}`}></span> Unsorted</span>
                <span className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded-full ${isDark ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" : "bg-purple-500"}`}></span> Current Min</span>
                 <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span> Scanner</span>
                 <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></span> Swapping</span>
            </div>
        </section>
    );
};

const LogView = ({ steps, currentStep, goToStep, logViewRef, isDark }) => {
  const getStepStyle = (type) => {
    const styles = {
      start: "bg-indigo-600/90", 
      pass: "bg-blue-600/90",
      compare: "bg-yellow-500/90",
      newMin: "bg-purple-600/90", 
      swap: "bg-pink-600/90", 
      finish: "bg-teal-600/90"
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
        <h2 className={`flex items-center gap-2 text-lg font-semibold ${titleClass}`}><Icon name="info"/>Algorithm Execution Log</h2>
        <span className={`text-xs ${subTextClass}`}>Step {currentStep + 1} of {steps.length}</span>
      </div>
      <div ref={logViewRef} className="relative max-h-96 overflow-y-auto pr-2 space-y-2">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const logMessageStyle = `m-2 p-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${getStepStyle(step.type)} ${
            isCurrent ? 'ring-2 ring-offset-2 ring-purple-400 opacity-100' : 'opacity-70 hover:opacity-100'
          } ${isCurrent && !isDark ? 'ring-offset-slate-100' : 'ring-offset-gray-800'}`;

          return (
            <div key={index} data-step-index={index} onClick={() => goToStep(index)} className={logMessageStyle}>
              <div className="flex items-start gap-3 m-1">
                <span className="font-bold text-white/80 pt-0.5 text-xs">{index + 1}.</span>
                <p className="text-white text-xs flex-1">{step.message}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1 px-2">
                {step.arrState.map((item, idx) => (
                  <div key={idx} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    step.highlightedComparison?.includes(idx) ? 'bg-yellow-400 text-gray-900' : 
                    step.currentMinIndex === idx ? 'bg-purple-600 text-white' :
                    step.sorted?.includes(idx) ? 'bg-green-500 text-white' : 'bg-blue-500/80 text-white'
                  }`}>{item.value}</div>
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
    if (x < padding.left || x > width - padding.right || y < padding.top || y > height - padding.bottom) { setHoverData(null); return; }
    const n = xToN(x);
    if (n >= 1 && n <= maxN) { setHoverData({ n, best: n*n, avg: n * n, worst: n * n, x: nToX(n), y }); } else { setHoverData(null); }
  };

  const getPath = (fn) => { let pts = []; for (let n = 1; n <= maxN; n++) { pts.push(`${nToX(n)},${opsToY(fn(n))}`); } return `M ${pts.join(" L ")}`; };
  const axisColor = isDark ? "white" : "#475569";
  const gridColor = isDark ? "#4b5563" : "#cbd5e1";
  const textColor = isDark ? "#d1d5db" : "#475569";
  const containerClass = isDark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-slate-200 shadow-xl";
  const titleClass = isDark ? "text-gray-100" : "text-slate-800";

  return (
    <div className={`${containerClass} p-4 rounded-2xl border relative`}>
      <h3 className={`text-xl font-bold text-center mb-4 ${titleClass}`}>Selection Sort Time Complexity</h3>
      <div ref={graphRef} className="relative w-full h-[450px] cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
        <svg width={width} height={height}>
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          {[0, 150, 300, 450, 600].map((val) => (<g key={val}><text x={padding.left - 10} y={opsToY(val) + 4} textAnchor="end" className="text-xs" fill={textColor}>{val}</text><line x1={padding.left} y1={opsToY(val)} x2={width - padding.right} y2={opsToY(val)} stroke={gridColor} strokeDasharray="3 3" /></g>))}
          <text x="20" y={height / 2} transform={`rotate(-90 20 ${height / 2})`} textAnchor="middle" className="font-medium text-sm" fill={textColor}>Operations</text>
          {[1, 5, 10, 15, 20, 25].map((val) => (<g key={val}><text x={nToX(val)} y={height - padding.bottom + 18} textAnchor="middle" className="text-xs" fill={textColor}>{val}</text><line x1={nToX(val)} y1={height - padding.bottom} x2={nToX(val)} y2={height - padding.bottom + 6} stroke={axisColor} /></g>))}
          <text x={padding.left + (width - padding.left - padding.right) / 2} y={height - 10} textAnchor="middle" className="font-medium text-sm" fill={textColor}>Input Size (n)</text>
          <path d={getPath((n) => n * n)} fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
          <text x={nToX(maxN) + 5} y={opsToY(maxN * maxN) - 3} textAnchor="start" className="fill-red-500 text-xs">All Cases O(n²)</text>
          {hoverData && (<g><line x1={hoverData.x} y1={padding.top} x2={hoverData.x} y2={height - padding.bottom} stroke={axisColor} strokeDasharray="4 4" opacity="0.6" /><circle cx={hoverData.x} cy={opsToY(hoverData.worst)} r={5} fill="#ef4444" stroke="white" strokeWidth="1.5" className="transition-all duration-300 ease-out" />
              {(() => {
                const boxWidth = 120; const boxHeight = 70; let tooltipX = hoverData.x + 15; let tooltipY = opsToY(hoverData.worst) - boxHeight - 10;
                if (tooltipX + boxWidth > width - padding.right) tooltipX = hoverData.x - boxWidth - 15; tooltipX = Math.max(padding.left, tooltipX); if (tooltipY < padding.top) tooltipY = opsToY(hoverData.worst) + 15; if (tooltipY + boxHeight > height - padding.bottom) tooltipY = height - padding.bottom - boxHeight;
                return (<g transform={`translate(${tooltipX}, ${tooltipY})`} className="transition-transform duration-100 ease-out"><rect x="0" y="0" width={boxWidth} height={boxHeight} rx="6" fill={isDark ? "black" : "white"} stroke={isDark ? "none" : "#cbd5e1"} opacity="0.9" /><text x="8" y="18" className="text-xs" fill={isDark ? "white" : "black"}>n = {hoverData.n}</text><text x="8" y="34" className="fill-red-500 text-xs">Best: {hoverData.best}</text><text x="8" y="48" className="fill-red-500 text-xs">Avg: {Math.round(hoverData.avg )}</text><text x="8" y="62" className="fill-red-500 text-xs">Worst: {hoverData.worst}</text></g>);
              })()}
            </g>)}
        </svg>
      </div>
    </div>
  );
};

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
            {!isSummary && (<div className="w-full flex items-center justify-center gap-3 md:gap-6 mt-2"><div className="flex items-center justify-center gap-2">{before.map((val, idx) => <div key={`before-${idx}`} className={getItemClass(idx, val, 'before')}>{val}</div>)}</div>{after && <Icon name="stepForward" className="w-8 h-8 text-gray-400 shrink-0"/>}{after && (<div className="flex items-center justify-center gap-2">{after.map((val, idx) => <div key={`after-${idx}`} className={getItemClass(idx, val, 'after')}>{val}</div>)}</div>)}</div>)}
            {isSummary && (<div className="w-full flex items-center justify-center gap-2 mt-2">{before.map((val, idx) => <div key={`summary-${idx}`} className={getItemClass(idx, val, 'summary')}>{val}</div>)}</div>)}
        </div>
    );
};

const ExplanationTab = ({ isDark }) => {
    // Detailed walkthrough data for the specific example [64, 25, 12, 22, 11]
    const walkthroughData = [
        { 
            type: 'initial', 
            before: [64, 25, 12, 22, 11], 
            description: 'We begin with an unsorted array. The goal of Selection Sort is to divide this list into two parts: the sorted part (on the left) and the unsorted part (on the right).' 
        },
        { 
            type: 'pass', 
            text: 'Pass 1: Finding the minimum in the entire array' 
        },
        { 
            type: 'step', 
            before: [64, 25, 12, 22, 11], 
            after: [64, 25, 12, 22, 11], 
            comparing: [0, 1], 
            swapped: [], 
            sorted: [], 
            description: '1. Start with the first element (64) as the current minimum. Compare it with the next element (25). Since 25 < 64, update minimum to 25.' 
        },
        { 
            type: 'step', 
            before: [64, 25, 12, 22, 11], 
            after: [64, 25, 12, 22, 11], 
            comparing: [1, 2], 
            swapped: [], 
            sorted: [], 
            description: '2. Current min is 25. Compare with 12. Since 12 < 25, update minimum to 12.' 
        },
        { 
            type: 'step', 
            before: [64, 25, 12, 22, 11], 
            after: [64, 25, 12, 22, 11], 
            comparing: [2, 3], 
            swapped: [], 
            sorted: [], 
            description: '3. Current min is 12. Compare with 22. 12 < 22, so the minimum stays 12.' 
        },
        { 
            type: 'step', 
            before: [64, 25, 12, 22, 11], 
            after: [64, 25, 12, 22, 11], 
            comparing: [2, 4], 
            swapped: [], 
            sorted: [], 
            description: '4. Current min is 12. Compare with 11. Since 11 < 12, update minimum to 11.' 
        },
        { 
            type: 'step', 
            before: [64, 25, 12, 22, 11], 
            after: [11, 25, 12, 22, 64], 
            comparing: [0, 4], 
            swapped: [0, 4], 
            sorted: [0], 
            description: '5. End of pass. The smallest element found was 11. Swap it with the first unsorted position (64).' 
        },
        { 
            type: 'summary', 
            before: [11, 25, 12, 22, 64], 
            sorted: [0], 
            description: 'Pass 1 Complete: The number 11 is now in its correct sorted position.', 
            isSummary: true 
        },
        { 
            type: 'pass', 
            text: 'Pass 2: Finding minimum from index 1 to 4' 
        },
        { 
            type: 'step', 
            before: [11, 25, 12, 22, 64], 
            after: [11, 25, 12, 22, 64], 
            comparing: [1, 2], 
            swapped: [], 
            sorted: [0], 
            description: '1. Set current min to index 1 (25). Compare with 12. 12 < 25, update minimum to 12.' 
        },
        { 
            type: 'step', 
            before: [11, 25, 12, 22, 64], 
            after: [11, 25, 12, 22, 64], 
            comparing: [2, 3], 
            swapped: [], 
            sorted: [0], 
            description: '2. Current min is 12. Compare with 22. No change.' 
        },
        { 
            type: 'step', 
            before: [11, 25, 12, 22, 64], 
            after: [11, 12, 25, 22, 64], 
            comparing: [1, 2], 
            swapped: [1, 2], 
            sorted: [0, 1], 
            description: '3. End of pass. Smallest remaining is 12. Swap it with current starting position (25).' 
        },
        { 
            type: 'summary', 
            before: [11, 12, 25, 22, 64], 
            sorted: [0, 1], 
            description: 'Pass 2 Complete: The first two elements [11, 12] are sorted.', 
            isSummary: true 
        },
        { 
            type: 'pass', 
            text: 'Pass 3: Finding minimum from index 2 to 4' 
        },
        { 
            type: 'step', 
            before: [11, 12, 25, 22, 64], 
            after: [11, 12, 22, 25, 64], 
            comparing: [2, 3], 
            swapped: [2, 3], 
            sorted: [0, 1, 2], 
            description: 'We find that 22 is the smallest among [25, 22, 64]. Swap 25 and 22.' 
        },
        { 
            type: 'pass', 
            text: 'Pass 4: Final Comparison' 
        },
        { 
            type: 'step', 
            before: [11, 12, 22, 25, 64], 
            after: [11, 12, 22, 25, 64], 
            comparing: [3, 4], 
            swapped: [], 
            sorted: [0, 1, 2, 3], 
            description: 'Compare 25 and 64. 25 is smaller. It stays in place.' 
        },
        { 
            type: 'final', 
            before: [11, 12, 22, 25, 64], 
            sorted: [0, 1, 2, 3, 4], 
            description: 'The array is now fully sorted! Note that for N elements, we only need N-1 passes.', 
            isSummary: true 
        },
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
                
                {/* Introduction Section */}
                <div className={sectionClasses}>
                    <h2 className="flex items-center justify-center gap-3 text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        <Icon name="select" className="w-6 h-6 text-purple-400"/>What is Selection Sort?
                    </h2>
                    <p className={`text-sm text-center leading-relaxed ${textColor}`}>
                        Selection Sort is a straightforward sorting algorithm that works by repeatedly <strong>selecting</strong> the smallest (or largest) element from the unsorted portion of the list and moving it to the sorted portion. Think of it like organizing a hand of playing cards: you scan your hand for the lowest card, pull it out, and place it at the front. You then repeat this for the remaining cards until your whole hand is sorted.
                    </p>
                </div>

                {/* Step-by-Step Walkthrough */}
                <div className={sectionClasses}>
                    <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}>
                        <Icon name="example" className="w-5 h-5 text-purple-400" />
                        Detailed Step-by-Step Walkthrough
                    </h3>
                    <div className="space-y-6">
                        {walkthroughData.map((item, index) => {
                             if (item.type === 'initial') return <div key={index}><h4 className="text-lg text-center font-semibold text-purple-400 mb-2">Initial Array</h4><WalkthroughStep {...item} isSummary={true} isDark={isDark} /></div>;
                             if (item.type === 'pass') return <h4 key={index} className="text-lg text-center font-semibold text-purple-400 pt-6 border-t border-gray-700/50 mt-6">{item.text}</h4>;
                             if (item.type === 'final') return <div key={index} className="pt-4"><h4 className="text-lg text-center font-semibold text-green-500 mb-2">Final Sorted Result</h4><WalkthroughStep {...item} isDark={isDark} /></div>;
                             return <WalkthroughStep key={index} {...item} isDark={isDark} />;
                        })}
                    </div>
                </div>
                
                {/* Algorithm Logic */}
                <div className={sectionClasses}>
                    <h3 className={`flex items-center gap-3 text-lg font-bold mb-4 ${titleColor}`}>
                        <Icon name="code" className="w-5 h-5 text-purple-400" />
                        The Algorithm Logic
                    </h3>
                    <ol className={`list-decimal list-inside space-y-4 ${textColor} text-sm leading-relaxed`}>
                        <li><strong>Divide the Array</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>The array is conceptually divided into two parts: a <strong>sorted sublist</strong> (initially empty) built from left to right, and a <strong>remaining unsorted sublist</strong>.</li>
                           </ul>
                        </li>
                        <li><strong>Find the Minimum</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>Start a loop from the beginning of the unsorted sublist (index <code>i</code>).</li>
                             <li>Assume the first element (<code>i</code>) is the minimum.</li>
                             <li>Scan every subsequent element (<code>j = i + 1</code> to end). If you find an element smaller than the current minimum, update your record of the "minimum index".</li>
                           </ul>
                        </li>
                        <li><strong>Swap</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>After scanning the entire unsorted portion, if the minimum element is not already at the starting position <code>i</code>, <strong>swap</strong> the element at <code>i</code> with the minimum found.</li>
                           </ul>
                        </li>
                        <li><strong>Repeat</strong>
                           <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                             <li>Advance the sorted boundary (<code>i++</code>) and repeat until the entire array is sorted.</li>
                           </ul>
                        </li>
                    </ol>
                </div>
                
               {/* Complexity Analysis */}
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
                            Always scans the remaining n-i elements.
                          </p>
                        </div>
                        <div className="text-center p-3 bg-red-800/20 rounded-md">
                          <p className="font-bold text-lg text-red-400">O(n²)</p>
                          <p className="text-xs text-red-500">Average Case</p>
                          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
                            No early exit mechanism exists.
                          </p>
                        </div>
                        <div className="text-center p-3 bg-red-800/20 rounded-md">
                          <p className="font-bold text-lg text-red-400">O(n²)</p>
                          <p className="text-xs text-red-500">Best Case</p>
                          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
                            Even if sorted, must verify minimums.
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
                          Sorted <span className="text-sky-400">in-place</span> without extra arrays.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graph */}
                <div className={sectionClasses}>
                    <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><Icon name="visualization" className="w-5 h-5 text-purple-400"/>Interactive Performance Graph</h3>
                    <InteractiveComplexityGraph isDark={isDark} />
                </div>

                {/* Pros and Cons */}
                <div className={sectionClasses}>
                     <h3 className={`flex items-center gap-3 text-lg font-bold mb-6 ${titleColor}`}><Icon name="comparisons" className="w-5 h-5 text-purple-400"/>Pros & Cons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`p-6 rounded-lg border-l-4 border-green-500 ${innerCardClass}`}>
                            <h4 className="text-base font-semibold text-green-500 mb-4">Advantages</h4>
                            <ul className={`space-y-3 text-sm ${textColor}`}>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Minimal Writes:</strong> Unlike Bubble Sort, Selection Sort makes at most <strong>O(n)</strong> swaps. This is crucial if writing to memory is expensive (e.g., Flash memory).</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Space Efficient:</strong> It is an in-place algorithm requiring constant O(1) auxiliary memory.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Simplicity:</strong> The logic is very intuitive and easy to implement.</span></li>
                            </ul>
                        </div>
                        <div className={`p-6 rounded-lg border-l-4 border-red-500 ${innerCardClass}`}>
                            <h4 className="text-base font-semibold text-red-500 mb-4">Disadvantages</h4>
                            <ul className={`space-y-3 text-sm ${textColor}`}>
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Slow Performance:</strong> With O(n²) complexity, it is inefficient for large lists compared to algorithms like Merge Sort or Quick Sort.</span></li>
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Not Stable:</strong> The default implementation destroys the relative order of equal elements (e.g., swapping might move an earlier '5' behind a later '5').</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
// Main SelectionSortVisualizer Component
const SelectionSortVisualizer = () => {
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
  
  // Selection Sort State
  const [sortState, setSortState] = useState({ i: 0, j: 1, minIdx: 0 }); 
  const [nextAction, setNextAction] = useState('start_pass');
  const [highlightedComparison, setHighlightedComparison] = useState([]); 
  const [sortedIndices, setSortedIndices] = useState([]); 
  const [currentMinIndex, setCurrentMinIndex] = useState(null); 
  const [complexity, setComplexity] = useState({ comparisons: 0, swaps: 0, passes: 0 });
  const [exampleIndex, setExampleIndex] = useState(0);
  const [copyTooltipText, setCopyTooltipText] = useState("Copy");
  const logViewRef = useRef(null);

  // --- THEME STATE ---
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";

  const exampleArrays = [[65, 55, 45, 35, 25, 15, 10], [22, 11, 88, 33, 77, 44, 66, 55], [5, 8, 2, 10, 1, 9, 4, 7, 3, 6], [10, 20, 30, 40, 50], [10, 20, 30, 50, 40]];

  const addStep = useCallback((message, type, arr, comparisonHighlights, sorted, currentComplexity, currentSortState, currentMinIdx = null) => {
    if (isReviewingPastStep) return;
    const newStep = { 
        message, type, arrState: arr.map(item => ({...item})), 
        highlightedComparison: comparisonHighlights || [], 
        sorted: sorted || [], complexity: { ...currentComplexity }, 
        sortState: { ...currentSortState }, currentMinIndex: currentMinIdx 
    };
    setSteps(prev => [...prev, newStep]);
    setCurrentStep(prev => prev + 1);
  }, [isReviewingPastStep]);

  const runSortStep = useCallback(() => {
    let currentArr = [...array];
    const len = currentArr.length;
    let { i, j, minIdx } = sortState; 
    let currentComplexity = { ...complexity };

    // TERMINATION CHECK
    if (i >= len - 1) {
      if (!isFinished) {
        setIsFinished(true);
        // Ensure final element is also marked sorted
        const finalSorted = Array.from({ length: len }, (_, idx) => idx);
        setSortedIndices(finalSorted);
        setHighlightedComparison([]);
        setCurrentMinIndex(null);
        addStep("Sorting complete! Array is now fully sorted.", "finish", currentArr, [], finalSorted, currentComplexity, sortState, null);
      }
      return;
    }

    if (nextAction === 'start_pass') {
        minIdx = i;
        j = i + 1;
        setHighlightedComparison([]);
        setCurrentMinIndex(minIdx);
        setSortState({ i, j, minIdx });
        currentComplexity.passes++;
        setComplexity(currentComplexity);
        addStep(`Pass ${i+1}: Starting new pass. Initial minimum set to index ${minIdx} (${currentArr[minIdx].value}).`, "pass", currentArr, [], sortedIndices, currentComplexity, { i, j, minIdx }, minIdx);
        setNextAction('compare');
    }
    else if (nextAction === 'compare') {
        if (j < len) {
            currentComplexity.comparisons++;
            setComplexity(currentComplexity);
            setHighlightedComparison([j]);
            const valJ = currentArr[j].value;
            const valMin = currentArr[minIdx].value;
            
            addStep(`Comparing ${valJ} (at index ${j}) with current min ${valMin} (at index ${minIdx}).`, "compare", currentArr, [j], sortedIndices, currentComplexity, sortState, minIdx);
            
            const isSmaller = sortOrder === 'ascending' ? valJ < valMin : valJ > valMin;
            if (isSmaller) {
                setNextAction('new_min');
            } else {
                setNextAction('next_j');
            }
        } else {
            setNextAction('swap');
        }
    }
    else if (nextAction === 'new_min') {
        minIdx = j;
        setCurrentMinIndex(minIdx);
        setSortState({ i, j, minIdx }); // Update internal state with new min
        setHighlightedComparison([]);
        addStep(`Found new minimum: ${currentArr[minIdx].value} at index ${minIdx}.`, "newMin", currentArr, [], sortedIndices, currentComplexity, { i, j, minIdx }, minIdx);
        setNextAction('next_j');
    }
    else if (nextAction === 'next_j') {
        const nextJ = j + 1;
        setSortState({ i, j: nextJ, minIdx });
        if (nextJ < len) {
            setNextAction('compare');
        } else {
            setNextAction('swap');
        }
    }
    else if (nextAction === 'swap') {
        // Swap Phase
        if (minIdx !== i) {
            // Perform swap in data
            const temp = currentArr[i];
            currentArr[i] = currentArr[minIdx];
            currentArr[minIdx] = temp;
            
            // IMPORTANT: Update main array state so visualizer knows the new IDs at these positions
            setArray(currentArr); 
            
            currentComplexity.swaps++;
            setComplexity(currentComplexity);
            
            setHighlightedComparison([i, minIdx]);
            // Pass the MODIFIED array to the step so visuals update
            addStep(`Swapping ${currentArr[i].value} with ${currentArr[minIdx].value}.`, "swap", currentArr, [i, minIdx], sortedIndices, currentComplexity, sortState, minIdx);
        } else {
            addStep(`Minimum is already at the correct position. No swap needed.`, "compare", currentArr, [], sortedIndices, currentComplexity, sortState, minIdx);
        }
        
        setNextAction('finish_pass');
    }
    else if (nextAction === 'finish_pass') {
        // Mark current 'i' as sorted
        const newSorted = [...sortedIndices, i];
        setSortedIndices(newSorted);
        
        // If we are at the second to last element, the last one is automatically sorted
        if (i === len - 2) {
             setSortedIndices([...newSorted, len-1]);
        }

        const nextI = i + 1;
        // Prepare state for next pass
        setSortState({ i: nextI, j: nextI + 1, minIdx: nextI });
        setHighlightedComparison([]);
        setCurrentMinIndex(null);
        
        setNextAction('start_pass');
    }

  }, [sortState, nextAction, array, sortedIndices, complexity, addStep, sortOrder, isFinished]);

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

  const createArrayFromValues = (values) => values.map((value, index) => ({ id: `elem-${index}-${value}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, value }));
  const resetToState = (values, message) => {
    const newArray = createArrayFromValues(values);
    setArray(newArray);
    setCustomInput(values.join(', '));
    setIsSorting(false);
    setIsPaused(true);
    setIsFinished(false);
    setIsReviewingPastStep(false);
    setNextAction('start_pass');
    const initialSortState = { i: 0, j: 1, minIdx: 0 };
    setSortState(initialSortState);
    setHighlightedComparison([]);
    setSortedIndices([]);
    setCurrentMinIndex(null);
    setComplexity({ comparisons: 0, swaps: 0, passes: 0 });
    const initialStep = { message, type: "start", arrState: newArray, highlightedComparison: [], sorted: [], complexity: { comparisons: 0, swaps: 0, passes: 0 }, sortState: initialSortState, currentMinIndex: null };
    setSteps([initialStep]);
    setCurrentStep(0);
  };
  const handleReset = useCallback(() => { const newValues = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10); resetToState(newValues, "Generated a new random array. Press Play to start sorting."); }, []);
  const handleCustomArray = () => { const newValues = customInput.split(/[, ]+/).map(item => parseInt(item.trim())).filter(item => !isNaN(item) && item > 0 && item <= 100); if (newValues.length === 0 || newValues.length > 12) { alert("Please enter between 1 and 12 valid numbers (1-100)."); return; } resetToState(newValues, "Custom array loaded. Press Play to start sorting."); };
  const loadExampleArray = () => { resetToState(exampleArrays[exampleIndex], `Example array #${exampleIndex + 1} loaded. Press Play to start sorting.`); setExampleIndex(prev => (prev + 1) % exampleArrays.length); };
  const toggleSortOrder = () => !isSorting && setSortOrder(prev => (prev === 'ascending' ? 'descending' : 'ascending'));
  const toggleSorting = () => { 
    if (isFinished && isPaused) { 
        setIsFinished(false); setIsPaused(false); setIsSorting(true);
        const initialSortState = { i: 0, j: 1, minIdx: 0 };
        setSortState(initialSortState); setCurrentMinIndex(null); setHighlightedComparison([]); setSortedIndices([]); setComplexity({ comparisons: 0, swaps: 0, passes: 0 }); setNextAction('start_pass'); setSteps([]);
        addStep("Restarting sort.", "start", array, [], [], { comparisons: 0, swaps: 0, passes: 0 }, initialSortState, null);
        return;
    }
    if (isReviewingPastStep) { const lastValidStep = steps[currentStep]; if (lastValidStep) { setSortState(lastValidStep.sortState); setNextAction('compare'); } setIsReviewingPastStep(false); } 
    setIsSorting(true); setIsPaused(!isPaused); 
  };
  const goToStep = (stepIndex) => { if (stepIndex < 0 || stepIndex >= steps.length) return; const step = steps[stepIndex]; setIsPaused(true); setIsReviewingPastStep(true); if(isFinished) setIsFinished(false); setCurrentStep(stepIndex); setArray(step.arrState); setHighlightedComparison(step.highlightedComparison || []); setSortedIndices(step.sorted || []); setComplexity(step.complexity); if (step.sortState) { setSortState(step.sortState); } setCurrentMinIndex(step.currentMinIndex); };
  const stepForward = () => goToStep(currentStep + 1);
  const stepBackward = () => goToStep(currentStep - 1);
  const handleCopy = () => { navigator.clipboard.writeText(window.location.href).then(() => { setCopyTooltipText("Copied!"); setTimeout(() => setCopyTooltipText("Copy"), 2000); }); };
  const handleShare = () => { if (navigator.share) { navigator.share({ title: "Selection Sort Visualizer", text: "Check out this interactive Selection Sort visualizer!", url: window.location.href, }); } else { alert("Web Share API not supported in your browser. You can manually copy the URL."); } };
  useEffect(handleReset, []);

  const displayedStep = steps[currentStep] || {};
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
                    Selection Sort Visualizer
                </h1>
                <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-slate-500"} max-w-2xl mx-auto mt-4`}>
                    An interactive tool to visualize the step-by-step process of the Selection Sort algorithm.
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
        </div>

        {activeTab === "visualization" ? (
          <div className="animate-fadeIn">
            <ComplexityDisplay complexity={displayedStep.complexity || complexity} isDark={isDark} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <VisualizationArea
                  array={array}
                  highlightedComparison={displayedStep.highlightedComparison || []}
                  sorted={displayedStep.sorted || []}
                  currentMinIndex={displayedStep.currentMinIndex}
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
        ) : (
          <ExplanationTab isDark={isDark} />
        )}
      </div>

      <footer className={`mt-16 text-center text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}>
        <p>Selection Sort Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
      </main>
    </div>
  );
};

export default SelectionSortVisualizer;