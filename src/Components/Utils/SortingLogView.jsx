import React, { useEffect, useRef, useState } from "react";
import { Info, Sparkles, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SortingLogView = ({ steps, currentStep, goToStep, isDark }) => {
  const logViewRef = useRef(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const getStepStyle = (type) => {
    const styles = {
      start: "bg-indigo-600/90",
      pass: "bg-purple-600/90",
      compare: "bg-amber-500/90",
      swap: "bg-pink-600/90",
      pivot: "bg-cyan-600/90",
      sorted: "bg-emerald-600/90",
      finish: "bg-teal-600/90"
    };
    return styles[type] || "bg-gray-600/90";
  };

  // INTERNAL SCROLL LOGIC (Does not move the whole page)
  useEffect(() => {
    if (logViewRef.current && !userInteracted) {
      const container = logViewRef.current;
      const activeElement = container.querySelector(`[data-step-index="${currentStep}"]`);
      
      if (activeElement) {
        // Calculate position relative ONLY to the parent container
        const containerHeight = container.offsetHeight;
        const elementTop = activeElement.offsetTop;
        const elementHeight = activeElement.offsetHeight;

        // Smoothly scroll the DIV, not the WINDOW
        container.scrollTo({
          top: elementTop - containerHeight / 2 + elementHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentStep, userInteracted]);

  // Reset auto-scroll when a new algorithm starts (steps reset)
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
            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
                <Info className="w-5 h-5 text-purple-500" />
            </div>
            <div>
                <h2 className={`text-sm font-bold uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Algorithm Execution Log
                </h2>
                <p className="text-[10px] text-gray-500 font-mono">Step {currentStep + 1} / {steps.length}</p>
            </div>
        </div>

        {userInteracted && (
            <button 
                onClick={() => setUserInteracted(false)}
                className="text-[10px] bg-purple-500 text-white px-2 py-1 rounded-md animate-pulse"
            >
                Resume Auto-Scroll
            </button>
        )}
      </div>

      <div 
        ref={logViewRef} 
        onWheel={() => setUserInteracted(true)} // If user scrolls, stop fighting them
        className="relative max-h-80 overflow-y-auto overflow-x-hidden no-scrollbar px-2 py-2 space-y-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>

        <AnimatePresence initial={false}>
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            
            return (
              <motion.div 
                key={`${index}-${step.type}`}
                data-step-index={index}
                onClick={() => {
                    goToStep(index);
                    setUserInteracted(true); // Stop auto-scroll when user clicks a specific step
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                    opacity: isCurrent ? 1 : 0.4, 
                    x: 0,
                    scale: isCurrent ? 1 : 0.98,
                }}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${getStepStyle(step.type)} 
                  ${isCurrent 
                      ? 'border-white/50 shadow-lg z-10' 
                      : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-black/20 flex items-center justify-center text-[10px] font-bold text-white">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-white text-xs leading-relaxed font-bold flex items-center gap-2">
                      {step.type === 'sorted' && <Sparkles className="w-3 h-3 text-yellow-300" />}
                      {step.message}
                    </p>
                    
                    {step.arrState && isCurrent && (
                      <div className="mt-3 flex flex-wrap gap-1 bg-black/20 p-2 rounded-lg border border-white/10">
                        {step.arrState.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`px-1.5 py-0.5 rounded text-[9px] font-black
                              ${step.highlights?.includes(idx) 
                                  ? 'bg-yellow-400 text-gray-900' 
                                  : step.sorted?.includes(idx) 
                                      ? 'bg-emerald-400 text-white' 
                                      : 'bg-white/10 text-white/40'
                              }`}
                          >
                            {item.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Buffer to allow centering of the last item */}
        <div className="h-20" />
      </div>
    </section>
  );
};

export default SortingLogView;