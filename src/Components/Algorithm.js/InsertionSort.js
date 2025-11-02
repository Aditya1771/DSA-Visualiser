import { useState, useEffect, useRef } from "react";

const InsertionSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [steps, setSteps] = useState([]);
  const stopRef = useRef(false);
  const [complexity, setComplexity] = useState({
    comparisons: 0,
    swaps: 0,
    passes: 0,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)"
  });

  const logStep = (
    message,
    type = "info",
    arrState = [],
    highlights = [],
    sorted = []
  ) => {
    setSteps((prev) => [
      ...prev,
      {
        message,
        type,
        arrState: [...arrState],
        highlights: [...highlights],
        sorted: [...sorted],
      },
    ]);
  };

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 100) + 10
    );
    setArray(newArray);
    setSortedIndices([]);
    setHighlightedIndices([]);
    setSteps([
      {
        message: "Array generated. Ready to sort!",
        type: "start",
        arrState: newArray,
        highlights: [],
        sorted: [],
      },
    ]);
    setComplexity({
      comparisons: 0,
      swaps: 0,
      passes: 0,
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)"
    });
  };

  const handleCustomArray = () => {
    try {
      const newArray = customInput
        .split(",")
        .map((item) => parseInt(item.trim()))
        .filter((item) => !isNaN(item));

      if (newArray.length === 0) {
        logStep(
          "Please enter valid numbers separated by commas",
          "error",
          [],
          [],
          []
        );
        return;
      }
      
      const fixedSizeArray = newArray.slice(0, 10);
    
      setArray(fixedSizeArray);
      setSortedIndices([]);
      setHighlightedIndices([]);
      setSteps([
        {
          message: `Custom array loaded with ${newArray.length} elements`,
          type: "start",
          arrState: newArray,
          highlights: [],
          sorted: [],
        },
      ]);
      setComplexity({
        comparisons: 0,
        swaps: 0,
        passes: 0,
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
      });
    } catch {
      logStep("Invalid input format. Use comma-separated numbers", "error");
    }
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const insertionSort = async () => {
    setSorting(true);
    stopRef.current = false;
    let arr = [...array];
    let len = arr.length;
    let comparisons = 0;
    let swaps = 0;
    let passes = 0;

    setComplexity({
      comparisons: 0,
      swaps: 0,
      passes: 0,
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)"
    });

    logStep("Starting Insertion Sort...", "start", arr, [], []);

    await sleep(1000 - speed * 10);

    // First element is considered sorted
    setSortedIndices([0]);
    logStep("First element is considered sorted", "sorted", arr, [], [0]);
    await sleep(1000 - speed * 10);

    for (let i = 1; i < len; i++) {
      if (stopRef.current) break;
      passes++;
      setComplexity(prev => ({ ...prev, passes }));

      let current = arr[i];
      let j = i - 1;

      setHighlightedIndices([i, j]);
      logStep(
        `Selecting element at index ${i} (${current}) to insert`,
        "select",
        arr,
        [i, j],
        [...sortedIndices]
      );
      await sleep(1000 - speed * 10);

      while (j >= 0 && arr[j] > current) {
        if (stopRef.current) break;
        
        comparisons++;
        setComplexity(prev => ({ ...prev, comparisons }));

        logStep(
          `Comparing ${arr[j]} > ${current} - shifting ${arr[j]} to the right`,
          "compare",
          arr,
          [j, j+1],
          [...sortedIndices]
        );
        await sleep(1000 - speed * 10);

        arr[j + 1] = arr[j];
        swaps++;
        setComplexity(prev => ({ ...prev, swaps }));
        setArray([...arr]);
        
        logStep(
          `Shifted ${arr[j]} to position ${j + 1}`,
          "shift",
          arr,
          [j, j+1],
          [...sortedIndices]
        );
        await sleep(1000 - speed * 10);

        j--;
        setHighlightedIndices([i, j]);
      }

      arr[j + 1] = current;
      setArray([...arr]);
      setSortedIndices(prev => [...prev, j + 1]);
      
      logStep(
        `Inserted ${current} at position ${j + 1}`,
        "insert",
        arr,
        [j + 1],
        [...sortedIndices, j + 1]
      );
      await sleep(1000 - speed * 10);
    }

    logStep("Sorting complete!", "finish", arr, [], Array.from({ length: len }, (_, i) => i));
    setSorting(false);
    setHighlightedIndices([]);
  };

  const stopSorting = () => {
    stopRef.current = true;
    setSorting(false);
    logStep("Sorting stopped by user", "error", array, [], sortedIndices);
  };

  const resetArray = () => {
    stopRef.current = true;
    generateArray();
    setSorting(false);
  };

  const getStepStyle = (type) => {
    switch (type) {
      case "start":
        return "bg-indigo-600/90";
      case "select":
        return "bg-purple-600/90";
      case "compare":
        return "bg-yellow-500/90";
      case "shift":
        return "bg-pink-600/90";
      case "insert":
        return "bg-green-600/90";
      case "finish":
        return "bg-teal-600/90";
      case "error":
        return "bg-red-600/90";
      default:
        return "bg-gray-600/90";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 opacity-50 -z-10" />

      <header className="w-full max-w-6xl mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
          Insertion Sort Visualizer
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Visualize how the Insertion Sort algorithm works step by step with complexity analysis.
        </p>
      </header>

      <main className="w-full max-w-6xl space-y-6">
        {/* Complexity Analysis Section */}
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Complexity Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <h3 className="text-sm text-gray-400 mb-1">Time Complexity</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-300">{complexity.timeComplexity}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Worst & Average case
              </p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <h3 className="text-sm text-gray-400 mb-1">Space Complexity</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-300">{complexity.spaceComplexity}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                In-place algorithm
              </p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <h3 className="text-sm text-gray-400 mb-1">Comparisons</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-yellow-300">{complexity.comparisons}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Total comparisons made
              </p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <h3 className="text-sm text-gray-400 mb-1">Shifts</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-pink-300">{complexity.swaps}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Total shifts performed
              </p>
            </div>
          </div>
        </section>

        {/* Controls Panel */}
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generateArray}
                  disabled={sorting}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    sorting
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  New Array
                </button>
                <button
                  onClick={insertionSort}
                  disabled={sorting}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    sorting
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Start Sort
                </button>
                <button
                  onClick={stopSorting}
                  disabled={!sorting}
                  className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 transition-all"
                >
                  Stop
                </button>
                <button
                  onClick={resetArray}
                  className="px-4 py-2 rounded-lg font-medium bg-yellow-600 hover:bg-yellow-700 transition-all"
                >
                  Reset
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
                    disabled={sorting}
                  />
                  <span className="text-sm font-medium w-10">{speed}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Custom Array</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g. 5, 3, 8, 1, 2"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white"
                  disabled={sorting}
                />
                <button
                  onClick={handleCustomArray}
                  disabled={sorting}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    sorting
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  Load
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Enter comma-separated numbers (e.g., 5, 3, 8, 1, 2)
              </p>
            </div>
          </div>
        </section>

        {/* Visualization Area */}
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Visualization</h2>
          <div className="flex items-end justify-center h-64 gap-1.5 px-4">
            {array.map((value, index) => {
              const isHighlighted = highlightedIndices.includes(index);
              const isSorted = sortedIndices.includes(index);
              return (
                <div
                  key={index}
                  className={`relative transition-all duration-300 ease-in-out rounded-t-lg shadow-md flex flex-col items-center ${
                    isHighlighted
                      ? "bg-yellow-400 animate-pulse"
                      : isSorted
                      ? "bg-gradient-to-b from-green-400 to-green-600"
                      : "bg-gradient-to-b from-blue-400 to-blue-600"
                  }`}
                  style={{
                    height: `${value}%`,
                    width: `${100 / array.length}%`,
                    maxWidth: "60px",
                  }}
                >
                  <span className="absolute -top-6 text-xs font-medium text-gray-300">
                    {index}
                  </span>
                  <span className="text-white font-medium mt-auto mb-1">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step-by-Step Log */}
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-300">Algorithm Steps</h2>
            <span className="text-sm text-gray-400">
              {steps.length} steps recorded
            </span>
          </div>
          
          <div className="max-h-96 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg shadow-md transition-all ${getStepStyle(
                    step.type
                  )}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-white/80">{i + 1}.</span>
                    <p className="text-white text-sm">{step.message}</p>
                  </div>
                  
                  {step.arrState && step.arrState.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {step.arrState.map((val, idx) => {
                        const isHighlighted = step.highlights?.includes(idx);
                        const isSorted = step.sorted?.includes(idx);
                        return (
                          <div
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              isHighlighted
                                ? "bg-yellow-400 text-gray-900"
                                : isSorted
                                ? "bg-green-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Insertion Sort Visualizer - Interactive Algorithm Demonstration</p>
      </footer>
    </div>
  );
};

export default InsertionSortVisualizer;