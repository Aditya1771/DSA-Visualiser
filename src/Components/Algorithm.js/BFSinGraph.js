import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

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

// --- ICON COMPONENT ---
const Icon = ({ name, className = "w-4 h-4" }) => {
  const icons = {
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    controls: <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />,
    queue: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />,
    node: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    edge: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />,
    stepBack: <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />,
    stepForward: <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />,
    addNode: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    addEdge: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />,
    clear: <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />,
    reset: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V7.5a3.75 3.75 0 0 1 3.75-3.75H18a3.75 3.75 0 0 1 3.75 3.75v.492" />,
    example: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></>,
    json: <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5-4.5L7.5 12l2.25 2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    info: <><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></>,
    visualization: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>,
    bfs: <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V1.5m0 5.25L3 12m6-5.25 6 5.25M3 12l6 5.25m-6-5.25h12m6 0-6 5.25m6-5.25-6-5.25m6 5.25v5.25" />,
    copy: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-8a2 2 0 0 0 2 2Z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6m4-3 5 5-5 5m5-5H9" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    xmark: <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    time: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    space: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m4.5 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
    home: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />,
    code: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" />,
    comparisons: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

// --- GLOSSY BUTTON ---
const GlossyButton = ({ onClick, disabled, gradientClasses, children, className = '', pulse = true, isDark = true }) => (
    <div className={`relative group ${className}`}>
        <div
            className={`absolute -inset-0.5 ${gradientClasses} rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition duration-300 ${
                disabled ? 'hidden' : ''
            } ${pulse ? 'animate-pulse' : ''}`}
        />
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative w-full h-full p-px text-sm font-semibold rounded-2xl overflow-hidden transition-all duration-300
                ${!disabled ? gradientClasses : 'bg-gray-500/50'}
                ${isDark ? 'text-gray-200' : 'text-white'}
                disabled:cursor-not-allowed`}
        >
            <div className={`relative w-full h-full flex items-center justify-center gap-2 px-3 py-2.5 backdrop-blur-sm rounded-[15px] transition-colors duration-300 
                ${isDark ? 'bg-gray-900/80 group-hover:bg-gray-900/70' : 'bg-white/30 group-hover:bg-white/40'}`}>
                <span className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                <span className="relative z-10 flex items-center justify-center gap-2 shadow-sm text-shadow">
                    {children}
                </span>
            </div>
        </button>
    </div>
);

// --- BREADCRUMB ---
const Breadcrumb = ({ isDark }) => (
  <nav aria-label="Breadcrumb">
    <ol className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
      <li>
        <a href="/" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
          <Icon name="home" className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </a>
      </li>
      <li>
        <Icon name="chevronRight" className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <a href="/algorithms" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'hover:text-white' : 'hover:text-purple-600'}`}>
           <Icon name="grid" className="w-4 h-4" />
           <span className="hidden sm:inline">Dashboard</span>
        </a>
      </li>
      <li>
         <Icon name="chevronRight" className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
      </li>
      <li>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border backdrop-blur-md cursor-default
            ${isDark 
              ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" 
              : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}>
          <Icon name="bfs" className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
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
            <Icon name="chart"/>Analysis
        </h2>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-3 rounded-lg border border-indigo-700/50">
                <h3 className="flex items-center gap-2 text-xs text-indigo-400 mb-1"><Icon name="node"/>Nodes Visited</h3>
                <span className="text-xl font-bold text-indigo-400"><AnimatedNumber value={complexity.nodesVisited} /></span>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-3 rounded-lg border border-pink-700/50">
                <h3 className="flex items-center gap-2 text-xs text-pink-400 mb-1"><Icon name="edge"/>Edges Traversed</h3>
                <span className="text-xl font-bold text-pink-400"><AnimatedNumber value={complexity.edgesTraversed} /></span>
            </div>
        </div>
    </section>
  );
};

const Controls = ({
    isFinished, isPaused, graph, currentStep, steps, speed, editMode,
    startNodeId, setStartNodeId, graphType, setGraphType, isSorting,
    toggleSorting, stepBackward, stepForward, setSpeed, setEditMode, 
    handleClearGraph, handleReset, loadExampleGraph, getEditModeMessage, customInput, setCustomInput, handleCustomGraph, isDark
}) => {
    const playPauseStyles = !isPaused
      ? { gradient: "bg-gradient-to-r from-yellow-400 to-orange-500" }
      : { gradient: "bg-gradient-to-r from-green-400 to-emerald-500" };

    const cardClass = isDark 
      ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" 
      : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    const textClass = isDark ? "text-gray-300" : "text-slate-700";
    const labelClass = isDark ? "text-gray-400" : "text-slate-500";
    const inputClass = isDark 
        ? "bg-gray-900/80 border-white/10 text-white focus:ring-purple-500 disabled:bg-gray-800/50" 
        : "bg-white border-slate-200 text-slate-800 focus:ring-purple-500 disabled:bg-slate-100 disabled:text-slate-400";
    const selectClass = isDark
        ? "bg-gray-900/80 border-white/10 text-white"
        : "bg-white border-slate-200 text-slate-800";

    return (
      <section className={`${cardClass} rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/20 h-full`}>
        <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${textClass}`}>
          <Icon name="controls"/>Controls
        </h2>
        <div className="flex flex-col space-y-6">
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <GlossyButton onClick={toggleSorting} disabled={isFinished || graph.nodes.length === 0} gradientClasses={playPauseStyles.gradient} className="w-full" isDark={isDark}>
                  {!isPaused ? <><Icon name="pause"/>Pause</> : <><Icon name="play"/>Play</>}
                </GlossyButton>
              </div>
              <GlossyButton onClick={handleReset} gradientClasses="bg-gradient-to-r from-red-500 to-pink-500" className="w-full" isDark={isDark}>
                <Icon name="arrow-refresh" />
              </GlossyButton>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <GlossyButton onClick={stepBackward} disabled={currentStep <= 0} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" className="w-full" isDark={isDark}>
                <Icon name="stepBack"/>Back
              </GlossyButton>
              <GlossyButton onClick={stepForward} disabled={currentStep >= steps.length - 1} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" className="w-full" isDark={isDark}>
                Next<Icon name="stepForward"/>
              </GlossyButton>
            </div>

            <div className={`space-y-3 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}>
                 <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className={`text-xs ${labelClass} mb-1 block`}>Start Node</label>
                        <select
                            value={startNodeId || ''}
                            onChange={(e) => setStartNodeId(e.target.value)}
                            disabled={graph.nodes.length === 0 || isSorting}
                            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 text-sm ${selectClass}`}
                        >
                            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                        </select>
                     </div>
                     <div>
                         <label className={`text-xs ${labelClass} mb-1 block`}>Type</label>
                         <div className={`flex rounded-xl p-1 border ${isDark ? 'bg-gray-900/80 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                            <button onClick={() => setGraphType('undirected')} className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${graphType === 'undirected' ? 'bg-purple-600 text-white' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}>Undir</button>
                            <button onClick={() => setGraphType('directed')} className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${graphType === 'directed' ? 'bg-purple-600 text-white' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}>Dir</button>
                         </div>
                     </div>
                 </div>
            </div>

             <div className={`space-y-3 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}>
                <h3 className={`flex items-center gap-2 text-sm font-semibold ${labelClass}`}><Icon name="edit"/>Editor</h3>
                <div className="grid grid-cols-3 gap-2">
                    <GlossyButton onClick={() => setEditMode('addNode')} gradientClasses={editMode === 'addNode' ? "bg-gradient-to-r from-purple-500 to-indigo-500" : (isDark ? "bg-gray-700" : "bg-slate-400")} className="w-full" pulse={false} isDark={isDark}><Icon name="addNode"/></GlossyButton>
                    <GlossyButton onClick={() => setEditMode('addEdgeStart')} gradientClasses={editMode.startsWith('addEdge') ? "bg-gradient-to-r from-purple-500 to-indigo-500" : (isDark ? "bg-gray-700" : "bg-slate-400")} className="w-full" pulse={false} isDark={isDark}><Icon name="addEdge"/></GlossyButton>
                    <GlossyButton onClick={() => setEditMode('removeNode')} gradientClasses={editMode === 'removeNode' ? "bg-gradient-to-r from-red-500 to-orange-500" : (isDark ? "bg-gray-700" : "bg-slate-400")} className="w-full" pulse={false} isDark={isDark}><Icon name="clear"/></GlossyButton>
                </div>
                <div className="grid grid-cols-2 gap-2">
                     <GlossyButton onClick={loadExampleGraph} gradientClasses="bg-gradient-to-r from-teal-400 to-emerald-500" className="w-full" pulse={false} isDark={isDark}>Example</GlossyButton>
                     <GlossyButton onClick={handleClearGraph} gradientClasses="bg-gradient-to-r from-red-600 to-red-800" className="w-full" pulse={false} isDark={isDark}>Clear</GlossyButton>
                </div>
                <div className="min-h-[20px] text-[10px] text-yellow-500 text-center font-medium">{getEditModeMessage()}</div>
            </div>

            <div className={`space-y-2 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}>
              <label className={`text-xs ${labelClass}`}>Animation Speed</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(e.target.value)} className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDark ? "bg-gray-700" : "bg-slate-300"}`} />
                <span className={`text-xs font-medium w-10 ${textClass}`}>{speed}%</span>
              </div>
            </div>

             <div className={`space-y-2 pt-4 border-t ${isDark ? "border-gray-700/50" : "border-slate-200"}`}>
                 <label className={`text-xs ${labelClass}`}>JSON Input</label>
                 <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={customInput} 
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder='{"nodes":..., "edges":...}'
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 text-xs font-mono ${inputClass}`}
                     />
                     <GlossyButton onClick={handleCustomGraph} gradientClasses="bg-gradient-to-r from-purple-500 to-pink-500" className="w-20 text-xs" isDark={isDark}>Load</GlossyButton>
                 </div>
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
            <Icon name="queue"/>Queue
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
                    <Icon name="chart"/>Graph Visualization
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

const LogView = ({ steps, currentStep, goToStep, logViewRef, isDark }) => {
    const getStepStyle = (type) => ({ 
        start: "bg-indigo-600/90", 
        visit: "bg-purple-600/90", 
        enqueue: "bg-pink-600/90", 
        finish: "bg-teal-600/90" 
    }[type] || "bg-gray-600/90");

    const cardClass = isDark 
        ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md" 
        : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    const titleClass = isDark ? "text-gray-300" : "text-slate-700";
    const subTextClass = isDark ? "text-gray-400" : "text-slate-500";

    return (
        <section className={`${cardClass} rounded-xl p-6 border shadow-lg mt-6`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`flex items-center gap-2 text-lg font-semibold ${titleClass}`}>
                    <Icon name="info"/>Log
                </h2>
                <span className={`text-xs ${subTextClass}`}>Step {currentStep + 1}/{steps.length}</span>
            </div>
            <div ref={logViewRef} className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {steps.map((step, index) => {
                    const isCurrent = index === currentStep;
                    const logMessageStyle = `p-3 rounded-lg shadow-sm transition-all duration-300 cursor-pointer ${getStepStyle(step.type)} ${
                        isCurrent
                        ? 'ring-2 ring-offset-2 ring-purple-400 opacity-100'
                        : 'opacity-70 hover:opacity-100'
                    } ${isCurrent && !isDark ? 'ring-offset-slate-100' : 'ring-offset-gray-800'}`;

                    return (
                        <div key={index} onClick={() => goToStep(index)} className={logMessageStyle}>
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-white/80 text-xs pt-0.5">{index + 1}.</span>
                                <div className="flex-1">
                                    <p className="text-white text-xs">{step.message}</p>
                                    {step.queueState && (
                                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                                            <span className="text-[10px] font-bold text-white/60 mr-1">Q:</span>
                                            {step.queueState.length > 0 ? (
                                                step.queueState.map((nodeId, idx) => (
                                                    <div key={idx} className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-white/20 text-white">
                                                        {nodeId}
                                                    </div>
                                                ))
                                            ) : <span className="text-[10px] italic text-white/40">empty</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
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
    const sectionClasses = `${cardClass} p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/10`;
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
            description: "Start at the root node 'A'. Add 'A' to the Queue and mark it as 'Current'.", 
            queue: ["A"], 
            currentNode: "A",
            nodeStates: { A: 'current', B: 'default', C: 'default', D: 'default', E: 'default', F: 'default' } 
        },
        { 
            id: 2,
            title: "Explore A", 
            description: "Process 'A'. Found unvisited neighbors 'B' and 'C'. Mark 'A' visited, enqueue B and C.", 
            queue: ["B", "C"], 
            currentNode: "A",
            nodeStates: { A: 'visited', B: 'queue', C: 'queue', D: 'default', E: 'default', F: 'default' } 
        },
        { 
            id: 3,
            title: "Process B", 
            description: "Dequeue 'B'. It becomes current. Explore its neighbors 'D' and 'F'.", 
            queue: ["C"], 
            currentNode: "B",
            nodeStates: { A: 'visited', B: 'current', C: 'queue', D: 'default', E: 'default', F: 'default' } 
        },
        { 
            id: 4,
            title: "Explore B", 
            description: "Add unvisited neighbors 'D' and 'F' to Queue. Mark 'B' visited.", 
            queue: ["C", "D", "F"], 
            currentNode: "B",
            nodeStates: { A: 'visited', B: 'visited', C: 'queue', D: 'queue', F: 'queue', E: 'default' } 
        },
        { 
            id: 5,
            title: "Process C", 
            description: "Dequeue 'C'. Explore its neighbor 'E'.", 
            queue: ["D", "F"], 
            currentNode: "C",
            nodeStates: { A: 'visited', B: 'visited', C: 'current', D: 'queue', F: 'queue', E: 'default' } 
        },
        { 
            id: 6,
            title: "Explore C", 
            description: "Add 'E' to Queue. Mark 'C' visited.", 
            queue: ["D", "F", "E"], 
            currentNode: "C",
            nodeStates: { A: 'visited', B: 'visited', C: 'visited', D: 'queue', F: 'queue', E: 'queue' } 
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div className={sectionClasses}>
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                    <Icon name="grid" className="w-6 h-6 text-purple-400"/> Breadth-First Search (BFS)
                </h2>
                <p className={`leading-relaxed text-sm ${textColor}`}>
                    BFS is a fundamental graph traversal algorithm. It starts at a selected node (root) and explores all of its neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. It uses a <strong>Queue</strong> data structure to keep track of visited vertices.
                </p>
            </div>

             <div className={sectionClasses}>
                <h3 className={`flex items-center justify-center gap-2 text-lg font-bold mb-8 ${titleColor}`}>
                    <Icon name="example"/> Detailed Step-by-Step Walkthrough
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {walkthroughSteps.map((step, index) => (
                        <BFSWalkthroughStep 
                            key={index} 
                            data={step} 
                            graphData={exampleGraphData} 
                            isDark={isDark} 
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={sectionClasses}>
                    <h3 className={`flex items-center gap-2 text-lg font-bold mb-4 ${titleColor}`}><Icon name="check" className="text-green-500"/> Pros</h3>
                    <ul className={`space-y-2 text-sm ${listColor}`}>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Finds shortest path in unweighted graphs.</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Complete: Will find a solution if one exists.</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Great for finding connected components.</li>
                    </ul>
                </div>
                <div className={sectionClasses}>
                    <h3 className={`flex items-center gap-2 text-lg font-bold mb-4 ${titleColor}`}><Icon name="xmark" className="text-red-500"/> Cons</h3>
                    <ul className={`space-y-2 text-sm ${listColor}`}>
                         <li className="flex gap-2"><span className="text-red-500">✗</span> Memory intensive (stores all nodes at current level).</li>
                         <li className="flex gap-2"><span className="text-red-500">✗</span> Slower than DFS if target is deep in graph.</li>
                    </ul>
                </div>
            </div>

             <div className={sectionClasses}>
                <h3 className={`flex items-center gap-2 text-lg font-bold mb-6 ${titleColor}`}>
                    <Icon name="chart"/> Complexity Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${innerCardClass} p-6 rounded-lg border text-center`}>
                        <h4 className={`flex items-center justify-center gap-2 text-base font-semibold mb-3 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                            <Icon name="time" className="w-5 h-5" /> Time Complexity
                        </h4>
                        <p className={`font-bold text-2xl mb-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>O(V + E)</p>
                        <p className={`text-xs ${listColor}`}>
                            Where <strong>V</strong> is the number of vertices and <strong>E</strong> is the number of edges. We visit every vertex and explore every edge once.
                        </p>
                    </div>

                     <div className={`${innerCardClass} p-6 rounded-lg border text-center`}>
                        <h4 className={`flex items-center justify-center gap-2 text-base font-semibold mb-3 ${isDark ? 'text-sky-300' : 'text-sky-600'}`}>
                            <Icon name="space" className="w-5 h-5" /> Space Complexity
                        </h4>
                        <div className="text-center">
                            <p className={`font-bold text-2xl mb-2 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>O(V)</p>
                            <p className={`text-xs ${listColor}`}>
                                In the worst case (e.g., a star graph), the Queue might need to store the majority of vertices at once.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

//==============================================================================
// Main BFSVisualizer Component
//==============================================================================
const BFSVisualizer = () => {
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

    const logViewRef = useRef(null);
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
    useEffect(() => { if (logViewRef.current && !isReviewingPastStep) logViewRef.current.scrollTop = logViewRef.current.scrollHeight; }, [steps, isReviewingPastStep]);
    
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
                                <GlossyButton onClick={handleCopy} gradientClasses="bg-gradient-to-r from-purple-600 to-indigo-600" className="w-[150px]" isDark={isDark}><Icon name="copy" /><span>{copyTooltipText}</span></GlossyButton>
                                <GlossyButton onClick={handleShare} gradientClasses="bg-gradient-to-r from-pink-600 to-purple-600" className="w-[150px]" isDark={isDark}><Icon name="share" /><span>Share</span></GlossyButton>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="w-full space-y-6 mt-6">
                    <div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
                        <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("visualization")}`} onClick={() => setActiveTab("visualization")}>Visualization</button>
                        <button className={`px-4 py-2 text-sm font-medium transition-colors ${getTabClass("explanation")}`} onClick={() => setActiveTab("explanation")}>Explanation</button>
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
                                    <LogView steps={steps} currentStep={currentStep} goToStep={goToStep} logViewRef={logViewRef} isDark={isDark} />
                                </div>
                                <div className="lg:col-span-1 h-fit sticky top-6">
                                     <Controls
                                        isFinished={isFinished} isPaused={isPaused} graph={graph} currentStep={currentStep} steps={steps} speed={speed} editMode={editMode}
                                        startNodeId={startNodeId} setStartNodeId={setStartNodeId} graphType={graphType} setGraphType={setGraphType} isSorting={isSorting}
                                        toggleSorting={toggleSorting} stepBackward={stepBackward} stepForward={stepForward} setSpeed={setSpeed} setEditMode={setEditMode}
                                        handleClearGraph={handleClearGraph} handleReset={handleReset} loadExampleGraph={loadExampleGraph} getEditModeMessage={getEditModeMessage}
                                        customInput={customInput} setCustomInput={setCustomInput} handleCustomGraph={handleCustomGraph} isDark={isDark}
                                    />
                                </div>
                             </div>
                        </div>
                    ) : (
                        <ExplanationTab isDark={isDark} />
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