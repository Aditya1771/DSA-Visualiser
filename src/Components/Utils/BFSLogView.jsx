import React, { useEffect, useRef, useState } from "react";
import { Activity, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BFSLogView = ({ steps, currentStep, goToStep, isDark, structureLabel = "Queue" }) => {
  const logViewRef = useRef(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const getStepStyle = (type) => ({
    start: "bg-indigo-600/90",
    visit: "bg-purple-600/90",
    enqueue: "bg-pink-600/90",
    finish: "bg-teal-600/90",
  }[type] || "bg-gray-600/90");

  useEffect(() => {
    if (!logViewRef.current || userInteracted) return;
    const container = logViewRef.current;
    const activeElement = container.querySelector(`[data-step-index="${currentStep}"]`);
    if (activeElement) {
      container.scrollTo({
        top: activeElement.offsetTop - container.offsetHeight / 2 + activeElement.offsetHeight / 2,
        behavior: "smooth",
      });
    }
  }, [currentStep, userInteracted]);

  useEffect(() => {
    if (currentStep === 0) setUserInteracted(false);
  }, [currentStep]);

  const cardClass = isDark
    ? "bg-[#0A0A0A]/60 border-white/5 backdrop-blur-md"
    : "bg-white border-slate-200 shadow-xl";

  return (
    <section className={`${cardClass} rounded-2xl p-6 border transition-all duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? "bg-purple-500/20" : "bg-purple-50"}`}>
            <Info className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
              Algorithm Execution Log
            </h2>
            <p className="text-[10px] text-gray-500 font-mono">Step {steps.length ? currentStep + 1 : 0} / {steps.length}</p>
          </div>
        </div>
        {userInteracted && (
          <button type="button" onClick={() => setUserInteracted(false)} className="text-[10px] bg-purple-500 text-white px-2 py-1 rounded-md animate-pulse">
            Resume Auto-Scroll
          </button>
        )}
      </div>

      <div
        ref={logViewRef}
        onWheel={() => setUserInteracted(true)}
        className="relative max-h-80 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-3"
        style={{ scrollbarWidth: "auto", scrollbarColor: isDark ? "#8b5cf6 #18181b" : "#a78bfa #e2e8f0" }}
      >
        <AnimatePresence initial={false}>
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            return (
              <motion.div
                key={`${index}-${step.type}`}
                data-step-index={index}
                onClick={() => { goToStep(index); setUserInteracted(true); }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isCurrent ? 1 : 0.4, x: 0, scale: isCurrent ? 1 : 0.98 }}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${getStepStyle(step.type)} ${isCurrent ? "border-white/50 shadow-lg z-10" : "border-transparent hover:opacity-100"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-6 h-6 rounded bg-black/20 flex items-center justify-center text-[10px] font-bold text-white">{index + 1}</div>
                  <div className="flex-1">
                    <p className="text-white text-xs leading-relaxed font-bold flex items-center gap-2">
                      {step.type === "finish" && <Activity className="w-3 h-3 text-yellow-300" />}
                      {step.message}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/10">
                      <span className="text-[10px] font-bold text-white/60">{structureLabel}</span>
                      {step.queueState?.length > 0 ? step.queueState.map((nodeId, queueIndex) => (
                        <span key={`${nodeId}-${queueIndex}`} className="px-1.5 py-0.5 rounded text-[9px] font-black bg-white/15 text-white">{nodeId}</span>
                      )) : <span className="text-[10px] italic text-white/40">empty</span>}
                      {step.complexity && <span className="ml-auto text-[9px] text-white/60 font-mono">V:{step.complexity.nodesVisited} E:{step.complexity.edgesTraversed}</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div className="h-20" />
      </div>
    </section>
  );
};

export default BFSLogView;
