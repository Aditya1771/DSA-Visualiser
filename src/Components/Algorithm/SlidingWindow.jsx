import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Activity, ArrowLeftRight, ArrowUpDown, BarChart3, BrainCircuit, CheckCircle2, ChevronRight, CircleHelp, Clock, Code2, Copy, Home, Info, Maximize, Share2, Target, Trophy, Wand2, XCircle } from "lucide-react";
import { completeAlgorithm } from "../../Stores/authSlice";
import GlossyButton from "../Utils/GlossyButton";
import PremiumCodeReference from "../Utils/PremiumCodeReference";
import QuizArena from "../Utils/QuizArena";
import SortingControls from "../Utils/SortingControls";
import SortingLogView from "../Utils/SortingLogView";

const ALGORITHM_KEY = "Sliding-Window";
const EXAMPLES = [
  { values: [2, 1, 5, 1, 3, 2], target: 7 },
  { values: [1, 2, 1, 0, 1, 1, 0], target: 4 },
  { values: [4, 2, 1, 7, 3, 2], target: 8 },
];

const CODE = {
  javascript: `function longestWindowAtMostTarget(numbers, target) {
  let left = 0;
  let sum = 0;
  let bestLength = 0;
  let bestRange = [-1, -1];

  for (let right = 0; right < numbers.length; right++) {
    sum += numbers[right];
    while (sum > target && left <= right) {
      sum -= numbers[left++];
    }
    const length = right - left + 1;
    if (length > bestLength) {
      bestLength = length;
      bestRange = [left, right];
    }
  }
  return { bestLength, bestRange };
}

console.log(longestWindowAtMostTarget([2, 1, 5, 1, 3, 2], 7));`,
  python: `def longest_window_at_most_target(numbers, target):
    left = current_sum = best_length = 0
    best_range = (-1, -1)

    for right, value in enumerate(numbers):
        current_sum += value
        while current_sum > target and left <= right:
            current_sum -= numbers[left]
            left += 1
        length = right - left + 1
        if length > best_length:
            best_length = length
            best_range = (left, right)

    return best_length, best_range

print(longest_window_at_most_target([2, 1, 5, 1, 3, 2], 7))`,
  cpp: `#include <utility>
#include <vector>
using namespace std;

pair<int, pair<int, int>> longestWindowAtMostTarget(
    const vector<int>& values, int target
) {
    int left = 0, sum = 0, bestLength = 0;
    pair<int, int> bestRange = {-1, -1};
    for (int right = 0; right < static_cast<int>(values.size()); ++right) {
        sum += values[right];
        while (sum > target && left <= right) sum -= values[left++];
        int length = right - left + 1;
        if (length > bestLength) {
            bestLength = length;
            bestRange = {left, right};
        }
    }
    return {bestLength, bestRange};
}`,
};

const initialState = (values, target) => ({
  left: 0, right: -1, sum: 0, bestLength: 0, bestLeft: -1, bestRight: -1,
  comparisons: 0, moves: 0, nextAction: "expand", target, values,
});

const startStep = (values, target) => {
  const state = initialState(values, target);
  return {
    ...state, algorithmState: state, type: "start",
    message: `Start with an empty window. Find the longest contiguous range with sum at most ${target}.`,
    arrState: values.map((value) => ({ value })), highlights: [], sorted: [],
  };
};

const SlidingWindowGraph = ({ isDark }) => {
  const [hoverN, setHoverN] = useState(null);
  const graphRef = useRef(null);
  const width = 680;
  const height = 340;
  const pad = { top: 24, right: 120, bottom: 44, left: 54 };
  const maxN = 25;
  const maxOps = maxN * maxN;
  const xAt = (n) => pad.left + ((n - 1) / (maxN - 1)) * (width - pad.left - pad.right);
  const yAt = (ops) => height - pad.bottom - (ops / maxOps) * (height - pad.top - pad.bottom);
  const path = (fn) => Array.from({ length: maxN }, (_, i) => `${i ? "L" : "M"} ${xAt(i + 1)} ${yAt(fn(i + 1))}`).join(" ");
  const textColor = isDark ? "#d1d5db" : "#475569";
  const gridColor = isDark ? "#4b5563" : "#cbd5e1";
  const onMove = (event) => {
    const rect = graphRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * width;
    if (x < pad.left || x > width - pad.right) return setHoverN(null);
    setHoverN(Math.max(1, Math.min(maxN, Math.round(1 + ((x - pad.left) / (width - pad.left - pad.right)) * (maxN - 1)))));
  };
  return <div className={`relative rounded-2xl border p-4 ${isDark ? "border-gray-700 bg-gray-900/90" : "border-slate-200 bg-white/90 shadow-xl"}`}>
    <p className={`mb-3 text-center text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>Hover over the chart to compare operations as input size grows.</p>
    <div ref={graphRef} onMouseMove={onMove} onMouseLeave={() => setHoverN(null)} className="h-[360px] w-full cursor-crosshair">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Sliding window linear operations compared with brute force quadratic operations">
        {[0, 100, 200, 300, 400, 500, 600].map((tick) => <g key={tick}><line x1={pad.left} y1={yAt(tick)} x2={width - pad.right} y2={yAt(tick)} stroke={gridColor} strokeDasharray="3 4" /><text x={pad.left - 8} y={yAt(tick) + 4} textAnchor="end" fontSize="10" fill={textColor}>{tick}</text></g>)}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={height - pad.bottom} stroke={textColor} strokeWidth="2" />
        <line x1={pad.left} y1={height - pad.bottom} x2={width - pad.right} y2={height - pad.bottom} stroke={textColor} strokeWidth="2" />
        <text x={(pad.left + width - pad.right) / 2} y={height - 8} textAnchor="middle" fontSize="11" fill={textColor}>Input size (n)</text>
        <path d={path((n) => 2 * n)} fill="none" stroke="#22c55e" strokeWidth="3" />
        <path d={path((n) => n * n)} fill="none" stroke="#ef4444" strokeWidth="3" />
        <text x={xAt(maxN) + 6} y={yAt(2 * maxN) - 3} fontSize="10" fill="#22c55e">Sliding window O(n)</text>
        <text x={xAt(maxN) + 6} y={yAt(maxOps) + 12} fontSize="10" fill="#ef4444">Brute force O(n²)</text>
        {hoverN !== null && <g>
          <line x1={xAt(hoverN)} y1={pad.top} x2={xAt(hoverN)} y2={height - pad.bottom} stroke={textColor} strokeDasharray="4 4" opacity="0.6" />
          <circle cx={xAt(hoverN)} cy={yAt(2 * hoverN)} r="5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
          <circle cx={xAt(hoverN)} cy={yAt(hoverN * hoverN)} r="5" fill="#ef4444" stroke="white" strokeWidth="1.5" />
          {(() => { const boxW = 140; const x = xAt(hoverN) + boxW + xAt(hoverN) > width - pad.right ? xAt(hoverN) - boxW - 12 : xAt(hoverN) + 12; const y = Math.max(pad.top, Math.min(height - pad.bottom - 55, yAt(hoverN * hoverN) - 28)); return <g transform={`translate(${x}, ${y})`}><rect width={boxW} height="55" rx="6" fill={isDark ? "#050505" : "white"} stroke={isDark ? "#374151" : "#cbd5e1"} /><text x="8" y="18" fill={textColor} fontSize="11">n = {hoverN}</text><text x="8" y="34" fill="#22c55e" fontSize="10">Window: ≤ {2 * hoverN}</text><text x="8" y="49" fill="#ef4444" fontSize="10">Brute force: {hoverN * hoverN}</text></g>; })()}
        </g>}
      </svg>
    </div>
    <div className={`mt-3 flex flex-wrap justify-center gap-6 text-xs font-medium ${isDark ? "text-gray-300" : "text-slate-600"}`}><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" />Sliding window O(n)</span><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" />Brute force O(n²)</span></div>
  </div>;
};

const SlidingWindowExplanation = ({ isDark }) => {
  const card = `${isDark ? "bg-[#0A0A0A]/60 border-white/5" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"} rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/20 md:p-8`;
  const text = isDark ? "text-gray-300" : "text-slate-600";
  const muted = isDark ? "text-gray-400" : "text-slate-500";
  const title = isDark ? "text-gray-200" : "text-slate-800";
  return <section className={`${text} animate-fadeIn`}><div className="mx-auto max-w-6xl space-y-12">
    <article className={card}><h2 className="mb-4 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-center text-2xl font-bold text-transparent"><Target className="h-6 w-6 text-purple-400" />What Is the Sliding Window Technique?</h2><p className="text-center text-sm leading-relaxed">A sliding window represents a contiguous range in an array. Instead of recalculating each range from scratch, the algorithm updates a running sum as the window moves: add values at the right edge and remove values at the left edge when a constraint is broken. This page demonstrates finding the longest subarray with sum at most a target. Because this sum-based variant shrinks the window when the sum is too large, all input values must be nonnegative.</p></article>
    <article className={card}><h3 className={`mb-6 flex items-center justify-center gap-3 text-lg font-bold ${title}`}><Wand2 className="h-5 w-5 text-purple-400" />How It Works: Detailed Walkthrough</h3><p className={`mb-5 text-center text-sm ${muted}`}>Example: [2, 1, 5, 1, 3, 2], target 7.</p><div className="space-y-4">{[["Grow the window", "Add 2 and 1. The window sum is 3, so it is valid; record length 2."], ["Constraint exceeded", "Add 5. The sum is 8, so remove 2 from the left. The remaining [1, 5] sums to 6."], ["Record a longer range", "Add 1. The window [1, 5, 1] sums to 7, so record length 3."], ["Finish the scan", "Continue adding values and shrinking only when needed. The best range is [1, 5, 1], length 3."]].map(([heading, description], index) => <div key={heading} className={`flex gap-4 rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900/50" : "border-slate-200 bg-slate-50"}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs font-bold text-purple-500">{index + 1}</span><div><h4 className={`font-semibold ${title}`}>{heading}</h4><p className={`mt-1 text-sm ${muted}`}>{description}</p></div></div>)}</div></article>
    <article className={card}><h3 className={`mb-4 flex items-center gap-3 text-lg font-bold ${title}`}><Code2 className="h-5 w-5 text-purple-400" />The Algorithm, Step by Step</h3><ol className={`list-inside list-decimal space-y-4 text-sm leading-relaxed ${text}`}><li><strong>Initialize</strong><span className={`ml-1 ${muted}`}>Set left to 0, sum to 0, and best length to 0.</span></li><li><strong>Expand</strong><span className={`ml-1 ${muted}`}>Move right forward and add the new value to the running sum.</span></li><li><strong>Shrink if necessary</strong><span className={`ml-1 ${muted}`}>While sum exceeds the target, subtract values from the left and advance left.</span></li><li><strong>Update the best</strong><span className={`ml-1 ${muted}`}>The remaining window is valid; save it if its length exceeds the best so far.</span></li><li><strong>Repeat and return</strong><span className={`ml-1 ${muted}`}>Continue until right reaches the end. Return the longest range and its boundaries.</span></li></ol><div className={`mt-6 rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900/50" : "border-slate-200 bg-slate-50"}`}><h4 className="font-bold">Precondition</h4><p className={`mt-2 text-sm leading-relaxed ${muted}`}>This sum-based shrink rule requires nonnegative input. With negative values, removing a left value may increase the sum, so use a different technique for that problem.</p></div></article>
    <article className={card}><h3 className={`mb-6 flex items-center gap-3 text-lg font-bold ${title}`}><BarChart3 className="h-5 w-5 text-purple-400" />Complexity Analysis</h3><div className="grid grid-cols-1 gap-6 md:grid-cols-3"><div className={`rounded-lg border p-6 md:col-span-2 ${isDark ? "border-gray-700 bg-gray-900/50" : "border-slate-200 bg-slate-50"}`}><h4 className="mb-4 flex items-center gap-2 font-semibold text-purple-400"><Clock className="h-5 w-5" />Time Complexity</h4><div className="grid gap-4 sm:grid-cols-3">{[["O(n)", "Best", "The right pointer scans the array once."], ["O(n)", "Average", "Each value enters and exits at most once."], ["O(n)", "Worst", "Both pointers move forward at most n times."]].map(([value, label, detail]) => <div key={label} className="rounded-md bg-purple-800/15 p-3 text-center"><p className="text-lg font-bold text-purple-400">{value}</p><p className="text-xs text-purple-500">{label} case</p><p className={`mt-1 text-[10px] ${muted}`}>{detail}</p></div>)}</div></div><div className={`rounded-lg border p-6 ${isDark ? "border-gray-700 bg-gray-900/50" : "border-slate-200 bg-slate-50"}`}><h4 className="mb-4 flex items-center gap-2 font-semibold text-sky-400"><Maximize className="h-5 w-5" />Space Complexity</h4><div className="rounded-md bg-sky-800/20 p-3 text-center"><p className="text-lg font-bold text-sky-400">O(1)</p><p className="text-xs text-sky-500">Auxiliary space</p><p className={`mt-1 text-[10px] ${muted}`}>Only boundaries and a few counters are stored.</p></div></div></div></article>
    <article className={card}><h3 className={`mb-6 flex items-center justify-center gap-3 text-lg font-bold ${title}`}><Activity className="h-5 w-5 text-purple-400" />Interactive Performance Graph</h3><SlidingWindowGraph isDark={isDark} /></article>
    <article className={card}><h3 className={`mb-6 flex items-center gap-3 text-lg font-bold ${title}`}><ArrowUpDown className="h-5 w-5 text-purple-400" />Pros &amp; Cons</h3><div className="grid gap-8 md:grid-cols-2"><div className={`rounded-lg border-l-4 border-green-500 p-6 ${isDark ? "bg-gray-900/50" : "bg-slate-50"}`}><h4 className="mb-4 font-semibold text-green-500">Advantages</h4><ul className={`space-y-3 text-sm ${text}`}><li className="flex gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" /><span><strong>Linear time:</strong> Reuses overlapping work instead of recounting every range.</span></li><li className="flex gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" /><span><strong>Constant extra space:</strong> Keeps a running sum and window boundaries.</span></li><li className="flex gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" /><span><strong>Broad pattern:</strong> Useful for range sums, counts, and substring constraints.</span></li></ul></div><div className={`rounded-lg border-l-4 border-red-500 p-6 ${isDark ? "bg-gray-900/50" : "bg-slate-50"}`}><h4 className="mb-4 font-semibold text-red-500">Limitations</h4><ul className={`space-y-3 text-sm ${text}`}><li className="flex gap-3"><XCircle className="h-4 w-4 shrink-0 text-red-500" /><span><strong>Requires the right invariant:</strong> Not every range problem admits safe pointer movement.</span></li><li className="flex gap-3"><XCircle className="h-4 w-4 shrink-0 text-red-500" /><span><strong>Nonnegative values here:</strong> Negative numbers break this sum-based shrink behavior.</span></li><li className="flex gap-3"><XCircle className="h-4 w-4 shrink-0 text-red-500" /><span><strong>Contiguous ranges only:</strong> A window does not represent arbitrary subsequences.</span></li></ul></div></div></article>
  </div></section>;
};

const SlidingWindow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.value) === "dark";
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [valuesInput, setValuesInput] = useState("2, 1, 5, 1, 3, 2");
  const [targetInput, setTargetInput] = useState("7");
  const [values, setValues] = useState(EXAMPLES[0].values);
  const [target, setTarget] = useState(EXAMPLES[0].target);
  const [steps, setSteps] = useState(() => [startStep(EXAMPLES[0].values, EXAMPLES[0].target)]);
  const [algorithmState, setAlgorithmState] = useState(() => initialState(EXAMPLES[0].values, EXAMPLES[0].target));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(55);
  const [activeTab, setActiveTab] = useState("visualization");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [inputError, setInputError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const completedRef = useRef(false);
  const step = steps[currentStep] || steps[0];
  const isFinished = step.type === "finish";
  const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 text-slate-100 backdrop-blur-md" : "bg-white/80 border-slate-200 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const mutedClass = isDark ? "text-gray-400" : "text-slate-500";
  const logSteps = useMemo(() => steps.map((item) => ({ ...item, type: item.type === "expand" ? "pass" : item.type === "shrink" ? "pivot" : item.type === "best" ? "sorted" : item.type })), [steps]);

  const appendStep = (entry, nextState) => {
    const nextSteps = steps.slice(0, currentStep + 1);
    nextSteps.push({
      ...entry, ...nextState, algorithmState: nextState,
      arrState: values.map((value) => ({ value })),
      highlights: nextState.left <= nextState.right ? Array.from({ length: nextState.right - nextState.left + 1 }, (_, index) => nextState.left + index) : [],
      sorted: nextState.bestLength ? Array.from({ length: nextState.bestLength }, (_, index) => nextState.bestLeft + index) : [],
    });
    setSteps(nextSteps);
    setCurrentStep(nextSteps.length - 1);
    setAlgorithmState(nextState);
  };

  const runNextStep = () => {
    const { left, right, sum, bestLength, bestLeft, bestRight, comparisons, moves, nextAction } = algorithmState;
    if (nextAction === "done") return setIsPlaying(false);
    if (nextAction === "expand") {
      if (right + 1 >= values.length) {
        appendStep({ type: "finish", message: `Search complete. The longest valid window has length ${bestLength}${bestLength ? ` at indices ${bestLeft}–${bestRight}` : " (no non-empty valid window)"}.` }, { ...algorithmState, nextAction: "done" });
        return;
      }
      const nextRight = right + 1;
      const nextSum = sum + values[nextRight];
      appendStep({ type: "expand", message: `Expand right to index ${nextRight} (value ${values[nextRight]}). Window sum is now ${nextSum}.` }, { ...algorithmState, right: nextRight, sum: nextSum, moves: moves + 1, nextAction: "check" });
      return;
    }
    if (nextAction === "shrink") {
      const nextSum = sum - values[left];
      appendStep({ type: "shrink", message: `Remove ${values[left]} at index ${left} from the left. Window sum drops to ${nextSum}.` }, { ...algorithmState, left: left + 1, sum: nextSum, moves: moves + 1, nextAction: "check" });
      return;
    }
    const nextComparisons = comparisons + 1;
    if (sum > target) {
      appendStep({ type: "compare", message: `Window sum ${sum} exceeds target ${target}; shrink from the left.` }, { ...algorithmState, comparisons: nextComparisons, nextAction: "shrink" });
      return;
    }
    const length = right - left + 1;
    const improvesBest = length > bestLength;
    appendStep({
      type: improvesBest ? "best" : "compare",
      message: improvesBest ? `Valid window [${left}, ${right}] has sum ${sum}. New best length: ${length}.` : `Window [${left}, ${right}] is valid with sum ${sum}, but does not beat length ${bestLength}.`,
    }, { ...algorithmState, comparisons: nextComparisons, bestLength: improvesBest ? length : bestLength, bestLeft: improvesBest ? left : bestLeft, bestRight: improvesBest ? right : bestRight, nextAction: "expand" });
  };

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (isFinished) { setIsPlaying(false); return undefined; }
    const timer = window.setTimeout(runNextStep, 1050 - Number(speed) * 10);
    return () => window.clearTimeout(timer);
  }, [isPlaying, isFinished, speed, currentStep, steps, algorithmState]);
  useEffect(() => {
    if (!isFinished || completedRef.current || !isAuthenticated || currentStep === 0) return;
    completedRef.current = true;
    dispatch(completeAlgorithm(ALGORITHM_KEY)).unwrap().catch((error) => console.error("Progress sync failed:", error));
  }, [isFinished, isAuthenticated, dispatch, currentStep]);

  const loadProblem = (nextValues, nextTarget) => {
    const state = initialState([...nextValues], nextTarget);
    setValues([...nextValues]); setTarget(nextTarget); setValuesInput(nextValues.join(", ")); setTargetInput(String(nextTarget));
    setSteps([startStep(nextValues, nextTarget)]); setAlgorithmState(state); setCurrentStep(0); setIsPlaying(false); setInputError(""); completedRef.current = false;
  };
  const applyCustom = () => {
    const parsed = valuesInput.split(/[\s,]+/).filter(Boolean).map(Number);
    const parsedTarget = Number(targetInput);
    if (!parsed.length || parsed.length > 14 || parsed.some((value) => !Number.isInteger(value) || value < 0 || value > 100) || !targetInput.trim() || !Number.isInteger(parsedTarget) || parsedTarget < 0 || parsedTarget > 500) {
      setInputError("Enter 1–14 nonnegative integers (0–100) and a target from 0–500."); return;
    }
    loadProblem(parsed, parsedTarget);
  };
  const reset = () => { const state = initialState(values, target); setSteps([startStep(values, target)]); setAlgorithmState(state); setCurrentStep(0); setIsPlaying(false); completedRef.current = false; };
  const stepBack = () => { setIsPlaying(false); setCurrentStep((index) => Math.max(index - 1, 0)); };
  const stepForward = () => { setIsPlaying(false); setCurrentStep((index) => Math.min(index + 1, steps.length - 1)); };
  const goToStep = (index) => { if (!steps[index]) return; setIsPlaying(false); setCurrentStep(index); setAlgorithmState(steps[index].algorithmState); };
  const togglePlay = () => { if (!isFinished) setIsPlaying((playing) => !playing); };
  const loadExample = () => { const example = EXAMPLES[exampleIndex % EXAMPLES.length]; setExampleIndex((index) => index + 1); loadProblem(example.values, example.target); };
  const generateRandom = () => { const randomValues = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)); loadProblem(randomValues, randomValues.slice(0, 3).reduce((total, value) => total + value, 0)); };
  const copyLink = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopyLabel("Copied!"); window.setTimeout(() => setCopyLabel("Copy"), 2000); } catch (error) { console.error("Could not copy link:", error); } };
  const share = () => navigator.share ? navigator.share({ title: "Sliding Window Visualizer", text: "Explore the sliding window technique.", url: window.location.href }) : window.alert("Web Share is unavailable. Use Copy to copy the visualizer link.");

  return <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 selection:bg-purple-500 selection:text-white ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}>
    <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`} style={{ backgroundImage: `linear-gradient(${isDark ? "#333" : "#cbd5e1"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "#333" : "#cbd5e1"} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
    <div className="fixed inset-0 overflow-hidden pointer-events-none"><motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], x: [0, 50, 0], y: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className={`absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} /><motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], x: [0, 50, 0], y: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} className={`absolute -right-[10%] top-[30%] h-[500px] w-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} /></div>
    <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center p-4 md:p-8">
      <header className="relative mb-8 mt-15 w-full animate-fadeIn py-10"><div className="relative flex flex-col md:flex-row md:items-start md:justify-center"><nav className={`mb-6 flex items-center gap-2 text-sm md:absolute md:left-0 md:top-1 md:mb-0 ${mutedClass}`} aria-label="Breadcrumb"><a href="/" className="flex items-center gap-2 hover:text-purple-500"><Home className="h-4 w-4" />Home</a><ChevronRight className="h-4 w-4" /><a href="/algorithms" className="hover:text-purple-500">Dashboard</a><ChevronRight className="h-4 w-4" /><span>Sliding Window</span></nav><div className="w-full text-center"><div className={`mb-3 inline-block rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest ${isDark ? "border-green-400/20 bg-green-400/10 text-green-400" : "border-green-200 bg-green-50 text-green-600"}`}>Array Technique</div><h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">Sliding Window Visualizer</h1><p className={`mx-auto mt-4 max-w-2xl text-sm md:text-base ${mutedClass}`}>Grow and shrink a contiguous range to find the longest valid subarray.</p><div className="mt-6 flex justify-center gap-4"><GlossyButton onClick={copyLink} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Copy className="h-4 w-4" />{copyLabel}</GlossyButton><GlossyButton onClick={share} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Share2 className="h-4 w-4" />Share</GlossyButton></div></div></div></header>
      <div className="mt-6 w-full space-y-6">
        <div className={`flex w-full gap-1 overflow-x-auto border-b ${isDark ? "border-gray-700" : "border-slate-200"}`} role="tablist">{[["visualization", "Visualization"], ["explanation", "Explanation"], ["code", "Code & Practice"], ["quiz", "Mastery Arena"]].map(([id, label]) => <button key={id} role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${activeTab === id ? "border-purple-500 text-purple-500" : `border-transparent ${mutedClass} hover:text-purple-500`}`}>{id === "quiz" && <BrainCircuit className="mr-2 inline" size={16} />}{label}</button>)}</div>
        {activeTab === "visualization" && <div className="w-full animate-fadeIn">
          <section className={`${cardClass} mb-6 w-full rounded-xl border p-6`}><h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><BarChart3 className="h-4 w-4" />Complexity Analysis</h2><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-lg border border-indigo-700/50 bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3"><h3 className="mb-1 flex items-center gap-2 text-xs text-indigo-400"><ArrowUpDown className="h-4 w-4" />Checks</h3><span className="text-xl font-bold text-indigo-400">{step.comparisons}</span></div><div className="rounded-lg border border-pink-700/50 bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3"><h3 className="mb-1 flex items-center gap-2 text-xs text-pink-400"><ArrowLeftRight className="h-4 w-4" />Window moves</h3><span className="text-xl font-bold text-pink-400">{step.moves}</span></div><div className="rounded-lg border border-purple-700/50 bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-3"><h3 className="mb-1 flex items-center gap-2 text-xs text-purple-400"><Target className="h-4 w-4" />Best length</h3><span className="text-xl font-bold text-purple-400">{step.bestLength}</span></div></div></section>
          <section className={`${cardClass} mb-6 flex w-full flex-wrap items-end gap-4 rounded-2xl border p-6`}><div className="min-w-48 flex-1"><h2 className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><Target className="h-4 w-4 text-purple-500" />Sum Limit</h2><p className={`text-xs ${mutedClass}`}>Find the longest contiguous range with sum at most the target.</p></div><div className="w-full sm:w-48"><label className={`mb-2 block text-[10px] font-bold uppercase tracking-wider ${mutedClass}`} htmlFor="window-target">Maximum window sum</label><input id="window-target" type="number" min="0" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} className={`w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-purple-500 ${isDark ? "border-white/10 bg-gray-900/50 text-white" : "border-slate-200 bg-slate-50 text-slate-800"}`} /></div><button onClick={generateRandom} className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-500 sm:w-auto">Generate Random Problem</button>{inputError && <p role="alert" className="w-full text-xs text-rose-500">{inputError}</p>}</section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2"><motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`relative flex min-h-128 h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-xl ${cardClass}`}><div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at center, ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} /><div className="relative z-10 mb-5 flex items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-lg font-semibold"><Activity className="h-4 w-4 text-purple-500" />Current Window</h2><p className={`mt-1 text-xs ${mutedClass}`}>Target sum ≤ <strong className="text-purple-500">{target}</strong></p></div><span className="font-mono text-sm text-purple-500">Sum: {step.sum}</span></div><div className="relative z-10 flex flex-1 flex-col justify-center"><div className="mx-auto grid w-full max-w-4xl gap-2" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>{values.map((value, index) => { const inside = index >= step.left && index <= step.right; const best = step.bestLength > 0 && index >= step.bestLeft && index <= step.bestRight; return <motion.div key={`${index}-${value}`} animate={{ y: inside ? -8 : 0, scale: inside ? 1.05 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 22, delay: index * 0.025 }} className="min-w-0 text-center"><div className="mb-2 flex h-7 items-end justify-center text-[9px] font-black uppercase text-purple-500">{index === step.left ? "L" : ""}{index === step.right ? "R" : ""}</div><div className={`flex aspect-square items-center justify-center rounded-xl border-2 font-mono text-lg font-bold shadow-lg transition-colors md:text-2xl ${inside ? best ? "border-emerald-400 bg-emerald-600 text-white" : "border-purple-400 bg-purple-600 text-white" : isDark ? "border-slate-700 bg-slate-800 text-slate-500" : "border-slate-200 bg-white text-slate-400"}`}>{value}</div><div className={`mt-2 text-[10px] ${mutedClass}`}>{index}</div></motion.div>; })}</div><div className="mt-8 flex justify-center gap-6 text-xs"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-500" />Active window</span><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" />Best window</span></div></div><div className={`relative z-10 mt-8 flex min-h-12 items-center gap-3 rounded-lg border px-4 py-3 text-sm ${step.type === "best" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" : isDark ? "border-white/10 bg-white/5 text-gray-300" : "border-slate-200 bg-white/80 text-slate-600"}`}>{step.type === "best" ? <CheckCircle2 size={18} /> : <Info size={18} className="shrink-0 text-purple-500" />}{step.message}</div></motion.section></div>
            <div className="lg:col-span-1"><SortingControls isFinished={isFinished} isPaused={!isPlaying} isSorting={isPlaying} currentStep={currentStep} totalSteps={steps.length} speed={speed} customInput={valuesInput} sortOrder="ascending" onTogglePlay={togglePlay} onStepBack={stepBack} onStepForward={stepForward} onReset={reset} onExample={loadExample} onToggleOrder={() => {}} onSpeedChange={setSpeed} onCustomInputChange={setValuesInput} onApplyCustom={applyCustom} isDark={isDark} showOrderToggle={false} /><section className={`${cardClass} mt-6 rounded-2xl border p-6`}><h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><BarChart3 className="h-4 w-4 text-purple-500" />Window Complexity</h2><p className="font-mono text-xl font-black text-purple-500">O(n) time · O(1) space</p><p className={`mt-2 text-xs ${mutedClass}`}>Each value enters and leaves the window at most once.</p></section></div>
          </div>
          <div className="mt-6 w-full"><SortingLogView steps={logSteps} currentStep={currentStep} goToStep={goToStep} isDark={isDark} /></div>
        </div>}
        {activeTab === "explanation" && <SlidingWindowExplanation isDark={isDark} />}
        {activeTab === "code" && <PremiumCodeReference codeData={CODE} complexity={{ time: "O(n)", space: "O(1)", stable: "Nonnegative values required" }} isDark={isDark} />}
        {activeTab === "quiz" && <QuizArena algoKey={ALGORITHM_KEY} isDark={isDark} onMasteryComplete={() => navigate("/dashboard")} />}
      </div>
      <footer className={`mt-16 flex w-full items-center justify-center gap-2 border-t py-5 text-xs ${mutedClass}`}><CircleHelp size={14} /> Sliding window visualizer <span>·</span><Trophy size={14} /> {isFinished ? "Problem complete" : "Progress is saved on completion"}</footer>
    </main>
  </div>;
};

export default SlidingWindow;