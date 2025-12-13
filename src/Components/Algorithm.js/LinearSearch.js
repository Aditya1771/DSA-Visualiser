import { useState, useEffect, useCallback, useRef,useLayoutEffect } from "react";

//==============================================================================
// Icon Component
// Renders various SVG icons based on the provided 'name' prop.
//==============================================================================
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    // Bubble Sort specific icons (not directly used in Linear Search controls, but good to have)
    bubble: (
      <>
        <circle cx="6" cy="17" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="12" cy="9" r="5" fill="currentColor" />
        <circle cx="18" cy="15" r="3" fill="currentColor" opacity="0.9" />
        <circle cx="9" cy="13" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.7" />
      </>
    ),
    // Linear Search specific/re-mapped icons
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    controls: <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />,
    stepBack: <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />,
    stepForward: <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />,
    // Replaced 'random' with 'arrow-refresh' as used in Bubble Sort
    "arrow-refresh": <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-2.64-6.36L21 8m0-6v6h-6"/>,
    example: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></>,
    info: <><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></>,
    // Mapping 'visualization' to 'chart' icon
    visualization: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    comparisons: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />,
    // Added Bubble Sort specific icons that might be useful generally, but not currently used in LS controls
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};


// glossybutton components 
const GlossyButton = ({ onClick, disabled, gradientClasses, children, className = '', pulse = true }) => (
    <div className={`relative group ${className}`}>
        <div
            className={`absolute -inset-0.5 ${gradientClasses} rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition duration-300 ${
                disabled ? 'hidden' : ''
            } ${pulse ? 'animate-pulse' : ''}`}
        />
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative w-full h-full p-px font-semibold text-gray-200 rounded-2xl overflow-hidden transition-all duration-300
                ${!disabled ? gradientClasses : 'bg-gray-800/50'}
                disabled:cursor-not-allowed`}
        >
            <div className="relative w-full h-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-900/80 backdrop-blur-sm rounded-[15px] transition-colors duration-300 group-hover:bg-gray-900/70">
                <span className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </span>
            </div>
        </button>
    </div>
);

// Breadcrumb

const Breadcrumb = () => (
  <nav aria-label="Breadcrumb" className=" pt-12">
    <ol className="flex items-center space-x-2 text-gray-400">
      <li>
        <a href="/" className="hover:text-white transition-colors">Home</a>
      </li>
      <li>
        <span className="mx-2">&gt;</span>
      </li>
      <li>
        <a href="/algorithms" className="hover:text-white transition-colors">Dashboard</a>
      </li>
       <li>
        <span className="mx-2">&gt;</span>
      </li>
      <li className="font-semibold text-white" aria-current="page">
        Linear Search
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
}) => {
  const getItemClass = (index, value) => {
    let classes = 'relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg shadow-lg transition-all duration-300 ease-in-out border-2 ';

    const isCurrentlyComparing = comparingIndex === index;
    const isTargetFound = foundIndex === index;
    const isTarget = value === target && (isCurrentlyComparing || isTargetFound); // Highlight target if it's the one being compared or found

    if (isTargetFound) {
      // Element is the target and has been found
      classes += 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white transform scale-110 shadow-green-400/50 ';
    } else if (isCurrentlyComparing) {
      // Element is currently being compared
      classes += 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 transform -translate-y-2 scale-105 shadow-yellow-400/50 ';
    } else if (isFinished && foundIndex === null) {
      // Search finished, target not found, this element was checked
      classes += 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500 text-gray-300 opacity-60 ';
    } else {
      // Default style for other elements
      classes += 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white ';
    }
    return classes;
  };

  const containerClasses = `flex flex-col items-center gap-4 p-4 rounded-lg bg-gray-900/40`; // Simplified as Linear Search might not have 'isSummary' directly here

  return (
    <div className={containerClasses}>
      <div className="w-full text-center">
        <p className="text-base text-gray-300">{description}</p>
      </div>

      <div className="w-full flex items-center justify-center gap-2 mt-2">
          {array.map((val, idx) => (
            <div key={`array-${idx}`} className={getItemClass(idx, val)}>
              {val}
            </div>
          ))}
      </div>

      {target !== undefined && ( // Display target explicitly if provided
        <div className="flex flex-col items-center text-gray-400 text-sm mt-2">
          <span className="mb-1">Target:</span>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 border-teal-400 bg-teal-600/30 text-teal-300 shadow-lg shadow-teal-500/30">
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
      const animationDuration = 300; // ms

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

      return () => {
        // This cleanup ensures prevValueRef is updated when the component unmounts
        // or when the effect re-runs before the animation completes due to prop change.
        // It helps prevent unexpected behavior if the component is unmounted mid-animation.
        prevValueRef.current = value;
      };
    }, [value]); // Rerun effect when 'value' prop changes

    return <>{currentValue}</>;
};


const ComplexityDisplay = ({ complexity }) => (
  <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
    <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
      <Icon name="chart"/>
      Complexity Analysis
    </h2>
    <div className="grid grid-cols-1 gap-4"> {/* Adjusted to 1 column for Linear Search */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-4 rounded-lg border border-indigo-700/50">
        <h3 className="flex items-center gap-2 text-sm text-indigo-300 mb-1">
          <Icon name="comparisons"/>Comparisons
        </h3>
        <span className="text-2xl font-bold text-indigo-300">
          <AnimatedNumber value={complexity.comparisons} />
        </span>
      </div>
      {/* Swaps and Passes are not relevant for Linear Search, so they are omitted */}
    </div>
  </section>
);

const Controls = ({
  isFinished,
  isPaused,
  isSearching,
  currentStep,
  steps,
  speed,
  customInput,
  target,
  toggleSearch,
  stepBackward,
  stepForward,
  handleReset,
  loadExampleArray,
  setSpeed,
  setCustomInput,
  handleCustomArray,
  setTarget = () => {}, // safety fallback
}) => {
  const isPlayPauseDisabled =
    isFinished || target === "" || target === null || target === undefined;
  const isBackDisabled = currentStep <= 0;
  const isNextDisabled = currentStep >= steps.length - 1;
  const isCustomInputDisabled = isSearching;
  const isTargetInputDisabled = isSearching;

  const playPauseStyles = !isPaused
    ? { gradient: "bg-gradient-to-r from-yellow-400 to-orange-500" }
    : { gradient: "bg-gradient-to-r from-green-400 to-emerald-500" };

  return (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-lg h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
        <Icon name="controls" />
        Controls
      </h2>

      <div className="flex flex-col justify-between h-full space-y-6">
        <div className="space-y-4">
          {/* --- Play / Pause + Reset --- */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <GlossyButton
                onClick={toggleSearch}
                disabled={isPlayPauseDisabled}
                gradientClasses={playPauseStyles.gradient}
                className="w-full"
              >
                {!isPaused ? (
                  <>
                    <Icon name="pause" /> Pause
                  </>
                ) : (
                  <>
                    <Icon name="play" /> Play
                  </>
                )}
              </GlossyButton>
            </div>
            <GlossyButton
              onClick={handleReset}
              gradientClasses="bg-gradient-to-r from-red-500 to-pink-500"
              className="w-full"
            >
              <Icon name="arrow-refresh" />
            </GlossyButton>
          </div>

          {/* --- Step Navigation --- */}
          <div className="grid grid-cols-2 gap-3">
            <GlossyButton
              onClick={stepBackward}
              disabled={isBackDisabled}
              gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400"
              className="w-full"
            >
              <Icon name="stepBack" /> Back
            </GlossyButton>
            <GlossyButton
              onClick={stepForward}
              disabled={isNextDisabled}
              gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400"
              className="w-full"
            >
              Next <Icon name="stepForward" />
            </GlossyButton>
          </div>

          {/* --- Example Array --- */}
          <div className="grid grid-cols-1 gap-3">
            <GlossyButton
              onClick={loadExampleArray}
              gradientClasses="bg-gradient-to-r from-indigo-500 to-purple-500"
              className="w-full"
            >
              <Icon name="example" /> Example Array
            </GlossyButton>
          </div>

          {/* --- Custom Array Section --- */}
          <div className="space-y-3 pt-4 border-t border-gray-700/50">
            <label
              htmlFor="custom-input"
              className="text-sm text-gray-400 font-medium"
            >
              Custom Array (comma-separated)
            </label>
            <input
              id="custom-input"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 5, 3, 8, 1, 2"
              disabled={isCustomInputDisabled}
              className="w-full px-4 py-2 bg-gray-900/80 border border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white disabled:bg-gray-800/50"
            />
            <GlossyButton
              onClick={handleCustomArray}
              disabled={isCustomInputDisabled}
              gradientClasses="bg-gradient-to-r from-purple-500 to-pink-500"
              className="w-full"
            >
              <Icon name="check" /> Apply Array
            </GlossyButton>
          </div>

          {/* --- Target Input --- */}
          <div className="space-y-3 pt-4 border-t border-gray-700/50">
            <label
              htmlFor="target-input"
              className="text-sm text-gray-400 font-medium"
            >
              Target Value to Find
            </label>
            <input
              id="target-input"
              type="number"
              value={target ?? ""}
              onChange={(e) => {
                const val =
                  e.target.value === "" ? "" : Number(e.target.value);
                setTarget(val);
              }}
              placeholder="e.g. 42"
              disabled={isTargetInputDisabled}
              className="w-full px-4 py-2 bg-gray-900/80 border border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500 text-white disabled:bg-gray-800/50"
            />
          </div>

          {/* --- Speed Control --- */}
          <div className="space-y-2 pt-4 border-t border-gray-700/50">
            <label
              htmlFor="speed-slider"
              className="text-sm text-gray-400 font-medium"
            >
              Animation Speed
            </label>
            <div className="flex items-center gap-3">
              <input
                id="speed-slider"
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-sm font-medium w-10">{speed}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



// Visualisation Area
// ⭐ NEW FULLY-UPGRADED LINEAR SEARCH VISUALIZATION AREA ⭐
// Matches insertion-sort visual quality, animations, and message-box system.

const VisualizationArea = ({
  array,
  steps,
  currentStep,
  target,
}) => {
  // -------------------------------------------------------
  // State
  // -------------------------------------------------------
  const [elementPositions, setElementPositions] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);

  // Overlay State (Data)
  const [overlay, setOverlay] = useState({
    show: false,
    type: "", // 'start', 'compare', 'found', 'notfound'
    message: "",
    x1: 0, // Target connection point
    x2: 0, // Secondary connection point (same as x1 for linear search)
    midX: 0, // Center point for message box calculation
    y: 0,  // Y height for connection
  });

  // Overlay Position State (Visual/Clamped)
  const [overlayPosition, setOverlayPosition] = useState({
    clampedMidX: 0,
    opacity: 0,
  });

  const containerRef = useRef(null);
  const messageBoxRef = useRef(null);

  // -------------------------------------------------------
  // Dimensions & Constants
  // -------------------------------------------------------
  const elementWidth = 64;
  const elementGap = 8;
  const elementHeight = 64;
  const lift = 40; // Height elements lift up when active
  
  // Visual offsets to match the Bubble Sort reference
  const messageBoxVerticalOffset = 130; 
  const lineTargetVerticalOffset = 10; 

  const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

  // -------------------------------------------------------
  // 1. Track element positions
  // -------------------------------------------------------
  useEffect(() => {
    const pos = {};
    array.forEach((it, i) => (pos[it.id] = i));
    setElementPositions(pos);
  }, [array]);

  // -------------------------------------------------------
  // 2. Step Logic -> Set Overlay Data
  // -------------------------------------------------------
  useEffect(() => {
    const step = steps[currentStep];

    // Default "Center of Array" values for Start/Not Found
    const centerOfArray = totalWidth / 2;
    const defaultY = elementHeight / 2;

    // Helper to calculate X for a specific index
    const getX = (idx) => idx * (elementWidth + elementGap) + elementWidth / 2;
    // Helper for Y (lifted)
    const getLiftedY = () => elementHeight / 2 - lift;

    if (!step) {
      setOverlay((prev) => ({ ...prev, show: false }));
      setActiveIndex(null);
      return;
    }

    // --- SCENARIO: START ---
    if (step.type === "start") {
      setActiveIndex(null);
      setOverlay({
        show: true,
        type: "start",
        message: `🔍 Starting Linear Search for ${target}...`,
        x1: centerOfArray,
        x2: centerOfArray,
        midX: centerOfArray,
        y: defaultY,
      });
    }

    // --- SCENARIO: COMPARE ---
    else if (step.type === "compare") {
      const i = step.index;
      const item = array[i];
      const found = item.value === target;
      const targetX = getX(i);

      setActiveIndex(i);

      setOverlay({
        show: true,
        type: found ? "found" : "compare",
        message: found
          ? `🎯 Found ${target} at index ${i}!`
          : `Comparing ${item.value} with ${target}...`,
        x1: targetX,
        x2: targetX, // In linear search, x1 and x2 are the same
        midX: targetX,
        y: getLiftedY(),
      });
    }

    // --- SCENARIO: NOT FOUND ---
    else if (step.type === "notfound") {
      setActiveIndex(null);
      setOverlay({
        show: true,
        type: "notfound",
        message: `❌ ${target} is not in the array.`,
        x1: centerOfArray,
        x2: centerOfArray,
        midX: centerOfArray,
        y: defaultY,
      });
    }

    // --- SCENARIO: FINISH ---
    else if (step.type === "finish") {
      const wasFound = steps.some((s) => s.type === "found");
      const foundStep = steps.find((s) => s.type === "found");
      
      // If found, point to the found element. If not, point to center.
      const targetX = wasFound && foundStep 
        ? getX(foundStep.index) 
        : centerOfArray;

      setActiveIndex(null); // Stop lifting

      setOverlay({
        show: true,
        type: wasFound ? "found" : "notfound",
        message: wasFound
          ? `🎉 Element found — Search complete.`
          : `❌ Element not found — Search complete.`,
        x1: targetX,
        x2: targetX,
        midX: targetX,
        y: wasFound ? defaultY : defaultY, // No lift on finish
      });
    }
  }, [currentStep, steps, array, target, totalWidth]);

  // -------------------------------------------------------
  // 3. Position Calculation (Clamping Logic from Reference)
  // -------------------------------------------------------
  useLayoutEffect(() => {
    if (overlay.show && messageBoxRef.current && containerRef.current) {
        const messageBoxWidth = messageBoxRef.current.offsetWidth;
        const halfMessageBoxWidth = messageBoxWidth / 2;
        
        // Calculate the ideal left edge for the message box relative to the array's totalWidth
        let idealLeftEdgeRelativeToArray = overlay.midX - halfMessageBoxWidth;
        
        const padding = 10;
        const minLeft = padding;
        
        let maxClampedMidX = totalWidth - halfMessageBoxWidth - padding;
        let minClampedMidX = halfMessageBoxWidth + padding;

        // Ensure the message box's *midpoint* `clampedMidX` stays within sensible bounds.
        let clampedMidX = Math.max(minClampedMidX, Math.min(overlay.midX, maxClampedMidX));

        const rightmostHighlightX = Math.max(overlay.x1, overlay.x2);
        const spaceNeededRightOfMessageBox = (messageBoxWidth / 2) + padding;
        const spaceAvailableRightOfRightmostHighlight = totalWidth - rightmostHighlightX;

        // Smart adjustment: if highlight is far right, push message box left
        if (spaceAvailableRightOfRightmostHighlight < spaceNeededRightOfMessageBox && rightmostHighlightX > totalWidth / 2) {
            idealLeftEdgeRelativeToArray = totalWidth - messageBoxWidth - padding;
            idealLeftEdgeRelativeToArray = Math.max(idealLeftEdgeRelativeToArray, padding);
        } else if (overlay.midX < halfMessageBoxWidth + padding) {
            idealLeftEdgeRelativeToArray = padding;
        }

        // Apply clamping based on adjusted ideal position
        const finalClampedLeftEdge = Math.max(minLeft, Math.min(idealLeftEdgeRelativeToArray, totalWidth - messageBoxWidth - padding));
        clampedMidX = finalClampedLeftEdge + halfMessageBoxWidth;

        setOverlayPosition({ clampedMidX, opacity: 1 });
    } else {
        setOverlayPosition({ clampedMidX: 0, opacity: 0 });
    }
  }, [overlay, totalWidth]);

  // -------------------------------------------------------
  // 4. Coordinate Helpers (Absolute positioning for SVG)
  // -------------------------------------------------------
  const getAbsoluteX = (relativeX) => {
    if (!containerRef.current) return 0;
    const containerRect = containerRef.current.getBoundingClientRect();
    const arrayLeftOffset = (containerRect.width - totalWidth) / 2;
    return arrayLeftOffset + relativeX;
  };

  const getAbsoluteY = (relativeY) => {
    if (!containerRef.current) return 0;
    const containerRect = containerRef.current.getBoundingClientRect();
    const arrayCenterY = containerRect.height / 2;
    return arrayCenterY + relativeY;
  };

  const messageBoxAbsoluteY = getAbsoluteY(overlay.y - lift - messageBoxVerticalOffset);

  // -------------------------------------------------------
  // 5. Styles
  // -------------------------------------------------------
  // Map overlay types to colors for the message box
  const boxClass = {
    start: "bg-purple-900/80 border-purple-700 text-purple-300",
    compare: "bg-yellow-900/80 border-yellow-700 text-yellow-300",
    found: "bg-green-900/80 border-green-700 text-green-300",
    notfound: "bg-red-900/80 border-red-700 text-red-300",
  }[overlay.type] || "bg-gray-900/80 border-gray-700";

  const getElementStyle = (item) => {
    const idx = elementPositions[item.id];
    const x = idx * (elementWidth + elementGap);
    
    // Determine active state
    const isActive = idx === activeIndex;
    
    // Determine if this is the "found" element at the end
    const finalFoundStep = steps.find((s) => s.type === "found");
    const isFinalFound =
      finalFoundStep?.index === idx && steps[currentStep]?.type === "finish";

    // Dynamic coloring based on state
    const colorType = isFinalFound ? "found" : isActive ? overlay.type : "default";

    // Glow effects matching the reference intensity
    let glow = "0 0 8px rgba(0, 191, 255, 0.2)";
    if (colorType === "found") glow = "0 0 15px 3px #22c55e, 0 0 20px 6px rgba(34, 197, 94, 0.3)";
    if (colorType === "compare") glow = "0 0 15px 3px #f59e0b, 0 0 20px 6px rgba(245, 158, 11, 0.3)";
    if (colorType === "notfound") glow = "0 0 15px 3px #ef4444, 0 0 20px 6px rgba(239, 68, 68, 0.3)";

    return {
      transform: `translateX(${x}px) translateY(${isActive ? -lift : 0}px) scale(${isActive ? 1.1 : 1})`,
      boxShadow: glow,
      zIndex: isActive ? 10 : 1,
      transition: "transform 500ms ease-in-out, box-shadow 300ms ease-in-out",
    };
  };

  const getElementClass = (item) => {
    const idx = elementPositions[item.id];
    // Check if finalized
    const finalFoundStep = steps.find((s) => s.type === "found");
    const isFinalFound = finalFoundStep?.index === idx && steps[currentStep]?.type === "finish";

    let base = "absolute flex items-center justify-center w-16 h-16 rounded-lg font-bold text-xl border-2 transition-colors duration-500";
    
    if (isFinalFound) return `${base} bg-green-600/90 border-green-500 text-white`;
    if (idx === activeIndex) {
        if (overlay.type === "found") return `${base} bg-green-600/90 border-green-500 text-white`;
        if (overlay.type === "compare") return `${base} bg-yellow-600/90 border-yellow-500 text-white`;
        if (overlay.type === "notfound") return `${base} bg-red-600/90 border-red-500 text-white`;
    }
    return `${base} bg-blue-600/90 border-blue-500 text-white`;
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl h-full flex flex-col min-h-[32rem] relative overflow-hidden">
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:32px_32px] opacity-30 pointer-events-none"></div>

      <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2 relative z-10 mb-4">
        <Icon name="visualization" /> Linear Search Visualization
      </h2>

      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-visible"
      >
        {/* Overlay for Message Box */}
        <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 transition-opacity duration-300"
            style={{ opacity: overlayPosition.opacity }}
        >
            <div
                ref={messageBoxRef}
                className="absolute transition-transform duration-300"
                style={{
                    top: messageBoxAbsoluteY,
                    left: getAbsoluteX(overlayPosition.clampedMidX),
                    transform: "translateX(-50%)",
                }}
            >
                <div className={`px-4 py-2 rounded-lg border shadow-xl font-semibold text-center max-w-xs ${boxClass}`}>
                    {overlay.message}
                </div>
            </div>
        </div>

        {/* SVG Connector Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {overlay.show && messageBoxRef.current && (
                <g className="overlay-connectors" style={{ opacity: overlayPosition.opacity, transition: "opacity 300ms" }}>
                    {/* Line to x1 */}
                    <line 
                        x1={getAbsoluteX(overlayPosition.clampedMidX)} 
                        y1={messageBoxAbsoluteY + messageBoxRef.current.offsetHeight / 2} 
                        x2={getAbsoluteX(overlay.x1)} 
                        y2={getAbsoluteY(overlay.y - elementHeight / 2 - lineTargetVerticalOffset)} 
                        stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeDasharray="4 4" 
                    />
                    {/* Line to x2 (Only needed if different from x1, but kept for consistency with Bubble Sort logic) */}
                    {overlay.x1 !== overlay.x2 && (
                        <line 
                            x1={getAbsoluteX(overlayPosition.clampedMidX)} 
                            y1={messageBoxAbsoluteY + messageBoxRef.current.offsetHeight / 2} 
                            x2={getAbsoluteX(overlay.x2)} 
                            y2={getAbsoluteY(overlay.y - elementHeight / 2 - lineTargetVerticalOffset)} 
                            stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeDasharray="4 4" 
                        />
                    )}
                </g>
            )}
        </svg>

        {/* Array Elements Container */}
        <div
          className="relative"
          style={{ width: totalWidth, height: elementHeight }}
        >
          {array.map((item) => (
            <div
              key={item.id}
              className={getElementClass(item)}
              style={getElementStyle(item)}
            >
              {item.value}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center flex-wrap gap-6 text-gray-400 text-sm relative z-10">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-blue-600/90"></span> Unchecked
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-600/90"></span> Checking
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-600/90"></span> Found
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-600/90"></span> Not Found
        </span>
      </div>
    </section>
  );
};






const LogView = ({ steps, currentStep, goToStep, logViewRef }) => {
  const getStepStyle = (type) => {
    const styles = {
      start: "bg-indigo-600/90",
      compare: "bg-yellow-500/90",
      found: "bg-green-600/90",
      notFound: "bg-red-600/90",
      finish: "bg-teal-600/90"
    };
    return styles[type] || "bg-gray-600/90";
  };

  return (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-300">
          <Icon name="info" />
          Algorithm Execution Log
        </h2>
        <span className="text-sm text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      <div
        ref={logViewRef}
        className="relative max-h-96 overflow-y-auto pr-2 space-y-2"
      >
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;

          const logMessageStyle = `
            m-2 p-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer 
            ${getStepStyle(step.type)} 
            ${
              isCurrent
                ? "ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400 opacity-100"
                : "opacity-70 hover:opacity-100"
            }
          `;

          return (
            <div
              key={index}
              data-step-index={index}
              onClick={() => goToStep(index)}
              className={logMessageStyle}
            >
              {/* Step Header */}
              <div className="flex items-start gap-3 m-1">
                <span className="font-bold text-white/80 pt-0.5">
                  {index + 1}.
                </span>
                <p className="text-white text-sm flex-1">{step.message}</p>
              </div>

              {/* Array snapshot */}
              <div className="mt-2 flex flex-wrap gap-1 px-2">
                {step.arrState.map((item, idx) => {
                  // item = { id, value }
                  const value = item?.value ?? "?";
                  const isHighlighted = step.highlights?.includes(idx);
                  const isFound = step.found === idx || step.foundIndex === idx;

                  let valStyle = "bg-blue-500/80 text-white";
                  if (isHighlighted) valStyle = "bg-yellow-400 text-gray-900";
                  if (isFound) valStyle = "bg-green-500 text-white";

                  return (
                    <div
                      key={idx}
                      className={`px-1.5 py-0.5 rounded text-xs font-bold ${valStyle}`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// INteractive graph

const InteractiveComplexityGraph = () => {
  const [hoverData, setHoverData] = useState(null);
  const [animate, setAnimate] = useState(false);
  const graphRef = useRef(null);

  const maxN = 25;
  // For linear search, max operations are 'n', so maxOps can be 'maxN' plus a buffer
  const maxOps = maxN + 5; // e.g., 25 + 5 = 30 total ops for graph height
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

  // trigger animation only when in viewport
  useEffect(() => {
    if (!graphRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        } else {
          setAnimate(false); // Reset animation if scrolled out of view
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

    // Ensure hover data is within the graph plotting area
    if (x < padding.left || x > width - padding.right || y < padding.top || y > height - padding.bottom) {
      setHoverData(null);
      return;
    }

    const n = xToN(x);
    if (n >= 1 && n <= maxN) {
      setHoverData({
        n,
        best: 1, // O(1)
        avg: Math.round(n ), // 
        worst: n, // O(n)
        x: nToX(n),
        y, // Mouse Y for general hover line, actual Y for curve points
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

  return (
    <div className="bg-gray-900/90 p-4 rounded-2xl border border-gray-700 shadow-xl relative">
      <h3 className="text-2xl font-bold text-center mb-4 text-gray-100">
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
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="white"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 5, 10, 15, 20, 25].map((val) => (
            <g key={val}>
              <text
                x={padding.left - 10}
                y={opsToY(val) + 4}
                textAnchor="end"
                className="fill-gray-300 text-xs"
              >
                {val}
              </text>
              <line
                x1={padding.left}
                y1={opsToY(val)}
                x2={width - padding.right}
                y2={opsToY(val)}
                stroke="#4b5563"
                strokeDasharray="3 3"
              />
            </g>
          ))}
          <text
            x="20"
            y={height / 2}
            transform={`rotate(-90 20 ${height / 2})`}
            textAnchor="middle"
            className="fill-gray-300 font-medium"
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
                className="fill-gray-300 text-xs"
              >
                {val}
              </text>
              <line
                x1={nToX(val)}
                y1={height - padding.bottom}
                x2={nToX(val)}
                y2={height - padding.bottom + 6}
                stroke="white"
              />
            </g>
          ))}
          <text
            x={padding.left + (width - padding.left - padding.right) / 2}
            y={height - 10}
            textAnchor="middle"
            className="fill-gray-300 font-medium"
          >
            Input Size (n)
          </text>

          {/* Curves with staggered animation */}
          <path
            d={getPath((n) => 1)} // Best O(1)
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{
              transition: "stroke-dashoffset 1.5s ease-out",
            }}
          />
          <path
            d={getPath((n) => n)} // Avg O(n/2)
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{
              transition: "stroke-dashoffset 2s ease-out 0.5s",
            }}
          />
          <path
            d={getPath((n) => n)} // Worst O(n)
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{
              transition: "stroke-dashoffset 2s ease-out 1s",
            }}
          />

          {/* Labels for clarity - repositioned to be clearly visible on the right */}
          {/* Best O(1) */}
          <text
            x={nToX(maxN) + 5}
            y={opsToY(1) - 3}
            textAnchor="start"
            className="fill-green-400 text-xs"
          >
            Best O(1)
          </text>
          {/* Avg O(n/2) */}
          <text
            x={nToX(maxN) + 5}
            y={opsToY(9.5*maxN/10) - 3}
            textAnchor="start"
            className="fill-blue-400 text-xs"
          >
            Avg O(n)
          </text>
          {/* Worst O(n) */}
          <text
            x={nToX(maxN) + 5}
            y={opsToY(maxN) - 3}
            textAnchor="start"
            className="fill-red-400 text-xs"
          >
            Worst O(n)
          </text>

          {/* Hover markers + tooltip */}
          {hoverData && (
            <g>
              <line
                x1={hoverData.x}
                y1={padding.top}
                x2={hoverData.x}
                y2={height - padding.bottom}
                stroke="white"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {[
                { y: opsToY(hoverData.best), color: "#22c55e", rawValue: hoverData.best },
                { y: opsToY(hoverData.avg), color: "#3b82f6", rawValue: hoverData.avg },
                { y: opsToY(hoverData.worst), color: "#ef4444", rawValue: hoverData.worst }
              ].map((point, i) => (
                <circle
                  key={i}
                  cx={hoverData.x}
                  cy={point.y}
                  r={5}
                  fill={point.color}
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-300 ease-out"
                />
              ))}

              {/* Tooltip */}
              {(() => {
                const boxWidth = 120;
                const boxHeight = 70;
                let tooltipX = hoverData.x + 15;
                
                let tooltipY = opsToY(hoverData.worst) - boxHeight - 10;

                if (tooltipX + boxWidth > width - padding.right) {
                  tooltipX = hoverData.x - boxWidth - 15;
                }
                tooltipX = Math.max(padding.left, tooltipX);

                if (tooltipY < padding.top) {
                  tooltipY = opsToY(hoverData.best) + 15;
                }
                if (tooltipY + boxHeight > height - padding.bottom) {
                    tooltipY = height - padding.bottom - boxHeight;
                }


                return (
                  <g
                    transform={`translate(${tooltipX}, ${tooltipY})`}
                    className="transition-transform duration-100 ease-out"
                  >
                    <rect
                      x="0"
                      y="0"
                      width={boxWidth}
                      height={boxHeight}
                      rx="6"
                      fill="black"
                      opacity="0.85"
                    />
                    <text x="8" y="18" className="fill-white text-xs">
                      n = {hoverData.n}
                    </text>
                    <text x="8" y="34" className="fill-green-400 text-xs">
                      Best: {hoverData.best}
                    </text>
                    <text x="8" y="48" className="fill-blue-400 text-xs">
                      Avg: {hoverData.avg}
                    </text>
                    <text x="8" y="62" className="fill-red-400 text-xs">
                      Worst: {hoverData.worst}
                    </text>
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



const ExplanationTab = () => {
    // Defined the walkthrough data for Linear Search
    const walkthroughData = [
        { type: 'initial', array: [10, 50, 30, 70, 25, 60], target: 25, description: "Our array is laid out, and we're looking for the target value: 25. Linear Search will start from the beginning (index 0).", isSummary: true },
        { type: 'progress', text: 'Searching for 25: Step-by-Step' },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 25, comparingIndex: 0, description: "Compare 10 (at index 0) with 25. Not a match. Move to the next element." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 25, comparingIndex: 1, description: "Compare 50 (at index 1) with 25. Not a match. Move on." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 25, comparingIndex: 2, description: "Compare 30 (at index 2) with 25. Not a match. Proceed." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 25, comparingIndex: 3, description: "Compare 70 (at index 3) with 25. Not a match. Keep searching." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 25, comparingIndex: 4, foundIndex: 4, description: "Compare 25 (at index 4) with 25. It's a match! The target is found at index 4.", isFinished: true },
        { type: 'final', array: [10, 50, 30, 70, 25, 60], target: 25, foundIndex: 4, description: "The Linear Search successfully concluded, finding 25 at index 4.", isSummary: true, isFinished: true },
        { type: 'progress', text: 'Scenario: Target Not Found (Example with Target = 99)' },
        { type: 'initial', array: [10, 50, 30, 70, 25, 60], target: 99, description: "Let's search for a target (99) that is not in the array.", isSummary: true },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 99, comparingIndex: 0, description: "Check 10 vs 99? No." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 99, comparingIndex: 1, description: "Check 50 vs 99? No." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 99, comparingIndex: 2, description: "Check 30 vs 99? No." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 99, comparingIndex: 3, description: "Check 70 vs 99? No." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 99, comparingIndex: 4, description: "Check 25 vs 99? No." },
        { type: 'step', array: [10, 50, 30, 70, 25, 60], target: 99, comparingIndex: 5, description: "Check 60 vs 99? No. We have reached the end of the array." },
        { type: 'final', array: [10, 50, 30, 70, 25, 60], target: 99, foundIndex: null, description: "All elements checked. Target 99 was not found in the array.", isSummary: true, isFinished: true },
    ];

    const sectionClasses = "bg-gray-800/60 p-6 md:p-8 rounded-2xl border border-gray-700/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20";

    return (
        <section className="text-gray-300 animate-fadeIn">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* What is Linear Search? */}
                <div className={sectionClasses}>
                    <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        <Icon name="search" className="w-8 h-8 text-purple-400"/>What is Linear Search?
                    </h2>
                    <p className="text-lg text-center leading-relaxed">
                        Linear Search, also known as sequential search, is the most basic search algorithm. It sequentially checks each element of a list for the target value until a match is found or until all the elements have been searched. It is simple to implement but can be inefficient for large datasets.
                    </p>
                </div>
                
                {/* Key Characteristics */}
                <div className={sectionClasses}>
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-200">
                        <Icon name="info" className="w-7 h-7 text-purple-400" />Key Characteristics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="font-bold text-xl text-purple-300">Simple Implementation</h4>
                            <p className="text-sm text-gray-400 mt-2">Its straightforward logic makes it easy to understand and code, requiring minimal overhead.</p>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="font-bold text-xl text-purple-300">Unordered Data</h4>
                            <p className="text-sm text-gray-400 mt-2">It works efficiently on any list, regardless of whether the data is sorted or not, unlike other search algorithms.</p>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="font-bold text-xl text-purple-300">Inefficient at Scale</h4>
                            <p className="text-sm text-gray-400 mt-2">Its performance degrades linearly as the size of the dataset grows, making it unsuitable for very large arrays.</p>
                        </div>
                    </div>
                </div>

                {/* Walkthrough */}
                <div className={sectionClasses}>
                    <h3 className="flex items-center justify-center gap-3 text-2xl font-bold mb-6 text-gray-200">
                        <Icon name="example" className="w-7 h-7 text-purple-400" />How It Works: A Detailed Breakdown
                    </h3>
                    <div className="space-y-4">
                        {walkthroughData.map((item, index) => {
                             if (item.type === 'initial') return <div key={index}><h4 className="text-xl text-center font-semibold text-purple-300 mb-2">Initial State</h4><WalkthroughStep {...item} /></div>;
                             if (item.type === 'progress') return <h4 key={index} className="text-xl text-center font-semibold text-purple-300 pt-4 mt-4">{item.text}</h4>;
                             if (item.type === 'final') return <div key={index} className="pt-4"><h4 className="text-xl text-center font-semibold text-green-400 mb-2">{item.description}</h4><WalkthroughStep {...item} /></div>;
                             return <WalkthroughStep key={index} {...item} />;
                        })}
                    </div>
                </div>

                {/* The Algorithm, Step-by-Step */}
                <div className={sectionClasses}>
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-200"><Icon name="code" className="w-7 h-7 text-purple-400" />The Algorithm, Step-by-Step</h3>
                    <ol className="list-decimal list-inside space-y-4 text-gray-300 leading-relaxed">
                        <li><strong>Initialization</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Start at the beginning of the list (index 0).</li>
                           </ul>
                        </li>
                        <li><strong>Iteration (The "Comparison Loop")</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Compare the current element with the target value.</li>
                             <li>If they match, the search is successful. Return the current index.</li>
                             <li>If they don't match, move to the next element in the list.</li>
                           </ul>
                        </li>
                        <li><strong>Termination</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>If the end of the list is reached and the target value has not been found, the search is unsuccessful. Return an indication that the element was not found (e.g., -1).</li>
                           </ul>
                        </li>
                    </ol>
                </div>
                
               {/* Complexity Analysis */}
               <div className={sectionClasses}>
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-200">
                        <Icon name="chart" className="w-7 h-7 text-purple-400" />
                        Complexity Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Time Complexity */}
                        <div className="md:col-span-2 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-4">
                                <Icon name="time" className="w-6 h-6" />
                                Time Complexity
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-red-800/40 rounded-md">
                                    <p className="font-bold text-xl text-red-300">O(n)</p>
                                    <p className="text-sm text-red-400">Worst Case</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Occurs when the target element is <span className="text-red-300">at the end</span> of the list or <span className="text-red-300">not present</span>.
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-orange-800/40 rounded-md">
                                    <p className="font-bold text-xl text-orange-300">O(n)</p>
                                    <p className="text-sm text-orange-400">Average Case</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Happens when the target is found <span className="text-orange-300">somewhere in the middle</span> of the list.
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-green-800/40 rounded-md">
                                    <p className="font-bold text-xl text-green-300">O(1)</p>
                                    <p className="text-sm text-green-400">Best Case</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Occurs when the target element is the <span className="text-green-300">first element</span> in the list.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Space Complexity */}
                        <div className="md:col-span-1 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-sky-300 mb-4">
                                <Icon name="space" className="w-6 h-6" />
                                Space Complexity
                            </h4>
                            <div className="text-center p-3 bg-sky-800/40 rounded-md">
                                <p className="font-bold text-xl text-sky-300">O(1)</p>
                                <p className="text-sm text-sky-400">Constant Space</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Linear Search requires <span className="text-sky-300">no extra memory</span> regardless of list size.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className={sectionClasses}>
                    <h3 className="flex items-center justify-center gap-3 text-2xl font-bold mb-6 text-gray-200"><Icon name="visualization" className="w-7 h-7 text-purple-400"/>Interactive Performance Graph</h3>
                    <InteractiveComplexityGraph />
                </div>

               

                {/* Pros & Cons */}
                <div className={sectionClasses}>
                     <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-200"><Icon name="comparisons" className="w-7 h-7 text-purple-400"/>Pros & Cons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-green-500">
                            <h4 className="text-xl font-semibold text-green-400 mb-4">Advantages</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Simplicity:</strong> Extremely easy to understand, implement, and debug.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>No Presorted Data:</strong> Works effectively on both sorted and unsorted lists.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Space Efficient:</strong> An in-place algorithm that requires minimal O(1) extra memory.</span></li>
                            </ul>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-red-500">
                            <h4 className="text-xl font-semibold text-red-400 mb-4">Disadvantages</h4>
                            <ul className="space-y-3 text-gray-300">
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span><strong>Inefficiency for Large Data:</strong> Performance significantly degrades with larger datasets due to its O(n) average and worst-case time complexity.</span></li>
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span><strong>Suboptimal for Sorted Data:</strong> For sorted lists, more efficient algorithms like Binary Search exist.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


// Main LinearSearchVisualizer Component

const LinearSearchVisualizer = () => {
  const [array, setArray] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [customInput, setCustomInput] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [complexity, setComplexity] = useState({ comparisons: 0 });
  const [activeTab, setActiveTab] = useState("visualization");
  const [copyTooltipText, setCopyTooltipText] = useState("Copy");

  const logViewRef = useRef(null);

  // Create structured array
  const createArrayFromValues = (values) =>
    values.map((value, index) => ({ id: index, value }));

  // -------------------------------------------------
  // FIX #2 → Add index: highlight
  // -------------------------------------------------
  const addStep = useCallback(
    (message, type, arr, highlight, found, currentComplexity) => {
      const newStep = {
        message,
        type: type.toLowerCase(), // normalize types
        arrState: arr.map((item) => ({ ...item })),
        highlights: highlight !== null ? [highlight] : [],
        index: highlight, // <-- REQUIRED for new VisualizationArea
        found,
        complexity: { ...currentComplexity }
      };

      setSteps((prev) => [...prev, newStep]);
      setCurrentStep((prev) => prev + 1);
    },
    []
  );

  const handleReset = useCallback(() => {
    const newValues = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 90) + 10
    );
    const arr = createArrayFromValues(newValues);

    setArray(arr);
    setIsSearching(false);
    setIsPaused(true);
    setIsFinished(false);
    setHighlightedIndex(null);
    setFoundIndex(null);
    setComplexity({ comparisons: 0 });

    setSteps([
      {
        message: "Generated a new random array. Enter a target and press Play to start search.",
        type: "start",
        arrState: arr,
        highlights: [],
        found: null,
        index: null,
        complexity: { comparisons: 0 }
      }
    ]);

    setCurrentStep(0);
  }, []);

  useEffect(handleReset, []);

  // -------------------------------------------------
  // SEARCH STEP LOGIC (minimal changes applied)
  // -------------------------------------------------
  const runSearchStep = useCallback(() => {
    let arr = [...array];
    let i = highlightedIndex === null ? 0 : highlightedIndex + 1;
    let currentComplexity = { ...complexity };

    if (i >= arr.length || isFinished) {
      setIsFinished(true);

      // FIX #1 → Change notFound → notfound
      addStep("Search complete. Element not found.", "notfound", arr, null, null, currentComplexity);

      // FIX #3 → Add finish step
      addStep("Search complete.", "finish", arr, null, null, currentComplexity);

      return;
    }

    currentComplexity.comparisons++;
    setComplexity(currentComplexity);

    setHighlightedIndex(i);

    addStep(
      `Checking index ${i} (value ${arr[i].value})`,
      "compare",
      arr,
      i,
      foundIndex,
      currentComplexity
    );

    if (arr[i].value === Number(targetValue)) {
      setFoundIndex(i);
      setIsFinished(true);

      addStep(
        `Element ${targetValue} found at index ${i}.`,
        "found",
        arr,
        i,
        i,
        currentComplexity
      );

      // FIX #3 → required for VisualizationArea
      addStep("Search complete.", "finish", arr, null, i, currentComplexity);

      return;
    }
  }, [
    array,
    highlightedIndex,
    targetValue,
    complexity,
    addStep,
    isFinished,
    foundIndex
  ]);

  // Auto animation loop
  useEffect(() => {
    let timer;
    if (isSearching && !isPaused && !isFinished) {
      timer = setTimeout(runSearchStep, 1100 - speed * 10);
    }
    return () => clearTimeout(timer);
  }, [isSearching, isPaused, isFinished, runSearchStep, speed]);

  const toggleSearch = () => {
    if (isFinished || targetValue === "" || targetValue === null) return;
    setIsSearching(true);
    setIsPaused(!isPaused);
  };

  const goToStep = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;

    const step = steps[stepIndex];

    setIsPaused(true);
    setCurrentStep(stepIndex);
    setArray(step.arrState);
    setHighlightedIndex(step.highlights[0] ?? null);
    setFoundIndex(step.found);
    setComplexity(step.complexity);
  };

  const stepForward = () => goToStep(currentStep + 1);
  const stepBackward = () => goToStep(currentStep - 1);

  const handleCustomArray = () => {
    const newValues = customInput
      .split(/[, ]+/)
      .map((item) => parseInt(item.trim()))
      .filter((item) => !isNaN(item) && item > 0 && item <= 100);

    if (newValues.length === 0 || newValues.length > 12) {
      alert("Please enter between 1 and 12 valid numbers (1–100).");
      return;
    }

    const arr = createArrayFromValues(newValues);

    setArray(arr);

    setSteps([
      {
        message: "Custom array loaded. Enter target and press Play.",
        type: "start",
        arrState: arr,
        highlights: [],
        found: null,
        index: null,
        complexity: { comparisons: 0 }
      }
    ]);

    setCurrentStep(0);
    setIsPaused(true);
    setIsFinished(false);
    setHighlightedIndex(null);
    setFoundIndex(null);
    setComplexity({ comparisons: 0 });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyTooltipText("Copied!");
      setTimeout(() => setCopyTooltipText("Copy"), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Linear Search Visualizer",
        text: "Check out this interactive Linear Search visualizer!",
        url: window.location.href
      });
    } else {
      alert("Web Share API not supported in your browser.");
    }
  };

  const getTabClass = (tabName) =>
    activeTab === tabName
      ? "text-purple-400 border-b-2 border-purple-400"
      : "text-gray-400 hover:text-gray-300";

  const displayedStep = steps[currentStep] || {};

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center font-sans">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/40 to-indigo-900/60 -z-10" />

      {/* HEADER */}
      <header className="w-full max-w-7xl text-center py-10 animate-fadeIn">
        <div className="flex justify-start">
          <Breadcrumb />
        </div>

        <div className="inline-block bg-green-400/10 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border border-green-400/20">
          Searching
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Linear Search Visualizer
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Step-by-step visualization of the Linear Search algorithm.
        </p>

        <div className="mt-6 flex justify-center items-center gap-4">
          <GlossyButton
            onClick={handleCopy}
            gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600"
            className="w-[150px]"
          >
            <Icon name="copy" className="w-5 h-5" />
            <span>{copyTooltipText}</span>
          </GlossyButton>

          <GlossyButton
            onClick={handleShare}
            gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600"
            className="w-[150px]"
          >
            <Icon name="share" className="w-5 h-5" />
            <span>Share</span>
          </GlossyButton>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="w-full max-w-7xl space-y-6 mt-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium transition-colors ${getTabClass(
              "visualization"
            )}`}
            onClick={() => setActiveTab("visualization")}
          >
            Visualization
          </button>

          <button
            className={`px-4 py-2 font-medium transition-colors ${getTabClass(
              "explanation"
            )}`}
            onClick={() => setActiveTab("explanation")}
          >
            Explanation
          </button>
        </div>

        {activeTab === "visualization" ? (
          <div className="animate-fadeIn">
            <ComplexityDisplay
              complexity={displayedStep.complexity || complexity}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <VisualizationArea
                  array={array.slice(0, 12)}
                  highlights={highlightedIndex !== null ? [highlightedIndex] : []}
                  foundIndex={foundIndex}
                  isFinished={isFinished}
                  target={targetValue}
                  isSearching={isSearching}
                  isPaused={isPaused}
                  steps={steps}
                  currentStep={currentStep}
                />
              </div>

              <div className="lg:col-span-1">
                <Controls
                  isFinished={isFinished}
                  isPaused={isPaused}
                  isSearching={isSearching}
                  currentStep={currentStep}
                  steps={steps}
                  speed={speed}
                  customInput={customInput}
                  target={targetValue}
                  toggleSearch={toggleSearch}
                  stepBackward={stepBackward}
                  stepForward={stepForward}
                  handleReset={handleReset}
                  loadExampleArray={handleReset}
                  setSpeed={setSpeed}
                  setCustomInput={setCustomInput}
                  handleCustomArray={handleCustomArray}
                  setTarget={setTargetValue}
                />
              </div>
            </div>

            <div className="mt-6">
              <LogView
                steps={steps}
                currentStep={currentStep}
                goToStep={goToStep}
                logViewRef={logViewRef}
              />
            </div>
          </div>
        ) : (
          <ExplanationTab />
        )}
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Linear Search Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
    </div>
  );
};


export default LinearSearchVisualizer;