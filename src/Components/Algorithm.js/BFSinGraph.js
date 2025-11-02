import { useState, useEffect, useCallback, useRef } from "react";

//==============================================================================
// Icon Component
// Renders various SVG icons based on the provided 'name' prop.
//==============================================================================
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.25A2.25 2.25 0 0 0 18 3H6A2.25 2.25 0 0 0 3.75 5.25v12.75A2.25 2.25 0 0 0 6 20.25Z" />,
    controls: <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />,
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
// Helper Functions & Small Components
//==============================================================================

const SmallExampleNode = ({ label, color, style }) => {
    const colors = { 
      default: "bg-blue-600", 
      visited: "bg-green-500", 
      queue: "bg-pink-500" 
    };
    const nodeColorClass = colors[color] || colors.default;
    const baseClasses = "absolute w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs transition-colors duration-300 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-700/50";
    
    return (
      <div style={style} className={`${baseClasses} ${nodeColorClass}`}>
        {label}
      </div>
    );
};

// ==============================================================================
// MODIFIED: This function now uses a barycenter heuristic to sort nodes within
// each layer, preventing overlaps and creating a stable layout.
// ==============================================================================
const calculateLayeredLayout = (nodes, edges, startNodeId, width, height, graphType = 'undirected') => {
    if (!nodes.length) return [];

    const positions = {};
    const adj = new Map();
    const reverseAdj = new Map();
    nodes.forEach(node => {
        adj.set(node.id, []);
        reverseAdj.set(node.id, []);
    });
    edges.forEach(({ source, target }) => {
        adj.get(source)?.push(target);
        reverseAdj.get(target)?.push(source);
        if (graphType === 'undirected') {
            adj.get(target)?.push(source);
            reverseAdj.get(source)?.push(target);
        }
    });

    const components = [];
    const visitedNodes = new Set();
    for (const node of nodes) {
        if (!visitedNodes.has(node.id)) {
            const component = [];
            const q = [node.id];
            visitedNodes.add(node.id);
            let head = 0;
            while (head < q.length) {
                const u = q[head++];
                component.push(u);
                adj.get(u)?.forEach(v => {
                    if (!visitedNodes.has(v)) {
                        visitedNodes.add(v);
                        q.push(v);
                    }
                });
            }
            components.push(component);
        }
    }
    
    for (const component of components) {
        const componentStartNode = component.includes(startNodeId) ? startNodeId : component[0];
        const levels = [];
        const visitedInComponent = new Set();
        const queue = [{ id: componentStartNode, level: 0 }];
        visitedInComponent.add(componentStartNode);
        
        let head = 0;
        while(head < queue.length) {
            const { id: u, level } = queue[head++];
            if (levels.length <= level) levels.push([]);
            levels[level].push(u);
            adj.get(u)?.forEach(v => {
                if (component.includes(v) && !visitedInComponent.has(v)) {
                    visitedInComponent.add(v);
                    queue.push({ id: v, level: level + 1 });
                }
            });
        }
        
        // Barycenter heuristic to minimize edge crossings
        for (let i = 1; i < levels.length; i++) {
            const layer = levels[i];
            const prevLayer = levels[i-1];
            const parentPositions = new Map(prevLayer.map((node, index) => [node, index]));

            layer.sort((a, b) => {
                const parentsA = reverseAdj.get(a)?.filter(p => parentPositions.has(p));
                const parentsB = reverseAdj.get(b)?.filter(p => parentPositions.has(p));
                
                const avgPosA = parentsA.reduce((sum, p) => sum + parentPositions.get(p), 0) / (parentsA.length || 1);
                const avgPosB = parentsB.reduce((sum, p) => sum + parentPositions.get(p), 0) / (parentsB.length || 1);
                
                return avgPosA - avgPosB;
            });
        }
        
        levels.forEach((levelNodes, i) => {
            const layerHeight = height / (levels.length + 1);
            const y = (i + 1) * layerHeight;
            levelNodes.forEach((nodeId, j) => {
                const layerWidth = width / (levelNodes.length + 1);
                const x = (j + 1) * layerWidth;
                positions[nodeId] = { x, y };
            });
        });
    }

    return nodes.map(node => ({
        ...node,
        x: positions[node.id]?.x || Math.random() * (width - 80) + 40,
        y: positions[node.id]?.y || Math.random() * (height - 80) + 40,
    }));
};


const generateNewNodeId = (existingNodes) => {
    const existingIds = new Set(existingNodes.map(n => n.id));

    if (existingNodes.length === 0) return "A";

    const lastNode = existingNodes[existingNodes.length - 1];
    const lastId = lastNode.id;
    const lastIdAsNum = parseInt(lastId, 10);

    if (!isNaN(lastIdAsNum) && String(lastIdAsNum) === lastId) {
        let nextNum = lastIdAsNum + 1;
        while (existingIds.has(String(nextNum))) nextNum++;
        return String(nextNum);
    }
    
    if (lastId.length === 1 && lastId.toUpperCase() >= 'A' && lastId.toUpperCase() <= 'Z') {
        let nextCharCode = lastId.charCodeAt(0) + 1;
        while (existingIds.has(String.fromCharCode(nextCharCode))) nextCharCode++;
        if (nextCharCode <= 'Z'.charCodeAt(0)) {
            return String.fromCharCode(nextCharCode);
        }
    }
    
    const numericIds = existingNodes.map(n => parseInt(n.id, 10)).filter(n => !isNaN(n));
    if (numericIds.length > 0) {
        let nextNum = Math.max(...numericIds, 0) + 1;
        while (existingIds.has(String(nextNum))) nextNum++;
        return String(nextNum);
    } else {
        let maxCharCode = 64;
        existingNodes.forEach(n => {
            if (n.id.length === 1 && n.id.toUpperCase() >= 'A' && n.id.toUpperCase() <= 'Z') {
                maxCharCode = Math.max(maxCharCode, n.id.charCodeAt(0));
            }
        });
        let nextCharCode = maxCharCode + 1;
        while (existingIds.has(String.fromCharCode(nextCharCode))) nextCharCode++;
        return String.fromCharCode(nextCharCode);
    }
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
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/40 p-4 rounded-lg border border-indigo-700/50">
                <h3 className="flex items-center gap-2 text-sm text-indigo-300 mb-1">
                    <Icon name="node"/>
                    Nodes Visited
                </h3>
                <span className="text-2xl font-bold text-indigo-300">{complexity.nodesVisited}</span>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/40 p-4 rounded-lg border border-pink-700/50">
                <h3 className="flex items-center gap-2 text-sm text-pink-300 mb-1">
                    <Icon name="edge"/>
                    Edges Traversed
                </h3>
                <span className="text-2xl font-bold text-pink-300">{complexity.edgesTraversed}</span>
            </div>
        </div>
    </section>
);

const Controls = ({
    isFinished, isPaused, graph, currentStep, steps, speed, editMode,
    startNodeId, setStartNodeId, graphType, setGraphType, isSorting,
    toggleSorting, stepBackward, stepForward, setSpeed, setEditMode, 
    handleClearGraph, handleReset, loadExampleGraph, getEditModeMessage,
}) => (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
            <Icon name="controls"/>Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-400">Algorithm Controls</h3>
                <div className="flex flex-wrap gap-3 items-center">
                     <button
                        onClick={toggleSorting}
                        disabled={isFinished || graph.nodes.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium w-32 justify-center ${!isPaused ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} disabled:bg-gray-700 disabled:cursor-not-allowed`}
                    >
                        {!isPaused ? <><Icon name="pause"/>Pause</> : <><Icon name="play"/>Play</>}
                    </button>
                    <button
                        onClick={stepBackward}
                        disabled={currentStep <= 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        <Icon name="stepBack"/>Back
                    </button>
                    <button
                        onClick={stepForward}
                        disabled={currentStep >= steps.length - 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        Forward<Icon name="stepForward"/>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label htmlFor="start-node-select" className="text-sm text-gray-400">Start Node</label>
                        <select
                            id="start-node-select"
                            value={startNodeId || ''}
                            onChange={(e) => setStartNodeId(e.target.value)}
                            disabled={graph.nodes.length === 0 || isSorting}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white disabled:bg-gray-800/50"
                        >
                            {graph.nodes.map(node => (
                                <option key={node.id} value={node.id}>{node.id}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Graph Type</label>
                        <div className="flex gap-1 rounded-lg bg-gray-700 p-1">
                            <button
                                onClick={() => setGraphType('undirected')}
                                disabled={isSorting}
                                className={`flex-1 py-1 rounded-md text-sm font-medium transition-colors ${graphType === 'undirected' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600 text-gray-300'} disabled:cursor-not-allowed`}
                            >
                                Undirected
                            </button>
                            <button
                                onClick={() => setGraphType('directed')}
                                disabled={isSorting}
                                className={`flex-1 py-1 rounded-md text-sm font-medium transition-colors ${graphType === 'directed' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600 text-gray-300'} disabled:cursor-not-allowed`}
                            >
                                Directed
                            </button>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Animation Speed</label>
                    <div className="flex items-center gap-3">
                        <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                        <span className="text-sm font-medium w-10">{speed}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-400">
                    <Icon name="edit"/>Graph Editor
                </h3>
                <div className="flex flex-wrap gap-3 items-center">
                    <button
                        onClick={() => setEditMode('addNode')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${editMode === 'addNode' ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-purple-800 hover:bg-purple-700'}`}
                    >
                        <Icon name="addNode"/>Node
                    </button>
                    <button
                        onClick={() => setEditMode('addEdgeStart')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${editMode.startsWith('addEdge') ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-purple-800 hover:bg-purple-700'}`}
                    >
                        <Icon name="addEdge"/>Edge
                    </button>
                    <button
                        onClick={() => setEditMode('removeNode')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${editMode === 'removeNode' ? 'bg-red-600 ring-2 ring-red-400' : 'bg-red-800 hover:bg-red-700'}`}
                    >
                        <Icon name="clear"/>Remove
                    </button>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700">
                        <Icon name="reset"/>Reset
                    </button>
                     <button onClick={loadExampleGraph} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700">
                        <Icon name="example"/>Example
                    </button>
                     <button
                        onClick={handleClearGraph}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700"
                    >
                        <Icon name="clear"/>Clear All
                    </button>
                </div>
                <div className="h-6 text-yellow-400 font-medium">{getEditModeMessage()}</div>
            </div>
        </div>
    </section>
);

const JsonInput = ({ customInput, setCustomInput, isSorting, handleCustomGraph }) => (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
        <label className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
            <Icon name="json"/>JSON Input
        </label>
        <div className="flex gap-2 mt-2">
            <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={'{\n  "nodes": [{ "id": "A" }, { "id": "B" }],\n  "edges": [{ "source": "A", "target": "B" }]\n}'}
                disabled={isSorting}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white disabled:bg-gray-800 h-24 font-mono text-xs"
            />
            <button
                onClick={handleCustomGraph}
                disabled={isSorting}
                className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 self-start"
            >
                Load
            </button>
        </div>
    </section>
);

const QueueDisplay = ({ queue }) => (
    <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-300">
            <Icon name="queue"/>Queue
        </h2>
        <div className="flex items-center bg-gray-900/50 rounded-lg p-4 min-h-[6rem] overflow-x-auto">
            <span className="text-sm font-bold text-gray-400 mr-4">Front</span>
            <div className="flex-1 flex items-center gap-2">
                {queue?.map((nodeId) => (
                    <div key={nodeId} className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold bg-pink-600 shadow-md">
                        {nodeId}
                    </div>
                ))}
                {queue?.length === 0 && (
                    <span className="text-gray-500 italic">Queue is empty</span>
                )}
            </div>
            <span className="text-sm font-bold text-gray-400 ml-4">Back</span>
        </div>
    </section>
);

const VisualizationArea = ({
    graph, visContainerRef, handleCanvasClick, getNodeColor, handleNodeClick, 
    editMode, graphType, isFinished, isSorting, isPaused, startNodeId
}) => {
    
    const edgeSet = new Set(graph.edges.map(e => `${e.source}->${e.target}`));

    const getStatusMessage = () => {
        if (isFinished) {
          return (
            <div className="text-center text-green-400 font-bold text-xl p-4 rounded-lg bg-green-900/30">
              BFS Complete! All reachable nodes have been visited.
            </div>
          );
        }
        
        if (isSorting && !isPaused) {
           return (
              <div className="text-center text-yellow-400 font-bold text-xl p-4 rounded-lg bg-yellow-900/30 animate-pulse">
                Traversing from node <span className="text-white font-mono">{startNodeId}</span>...
              </div>
           );
        }
        
        if (startNodeId) {
           return (
              <div className="text-center text-gray-400 font-bold text-lg p-4 rounded-lg bg-gray-700/30">
                Ready to traverse from <span className="text-white font-mono">{startNodeId}</span>. Press Play.
              </div>
           );
        }
        
        return (
            <div className="text-center text-gray-500 text-lg p-4">
                Create a graph or select a start node to begin.
            </div>
        );
    };

    return (
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-300">
                    <Icon name="visualization"/>
                    Visualization
                </h2>
            </div>

            <div className="mb-6 min-h-[4rem] flex items-center justify-center">
                {getStatusMessage()}
            </div>
            
            <div
                ref={visContainerRef}
                className={`relative w-full h-96 bg-gray-900/50 rounded-lg ${editMode === 'addNode' ? 'cursor-crosshair' : 'cursor-default'}`}
                onClick={handleCanvasClick}
            >
                <svg className="absolute top-0 left-0 w-full h-full">
                    <defs>
                        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ec4899" floodOpacity="0.6" />
                        </filter>
                        <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ec4899" />
                        </marker>
                    </defs>
                    {graph.edges.map((edge, i) => {
                        const s = graph.nodes.find(n => n.id === edge.source);
                        const t = graph.nodes.find(n => n.id === edge.target);
                        if (!s || !t) return null;
                        
                        const dx = t.x - s.x;
                        const dy = t.y - s.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist === 0) return null;

                        const hasReverseEdge = edgeSet.has(`${t.id}->${s.id}`);
                        let curve = 15;

                        if (hasReverseEdge) {
                             curve = (s.id > t.id) ? 30 : -30;
                        }

                        const midpointX = (s.x + t.x) / 2;
                        const midpointY = (s.y + t.y) / 2;
                        const controlX = midpointX + curve * (dy / dist);
                        const controlY = midpointY - curve * (dx / dist);
                        
                        let endPoint = { x: t.x, y: t.y };
                        const nodeRadius = 30;

                        if (graphType === 'directed') {
                             const tangentDx = t.x - controlX;
                             const tangentDy = t.y - controlY;
                             const tangentDist = Math.sqrt(tangentDx*tangentDx + tangentDy*tangentDy);
                             if (tangentDist > 0) {
                                endPoint.x = t.x - (tangentDx / tangentDist) * nodeRadius;
                                endPoint.y = t.y - (tangentDy / tangentDist) * nodeRadius;
                             }
                        }
                        
                        const pathData = `M ${s.x} ${s.y} Q ${controlX} ${controlY} ${endPoint.x} ${endPoint.y}`;

                        return (
                            <path
                                key={`${edge.source}-${edge.target}`}
                                d={pathData}
                                fill="none"
                                stroke="url(#edgeGradient)"
                                strokeWidth="2.5"
                                filter="url(#glow)"
                                markerEnd={graphType === 'directed' ? "url(#arrow)" : "none"}
                            />
                        );
                    })}
                </svg>

                {graph.nodes.map((node) => (
                    <div
                        key={node.id}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-gray-900/50 ${editMode !== 'none' ? 'cursor-pointer' : ''} ${getNodeColor(node.id)}`}
                        style={{ left: `${node.x}px`, top: `${node.y}px` }}
                        onClick={(e) => handleNodeClick(e, node.id)}
                    >
                        {node.id}
                    </div>
                ))}
            </div>
        </section>
    );
};

const LogView = ({ steps, currentStep, goToStep, logViewRef }) => {
    const getStepStyle = (type) => ({ 
        start: "bg-indigo-600/90", 
        visit: "bg-purple-600/90", 
        enqueue: "bg-yellow-500/90", 
        finish: "bg-teal-600/90" 
    }[type] || "bg-gray-600/90");

    return (
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-300">
                    <Icon name="info"/>Algorithm Execution Log
                </h2>
                <span className="text-sm text-gray-400">Viewing Step {currentStep + 1} of {steps.length}</span>
            </div>
            <div ref={logViewRef} className="max-h-96 overflow-y-auto pr-2 space-y-2">
                {steps.map((step, index) => {
                    const isCurrent = index === currentStep;
                    const ringClass = 'ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400';
                    const opacityClass = 'opacity-60 hover:opacity-100';
                    const logItemClasses = `m-3 p-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${getStepStyle(step.type)} ${isCurrent ? ringClass : opacityClass}`;
                    
                    return (
                        <div key={index} onClick={() => goToStep(index)} className={logItemClasses}>
                            <div className="flex items-start gap-2 m-2">
                                <span className="font-bold text-white/80">{index + 1}.</span>
                                <p className="text-white text-sm">{step.message}</p>
                            </div>
                            {step.queueState && (
                                <div className="mt-2 flex flex-wrap items-center gap-2 px-2">
                                    <span className="text-xs font-bold text-gray-300">Queue:</span>
                                    {step.queueState.length > 0 ? (
                                        step.queueState.map((nodeId, idx) => (
                                            <div key={idx} className="px-2 py-1 rounded text-xs font-bold bg-pink-600/80 text-white">
                                                {nodeId}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-xs italic text-gray-400">empty</span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const ExplanationTab = () => {
    const exampleGraphData = {
      nodes: [
        { id: "A", x: 30, y: 70 }, { id: "B", x: 100, y: 40 },
        { id: "C", x: 100, y: 100 }, { id: "D", x: 170, y: 40 },
        { id: "F", x: 170, y: 80 }, { id: "E", x: 170, y: 120 },
      ],
      edges: [
        { source: "A", target: "B" }, { source: "A", target: "C" },
        { source: "B", target: "D" }, { source: "B", target: "F" },
        { source: "C", target: "E" }, { source: "D", target: "E" },
      ]
    };
    const walkthroughSteps = [
        { title: "Step 1: Start at A", description: "The process begins by adding the starting node 'A' to the front of the queue.", queue: ["A"], nodeStates: {A: 'queue'} },
        { title: "Step 2: Dequeue A", description: "Dequeue 'A' and mark it as visited. Add its unvisited neighbors, 'B' and 'C', to the back of the queue.", queue: ["B", "C"], nodeStates: {A: 'visited', B: 'queue', C: 'queue'} },
        { title: "Step 3: Dequeue B", description: "Dequeue 'B' and mark it as visited. Add its unvisited neighbors, 'D' and 'F', to the back of the queue.", queue: ["C", "D", "F"], nodeStates: {A: 'visited', B: 'visited', C: 'queue', D: 'queue', F: 'queue'} },
        { title: "Step 4: Dequeue C", description: "Dequeue 'C' and mark it as visited. Add its unvisited neighbor, 'E', to the back of the queue.", queue: ["D", "F", "E"], nodeStates: {A: 'visited', B: 'visited', C: 'visited', D: 'queue', F: 'queue', E: 'queue'} },
        { title: "Step 5: Dequeue D", description: "Dequeue 'D' and mark it as visited. Its neighbor 'E' is already in the queue, and 'B' is visited, so no nodes are added.", queue: ["F", "E"], nodeStates: {A: 'visited', B: 'visited', C: 'visited', D: 'visited', F: 'queue', E: 'queue'} },
        { title: "Step 6: Dequeue F", description: "Dequeue 'F' and mark it as visited. Its neighbor 'B' is already visited, so the queue remains unchanged.", queue: ["E"], nodeStates: {A: 'visited', B: 'visited', C: 'visited', D: 'visited', F: 'visited', E: 'queue'} },
        { title: "Step 7: Dequeue E", description: "Dequeue 'E' and mark it as visited. Its neighbors 'C' and 'D' are already visited. The queue is now empty.", queue: [], nodeStates: {A: 'visited', B: 'visited', C: 'visited', D: 'visited', F: 'visited', E: 'visited'} },
    ];

    return (
        <section className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-lg text-gray-300">
            <div className="max-w-4xl mx-auto space-y-12">
                <div>
                    <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        What is Breadth-First Search (BFS)?
                    </h2>
                    <p className="text-lg leading-relaxed">
                        Breadth-First Search (BFS) is a graph traversal algorithm that explores vertices "layer by layer". It starts at a selected node and explores all of its neighbors at the present depth before moving on to the nodes at the next depth level, making it perfect for finding the shortest path in an unweighted graph.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Key Characteristics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-purple-300">Finds Shortest Path</h4>
                            <p className="text-sm text-gray-400 mt-1">In an unweighted graph, BFS guarantees finding the shortest path between the start node and any other reachable node.</p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-purple-300">Uses a Queue</h4>
                            <p className="text-sm text-gray-400 mt-1">It uses a First-In, First-Out (FIFO) queue to keep track of the next vertices to visit.</p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-purple-300">Completeness</h4>
                            <p className="text-sm text-gray-400 mt-1">If there is a path, BFS is guaranteed to find it and will explore every reachable node.</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-200">
                        <Icon name="example"/>Example Walkthrough
                    </h3>
                    <div className="bg-gray-700/50 p-6 rounded-lg">
                        <div className="relative border-l-2 border-gray-600/50 pl-10 space-y-12">
                            {walkthroughSteps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="absolute left-[-45px] top-1 w-5 h-5 rounded-full bg-purple-400 ring-8 ring-gray-800/50 flex items-center justify-center font-bold text-xs">{index + 1}</div>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="md:w-3/5">
                                            <h4 className="text-lg font-bold text-purple-300">{step.title}</h4>
                                            <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                                            <div className="mt-2 font-mono text-sm text-gray-300">
                                                <strong>Queue:</strong> [{step.queue.join(', ')}]
                                            </div>
                                        </div>
                                        <div className="w-full md:w-2/5 h-36 relative bg-gray-900/40 rounded-lg border border-gray-600/50">
                                            <svg className="absolute top-0 left-0 w-full h-full">
                                                {exampleGraphData.edges.map((edge, i) => {
                                                    const s = exampleGraphData.nodes.find(n => n.id === edge.source);
                                                    const t = exampleGraphData.nodes.find(n => n.id === edge.target);
                                                    return s && t ? <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#a78bfa" strokeWidth="2" /> : null;
                                                })}
                                            </svg>
                                            {exampleGraphData.nodes.map(node => <SmallExampleNode key={node.id} label={node.id} color={step.nodeStates[node.id] || 'default'} style={{ left: `${node.x}px`, top: `${node.y}px` }} />)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">Pros & Cons</h3>
                        <div className="space-y-4">
                            <div className="bg-green-900/40 p-4 rounded-lg border border-green-500/30">
                                <h4 className="font-bold text-green-300">Best For:</h4>
                                <ul className="list-disc pl-5 mt-2 text-sm text-gray-300">
                                    <li>Finding the shortest path in unweighted graphs</li>
                                    <li>Web crawlers for indexing web pages</li>
                                    <li>Finding all connected components in a graph</li>
                                </ul>
                            </div>
                            <div className="bg-red-900/40 p-4 rounded-lg border border-red-500/30">
                                <h4 className="font-bold text-red-300">Avoid For:</h4>
                                <ul className="list-disc pl-5 mt-2 text-sm text-gray-300">
                                    <li>Graphs with a very large branching factor (memory intensive)</li>
                                    <li>Finding the longest path or paths in weighted graphs</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">Complexity Analysis</h3>
                        <div className="space-y-3">
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-400">Time Complexity</h4>
                                <p className="text-sm mt-2">
                                    <strong className="text-yellow-400">All Cases:</strong> <span className="font-mono text-lg">O(V + E)</span> <span className="text-xs text-gray-500">(V = Vertices, E = Edges)</span>
                                </p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-400">Space Complexity</h4>
                                <p className="text-sm mt-2">
                                    <strong className="text-indigo-300">Worst Case:</strong> <span className="font-mono text-lg">O(V)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

//==============================================================================
// Main BFSVisualizer Component
//==============================================================================
const BFSVisualizer = () => {
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

    const logViewRef = useRef(null);
    const visContainerRef = useRef(null);
  
    const resetVisualizationState = useCallback(() => {
        setIsSorting(false);
        setIsPaused(true);
        setIsFinished(false);
        setIsReviewingPastStep(false);
        setSortState({ queue: [], visited: new Set(), currentNode: null });
        setComplexity({ nodesVisited: 0, edgesTraversed: 0 });
        const initialStep = {
            message: "Graph loaded. Select a start node and press Play.",
            type: "start",
            queueState: [],
            visitedState: new Set(),
            currentNode: null,
            complexity: { nodesVisited: 0, edgesTraversed: 0 }
        };
        setSteps([initialStep]);
        setCurrentStep(0);
    }, []);

    const addStep = useCallback((message, type, queue, visited, currentNode, comp) => {
        const newStep = { 
            message, 
            type, 
            queueState: [...queue], 
            visitedState: new Set(visited), 
            currentNode, 
            complexity: { ...comp } 
        };
        setSteps((prev) => [...prev, newStep]);
        if (!isReviewingPastStep) {
            setCurrentStep((prev) => prev + 1);
        }
    }, [isReviewingPastStep]);

    const runSortStep = useCallback(() => {
        let { queue, visited } = { ...sortState };
        let currentComplexity = { ...complexity };

        if (queue.length === 0) {
            setIsFinished(true);
            setIsSorting(false);
            addStep("BFS complete! All reachable nodes have been visited.", "finish", [], visited, null, currentComplexity);
            return;
        }

        let currentNode = queue.shift();

        if (visited.has(currentNode)) {
            setSortState({ queue, visited, currentNode });
            return; 
        }

        visited.add(currentNode);
        currentComplexity.nodesVisited++;
        addStep(`Visiting node ${currentNode}. Adding its unvisited neighbors to the queue.`, "visit", queue, visited, currentNode, currentComplexity);

        let neighbors;
        if (graphType === 'directed') {
            neighbors = graph.edges
                .filter((edge) => edge.source === currentNode)
                .map((edge) => edge.target);
        } else {
            neighbors = graph.edges
                .filter((edge) => edge.source === currentNode).map((edge) => edge.target)
                .concat(graph.edges.filter((edge) => edge.target === currentNode).map((edge) => edge.source));
        }

        for (const neighbor of [...new Set(neighbors)]) {
            currentComplexity.edgesTraversed++;
            if (!visited.has(neighbor) && !queue.includes(neighbor)) {
                queue.push(neighbor);
            }
        }
        
        addStep(`Queue updated after visiting node ${currentNode}.`, "enqueue", queue, visited, currentNode, currentComplexity);
        setComplexity(currentComplexity);
        setSortState({ queue, visited, currentNode });
    }, [sortState, graph, complexity, addStep, graphType]);

    const setupNewGraph = useCallback((newGraph, startNode = null) => {
        const width = visContainerRef.current?.clientWidth || 600;
        const height = 384;
        const defaultStartNode = startNode || newGraph.nodes[0]?.id || null;
    
        const positionedNodes = calculateLayeredLayout(newGraph.nodes, newGraph.edges, defaultStartNode, width, height, graphType);
    
        setGraph({ nodes: positionedNodes, edges: newGraph.edges });
        setStartNodeId(defaultStartNode);
        resetVisualizationState();
    }, [graphType, resetVisualizationState]);
    
    const handleReset = useCallback(() => {
        const defaultGraph = {
            nodes: [ { id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }, { id: "F" }, { id: "G" }, { id: "H" } ],
            edges: [ { source: "A", target: "B" }, { source: "A", target: "C" }, { source: "B", target: "D" }, { source: "B", target: "E" }, { source: "C", target: "F" }, { source: "F", target: "G" }, { source: "E", target: "H" } ],
        };
        setupNewGraph(defaultGraph);
    }, [setupNewGraph]);
  
    const handleCustomGraph = useCallback(() => {
        try {
            const parsedGraph = JSON.parse(customInput);
            if (!parsedGraph.nodes || !parsedGraph.edges || !Array.isArray(parsedGraph.nodes) || !Array.isArray(parsedGraph.edges)) {
                alert("Invalid format. Please provide 'nodes' and 'edges' arrays.");
                return;
            }
            setupNewGraph(parsedGraph);
        } catch (error) {
            alert("Invalid JSON format for the graph.");
        }
    }, [customInput, setupNewGraph]);

    const loadExampleGraph = useCallback(() => {
        const presetGraph = {
            nodes: [ { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" }, { id: "8" }, { id: "9" } ],
            edges: [ { source: "1", target: "2" }, { source: "1", target: "3" }, { source: "1", target: "4" }, { source: "2", target: "5" }, { source: "2", target: "6" }, { source: "4", target: "7" }, { source: "4", target: "8" }, { source: "6", target: "9" } ],
        };
        setCustomInput(JSON.stringify(presetGraph, null, 2));
        setupNewGraph(presetGraph, "1");
    }, [setupNewGraph]);
  
    const handleClearGraph = () => {
        setGraph({ nodes: [], edges: [] });
        setStartNodeId(null);
        resetVisualizationState();
    };

    useEffect(() => {
        handleReset();
        const handleResize = () => {
            if (graph.nodes.length > 0) {
                 const width = visContainerRef.current?.clientWidth || 600;
                 const height = 384;
                 const currentStart = startNodeId || graph.nodes[0]?.id;
                 const positionedNodes = calculateLayeredLayout(graph.nodes, graph.edges, currentStart, width, height, graphType);
                 setGraph(g => ({ ...g, nodes: positionedNodes }));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        if (graph.nodes.length > 0) {
            const width = visContainerRef.current?.clientWidth || 600;
            const height = 384;
            const currentStart = startNodeId || graph.nodes[0]?.id;
            const positionedNodes = calculateLayeredLayout(graph.nodes, graph.edges, currentStart, width, height, graphType);
            setGraph(g => ({ ...g, nodes: positionedNodes }));
            resetVisualizationState();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphType, startNodeId]);

    useEffect(() => {
        let timer;
        if (isSorting && !isPaused && !isFinished) {
            timer = setTimeout(runSortStep, 1000 - speed * 9.5);
        }
        return () => clearTimeout(timer);
    }, [isSorting, isPaused, isFinished, runSortStep, speed]);
    
    useEffect(() => {
        if (logViewRef.current && !isReviewingPastStep) {
            logViewRef.current.scrollTop = logViewRef.current.scrollHeight;
        }
    }, [steps, isReviewingPastStep]);
    
    const handleCanvasClick = (e) => {
        if (editMode !== 'addNode') return;
        
        const rect = visContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newNodeId = generateNewNodeId(graph.nodes);
        const newNode = { id: newNodeId, x, y };

        setGraph(g => ({ ...g, nodes: [...g.nodes, newNode] }));
        if (!startNodeId) {
            setStartNodeId(newNodeId);
        } else {
            resetVisualizationState();
        }
        setEditMode('none');
    };

    const handleNodeClick = (e, nodeId) => {
        e.stopPropagation();
        
        if (editMode === 'removeNode') {
            setGraph(g => {
                const newNodes = g.nodes.filter(n => n.id !== nodeId);
                const newEdges = g.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
                return { nodes: newNodes, edges: newEdges };
            });
            if (startNodeId === nodeId) {
                const newStartNode = graph.nodes.length > 1 ? graph.nodes.find(n => n.id !== nodeId)?.id : null;
                setStartNodeId(newStartNode);
            }
            resetVisualizationState();
            setEditMode('none');

        } else if (editMode === 'addEdgeStart') {
            setEdgeStartNode(nodeId);
            setEditMode('addEdgeEnd');
        } else if (editMode === 'addEdgeEnd') {
            if (edgeStartNode && edgeStartNode !== nodeId) {
                const newEdge = { source: edgeStartNode, target: nodeId };
                const edgeExists = graph.edges.some(e => e.source === newEdge.source && e.target === newEdge.target);
                const reverseEdgeExists = graphType === 'undirected' && graph.edges.some(e => e.source === newEdge.target && e.target === newEdge.source);
                
                if (!edgeExists && !reverseEdgeExists) {
                    setGraph(g => ({ ...g, edges: [...g.edges, newEdge] }));
                    resetVisualizationState();
                }
            }
            setEdgeStartNode(null);
            setEditMode('none');
        }
    };
    
    const toggleSorting = () => {
        if (isFinished || graph.nodes.length === 0 || !startNodeId) {
            if(!startNodeId && graph.nodes.length > 0) alert("Please select a start node.");
            return;
        };
        
        if (isReviewingPastStep) {
            setIsReviewingPastStep(false);
            setCurrentStep(steps.length - 1);
        }
        
        setIsSorting(true);
        setIsPaused(!isPaused);
        
        if (sortState.queue.length === 0 && sortState.visited.size === 0 && !isSorting) {
            const newQueue = [startNodeId];
            setSortState({ ...sortState, queue: newQueue });
            addStep(`Starting BFS from node ${startNodeId}. Enqueuing ${startNodeId}.`, "start", newQueue, new Set(), null, complexity);
        }
    };

    const goToStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
            setIsPaused(true);
            setIsReviewingPastStep(true);
            setCurrentStep(stepIndex);
        }
    };
    
    const stepForward = () => goToStep(currentStep + 1);
    const stepBackward = () => goToStep(currentStep - 1);

    const isLive = !isReviewingPastStep;
    const displayedStep = steps[currentStep] || {};
    const queueToDisplay = isLive ? sortState.queue : displayedStep.queueState;
    const visitedToDisplay = isLive ? sortState.visited : displayedStep.visitedState;
    const currentNodeToDisplay = isLive ? sortState.currentNode : displayedStep.currentNode;
    const complexityToDisplay = isLive ? complexity : displayedStep.complexity;
    
    const getNodeColor = (nodeId) => {
        if (edgeStartNode === nodeId) return "ring-4 ring-yellow-400 bg-yellow-500 scale-110";
        if (currentNodeToDisplay === nodeId) return "bg-yellow-400 animate-pulse ring-4 ring-yellow-300 scale-110";
        if (visitedToDisplay?.has(nodeId)) return "bg-gradient-to-b from-green-400 to-green-600";
        if (queueToDisplay?.includes(nodeId)) return "bg-gradient-to-b from-pink-400 to-pink-600";
        if (startNodeId === nodeId) return "bg-gradient-to-b from-indigo-400 to-indigo-600 ring-2 ring-indigo-300";
        return "bg-gradient-to-b from-blue-400 to-blue-600";
    };
    
    const getEditModeMessage = () => {
        switch (editMode) {
            case 'addNode': return "Click on the canvas to add a new node.";
            case 'addEdgeStart': return "Select a source node for the edge.";
            case 'addEdgeEnd': return `Select a target node to connect from node ${edgeStartNode}.`;
            case 'removeNode': return "Click a node to remove it.";
            default: return "Select a start node to begin.";
        }
    };

    const getTabClass = (tabName) => {
        return activeTab === tabName
            ? "text-purple-400 border-b-2 border-purple-400"
            : "text-gray-400 hover:text-gray-300";
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/40 to-indigo-900/60 -z-10" />

            <header className="w-full max-w-6xl mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
                    BFS Graph Visualizer
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Visualize Breadth-First Search with an interactive editor and live queue.
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
                            graph={graph}
                            currentStep={currentStep}
                            steps={steps}
                            speed={speed}
                            editMode={editMode}
                            startNodeId={startNodeId}
                            setStartNodeId={setStartNodeId}
                            graphType={graphType}
                            setGraphType={setGraphType}
                            isSorting={isSorting}
                            toggleSorting={toggleSorting}
                            stepBackward={stepBackward}
                            stepForward={stepForward}
                            setSpeed={setSpeed}
                            setEditMode={setEditMode}
                            handleClearGraph={handleClearGraph}
                            handleReset={handleReset}
                            loadExampleGraph={loadExampleGraph}
                            getEditModeMessage={getEditModeMessage}
                        />
                        <JsonInput
                            customInput={customInput}
                            setCustomInput={setCustomInput}
                            isSorting={isSorting}
                            handleCustomGraph={handleCustomGraph}
                        />
                        <QueueDisplay queue={queueToDisplay} />
                        <VisualizationArea
                            graph={graph}
                            visContainerRef={visContainerRef}
                            handleCanvasClick={handleCanvasClick}
                            getNodeColor={getNodeColor}
                            handleNodeClick={handleNodeClick}
                            editMode={editMode}
                            graphType={graphType}
                            isFinished={isFinished}
                            isSorting={isSorting}
                            isPaused={isPaused}
                            startNodeId={startNodeId}
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
                <p>BFS Graph Visualizer - Interactive Algorithm Demonstration</p>
            </footer>
        </div>
    );
};

export default BFSVisualizer;