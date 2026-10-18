import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Home,
  LayoutGrid,
  Link2,
  Maximize,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  Share2,
  SkipBack,
  SkipForward,
  Trash2,
  Wand2,
  XCircle,
} from "lucide-react";
import GlossyButton from "../Utils/GlossyButton";
import PremiumCodeReference from "../Utils/PremiumCodeReference";
import QuizArena from "../Utils/QuizArena";
import BFSControls from "../Utils/BFSControls";
import BFSLogView from "../Utils/BFSLogView";

const DEFAULT_GRAPH = {
  nodes: ["A", "B", "C", "D", "E", "F", "G"].map((id) => ({ id })),
  edges: [
    { source: "A", target: "B" }, { source: "A", target: "C" },
    { source: "B", target: "D" }, { source: "B", target: "E" },
    { source: "C", target: "F" }, { source: "F", target: "G" },
  ],
};

const positionGraph = (nodes, edges, startNodeId, width, height, graphType) => {
  const adjacency = new Map(nodes.map((node) => [node.id, []]));
  edges.forEach(({ source, target }) => {
    adjacency.get(source)?.push(target);
    if (graphType === "undirected") adjacency.get(target)?.push(source);
  });
  const levels = [];
  const visited = new Set();
  const pending = [{ id: startNodeId || nodes[0]?.id, level: 0 }];
  if (pending[0].id) visited.add(pending[0].id);
  for (let index = 0; index < pending.length; index += 1) {
    const item = pending[index];
    if (!levels[item.level]) levels[item.level] = [];
    levels[item.level].push(item.id);
    adjacency.get(item.id)?.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        pending.push({ id: neighbor, level: item.level + 1 });
      }
    });
  }
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      if (!levels[0]) levels[0] = [];
      levels[0].push(node.id);
    }
  });
  const positions = {};
  levels.forEach((level, levelIndex) => level.forEach((id, nodeIndex) => {
    positions[id] = {
      x: ((nodeIndex + 1) * width) / (level.length + 1),
      y: ((levelIndex + 1) * height) / (levels.length + 1),
    };
  }));
  return nodes.map((node) => ({ ...node, ...(positions[node.id] || { x: width / 2, y: height / 2 }) }));
};

const Breadcrumb = ({ isDark }) => (
  <nav aria-label="Breadcrumb">
    <ol className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
      <li><a href="/" className="flex items-center gap-2 hover:text-purple-500"><Home className="w-4 h-4" /><span className="hidden sm:inline">Home</span></a></li>
      <li><ChevronRight className="w-4 h-4" /></li>
      <li><a href="/algorithms" className="flex items-center gap-2 hover:text-purple-500"><LayoutGrid className="w-4 h-4" /><span className="hidden sm:inline">Dashboard</span></a></li>
      <li><ChevronRight className="w-4 h-4" /></li>
      <li className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white/60 border-slate-200 text-slate-700"}`}><BrainCircuit className="w-4 h-4 text-purple-500" />DFS Visualizer</li>
    </ol>
  </nav>
);

const GraphCanvas = ({ graph, graphRef, graphType, getNodeColor, onCanvasClick, onNodeClick, editMode, isDark }) => {
  const edgeSet = new Set(graph.edges.map((edge) => `${edge.source}->${edge.target}`));
  const getPath = (source, target) => {
    if (!source || !target) return "";
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const reverse = edgeSet.has(`${target.id}->${source.id}`);
    const curve = reverse ? (source.id > target.id ? 36 : -36) : 0;
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    const controlX = midX + curve * (dy / distance);
    const controlY = midY - curve * (dx / distance);
    return `M ${source.x} ${source.y} Q ${controlX} ${controlY} ${target.x} ${target.y}`;
  };

  return (
    <section className={`${isDark ? "bg-[#0A0A0A]/60 border-white/5" : "bg-white/80 border-slate-200 shadow-xl"} rounded-2xl p-6 border h-full`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`flex items-center gap-2 text-lg font-semibold ${isDark ? "text-gray-300" : "text-slate-700"}`}><BarChart3 className="w-4 h-4" />Graph Visualization</h2>
        <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">Depth first</span>
      </div>
      <div ref={graphRef} onClick={onCanvasClick} className={`relative w-full h-[350px] rounded-xl border overflow-hidden ${editMode === "addNode" ? "cursor-crosshair" : "cursor-default"} ${isDark ? "bg-black/20 border-white/5" : "bg-white border-slate-200"}`}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs><marker id="dfs-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#c084fc" /></marker></defs>
          {graph.edges.map((edge, index) => {
            const source = graph.nodes.find((node) => node.id === edge.source);
            const target = graph.nodes.find((node) => node.id === edge.target);
            return <path key={index} d={getPath(source, target)} stroke={isDark ? "#a78bfa" : "#94a3b8"} strokeWidth="2" fill="none" markerEnd={graphType === "directed" ? "url(#dfs-arrow)" : undefined} />;
          })}
        </svg>
        {graph.nodes.map((node) => (
          <motion.button key={node.id} type="button" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={(event) => onNodeClick(event, node.id)} className={`absolute w-10 h-10 md:w-12 md:h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 text-white font-bold shadow-lg ${getNodeColor(node.id)} ${editMode !== "none" ? "cursor-pointer" : "cursor-default"}`} style={{ left: node.x, top: node.y }}>{node.id}</motion.button>
        ))}
      </div>
      <div className={`mt-4 flex flex-wrap justify-center gap-4 text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
        <span><i className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2" />Start</span>
        <span><i className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2" />Visited</span>
        <span><i className="inline-block w-3 h-3 rounded-full bg-pink-500 mr-2" />Stack</span>
        <span><i className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2" />Current</span>
      </div>
    </section>
  );
};

const DFSComplexityDisplay = ({ complexity, isDark }) => {
  const cardClass = isDark
    ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md"
    : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  return (
    <section className={`${cardClass} rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1`}>
      <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${isDark ? "text-gray-300" : "text-slate-700"}`}>
        <BarChart3 className="w-4 h-4" /> Complexity Analysis
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3 rounded-lg border border-indigo-700/50">
          <p className="flex items-center gap-2 text-xs text-indigo-400 mb-1"><BrainCircuit className="w-4 h-4" />Nodes Visited</p>
          <strong className="text-xl text-indigo-400">{complexity.nodesVisited}</strong>
        </div>
        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3 rounded-lg border border-pink-700/50">
          <p className="flex items-center gap-2 text-xs text-pink-400 mb-1"><Link2 className="w-4 h-4" />Edges Traversed</p>
          <strong className="text-xl text-pink-400">{complexity.edgesTraversed}</strong>
        </div>
      </div>
    </section>
  );
};

const StackDisplay = ({ stack, isDark }) => {
  const cardClass = isDark
    ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md"
    : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  return (
    <section className={`${cardClass} rounded-xl p-6 border shadow-lg`}>
      <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${isDark ? "text-gray-300" : "text-slate-700"}`}>
        <Activity className="w-4 h-4" /> Stack
      </h2>
      <div className={`flex items-center gap-3 rounded-xl p-4 min-h-20 overflow-x-auto border ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-slate-50 border-slate-200"}`}>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top</span>
        {stack.length ? [...stack].reverse().map((nodeId, index) => (
          <motion.div key={`${nodeId}-${index}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-br from-pink-500 to-rose-600 border border-pink-400/50 shadow-lg">
            {nodeId}
          </motion.div>
        )) : <span className="text-xs text-gray-500 italic">Stack is empty</span>}
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bottom</span>
      </div>
    </section>
  );
};

const DFSExplanationGraph = ({ isDark }) => {
  const nodes = [
    { id: "A", x: 200, y: 42, state: "start" },
    { id: "B", x: 112, y: 112, state: "visited" },
    { id: "C", x: 288, y: 112, state: "stack" },
    { id: "D", x: 58, y: 188, state: "visited" },
    { id: "E", x: 166, y: 188, state: "unvisited" },
    { id: "F", x: 342, y: 188, state: "unvisited" },
  ];
  const edges = [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"]];
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const fills = {
    start: isDark ? "#6366f1" : "#e0e7ff",
    visited: isDark ? "#16a34a" : "#dcfce7",
    stack: isDark ? "#db2777" : "#fce7f3",
    unvisited: isDark ? "#334155" : "#ffffff",
  };
  const labels = {
    start: isDark ? "#ffffff" : "#4338ca",
    visited: isDark ? "#ffffff" : "#166534",
    stack: isDark ? "#ffffff" : "#9d174d",
    unvisited: isDark ? "#cbd5e1" : "#475569",
  };

  return (
    <div className={`${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"} rounded-2xl border p-4 md:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className={`text-base font-bold ${isDark ? "text-gray-200" : "text-slate-800"}`}>Depth-First Traversal Map</h4>
          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>DFS follows one branch deeply before returning to the stack.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px]">
          {[["start", "Start"], ["visited", "Visited"], ["stack", "Stack"], ["unvisited", "Unvisited"]].map(([state, label]) => (
            <span key={state} className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fills[state] }} />{label}</span>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 400 230" className="w-full h-auto max-h-64" role="img" aria-label="Depth-first search graph showing visited and stacked nodes">
        {edges.map(([source, target]) => <line key={`${source}-${target}`} x1={nodeMap[source].x} y1={nodeMap[source].y} x2={nodeMap[target].x} y2={nodeMap[target].y} stroke={isDark ? "#a78bfa" : "#94a3b8"} strokeWidth="3" />)}
        {nodes.map((node) => <g key={node.id}><circle cx={node.x} cy={node.y} r="24" fill={fills[node.state]} stroke={isDark ? "#ffffff40" : "#cbd5e1"} strokeWidth="2" /><text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={labels[node.state]}>{node.id}</text></g>)}
      </svg>
    </div>
  );
};

const DFSComplexityGraph = ({ isDark }) => {
  const graphRef = useRef(null);
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [animate, setAnimate] = useState(false);
  const [hoverData, setHoverData] = useState(null);
  const maxSize = 25;
  const padding = { top: 40, right: 80, bottom: 50, left: 60 };

  useEffect(() => {
    if (!graphRef.current) return undefined;
    const resize = () => setSize({ width: graphRef.current.offsetWidth, height: graphRef.current.offsetHeight });
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!graphRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => setAnimate(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const toX = (value) => padding.left + ((value - 1) / (maxSize - 1)) * (width - padding.left - padding.right);
  const toY = (value) => height - padding.bottom - (value / maxSize) * (height - padding.top - padding.bottom);
  const pathFor = (fn) => Array.from({ length: maxSize }, (_, index) => `${index ? "L" : "M"} ${toX(index + 1)} ${toY(fn(index + 1))}`).join(" ");
  const onMouseMove = (event) => {
    const bounds = graphRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * width;
    if (x < padding.left || x > width - padding.right) return setHoverData(null);
    const vertices = Math.max(1, Math.min(maxSize, Math.round(1 + ((x - padding.left) / (width - padding.left - padding.right)) * (maxSize - 1))));
    setHoverData({ vertices, x: toX(vertices), traversal: vertices, stack: vertices });
  };
  const axisColor = isDark ? "white" : "#475569";
  const gridColor = isDark ? "#4b5563" : "#cbd5e1";
  const textColor = isDark ? "#d1d5db" : "#475569";
  const cardClass = isDark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-slate-200 shadow-xl";

  return (
    <div className={`${cardClass} p-4 rounded-2xl border relative`}>
      <h3 className={`text-xl font-bold text-center mb-4 ${isDark ? "text-gray-100" : "text-slate-800"}`}>DFS Complexity by Graph Size</h3>
      <div ref={graphRef} className="relative w-full h-[450px] cursor-crosshair" onMouseMove={onMouseMove} onMouseLeave={() => setHoverData(null)}>
        <svg width={width} height={height} role="img" aria-label="DFS time and stack space complexity grow linearly">
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
          {[0, 5, 10, 15, 20, 25].map((value) => <g key={value}><line x1={padding.left} y1={toY(value)} x2={width - padding.right} y2={toY(value)} stroke={gridColor} strokeDasharray="3 3" /><text x={padding.left - 10} y={toY(value) + 4} textAnchor="end" className="text-xs" fill={textColor}>{value}</text></g>)}
          <text x={padding.left + (width - padding.left - padding.right) / 2} y={height - 10} textAnchor="middle" className="font-medium text-sm" fill={textColor}>Graph Size (V + E)</text>
          <path d={pathFor((value) => value)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
          <path d={pathFor((value) => value)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }} />
          <text x={toX(maxSize) + 5} y={toY(maxSize) - 3} textAnchor="start" className="fill-green-500 text-xs">Time O(V + E)</text>
          <text x={toX(maxSize) + 5} y={toY(maxSize - 2) + 12} textAnchor="start" className="fill-blue-500 text-xs">Stack O(V)</text>
          {hoverData && <g><line x1={hoverData.x} y1={padding.top} x2={hoverData.x} y2={height - padding.bottom} stroke={axisColor} strokeDasharray="4 4" opacity="0.6" /><circle cx={hoverData.x} cy={toY(hoverData.traversal)} r="5" fill="#22c55e" stroke="white" strokeWidth="1.5" /><circle cx={hoverData.x} cy={toY(hoverData.stack)} r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" /><g transform={`translate(${Math.min(hoverData.x + 15, width - padding.right - 130)}, ${padding.top + 10})`}><rect width="125" height="58" rx="6" fill={isDark ? "black" : "white"} stroke={isDark ? "none" : "#cbd5e1"} opacity="0.92" /><text x="8" y="18" className="text-xs" fill={isDark ? "white" : "black"}>V + E = {hoverData.vertices}</text><text x="8" y="35" className="fill-green-500 text-xs">Time: {hoverData.traversal}</text><text x="8" y="52" className="fill-blue-500 text-xs">Stack: {hoverData.stack}</text></g></g>}
        </svg>
      </div>
      <div className="flex justify-center gap-6 text-xs mt-2"><span className="flex items-center gap-2 text-green-500"><span className="w-3 h-1 rounded bg-green-500" />Traversal work</span><span className="flex items-center gap-2 text-blue-500"><span className="w-3 h-1 rounded bg-blue-500" />Stack space</span></div>
    </div>
  );
};

const DFSExplanation = ({ isDark }) => {
  const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const section = `${cardClass} p-6 md:p-8 rounded-2xl border`;
  const text = isDark ? "text-gray-300" : "text-slate-600";
  return (
    <section className={`${isDark ? "text-gray-300" : "text-slate-600"} animate-fadeIn`}>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className={section}><h2 className="text-2xl text-center font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">What is Depth-First Search?</h2><p className={`text-sm text-center leading-relaxed ${text}`}>Depth-First Search explores one branch as deeply as possible before backtracking. An explicit stack, or the call stack in a recursive implementation, controls the traversal order.</p></div>
        <div className={section}><h3 className="flex items-center justify-center gap-3 text-lg font-bold mb-6"><Wand2 className="w-5 h-5 text-purple-400" />How DFS Works</h3><div className="mb-8"><DFSExplanationGraph isDark={isDark} /></div><ol className={`list-decimal list-inside space-y-4 text-sm leading-relaxed ${text}`}><li><strong>Choose a start node.</strong> Mark it visited and push it onto the stack.</li><li><strong>Inspect the top node.</strong> Remove it from the stack and explore its neighbors.</li><li><strong>Push unseen neighbors.</strong> Add them in the desired order so the next branch is explored first.</li><li><strong>Backtrack naturally.</strong> When a node has no unseen neighbors, continue with the next stack item.</li></ol></div>
        <div className={section}><h3 className="flex items-center gap-3 text-lg font-bold mb-6"><BarChart3 className="w-5 h-5 text-purple-400" />Complexity Analysis</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-6 rounded-lg border bg-purple-500/10 text-center"><p className="text-2xl font-bold text-purple-400">O(V + E)</p><p className={`text-xs mt-2 ${text}`}>Each vertex and edge is examined at most once.</p></div><div className="p-6 rounded-lg border bg-sky-500/10 text-center"><p className="text-2xl font-bold text-sky-400">O(V)</p><p className={`text-xs mt-2 ${text}`}>The visited set and stack can hold up to all vertices.</p></div></div></div>
        <div className={section}><h3 className="flex items-center justify-center gap-3 text-lg font-bold mb-6"><Activity className="w-5 h-5 text-purple-400" />Interactive Performance Graph</h3><DFSComplexityGraph isDark={isDark} /></div>
        <div className={section}><h3 className="flex items-center gap-3 text-lg font-bold mb-6"><CheckCircle2 className="w-5 h-5 text-green-500" />When to Use DFS</h3><ul className={`space-y-3 text-sm ${text}`}><li>Detect cycles and connected components.</li><li>Explore maze-like structures and backtracking problems.</li><li>Build topological ordering in directed acyclic graphs.</li><li>Prefer BFS when shortest unweighted paths are the main goal.</li></ul></div>
      </div>
    </section>
  );
};

const DFS_CODE = {
  javascript: `function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];

  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) stack.push(neighbor);
    }
  }
  return order;
}

console.log(dfs({ A: ['B', 'C'], B: ['D'], C: ['F'] }, 'A'));`,
  python: `def dfs(graph, start):
    visited = set()
    stack = [start]
    order = []

    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        stack.extend(graph.get(node, []))

    return order`,
  cpp: `vector<char> dfs(const unordered_map<char, vector<char>>& graph, char start) {
    unordered_set<char> visited;
    stack<char> nodes;
    vector<char> order;
    nodes.push(start);

    while (!nodes.empty()) {
        char node = nodes.top(); nodes.pop();
        if (visited.insert(node).second) {
            order.push_back(node);
            for (char neighbor : graph.at(node)) nodes.push(neighbor);
        }
    }
    return order;
}`,
  java: `static List<Character> dfs(Map<Character, List<Character>> graph, char start) {
    Set<Character> visited = new HashSet<>();
    Deque<Character> stack = new ArrayDeque<>();
    List<Character> order = new ArrayList<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        char node = stack.pop();
        if (visited.add(node)) {
            order.add(node);
            for (char neighbor : graph.getOrDefault(node, List.of())) stack.push(neighbor);
        }
    }
    return order;
}`,
  c: `void dfs(int graph[V][V], int start) {
    bool visited[V] = { false };
    int stack[V], top = 0;
    stack[top++] = start;

    while (top > 0) {
        int node = stack[--top];
        if (visited[node]) continue;
        visited[node] = true;
        printf("%c ", 'A' + node);
        for (int neighbor = V - 1; neighbor >= 0; neighbor--)
            if (graph[node][neighbor]) stack[top++] = neighbor;
    }
}`,
};

const DFSVisualizer = () => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.value) === "dark";
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [startNodeId, setStartNodeId] = useState(null);
  const [graphType, setGraphType] = useState("undirected");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [customInput, setCustomInput] = useState("");
  const [activeTab, setActiveTab] = useState("visualization");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [state, setState] = useState({ stack: [], visited: new Set(), currentNode: null });
  const [complexity, setComplexity] = useState({ nodesVisited: 0, edgesTraversed: 0 });
  const [editMode, setEditMode] = useState("none");
  const [edgeStartNode, setEdgeStartNode] = useState(null);
  const [copyText, setCopyText] = useState("Copy");
  const graphRef = useRef(null);

  const reset = useCallback(() => {
    setIsSorting(false); setIsPaused(true); setIsFinished(false); setReviewing(false);
    setState({ stack: [], visited: new Set(), currentNode: null });
    setComplexity({ nodesVisited: 0, edgesTraversed: 0 });
    setSteps([{ message: "Graph loaded. Select a start node and press Play.", type: "start", queueState: [], visitedState: new Set(), currentNode: null, complexity: { nodesVisited: 0, edgesTraversed: 0 } }]);
    setCurrentStep(0);
  }, []);

  const setupGraph = useCallback((nextGraph, start = null) => {
    const width = graphRef.current?.clientWidth || 600;
    const positioned = positionGraph(nextGraph.nodes, nextGraph.edges, start || nextGraph.nodes[0]?.id, width, 350, graphType);
    setGraph({ nodes: positioned, edges: nextGraph.edges });
    setStartNodeId(start || nextGraph.nodes[0]?.id || null);
    reset();
  }, [graphType, reset]);

  const handleGraphTypeChange = (nextType) => {
    setGraphType(nextType);
    const width = graphRef.current?.clientWidth || 600;
    const positioned = positionGraph(graph.nodes, graph.edges, startNodeId, width, 350, nextType);
    setGraph((currentGraph) => ({ ...currentGraph, nodes: positioned }));
    reset();
  };

  useEffect(() => { setupGraph(DEFAULT_GRAPH); }, []);

  const addStep = (message, type, stack, visited, currentNode, nextComplexity) => {
    setSteps((previous) => [...previous, { message, type, queueState: [...stack], visitedState: new Set(visited), currentNode, complexity: { ...nextComplexity } }]);
    if (!reviewing) setCurrentStep((value) => value + 1);
  };

  const runStep = useCallback(() => {
    const stack = [...state.stack];
    const visited = new Set(state.visited);
    const nextComplexity = { ...complexity };
    if (!stack.length) { setIsFinished(true); setIsSorting(false); addStep("DFS complete! All reachable nodes visited.", "finish", [], visited, null, nextComplexity); return; }
    const currentNode = stack.pop();
    if (visited.has(currentNode)) { setState({ stack, visited, currentNode }); return; }
    visited.add(currentNode); nextComplexity.nodesVisited += 1;
    addStep(`Popped ${currentNode}. Exploring deeply from this node.`, "visit", stack, visited, currentNode, nextComplexity);
    const neighbors = graphType === "directed"
      ? graph.edges.filter((edge) => edge.source === currentNode).map((edge) => edge.target)
      : graph.edges.filter((edge) => edge.source === currentNode).map((edge) => edge.target).concat(graph.edges.filter((edge) => edge.target === currentNode).map((edge) => edge.source));
    const unseen = [...new Set(neighbors)].sort().reverse();
    unseen.forEach((neighbor) => { nextComplexity.edgesTraversed += 1; if (!visited.has(neighbor)) stack.push(neighbor); });
    addStep(`Pushed unseen neighbors of ${currentNode} onto the stack.`, "enqueue", stack, visited, currentNode, nextComplexity);
    setState({ stack, visited, currentNode }); setComplexity(nextComplexity);
  }, [state, complexity, graph, graphType, reviewing]);

  useEffect(() => {
    if (!isSorting || isPaused || isFinished) return undefined;
    const timer = setTimeout(runStep, 1000 - Number(speed) * 9);
    return () => clearTimeout(timer);
  }, [isSorting, isPaused, isFinished, runStep, speed]);

  const toggleSorting = () => {
    if (isFinished || !graph.nodes.length || !startNodeId) return;
    if (!isSorting && !state.stack.length && !state.visited.size) {
      const initialStack = [startNodeId];
      const initialVisited = new Set();
      setState({ stack: initialStack, visited: initialVisited, currentNode: null });
      addStep(`Starting DFS. Pushing start node ${startNodeId}.`, "start", initialStack, initialVisited, null, complexity);
    }
    setReviewing(false); setIsSorting(true); setIsPaused(!isPaused);
  };

  const goToStep = (index) => { if (index >= 0 && index < steps.length) { setIsPaused(true); setReviewing(true); setCurrentStep(index); } };
  const stepForward = () => goToStep(currentStep + 1);
  const stepBackward = () => goToStep(currentStep - 1);
  const queueToDisplay = reviewing ? steps[currentStep]?.queueState || [] : state.stack;
  const visitedToDisplay = reviewing ? steps[currentStep]?.visitedState || new Set() : state.visited;
  const currentToDisplay = reviewing ? steps[currentStep]?.currentNode : state.currentNode;
  const complexityToDisplay = reviewing ? steps[currentStep]?.complexity || complexity : complexity;
  const getNodeColor = (id) => currentToDisplay === id ? "bg-yellow-500 ring-4 ring-yellow-300 scale-110 text-black" : visitedToDisplay.has(id) ? "bg-gradient-to-b from-green-500 to-emerald-600 border-green-400" : queueToDisplay.includes(id) ? "bg-gradient-to-b from-pink-500 to-rose-600 border-pink-400" : startNodeId === id ? "bg-gradient-to-b from-indigo-500 to-purple-600 ring-2 ring-white" : isDark ? "bg-slate-700 border-slate-500" : "bg-white border-slate-300 text-slate-700";
  const getEditModeMessage = () => ({ addNode: "Click canvas to add node", addEdgeStart: "Select source node", addEdgeEnd: "Select target node", removeNode: "Select node to remove" }[editMode] || "");
  const getTabClass = (tab) => activeTab === tab
    ? "px-4 py-2 text-sm font-medium text-purple-500 border-b-2 border-purple-500"
    : `px-4 py-2 text-sm font-medium ${isDark ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-purple-600"}`;
  const handleCanvasClick = (event) => { if (editMode !== "addNode") return; const rect = graphRef.current.getBoundingClientRect(); const id = String.fromCharCode(65 + graph.nodes.length); setGraph((value) => ({ ...value, nodes: [...value.nodes, { id, x: event.clientX - rect.left, y: event.clientY - rect.top }] })); setStartNodeId(startNodeId || id); setEditMode("none"); reset(); };
  const handleNodeClick = (event, id) => { event.stopPropagation(); if (editMode === "removeNode") { setGraph((value) => ({ nodes: value.nodes.filter((node) => node.id !== id), edges: value.edges.filter((edge) => edge.source !== id && edge.target !== id) })); reset(); setEditMode("none"); } else if (editMode === "addEdgeStart") { setEdgeStartNode(id); setEditMode("addEdgeEnd"); } else if (editMode === "addEdgeEnd" && edgeStartNode && edgeStartNode !== id) { setGraph((value) => ({ ...value, edges: [...value.edges, { source: edgeStartNode, target: id }] })); setEdgeStartNode(null); setEditMode("none"); reset(); } };
  const handleClearGraph = () => { setGraph({ nodes: [], edges: [] }); setStartNodeId(null); reset(); };
  const handleReset = () => setupGraph(DEFAULT_GRAPH);
  const loadExampleGraph = () => { const example = { nodes: ["1", "2", "3", "4", "5", "6"].map((id) => ({ id })), edges: [{ source: "1", target: "2" }, { source: "1", target: "3" }, { source: "2", target: "4" }, { source: "3", target: "5" }, { source: "5", target: "6" }] }; setCustomInput(JSON.stringify(example, null, 2)); setupGraph(example, "1"); };
  const handleCustomGraph = () => { try { const parsed = JSON.parse(customInput); if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) setupGraph(parsed); else alert("Graph JSON needs nodes and edges arrays."); } catch { alert("Invalid JSON"); } };
  const handleCopy = () => navigator.clipboard.writeText(window.location.href).then(() => { setCopyText("Copied!"); setTimeout(() => setCopyText("Copy"), 2000); });
  const handleShare = () => { if (navigator.share) navigator.share({ title: "DFS Visualizer", url: window.location.href }); };
  const setTab = (tab) => setActiveTab(tab);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-sans transition-colors duration-700 ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`} style={{ backgroundImage: `linear-gradient(${isDark ? "#333" : "#cbd5e1"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "#333" : "#cbd5e1"} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], x: [0, 50, 0], y: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], x: [0, 50, 0], y: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>
      <main className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center">
        <header className="w-full max-w-7xl mx-auto py-10 animate-fadeIn relative mb-8 mt-15"><div className="flex flex-col md:flex-row md:items-start md:justify-center relative"><div className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1"><Breadcrumb isDark={isDark} /></div><div className="text-center w-full"><div className={`inline-block text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border backdrop-blur-sm ${isDark ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-green-50 text-green-600 border-green-200"}`}>Graph Traversal</div><h1 className={`text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 ${isDark ? "text-white" : "text-slate-900"}`}>DFS Visualizer</h1><p className={`text-sm md:text-base max-w-2xl mx-auto mt-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Interactive demonstration of Depth-First Search.</p><div className="mt-6 flex justify-center gap-4"><GlossyButton onClick={handleCopy} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Copy className="w-4 h-4" />{copyText}</GlossyButton><GlossyButton onClick={handleShare} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Share2 className="w-4 h-4" />Share</GlossyButton></div></div></div></header>
        <div className="w-full space-y-6"><div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}><button className={getTabClass("visualization")} onClick={() => setTab("visualization")}>Visualization</button><button className={getTabClass("explanation")} onClick={() => setTab("explanation")}>Explanation</button><button className={getTabClass("code")} onClick={() => setTab("code")}>Code & Practice</button><button className={`${getTabClass("quiz")} flex items-center gap-2`} onClick={() => setTab("quiz")}><BrainCircuit size={16} />Mastery Arena</button></div>
          {activeTab === "visualization" && <div className="animate-fadeIn"><DFSComplexityDisplay complexity={complexityToDisplay} isDark={isDark} /><div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"><div className="lg:col-span-2 flex flex-col gap-6"><GraphCanvas graph={graph} graphRef={graphRef} graphType={graphType} getNodeColor={getNodeColor} onCanvasClick={handleCanvasClick} onNodeClick={handleNodeClick} editMode={editMode} isDark={isDark} /><StackDisplay stack={queueToDisplay} isDark={isDark} /></div><div className="lg:col-span-1 h-fit sticky top-6"><BFSControls isFinished={isFinished} isPaused={isPaused} graph={graph} currentStep={currentStep} steps={steps} speed={speed} editMode={editMode} startNodeId={startNodeId} setStartNodeId={setStartNodeId} graphType={graphType} setGraphType={handleGraphTypeChange} isSorting={isSorting} toggleSorting={toggleSorting} stepBackward={stepBackward} stepForward={stepForward} setSpeed={setSpeed} setEditMode={setEditMode} handleClearGraph={handleClearGraph} handleReset={handleReset} loadExampleGraph={loadExampleGraph} getEditModeMessage={getEditModeMessage} customInput={customInput} setCustomInput={setCustomInput} handleCustomGraph={handleCustomGraph} isDark={isDark} /></div></div><div className="w-full mt-6"><BFSLogView steps={steps} currentStep={currentStep} goToStep={goToStep} isDark={isDark} structureLabel="Stack" /></div></div>}
          {activeTab === "explanation" && <DFSExplanation isDark={isDark} />}
          {activeTab === "code" && <PremiumCodeReference codeData={DFS_CODE} complexity={{ time: "O(V + E)", space: "O(V)", stable: "Depth-first" }} isDark={isDark} />}
          {activeTab === "quiz" && <QuizArena algoKey="DFS-in-Graph" isDark={isDark} onMasteryComplete={() => navigate("/dashboard")} />}
        </div>
      </main>
    </div>
  );
};

export default DFSVisualizer;
