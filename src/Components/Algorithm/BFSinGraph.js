import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Home,
  ChevronRight,
  LayoutGrid,
  BrainCircuit,
  BarChart3,
  Link2,
  Copy,
  Share2,
  Wand2,
  CheckCircle2,
  XCircle,
  Activity,
    ArrowUpDown,
  ArrowUpNarrowWide,
  Code2,
  Clock,
  Maximize,
} from "lucide-react";
import GlossyButton from "../Utils/GlossyButton";
import PremiumCodeReference from "../Utils/PremiumCodeReference";
import QuizArena from "../Utils/QuizArena";
import BFSControls from "../Utils/BFSControls";
import BFSLogView from "../Utils/BFSLogView";

// --- THEME UTILS & CONSTANTS ---
const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    x: [0, 50, 0],
    y: [0, -50, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

// --- BREADCRUMB ---
const Breadcrumb = ({ isDark }) => (
  <nav aria-label="Breadcrumb">
    <ol className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
      <li>
        <a href="/" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </a>
      </li>
      <li>
        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <a href="/algorithms" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
           <LayoutGrid className="w-4 h-4" />
           <span className="hidden sm:inline">Dashboard</span>
        </a>
      </li>
      <li>
         <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border backdrop-blur-md cursor-default
            ${isDark 
              ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" 
              : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}>
          <BrainCircuit className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          <span className="font-semibold">BFS Visualizer</span>
        </div>
      </li>
    </ol>
  </nav>
);

// --- HELPER: GRAPH LAYOUT & GENERATION ---
const calculateLayeredLayout = (nodes, edges, startNodeId, width, height, graphType = 'undirected') => {
    if (!nodes.length) return [];
    const positions = {};
    const adj = new Map();
    nodes.forEach(node => adj.set(node.id, []));
    edges.forEach(({ source, target }) => {
        adj.get(source)?.push(target);
        if (graphType === 'undirected') {
            adj.get(target)?.push(source);
        }
    });

    const visited = new Set();
    const queue = [{ id: startNodeId || nodes[0]?.id, level: 0 }];
    if(queue[0].id) visited.add(queue[0].id);

    const levels = [];

    let head = 0;
    while(head < queue.length) {
        const { id, level } = queue[head++];
        if(!id) continue;

        if (!levels[level]) levels[level] = [];
        levels[level].push(id);
        
        adj.get(id)?.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ id: neighbor, level: level + 1 });
            }
        });
    }
    
    // Add disconnected nodes
    nodes.forEach(node => {
        if (!visited.has(node.id)) {
             if (!levels[0]) levels[0] = [];
             levels[0].push(node.id);
        }
    });

    // Assign positions
    levels.forEach((levelNodes, i) => {
        const layerHeight = height / (levels.length + 1);
        const y = (i + 1) * layerHeight;
        levelNodes.forEach((nodeId, j) => {
            const layerWidth = width / (levelNodes.length + 1);
            const x = (j + 1) * layerWidth;
            positions[nodeId] = { x, y };
        });
    });

    return nodes.map(node => ({
        ...node,
        x: positions[node.id]?.x || Math.random() * (width - 80) + 40,
        y: positions[node.id]?.y || Math.random() * (height - 80) + 40,
    }));
};

const generateNewNodeId = (existingNodes) => {
    const ids = existingNodes.map(n => n.id);
    let charCode = 65; // A
    while (ids.includes(String.fromCharCode(charCode))) charCode++;
    return String.fromCharCode(charCode);
};

// --- COMPONENTS ---

const SmallExampleNode = ({ label, color, style, isDark }) => {
    const colors = { 
      default: isDark ? "bg-blue-600" : "bg-blue-100 text-blue-700", 
      visited: isDark ? "bg-green-600" : "bg-green-100 text-green-700", 
      queue: isDark ? "bg-pink-600" : "bg-pink-100 text-pink-700",
      current: isDark ? "bg-yellow-500 text-black" : "bg-yellow-100 text-yellow-800"
    };
    const nodeColorClass = colors[color] || colors.default;
    const borderColor = isDark ? "border-white/20" : "border-slate-300";
    
    return (
      <div 
        style={style} 
        className={`absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition-colors duration-300 transform -translate-x-1/2 -translate-y-1/2 border-2 ${borderColor} ${nodeColorClass} shadow-sm`}
      >
        {label}
      </div>
    );
};

const AnimatedNumber = ({ value }) => {
    const [current, setCurrent] = useState(value);
    useEffect(() => { setCurrent(value); }, [value]);
    return <>{current}</>;
};

const ComplexityDisplay = ({ complexity, isDark }) => {
  const cardClass = isDark 
    ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" 
    : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const titleClass = isDark ? "text-gray-300" : "text-slate-700";

  return (
    <section className={`${cardClass} rounded-xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20`}>
        <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}>
            <BarChart3 className="w-4 h-4"/>Complexity Analysis
        </h2>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3 rounded-lg border border-indigo-700/50">
                <h3 className="flex items-center gap-2 text-xs text-indigo-400 mb-1"><BrainCircuit className="w-4 h-4"/>Nodes Visited</h3>
                <span className="text-xl font-bold text-indigo-400"><AnimatedNumber value={complexity.nodesVisited} /></span>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3 rounded-lg border border-pink-700/50">
                <h3 className="flex items-center gap-2 text-xs text-pink-400 mb-1"><Link2 className="w-4 h-4"/>Edges Traversed</h3>
                <span className="text-xl font-bold text-pink-400"><AnimatedNumber value={complexity.edgesTraversed} /></span>
            </div>
        </div>
    </section>
  );
};

const QueueDisplay = ({ queue, isDark }) => {
    const cardClass = isDark 
        ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" 
        : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    const titleClass = isDark ? "text-gray-300" : "text-slate-700";
    const innerBg = isDark ? "bg-gray-900/50 border-gray-800" : "bg-slate-50 border-slate-200";

    return (
    <section className={`${cardClass} rounded-xl p-6 border shadow-lg`}>
        <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${titleClass}`}>
            <Activity className="w-4 h-4" />Queue
        </h2>
        <div className={`flex items-center rounded-xl p-4 min-h-[5rem] overflow-x-auto border ${innerBg}`}>
            <span className="text-xs font-bold text-gray-500 mr-4 uppercase tracking-wider">Front</span>
            <div className="flex-1 flex items-center gap-3">
                {queue?.map((nodeId, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={`${nodeId}-${idx}`} 
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20 border border-pink-400/50"
                    >
                        {nodeId}
                    </motion.div>
                ))}
                {queue?.length === 0 && <span className="text-xs text-gray-500 italic">Queue is empty</span>}
            </div>
            <span className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-wider">Back</span>
        </div>
    </section>
    );
};

const VisualizationArea = ({
    graph, visContainerRef, handleCanvasClick, getNodeColor, handleNodeClick, 
    editMode, graphType, isFinished, isSorting, isPaused, startNodeId, isDark
}) => {
    
    // Helper to calculate curved paths
    const getPath = (s, t, edgeSet) => {
        if (!s || !t) return "";
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return "";

        const hasReverse = edgeSet.has(`${t.id}->${s.id}`);
        const curve = hasReverse ? ((s.id > t.id) ? 40 : -40) : 0; 
        
        const midX = (s.x + t.x) / 2;
        const midY = (s.y + t.y) / 2;
        const controlX = midX + curve * (dy / dist);
        const controlY = midY - curve * (dx / dist);
        
        const r = 25; 
        const angle = Math.atan2(t.y - controlY, t.x - controlX);
        const endX = t.x - r * Math.cos(angle);
        const endY = t.y - r * Math.sin(angle);

        return `M ${s.x} ${s.y} Q ${controlX} ${controlY} ${endX} ${endY}`;
    };

    const edgeSet = new Set(graph.edges.map(e => `${e.source}->${e.target}`));

    const containerClasses = isDark 
        ? "bg-gradient-to-br from-gray-955 via-gray-955 to-gray-955 border-gray-700"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const titleClass = isDark ? "text-gray-300" : "text-slate-700";
    const canvasBg = isDark ? "bg-black/20 border-white/5" : "bg-white border-slate-200";

    return (
        <section className={`${containerClasses} rounded-xl p-6 border shadow-xl h-full relative overflow-hidden backdrop-blur-sm flex flex-col`}>
             <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `radial-gradient(circle at center, ${gridColor} 1px, transparent 1px)`, backgroundSize: "24px 24px" }}></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
                 <h2 className={`flex items-center gap-2 text-lg font-semibold ${titleClass}`}>
                    <BarChart3 className="w-4 h-4" />Graph Visualization
                </h2>
                {startNodeId && <span className="text-xs text-purple-500 bg-purple-100 dark:bg-purple-400/10 px-2 py-1 rounded border border-purple-200 dark:border-purple-400/20 font-medium">Start: {startNodeId}</span>}
            </div>

            <div
                ref={visContainerRef}
                className={`relative w-full h-[350px] ${canvasBg} rounded-xl border ${editMode === 'addNode' ? 'cursor-crosshair' : 'cursor-default'} overflow-hidden shadow-inner`}
                onClick={handleCanvasClick}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#c084fc" />
                        </marker>
                    </defs>
                    {graph.edges.map((edge, i) => {
                        const s = graph.nodes.find(n => n.id === edge.source);
                        const t = graph.nodes.find(n => n.id === edge.target);
                        return (
                            <path 
                                key={i} 
                                d={getPath(s, t, edgeSet)} 
                                stroke={isDark ? "url(#lineGrad)" : "#94a3b8"}
                                strokeWidth="2" 
                                fill="none"
                                markerEnd={graphType === 'directed' ? "url(#arrowhead)" : ""}
                                className="transition-all duration-300"
                            />
                        );
                    })}
                </svg>

                {graph.nodes.map((node) => (
                    <motion.div
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        key={node.id}
                        className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 transition-all duration-300 ${getNodeColor(node.id)} ${editMode !== 'none' ? 'pointer-events-auto cursor-pointer hover:scale-110' : ''}`}
                        style={{ left: node.x - 24, top: node.y - 24 }} 
                        onClick={(e) => handleNodeClick(e, node.id)}
                    >
                        {node.id}
                    </motion.div>
                ))}
            </div>
            
             <div className={`mt-4 flex justify-center flex-wrap gap-4 text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-400"></span> Start</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 border border-green-400"></span> Visited</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-500 border border-pink-400"></span> Queue</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-400 animate-pulse"></span> Current</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-400"></span> Unvisited</span>
            </div>
        </section>
    );
};

const ExplanationGraph = ({ isDark }) => {
    const nodes = [
        { id: "A", x: 200, y: 42, state: "start" },
        { id: "B", x: 112, y: 112, state: "visited" },
        { id: "C", x: 288, y: 112, state: "queue" },
        { id: "D", x: 58, y: 188, state: "unvisited" },
        { id: "E", x: 166, y: 188, state: "unvisited" },
        { id: "F", x: 342, y: 188, state: "unvisited" }
    ];
    const edges = [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"]];
    const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const fills = {
        start: isDark ? "#6366f1" : "#e0e7ff",
        visited: isDark ? "#16a34a" : "#dcfce7",
        queue: isDark ? "#db2777" : "#fce7f3",
        unvisited: isDark ? "#334155" : "#ffffff"
    };
    const labels = {
        start: isDark ? "#ffffff" : "#4338ca",
        visited: isDark ? "#ffffff" : "#166534",
        queue: isDark ? "#ffffff" : "#9d174d",
        unvisited: isDark ? "#cbd5e1" : "#475569"
    };

    return (
        <div className={`${isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"} rounded-2xl border p-4 md:p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className={`text-base font-bold ${isDark ? "text-gray-200" : "text-slate-800"}`}>Graph Traversal Map</h3>
                    <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>BFS explores each layer from the start node before moving deeper.</p>
                </div>
                <div className="flex flex-wrap gap-3 text-[10px]">
                    {["start", "visited", "queue", "unvisited"].map((state) => (
                        <span key={state} className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fills[state] }} />
                            {state === "start" ? "Start" : state[0].toUpperCase() + state.slice(1)}
                        </span>
                    ))}
                </div>
            </div>
            <svg viewBox="0 0 400 230" className="w-full h-auto max-h-64" role="img" aria-label="Breadth-first search graph with start, visited, queued, and unvisited nodes">
                {edges.map(([source, target]) => (
                    <line key={`${source}-${target}`} x1={nodeMap[source].x} y1={nodeMap[source].y} x2={nodeMap[target].x} y2={nodeMap[target].y} stroke={isDark ? "#a78bfa" : "#94a3b8"} strokeWidth="3" />
                ))}
                {nodes.map((node) => (
                    <g key={node.id}>
                        <circle cx={node.x} cy={node.y} r="24" fill={fills[node.state]} stroke={isDark ? "#ffffff40" : "#cbd5e1"} strokeWidth="2" />
                        <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={labels[node.state]}>{node.id}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

const BFSComplexityGraph = ({ isDark }) => {
    const [hoverData, setHoverData] = useState(null);
    const [animate, setAnimate] = useState(false);
    const graphRef = useRef(null);
    const maxVertices = 25;
    const maxCost = maxVertices * 2;
    const padding = { top: 40, right: 80, bottom: 50, left: 60 };
    const [size, setSize] = useState({ width: 600, height: 400 });

    useEffect(() => {
        if (!graphRef.current) return undefined;
        const resize = () => setSize({ width: graphRef.current.offsetWidth, height: graphRef.current.offsetHeight });
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        if (!graphRef.current) return undefined;
        const observer = new IntersectionObserver((entries) => setAnimate(entries[0].isIntersecting), { threshold: 0.3 });
        observer.observe(graphRef.current);
        return () => observer.disconnect();
    }, []);

    const { width, height } = size;
    const vertexToX = (vertices) => padding.left + ((vertices - 1) / (maxVertices - 1)) * (width - padding.left - padding.right);
    const costToY = (cost) => height - padding.bottom - (cost / maxCost) * (height - padding.top - padding.bottom);
    const xToVertices = (x) => Math.round(1 + ((x - padding.left) / (width - padding.left - padding.right)) * (maxVertices - 1));
    const makePath = (costFunction) => Array.from({ length: maxVertices }, (_, index) => {
        const vertices = index + 1;
        return `${vertexToX(vertices)},${costToY(costFunction(vertices))}`;
    }).join(" ");

    const handleMouseMove = (event) => {
        const bounds = graphRef.current.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * width;
        if (x < padding.left || x > width - padding.right) {
            setHoverData(null);
            return;
        }
        const vertices = Math.max(1, Math.min(maxVertices, xToVertices(x)));
        setHoverData({ vertices, x: vertexToX(vertices), time: vertices * 2, space: vertices });
    };

    const axisColor = isDark ? "#e5e7eb" : "#475569";
    const gridColor = isDark ? "#4b5563" : "#cbd5e1";
    const textColor = isDark ? "#d1d5db" : "#475569";
    const containerClass = isDark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-slate-200 shadow-xl";

    return (
        <div className={`${containerClass} p-4 rounded-2xl border relative`}>
            <h3 className={`text-xl font-bold text-center mb-4 ${isDark ? "text-gray-100" : "text-slate-800"}`}>BFS Time and Space Complexity</h3>
            <div ref={graphRef} className="relative w-full h-[450px] cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
                <svg width={width} height={height} role="img" aria-label="BFS time and space complexity grow linearly">
                    <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
                    <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke={axisColor} strokeWidth="2" />
                    {[0, 10, 20, 30, 40].map((value) => (
                        <g key={value}>
                            <line x1={padding.left} y1={costToY(value)} x2={width - padding.right} y2={costToY(value)} stroke={gridColor} strokeDasharray="3 3" />
                            <text x={padding.left - 10} y={costToY(value) + 4} textAnchor="end" className="text-xs" fill={textColor}>{value}</text>
                        </g>
                    ))}
                    <text x={padding.left + (width - padding.left - padding.right) / 2} y={height - 10} textAnchor="middle" className="font-medium text-sm" fill={textColor}>Graph Size (V + E)</text>
                    <path d={`M ${makePath((vertices) => vertices * 2)}`} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
                    <path d={`M ${makePath((vertices) => vertices)}`} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="2000" strokeDashoffset={animate ? "0" : "2000"} style={{ transition: "stroke-dashoffset 2s ease-out 0.5s" }} />
                    <text x={vertexToX(maxVertices) + 5} y={costToY(maxVertices * 2) - 3} textAnchor="start" className="fill-blue-500 text-xs">Time O(V + E)</text>
                    <text x={vertexToX(maxVertices) + 5} y={costToY(maxVertices) - 3} textAnchor="start" className="fill-green-500 text-xs">Space O(V)</text>
                    {hoverData && (
                        <g>
                            <line x1={hoverData.x} y1={padding.top} x2={hoverData.x} y2={height - padding.bottom} stroke={axisColor} strokeDasharray="4 4" opacity="0.6" />
                            {[{ y: costToY(hoverData.time), color: "#3b82f6" }, { y: costToY(hoverData.space), color: "#22c55e" }].map((point, index) => (
                                <circle key={index} cx={hoverData.x} cy={point.y} r="5" fill={point.color} stroke="white" strokeWidth="1.5" className="transition-all duration-300 ease-out" />
                            ))}
                            {(() => {
                                const boxWidth = 130;
                                const boxHeight = 58;
                                let tooltipX = hoverData.x + 15;
                                let tooltipY = costToY(hoverData.time) - boxHeight - 10;
                                if (tooltipX + boxWidth > width - padding.right) tooltipX = hoverData.x - boxWidth - 15;
                                tooltipX = Math.max(padding.left, tooltipX);
                                if (tooltipY < padding.top) tooltipY = costToY(hoverData.space) + 15;
                                if (tooltipY + boxHeight > height - padding.bottom) tooltipY = height - padding.bottom - boxHeight;
                                return (
                                    <g transform={`translate(${tooltipX}, ${tooltipY})`} className="transition-transform duration-100 ease-out">
                                        <rect width={boxWidth} height={boxHeight} rx="6" fill={isDark ? "black" : "white"} stroke={isDark ? "none" : "#cbd5e1"} opacity="0.9" />
                                        <text x="8" y="18" className="text-xs" fill={isDark ? "white" : "black"}>V + E = {hoverData.vertices}</text>
                                        <text x="8" y="35" className="fill-blue-500 text-xs">Time: {hoverData.time}</text>
                                        <text x="8" y="52" className="fill-green-500 text-xs">Space: {hoverData.space}</text>
                                    </g>
                                );
                            })()}
                        </g>
                    )}
                </svg>
            </div>
            <div className="flex justify-center gap-6 text-xs mt-2">
                <span className="flex items-center gap-2 text-blue-500"><span className="w-3 h-1 rounded bg-blue-500" />Traversal work</span>
                <span className="flex items-center gap-2 text-green-500"><span className="w-3 h-1 rounded bg-green-500" />Queue space</span>
            </div>
        </div>
    );
};

const BFSWalkthroughStep = ({ data, graphData, isDark }) => {
    const textColor = isDark ? "text-gray-300" : "text-slate-600";
    
    return (
        <div className={`flex flex-col gap-3 p-5 rounded-xl border-l-4 transition-all hover:translate-x-1 duration-300 ${isDark ? 'bg-gray-900/40 border-purple-500' : 'bg-white border-purple-500 shadow-sm'}`}>
            <div className="flex justify-between items-center border-b border-gray-700/30 pb-2 mb-1">
                <h4 className={`text-base font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{data.title}</h4>
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-50 bg-gray-500/20 px-2 py-1 rounded">Step {data.id}</span>
            </div>
            
            <p className={`text-sm leading-relaxed ${textColor}`}>{data.description}</p>
            
            <div className="flex items-center gap-4 mt-1 text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-semibold opacity-70">Processing:</span>
                    {data.currentNode ? (
                        <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 font-mono font-bold">
                            {data.currentNode}
                        </span>
                    ) : <span className="italic opacity-50">-</span>}
                </div>
                <div className="flex items-center gap-2 flex-1">
                    <span className="font-semibold opacity-70">Queue:</span>
                    <div className="flex gap-1">
                        {data.queue.length > 0 ? data.queue.map((q, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-500 border border-pink-500/30 font-mono font-bold">
                                {q}
                            </span>
                        )) : <span className="italic opacity-50">Empty</span>}
                    </div>
                </div>
            </div>

            <div className={`relative w-full h-40 rounded-lg border mt-2 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {graphData.edges.map((e,i) => {
                        const s = graphData.nodes.find(n => n.id === e.source);
                        const t = graphData.nodes.find(n => n.id === e.target);
                        return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={isDark ? "#a78bfa" : "#818cf8"} strokeWidth="2" />;
                    })}
                </svg>
                {graphData.nodes.map(n => (
                    <SmallExampleNode 
                        key={n.id} 
                        label={n.id} 
                        color={data.nodeStates[n.id]} 
                        style={{ left: `${n.x}px`, top: `${n.y}px` }} 
                        isDark={isDark} 
                    />
                ))}
            </div>
        </div>
    );
};

const ExplanationTab = ({ isDark }) => {
    const cardClass = isDark ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    const sectionClasses = `${cardClass} p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20`;
    const titleColor = isDark ? "text-gray-200" : "text-slate-800";
    const textColor = isDark ? "text-gray-300" : "text-slate-600";
    const listColor = isDark ? "text-gray-400" : "text-slate-500";
    const innerCardClass = isDark ? "bg-gray-900/50 border-gray-700" : "bg-slate-50 border-slate-200";

    const exampleGraphData = {
      nodes: [
        { id: "A", x: 150, y: 30 },
        { id: "B", x: 80, y: 90 },
        { id: "C", x: 220, y: 90 },
        { id: "D", x: 40, y: 150 },
        { id: "F", x: 120, y: 150 },
        { id: "E", x: 260, y: 150 }
      ],
      edges: [
        { source: "A", target: "B" }, { source: "A", target: "C" },
        { source: "B", target: "D" }, { source: "B", target: "F" },
        { source: "C", target: "E" }
      ]
    };

    const walkthroughSteps = [
        {
            id: 1,
            title: "Initialization",
            description: "Start at the root node 'A'. Mark it visited and enqueue it so BFS begins exploring from the source.",
            queue: ["A"],
            currentNode: "A",
            nodeStates: { A: 'current', B: 'default', C: 'default', D: 'default', E: 'default', F: 'default' }
        },
        {
            id: 2,
            title: "Visit A",
            description: "Process 'A' and discover 'B' and 'C'. Queue them in order, then continue with the next node at the front.",
            queue: ["B", "C"],
            currentNode: "A",
            nodeStates: { A: 'visited', B: 'queue', C: 'queue', D: 'default', E: 'default', F: 'default' }
        },
        {
            id: 3,
            title: "Visit B",
            description: "Dequeue 'B'. Explore its neighbors 'D' and 'F'. Since they are unvisited, they get added to the queue.",
            queue: ["C", "D", "F"],
            currentNode: "B",
            nodeStates: { A: 'visited', B: 'visited', C: 'queue', D: 'queue', F: 'queue', E: 'default' }
        },
        {
            id: 4,
            title: "Visit C",
            description: "Process 'C' next. Its only unvisited neighbor is 'E', which is now added to the end of the queue.",
            queue: ["D", "F", "E"],
            currentNode: "C",
            nodeStates: { A: 'visited', B: 'visited', C: 'visited', D: 'queue', F: 'queue', E: 'queue' }
        },
        {
            id: 5,
            title: "Finish Level Order",
            description: "The traversal continues layer by layer. BFS ensures every node at the current depth is processed before any deeper node.",
            queue: ["E"],
            currentNode: "D",
            nodeStates: { A: 'visited', B: 'visited', C: 'visited', D: 'visited', F: 'visited', E: 'queue' }
        }
    ];

    return (
        <section className={`${isDark ? 'text-gray-300' : 'text-slate-600'} animate-fadeIn`}>
            <div className="max-w-6xl mx-auto space-y-12">
            <div className={sectionClasses}>
                <h2 className="flex items-center justify-center gap-3 text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                    <ArrowUpNarrowWide className="w-6 h-6 text-purple-400" /> What is Breadth-First Search?
                </h2>
                <p className={`text-sm leading-relaxed text-center ${textColor}`}>
                    Breadth-First Search is a graph traversal algorithm that starts from a chosen source node and explores all neighbors at the current depth before moving deeper. It uses a queue to maintain order, making it ideal for finding shortest paths in unweighted graphs, detecting connected components, and exploring layered structures.
                </p>
            </div>

            <div className={sectionClasses}>
                <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}>
                    <Wand2 className="w-5 h-5 text-purple-400" /> How BFS Works Step by Step
                </h3>
                <div className="mb-8">
                    <h4 className={`text-lg text-center font-semibold mb-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Graph Traversal Map</h4>
                    <ExplanationGraph isDark={isDark} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {walkthroughSteps.map((step) => (
                        <BFSWalkthroughStep
                            key={step.id}
                            data={step}
                            graphData={exampleGraphData}
                            isDark={isDark}
                        />
                    ))}
                </div>
            </div>

            <div className={sectionClasses}>
                <h3 className={`flex items-center gap-3 text-lg font-bold mb-6 ${titleColor}`}>
                    <Code2 className="w-5 h-5 text-purple-400" /> The Algorithm, Step by Step
                </h3>
                <ol className={`list-decimal list-inside space-y-4 text-sm leading-relaxed ${textColor}`}>
                    <li>
                        <strong>Choose a starting node.</strong>
                        <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                            <li>Mark it as visited and queue it for processing.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Dequeue the front node.</strong>
                        <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                            <li>Visit it and inspect all of its neighbors.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Visit unseen neighbors.</strong>
                        <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                            <li>If a neighbor has not been visited yet, mark it visited and enqueue it.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Repeat until the queue is empty.</strong>
                        <ul className={`list-disc list-inside pl-6 mt-2 ${listColor}`}>
                            <li>Because BFS processes nodes by level, it guarantees the shortest path in an unweighted graph.</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div className={sectionClasses}>
                <h3 className={`flex items-center gap-3 text-lg font-bold mb-6 ${titleColor}`}>
                    <BarChart3 className="w-5 h-5 text-purple-400" /> Complexity Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${innerCardClass} p-6 rounded-lg border text-center`}>
                        <h4 className={`flex items-center justify-center gap-2 text-base font-semibold mb-3 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                            <Clock className="w-5 h-5" /> Time Complexity
                        </h4>
                        <p className={`font-bold text-2xl mb-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>O(V + E)</p>
                        <p className={`text-xs ${listColor}`}>
                            Each vertex is visited once and each edge is examined once, so total time grows linearly with the graph size.
                        </p>
                    </div>

                    <div className={`${innerCardClass} p-6 rounded-lg border text-center`}>
                        <h4 className={`flex items-center justify-center gap-2 text-base font-semibold mb-3 ${isDark ? 'text-sky-300' : 'text-sky-600'}`}>
                            <Maximize className="w-5 h-5" /> Space Complexity
                        </h4>
                        <p className={`font-bold text-2xl mb-2 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>O(V)</p>
                        <p className={`text-xs ${listColor}`}>
                            The queue can contain many vertices at once, especially in wide graphs, which is why BFS uses extra memory proportional to the number of nodes.
                        </p>
                    </div>
                </div>
            </div>

            <div className={sectionClasses}>
                <h3 className={`flex items-center justify-center gap-3 text-lg font-bold mb-6 ${titleColor}`}>
                    <Activity className="w-5 h-5 text-purple-400" /> Interactive Performance Graph
                </h3>
                <BFSComplexityGraph isDark={isDark} />
            </div>

            <div className={sectionClasses}>
                <h3 className={`flex items-center gap-3 text-lg font-bold mb-6 ${titleColor}`}>
                    <ArrowUpDown className="w-5 h-5 text-purple-400" /> Pros & Cons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-6 rounded-lg border-l-4 border-green-500 ${innerCardClass}`}>
                        <h4 className="text-base font-semibold text-green-500 mb-4">Advantages</h4>
                        <ul className={`space-y-3 text-sm ${textColor}`}>
                            <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Shortest unweighted paths:</strong> BFS discovers nodes in distance order, so the first visit gives the shortest path.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Complete traversal:</strong> It visits every node reachable from the selected start node.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /><span><strong>Clear level order:</strong> The queue makes each traversal layer easy to inspect and explain.</span></li>
                        </ul>
                    </div>
                    <div className={`p-6 rounded-lg border-l-4 border-red-500 ${innerCardClass}`}>
                        <h4 className="text-base font-semibold text-red-500 mb-4">Limitations</h4>
                        <ul className={`space-y-3 text-sm ${textColor}`}>
                            <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Queue memory:</strong> A wide graph can place many frontier nodes in the queue at once.</span></li>
                            <li className="flex items-start gap-3"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>Unweighted graphs:</strong> BFS does not guarantee weighted shortest paths without adapting the algorithm.</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
};

const BFS_GRAPH_CODE = {
  javascript: `/**
 * BFS in Graph - JavaScript
 * Explores all neighbors at the current depth before moving deeper.
 */

function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log('BFS Order:', bfs(graph, 'A'));`,

  python: `"""
BFS in Graph - Python
"""
from collections import deque


def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print('BFS Order:', bfs(graph, 'A'))`,

  cpp: `#include <iostream>
#include <queue>
#include <set>
#include <vector>
#include <unordered_map>

using namespace std;

vector<char> bfs(const unordered_map<char, vector<char>>& graph, char start) {
    set<char> visited = {start};
    queue<char> q;
    q.push(start);
    vector<char> order;

    while (!q.empty()) {
        char node = q.front();
        q.pop();
        order.push_back(node);

        for (char neighbor : graph.at(node)) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }

    return order;
}

int main() {
    unordered_map<char, vector<char>> graph = {
        {'A', {'B', 'C'}},
        {'B', {'A', 'D', 'E'}},
        {'C', {'A', 'F'}},
        {'D', {'B'}},
        {'E', {'B', 'F'}},
        {'F', {'C', 'E'}}
    };

    auto result = bfs(graph, 'A');
    for (char node : result) cout << node << ' ';
    cout << '\n';
    return 0;
}`,

  java: `/**
 * BFS in Graph - Java
 * Uses an adjacency list, queue, and visited set.
 */

import java.util.*;

public class Main {
    static List<Character> bfs(Map<Character, List<Character>> graph, char start) {
        Set<Character> visited = new HashSet<>();
        Queue<Character> queue = new ArrayDeque<>();
        List<Character> order = new ArrayList<>();

        visited.add(start);
        queue.offer(start);

        while (!queue.isEmpty()) {
            char node = queue.poll();
            order.add(node);

            for (char neighbor : graph.getOrDefault(node, List.of())) {
                if (visited.add(neighbor)) {
                    queue.offer(neighbor);
                }
            }
        }

        return order;
    }

    public static void main(String[] args) {
        Map<Character, List<Character>> graph = new HashMap<>();
        graph.put('A', Arrays.asList('B', 'C'));
        graph.put('B', Arrays.asList('A', 'D', 'E'));
        graph.put('C', Arrays.asList('A', 'F'));
        graph.put('D', List.of('B'));
        graph.put('E', Arrays.asList('B', 'F'));
        graph.put('F', Arrays.asList('C', 'E'));

        System.out.println("BFS Order: " + bfs(graph, 'A'));
    }
}`,

  c: `/**
 * BFS in Graph - C
 * Uses an adjacency matrix and a fixed-size queue.
 */

#include <stdio.h>
#include <stdbool.h>

#define VERTICES 6

void bfs(int graph[VERTICES][VERTICES], int start) {
    bool visited[VERTICES] = {false};
    int queue[VERTICES];
    int front = 0;
    int back = 0;

    visited[start] = true;
    queue[back++] = start;

    while (front < back) {
        int node = queue[front++];
        printf("%c ", 'A' + node);

        for (int neighbor = 0; neighbor < VERTICES; neighbor++) {
            if (graph[node][neighbor] && !visited[neighbor]) {
                visited[neighbor] = true;
                queue[back++] = neighbor;
            }
        }
    }
}

int main(void) {
    int graph[VERTICES][VERTICES] = {
        {0, 1, 1, 0, 0, 0},
        {1, 0, 0, 1, 1, 0},
        {1, 0, 0, 0, 0, 1},
        {0, 1, 0, 0, 0, 0},
        {0, 1, 0, 0, 0, 1},
        {0, 0, 1, 0, 1, 0}
    };

    printf("BFS Order: ");
    bfs(graph, 0);
    printf("\\n");
    return 0;
}`
};

const BFS_GRAPH_STATS = {
  time: "O(V + E)",
  space: "O(V)",
  stable: "Yes (level-order)"
};

//==============================================================================
// Main BFSVisualizer Component
//==============================================================================
const BFSVisualizer = () => {
    const navigate = useNavigate();
    // Redux Theme
    const theme = useSelector((state) => state.theme.value);
    const isDark = theme === "dark";

    const [graph, setGraph] = useState({ nodes: [], edges: [] });
    const [startNodeId, setStartNodeId] = useState(null);
    const [graphType, setGraphType] = useState('undirected');
    
    const [isSorting, setIsSorting] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    
    const [speed, setSpeed] = useState(50);
    const [customInput, setCustomInput] = useState("");
    const [activeTab, setActiveTab] = useState("visualization");
    
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isReviewingPastStep, setIsReviewingPastStep] = useState(false);
    
    const [sortState, setSortState] = useState({ queue: [], visited: new Set(), currentNode: null });
    const [complexity, setComplexity] = useState({ nodesVisited: 0, edgesTraversed: 0 });
    
    const [editMode, setEditMode] = useState('none');
    const [edgeStartNode, setEdgeStartNode] = useState(null);
    const [copyTooltipText, setCopyTooltipText] = useState("Copy");

    const visContainerRef = useRef(null);

    // --- LOGIC: Graph Layout & Traversal ---
  
    const resetVisualizationState = useCallback(() => {
        setIsSorting(false); setIsPaused(true); setIsFinished(false); setIsReviewingPastStep(false);
        setSortState({ queue: [], visited: new Set(), currentNode: null });
        setComplexity({ nodesVisited: 0, edgesTraversed: 0 });
        const initialStep = { message: "Graph loaded. Select a start node and press Play.", type: "start", queueState: [], visitedState: new Set(), currentNode: null, complexity: { nodesVisited: 0, edgesTraversed: 0 } };
        setSteps([initialStep]); setCurrentStep(0);
    }, []);

    const addStep = useCallback((message, type, queue, visited, currentNode, comp) => {
        const newStep = { message, type, queueState: [...queue], visitedState: new Set(visited), currentNode, complexity: { ...comp } };
        setSteps((prev) => [...prev, newStep]);
        if (!isReviewingPastStep) setCurrentStep((prev) => prev + 1);
    }, [isReviewingPastStep]);

    const runSortStep = useCallback(() => {
        let { queue, visited } = { ...sortState };
        let currentComplexity = { ...complexity };
        if (queue.length === 0) {
            setIsFinished(true); setIsSorting(false);
            addStep("BFS complete! All reachable nodes visited.", "finish", [], visited, null, currentComplexity);
            return;
        }
        let currentNode = queue.shift();
        currentComplexity.nodesVisited++;
        addStep(`Dequeued ${currentNode}. Exploring neighbors...`, "visit", queue, visited, currentNode, currentComplexity);
        
        let neighbors = graphType === 'directed' 
            ? graph.edges.filter(e => e.source === currentNode).map(e => e.target)
            : graph.edges.filter(e => e.source === currentNode).map(e => e.target).concat(graph.edges.filter(e => e.target === currentNode).map(e => e.source));
        
        const uniqueNeighbors = [...new Set(neighbors)].sort();
        let added = false;
        for (const neighbor of uniqueNeighbors) {
            currentComplexity.edgesTraversed++;
            if (!visited.has(neighbor)) {
                visited.add(neighbor); queue.push(neighbor); added = true;
            }
        }
        if (added) addStep(`Enqueued neighbors of ${currentNode}.`, "enqueue", queue, visited, currentNode, currentComplexity);
        else addStep(`No new unvisited neighbors for ${currentNode}.`, "visit", queue, visited, currentNode, currentComplexity);
        setComplexity(currentComplexity);
        setSortState({ queue, visited, currentNode });
    }, [sortState, graph, complexity, addStep, graphType]);

    const setupNewGraph = useCallback((newGraph, startNode = null) => {
        const width = visContainerRef.current?.clientWidth || 600;
        const height = 350; 
        const defaultStartNode = startNode || newGraph.nodes[0]?.id || null;
        const positionedNodes = calculateLayeredLayout(newGraph.nodes, newGraph.edges, defaultStartNode, width, height, graphType);
        setGraph({ nodes: positionedNodes, edges: newGraph.edges });
        setStartNodeId(defaultStartNode);
        resetVisualizationState();
    }, [graphType, resetVisualizationState]);
    
    const handleReset = useCallback(() => {
        const defaultGraph = { nodes: [ { id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }, { id: "F" }, { id: "G" }, { id: "H" } ], edges: [ { source: "A", target: "B" }, { source: "A", target: "C" }, { source: "B", target: "D" }, { source: "B", target: "E" }, { source: "C", target: "F" }, { source: "F", target: "G" }, { source: "E", target: "H" } ] };
        setupNewGraph(defaultGraph);
    }, [setupNewGraph]);
  
    const handleCustomGraph = useCallback(() => {
        try { const parsedGraph = JSON.parse(customInput); if (!parsedGraph.nodes) return; setupNewGraph(parsedGraph); } catch (e) { alert("Invalid JSON"); }
    }, [customInput, setupNewGraph]);

    const loadExampleGraph = useCallback(() => {
        const presetGraph = { nodes: [ { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" } ], edges: [ { source: "1", target: "2" }, { source: "1", target: "3" }, { source: "2", target: "4" }, { source: "2", target: "5" }, { source: "3", target: "6" }, { source: "3", target: "7" } ] };
        setCustomInput(JSON.stringify(presetGraph, null, 2));
        setupNewGraph(presetGraph, "1");
    }, [setupNewGraph]);
  
    const handleClearGraph = () => { setGraph({ nodes: [], edges: [] }); setStartNodeId(null); resetVisualizationState(); };
    useEffect(() => { handleReset(); }, []); 
    useEffect(() => { let timer; if (isSorting && !isPaused && !isFinished) timer = setTimeout(runSortStep, 1000 - speed * 9); return () => clearTimeout(timer); }, [isSorting, isPaused, isFinished, runSortStep, speed]);
    
    const handleCanvasClick = (e) => {
        if (editMode !== 'addNode') return;
        const rect = visContainerRef.current.getBoundingClientRect();
        const newNodeId = generateNewNodeId(graph.nodes);
        const newNode = { id: newNodeId, x: e.clientX - rect.left, y: e.clientY - rect.top };
        setGraph(g => ({ ...g, nodes: [...g.nodes, newNode] }));
        if (!startNodeId) setStartNodeId(newNodeId); else resetVisualizationState();
        setEditMode('none');
    };

    const handleNodeClick = (e, nodeId) => {
        e.stopPropagation();
        if (editMode === 'removeNode') {
            setGraph(g => { return { nodes: g.nodes.filter(n => n.id !== nodeId), edges: g.edges.filter(e => e.source !== nodeId && e.target !== nodeId) }; });
            if (startNodeId === nodeId) setStartNodeId(null); resetVisualizationState(); setEditMode('none');
        } else if (editMode === 'addEdgeStart') { setEdgeStartNode(nodeId); setEditMode('addEdgeEnd'); } 
        else if (editMode === 'addEdgeEnd') {
            if (edgeStartNode && edgeStartNode !== nodeId) { setGraph(g => ({ ...g, edges: [...g.edges, { source: edgeStartNode, target: nodeId }] })); resetVisualizationState(); }
            setEdgeStartNode(null); setEditMode('none');
        }
    };
    
    const toggleSorting = () => {
        if (isFinished || graph.nodes.length === 0 || !startNodeId) return;
        if (isReviewingPastStep) { setIsReviewingPastStep(false); setCurrentStep(steps.length - 1); }
        setIsSorting(true); setIsPaused(!isPaused);
        if (sortState.queue.length === 0 && sortState.visited.size === 0 && !isSorting) {
            const newQueue = [startNodeId]; const newVisited = new Set([startNodeId]);
            setSortState({ ...sortState, queue: newQueue, visited: newVisited });
            addStep(`Starting BFS. Enqueuing Start Node ${startNodeId}.`, "start", newQueue, newVisited, null, complexity);
        }
    };

    const goToStep = (stepIndex) => { if (stepIndex >= 0 && stepIndex < steps.length) { setIsPaused(true); setIsReviewingPastStep(true); setCurrentStep(stepIndex); } };
    const stepForward = () => goToStep(currentStep + 1); const stepBackward = () => goToStep(currentStep - 1);
    const handleCopy = () => { navigator.clipboard.writeText(window.location.href).then(() => { setCopyTooltipText("Copied!"); setTimeout(() => setCopyTooltipText("Copy"), 2000); }); };
    const handleShare = () => { if (navigator.share) navigator.share({ title: "BFS Visualizer", url: window.location.href }); };

    const isLive = !isReviewingPastStep;
    const displayedStep = steps[currentStep] || {};
    const queueToDisplay = isLive ? sortState.queue : displayedStep.queueState;
    const visitedToDisplay = isLive ? sortState.visited : displayedStep.visitedState;
    const currentNodeToDisplay = isLive ? sortState.currentNode : displayedStep.currentNode;
    const complexityToDisplay = isLive ? complexity : displayedStep.complexity;
    
    const getNodeColor = (nodeId) => {
        if (edgeStartNode === nodeId) return "ring-4 ring-yellow-400 bg-yellow-500 scale-110 text-black";
        if (currentNodeToDisplay === nodeId) return "bg-yellow-500 ring-4 ring-yellow-300 scale-110 text-black shadow-lg shadow-yellow-500/50";
        if (visitedToDisplay?.has(nodeId)) return "bg-gradient-to-b from-green-500 to-emerald-600 border-green-400 shadow-green-500/30";
        if (queueToDisplay?.includes(nodeId)) return "bg-gradient-to-b from-pink-500 to-rose-600 border-pink-400 shadow-pink-500/30";
        if (startNodeId === nodeId) return "bg-gradient-to-b from-indigo-500 to-purple-600 ring-2 ring-white shadow-indigo-500/50";
        return isDark ? "bg-slate-700 border-slate-500 hover:bg-slate-600" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50";
    };
    
    const getEditModeMessage = () => {
        switch (editMode) {
            case 'addNode': return "Click on canvas to add Node"; case 'addEdgeStart': return "Select Source Node";
            case 'addEdgeEnd': return "Select Target Node"; case 'removeNode': return "Select Node to Remove"; default: return "";
        }
    };

    const getTabClass = (tabName) => activeTab === tabName ? "text-purple-500 border-b-2 border-purple-500" : (isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-purple-600");

    return (
        <div className={`relative min-h-screen w-full overflow-hidden font-sans transition-colors duration-700 ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}>
            {/* Background System */}
            <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`} style={{ backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
                <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
            </div>

            <main className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center">
                {/* Header */}
                <header className="w-full max-w-7xl mx-auto py-10 animate-fadeIn relative mb-8 mt-15">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-center relative">
                        <div className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1">
                            <Breadcrumb isDark={isDark} />
                        </div>
                        <div className="text-center w-full">
                            <div className={`inline-block text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 border backdrop-blur-sm ${isDark ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-green-50 text-green-600 border-green-200"}`}>
                                Graph Traversal
                            </div>
                            <h1 className={`text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 ${isDark ? "text-white" : "text-slate-900"}`}>
                                BFS Visualizer
                            </h1>
                            <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-slate-500"} max-w-2xl mx-auto mt-4`}>
                                Interactive demonstration of Breadth-First Search.
                            </p>
                            <div className="mt-6 flex justify-center items-center gap-4">
                                <GlossyButton onClick={handleCopy} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Copy className="w-4 h-4" /><span>{copyTooltipText}</span></GlossyButton>
                                <GlossyButton onClick={handleShare} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Share2 className="w-4 h-4" /><span>Share</span></GlossyButton>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="w-full space-y-6 mt-6">
                    <div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
                        <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("visualization")}`} onClick={() => setActiveTab("visualization")}>Visualization</button>
                        <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("explanation")}`} onClick={() => setActiveTab("explanation")}>Explanation</button>
                        <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("code")}`} onClick={() => setActiveTab("code")}>Code & Practice</button>
                        <button className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${getTabClass("quiz")}`} onClick={() => setActiveTab("quiz")}>
                            <BrainCircuit size={16} /> Mastery Arena
                        </button>
                    </div>

                    {activeTab === "visualization" ? (
                        <div className="animate-fadeIn">
                             <ComplexityDisplay complexity={complexityToDisplay} isDark={isDark} />
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    <VisualizationArea
                                        graph={graph} visContainerRef={visContainerRef} handleCanvasClick={handleCanvasClick}
                                        getNodeColor={getNodeColor} handleNodeClick={handleNodeClick} editMode={editMode}
                                        graphType={graphType} isFinished={isFinished} isSorting={isSorting} isPaused={isPaused}
                                        startNodeId={startNodeId} isDark={isDark}
                                    />
                                    <QueueDisplay queue={queueToDisplay} isDark={isDark} />
                                </div>
                                <div className="lg:col-span-1 h-fit sticky top-6">
                                     <BFSControls
                                        isFinished={isFinished} isPaused={isPaused} graph={graph} currentStep={currentStep} steps={steps} speed={speed} editMode={editMode}
                                        startNodeId={startNodeId} setStartNodeId={setStartNodeId} graphType={graphType} setGraphType={setGraphType} isSorting={isSorting}
                                        toggleSorting={toggleSorting} stepBackward={stepBackward} stepForward={stepForward} setSpeed={setSpeed} setEditMode={setEditMode}
                                        handleClearGraph={handleClearGraph} handleReset={handleReset} loadExampleGraph={loadExampleGraph} getEditModeMessage={getEditModeMessage}
                                        customInput={customInput} setCustomInput={setCustomInput} handleCustomGraph={handleCustomGraph} isDark={isDark}
                                    />
                                </div>
                             </div>
                                      <div className="w-full mt-6">
                                          <BFSLogView steps={steps} currentStep={currentStep} goToStep={goToStep} isDark={isDark} />
                                      </div>
                        </div>
                    ) : activeTab === "explanation" ? (
                        <ExplanationTab isDark={isDark} />
                    ) : activeTab === "code" ? (
                        <PremiumCodeReference codeData={BFS_GRAPH_CODE} complexity={BFS_GRAPH_STATS} isDark={isDark} />
                    ) : (
                        <QuizArena algoKey="BFS-in-Graph" isDark={isDark} onMasteryComplete={() => navigate('/dashboard')} />
                    )}
                </div>

                <footer className={`mt-16 text-center text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                    <p>BFS Graph Visualizer - Interactive Algorithm Demonstration</p>
                </footer>
            </main>
        </div>
    );
};

export default BFSVisualizer;