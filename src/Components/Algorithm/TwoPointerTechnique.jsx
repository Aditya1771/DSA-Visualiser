import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Activity, ArrowLeftRight, ArrowUpDown, BarChart3, BrainCircuit, CheckCircle2, ChevronRight, CircleHelp, Clock, Code2, Copy, Home, Info, Maximize, Pause, Play, RotateCcw, Share2, SkipBack, SkipForward, Target, Trophy, Wand2, XCircle } from "lucide-react";
import { completeAlgorithm } from "../../Stores/authSlice";
import QuizArena from "../Utils/QuizArena";
import GlossyButton from "../Utils/GlossyButton";
import PremiumCodeReference from "../Utils/PremiumCodeReference";
import SortingControls from "../Utils/SortingControls";
import SortingLogView from "../Utils/SortingLogView";

const ALGORITHM_KEY = "Two Pointer-Technique";
const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    x: [0, 50, 0],
    y: [0, -50, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};
const EXAMPLES = [
  { values: [1, 2, 4, 6, 8, 9, 11], target: 13 },
  { values: [-4, -1, 0, 3, 7, 10], target: 6 },
  { values: [2, 3, 5, 7, 9, 12], target: 20 },
];

const CODE = {
  javascript: `function findPairWithSum(numbers, target) {
  // The array must be sorted in ascending order.
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return null;
}

console.log(findPairWithSum([1, 2, 4, 6, 8, 9, 11], 13));`,
  python: `def find_pair_with_sum(numbers, target):
    # The list must be sorted in ascending order.
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return left, right
        if current_sum < target:
            left += 1
        else:
            right -= 1

    return None

print(find_pair_with_sum([1, 2, 4, 6, 8, 9, 11], 13))`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

pair<int, int> findPairWithSum(const vector<int>& numbers, int target) {
    int left = 0;
    int right = static_cast<int>(numbers.size()) - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left, right};
        if (sum < target) ++left;
        else --right;
    }
    return {-1, -1};
}`,
};

const EXPLANATION_WALKTHROUGH = [
  { title: "Initial state", left: 0, right: 6, sum: null, type: "start", text: "Start at both ends of the sorted array: left points to 1 and right points to 11." },
  { title: "Compare the endpoints", left: 0, right: 6, sum: 12, type: "compare", text: "1 + 11 = 12, which is below the target 13. Every pair using 1 and a value to its right is also too small, so discard 1 by moving left." },
  { title: "Move the left pointer", left: 1, right: 6, sum: null, type: "move", text: "Left advances to index 1, where the value is 2. Right stays at index 6, where the value is 11." },
  { title: "Find the target pair", left: 1, right: 6, sum: 13, type: "found", text: "2 + 11 = 13. The target pair is found at indices 1 and 6." },
];

const PointerWalkthrough = ({ item, isDark }) => {
  const values = [1, 2, 4, 6, 8, 9, 11];
  const textColor = isDark ? "text-gray-300" : "text-slate-600";
  return (
    <div className={`flex flex-col items-center gap-4 rounded-lg p-4 ${isDark ? "bg-gray-900/40" : "bg-slate-100"}`}>
      <p className={`w-full text-center text-sm ${textColor}`}>{item.text}</p>
      <div className="flex max-w-full flex-wrap items-end justify-center gap-2 sm:gap-3">
        {values.map((value, index) => {
          const isLeft = item.left === index;
          const isRight = item.right === index;
          const isPair = item.type === "found" && (isLeft || isRight);
          const isComparing = item.type === "compare" && (isLeft || isRight);
          const tileStyle = isPair
            ? "border-emerald-400 bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            : isComparing
              ? "border-amber-300 bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
              : isLeft
                ? "border-purple-400 bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                : isRight
                  ? "border-pink-400 bg-gradient-to-br from-pink-500 to-rose-600 text-white"
                  : isDark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-slate-200 bg-white text-slate-700";
          return (
            <motion.div key={index} animate={{ y: isLeft || isRight ? -5 : 0, scale: isPair ? 1.08 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex w-10 flex-col items-center gap-2 sm:w-12">
              <span className="h-4 text-[9px] font-black uppercase">{isLeft && <span className="text-purple-500">L</span>}{isRight && <span className="text-pink-500">R</span>}</span>
              <span className={`flex aspect-square w-full items-center justify-center rounded-xl border-2 text-base font-bold shadow-md ${tileStyle}`}>{value}</span>
              <span className={`text-[10px] ${textColor}`}>{index}</span>
            </motion.div>
          );
        })}
      </div>
      {item.sum !== null && <p className={`font-mono text-sm font-bold ${item.type === "found" ? "text-emerald-500" : "text-amber-500"}`}>Current sum: {values[item.left]} + {values[item.right]} = {item.sum}</p>}
    </div>
  );
};

const PointerComplexityGraph = ({ isDark }) => {
  const [hoverData, setHoverData] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [size, setSize] = useState({ width: 600, height: 400 });
  const graphRef = useRef(null);
  const maxN = 25;
  const maxOperations = 30;
  const padding = { top: 40, right: 135, bottom: 50, left: 60 };

  useEffect(() => {
    if (!graphRef.current) return undefined;
    const resize = () => setSize({ width: graphRef.current.offsetWidth, height: graphRef.current.offsetHeight });
    const observer = new ResizeObserver(resize);
    observer.observe(graphRef.current);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!graphRef.current) return undefined;
    const observer = new IntersectionObserver((entries) => setAnimate(entries[0].isIntersecting), { threshold: 0.3 });
    observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const nToX = (n) => padding.left + ((n - 1) / (maxN - 1)) * (width - padding.left - padding.right);
  const opsToY = (operations) => height - padding.bottom - (operations / maxOperations) * (height - padding.top - padding.bottom);
  const xToN = (x) => Math.round(1 + ((x - padding.left) / (width - padding.left - padding.right)) * (maxN - 1));
  const createPath = (operationCount) => {
    const points = Array.from({ length: maxN }, (_, index) => `${nToX(index + 1)},${opsToY(operationCount(index + 1))}`);
    return `M ${points.join(" L ")}`;
  };
  const handleMouseMove = (event) => {
    if (!graphRef.current) return;
    const rect = graphRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const y = ((event.clientY - rect.top) / rect.height) * height;
    if (x < padding.left || x > width - padding.right || y < padding.top || y > height - padding.bottom) {
      setHoverData(null);
      return;
    }
    const n = Math.max(1, Math.min(maxN, xToN(x)));
    setHoverData({ n, best: 1, average: Math.ceil(n / 2), worst: n - 1, x: nToX(n) });
  };

  const axisColor = isDark ? "white" : "#475569";
  const gridColor = isDark ? "#4b5563" : "#cbd5e1";
  const textColor = isDark ? "#d1d5db" : "#475569";
  const containerClass = isDark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-slate-200 shadow-xl";

  return (
    <div className={`${containerClass} relative rounded-2xl border p-4`}>
      <p className={`mb-3 text-center text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>Hover over the chart to inspect comparison counts at each input size.</p>
      <div ref={graphRef} className="relative h-[450px] w-full cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Best, average, and worst case comparisons for the two-pointer search">
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          {[0, 5, 10, 15, 20, 25, 30].map((tick) => <g key={tick}>
            <text x={padding.left - 10} y={opsToY(tick) + 4} textAnchor="end" className="text-xs" fill={textColor}>{tick}</text>
            <line x1={padding.left} y1={opsToY(tick)} x2={width - padding.right} y2={opsToY(tick)} stroke={gridColor} strokeDasharray="3 3" />
          </g>)}
          <text x={padding.left + (width - padding.left - padding.right) / 2} y={height - 10} textAnchor="middle" className="text-sm font-medium" fill={textColor}>Input Size (n)</text>
          <path d={createPath(() => 1)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
          <path d={createPath((n) => Math.ceil(n / 2))} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }} />
          <path d={createPath((n) => n - 1)} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 1s" }} />
          <text x={nToX(maxN) + 6} y={opsToY(1) + 4} textAnchor="start" className="fill-green-500 text-xs">Best O(1)</text>
          <text x={nToX(maxN) + 6} y={opsToY(Math.ceil(maxN / 2)) + 4} textAnchor="start" className="fill-blue-500 text-xs">Typical O(n)</text>
          <text x={nToX(maxN) + 6} y={opsToY(maxN - 1) + 4} textAnchor="start" className="fill-red-500 text-xs">Worst O(n)</text>
          {hoverData && <g>
            <line x1={hoverData.x} y1={padding.top} x2={hoverData.x} y2={height - padding.bottom} stroke={axisColor} strokeDasharray="4 4" opacity="0.6" />
            {[{ y: opsToY(hoverData.best), color: "#22c55e" }, { y: opsToY(hoverData.average), color: "#3b82f6" }, { y: opsToY(hoverData.worst), color: "#ef4444" }].map((point, index) => <circle key={index} cx={hoverData.x} cy={point.y} r="5" fill={point.color} stroke="white" strokeWidth="1.5" className="transition-all duration-300 ease-out" />)}
            {(() => {
              const boxWidth = 148;
              const boxHeight = 82;
              let tooltipX = hoverData.x + 15;
              let tooltipY = opsToY(hoverData.worst) - boxHeight - 10;
              if (tooltipX + boxWidth > width - padding.right) tooltipX = hoverData.x - boxWidth - 15;
              tooltipX = Math.max(padding.left, tooltipX);
              if (tooltipY < padding.top) tooltipY = opsToY(hoverData.best) + 15;
              if (tooltipY + boxHeight > height - padding.bottom) tooltipY = height - padding.bottom - boxHeight;
              return <g transform={`translate(${tooltipX}, ${tooltipY})`} className="transition-transform duration-100 ease-out">
                <rect width={boxWidth} height={boxHeight} rx="6" fill={isDark ? "black" : "white"} stroke={isDark ? "#374151" : "#cbd5e1"} opacity="0.95" />
                <text x="8" y="18" className="text-xs" fill={textColor}>n = {hoverData.n}</text>
                <text x="8" y="36" className="fill-green-500 text-xs">Best: {hoverData.best}</text>
                <text x="8" y="54" className="fill-blue-500 text-xs">Typical: {hoverData.average}</text>
                <text x="8" y="72" className="fill-red-500 text-xs">Worst: {hoverData.worst}</text>
              </g>;
            })()}
          </g>}
        </svg>
      </div>
      <div className={`flex flex-wrap justify-center gap-6 text-xs font-medium ${isDark ? "text-gray-300" : "text-slate-600"}`}>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" />Best case O(1)</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500" />Typical case O(n)</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" />Worst case O(n)</span>
      </div>
    </div>
  );
};

const TwoPointerExplanation = ({ isDark }) => {
  const sectionClass = `${isDark ? "bg-[#0A0A0A]/60 border-white/5" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"} rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/20 md:p-8`;
  const titleClass = isDark ? "text-gray-200" : "text-slate-800";
  const textClass = isDark ? "text-gray-300" : "text-slate-600";
  const listClass = isDark ? "text-gray-400" : "text-slate-500";
  const innerClass = isDark ? "bg-gray-900/50 border-gray-700" : "bg-slate-50 border-slate-200";

  return (
    <section className={`${textClass} animate-fadeIn`}>
      <div className="mx-auto max-w-6xl space-y-12">
        <article className={sectionClass}>
          <h2 className="mb-4 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-center text-2xl font-bold text-transparent"><ArrowLeftRight className="h-6 w-6 text-purple-400" />What Is the Two-Pointer Technique?</h2>
          <p className="text-center text-sm leading-relaxed">The two-pointer technique uses two indices to inspect a collection efficiently. For pair sum, one pointer begins at the smallest value and one at the largest in a sorted array. Their sum tells us which pointer to move, shrinking the remaining search space without checking every pair. It is a general problem-solving pattern, not a single algorithm: pointers can also move at different speeds, track a window, or traverse linked structures.</p>
        </article>

        <article className={sectionClass}>
          <h3 className={`mb-6 flex items-center justify-center gap-3 text-lg font-bold ${titleClass}`}><Wand2 className="h-5 w-5 text-purple-400" />How It Works: A Detailed Walkthrough</h3>
          <div className="space-y-4">
            {EXPLANATION_WALKTHROUGH.map((item, index) => <div key={item.title}>
              <h4 className={`mb-2 text-center text-base font-semibold ${item.type === "found" ? "text-green-500" : "text-purple-400"}`}>{String(index + 1).padStart(2, "0")} · {item.title}</h4>
              <PointerWalkthrough item={item} isDark={isDark} />
            </div>)}
          </div>
        </article>

        <article className={sectionClass}>
          <h3 className={`mb-4 flex items-center gap-3 text-lg font-bold ${titleClass}`}><Code2 className="h-5 w-5 text-purple-400" />The Algorithm, Step by Step</h3>
          <ol className={`list-inside list-decimal space-y-4 text-sm leading-relaxed ${textClass}`}>
            <li><strong>Meet the precondition.</strong><ul className={`mt-2 list-inside list-disc space-y-1 pl-6 ${listClass}`}><li>The array must be sorted in ascending order for the pointer decisions to be valid.</li><li>If sorting is needed, include its O(n log n) cost in the total complexity.</li></ul></li>
            <li><strong>Initialize the pointers.</strong><ul className={`mt-2 list-inside list-disc space-y-1 pl-6 ${listClass}`}><li>Set <code>left = 0</code> and <code>right = n - 1</code>, so the pointers begin at opposite ends.</li></ul></li>
            <li><strong>Compare while the pointers have not met.</strong><ul className={`mt-2 list-inside list-disc space-y-1 pl-6 ${listClass}`}><li>Compute <code>sum = values[left] + values[right]</code>.</li><li>If the sum equals the target, return the pair.</li><li>If the sum is too small, increment <code>left</code>; increasing the smaller value is the only useful direction.</li><li>If the sum is too large, decrement <code>right</code>; decreasing the larger value is the only useful direction.</li></ul></li>
            <li><strong>Stop when the search space is exhausted.</strong><ul className={`mt-2 list-inside list-disc space-y-1 pl-6 ${listClass}`}><li>When <code>left &gt;= right</code>, every candidate pair has been ruled out; return “not found.”</li><li>Use distinct indices when the pair must contain two separate array elements.</li></ul></li>
          </ol>
          <div className={`mt-6 rounded-lg border p-4 ${innerClass}`}><h4 className="font-bold">Why each move is safe</h4><p className={`mt-2 text-sm leading-relaxed ${listClass}`}>Because the values are ordered, the current left value plus any value at or before the current right pointer cannot exceed the current sum. If that sum is too small, the current left value cannot form a solution with any remaining right-side value. The too-large case is symmetric.</p></div>
        </article>

        <article className={sectionClass}>
          <h3 className={`mb-6 flex items-center gap-3 text-lg font-bold ${titleClass}`}><BarChart3 className="h-5 w-5 text-purple-400" />Complexity Analysis</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className={`md:col-span-2 rounded-lg border p-6 ${innerClass}`}>
              <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-purple-400"><Clock className="h-5 w-5" />Time Complexity</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-md bg-green-800/20 p-3 text-center"><p className="text-lg font-bold text-green-400">O(1)</p><p className="text-xs text-green-500">Best case</p><p className={`mt-1 text-[10px] ${listClass}`}>The first endpoint pair matches.</p></div>
                <div className="rounded-md bg-orange-800/20 p-3 text-center"><p className="text-lg font-bold text-orange-400">O(n)</p><p className="text-xs text-orange-500">Average case</p><p className={`mt-1 text-[10px] ${listClass}`}>Each comparison moves one pointer inward.</p></div>
                <div className="rounded-md bg-red-800/20 p-3 text-center"><p className="text-lg font-bold text-red-400">O(n)</p><p className="text-xs text-red-500">Worst case</p><p className={`mt-1 text-[10px] ${listClass}`}>At most n − 1 comparisons for a sorted input.</p></div>
              </div>
            </div>
            <div className={`rounded-lg border p-6 ${innerClass}`}>
              <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-sky-400"><Maximize className="h-5 w-5" />Space Complexity</h4>
              <div className="rounded-md bg-sky-800/20 p-3 text-center"><p className="text-lg font-bold text-sky-400">O(1)</p><p className="text-xs text-sky-500">Auxiliary space</p><p className={`mt-1 text-[10px] ${listClass}`}>The scan stores only two indices and a sum.</p></div>
            </div>
          </div>
          <p className={`mt-4 text-xs leading-relaxed ${listClass}`}>These bounds describe the scan after sorting. Sorting an unsorted input takes O(n log n) time; the sorting operation may also require additional memory depending on the implementation.</p>
        </article>

        <article className={sectionClass}>
          <h3 className={`mb-6 flex items-center justify-center gap-3 text-lg font-bold ${titleClass}`}><Activity className="h-5 w-5 text-purple-400" />Interactive Performance Graph</h3>
          <PointerComplexityGraph isDark={isDark} />
        </article>

        <article className={sectionClass}>
          <h3 className={`mb-6 flex items-center gap-3 text-lg font-bold ${titleClass}`}><ArrowUpDown className="h-5 w-5 text-purple-400" />Pros &amp; Cons</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className={`rounded-lg border-l-4 border-green-500 p-6 ${innerClass}`}><h4 className="mb-4 text-base font-semibold text-green-500">Advantages</h4><ul className={`space-y-3 text-sm ${textClass}`}><li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /><span><strong>Linear scan:</strong> Reduces pair checking from quadratic to O(n) once data is sorted.</span></li><li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /><span><strong>Memory efficient:</strong> Uses only a constant number of extra variables.</span></li><li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /><span><strong>Easy to trace:</strong> Every pointer movement follows directly from the ordering invariant.</span></li></ul></div>
            <div className={`rounded-lg border-l-4 border-red-500 p-6 ${innerClass}`}><h4 className="mb-4 text-base font-semibold text-red-500">Limitations</h4><ul className={`space-y-3 text-sm ${textClass}`}><li className="flex items-start gap-3"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><span><strong>Needs sorted values:</strong> Sorting first can dominate the total runtime when the input is unsorted.</span></li><li className="flex items-start gap-3"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><span><strong>Ordering is essential:</strong> The pair-sum pointer decisions are not correct for arbitrary unsorted arrays.</span></li><li className="flex items-start gap-3"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><span><strong>Not a universal recipe:</strong> Pointer movement rules must be justified for each problem’s constraints.</span></li></ul></div>
          </div>
        </article>
      </div>
    </section>
  );
};

const createInitialStep = (values, target) => {
  const sorted = [...values].sort((a, b) => a - b);
  const algorithmState = { left: 0, right: sorted.length - 1, comparisons: 0, moves: 0, nextAction: "compare" };
  return {
    type: "start",
    ...algorithmState,
    algorithmState,
    arrState: sorted.map((value) => ({ value })),
    highlights: [],
    sorted: [],
    comparisons: 0,
    moves: 0,
    message: `Sorted input is ready. Find two values that add up to ${target}.`,
  };
};

const TwoPointerTechnique = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [valuesInput, setValuesInput] = useState("1, 2, 4, 6, 8, 9, 11");
  const [targetInput, setTargetInput] = useState("13");
  const [values, setValues] = useState(EXAMPLES[0].values);
  const [target, setTarget] = useState(EXAMPLES[0].target);
  const [steps, setSteps] = useState(() => [createInitialStep(EXAMPLES[0].values, EXAMPLES[0].target)]);
  const [algorithmState, setAlgorithmState] = useState(() => ({ left: 0, right: EXAMPLES[0].values.length - 1, comparisons: 0, moves: 0, nextAction: "compare" }));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(55);
  const [activeTab, setActiveTab] = useState("visualization");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [inputError, setInputError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const completedRef = useRef(false);
  const sorted = useMemo(() => [...values].sort((a, b) => a - b), [values]);
  const logSteps = useMemo(() => steps.map((item) => ({
    ...item,
    type: item.type === "found" ? "sorted" : item.type === "move" ? "pass" : item.type,
    highlights: item.left !== undefined && item.right !== undefined && item.type !== "found" ? [item.left, item.right] : [],
    sorted: item.type === "found" ? [item.left, item.right] : [],
  })), [steps]);
  const step = steps[currentStep] || steps[0];
  const isFinished = step.type === "found" || step.type === "finish";
  const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 text-slate-100 backdrop-blur-md" : "bg-white/80 border-slate-200 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const mutedClass = isDark ? "text-gray-400" : "text-slate-500";

  const appendStep = (entry, nextState) => {
    const nextSteps = steps.slice(0, currentStep + 1);
    nextSteps.push({
      ...entry,
      algorithmState: nextState,
      arrState: sorted.map((value) => ({ value })),
      highlights: entry.type === "found" ? [] : [entry.left, entry.right].filter((index) => index >= 0),
      sorted: entry.type === "found" ? [entry.left, entry.right] : [],
    });
    setSteps(nextSteps);
    setCurrentStep(nextSteps.length - 1);
    setAlgorithmState(nextState);
  };

  const runNextStep = () => {
    const { left, right, comparisons, moves, nextAction } = algorithmState;
    if (nextAction === "done") {
      setIsPlaying(false);
      return;
    }

    if (nextAction === "found") {
      appendStep({
        type: "found", left, right, sum: target, comparisons, moves,
        message: `Pair found: ${sorted[left]} + ${sorted[right]} = ${target}.`,
      }, { ...algorithmState, nextAction: "done" });
      return;
    }

    if (nextAction === "moveLeft") {
      const nextLeft = left + 1;
      const nextState = { left: nextLeft, right, comparisons, moves: moves + 1, nextAction: "compare" };
      appendStep({
        type: "move", left: nextLeft, right, comparisons, moves: moves + 1,
        message: `Move left to index ${nextLeft} (value ${sorted[nextLeft]}).`,
      }, nextState);
      return;
    }

    if (nextAction === "moveRight") {
      const nextRight = right - 1;
      const nextState = { left, right: nextRight, comparisons, moves: moves + 1, nextAction: "compare" };
      appendStep({
        type: "move", left, right: nextRight, comparisons, moves: moves + 1,
        message: `Move right to index ${nextRight} (value ${sorted[nextRight]}).`,
      }, nextState);
      return;
    }

    if (left >= right) {
      appendStep({
        type: "finish", left, right, comparisons, moves,
        message: "No pair adds up to the target. The pointers have met, so the search is complete.",
      }, { ...algorithmState, nextAction: "done" });
      return;
    }

    const sum = sorted[left] + sorted[right];
    const followingAction = sum === target ? "found" : sum < target ? "moveLeft" : "moveRight";
    const nextState = { left, right, comparisons: comparisons + 1, moves, nextAction: followingAction };
    appendStep({
      type: "compare", left, right, sum, comparisons: comparisons + 1, moves,
      message: `${sorted[left]} + ${sorted[right]} = ${sum}. ${sum === target ? "That matches the target." : sum < target ? "The sum is too small; move the left pointer right." : "The sum is too large; move the right pointer left."}`,
    }, nextState);
  };

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (isFinished) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(runNextStep, 1050 - Number(speed) * 10);
    return () => window.clearTimeout(timer);
  }, [isPlaying, isFinished, speed, currentStep, steps, algorithmState]);

  useEffect(() => {
    if (!isFinished || completedRef.current || !isAuthenticated || currentStep === 0) return;
    completedRef.current = true;
    dispatch(completeAlgorithm(ALGORITHM_KEY)).unwrap().catch((error) => console.error("Progress sync failed:", error));
  }, [isFinished, isAuthenticated, dispatch, currentStep]);

  const loadProblem = (nextValues, nextTarget, message) => {
    const sortedValues = [...nextValues].sort((a, b) => a - b);
    const initialStep = createInitialStep(sortedValues, nextTarget);
    setValues(sortedValues);
    setTarget(nextTarget);
    setValuesInput(nextValues.join(", "));
    setTargetInput(String(nextTarget));
    setSteps([initialStep]);
    setAlgorithmState(initialStep.algorithmState);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputError("");
    completedRef.current = false;
    if (message) setInputError(message);
  };

  const applyCustomProblem = () => {
    const parsed = valuesInput.split(/[\s,]+/).filter(Boolean).map(Number);
    const parsedTarget = Number(targetInput);
    if (parsed.length < 2 || parsed.length > 14 || parsed.some((value) => !Number.isInteger(value)) || !targetInput.trim() || !Number.isInteger(parsedTarget)) {
      setInputError("Enter 2 to 14 whole numbers and a whole-number target.");
      return;
    }
    loadProblem(parsed, parsedTarget);
  };

  const reset = () => {
    const initialStep = createInitialStep(values, target);
    setSteps([initialStep]);
    setAlgorithmState(initialStep.algorithmState);
    setCurrentStep(0);
    setIsPlaying(false);
    completedRef.current = false;
  };
  const stepBackward = () => {
    setIsPlaying(false);
    setCurrentStep((current) => Math.max(current - 1, 0));
  };
  const stepForward = () => {
    setIsPlaying(false);
    setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
  };
  const goToStep = (index) => {
    const selectedStep = steps[index];
    if (!selectedStep) return;
    setIsPlaying(false);
    setCurrentStep(index);
    setAlgorithmState(selectedStep.algorithmState);
  };
  const togglePlay = () => {
    if (isFinished) return;
    setIsPlaying((playing) => !playing);
  };
  const loadExample = () => {
    const next = EXAMPLES[exampleIndex % EXAMPLES.length];
    setExampleIndex((index) => index + 1);
    loadProblem(next.values, next.target);
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyLabel("Copied!");
      window.setTimeout(() => setCopyLabel("Copy"), 2000);
    } catch (error) {
      console.error("Could not copy visualizer link:", error);
    }
  };
  const share = () => {
    if (navigator.share) {
      navigator.share({ title: "Two Pointers Visualizer", text: "Explore the two-pointer pair-sum technique.", url: window.location.href });
    } else {
      window.alert("Web Share is unavailable. Use Copy to copy the visualizer link.");
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 selection:bg-purple-500 selection:text-white ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`} style={{ backgroundImage: `linear-gradient(${isDark ? "#333" : "#cbd5e1"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "#333" : "#cbd5e1"} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] h-[500px] w-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center p-4 md:p-8">
        <header className="relative mb-8 mt-15 w-full animate-fadeIn py-10">
          <div className="relative flex flex-col md:flex-row md:items-start md:justify-center">
            <div className="mb-6 md:absolute md:left-0 md:top-1 md:mb-0">
              <nav className={`flex items-center gap-2 text-sm font-medium ${mutedClass}`} aria-label="Breadcrumb">
                <a href="/" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? "hover:text-white" : "hover:text-purple-600"}`}><Home className="h-4 w-4" /><span className="hidden sm:inline">Home</span></a>
                <ChevronRight className={`h-4 w-4 ${isDark ? "text-gray-600" : "text-slate-300"}`} />
                <a href="/algorithms" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? "hover:text-white" : "hover:text-purple-600"}`}><span className="hidden sm:inline">Dashboard</span></a>
                <ChevronRight className={`h-4 w-4 ${isDark ? "text-gray-600" : "text-slate-300"}`} />
                <div className={`flex cursor-default items-center gap-2 rounded-lg border px-3 py-1 backdrop-blur-md ${isDark ? "border-white/10 bg-white/5 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" : "border-slate-200 bg-white/60 text-slate-700 shadow-sm"}`}>
                  <Target className={`h-4 w-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} /><span className="font-semibold">Two Pointers</span>
                </div>
              </nav>
            </div>
            <div className="w-full text-center">
              <div className={`mb-3 inline-block rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm ${isDark ? "border-green-400/20 bg-green-400/10 text-green-400" : "border-green-200 bg-green-50 text-green-600"}`}>Array Technique</div>
              <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">Two Pointers Visualizer</h1>
              <p className={`mx-auto mt-4 max-w-2xl text-sm md:text-base ${mutedClass}`}>Watch two indices close in on a target pair in a sorted array, one deliberate move at a time.</p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <GlossyButton onClick={copyLink} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Copy className="h-4 w-4" /><span>{copyLabel}</span></GlossyButton>
                <GlossyButton onClick={share} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Share2 className="h-4 w-4" /><span>Share</span></GlossyButton>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 w-full space-y-6">
        <div className={`flex w-full gap-1 overflow-x-auto border-b ${isDark ? "border-gray-700" : "border-slate-200"}`} role="tablist">
          {[["visualization", "Visualization"], ["explanation", "Explanation"], ["code", "Code"], ["quiz", "Mastery Arena"]].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === id ? "border-purple-500 text-purple-500" : `border-transparent ${isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-purple-600"}`} `}>
              {id === "quiz" && <BrainCircuit className="mr-2 inline" size={15} />}{label}
            </button>
          ))}
        </div>

        {activeTab === "visualization" && <div className="w-full animate-fadeIn">
          <section className={`${cardClass} mb-6 w-full rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/20`}>
            <h2 className={`mb-4 flex items-center gap-2 text-lg font-semibold ${isDark ? "text-gray-300" : "text-slate-700"}`}><BarChart3 className="h-4 w-4" />Complexity Analysis</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-indigo-700/50 bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3"><h3 className="mb-1 flex items-center gap-2 text-xs text-indigo-400"><ArrowUpDown className="h-4 w-4" />Comparisons</h3><span className="text-xl font-bold text-indigo-400">{step.comparisons}</span></div>
              <div className="rounded-lg border border-pink-700/50 bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3"><h3 className="mb-1 flex items-center gap-2 text-xs text-pink-400"><ArrowLeftRight className="h-4 w-4" />Pointer moves</h3><span className="text-xl font-bold text-pink-400">{step.moves}</span></div>
              <div className="rounded-lg border border-purple-700/50 bg-gradient-to-br from-purple-600/20 to-purple-800/40 p-3"><h3 className="mb-1 flex items-center gap-2 text-xs text-purple-400"><Target className="h-4 w-4" />Active range</h3><span className="text-xl font-bold text-purple-400">{Math.max(0, step.right - step.left + 1)} elements</span></div>
            </div>
          </section>
          <section className={`${cardClass} mb-6 flex w-full flex-wrap items-end gap-4 rounded-2xl border p-6`}>
            <div className="min-w-48 flex-1">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><Target className="h-4 w-4 text-purple-500" />Target Sum</h2>
              <p className={`text-xs ${mutedClass}`}>Find two values in the sorted array that add up to the target.</p>
            </div>
            <div className="w-full sm:w-48">
              <label className={`mb-2 block text-[10px] font-bold uppercase tracking-wider ${mutedClass}`} htmlFor="pointer-target">Target value</label>
              <input id="pointer-target" type="number" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition focus:border-purple-500 ${isDark ? "border-white/10 bg-gray-900/50 text-white" : "border-slate-200 bg-slate-50 text-slate-800"}`} />
            </div>
            <button onClick={() => { const randomValues = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) - 5).sort((a, b) => a - b); const randomTarget = randomValues[1] + randomValues[5]; loadProblem(randomValues, randomTarget); }} className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-500 transition hover:bg-purple-500/20 sm:w-auto">Generate Random Problem</button>
            {inputError && <p role="alert" className="w-full text-xs text-rose-500">{inputError}</p>}
          </section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`relative flex min-h-128 h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-xl ${cardClass}`}>
                <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at center, ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
                <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div><h2 className="flex items-center gap-2 text-lg font-semibold"><Target className="h-4 w-4 text-purple-500" />Pair Sum Search</h2><p className={`mt-1 text-xs ${mutedClass}`}>Sorted input · target <strong className="text-purple-500">{target}</strong></p></div>
                </div>
                <div className="relative z-10 flex flex-1 flex-col justify-center">
                  <div className="mb-8 flex items-center justify-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${mutedClass}`}>Target Sum</span>
                    <span className={`rounded-lg border px-4 py-2 font-mono text-xl font-black ${isDark ? "border-purple-500/40 bg-purple-500/10 text-purple-300" : "border-purple-200 bg-purple-50 text-purple-700"}`}>{target}</span>
                  </div>
                  <div className="mx-auto grid w-full max-w-4xl gap-2" style={{ gridTemplateColumns: `repeat(${sorted.length}, minmax(0, 1fr))` }}>
                    {sorted.map((value, index) => {
                      const isLeft = index === step.left;
                      const isRight = index === step.right;
                      const found = step.type === "found" && (isLeft || isRight);
                      const comparing = step.type === "compare" && (isLeft || isRight);
                      const active = (isLeft || isRight) && step.left < step.right;
                      const eliminated = step.left >= step.right || index < step.left || index > step.right;
                      const tileClass = found
                        ? "bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/30"
                        : comparing
                          ? "bg-amber-500 border-amber-300 text-white shadow-amber-500/30"
                          : active && isLeft
                            ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/30"
                            : active && isRight
                              ? "bg-pink-600 border-pink-400 text-white shadow-pink-500/30"
                              : eliminated
                                ? isDark ? "bg-slate-900/50 border-slate-800 text-slate-600" : "bg-slate-100 border-slate-200 text-slate-400"
                                : isDark ? "bg-slate-800 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-700";
                      return <motion.div key={`${index}-${value}`} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: active ? -8 : 0, scale: active || found ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 22, delay: index * 0.025 }} className="min-w-0 text-center">
                        <div className="mb-2 flex h-8 items-end justify-center gap-1 text-[10px] font-black uppercase">{isLeft && <span className="text-purple-500">L</span>}{isRight && <span className="text-pink-500">R</span>}</div>
                        <div className={`flex aspect-square items-center justify-center rounded-xl border-2 font-mono text-lg font-bold shadow-lg transition-colors duration-300 md:text-2xl ${tileClass}`}>{value}</div>
                        <div className={`mt-2 text-[10px] font-mono ${mutedClass}`}>{index}</div>
                      </motion.div>;
                    })}
                  </div>
                  {step.sum !== undefined && <motion.div key={`${step.left}-${step.right}-${step.sum}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center font-mono text-base"><span className="text-purple-500">{sorted[step.left]}</span> + <span className="text-pink-500">{sorted[step.right]}</span> = <strong className={step.sum === target ? "text-emerald-500" : "text-amber-500"}>{step.sum}</strong></motion.div>}
                </div>
                <div className={`relative z-10 mt-8 flex min-h-12 items-center gap-3 rounded-lg border px-4 py-3 text-sm ${step.type === "found" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" : step.type === "finish" ? "border-teal-500/40 bg-teal-500/10 text-teal-500" : isDark ? "border-white/10 bg-white/5 text-gray-300" : "border-slate-200 bg-white/80 text-slate-600"}`}>
                  {step.type === "found" ? <CheckCircle2 size={18} /> : <Info size={18} className="shrink-0 text-purple-500" />}{step.message}
                </div>
                <div className={`relative z-10 mt-5 flex flex-wrap justify-center gap-6 text-xs font-medium ${mutedClass}`}>
                  <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-500" />Left pointer</span>
                  <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-pink-500" />Right pointer</span>
                  <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" />Comparing</span>
                  <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" />Pair found</span>
                </div>
              </motion.section>
            </div>

            <div className="lg:col-span-1">
              <SortingControls
                isFinished={isFinished}
                isPaused={!isPlaying}
                isSorting={isPlaying}
                currentStep={currentStep}
                totalSteps={steps.length}
                speed={speed}
                customInput={valuesInput}
                sortOrder="ascending"
                onTogglePlay={togglePlay}
                onStepBack={stepBackward}
                onStepForward={stepForward}
                onReset={reset}
                onExample={loadExample}
                onToggleOrder={() => {}}
                onSpeedChange={setSpeed}
                onCustomInputChange={setValuesInput}
                onApplyCustom={applyCustomProblem}
                isDark={isDark}
                showOrderToggle={false}
              />
            </div>
          </div>
          <div className="mt-6 w-full">
            <SortingLogView steps={logSteps} currentStep={currentStep} goToStep={goToStep} isDark={isDark} />
          </div>
        </div>}

        {activeTab === "explanation" && <TwoPointerExplanation isDark={isDark} />}
        {activeTab === "code" && <PremiumCodeReference codeData={CODE} complexity={{ time: "O(n) search", space: "O(1)", stable: "Requires sorted input" }} isDark={isDark} />}
        {activeTab === "quiz" && <QuizArena algoKey={ALGORITHM_KEY} isDark={isDark} onMasteryComplete={() => navigate("/dashboard")} />}
        </div>

        <footer className={`mt-16 flex w-full items-center justify-center gap-2 border-t py-5 text-xs ${mutedClass}`}><CircleHelp size={14} /> Sorted pair-sum visualization <span>·</span><Trophy size={14} /> {isFinished ? "Problem complete" : "Progress is saved on completion"}</footer>
      </main>
    </div>
  );
};

export default TwoPointerTechnique;