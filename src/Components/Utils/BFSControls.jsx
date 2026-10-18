import React from "react";
import {
  Link2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  SkipBack,
  SkipForward,
  Trash2,
  Wand2,
} from "lucide-react";
import GlossyButton from "./GlossyButton";

const BFSControls = ({
  isFinished,
  isPaused,
  graph,
  currentStep,
  steps,
  speed,
  editMode,
  startNodeId,
  setStartNodeId,
  graphType,
  setGraphType,
  isSorting,
  toggleSorting,
  stepBackward,
  stepForward,
  setSpeed,
  setEditMode,
  handleClearGraph,
  handleReset,
  loadExampleGraph,
  getEditModeMessage,
  customInput,
  setCustomInput,
  handleCustomGraph,
  isDark,
}) => {
  const cardClass = isDark
    ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md shadow-2xl"
    : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
  const labelClass = isDark ? "text-gray-400" : "text-slate-500";
  const textClass = isDark ? "text-gray-300" : "text-slate-700";
  const inputClass = isDark
    ? "bg-gray-900/50 border-white/10 text-white placeholder-gray-600 focus:border-purple-500"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500";
  const selectClass = isDark
    ? "bg-gray-900/80 border-white/10 text-white"
    : "bg-white border-slate-200 text-slate-800";

  return (
    <section className={`${cardClass} rounded-2xl p-6 border transition-all duration-300 h-full flex flex-col`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${textClass}`}>
          <Settings2 className="w-4 h-4 text-purple-500" />
          Control Panel
        </h2>
        <div className={`px-2 py-1 rounded-lg bg-black/20 text-[10px] font-mono ${isDark ? "text-purple-400" : "text-purple-600"}`}>
          STEP {currentStep + 1} / {steps.length}
        </div>
      </div>

      <div className="space-y-5 flex-1">
        <div className="grid grid-cols-3 gap-3">
          <GlossyButton
            className="col-span-2 h-11"
            onClick={toggleSorting}
            disabled={isFinished || graph.nodes.length === 0 || !startNodeId}
            gradientClasses={!isPaused ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-green-400 to-emerald-500"}
            pulse={!isPaused && !isFinished}
            isDark={isDark}
          >
            {!isPaused ? <><Pause size={18} />Pause</> : <><Play size={18} />Play</>}
          </GlossyButton>
          <GlossyButton className="h-11" onClick={handleReset} gradientClasses="bg-gradient-to-r from-red-500 to-pink-500" isDark={isDark}>
            <RotateCcw size={18} />
          </GlossyButton>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <GlossyButton className="h-11" onClick={stepBackward} disabled={currentStep <= 0} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" isDark={isDark}>
            <SkipBack size={20} />Back
          </GlossyButton>
          <GlossyButton className="h-11" onClick={stepForward} disabled={currentStep >= steps.length - 1 || isFinished} gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400" isDark={isDark}>
            Next<SkipForward size={20} />
          </GlossyButton>
        </div>

        <div className={`space-y-3 pt-5 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Start Node</label>
              <select value={startNodeId || ""} onChange={(event) => setStartNodeId(event.target.value)} disabled={graph.nodes.length === 0 || isSorting} className={`w-full mt-2 px-3 py-2 border rounded-xl text-sm ${selectClass}`}>
                {graph.nodes.map((node) => <option key={node.id} value={node.id}>{node.id}</option>)}
              </select>
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Graph Type</label>
              <div className={`flex mt-2 rounded-xl p-1 border ${isDark ? "bg-gray-900/80 border-white/10" : "bg-slate-100 border-slate-200"}`}>
                <button type="button" onClick={() => setGraphType("undirected")} className={`flex-1 py-1 rounded-lg text-xs font-medium ${graphType === "undirected" ? "bg-purple-600 text-white" : labelClass}`}>Undir</button>
                <button type="button" onClick={() => setGraphType("directed")} className={`flex-1 py-1 rounded-lg text-xs font-medium ${graphType === "directed" ? "bg-purple-600 text-white" : labelClass}`}>Dir</button>
              </div>
            </div>
          </div>
        </div>

        <div className={`space-y-3 pt-5 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <h3 className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${labelClass}`}><Wand2 className="w-4 h-4" />Editor</h3>
          <div className="grid grid-cols-3 gap-2">
            <GlossyButton onClick={() => setEditMode("addNode")} gradientClasses={editMode === "addNode" ? "bg-gradient-to-r from-purple-500 to-indigo-500" : isDark ? "bg-gray-700" : "bg-slate-400"} className="w-full" pulse={false} isDark={isDark}><Plus size={16} /></GlossyButton>
            <GlossyButton onClick={() => setEditMode("addEdgeStart")} gradientClasses={editMode.startsWith("addEdge") ? "bg-gradient-to-r from-purple-500 to-indigo-500" : isDark ? "bg-gray-700" : "bg-slate-400"} className="w-full" pulse={false} isDark={isDark}><Link2 size={16} /></GlossyButton>
            <GlossyButton onClick={() => setEditMode("removeNode")} gradientClasses={editMode === "removeNode" ? "bg-gradient-to-r from-red-500 to-orange-500" : isDark ? "bg-gray-700" : "bg-slate-400"} className="w-full" pulse={false} isDark={isDark}><Trash2 size={16} /></GlossyButton>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GlossyButton onClick={loadExampleGraph} gradientClasses="bg-gradient-to-r from-teal-400 to-emerald-500" className="w-full" pulse={false} isDark={isDark}>Example</GlossyButton>
            <GlossyButton onClick={handleClearGraph} gradientClasses="bg-gradient-to-r from-red-600 to-red-800" className="w-full" pulse={false} isDark={isDark}>Clear</GlossyButton>
          </div>
          <div className="min-h-5 text-[10px] text-yellow-500 text-center font-medium">{getEditModeMessage()}</div>
        </div>

        <div className={`space-y-4 pt-5 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex justify-between items-center">
            <label className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Visual Speed</label>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 ${isDark ? "text-purple-400" : "text-purple-600"}`}>{speed}%</span>
          </div>
          <input type="range" min="1" max="100" value={speed} onChange={(event) => setSpeed(event.target.value)} className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 ${isDark ? "bg-gray-800" : "bg-slate-200"}`} />
          <div className="flex justify-between text-[8px] font-bold uppercase text-gray-500 px-1"><span>Slow</span><span>Instant</span></div>
        </div>

        <div className={`space-y-3 pt-5 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <label className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Custom Graph JSON</label>
          <div className="flex gap-2">
            <input type="text" value={customInput} onChange={(event) => setCustomInput(event.target.value)} placeholder='{"nodes": [...], "edges": [...]}' className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none ${inputClass}`} />
            <GlossyButton onClick={handleCustomGraph} gradientClasses="bg-gradient-to-r from-purple-500 to-pink-500" className="w-20 text-xs" isDark={isDark}>Load</GlossyButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BFSControls;
