import { useState, useEffect, useCallback, useRef } from "react";

//==============================================================================
// Icon Component
// Renders various SVG icons based on the provided 'name' prop.
//==============================================================================
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    controls: <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />,
    stepBack: <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />,
    stepForward: <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />,
    random: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.992h-4.992m0 0-3.181-3.183a8.25 8.25 0 0 1 11.667 0l3.181 3.183" />,
    example: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></>,
    info: <><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></>,
    visualization: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>,
    comparisons: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
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
// ExampleCell Component
//==============================================================================
const ExampleCell = ({ value, color }) => {
  const colors = {
    default: "bg-blue-500 text-white",
    compare: "bg-yellow-400 text-gray-900",
    found: "bg-green-500 text-white",
  };
  const cellColor = colors[color] || colors.default;

  return (
    <div className="flex flex-col items-center flex-1 max-w-[60px]">
      <div 
        className={`w-12 h-12 rounded-md flex items-center justify-center transition-colors duration-300 ${cellColor}`}
      >
         <span className="font-bold text-lg">{value}</span>
      </div>
    </div>
  );
};


//==============================================================================
// UI Section Components
//==============================================================================

const ComplexityDisplay = ({ complexity }) => (
  <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
    <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
      <Icon name="chart"/>
      Analysis
    </h2>
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-4 rounded-lg border border-indigo-700/50 text-center">
        <h3 className="flex items-center justify-center gap-2 text-sm text-indigo-300 mb-1">
          <Icon name="comparisons"/>Comparisons
        </h3>
        <span className="text-3xl font-bold text-indigo-300">
          {complexity.comparisons}
        </span>
      </div>
    </div>
  </section>
);

const Controls = ({
  isFinished, isPaused, isSearching, currentStep, steps, speed, customInput, target,
  toggleSearch, stepBackward, stepForward, handleReset, loadExampleArray,
  setSpeed, setCustomInput, handleCustomArray, setTarget
}) => {
  const playPauseButtonClasses = !isPaused
    ? "bg-yellow-600 hover:bg-yellow-700"
    : "bg-green-600 hover:bg-green-700";
  
  const baseButtonClasses = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium";
  const disabledClasses = "disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
        <Icon name="controls"/>
        Controls
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Action Buttons and Speed Slider */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <button 
              onClick={toggleSearch} 
              disabled={isFinished || !target}
              className={`${baseButtonClasses} justify-center w-28 ${playPauseButtonClasses} ${disabledClasses}`}
            >
              {!isPaused ? <><Icon name="pause"/>Pause</> : <><Icon name="play"/>Play</>}
            </button>
            <button 
              onClick={stepBackward} 
              disabled={currentStep <= 0}
              className={`${baseButtonClasses} bg-blue-600 hover:bg-blue-700 ${disabledClasses}`}
            >
              <Icon name="stepBack"/>Back
            </button>
            <button 
              onClick={stepForward} 
              disabled={currentStep >= steps.length - 1}
              className={`${baseButtonClasses} bg-blue-600 hover:bg-blue-700 ${disabledClasses}`}
            >
              Next<Icon name="stepForward"/>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button onClick={handleReset} className={`${baseButtonClasses} bg-red-600 hover:bg-red-700`}>
              <Icon name="random"/>New Array
            </button>
            <button onClick={loadExampleArray} className={`${baseButtonClasses} bg-indigo-600 hover:bg-indigo-700`}>
              <Icon name="example"/>Example
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Animation Speed</label>
            <div className="flex items-center gap-3">
              <input 
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

        {/* Right Side: Custom Array and Target Input */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Custom Array (comma-separated)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customInput} 
                onChange={(e) => setCustomInput(e.target.value)} 
                placeholder="e.g. 5, 3, 8, 1, 2" 
                disabled={isSearching}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white disabled:bg-gray-800" 
              />
              <button 
                onClick={handleCustomArray} 
                disabled={isSearching}
                className={`px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 ${disabledClasses}`}
              >
                Load
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Target Value to Find</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={target} 
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. 42" 
                disabled={isSearching}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 text-white disabled:bg-gray-800" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ** NEW FEATURE START **
const VisualizationArea = ({ array, highlights, foundIndex, isFinished, target, isSearching, isPaused }) => {
  
  // Determines which status message to show
  const getStatusMessage = () => {
    // If the search is complete...
    if (isFinished) {
      if (foundIndex !== null) {
        return (
          <div className="text-center text-green-400 font-bold text-xl p-4 rounded-lg bg-green-900/30">
            Target <span className="text-white font-mono">{target}</span> found at index [{foundIndex}]!
          </div>
        );
      } else {
        return (
          <div className="text-center text-red-400 font-bold text-xl p-4 rounded-lg bg-red-900/30">
            Target <span className="text-white font-mono">{target}</span> was not found in the array.
          </div>
        );
      }
    }
    
    // If the search process is active and not paused...
    if (isSearching && !isPaused) {
       return (
          <div className="text-center text-yellow-400 font-bold text-xl p-4 rounded-lg bg-yellow-900/30 animate-pulse">
            Searching for <span className="text-white font-mono">{target}</span>...
          </div>
       );
    }
    
    // If we have a target but haven't started or are paused...
    if (target) {
       return (
          <div className="text-center text-gray-400 font-bold text-lg p-4 rounded-lg bg-gray-700/30">
            Ready to search for <span className="text-white font-mono">{target}</span>. Press Play.
          </div>
       );
    }
    
    // Default initial state
    return (
        <div className="text-center text-gray-500 text-lg p-4">
            Enter a target value above to begin.
        </div>
    );
  };

  return (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
        <Icon name="visualization"/>
        Visualization
      </h2>
      
      {/* Status Message Area */}
      <div className="mb-6 min-h-[4rem] flex items-center justify-center">
        {getStatusMessage()}
      </div>

      {/* Array Display Area */}
      <div className="flex items-start justify-center min-h-[10rem] gap-3 p-4 flex-wrap border-t border-gray-700 pt-6">
        {array.map((value, index) => {
          const isHighlighted = highlights.includes(index);
          const isFound = foundIndex === index;
          let cellStyle = "bg-gradient-to-b from-blue-400 to-blue-600 text-white";
          if (isHighlighted) cellStyle = "bg-yellow-400 animate-pulse text-gray-900";
          if (isFound) cellStyle = "bg-gradient-to-b from-green-400 to-green-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-green-400";

          return (
            <div key={index} className="relative flex flex-col items-center">
              <span className="text-xs font-mono text-gray-400 mb-2">[{index}]</span>
              <div 
                className={`w-16 h-16 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 ease-in-out ${cellStyle}`}
              >
                <span className="text-2xl font-bold">{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
// ** NEW FEATURE END **

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
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-300">
          <Icon name="info"/>
          Algorithm Execution Log
        </h2>
        <span className="text-sm text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <div ref={logViewRef} className="max-h-96 overflow-y-auto pr-2 space-y-2">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const logMessageStyle = `m-3 p-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${getStepStyle(step.type)} ${
            isCurrent 
              ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400' 
              : 'opacity-60 hover:opacity-100'
          }`;

          return (
            <div key={index} onClick={() => goToStep(index)} className={logMessageStyle}>
              <div className="flex items-start gap-2 m-2">
                <span className="font-bold text-white/80">{index + 1}.</span>
                <p className="text-white text-sm">{step.message}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {step.arrState.map((val, idx) => {
                  const isHighlighted = step.highlights?.includes(idx);
                  const isFound = step.foundIndex === idx;
                  let valStyle = "bg-blue-500/80 text-white";
                  if (isHighlighted) valStyle = "bg-yellow-400 text-gray-900";
                  if (isFound) valStyle = "bg-green-500 text-white";
                  
                  return (
                    <div key={idx} className={`px-1.5 py-0.5 rounded text-xs font-bold ${valStyle}`}>
                      {val}
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


const ExplanationTab = () => {
  const walkthroughSteps = [
    { title: "Initial State", description: "This is our array. We want to find the number 25.", arrayState: [10, 50, 30, 70, 25, 60], target: 25, highlights: [] },
    { title: "Step 1: Index 0", description: "Check the first element. Is 10 equal to 25? No. Move to the next element.", arrayState: [10, 50, 30, 70, 25, 60], highlights: [0] },
    { title: "Step 2: Index 1", description: "Is 50 equal to 25? No. Continue.", arrayState: [10, 50, 30, 70, 25, 60], highlights: [1] },
    { title: "Step 3: Index 2", description: "Is 30 equal to 25? No. Continue.", arrayState: [10, 50, 30, 70, 25, 60], highlights: [2] },
    { title: "Step 4: Index 3", description: "Is 70 equal to 25? No. Continue.", arrayState: [10, 50, 30, 70, 25, 60], highlights: [3] },
    { title: "Step 5: Index 4 - Found!", description: "Is 25 equal to 25? Yes! The search is successful. The element is at index 4.", arrayState: [10, 50, 30, 70, 25, 60], highlights: [4], found: true },
  ];

  return (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-lg text-gray-300">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* What is Linear Search? */}
        <div>
          <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            What is Linear Search?
          </h2>
          <p className="text-lg leading-relaxed">
            Linear Search, also known as sequential search, is the most basic search algorithm. It sequentially checks each element of a list for the target value until a match is found or until all the elements have been searched. It is simple to implement but can be inefficient for large datasets.
          </p>
        </div>
        
        {/* Key Characteristics */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Key Characteristics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-300">Simple Implementation</h4>
              <p className="text-sm text-gray-400 mt-1">Its straightforward logic makes it easy to understand and code.</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-300">Unordered Data</h4>
              <p className="text-sm text-gray-400 mt-1">It works on any list, regardless of whether the data is sorted or not.</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-300">Inefficient at Scale</h4>
              <p className="text-sm text-gray-400 mt-1">Its performance degrades linearly as the size of the dataset grows.</p>
            </div>
          </div>
        </div>

        {/* Walkthrough */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-200">
            <Icon name="example"/>
            Example Walkthrough (Target : 25)
          </h3>
          <div className="bg-gray-700/50 p-6 rounded-lg">
            <div className="relative border-l-2 border-gray-600/50 pl-10 space-y-12">
              {walkthroughSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-[-45px] top-1 w-5 h-5 rounded-full bg-purple-400 ring-8 ring-gray-800/50 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="md:w-3/5">
                      <h4 className="text-lg font-bold text-purple-300">{step.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                    </div>
                    <div className="w-full md:w-2/5 flex items-center justify-center min-h-[5rem] gap-1 p-2 bg-gray-900/40 rounded-lg border border-gray-600/50">
                      {step.arrayState.map((val, idx) => (
                        <ExampleCell 
                          key={idx} 
                          value={val} 
                          color={step.found && step.highlights.includes(idx) ? 'found' : (step.highlights.includes(idx) ? 'compare' : 'default')} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pros, Cons, and Complexity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-200">Pros & Cons</h3>
            <div className="space-y-4">
              <div className="bg-green-900/40 p-4 rounded-lg border border-green-500/30">
                <h4 className="font-bold text-green-300">Best For:</h4>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-300">
                  <li>Small datasets</li>
                  <li>Unsorted lists</li>
                  <li>Simplicity is a priority</li>
                </ul>
              </div>
              <div className="bg-red-900/40 p-4 rounded-lg border border-red-500/30">
                <h4 className="font-bold text-red-300">Avoid For:</h4>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-300">
                  <li>Large datasets where performance is key</li>
                  <li>Frequently searched lists (sorting first may be better)</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-200">
              <Icon name="chart"/>
              Complexity Analysis
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-400">Time Complexity</h4>
                <p className="text-sm mt-2"><strong className="text-red-400">Worst Case:</strong> <span className="font-mono text-lg">O(n)</span></p>
                <p className="text-sm"><strong className="text-yellow-400">Average Case:</strong> <span className="font-mono text-lg">O(n)</span></p>
                <p className="text-sm"><strong className="text-green-400">Best Case:</strong> <span className="font-mono text-lg">O(1)</span></p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-400">Space Complexity</h4>
                <p className="text-sm mt-2"><strong className="text-indigo-300">All Cases:</strong> <span className="font-mono text-lg">O(1)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


//==============================================================================
// Main LinearSearchVisualizer Component
//==============================================================================
const LinearSearchVisualizer = () => {
  // --- STATE MANAGEMENT ---
  const [array, setArray] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [customInput, setCustomInput] = useState("");
  const [target, setTarget] = useState("");
  const [activeTab, setActiveTab] = useState("visualization");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReviewingPastStep, setIsReviewingPastStep] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [foundIndex, setFoundIndex] = useState(null);
  const [complexity, setComplexity] = useState({ comparisons: 0 });
  const logViewRef = useRef(null);
  const userHasScrolledUp = useRef(false);

  
  // --- LOGIC AND ALGORITHM ---
  
  const addStep = useCallback((message, type, arr, highlights, fndIndex, comp) => {
    const newStep = { 
      message, type, arrState: [...arr], highlights, foundIndex: fndIndex,
      complexity: { comparisons: comp } 
    };
    setSteps(prev => [...prev, newStep]);
    if (!isReviewingPastStep) {
      setCurrentStep(prev => prev + 1);
    }
  }, [isReviewingPastStep]);

  const runSearchStep = useCallback(() => {
    if (searchIndex >= array.length) {
      addStep(`Target ${target} not found in the array. Search finished.`, "notFound", array, [], null, complexity.comparisons);
      setIsFinished(true);
      setIsSearching(false);
      return;
    }

    const currentIndex = searchIndex;
    setHighlightedIndices([currentIndex]);
    const currentComplexity = { comparisons: complexity.comparisons + 1 };
    setComplexity(currentComplexity);
    
    addStep(`Comparing target (${target}) with element at index [${currentIndex}]: ${array[currentIndex]}.`, "compare", array, [currentIndex], null, currentComplexity.comparisons);

    if (array[currentIndex] == target) {
      setFoundIndex(currentIndex);
      addStep(`Success! Target ${target} found at index [${currentIndex}].`, "found", array, [], currentIndex, currentComplexity.comparisons);
      setIsFinished(true);
      setIsSearching(false);
    } else {
      setSearchIndex(currentIndex + 1);
    }
  }, [searchIndex, array, target, complexity, addStep]);


  // --- SIDE EFFECTS (useEffect) ---
  useEffect(() => {
    let timer;
    if (isSearching && !isPaused && !isFinished) {
      timer = setTimeout(runSearchStep, 1000 - speed * 9.5);
    }
    return () => clearTimeout(timer);
  }, [isSearching, isPaused, isFinished, runSearchStep, speed]);
  
  useEffect(() => {
    const logContainer = logViewRef.current;
    const handleScroll = () => {
      if (logContainer) {
        const { scrollTop, scrollHeight, clientHeight } = logContainer;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
        userHasScrolledUp.current = !isAtBottom;
      }
    };
    if (logContainer) {
      logContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (logContainer) {
        logContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReviewingPastStep && !userHasScrolledUp.current && logViewRef.current) {
        const logContainer = logViewRef.current;
        logContainer.scrollTo({
            top: logContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [steps, isReviewingPastStep]);

  useEffect(() => {
    handleReset();
  }, []);

  const resetSearchState = (newArray, newTarget = "") => {
    setIsSearching(false);
    setIsPaused(true);
    setIsFinished(false);
    setIsReviewingPastStep(false);
    setSearchIndex(0);
    setHighlightedIndices([]);
    setFoundIndex(null);
    setComplexity({ comparisons: 0 });
    userHasScrolledUp.current = false;
    const message = newTarget 
      ? `Array loaded. Target set to ${newTarget}. Press Play to start.`
      : "Array loaded. Enter a target value and press Play.";
    const initialStep = { 
      message, type: "start", arrState: [...newArray], highlights: [], foundIndex: null,
      complexity: { comparisons: 0 } 
    };
    setSteps([initialStep]);
    setCurrentStep(0);
  }

  // --- EVENT HANDLERS ---
  const handleReset = () => {
    const newArray = Array.from({ length: 14 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setCustomInput(newArray.join(', '));
    setTarget("");
    resetSearchState(newArray);
  };

  const handleCustomArray = () => {
    const newArray = customInput
      .split(/[, ]+/)
      .map(item => parseInt(item.trim()))
      .filter(item => !isNaN(item) && item >= 0);
      
    if (newArray.length === 0) {
      alert("Please enter valid, positive numbers separated by commas or spaces.");
      return;
    }
    
    const slicedArray = newArray.slice(0, 15);
    setArray(slicedArray);
    resetSearchState(slicedArray, target);
  };

  const loadExampleArray = () => {
    const exampleArray = [42, 15, 73, 8, 56, 91, 29, 64];
    setArray(exampleArray);
    setCustomInput(exampleArray.join(', '));
    const newTarget = 29;
    setTarget(newTarget);
    resetSearchState(exampleArray, newTarget);
  };
  
  const toggleSearch = () => {
    if (isFinished || !target) {
      if (!target) alert("Please enter a target value to search for.");
      return;
    }
    if (isReviewingPastStep) {
      setIsReviewingPastStep(false);
      userHasScrolledUp.current = false;
      setCurrentStep(steps.length - 1);
    }
    setIsSearching(true);
    setIsPaused(!isPaused);
    if (searchIndex === 0 && steps.length <= 1) {
       addStep(`Starting search for target value: ${target}.`, "start", array, [], null, 0);
    }
  };
  
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setIsPaused(true);
      setIsReviewingPastStep(true);
      userHasScrolledUp.current = true; 
      setCurrentStep(stepIndex);
    }
  };

  const stepForward = () => goToStep(currentStep + 1);
  const stepBackward = () => goToStep(currentStep - 1);

  
  // --- RENDER LOGIC ---
  const displayedStep = steps[currentStep] || {};
  const arrayToDisplay = isReviewingPastStep ? (displayedStep.arrState || []) : array;
  const highlightsToDisplay = isReviewingPastStep ? (displayedStep.highlights || []) : highlightedIndices;
  const foundToDisplay = isReviewingPastStep ? displayedStep.foundIndex : foundIndex;
  const complexityToDisplay = isReviewingPastStep ? (displayedStep.complexity || { comparisons: 0 }) : complexity;

  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "text-purple-400 border-b-2 border-purple-400"
      : "text-gray-400 hover:text-gray-300";
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center font-sans">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/40 to-indigo-900/60 -z-10" />

      <header className="w-full max-w-6xl mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
          Linear Search Visualizer
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          An interactive tool to visualize the step-by-step process of the Linear Search algorithm.
        </p>
      </header>

      <main className="w-full max-w-6xl space-y-6">
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
          <>
            <ComplexityDisplay complexity={complexityToDisplay} />

            <Controls
              isFinished={isFinished}
              isPaused={isPaused}
              isSearching={isSearching}
              currentStep={currentStep}
              steps={steps}
              speed={speed}
              customInput={customInput}
              target={target}
              toggleSearch={toggleSearch}
              stepBackward={stepBackward}
              stepForward={stepForward}
              handleReset={handleReset}
              loadExampleArray={loadExampleArray}
              setSpeed={setSpeed}
              setCustomInput={setCustomInput}
              handleCustomArray={handleCustomArray}
              setTarget={setTarget}
            />
            
            <VisualizationArea 
              array={arrayToDisplay}
              highlights={highlightsToDisplay}
              foundIndex={foundToDisplay}
              // Pass the live state variables to control the status message
              isFinished={isFinished}
              target={target}
              isSearching={isSearching}
              isPaused={isPaused}
            />

            <LogView 
              steps={steps}
              currentStep={currentStep}
              goToStep={goToStep}
              logViewRef={logViewRef}
            />
          </>
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