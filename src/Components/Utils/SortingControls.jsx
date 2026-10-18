import React from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Wand2, 
  ArrowUpDown, 
  Send, 
  Settings2 
} from "lucide-react";
import GlossyButton from "./GlossyButton";

/**
 * SortingControls - A reusable, glossy control panel for algorithm visualizers.
 */
const SortingControls = ({
    isFinished,
    isPaused,
    isSorting,
    currentStep,
    totalSteps,
    speed,
    customInput,
    sortOrder,
    onTogglePlay,
    onStepBack,
    onStepForward,
    onReset,
    onExample,
    onToggleOrder,
    onSpeedChange,
    onCustomInputChange,
    onApplyCustom,
    isDark,
    showOrderToggle = true
}) => {

    const cardClass = isDark 
      ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md shadow-2xl" 
      : "bg-white/80 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl";
    
    const labelClass = isDark ? "text-gray-400" : "text-slate-500";
    const inputClass = isDark 
        ? "bg-gray-900/50 border-white/10 text-white placeholder-gray-600 focus:border-purple-500" 
        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500";

    return (
      <section className={`${cardClass} rounded-2xl p-6 border transition-all duration-300 h-full flex flex-col`}>
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
            <h2 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                <Settings2 className="w-4 h-4 text-purple-500"/>
                Control Panel
            </h2>
            <div className={`px-2 py-1 rounded-lg bg-black/20 text-[10px] font-mono ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                STEP {currentStep + 1} / {totalSteps}
            </div>
        </div>

        <div className="space-y-5 flex-1">
          {/* Top Row: Play/Pause & Global Reset */}
          <div className="grid grid-cols-3 gap-3">
            <GlossyButton 
                className="col-span-2 h-11"
                onClick={onTogglePlay} 
                disabled={isFinished} 
                gradientClasses={!isPaused ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-green-400 to-emerald-500"}
                pulse={!isPaused && !isFinished}
                isDark={isDark}
            >
              {!isPaused ? <><Pause size={18}/>Pause</> : <><Play size={18}/>Play</>}
            </GlossyButton>
            
            <GlossyButton 
                className="h-11"
                onClick={onReset} 
                gradientClasses="bg-gradient-to-r from-red-500 to-pink-500" 
                isDark={isDark}
            >
              <RotateCcw size={18} />
            </GlossyButton>
          </div>

          {/* Middle Row: Step-by-Step Navigation */}
          <div className={`grid ${showOrderToggle ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
            <GlossyButton 
                className="h-11"
                onClick={onStepBack} 
                disabled={currentStep <= 0} 
                gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400"
                isDark={isDark}
            >
              <ChevronLeft size={20}/>Back
            </GlossyButton>
            <GlossyButton 
                className="h-11"
                onClick={onStepForward} 
                disabled={currentStep >= totalSteps - 1 || isFinished} 
                gradientClasses="bg-gradient-to-r from-sky-400 to-indigo-400"
                isDark={isDark}
            >
              Next<ChevronRight size={20}/>
            </GlossyButton>
          </div>

          {/* Utilities: Example Arrays & Sort Direction */}
          <div className="grid grid-cols-2 gap-3">
            <GlossyButton 
                className="h-11"
                onClick={onExample} 
                gradientClasses="bg-gradient-to-r from-indigo-500 to-purple-500"
                isDark={isDark}
            >
              <Wand2 size={16}/>Example
            </GlossyButton>
            {showOrderToggle && <GlossyButton 
                className="h-11"
                onClick={onToggleOrder} 
                disabled={isSorting} 
                gradientClasses="bg-gradient-to-r from-teal-400 to-cyan-500"
                isDark={isDark}
            >
              <ArrowUpDown size={16} />
              {sortOrder === 'ascending' ? 'ASC' : 'DESC'}
            </GlossyButton>}
          </div>

          {/* Custom Array Input Section */}
          <div className={`space-y-3 pt-5 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <label className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>
                Custom Dataset
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={customInput}
                    onChange={(e) => onCustomInputChange(e.target.value)}
                    placeholder="e.g. 15, 42, 8, 23"
                    disabled={isSorting}
                    className={`flex-1 px-4 py-2 text-xs rounded-xl border outline-none transition-all duration-300
                        ${inputClass}`}
                />
                <button 
                    onClick={onApplyCustom}
                    disabled={isSorting}
                    title="Apply custom array"
                    className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Send size={14} />
                </button>
            </div>
          </div>

          {/* Animation Speed Slider */}
          <div className={`space-y-4 pt-5 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <div className="flex justify-between items-center">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>
                    Visual Speed
                </label>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                    {speed}%
                </span>
            </div>
            <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => onSpeedChange(e.target.value)}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 
                    ${isDark ? "bg-gray-800" : "bg-slate-200"}`}
            />
            <div className="flex justify-between text-[8px] font-bold uppercase text-gray-500 px-1">
                <span>Slow</span>
                <span>Instant</span>
            </div>
          </div>
        </div>
      </section>
    );
};

export default SortingControls;