import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";

// Icon Component (with 'bubble' icon)
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    bubble: (
      <>
        {/* A more fluid and dynamic bubble icon */}
        <circle cx="6" cy="17" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="12" cy="9" r="5" fill="currentColor" />
        <circle cx="18" cy="15" r="3" fill="currentColor" opacity="0.9" />
        <circle cx="9" cy="13" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.7" />
      </>
    ),
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    controls: <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />,
    stepBack: <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />,
    stepForward: <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />,
    "arrow-refresh": <path
   strokeLinecap="round"
    strokeLinejoin="round"
    d="M21 12a9 9 0 1 1-2.64-6.36L21 8m0-6v6h-6"/>,
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
        Bubble Sort
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
          <Icon name="swaps"/>Swaps
        </h3>
        <span className="text-2xl font-bold text-pink-300">
          <AnimatedNumber value={complexity.swaps} />
        </span>
      </div>
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-4 rounded-lg border border-purple-700/50">
        <h3 className="flex items-center gap-2 text-sm text-purple-300 mb-1">
          <Icon name="passes"/>Passes
        </h3>
        <span className="text-2xl font-bold text-purple-300">
          <AnimatedNumber value={complexity.passes} />
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

const VisualizationArea = ({ array, highlights, sorted, steps, sortOrder }) => {
    const [elementPositions, setElementPositions] = useState({});
    const [animationState, setAnimationState] = useState({ phase: 'idle', itemIds: [] });
    const [overlayContent, setOverlayContent] = useState({ show: false, x1: 0, x2: 0, y: 0, midX: 0, message: '', isSwap: false });
    const [overlayPosition, setOverlayPosition] = useState({ clampedMidX: 0, opacity: 0 });
    const [streamPaths, setStreamPaths] = useState({ path1: '', path2: '' });
    
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
    const highlightLift = 40;
    const totalWidth = array.length * (elementWidth + elementGap) - elementGap;

    useEffect(() => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

        const lastStep = steps[steps.length - 1];
        if (!lastStep || highlights.length < 2 || !containerRef.current) {
            setAnimationState({ phase: 'idle', itemIds: [] });
            setOverlayContent(prev => ({ ...prev, show: false }));
            return;
        }

        const [i, j] = highlights;
        const item1 = array.find(d => elementPositions[d.id] === i);
        const item2 = array.find(d => elementPositions[d.id] === j);
        if (!item1 || !item2) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const arrayCenterY = containerRect.height / 2;
        const x1 = (i * (elementWidth + elementGap)) + (elementWidth / 2);
        const x2 = (j * (elementWidth + elementGap)) + (elementWidth / 2);
        const y = arrayCenterY - (elementHeight / 2) - highlightLift;
        const midX = (x1 + x2) / 2;

        if (lastStep.type === 'compare') {
            const shouldSwap = sortOrder === 'ascending' ? item1.value > item2.value : item1.value < item2.value;
            const message = `Is ${item1.value} ${sortOrder === 'ascending' ? '>' : '<'} ${item2.value}? ${shouldSwap ? "Yes, so they will be swapped." : "No, they stay in place."}`;
            setAnimationState({ phase: 'comparing', itemIds: [item1.id, item2.id], result: shouldSwap });
            setOverlayContent({ show: true, x1, x2, y, midX, message, isSwap: false });
            setStreamPaths({ path1: '', path2: '' });
        } else if (lastStep.type === 'swap') {
            const message = `Swapping ${item2.value} and ${item1.value}.`;
            setOverlayContent({ show: true, x1, x2, y, midX, message, isSwap: true });

            const arcHeight = -60;
            setStreamPaths({
                path1: `M${x1},${y + highlightLift} Q${midX},${y + highlightLift + arcHeight} ${x2},${y + highlightLift}`,
                path2: `M${x2},${y + highlightLift} Q${midX},${y + highlightLift - arcHeight} ${x1},${y + highlightLift}`
            });
            
            setAnimationState({ phase: 'dematerialize', itemIds: [item1.id, item2.id] });
            animationTimeoutRef.current = setTimeout(() => {
                setAnimationState({ phase: 'rematerialize', itemIds: [item1.id, item2.id] });
                animationTimeoutRef.current = setTimeout(() => {
                    setAnimationState({ phase: 'idle', itemIds: [] });
                    setStreamPaths({ path1: '', path2: '' });
                }, 600);
            }, 700);
        }

        return () => clearTimeout(animationTimeoutRef.current);
    }, [highlights, steps, array, elementPositions, sortOrder]);
    
    useLayoutEffect(() => {
        if (overlayContent.show && messageBoxRef.current) {
            const messageBoxWidth = messageBoxRef.current.offsetWidth;
            const halfMessageBoxWidth = messageBoxWidth / 2;
            const idealLeftEdge = overlayContent.midX - halfMessageBoxWidth;
            const padding = 10;
            
            const minLeft = padding;
            const maxLeft = totalWidth - messageBoxWidth - padding;
            
            const clampedLeftEdge = Math.max(minLeft, Math.min(idealLeftEdge, maxLeft));
            const clampedMidX = clampedLeftEdge + halfMessageBoxWidth;

            setOverlayPosition({ clampedMidX, opacity: 1 });
        } else {
            setOverlayPosition({ clampedMidX: 0, opacity: 0 });
        }
    }, [overlayContent, totalWidth]);

    const getElementStyle = (item) => {
        const index = elementPositions[item.id];
        if (index === undefined) return { opacity: 0 };

        const isHighlighted = animationState.itemIds.includes(item.id);
        const left = index * (elementWidth + elementGap);
        let dynamicBoxShadow = '0 0 25px -5px transparent';
        if (isHighlighted && animationState.phase === 'comparing') {
            dynamicBoxShadow = animationState.result ? '0 0 25px -5px #f59e0b' : '0 0 25px -5px #22c55e';
        }

        if (isHighlighted) {
            if (animationState.phase === 'comparing') {
                return { transform: `translateX(${left}px) translateY(-${highlightLift}px) scale(1.1)`, boxShadow: dynamicBoxShadow, zIndex: 10, transition: 'transform 500ms ease-in-out, box-shadow 300ms ease-in-out' };
            }
            if (animationState.phase === 'dematerialize') {
                return { transform: `translateX(${left}px)`, zIndex: 10 };
            }
            if (animationState.phase === 'rematerialize') {
                return { transform: `translateX(${left}px)`, zIndex: 10 };
            }
        }
        return { transform: `translateX(${left}px)` };
    };

    const getElementClassName = (item, isSorted) => {
        const isHighlighted = animationState.itemIds.includes(item.id);
        let classes = 'absolute flex items-center justify-center w-16 h-16 rounded-lg font-bold text-xl border-2 transition-transform duration-500 ease-in-out';
        classes += isSorted ? ' bg-green-600/90 border-green-500 text-white' : ' bg-blue-600/90 border-blue-500 text-white';
        if (isHighlighted) {
            if (animationState.phase === 'dematerialize') classes += ' dematerialize';
            if (animationState.phase === 'rematerialize') classes += ' rematerialize';
        }
        return classes;
    };

    return (
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg h-full flex flex-col min-h-[32rem] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
                <Icon name="visualization" />
                Animated Array
            </h2>
            <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full pointer-events-none z-50 transition-opacity duration-300" style={{ opacity: overlayPosition.opacity }}>
                    <div ref={messageBoxRef} className="absolute transition-transform duration-300" style={{ top: overlayContent.y - 80, left: `calc(50% - ${totalWidth / 2}px)`, transform: `translateX(${overlayPosition.clampedMidX}px) translateX(-50%)` }}>
                        <div className={`font-semibold px-4 py-2 rounded-lg shadow-xl border text-center max-w-xs ${overlayContent.isSwap ? 'bg-pink-900/80 border-pink-700 text-pink-300' : 'bg-yellow-900/80 border-yellow-700 text-yellow-300'}`}>
                            {overlayContent.message}
                        </div>
                    </div>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                    <defs>
                        <radialGradient id="glow"><stop offset="0%" stopColor="#00ffff" stopOpacity="1" /><stop offset="100%" stopColor="#00ffff" stopOpacity="0" /></radialGradient>
                    </defs>
                    {overlayContent.show && (
                        <g className="overlay-connectors" style={{ opacity: overlayPosition.opacity }}>
                             <line x1={overlayPosition.clampedMidX} y1={overlayContent.y - 58} x2={overlayContent.x1} y2={overlayContent.y + highlightLift} stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1={overlayPosition.clampedMidX} y1={overlayContent.y - 58} x2={overlayContent.x2} y2={overlayContent.y + highlightLift} stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                        </g>
                    )}
                    {animationState.phase === 'dematerialize' && (
                        <>
                            <path d={streamPaths.path1} fill="none" stroke="#00ffff" strokeWidth="3" className="data-stream" />
                            <path d={streamPaths.path2} fill="none" stroke="#00ffff" strokeWidth="3" className="data-stream" style={{ animationDelay: '50ms' }} />
                        </>
                    )}
                </svg>

                <div className="relative" style={{ width: `${totalWidth}px`, height: `${elementHeight}px` }}>
                    {array.map(item => {
                        const isSorted = sorted.includes(elementPositions[item.id]);
                        return (<div key={item.id} className={getElementClassName(item, isSorted)} style={getElementStyle(item)}><div className="element-content">{item.value}</div></div>);
                    })}
                </div>
            </div>
        </section>
    );
};

const LogView = ({ steps, currentStep, goToStep, logViewRef }) => {
  const getStepStyle = (type) => {
    const styles = {
      start: "bg-indigo-600/90", pass: "bg-purple-600/90", compare: "bg-yellow-500/90",
      swap: "bg-pink-600/90", sorted: "bg-green-600/90", finish: "bg-teal-600/90"
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
                  <div key={idx} className={`px-1.5 py-0.5 rounded text-xs font-bold ${step.highlights?.includes(idx) ? 'bg-yellow-400 text-gray-900' : step.sorted?.includes(idx) ? 'bg-green-500 text-white' : 'bg-blue-500/80 text-white'}`}>
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
  const maxOps = 650; // worst-case ~ O(n²)
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };

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

    if (x < padding.left || x > rect.width - padding.right) {
      setHoverData(null);
      return;
    }

    const n = xToN(x);
    if (n >= 1 && n <= maxN) {
      setHoverData({
        n,
        best: n, // O(n)
        avg: n * n, // O(n²)
        worst: n * n, // O(n²)
        x: nToX(n),
        y,
      });
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
        Bubble Sort Time Complexity
      </h3>

      <div
        ref={graphRef}
        className="relative w-full h-[450px]"
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
            d={getPath((n) => n * n)}
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
            d={getPath((n) => n * n)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="2000"
            strokeDashoffset={animate ? "0" : "2000"}
            style={{
              transition: "stroke-dashoffset 2s ease-out 1s",
            }}
          />

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
                  r={hoverData ? 5 : 0}
                  fill={point.color}
                  stroke="white"
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? "scale(1)" : "scale(0)",
                    transformOrigin: "center",
                    transition: `transform 0.5s ease-out ${i * 0.5}s, opacity 0.25s ease-out ${i * 0.5}s`

                  }}
                />
              ))}

              {/* Tooltip */}
              {(() => {
                const boxWidth = 120;
                const boxHeight = 65;
                let tooltipX = hoverData.x + 12;
                let tooltipY = opsToY(hoverData.worst) - boxHeight; 

                if (tooltipX + boxWidth > width - padding.right) {
                  tooltipX = hoverData.x - boxWidth - 12;
                }
                if (tooltipY < padding.top) {
                  tooltipY = hoverData.y + 12;
                }

                return (
                  <g
                    transform={`translate(${tooltipX}, ${tooltipY})`}
                    style={{ transition: "transform 0.1s ease-out" }}
                  >
                    <rect
                      x="0"
                      y="0"
                      width={boxWidth}
                      height={boxHeight}
                      rx="6"
                      fill="black"
                      opacity="0.75"
                    />
                    <text
                      x="8"
                      y="16"
                      className="fill-white text-xs"
                    >
                      n = {hoverData.n}
                    </text>
                    <text
                      x="8"
                      y="30"
                      className="fill-green-400 text-xs"
                    >
                      Best: {hoverData.best}
                    </text>
                    <text
                      x="8"
                      y="44"
                      className="fill-blue-400 text-xs"
                    >
                      Avg: {hoverData.avg}
                    </text>
                    <text
                      x="8"
                      y="58"
                      className="fill-red-400 text-xs"
                    >
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
        const isSwapped = arrayType === 'after' && swapped && swapped.includes(index);

        if (isSorted) {
            classes += 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white ';
        } else if (isComparing) {
            classes += 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 transform -translate-y-3 scale-110 shadow-yellow-400/50 ';
        } else if (isSwapped) {
            classes += 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400 animate-pulse ';
        } else {
            classes += 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 ';
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
                      {before.map((val, idx) => <div key={`before-${idx}`} className={getItemClass(idx, val, 'before')}>{val}</div>)}
                  </div>
                  {after && <Icon name="stepForward" className="w-8 h-8 text-gray-400 shrink-0"/>}
                  {after && (
                      <div className="flex items-center justify-center gap-2">
                          {after.map((val, idx) => <div key={`after-${idx}`} className={getItemClass(idx, val, 'after')}>{val}</div>)}
                      </div>
                  )}
              </div>
            )}
            {isSummary && (
                <div className="w-full flex items-center justify-center gap-2 mt-2">
                    {before.map((val, idx) => <div key={`summary-${idx}`} className={getItemClass(idx, val, 'summary')}>{val}</div>)}
                </div>
            )}
        </div>
    );
};


const ExplanationTab = () => {
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


    const sectionClasses = "bg-gray-800/60 p-6 md:p-8 rounded-2xl border border-gray-700/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20";

    return (
        <section className="text-gray-300 animate-fadeIn">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className={sectionClasses}>
                    <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        <Icon name="bubble" className="w-8 h-8 text-purple-400"/>What is Bubble Sort?
                    </h2>
                    <p className="text-lg text-center leading-relaxed">Bubble Sort is a foundational, comparison-based sorting algorithm. Its mechanism is straightforward: it repeatedly steps through the list, compares each pair of adjacent items, and swaps them if they are in the wrong order. This pass is repeated until the list is sorted. The algorithm gets its name from the way smaller or larger elements "bubble" up to their correct position in the list. While simple to understand and implement, its inefficiency for large lists makes it more of an educational tool than a practical one for real-world applications.</p>
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
                             <li>Start with the entire array considered as the "unsorted" portion.</li>
                           </ul>
                        </li>
                        <li><strong>Outer Loop (The "Passes")</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Begin a pass through the unsorted portion of the array. With each complete pass, the unsorted portion will shrink by one from the end.</li>
                             <li>Keep a flag, for instance `swappedThisPass`, set to `false` at the start of each pass.</li>
                           </ul>
                        </li>
                        <li><strong>Inner Loop (Comparisons & Swaps)</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>Starting from the first element, compare it with the adjacent element to its right.</li>
                             <li>If the pair is in the wrong order (e.g.,<code>left &gt; right</code> for ascending sort), swap them.</li>
                             <li>If a swap occurs, set the `swappedThisPass` flag to `true`.</li>
                             <li>Move one position to the right and repeat the comparison until you reach the end of the unsorted portion.</li>
                           </ul>
                        </li>
                        <li><strong>Termination & Optimization</strong>
                           <ul className="list-disc list-inside pl-6 mt-2 text-gray-400">
                             <li>After the inner loop (one full pass) is complete, check the `swappedThisPass` flag.</li>
                             <li>If it is still `false`, it means no swaps were made, and the array is fully sorted. The algorithm can terminate early.</li>
                             <li>Otherwise, continue with the next pass.</li>
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
            Occurs when the array is in <span className="text-red-300">reverse order</span>, 
            requiring maximum swaps.
          </p>
        </div>
        <div className="text-center p-3 bg-orange-800/40 rounded-md">
          <p className="font-bold text-xl text-orange-300">O(n²)</p>
          <p className="text-sm text-orange-400">Average Case</p>
          <p className="text-xs text-gray-400 mt-1">
            Happens when elements are in <span className="text-orange-300">random order</span>, 
            so about half of the elements need swapping.
          </p>
        </div>
        <div className="text-center p-3 bg-green-800/40 rounded-md">
          <p className="font-bold text-xl text-green-300">O(n)</p>
          <p className="text-sm text-green-400">Best Case</p>
          <p className="text-xs text-gray-400 mt-1">
            Occurs when the array is already <span className="text-green-300">sorted</span>, 
            needing only one pass.
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
          Bubble Sort sorts the array <span className="text-sky-300">in-place </span> 
          without extra memory.
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
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Simplicity:</strong> Very easy to understand and implement, making it a great teaching tool.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Space Efficient:</strong> It's an in-place sort, requiring only a constant O(1) amount of extra memory.</span></li>
                                <li className="flex items-start gap-3"><Icon name="check" className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span><strong>Stable:</strong> Preserves the relative order of equal elements.</span></li>
                            </ul>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-red-500">
                            <h4 className="text-xl font-semibold text-red-400 mb-4">Disadvantages</h4>
                            <ul className="space-y-3 text-gray-300">
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span><strong>Highly Inefficient:</strong> Its O(n²) time complexity makes it one of the slowest sorting algorithms for most real-world datasets.</span></li>
                               <li className="flex items-start gap-3"><Icon name="xmark" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><span><strong>Not Practical:</strong> Rarely used in production systems where performance is a consideration. More advanced algorithms are superior.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


// Main BubbleSortVisualizer Component
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

  const exampleArrays = [
    [65, 55, 45, 35, 25, 15, 10], [22, 11, 88, 33, 77, 44, 66, 55],
    [5, 8, 2, 10, 1, 9, 4, 7, 3, 6], [10, 20, 30, 40, 50], [10, 20, 30, 50, 40],
  ];

  const addStep = useCallback((message, type, arr, highlights, sorted, currentComplexity, currentSortState) => {
    if (isReviewingPastStep) return;

    const newStep = {
      message, type,
      arrState: arr.map(item => ({...item})),
      highlights, sorted: [...sorted],
      complexity: { ...currentComplexity },
      sortState: { ...currentSortState }
    };
    
    setSteps(prev => [...prev, newStep]);
    setCurrentStep(prev => prev + 1);

  }, [isReviewingPastStep]);


  const runSortStep = useCallback(() => {
    let arr = [...array];
    const len = arr.length;
    let { pass, comparison, swappedInPass } = sortState;
    let currentComplexity = { ...complexity };

    if (pass >= len - 1) {
        setIsFinished(true);
        return;
    }

    if (comparison >= len - pass - 1) {
        const nextPass = pass + 1;
        const justSortedIndex = len - pass - 1;

        if (justSortedIndex >= 0 && arr[justSortedIndex]) {
            const newSorted = [...sortedIndices, justSortedIndex];
            setSortedIndices(newSorted);
            addStep(`End of Pass ${pass + 1}. Element ${arr[justSortedIndex].value} is sorted.`, "sorted", arr, [], newSorted, currentComplexity, sortState);
            wasSwappedInLastPass.current = swappedInPass;
        } else {
            wasSwappedInLastPass.current = swappedInPass;
        }
        
        if (!wasSwappedInLastPass.current || nextPass >= len - 1) {
            setIsFinished(true);
            return;
        }

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

        if (shouldSwap) {
            setNextAction('swap');
        } else {
            setSortState({ ...sortState, comparison: comparison + 1 });
        }
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
    values.map((value, index) => ({ id: index, value }));

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
    
    const initialStep = {
      message, type: "start", arrState: newArray, highlights: [], sorted: [],
      complexity: { comparisons: 0, swaps: 0, passes: 1 },
      sortState: initialSortState
    };
    setSteps([initialStep]);
    setCurrentStep(0);
  };

  const handleReset = useCallback(() => {
    const newValues = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
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
    if (isFinished) return;
    
    if (isReviewingPastStep) {
        const lastValidStep = steps[currentStep];
        if (lastValidStep) {
            setSortState(lastValidStep.sortState);
        }
        setIsReviewingPastStep(false);
    }

    setIsSorting(true);
    setIsPaused(!isPaused);
  };

  const goToStep = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    const step = steps[stepIndex];

    setIsPaused(true);
    setIsReviewingPastStep(true);
    if(isFinished) setIsFinished(false);

    setCurrentStep(stepIndex);
    setArray(step.arrState);
    setHighlightedIndices(step.highlights || []);
    setSortedIndices(step.sorted || []);
    setComplexity(step.complexity);
    if (step.sortState) {
        setSortState(step.sortState);
    }
    setNextAction('compare'); 
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
        title: "Bubble Sort Visualizer",
        text: "Check out this interactive Bubble Sort visualizer!",
        url: window.location.href,
      });
    } else {
        alert("Web Share API not supported in your browser. You can manually copy the URL.");
    }
  };

  useEffect(handleReset, []);

  const displayedStep = steps[currentStep] || {};
  const highlightsToDisplay = displayedStep.highlights || [];
  const sortedToDisplay = displayedStep.sorted || [];
  const currentDisplayedStepForViz = [displayedStep];


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
             Bubble Sort Visualizer
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">An interactive tool to visualize the step-by-step process of the Bubble Sort algorithm.</p>
        
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
                  highlights={highlightsToDisplay}
                  sorted={sortedToDisplay}
                  steps={currentDisplayedStepForViz}
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
        <p>Bubble Sort Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
    </div>
  );
};

export default BubbleSortVisualizer;