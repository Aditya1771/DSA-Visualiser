import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";

// Icon Component (with 'insert' icon)
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    insert: (
      <>
        {/* Insertion sort icon - showing element insertion */}
        <rect x="3" y="3" width="6" height="18" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="11" y="8" width="6" height="8" rx="1" fill="currentColor" />
        <rect x="19" y="5" width="2" height="14" rx="1" fill="currentColor" opacity="0.8" />
        <path d="M13 6 L17 6 L17 4 L19 7 L17 10 L17 8 L13 8 Z" fill="currentColor" opacity="0.9" />
      </>
    ),
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
    shifts: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />,
    insertions: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75" />,
    sortOrder: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />,
    copy: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6m4-3 5 5-5 5m5-5H9" />,
    code: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" />,
    time: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    space: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    xmark: <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    key: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
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

//GLOSSY BUTTON COMPONENT
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

// BREADCRUMB COMPONENT
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
        Insertion Sort
      </li>
    </ol>
  </nav>
);

// Other Components
const AnimatedNumber = ({ value }) => {
    const [currentValue, setCurrentValue] =useState(value);
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
        prevValueRef.current = value;
      };
    }, [value]);

    return <>{currentValue}</>;
  };

const ComplexityDisplay = ({ complexity }) => (
  <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
    <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
      <Icon name="chart"/>
      Complexity Analysis
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-4 rounded-lg border border-indigo-700/50">
        <h3 className="flex items-center gap-2 text-sm text-indigo-300 mb-1">
          <Icon name="comparisons"/>Comparisons
        </h3>
        <span className="text-2xl font-bold text-indigo-300">
          <AnimatedNumber value={complexity.comparisons} />
        </span>
      </div>
      <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-4 rounded-lg border border-pink-700/50">
        <h3 className="flex items-center gap-2 text-sm text-pink-300 mb-1">
          <Icon name="shifts"/>Shifts
        </h3>
        <span className="text-2xl font-bold text-pink-300">
          <AnimatedNumber value={complexity.shifts} />
        </span>
      </div>
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-4 rounded-lg border border-purple-700/50">
        <h3 className="flex items-center gap-2 text-sm text-purple-300 mb-1">
          <Icon name="insertions"/>Insertions
        </h3>
        <span className="text-2xl font-bold text-purple-300">
          <AnimatedNumber value={complexity.insertions} />
        </span>
      </div>
    </div>
  </section>
);

const Controls = ({
    isFinished, isPaused, isSorting, currentStep, steps, speed, customInput, sortOrder,
    toggleSorting, stepBackward, stepForward, handleReset, loadExampleArray, toggleSortOrder,
    setSpeed, setCustomInput, handleCustomArray
  }) => {
    const isPlayPauseDisabled = isFinished;
    const isBackDisabled = currentStep <= 0;
    const isNextDisabled = currentStep >= steps.length - 1;
    const isSortOrderDisabled = isSorting;
    const isCustomInputDisabled = isSorting;

    const playPauseStyles = !isPaused
      ? { gradient: "bg-gradient-to-r from-yellow-400 to-orange-500" }
      : { gradient: "bg-gradient-to-r from-green-400 to-emerald-500" };

    return (
      <section className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-lg h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
          <Icon name="controls"/>
          Controls
        </h2>
        <div className="flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <GlossyButton
                  onClick={toggleSorting}
                  disabled={isPlayPauseDisabled}
                  gradientClasses={playPauseStyles.gradient}
                  className="w-full"
                >
                  {!isPaused ? <><Icon name="pause"/>Pause</> : <><Icon name="play"/>Play</>}
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
                <Icon name="stepBack"/>Back
              </GlossyButton>
              <GlossyButton
                onClick={stepForward}
                disabled={isNextDisabled}
                gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400"
                className="w-full"
              >
                Next<Icon name="stepForward"/>
              </GlossyButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlossyButton
                onClick={loadExampleArray}
                gradientClasses="bg-gradient-to-r from-indigo-500 to-purple-500"
                className="w-full"
              >
                <Icon name="example"/>Example
              </GlossyButton>
              <GlossyButton
                onClick={toggleSortOrder}
                disabled={isSortOrderDisabled}
                gradientClasses="bg-gradient-to-r from-teal-400 to-cyan-500"
                className="w-full"
              >
                <Icon name="sortOrder" />
                {sortOrder === 'ascending' ? 'Asc' : 'Desc'}
              </GlossyButton>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-700/50">
              <label htmlFor="custom-input" className="text-sm text-gray-400">Custom Array (comma-separated)</label>
              <input
                id="custom-input"
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 5, 3, 8"
                disabled={isCustomInputDisabled}
                className="w-full px-4 py-2 bg-gray-900/80 border border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 text-white disabled:bg-gray-800/50"
              />
              <GlossyButton
                onClick={handleCustomArray}
                disabled={isCustomInputDisabled}
                gradientClasses="bg-gradient-to-r from-purple-500 to-pink-500"
                className="w-full"
              >
                Apply Array
              </GlossyButton>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-700/50">
              <label htmlFor="speed-slider" className="text-sm text-gray-400">Animation Speed</label>
              <div className="flex items-center gap-3">
                <input
                  id="speed-slider"
                  type="range"
                  min="1"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium w-10">{speed}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

const VisualizationArea = ({ array, sorted, sortOrder, currentKeyIndex, highlightedComparison, shiftedItems, steps }) => {
    const [elementPositions, setElementPositions] = useState({});
    const [overlayContent, setOverlayContent] = useState({ show: false, x1: 0, x2: 0, y: 0, message: '', type: 'compare' });
    const [overlayPosition, setOverlayPosition] = useState({ clampedMidX: 0, opacity: 0 });
    const [movingKeyId, setMovingKeyId] = useState(null); // ID of the element currently being inserted (the 'key')
    const [keyTargetX, setKeyTargetX] = useState(null); // New state for the key's target X-position (left edge of element)

    const containerRef = useRef(null);
    const messageBoxRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    // Update element positions whenever the array changes
    useEffect(() => {
        const newPositions = {};
        array.forEach((item, index) => {
            newPositions[item.id] = index;
        });
        setElementPositions(newPositions);
        // Reset keyTargetX when array structure changes significantly
        setKeyTargetX(null);
    }, [array]);

    // Track the movingKeyId based on currentKeyIndex
    useEffect(() => {
        if (currentKeyIndex !== null && currentKeyIndex < array.length) {
            setMovingKeyId(array[currentKeyIndex].id);
        } else {
            setMovingKeyId(null);
        }
    }, [currentKeyIndex, array]);

    const elementWidth = 64;
    const elementHeight = 64;
    const elementGap = 8;
    const highlightLift = 40; // Lift for elements being compared/shifted
    const keyLift = 80;       // Higher lift for the 'key' element itself
    const messageBoxTopOffset = 40; // Fixed offset from the top of the visualization area's content
    const lineTargetVerticalOffset = 10; // Offset for lines to connect to element top
    const keyComparisonOffsetX = -elementWidth / 4; // Offset key from compared element to avoid direct overlap

    const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

    // Animation logic for comparisons, shifts, and insertions
    useEffect(() => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

        const currentStepData = steps[0];
        if (!currentStepData || !containerRef.current) {
            setOverlayContent(prev => ({ ...prev, show: false }));
            setKeyTargetX(null); // Reset key target when no active step
            return;
        }

        const keyItem = array.find(d => d.id === movingKeyId);
        const keyCurrentVisualIndex = keyItem ? elementPositions[keyItem.id] : null;
        // x and y for line references are still based on the logical position for the key
        const keyLogicalXCenter = keyItem ? (keyCurrentVisualIndex * (elementWidth + elementGap)) + (elementWidth / 2) : 0;
        const keyYForLineRef = keyItem ? (elementHeight / 2 - keyLift) : 0; // Reference Y for connecting lines

        let overlayLineX1 = keyLogicalXCenter; // Default line start for the key
        let overlayLineX2 = keyLogicalXCenter; // Default line end, will be updated for comparisons

        let newKeyTargetX = null; // Variable to hold the calculated target X for the key element

        // Determine line endpoints, message content, and key's target X based on step type
        if (currentStepData.type === 'compare' && highlightedComparison.length === 1 && keyItem) {
            const compareIdx = highlightedComparison[0];
            const compareItem = array.find(d => elementPositions[d.id] === compareIdx);
            if (compareItem) {
                const compareElementLeftX = compareIdx * (elementWidth + elementGap);
                overlayLineX2 = compareElementLeftX + (elementWidth / 2); // Center of compared item for line
                // Key moves to the left of the element it's comparing against
                newKeyTargetX = compareElementLeftX + keyComparisonOffsetX;
            }
            setOverlayContent({
                show: true,
                x1: keyLogicalXCenter, // Line from logical key position
                x2: overlayLineX2, // Line to compared element
                y: keyYForLineRef,
                message: currentStepData.message,
                type: currentStepData.type
            });
            setKeyTargetX(newKeyTargetX);
        } else if (currentStepData.type === 'shift' && highlightedComparison.length === 1 && keyItem) {
            const shiftedIdx = highlightedComparison[0];
            const shiftedItem = array.find(d => elementPositions[d.id] === shiftedIdx);
            if (shiftedItem) {
                const shiftedElementLeftX = shiftedIdx * (elementWidth + elementGap);
                overlayLineX2 = shiftedElementLeftX + (elementWidth / 2); // Center of shifted item for line
                // Key moves towards the element it's causing to shift
                newKeyTargetX = shiftedElementLeftX + keyComparisonOffsetX;
            }
            setOverlayContent({
                show: true,
                x1: keyLogicalXCenter,
                x2: overlayLineX2,
                y: keyYForLineRef,
                message: currentStepData.message,
                type: currentStepData.type
            });
            setKeyTargetX(newKeyTargetX);
        } else if (currentStepData.type === 'insert' && keyItem) {
            // When inserting, the key should go to its final visual position
            const insertedIdx = highlightedComparison.length > 0 ? highlightedComparison[0] : (keyItem ? elementPositions[keyItem.id] : 0);
            const finalKeyLeftX = insertedIdx * (elementWidth + elementGap);
            overlayLineX1 = finalKeyLeftX + (elementWidth / 2); // Line from center of final insertion spot
            overlayLineX2 = overlayLineX1; // No second target for line
            newKeyTargetX = finalKeyLeftX; // Key moves to its final insertion spot (left edge)

            setOverlayContent({
                show: true,
                x1: overlayLineX1, // Line from final insertion spot
                x2: overlayLineX2,
                y: keyYForLineRef,
                message: currentStepData.message,
                type: currentStepData.type
            });
            setKeyTargetX(newKeyTargetX);
        } else if (currentStepData.type === 'iteration' && keyItem) {
             // For iteration, key should hover at its current logical position
             const keyLogicalLeftX = keyCurrentVisualIndex * (elementWidth + elementGap);
             newKeyTargetX = keyLogicalLeftX;
             setOverlayContent({
                show: true,
                x1: keyLogicalXCenter,
                x2: keyLogicalXCenter,
                y: keyYForLineRef,
                message: currentStepData.message,
                type: currentStepData.type
            });
            setKeyTargetX(newKeyTargetX);
        } else if (currentStepData.type === 'finish') {
            setOverlayContent({
                show: true,
                x1: totalWidth / 2, // Center message for finish
                x2: totalWidth / 2,
                y: 0, // No specific element lift, so just relative to array center
                message: currentStepData.message,
                type: currentStepData.type
            });
            setKeyTargetX(null); // Reset key target
        } else {
            setOverlayContent(prev => ({ ...prev, show: false }));
            setKeyTargetX(null); // Reset key target for other or no steps
        }

        return () => clearTimeout(animationTimeoutRef.current);
    }, [highlightedComparison, steps, array, elementPositions, sortOrder, currentKeyIndex, movingKeyId, shiftedItems, totalWidth]);

    // Position the overlay message box
    useLayoutEffect(() => {
        if (overlayContent.show && messageBoxRef.current && containerRef.current) {
            const messageBoxWidth = messageBoxRef.current.offsetWidth;
            const halfMessageBoxWidth = messageBoxWidth / 2;

            // Calculate the midpoint of the line for message box positioning
            let targetXForOverlay = (overlayContent.x1 + overlayContent.x2) / 2;

            const padding = 10;
            // Clamp the midpoint of the message box within the array's total width
            let clampedMidX = Math.max(
                halfMessageBoxWidth + padding, // Min left limit (padding from left edge)
                Math.min(targetXForOverlay, totalWidth - halfMessageBoxWidth - padding) // Max right limit (padding from right edge)
            );

            setOverlayPosition({ clampedMidX, opacity: 1 });
        } else {
            setOverlayPosition({ clampedMidX: 0, opacity: 0 });
        }
    }, [overlayContent, totalWidth]);


    // Calculate absolute Y position for the message box, always fixed at the top
    const getMessageBoxAbsoluteY = () => {
        if (!containerRef.current) return messageBoxTopOffset;
        // The message box's top should be `messageBoxTopOffset` pixels from the
        // top edge of the `containerRef`'s content area.
        return messageBoxTopOffset;
    };


    // Style for each array element
    const getElementStyle = (item) => {
        let currentVisualIndex = elementPositions[item.id];
        let targetX = currentVisualIndex * (elementWidth + elementGap); // Default based on logical position
        let targetY = 0;
        let zIndex = 1;
        let dynamicBoxShadow = '0 0 8px rgba(0, 191, 255, 0.2)'; // Default blue glow

        const isCurrentlyMovingKey = item.id === movingKeyId;
        const isShifted = shiftedItems.includes(item.id);
        const isBeingComparedAgainst = highlightedComparison.includes(currentVisualIndex);

        if (isCurrentlyMovingKey) {
            targetY = -keyLift; // The key element floats highest
            zIndex = 20; // HIGHEST Z-INDEX
            dynamicBoxShadow = '0 0 15px 3px #a78bfa, 0 0 20px 6px rgba(167, 139, 250, 0.3)'; // Purple glow for key

            // Use keyTargetX if it's set, otherwise use its current logical position
            if (keyTargetX !== null) {
                targetX = keyTargetX;
            }
        } else if (isShifted) {
            targetX += (elementWidth + elementGap); // Visually move right
            targetY = -highlightLift; // Lift shifted elements slightly
            zIndex = 10; // High enough to be above non-highlighted elements
            dynamicBoxShadow = '0 0 15px 3px #fde047, 0 0 20px 6px rgba(253, 224, 71, 0.3)'; // Yellow glow for shifted
        } else if (isBeingComparedAgainst) {
            // Only lift if it's explicitly being compared AGAINST the key
            const currentStepType = steps[0]?.type;
            if (currentStepType === 'compare' || currentStepType === 'shift' || currentStepType === 'insert') {
                targetY = -highlightLift; // Lift elements being compared against
                zIndex = 10; // High enough to be above non-highlighted elements
                // Determine comparison highlight color
                if (currentStepType === 'compare') {
                    const keyVal = array.find(d => d.id === movingKeyId)?.value;
                    const compareVal = item.value;
                    if (keyVal !== undefined && compareVal !== undefined) {
                        const comparisonResult = sortOrder === 'ascending' ? keyVal < compareVal : keyVal > compareVal;
                        dynamicBoxShadow = comparisonResult
                            ? '0 0 15px 3px #f59e0b, 0 0 20px 6px rgba(245, 158, 11, 0.3)' // Orange for "should shift"
                            : '0 0 15px 3px #22c55e, 0 0 20px 6px rgba(34, 197, 94, 0.3)'; // Green for "stay in place / insert here"
                    }
                } else if (currentStepType === 'insert') {
                    dynamicBoxShadow = '0 0 15px 3px #ec4899, 0 0 20px 6px rgba(236, 72, 153, 0.3)'; // Pink for insertion target
                }
            }
        }
        // Elements not involved in comparison/shift/key will have default targetY=0 and zIndex=1

        return {
            transform: `translateX(${targetX}px) translateY(${targetY}px)`,
            boxShadow: dynamicBoxShadow,
            zIndex: zIndex,
            transition: 'transform 500ms ease-in-out, box-shadow 300ms ease-in-out'
        };
    };

    // Class name for each array element
    const getElementClassName = (item) => {
        const isSorted = sorted.includes(elementPositions[item.id]);
        const isKey = item.id === movingKeyId;
        let classes = 'absolute flex items-center justify-center w-16 h-16 rounded-lg font-bold text-xl border-2 transition-transform duration-500 ease-in-out';

        if (isKey) {
            classes += ' bg-purple-600/90 border-purple-500 text-white shadow-lg';
        } else if (isSorted) {
            classes += ' bg-green-600/90 border-green-500 text-white';
        } else {
            classes += ' bg-blue-600/90 border-blue-500 text-white';
        }
        return classes;
    };

    // Calculate absolute positions for SVG line drawing
    const getAbsoluteX = (relativeX) => {
        if (!containerRef.current) return 0;
        const containerRect = containerRef.current.getBoundingClientRect();
        // Assuming the visualization area content is centered
        const arrayLeftOffset = (containerRect.width - totalWidth) / 2;
        return arrayLeftOffset + relativeX;
    }

    const getAbsoluteY = (relativeY) => {
        if (!containerRef.current) return 0;
        const containerRect = containerRef.current.getBoundingClientRect();
        // The array elements are vertically centered in the visualization area
        const arrayCenterY = containerRect.height / 2;
        return arrayCenterY + relativeY;
    }

    // Get the y-coordinate for lines to connect to the *top* of an element
    const getLineTargetY = (targetRelativeX, isKey = false, isShiftedOrCompared = false) => {
        if (!containerRef.current) return 0;

        let elementTopVisualOffset = 0;
        if (isKey) {
            elementTopVisualOffset = -keyLift;
        } else if (isShiftedOrCompared) {
            elementTopVisualOffset = -highlightLift;
        }

        // Return the absolute Y coordinate of the *top* of the element,
        // adjusted for its visual lift and a small offset for the line.
        return getAbsoluteY(elementTopVisualOffset - lineTargetVerticalOffset);
    }

    const actualMessageBoxAbsoluteY = getMessageBoxAbsoluteY();

    return (
  <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl h-full flex flex-col min-h-[32rem] relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:32px_32px] opacity-30 pointer-events-none"></div>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
                <Icon name="visualization" />
                Animated Array
            </h2>
            <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-visible">
                {/* Overlay for message box */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 transition-opacity duration-300" style={{ opacity: overlayPosition.opacity }}>
                    <div ref={messageBoxRef} className="absolute transition-transform duration-300"
                         style={{
                             top: actualMessageBoxAbsoluteY, // Fixed Y position
                             left: getAbsoluteX(overlayPosition.clampedMidX),
                             transform: `translateX(-50%)`
                         }}>
                        <div className={`font-semibold px-4 py-2 rounded-lg shadow-xl border text-center max-w-xs
                            ${overlayContent.type === 'compare' ? 'bg-yellow-900/80 border-yellow-700 text-yellow-300' : ''}
                            ${overlayContent.type === 'shift' ? 'bg-amber-900/80 border-amber-700 text-amber-300' : ''}
                            ${overlayContent.type === 'insert' ? 'bg-pink-900/80 border-pink-700 text-pink-300' : ''}
                            ${overlayContent.type === 'iteration' || overlayContent.type === 'start' ? 'bg-purple-900/80 border-purple-700 text-purple-300' : ''}
                            ${overlayContent.type === 'finish' ? 'bg-green-900/80 border-green-700 text-green-300' : ''}
                        `}>
                            {overlayContent.message}
                        </div>
                    </div>
                </div>

                {/* SVG for connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                    <defs>
                        <radialGradient id="glow"><stop offset="0%" stopColor="#00ffff" stopOpacity="1" /><stop offset="100%" stopColor="#00ffff" stopOpacity="0" /></radialGradient>
                    </defs>
                    {overlayContent.show && messageBoxRef.current && (
                        <g className="overlay-connectors" style={{ opacity: overlayPosition.opacity }}>
                            {/* Line to the key element (always present when showing message for insertion sort and key exists) */}
                            {movingKeyId && currentKeyIndex !== null && (
                                <line
                                    x1={getAbsoluteX(overlayPosition.clampedMidX)}
                                    y1={actualMessageBoxAbsoluteY + messageBoxRef.current.offsetHeight / 2}
                                    x2={getAbsoluteX(overlayContent.x1)}
                                    y2={getLineTargetY(overlayContent.x1, true)} // Connect to the floating key
                                    stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeDasharray="4 4"
                                />
                            )}
                            {/* Line to the element being compared against or shifted (if distinct from key) */}
                            {overlayContent.x1 !== overlayContent.x2 && highlightedComparison.length > 0 && (
                                <line
                                    x1={getAbsoluteX(overlayPosition.clampedMidX)}
                                    y1={actualMessageBoxAbsoluteY + messageBoxRef.current.offsetHeight / 2}
                                    x2={getAbsoluteX(overlayContent.x2)}
                                    y2={getLineTargetY(overlayContent.x2, false, true)} // Connect to compared/shifted item
                                    stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeDasharray="4 4"
                                />
                            )}
                        </g>
                    )}
                </svg>

                {/* Array elements container */}
                <div className="relative" style={{ width: `${totalWidth}px`, height: `${elementHeight}px` }}>
                    {array.map(item => {
                        return (
                            <div key={item.id} className={getElementClassName(item)} style={getElementStyle(item)}>
                                <div className="element-content">{item.value}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Legend for colors */}
            <div className="mt-4 flex justify-center gap-6 text-gray-400 text-sm">
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-600/90"></span> Sorted
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-600/90"></span> Unsorted
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-600/90"></span> Key (Element to Insert)
                </span>
                 <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-900/80"></span> Shifting
                </span>
            </div>
        </section>
    );
};



const LogView = ({ steps, currentStep, goToStep, logViewRef }) => {
  const getStepStyle = (type) => {
    const styles = {
      start: "bg-indigo-600/90", 
      iteration: "bg-purple-600/90", 
      compare: "bg-yellow-500/90",
      shift: "bg-pink-600/90", 
      insert: "bg-green-600/90", 
      finish: "bg-teal-600/90"
    };
    return styles[type] || "bg-gray-600/90";
  };

  return (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-300">
          <Icon name="info"/>
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
          const logMessageStyle = `m-2 p-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${getStepStyle(step.type)} ${
            isCurrent
              ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400 opacity-100'
              : 'opacity-70 hover:opacity-100'
          }`;

          return (
            <div key={index} data-step-index={index} onClick={() => goToStep(index)} className={logMessageStyle}>
              <div className="flex items-start gap-3 m-1">
                <span className="font-bold text-white/80 pt-0.5">{index + 1}.</span>
                <p className="text-white text-sm flex-1">{step.message}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1 px-2">
                {step.arrState.map((item, idx) => (
                  <div key={idx} className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                    step.highlights?.includes(idx) ? 'bg-yellow-400 text-gray-900' : 
                    step.keyIndex === idx ? 'bg-yellow-600 text-white' :
                    step.sorted?.includes(idx) ? 'bg-green-500 text-white' : 'bg-blue-500/80 text-white'
                  }`}>
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

const InteractiveComplexityGraph = () => {
  const [hoverData, setHoverData] = useState(null);
  const [animate, setAnimate] = useState(false);
  const graphRef = useRef(null);

  const maxN = 25;
  // Adjusted maxOps to give more vertical space at the top for labels
  const maxOps = (maxN * maxN) + 100; // Scales properly for n² and leaves room at top
  const padding = { top: 40, right: 80, bottom: 50, left: 60 }; // Increased right padding

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
          setAnimate(false); // Reset animation if scrolled out
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
        best: n,          // O(n)
        avg: n * n,       // O(n²) - raw for tooltip
        worst: n * n,     // O(n²) - raw for tooltip
        x: nToX(n),
        y, // Use mouse Y for general hover line, actual Y for curve points
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
        Insertion Sort Time Complexity
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

          {/* Y-axis grid lines and labels */}
          {[0, 150, 300, 450, 600].map((val) => (
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

          {/* X-axis grid lines and labels */}
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

          {/* Curves */}
          <path
            d={getPath((n) => n)}
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
            d={getPath((n) => n * n )} // visually lower avg curve (still O(n²))
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
            d={getPath((n) => n * n)} // worst-case O(n²)
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{
              transition: "stroke-dashoffset 2s ease-out 1s",
            }}
          />

          {/* Labels for clarity - repositioned */}
          {/* Best O(n) */}
          <text
            x={nToX(maxN) + 5} // Slightly past the end of the line
            y={opsToY(maxN)}
            textAnchor="start" // Anchor to start for better visibility
            className="fill-green-400 text-xs"
          >
            Best O(n)
          </text>
          {/* Avg O(n²) */}
          <text
            x={nToX(maxN) + 5}
            y={opsToY(maxN * maxN * 0.95) - 5} // Adjust Y for clarity
            textAnchor="start"
            className="fill-blue-400 text-xs"
          >
            Avg O(n²)
          </text>
          {/* Worst O(n²) */}
          <text
            x={nToX(maxN) + 5}
            y={opsToY(maxN * maxN) - 5} // Adjust Y for clarity
            textAnchor="start"
            className="fill-red-400 text-xs"
          >
            Worst O(n²)
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
                opacity="0.6" // Slightly reduced opacity
              />

              {[
                { y: opsToY(hoverData.best), color: "#22c55e" },
                { y: opsToY(hoverData.avg), color: "#3b82f6" }, // Use 0.8 factor for consistency with curve
                { y: opsToY(hoverData.worst), color: "#ef4444" }
              ].map((point, i) => (
                <circle
                  key={i}
                  cx={hoverData.x}
                  cy={point.y}
                  r={5} // Fixed radius for clarity
                  fill={point.color}
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-300 ease-out" // Smoother hover effect
                />
              ))}

              {/* Tooltip */}
              {(() => {
                const boxWidth = 120;
                const boxHeight = 70; // Slightly taller for more room
                let tooltipX = hoverData.x + 15; // Offset more from line
                // Position tooltip above the worst-case point, or at top if it goes off
                let tooltipY = opsToY(hoverData.worst) - boxHeight - 10;
                tooltipY = Math.max(padding.top, tooltipY); // Ensure it's not above top padding

                // Adjust X if tooltip goes off right edge
                if (tooltipX + boxWidth > width - padding.right) {
                  tooltipX = hoverData.x - boxWidth - 15; // Position to the left
                }
                // Ensure it doesn't go off the left edge
                tooltipX = Math.max(padding.left, tooltipX);


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
                      opacity="0.85" // Slightly less transparent
                    />
                    <text x="8" y="18" className="fill-white text-xs">
                      n = {hoverData.n}
                    </text>
                    <text x="8" y="34" className="fill-green-400 text-xs">
                      Best: {hoverData.best}
                    </text>
                    <text x="8" y="48" className="fill-blue-400 text-xs">
                      Avg: {Math.round(hoverData.avg)}
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


const WalkthroughStep = ({ before, after, comparing, swapped, sorted, description, isSummary }) => {
    const getItemClass = (index, value, arrayType) => {
        let classes = 'relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg shadow-lg transition-all duration-300 ease-in-out border-2 ';
        
        const isSorted = sorted && sorted.includes(index);
        const isComparing = comparing && comparing.includes(index);
        // isSwapped applies to elements in the 'after' array that were just swapped
        const isSwapped = arrayType === 'after' && swapped && swapped.includes(index);

        // Styling priority: Sorted > Swapped > Comparing > Default
        if (isSorted) {
            classes += 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white ';
        } else if (isSwapped) {
            // Apply the 'lifted' and 'glowing' style for swapped items in the 'after' state
            // and the 'animate-pulse' for visual emphasis.
            classes += 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400 animate-pulse transform -translate-y-3 scale-110 shadow-pink-400/50 ';
        } else if (isComparing) {
            // Apply the 'lifted' and 'glowing' style for items currently being compared
            classes += 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 transform -translate-y-3 scale-110 shadow-yellow-400/50 ';
        } else {
            // Default styling for non-special elements
            classes += 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white ';
        }
        return classes;
    };

    const containerClasses = `flex flex-col items-center gap-4 p-4 rounded-lg ${isSummary ? 'bg-purple-900/20 border-t-2 border-b-2 border-purple-800/50' : 'bg-gray-900/40'}`;

    return (
        <div className={containerClasses}>
            <div className="w-full text-center">
                <p className="text-base text-gray-300">{description}</p>
            </div>
            {!isSummary && (
              <div className="w-full flex items-center justify-center gap-3 md:gap-6 mt-2">
                  <div className="flex items-center justify-center gap-2">
                      {before.map((val, idx) => (
                          <div key={`before-${idx}`} className={getItemClass(idx, val, 'before')}>
                              {val}
                          </div>
                      ))}
                  </div>
                  {after && <Icon name="stepForward" className="w-8 h-8 text-gray-400 shrink-0"/>}
                  {after && (
                      <div className="flex items-center justify-center gap-2">
                          {after.map((val, idx) => (
                              <div key={`after-${idx}`} className={getItemClass(idx, val, 'after')}>
                                  {val}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
            )}
            {isSummary && (
                <div className="w-full flex items-center justify-center gap-2 mt-2">
                    {before.map((val, idx) => (
                        <div key={`summary-${idx}`} className={getItemClass(idx, val, 'summary')}>
                            {val}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ExplanationTab = () => {
    const walkthroughData = [
        { type: 'initial', before: [64, 34, 25, 12, 22, 11], description: 'We start with this unsorted array. Insertion Sort builds the sorted array one element at a time.' },
        { type: 'pass', text: 'Iteration 1: Processing element at index 1 (34)' },
        { type: 'step', before: [64, 34, 25, 12, 22, 11], after: [34, 64, 25, 12, 22, 11], comparing: [0, 1], inserted: [0], keyElement: 34, description: 'We take 34 as the key and compare it with 64. Since 34 < 64, we shift 64 to the right and insert 34 in its correct position.' },
        { type: 'summary', before: [34, 64, 25, 12, 22, 11], sorted: [0], description: 'After first iteration, the first two elements [34, 64] are sorted relative to each other.', isSummary: true },
        { type: 'pass', text: 'Iteration 2: Processing element at index 2 (25)' },
        { type: 'step', before: [34, 64, 25, 12, 22, 11], after: [25, 34, 64, 12, 22, 11], comparing: [1, 2], inserted: [0], keyElement: 25, description: 'Key = 25. Compare with 64 (25 < 64 → shift), then with 34 (25 < 34 → shift), then insert 25 at the beginning.' },
        { type: 'summary', before: [25, 34, 64, 12, 22, 11], sorted: [0, 1, 2], description: 'First three elements [25, 34, 64] are now sorted.', isSummary: true },
        { type: 'pass', text: 'Iteration 3: Processing element at index 3 (12)' },
        { type: 'step', before: [25, 34, 64, 12, 22, 11], after: [12, 25, 34, 64, 22, 11], comparing: [2, 3], inserted: [0], keyElement: 12, description: 'Key = 12. Compare with 64, 34, and 25 - all are larger, so shift them right and insert 12 at the beginning.' },
        { type: 'summary', before: [12, 25, 34, 64, 22, 11], sorted: [0, 1, 2, 3], description: 'First four elements are sorted.', isSummary: true },
        { type: 'pass', text: 'Iteration 4: Processing element at index 4 (22)' },
        { type: 'step', before: [12, 25, 34, 64, 22, 11], after: [12, 22, 25, 34, 64, 11], comparing: [3, 4], inserted: [1], keyElement: 22, description: 'Key = 22. Find its position between 12 and 25. Shift 25, 34, 64 right and insert 22.' },
        { type: 'summary', before: [12, 22, 25, 34, 64, 11], sorted: [0, 1, 2, 3, 4], description: 'First five elements are sorted.', isSummary: true },
        { type: 'pass', text: 'Iteration 5: Processing element at index 5 (11)' },
        { type: 'step', before: [12, 22, 25, 34, 64, 11], after: [11, 12, 22, 25, 34, 64], comparing: [4, 5], inserted: [0], keyElement: 11, description: 'Key = 11. Compare with all elements - shift everything right and insert 11 at the beginning.' },
        { type: 'final', before: [11, 12, 22, 25, 34, 64], sorted: [0, 1, 2, 3, 4, 5], description: 'The array is now completely sorted!', isSummary: true },
    ];

    const sectionClasses = "bg-gray-800/60 p-6 md:p-8 rounded-2xl border border-gray-700/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20";

    return (
        <section className="text-gray-300 animate-fadeIn">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className={sectionClasses}>
                    <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        <Icon name="insert" className="w-8 h-8 text-purple-400"/>What is Insertion Sort?
                    </h2>
                    <p className="text-lg text-center leading-relaxed">Insertion Sort is an efficient algorithm for sorting small datasets. It works similarly to how you might sort playing cards in your hands: you pick one card at a time and insert it into its correct position among the already sorted cards. The algorithm builds the final sorted array one item at a time, with the advantage of being an in-place sort that requires only O(1) additional space. While not as fast as more advanced algorithms on large lists, Insertion Sort performs remarkably well on small or nearly sorted datasets.</p>
                </div>

                <div className={sectionClasses}>
                    <h3 className="flex items-center justify-center gap-3 text-2xl font-bold mb-6 text-gray-200"><Icon name="example" className="w-7 h-7 text-purple-400" />How It Works: A Detailed Breakdown</h3>
                    <div className="space-y-4">
                        {walkthroughData.map((item, index) => {
                             if (item.type === 'initial') return <div key={index}><h4 className="text-xl text-center font-semibold text-purple-300 mb-2">Initial State</h4><WalkthroughStep {...item} isSummary={true} /></div>;
                             if (item.type === 'pass') return <h4 key={index} className="text-xl text-center font-semibold text-purple-300 pt-4 mt-4">{item.text}</h4>;
                             if (item.type === 'final') return <div key={index} className="pt-4"><h4 className="text-xl text-center font-semibold text-green-400 mb-2">Final Sorted State</h4><WalkthroughStep {...item} /></div>;
                             return <WalkthroughStep key={index} {...item} />;
                        })}
                    </div>
                </div>
                
                <div className={sectionClasses}>
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-gray-200"><Icon name="code" className="w-7 h-7 text-purple-400" />The Algorithm, Step-by-Step</h3>
                    <ol className="list-decimal list-inside space-y-4 text-gray-300 leading-relaxed">
                        <li><strong>Initialization</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Start from the second element (index 1) - consider the first element as already sorted.</li>
                           </ul>
                        </li>
                        <li><strong>Outer Loop (Iterate through unsorted elements)</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>For each element from index 1 to n-1, treat it as the "key" to be inserted.</li>
                             <li>Store the key element in a temporary variable.</li>
                           </ul>
                        </li>
                        <li><strong>Inner Loop (Find insertion position)</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Start from the element immediately left of the key and move leftwards.</li>
                             <li>Compare the key with each element in the sorted portion.</li>
                             <li>If the compared element is greater than the key, shift it one position to the right.</li>
                             <li>Continue until you find an element smaller than or equal to the key.</li>
                           </ul>
                        </li>
                        <li><strong>Insertion</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Insert the key element into its correct position in the sorted portion.</li>
                             <li>The sorted portion now has one more element.</li>
                           </ul>
                        </li>
                        <li><strong>Completion</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Repeat until all elements are processed.</li>
                             <li>The array is now completely sorted.</li>
                           </ul>
                        </li>
                    </ol>
                </div>
                
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
                                    <p className="font-bold text-xl text-red-300">O(n²)</p>
                                    <p className="text-sm text-red-400">Worst Case</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        When array is in <span className="text-red-300">reverse order</span>, 
                                        each element needs maximum shifts.
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-orange-800/40 rounded-md">
                                    <p className="font-bold text-xl text-orange-300">O(n²)</p>
                                    <p className="text-sm text-orange-400">Average Case</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        For <span className="text-orange-300">random arrays</span>, 
                                        about n²/4 comparisons and shifts.
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-green-800/40 rounded-md">
                                    <p className="font-bold text-xl text-green-300">O(n)</p>
                                    <p className="text-sm text-green-400">Best Case</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        When array is already <span className="text-green-300">sorted</span>, 
                                        only n-1 comparisons needed.
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
                                    Sorts <span className="text-sky-300">in-place</span> 
                                    with only a constant amount of extra memory.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={sectionClasses}>
                    <h3 className="flex items-center justify-center gap-3 text-2xl font-bold mb-6 text-gray-200"><Icon name="visualization" className="w-7 h-7 text-purple-400"/>Interactive Performance Graph</h3>
                    <InteractiveComplexityGraph />
                </div>

                <div className={sectionClasses}>
                    <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-200"><Icon name="comparisons" className="w-7 h-7 text-purple-400"/>Pros & Cons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-green-500">
                            <h4 className="text-xl font-semibold text-green-400 mb-4">Advantages</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Efficient for Small Data:</strong> Very fast for small arrays and nearly sorted data.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Space Efficient:</strong> In-place algorithm with O(1) space complexity.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Stable:</strong> Maintains relative order of equal elements.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Adaptive:</strong> Efficient for data sets that are already substantially sorted.</span></li>
                            </ul>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-red-500">
                            <h4 className="text-xl font-semibold text-red-400 mb-4">Disadvantages</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3"><Icon name="xmark" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span><strong>Inefficient for Large Lists:</strong> O(n²) time complexity makes it slow for large datasets.</span></li>
                                <li className="flex items-start gap-3"><Icon name="xmark" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span><strong>Many Shifts:</strong> Requires shifting many elements for each insertion in worst case.</span></li>
                                <li className="flex items-start gap-3"><Icon name="xmark" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span><strong>Not Optimal:</strong> More efficient algorithms exist for general-purpose sorting.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Main InsertionSortVisualizer Component
const InsertionSortVisualizer = () => {
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
  const [sortState, setSortState] = useState({ i: 1, j: 0, keyId: null, originalKeyIndex: null }); // Renamed 'key' to 'keyId', added originalKeyIndex
  const [nextAction, setNextAction] = useState('start_iteration');
  const [highlightedComparison, setHighlightedComparison] = useState([]); // Changed from highlightedIndices
  const [shiftedItemIds, setShiftedItemIds] = useState([]); // New state for shifted items
  const [sortedIndices, setSortedIndices] = useState([]);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(null); // Index of the 'key' element in the original array
  const [complexity, setComplexity] = useState({ comparisons: 0, shifts: 0, insertions: 0 });
  const [exampleIndex, setExampleIndex] = useState(0);
  const [copyTooltipText, setCopyTooltipText] = useState("Copy");

  const logViewRef = useRef(null);

  const exampleArrays = [
    [65, 55, 45, 35, 25, 15, 10],
    [22, 11, 88, 33, 77, 44, 66, 55],
    [5, 8, 2, 10, 1, 9, 4, 7, 3, 6],
    [10, 20, 30, 40, 50],
    [10, 20, 30, 50, 40],
  ];

  const addStep = useCallback((message, type, arr, comparisonHighlights, sorted, currentComplexity, currentSortState, currentKeyIdx = null, shiftedIds = []) => {
    if (isReviewingPastStep) return;

    const newStep = {
      message,
      type,
      arrState: arr.map(item => ({...item})),
      highlightedComparison: comparisonHighlights || [],
      shiftedItemIds: shiftedIds || [],
      sorted: sorted || [],
      complexity: { ...currentComplexity },
      sortState: { ...currentSortState },
      currentKeyIndex: currentKeyIdx // Storing the index of the key
    };

    setSteps(prev => [...prev, newStep]);
    setCurrentStep(prev => prev + 1);
  }, [isReviewingPastStep]);

  const runSortStep = useCallback(() => {
    let currentArr = [...array];
    const len = currentArr.length;
    let { i, j, keyId, originalKeyIndex } = sortState; // Use keyId and originalKeyIndex
    let currentComplexity = { ...complexity };
    let currentShiftedItemIds = [...shiftedItemIds];

    // Check if sorting is complete
    if (i >= len) {
      if (!isFinished) {
        setIsFinished(true);
        const finalSorted = Array.from({ length: len }, (_, idx) => idx);
        setSortedIndices(finalSorted);
        setHighlightedComparison([]);
        setShiftedItemIds([]);
        setCurrentKeyIndex(null);
        addStep("Sorting complete! Array is now fully sorted.", "finish", currentArr, [], finalSorted, currentComplexity, sortState, null);
      }
      return;
    }

    try {
      if (nextAction === 'start_iteration') {
        // Start processing next element
        keyId = currentArr[i].id; // The ID of the element to be inserted
        originalKeyIndex = i; // Its original index
        j = i - 1;

        setHighlightedComparison([]);
        setShiftedItemIds([]);
        setCurrentKeyIndex(originalKeyIndex); // Set the key index for visualization
        setSortState({ i, j, keyId, originalKeyIndex });

        addStep(`Starting iteration ${i}. Key element is ${currentArr[i].value}.`, "iteration", currentArr, [], sortedIndices, currentComplexity, { i, j, keyId, originalKeyIndex }, originalKeyIndex);
        setNextAction('compare');
      }
      else if (nextAction === 'compare') {
        const keyElement = currentArr.find(item => item.id === keyId);
        if (!keyElement) { // Should not happen if keyId is correctly managed
            console.error("Key element not found!");
            setNextAction('insert'); // Skip to insert if key is missing
            return;
        }

        if (j >= 0) {
          const jElement = currentArr[j];
          currentComplexity.comparisons++;
          setComplexity(currentComplexity);

          const shouldShift = sortOrder === 'ascending' ? jElement.value > keyElement.value : jElement.value < keyElement.value;

          setHighlightedComparison([j]); // Highlight the element being compared against
          setShiftedItemIds([]); // Clear previous shifts for new comparison step

          addStep(`Comparing key ${keyElement.value} with ${jElement.value}.`, "compare", currentArr, [j], sortedIndices, currentComplexity, sortState, originalKeyIndex); // Pass originalKeyIndex for consistent key visualization

          setNextAction(shouldShift ? 'shift' : 'insert_final');
        } else {
          setHighlightedComparison([]);
          setShiftedItemIds([]);
          setNextAction('insert_final'); // Insert if we reached the beginning of the array
        }
      }
      else if (nextAction === 'shift') {
        if (j >= 0) {
          // Perform shift in visualization, not actual array content yet
          currentShiftedItemIds.push(currentArr[j].id);
          setShiftedItemIds(currentShiftedItemIds); // Mark the element as shifted for visualization

          currentComplexity.shifts++;
          setComplexity(currentComplexity);

          addStep(`Shifting ${currentArr[j].value} to the right to make space for ${currentArr.find(item => item.id === keyId).value}.`, "shift", currentArr, [j], sortedIndices, currentComplexity, sortState, originalKeyIndex, currentShiftedItemIds);

          const newJ = j - 1;
          setSortState(prev => ({ ...prev, j: newJ }));
          setNextAction('compare');
        } else {
          setNextAction('insert_final');
        }
      }
      else if (nextAction === 'insert_final') {
        const keyElement = array.find(item => item.id === keyId);
        if (!keyElement) {
          // This should ideally not happen if keyId is correctly set
          console.error("Key element for insertion not found!");
          const nextI = i + 1;
          setSortState({ i: nextI, j: 0, keyId: null, originalKeyIndex: null });
          setCurrentKeyIndex(null);
          setShiftedItemIds([]);
          setHighlightedComparison([]);
          setNextAction(nextI < len ? 'start_iteration' : 'done');
          return;
        }

        // Perform the actual insertion in the array
        const newArray = [...currentArr]; // Start with the current visual array
        const keyCurrentValue = keyElement.value; // Store value before mutation

        // Reconstruct the array with the key at the correct position
        // Filter out the key from its previous position and insert it
        let tempArrWithoutKey = newArray.filter(item => item.id !== keyId);
        tempArrWithoutKey.splice(j + 1, 0, keyElement); // Insert at j+1

        // Update the IDs and order for the new array
        const finalArrayForThisStep = tempArrWithoutKey.map((item, index) => ({
            ...item,
            // You might need to generate new IDs if you want true immutability or map to a new structure
            // For now, we'll just re-order them and assume their internal IDs are fine
        }));
        setArray(finalArrayForThisStep); // Update the main array state

        currentComplexity.insertions++;
        setComplexity(currentComplexity);

        const newSorted = Array.from({ length: i + 1 }, (_, idx) => idx);
        setSortedIndices(newSorted);

        setHighlightedComparison([j + 1]); // Highlight the inserted position
        setShiftedItemIds([]); // Clear shifted items after insertion
        setCurrentKeyIndex(null); // The key is no longer 'floating'

        addStep(`Inserting key ${keyCurrentValue} at position ${j + 1}.`, "insert", finalArrayForThisStep, [j + 1], newSorted, currentComplexity, { i, j: j + 1, keyId: null, originalKeyIndex: null }, null);

        const nextI = i + 1;
        setSortState({ i: nextI, j: 0, keyId: null, originalKeyIndex: null });
        setNextAction(nextI < len ? 'start_iteration' : 'done');
      }
      else if (nextAction === 'done') {
        if (!isFinished) {
          setIsFinished(true);
          const finalSorted = Array.from({ length: len }, (_, idx) => idx);
          setSortedIndices(finalSorted);
          setHighlightedComparison([]);
          setShiftedItemIds([]);
          setCurrentKeyIndex(null);
          addStep("Sorting complete! Array is now fully sorted.", "finish", currentArr, [], finalSorted, currentComplexity, sortState, null);
        }
      }
    } catch (error) {
      console.error('Error in sort step:', error);
      // Fallback: move to next iteration
      const nextI = i + 1;
      setSortState({ i: nextI, j: 0, keyId: null, originalKeyIndex: null });
      setCurrentKeyIndex(null);
      setShiftedItemIds([]);
      setHighlightedComparison([]);
      setNextAction(nextI < len ? 'start_iteration' : 'done');
    }
  }, [sortState, nextAction, array, sortedIndices, complexity, addStep, sortOrder, isFinished, shiftedItemIds]);

  useEffect(() => {
    let timer;
    if (isSorting && !isPaused && !isFinished) {
      timer = setTimeout(runSortStep, 1100 - speed * 10);
    }
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

        if (!isVisible) {
            container.scrollTo({
              top: currentStepElement.offsetTop - container.offsetTop - 20,
              behavior: 'smooth',
            });
        }
      }
    }
  }, [currentStep]);

  const createArrayFromValues = (values) =>
  values.map((value, index) => ({
    id: `elem-${index}-${value}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    value
  }));

  const resetToState = (values, message) => {
    const newArray = createArrayFromValues(values);
    setArray(newArray);
    setCustomInput(values.join(', '));
    setIsSorting(false);
    setIsPaused(true);
    setIsFinished(false);
    setIsReviewingPastStep(false);
    setNextAction('start_iteration');
    const initialSortState = { i: 1, j: 0, keyId: null, originalKeyIndex: null };
    setSortState(initialSortState);
    setHighlightedComparison([]);
    setShiftedItemIds([]);
    setSortedIndices([0]); // First element is always considered sorted
    setCurrentKeyIndex(null);
    setComplexity({ comparisons: 0, shifts: 0, insertions: 0 });

    const initialStep = {
      message,
      type: "start",
      arrState: newArray.map(item => ({...item})),
      highlightedComparison: [],
      shiftedItemIds: [],
      sorted: [0],
      complexity: { comparisons: 0, shifts: 0, insertions: 0 },
      sortState: initialSortState,
      currentKeyIndex: null
    };
    setSteps([initialStep]);
    setCurrentStep(0);
  };

  const handleReset = useCallback(() => {
    const newValues = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    resetToState(newValues, "Generated a new random array. Press Play to start sorting.");
  }, []);

  const handleCustomArray = () => {
    const newValues = customInput.split(/[, ]+/).map(item => parseInt(item.trim())).filter(item => !isNaN(item) && item > 0 && item <= 100);
    if (newValues.length === 0 || newValues.length > 12) {
      alert("Please enter between 1 and 12 valid numbers (1-100).");
      return;
    }
    resetToState(newValues, "Custom array loaded. Press Play to start sorting.");
  };

  const loadExampleArray = () => {
    resetToState(exampleArrays[exampleIndex], `Example array #${exampleIndex + 1} loaded. Press Play to start sorting.`);
    setExampleIndex(prev => (prev + 1) % exampleArrays.length);
  };

  const toggleSortOrder = () => !isSorting && setSortOrder(prev => (prev === 'ascending' ? 'descending' : 'ascending'));

  const toggleSorting = () => {
    if (isFinished && isPaused) { // If finished and paused, allow a re-sort (not typically how it works, but for visualizer)
        setIsFinished(false);
        setIsPaused(false);
        setIsSorting(true);
        // Reset state for sorting from beginning
        const initialSortState = { i: 1, j: 0, keyId: null, originalKeyIndex: null };
        setSortState(initialSortState);
        setCurrentKeyIndex(null);
        setHighlightedComparison([]);
        setShiftedItemIds([]);
        setSortedIndices([0]);
        setComplexity({ comparisons: 0, shifts: 0, insertions: 0 });
        setNextAction('start_iteration');
        setSteps([]); // Clear steps to start new visualization log
        addStep("Restarting sort.", "start", array, [], [0], { comparisons: 0, shifts: 0, insertions: 0 }, initialSortState, null);
        return;
    }

    if (isReviewingPastStep) {
        // When resuming from a review, restore the last known sorting state
        const lastValidStep = steps[currentStep];
        if (lastValidStep) {
            setSortState(lastValidStep.sortState);
            setNextAction(determineNextActionFromState(lastValidStep.sortState, lastValidStep.type)); // Helper to guess next action
        }
        setIsReviewingPastStep(false);
    }

    setIsSorting(true);
    setIsPaused(!isPaused);
  };

  // Helper to determine next action when resuming from a paused state
  const determineNextActionFromState = (state, stepType) => {
    // This is a simplified guess. A more robust solution might store 'nextAction' in each step.
    const { i, j, keyId } = state;
    if (stepType === 'iteration' || stepType === 'start') return 'compare';
    if (stepType === 'compare') {
        // If we just compared, the next action depends on the comparison result which isn't directly in `sortState`
        // For simplicity, let's assume if j >= 0, we'd compare again or shift, otherwise insert.
        // A better approach would be to save `nextAction` in `addStep`.
        return 'compare'; // Will re-evaluate the condition in runSortStep
    }
    if (stepType === 'shift') return 'compare';
    if (stepType === 'insert') {
        return (i + 1 < array.length) ? 'start_iteration' : 'done';
    }
    return 'start_iteration'; // Default fallback
  };


  const goToStep = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    const step = steps[stepIndex];

    setIsPaused(true);
    setIsReviewingPastStep(true);
    if(isFinished) setIsFinished(false);

    setCurrentStep(stepIndex);
    setArray(step.arrState);
    setHighlightedComparison(step.highlightedComparison || []); // Use new highlight prop
    setShiftedItemIds(step.shiftedItemIds || []); // Use new shifted items prop
    setSortedIndices(step.sorted || []);
    setComplexity(step.complexity);
    if (step.sortState) {
        setSortState(step.sortState);
    }
    setCurrentKeyIndex(step.currentKeyIndex); // Use new key index prop
    // When reviewing, nextAction should stay paused, not jump to 'compare'
    // setNextAction('compare'); // Removed this, as it changes the future sorting path
  };

  const stepForward = () => goToStep(currentStep + 1);
  const stepBackward = () => goToStep(currentStep - 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyTooltipText("Copied!");
      setTimeout(() => setCopyTooltipText("Copy"), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Insertion Sort Visualizer",
        text: "Check out this interactive Insertion Sort visualizer!",
        url: window.location.href,
      });
    } else {
        alert("Web Share API not supported in your browser. You can manually copy the URL.");
    }
  };

  useEffect(() => {
    const initialValues = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    resetToState(initialValues, "Welcome! Array initialized. Press Play to start Insertion Sort.");
  }, []);

  const displayedStep = steps[currentStep] || {};

  const getTabClass = (tabName) => activeTab === tabName ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-gray-300";

  return (
    <div className=" min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center font-sans">
      <div className=" fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/40 to-indigo-900/60 -z-10" />

      <header className="w-full max-w-7xl text-center py-10 animate-fadeIn">
        <div className="flex justify-start">
            <Breadcrumb />
        </div>
        <div className="inline-block bg-green-400/10 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border border-green-400/20">
            Sorting
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
             Insertion Sort Visualizer
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">An interactive tool to visualize the step-by-step process of the Insertion Sort algorithm.</p>

        <div className="mt-6 flex justify-center items-center gap-4">
          <GlossyButton onClick={handleCopy} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]"><Icon name="copy" className="w-5 h-5" /><span>{copyTooltipText}</span></GlossyButton>
          <GlossyButton onClick={handleShare} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]"><Icon name="share" className="w-5 h-5" /><span>Share</span></GlossyButton>
        </div>
      </header>

      <main className="w-full max-w-7xl space-y-6 mt-6">
        <div className="flex border-b border-gray-700">
          <button className={`px-4 py-2 font-medium transition-colors ${getTabClass("visualization")}`} onClick={() => setActiveTab("visualization")}>Visualization</button>
          <button className={`px-4 py-2 font-medium transition-colors ${getTabClass("explanation")}`} onClick={() => setActiveTab("explanation")}>Explanation</button>
        </div>

        {activeTab === "visualization" ? (
          <div className="animate-fadeIn">
            <ComplexityDisplay complexity={displayedStep.complexity || complexity} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <VisualizationArea
                  array={array}
                  highlightedComparison={displayedStep.highlightedComparison || []} // Pass the new prop
                  shiftedItems={displayedStep.shiftedItemIds || []} // Pass new shifted items prop
                  sorted={displayedStep.sorted || []}
                  currentKeyIndex={displayedStep.currentKeyIndex} // Pass the index of the key
                  steps={steps.filter((_, idx) => idx === currentStep)} // Only pass current step for animation trigger
                  sortOrder={sortOrder}
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
        <p>Insertion Sort Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
    </div>
  );
};

export default InsertionSortVisualizer;
