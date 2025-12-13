import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";

//==============================================================================
// Icon Component
//==============================================================================
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    controls: <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />,
    stepBack: <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />,
    stepForward: <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />,
    "arrow-refresh": <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-2.64-6.36L21 8m0-6v6h-6"/>,
    example: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></>,
    info: <><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></>,
    visualization: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />,
    comparisons: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />,
    copy: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6m4-3 5 5-5 5m5-5H9" />,
    code: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" />,
    time: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    space: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    xmark: <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    split: <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
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


//==============================================================================
// UI Components (Button, Breadcrumb)
//==============================================================================

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
        Binary Search
      </li>
    </ol>
  </nav>
);

//==============================================================================
// Explanation & Walkthrough Components
//==============================================================================

const WalkthroughStep = ({
  array,
  target,
  midIndex,
  lowIndex,
  highIndex,
  foundIndex,
  description,
  isFinished,
}) => {
  const getItemClass = (index, value) => {
    let classes = 'relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-lg font-bold text-base md:text-lg shadow-lg transition-all duration-300 ease-in-out border-2 ';

    const isMid = index === midIndex;
    const isFound = index === foundIndex;
    // In binary search, we visualize the "active range". 
    // If indices are provided, check range. If only array is provided (initial), show all.
    const isEliminated = (lowIndex !== undefined && highIndex !== undefined) && (index < lowIndex || index > highIndex);

    if (isFound) {
      classes += 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white transform scale-110 shadow-green-400/50 z-20 ';
    } else if (isMid) {
      classes += 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 transform -translate-y-2 scale-105 shadow-yellow-400/50 z-20 ';
    } else if (isEliminated) {
      classes += 'bg-gray-800 border-gray-700 text-gray-600 opacity-40 scale-90 ';
    } else {
      // Active range elements
      classes += 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white ';
    }
    return classes;
  };

  const containerClasses = `flex flex-col items-center gap-4 p-4 rounded-lg bg-gray-900/40`;

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

      {target !== undefined && (
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

//==============================================================================
// Stats & Controls
//==============================================================================

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

const ComplexityDisplay = ({ complexity }) => (
  <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
    <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
      <Icon name="chart"/>
      Complexity Analysis
    </h2>
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-4 rounded-lg border border-indigo-700/50">
        <h3 className="flex items-center gap-2 text-sm text-indigo-300 mb-1">
          <Icon name="comparisons"/>Comparisons
        </h3>
        <span className="text-2xl font-bold text-indigo-300">
          <AnimatedNumber value={complexity.comparisons} />
        </span>
      </div>
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
  setTarget = () => {},
}) => {
  const isPlayPauseDisabled = isFinished || target === "" || target === null || target === undefined;
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
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <GlossyButton
                onClick={toggleSearch}
                disabled={isPlayPauseDisabled}
                gradientClasses={playPauseStyles.gradient}
                className="w-full"
              >
                {!isPaused ? <><Icon name="pause" /> Pause</> : <><Icon name="play" /> Play</>}
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

          <div className="grid grid-cols-1 gap-3">
            <GlossyButton
              onClick={loadExampleArray}
              gradientClasses="bg-gradient-to-r from-indigo-500 to-purple-500"
              className="w-full"
            >
              <Icon name="example" /> Example (Sorted)
            </GlossyButton>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-700/50">
            <label htmlFor="custom-input" className="text-sm text-gray-400 font-medium">
              Custom Array (Comma-sep)
              <span className="block text-xs text-purple-400 font-normal">Will be auto-sorted</span>
            </label>
            <input
              id="custom-input"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 5, 12, 25, 30"
              disabled={isCustomInputDisabled}
              className="w-full px-4 py-2 bg-gray-900/80 border border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white disabled:bg-gray-800/50"
            />
            <GlossyButton
              onClick={handleCustomArray}
              disabled={isCustomInputDisabled}
              gradientClasses="bg-gradient-to-r from-purple-500 to-pink-500"
              className="w-full"
            >
              <Icon name="check" /> Sort & Apply
            </GlossyButton>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-700/50">
            <label htmlFor="target-input" className="text-sm text-gray-400 font-medium">
              Target Value to Find
            </label>
            <input
              id="target-input"
              type="number"
              value={target ?? ""}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setTarget(val);
              }}
              placeholder="e.g. 42"
              disabled={isTargetInputDisabled}
              className="w-full px-4 py-2 bg-gray-900/80 border border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500 text-white disabled:bg-gray-800/50"
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-700/50">
            <label htmlFor="speed-slider" className="text-sm text-gray-400 font-medium">
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

//==============================================================================
// VISUALIZATION AREA (Binary Search Specialized)
//==============================================================================

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
  const [activeMid, setActiveMid] = useState(null);

  // Overlay State (Data)
  const [overlay, setOverlay] = useState({
    show: false,
    type: "",
    message: "",
    x1: 0,
    midX: 0,
    y: 0,
  });

  const [overlayPosition, setOverlayPosition] = useState({
    clampedMidX: 0,
    opacity: 0,
  });

  const containerRef = useRef(null);
  const messageBoxRef = useRef(null);

  // -------------------------------------------------------
  // Dimensions
  // -------------------------------------------------------
  const elementWidth = 64;
  const elementGap = 8;
  const elementHeight = 64;
  const lift = 40;

  const messageBoxVerticalOffset = 130;
  const lineTargetVerticalOffset = 10;

  const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

  // -------------------------------------------------------
  // Track element positions
  // -------------------------------------------------------
  useEffect(() => {
    const pos = {};
    array.forEach((it, i) => (pos[it.id] = i));
    setElementPositions(pos);
  }, [array]);

  // -------------------------------------------------------
  // Step Logic
  // -------------------------------------------------------
  useEffect(() => {
    const step = steps[currentStep];

    const centerOfArray = totalWidth / 2;
    const defaultY = elementHeight / 2;

    const getX = (idx) => idx * (elementWidth + elementGap) + elementWidth / 2;
    const getLiftedY = () => elementHeight / 2 - lift;

    if (!step) {
      setOverlay((prev) => ({ ...prev, show: false }));
      setActiveMid(null);
      return;
    }

    // --- START ---
    if (step.type === "start") {
      setActiveMid(null);
      setOverlay({
        show: true,
        type: "start",
        message: `🔍 Starting Binary Search for ${target}...`,
        x1: centerOfArray,
        midX: centerOfArray,
        y: defaultY,
      });
      return;
    }

    // --- COMPARE + RANGE-ADJUSTMENT (mid may be null) ---
    if (step.type === "compare") {
      const mid = step.mid;

      // ----------------------------
      // 🔥 FIX: Handle mid === null
      // ----------------------------
      if (mid === null || mid < 0 || mid >= array.length) {
        setActiveMid(null);

        setOverlay({
          show: true,
          type: "compare",
          message: step.message,
          x1: centerOfArray,
          midX: centerOfArray,
          y: getLiftedY(),
        });

        return;
      }

      // Valid midpoint
      const item = array[mid];
      const found = item.value === target;
      const targetX = getX(mid);

      setActiveMid(mid);

      let msg = "";
      if (found) msg = `🎯 Found ${target} at index ${mid}!`;
      else if (item.value < target) msg = `${item.value} < ${target}. Target is in the Right half.`;
      else msg = `${item.value} > ${target}. Target is in the Left half.`;

      setOverlay({
        show: true,
        type: found ? "found" : "compare",
        message: msg,
        x1: targetX,
        midX: targetX,
        y: getLiftedY(),
      });

      return;
    }

    // --- NOT FOUND ---
    if (step.type === "notfound") {
      setActiveMid(null);
      setOverlay({
        show: true,
        type: "notfound",
        message: `❌ ${target} is not in the array.`,
        x1: centerOfArray,
        midX: centerOfArray,
        y: defaultY,
      });
      return;
    }

    // --- FINISH ---
    if (step.type === "finish") {
      const foundStep = steps.find((s) => s.type === "found");
      const wasFound = !!foundStep;
      const targetX = wasFound ? getX(foundStep.mid) : centerOfArray;

      setActiveMid(null);

      setOverlay({
        show: true,
        type: wasFound ? "found" : "notfound",
        message: wasFound
          ? `🎉 Search Complete. Element found.`
          : `❌ Search Complete. Element not found.`,
        x1: targetX,
        midX: targetX,
        y: defaultY,
      });
    }
  }, [currentStep, steps, array, target, totalWidth]);

  // -------------------------------------------------------
  // Positioning
  // -------------------------------------------------------
  useLayoutEffect(() => {
    if (overlay.show && messageBoxRef.current && containerRef.current) {
      const messageBoxWidth = messageBoxRef.current.offsetWidth;
      const halfMessageBoxWidth = messageBoxWidth / 2;

      let idealLeftEdge = overlay.midX - halfMessageBoxWidth;
      const padding = 10;

      let maxLeft = totalWidth - messageBoxWidth - padding;
      let minLeft = padding;

      const clampedLeft = Math.max(minLeft, Math.min(idealLeftEdge, maxLeft));
      const clampedMidX = clampedLeft + halfMessageBoxWidth;

      setOverlayPosition({ clampedMidX, opacity: 1 });
    } else {
      setOverlayPosition({ clampedMidX: 0, opacity: 0 });
    }
  }, [overlay, totalWidth]);

  const getAbsoluteX = (relativeX) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return (rect.width - totalWidth) / 2 + relativeX;
  };

  const getAbsoluteY = (relativeY) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return rect.height / 2 + relativeY;
  };

  const messageBoxAbsoluteY = getAbsoluteY(overlay.y - lift - messageBoxVerticalOffset);

  const boxClass = {
    start: "bg-purple-900/80 border-purple-700 text-purple-300",
    compare: "bg-yellow-900/80 border-yellow-700 text-yellow-300",
    found: "bg-green-900/80 border-green-700 text-green-300",
    notfound: "bg-red-900/80 border-red-700 text-red-300",
  }[overlay.type] || "bg-gray-900/80 border-gray-700";

  // -------------------------------------------------------
  // Element Styles
  // -------------------------------------------------------
  const getElementStyle = (item) => {
    const idx = elementPositions[item.id];
    const x = idx * (elementWidth + elementGap);

    const step = steps[currentStep] || {};
    const low = step.low ?? 0;
    const high = step.high ?? array.length - 1;

    const isEliminated = idx < low || idx > high;
    const isMid = idx === activeMid;

    const foundStep = steps.find((s) => s.type === "found");
    const isFinalFound = foundStep?.mid === idx && steps[currentStep]?.type === "finish";

    let glow = "0 0 10px rgba(255,255,255,0.05)";
    if (isFinalFound) glow = "0 0 20px 5px rgba(34,197,94,0.5)";
    else if (isMid) glow = "0 0 20px 5px rgba(234,179,8,0.5)";

    return {
      transform: `translateX(${x}px) translateY(${isMid ? -lift : 0}px) 
                  scale(${isMid ? 1.15 : isEliminated ? 0.9 : 1})`,
      boxShadow: isEliminated ? "none" : glow,
      zIndex: isMid ? 20 : 1,
      opacity: isEliminated ? 0.25 : 1,
      filter: isEliminated ? "grayscale(100%)" : "none",
      transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  const getElementClass = (item) => {
    const idx = elementPositions[item.id];
    const step = steps[currentStep] || {};
    const isMid = idx === activeMid;

    const foundStep = steps.find((s) => s.type === "found");
    const isFinalFound = foundStep?.mid === idx && steps[currentStep]?.type === "finish";

    let base =
      "absolute flex items-center justify-center w-16 h-16 rounded-xl font-bold text-xl border-2 transition-colors duration-500";

    if (isFinalFound) return `${base} bg-green-600 border-green-400 text-white`;
    if (isMid) {
      if (overlay.type === "found")
        return `${base} bg-green-600 border-green-400 text-white`;
      if (overlay.type === "compare")
        return `${base} bg-yellow-500 border-yellow-300 text-gray-900`;
    }
    return `${base} bg-blue-600 border-blue-400 text-white`;
  };

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-2xl h-full flex flex-col min-h-[34rem] relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:32px_32px] opacity-30 pointer-events-none"></div>

      <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2 relative z-10 mb-4">
        <Icon name="visualization" /> Binary Search Visualization
      </h2>

      <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-visible">
        
        {/* Floating Message Box */}
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
            <div className={`px-5 py-3 rounded-xl border shadow-2xl font-semibold text-center max-w-sm ${boxClass}`}>
              {overlay.message}
            </div>
          </div>
        </div>

        {/* Connector Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {overlay.show && messageBoxRef.current && (
            <line
              x1={getAbsoluteX(overlayPosition.clampedMidX)}
              y1={messageBoxAbsoluteY + messageBoxRef.current.offsetHeight / 2}
              x2={getAbsoluteX(overlay.x1)}
              y2={getAbsoluteY(overlay.y - elementHeight / 2 - lineTargetVerticalOffset)}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {/* Array */}
        <div className="relative" style={{ width: totalWidth, height: elementHeight }}>
          {array.map((item) => {
            const idx = elementPositions[item.id];
            const step = steps[currentStep] || {};
            const isMid = idx === step.mid;

            const low = step.low ?? 0;
            const high = step.high ?? array.length - 1;

            return (
              <div key={item.id} className="absolute transition-transform duration-500" style={getElementStyle(item)}>
                <div className={getElementClass(item)}>
                  {item.value}
                </div>

                {/* Labels */}
                <div className="absolute top-full mt-2 left-0 w-full flex flex-col items-center gap-1 font-bold text-[10px] tracking-wider pointer-events-none">
                  {idx === low && <span className="text-indigo-300 bg-indigo-900/50 px-1.5 py-0.5 rounded border border-indigo-500/30">L</span>}
                  {idx === high && <span className="text-pink-300 bg-pink-900/50 px-1.5 py-0.5 rounded border border-pink-500/30">H</span>}
                  {isMid && <span className="text-yellow-300 bg-yellow-900/50 px-1.5 py-0.5 rounded border border-yellow-500/30">M</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center flex-wrap gap-6 text-gray-400 text-sm relative z-10">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span> Active Range
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Midpoint (Comparing)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-700 border border-gray-600"></span> Eliminated
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span> Found
        </span>
      </div>
    </section>
  );
};


//==============================================================================
// Log View
//==============================================================================

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
            </div>
          );
        })}
      </div>
    </section>
  );
};

//==============================================================================
// Complexity Graph (Logarithmic)
//==============================================================================

const InteractiveComplexityGraph = () => {
  const [hoverData, setHoverData] = useState(null);
  const [animate, setAnimate] = useState(false);
  const graphRef = useRef(null);

  const maxN = 32;

  // Dynamic scaling — log2(32)=5, buffer to 8 for smoother graph
  const maxOps = 8;

  const padding = { top: 40, right: 80, bottom: 50, left: 60 };

  const [size, setSize] = useState({ width: 600, height: 400 });

  // Resize listener
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

  // Animate when entering viewport
  useEffect(() => {
    if (!graphRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => setAnimate(entries[0].isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;

  // Mapping functions
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

  // Mouse hover logic
  const handleMouseMove = (e) => {
    const rect = graphRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      x < padding.left ||
      x > width - padding.right ||
      y < padding.top ||
      y > height - padding.bottom
    ) {
      setHoverData(null);
      return;
    }

    const n = xToN(x);
    if (n >= 1 && n <= maxN) {
      const logVal = Math.log2(n);
      setHoverData({
        n,
        best: 1,
        avg: logVal,
        worst: Math.ceil(logVal),
        x: nToX(n),
        y,
      });
    }
  };

  // Curve path generator
  const getPath = (fn) => {
    const pts = [];
    for (let n = 1; n <= maxN; n++) {
      pts.push(`${nToX(n)},${opsToY(fn(n))}`);
    }
    return `M ${pts.join(" L ")}`;
  };

  return (
    <div className="bg-gray-900/90 p-4 rounded-2xl border border-gray-700 shadow-xl relative">
      <h3 className="text-2xl font-bold text-center mb-4 text-gray-100">
        Binary Search Time Complexity
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
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
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
          {[1, 8, 16, 24, 32].map((val) => (
            <g key={val}>
              <text
                x={nToX(val)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="fill-gray-300 text-xs"
              >
                {val}
              </text>
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

          {/* Curves */}
          <path
            d={getPath(() => 1)}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />

          <path
            d={getPath((n) => Math.log2(n))}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }}
          />

          {/* Labels */}
          <text
            x={nToX(maxN) + 5}
            y={opsToY(1)}
            textAnchor="start"
            className="fill-green-400 text-xs"
          >
            Best O(1)
          </text>

          <text
            x={nToX(maxN) + 5}
            y={opsToY(Math.log2(maxN))}
            textAnchor="start"
            className="fill-blue-400 text-xs"
          >
            Avg/Worst O(log n)
          </text>

          {/* Hover + Tooltip */}
          {hoverData && (
            <g>
              {/* Vertical line */}
              <line
                x1={hoverData.x}
                y1={padding.top}
                x2={hoverData.x}
                y2={height - padding.bottom}
                stroke="white"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Circles */}
              {[
                { y: opsToY(hoverData.best), color: "#22c55e", label: hoverData.best },
                { y: opsToY(hoverData.avg), color: "#3b82f6", label: hoverData.avg.toFixed(2) },
                { y: opsToY(hoverData.worst), color: "#ef4444", label: hoverData.worst },
              ].map((point, i) => (
                <circle
                  key={i}
                  cx={hoverData.x}
                  cy={point.y}
                  r={5}
                  fill={point.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}

              {/* Tooltip logic */}
              {(() => {
                const boxWidth = 120;
                const boxHeight = 80;

                let tooltipX = hoverData.x + 15;
                let tooltipY = opsToY(hoverData.worst) - boxHeight - 10;

                if (tooltipX + boxWidth > width - padding.right)
                  tooltipX = hoverData.x - boxWidth - 15;

                tooltipX = Math.max(padding.left, tooltipX);

                if (tooltipY < padding.top)
                  tooltipY = opsToY(hoverData.best) + 20;

                if (tooltipY + boxHeight > height - padding.bottom)
                  tooltipY = height - padding.bottom - boxHeight;

                return (
                  <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                    <rect width={boxWidth} height={boxHeight} rx="6" fill="black" opacity="0.85" />
                    <text x="8" y="18" className="fill-white text-xs">n = {hoverData.n}</text>
                    <text x="8" y="34" className="fill-green-400 text-xs">Best: 1</text>
                    <text x="8" y="50" className="fill-blue-400 text-xs">Avg: {hoverData.avg.toFixed(2)}</text>
                    <text x="8" y="66" className="fill-red-400 text-xs">Worst: {hoverData.worst}</text>
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


//==============================================================================
// Explanation Tab
//==============================================================================

const ExplanationTab = () => {
    const walkthroughData = [
        { 
            type: 'initial', 
            array: [10, 25, 30, 50, 60, 70], 
            target: 25, 
            description: "Starting with the full sorted array. Target = 25.", 
            isSummary: true 
        },
        { type: 'progress', text: 'Step 1: Calculate Midpoint' },
        { 
            type: 'step', 
            array: [10, 25, 30, 50, 60, 70], 
            target: 25, 
            lowIndex: 0, 
            highIndex: 5, 
            midIndex: 2, 
            description: "Low = 0, High = 5 → Mid = floor((0+5)/2) = 2. Value at Mid = 30." 
        },
        { type: 'progress', text: 'Step 2: Compare Values' },
        { 
            type: 'step', 
            array: [10, 25, 30, 50, 60, 70], 
            target: 25, 
            lowIndex: 0, 
            highIndex: 5, 
            midIndex: 2, 
            description: "30 > 25 → The target must be in the left half. New High = Mid - 1 = 1." 
        },
        { type: 'progress', text: 'Step 3: Recalculate Range' },
        { 
            type: 'step', 
            array: [10, 25, 30, 50, 60, 70], 
            target: 25, 
            lowIndex: 0, 
            highIndex: 1, 
            midIndex: 0, 
            description: "Low = 0, High = 1 → Mid = floor((0+1)/2) = 0. Value = 10." 
        },
        { 
            type: 'step', 
            array: [10, 25, 30, 50, 60, 70], 
            target: 25, 
            lowIndex: 0, 
            highIndex: 1, 
            midIndex: 0, 
            description: "10 < 25 → Target is in the right half. New Low = Mid + 1 = 1." 
        },
        { type: 'progress', text: 'Step 4: Match Found' },
        { 
            type: 'step', 
            array: [10, 25, 30, 50, 60, 70], 
            target: 25, 
            lowIndex: 1, 
            highIndex: 1, 
            midIndex: 1, 
            foundIndex: 1, 
            description: "Low = High = 1 → Mid = 1. Value = 25 → Target found!", 
            isFinished: true 
        },
    ];

    const sectionClasses =
      "bg-gray-800/60 p-6 md:p-8 rounded-2xl border border-gray-700/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20";

    return (
        <section className="text-gray-300 animate-fadeIn">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* -------------------- What is Binary Search? -------------------- */}
                <div className={sectionClasses}>
                    <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        <Icon name="search" className="w-8 h-8 text-purple-400"/>What is Binary Search?
                    </h2>
                    <p className="text-lg text-center leading-relaxed">
                        Binary Search is an <strong>efficient algorithm</strong> for locating a target value inside a 
                        <strong> sorted array</strong>. Instead of checking each element one by one, it repeatedly 
                        <strong> divides the search range in half</strong>. By eliminating half the possibilities at every 
                        step, it finds results much faster than linear search—especially in large datasets.
                    </p>
                </div>

                {/* -------------------- Key Characteristics -------------------- */}
                <div className={sectionClasses}>
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-200">
                        <Icon name="info" className="w-7 h-7 text-purple-400" />Key Characteristics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">

                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="font-bold text-xl text-purple-300">Divide & Conquer</h4>
                            <p className="text-sm text-gray-400 mt-2">
                                Each decision cuts the remaining search space in half.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="font-bold text-xl text-purple-300">Requires Sorted Data</h4>
                            <p className="text-sm text-gray-400 mt-2">
                                Binary Search only works correctly if the array is already sorted.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="font-bold text-xl text-purple-300">Highly Efficient</h4>
                            <p className="text-sm text-gray-400 mt-2">
                                With <strong>O(log n)</strong> time complexity, it scales extremely well for large arrays.
                            </p>
                        </div>

                    </div>
                </div>

                {/* -------------------- Walkthrough -------------------- */}
                <div className={sectionClasses}>
                    <h3 className="flex items-center justify-center gap-3 text-2xl font-bold mb-6 text-gray-200">
                        <Icon name="example" className="w-7 h-7 text-purple-400" />Example Walkthrough
                    </h3>
                    <div className="space-y-4">
                        {walkthroughData.map((item, index) => {
                            if (item.type === 'initial')
                                return (
                                  <div key={index}>
                                    <h4 className="text-xl text-center font-semibold text-purple-300 mb-2">Initial State</h4>
                                    <WalkthroughStep {...item} />
                                  </div>
                                );

                            if (item.type === 'progress')
                                return (
                                  <h4
                                    key={index}
                                    className="text-xl text-center font-semibold text-purple-300 pt-4 mt-4"
                                  >
                                    {item.text}
                                  </h4>
                                );

                            return <WalkthroughStep key={index} {...item} />;
                        })}
                    </div>
                </div>

                {/* -------------------- Algorithm -------------------- */}
                <div className={sectionClasses}>
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-200">
                        <Icon name="code" className="w-7 h-7 text-purple-400" />The Algorithm
                    </h3>
                    <ol className="list-decimal list-inside space-y-4 text-gray-300 leading-relaxed">

                        <li>
                            <strong>Initialize:</strong>  
                            Set <code>Low = 0</code> and <code>High = n - 1</code>.
                        </li>

                        <li>
                            <strong>Repeat while Low ≤ High:</strong>
                            <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                                <li>Compute <code>Mid = floor((Low + High) / 2)</code>.</li>
                                <li>If <code>Array[Mid] == Target</code>: Return <code>Mid</code>.</li>
                                <li>If <code>Array[Mid] &lt; Target</code> → Search right half (<code>Low = Mid + 1</code>).</li>
                                <li>If <code>Array[Mid] &gt; Target</code> → Search left half (<code>High = Mid - 1</code>).</li>
                            </ul>
                        </li>

                        <li>
                            <strong>If the loop ends without a match:</strong>  
                            The target does not exist in the array.
                        </li>

                    </ol>
                </div>

                {/* -------------------- Complexity Analysis -------------------- */}
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
                                    <p className="font-bold text-xl text-red-300">O(log n)</p>
                                    <p className="text-sm text-red-400">Worst Case</p>
                                </div>

                                <div className="text-center p-3 bg-orange-800/40 rounded-md">
                                    <p className="font-bold text-xl text-orange-300">O(log n)</p>
                                    <p className="text-sm text-orange-400">Average Case</p>
                                </div>

                                <div className="text-center p-3 bg-green-800/40 rounded-md">
                                    <p className="font-bold text-xl text-green-300">O(1)</p>
                                    <p className="text-sm text-green-400">Best Case</p>
                                    <p className="text-xs text-gray-400 mt-1">Midpoint equals target.</p>
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
                                <p className="text-sm text-sky-400">Iterative Approach</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* -------------------- Interactive Graph -------------------- */}
                <div className={sectionClasses}>
                    <h3 className="flex items-center justify-center gap-3 text-2xl font-bold mb-6 text-gray-200">
                        <Icon name="visualization" className="w-7 h-7 text-purple-400"/>Interactive Performance Graph
                    </h3>
                    <p className="text-center text-gray-400 mb-4">
                        This graph visualizes how Binary Search grows compared to Linear Search.  
                        Notice how its operations increase very slowly due to logarithmic complexity.
                    </p>
                    <InteractiveComplexityGraph />
                </div>

            </div>
        </section>
    );
};


//==============================================================================
// MAIN COMPONENT
//==============================================================================

const BinarySearchVisualizer = () => {
  // ---------------------------------------------------------------------------
  // State Management
  // ---------------------------------------------------------------------------
  const [array, setArray] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [customInput, setCustomInput] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [complexity, setComplexity] = useState({ comparisons: 0 });
  const [activeTab, setActiveTab] = useState("visualization");
  const [copyTooltipText, setCopyTooltipText] = useState("Copy");

  const logViewRef = useRef(null);

  // Helper to create objects with IDs for stable rendering
  const createArrayFromValues = (values) =>
    values.map((value, index) => ({ id: index, value }));

  // ---------------------------------------------------------------------------
  // 1. Array Initialization (Fixed to 10 Elements)
  // ---------------------------------------------------------------------------
  const handleReset = useCallback(() => {
    // UPDATED: Fixed size to 10
    const newValues = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    
    // CRITICAL: Binary Search requires sorted array
    newValues.sort((a, b) => a - b);
    
    const arr = createArrayFromValues(newValues);
    setArray(arr);
    setIsSearching(false);
    setIsPaused(true);
    setIsFinished(false);
    setComplexity({ comparisons: 0 });

    // Initial "Start" Step
    setSteps([
      {
        message: "Generated a new sorted array. Enter a target and press Play.",
        type: "start",
        arrState: arr,
        low: 0,
        high: arr.length - 1,
        mid: null,
        found: null,
        complexity: { comparisons: 0 }
      }
    ]);

    setCurrentStep(0);
  }, []);

  // Run once on mount
  useEffect(handleReset, []);

  // ---------------------------------------------------------------------------
  // 2. Step Generation Logic (Binary Search)
  // ---------------------------------------------------------------------------
  const generateSteps = (arr, target) => {
    let generatedSteps = [];
    let currentComplexity = { comparisons: 0 };
    let low = 0;
    let high = arr.length - 1;
    let foundIndex = null;

    // 1. Start
    generatedSteps.push({
      message: `Starting search for ${target} in range [0, ${high}].`,
      type: "start",
      low, high, mid: null, found: null,
      complexity: { ...currentComplexity }
    });

    while (low <= high) {
      // Calculate Mid
      let mid = Math.floor((low + high) / 2);
      let midVal = arr[mid].value;

      currentComplexity.comparisons++;

      // 2. Compare Step (Visualization active state)
      generatedSteps.push({
        message: `Checking Middle Index ${mid} (Value: ${midVal}). Range: [${low}, ${high}]`,
        type: "compare",
        low, high, mid, found: null,
        complexity: { ...currentComplexity }
      });

      if (midVal === target) {
        foundIndex = mid;
        // 3. Found Step
        generatedSteps.push({
          message: `Target ${target} found at index ${mid}!`,
          type: "found",
          low, high, mid, found: mid,
          complexity: { ...currentComplexity }
        });
        // 4. Finish Step (Found)
        generatedSteps.push({
          message: "Search complete.",
          type: "finish",
          low, high, mid, found: mid,
          complexity: { ...currentComplexity }
        });
        break;
      } else if (midVal < target) {
        low = mid + 1;
        // 3. Adjust Range (Right)
        generatedSteps.push({
            message: `${midVal} < ${target}. Ignoring left half. New Range: [${low}, ${high}]`,
            type: "compare", // Keep highlights active
            low, high, mid: null, found: null,
            complexity: { ...currentComplexity }
        });
      } else {
        high = mid - 1;
        // 3. Adjust Range (Left)
        generatedSteps.push({
            message: `${midVal} > ${target}. Ignoring right half. New Range: [${low}, ${high}]`,
            type: "compare", // Keep highlights active
            low, high, mid: null, found: null,
            complexity: { ...currentComplexity }
        });
      }
    }

    if (foundIndex === null) {
      // 4. Not Found Step
      generatedSteps.push({
        message: `Range exhausted (Low > High). ${target} not found.`,
        type: "notfound",
        low: low, high: high, mid: null, found: null,
        complexity: { ...currentComplexity }
      });
      // 5. Finish Step (Not Found)
      generatedSteps.push({
          message: "Search complete.",
          type: "finish",
          low: low, high: high, mid: null, found: null,
          complexity: { ...currentComplexity }
        });
    }

    return generatedSteps;
  };

  // ---------------------------------------------------------------------------
  // 3. Control Handlers
  // ---------------------------------------------------------------------------
  const toggleSearch = () => {
    if (isFinished) return;
    if (targetValue === "" || targetValue === null) {
        alert("Please enter a target value.");
        return;
    }

    // Generate steps only once when starting a new search
    if (!isSearching && currentStep === 0) {
        const newSteps = generateSteps(array, Number(targetValue));
        setSteps(newSteps);
    }

    setIsSearching(true);
    setIsPaused(!isPaused);
  };

  // Animation Loop
  useEffect(() => {
    let timer;
    if (isSearching && !isPaused && !isFinished) {
      if (currentStep < steps.length - 1) {
        timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 1100 - speed * 10);
      } else {
        setIsFinished(true);
        setIsSearching(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isSearching, isPaused, isFinished, currentStep, steps, speed]);

  const goToStep = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    setIsPaused(true);
    setCurrentStep(stepIndex);
    if(stepIndex === steps.length - 1) setIsFinished(true);
    else setIsFinished(false);
  };

  const stepForward = () => goToStep(currentStep + 1);
  const stepBackward = () => goToStep(currentStep - 1);

  const handleCustomArray = () => {
    const newValues = customInput
      .split(/[, ]+/)
      .map((item) => parseInt(item.trim()))
      .filter((item) => !isNaN(item));

    // UPDATED: Limit validation to 10
    if (newValues.length === 0 || newValues.length > 10) {
      alert("Please enter between 1 and 10 valid numbers.");
      return;
    }
    
    // Sort custom input
    newValues.sort((a, b) => a - b);

    const arr = createArrayFromValues(newValues);
    setArray(arr);

    setSteps([
      {
        message: "Custom array loaded and sorted. Enter target and press Play.",
        type: "start",
        arrState: arr,
        low: 0, high: arr.length - 1, mid: null,
        complexity: { comparisons: 0 }
      }
    ]);

    setCurrentStep(0);
    setIsPaused(true);
    setIsFinished(false);
    setComplexity({ comparisons: 0 });
  };

  // ---------------------------------------------------------------------------
  // 4. UI Helpers
  // ---------------------------------------------------------------------------
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyTooltipText("Copied!");
      setTimeout(() => setCopyTooltipText("Copy"), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Binary Search Visualizer",
        text: "Check out this interactive Binary Search visualizer!",
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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center font-sans">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/40 to-indigo-900/60 -z-10" />

      {/* HEADER */}
      <header className="w-full max-w-7xl text-center py-10 animate-fadeIn">
        <div className="flex justify-start">
          <Breadcrumb />
        </div>

        <div className="inline-block bg-green-400/10 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border border-green-400/20">
          Divide & Conquer
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Binary Search Visualizer
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Step-by-step visualization of the O(log n) search algorithm.
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
            className={`px-4 py-2 font-medium transition-colors ${getTabClass("visualization")}`}
            onClick={() => setActiveTab("visualization")}
          >
            Visualization
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${getTabClass("explanation")}`}
            onClick={() => setActiveTab("explanation")}
          >
            Explanation
          </button>
        </div>

        {activeTab === "visualization" ? (
          <div className="animate-fadeIn">
            {/* Complexity Stats */}
            <ComplexityDisplay complexity={displayedStep.complexity || complexity} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                {/* Visualization Area */}
                {/* Note: Array fixed to 10 in state, so no slicing needed here */}
                <VisualizationArea
                  array={array}
                  steps={steps}
                  currentStep={currentStep}
                  target={targetValue}
                />
              </div>

              <div className="lg:col-span-1">
                {/* Controls */}
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
              {/* Logs */}
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
        <p>Binary Search Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
    </div>
  );
};

export default BinarySearchVisualizer;