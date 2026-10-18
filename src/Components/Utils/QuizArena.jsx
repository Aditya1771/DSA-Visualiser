import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import confetti from 'canvas-confetti';
import { 
  BrainCircuit, Sparkles, Trophy, Zap, ShieldCheck, Cpu, 
  Check, ArrowRight, Loader2, X, Info, CheckCircle2, XCircle, RotateCcw 
} from 'lucide-react';
import { startAiQuiz, evaluateQuiz, clearQuizSession } from '../../Stores/quizSlice';

/**
 * ============================================================
 * 1. SUB-COMPONENT: MASTERY LOBBY (Lobby UI)
 * ============================================================
 */
const MasteryLobby = ({ algoKey, isDark, onStart, loading }) => {
  const cardClass = isDark ? "bg-[#0A0A0A]/40 border-white/5" : "bg-white border-slate-200 shadow-xl";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-10 px-4">
      <div className={`rounded-[2.5rem] border p-10 relative overflow-hidden backdrop-blur-md ${cardClass}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
                <Cpu size={28} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-black tracking-tight italic">The AI <span className="text-purple-500">Mastery</span> Arena</h2>
            </div>
            
            <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Ready to verify your expertise in <span className="text-purple-400 font-bold">{algoKey}</span>? 
              Our RAG-based AI has prepared a special challenge for you.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: Trophy, text: "Earn +50 Reputation Points", color: "text-yellow-500" },
                { icon: Zap, text: "Extend your daily learning streak", color: "text-orange-500" },
                { icon: ShieldCheck, text: "Unlock Algorithm Mastery Badge", color: "text-emerald-500" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-bold">
                  <item.icon size={18} className={item.color} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <button 
                onClick={onStart}
                disabled={loading}
                className="w-full lg:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? <><Loader2 className="animate-spin" /> Preparing...</> : <><Sparkles size={20}/> Start Mastery Quiz</>}
            </button>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border-2 border-dashed border-purple-500/30 rounded-full flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-dashed border-pink-500/20 rounded-full" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit size={80} className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * ============================================================
 * 2. SUB-COMPONENT: QUIZ INTERFACE (Questions UI)
 * ============================================================
 */
const QuizModal = ({ algoKey, questions, isDark, onSubmit, evaluating }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);

  const handleNext = () => {
    const newAnswers = [...answers, { id: questions[currentIdx].id, selected: selectedOpt }];
    setAnswers(newAnswers);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
    } else {
      onSubmit(newAnswers);
    }
  };

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className={`relative max-w-2xl w-full border rounded-[2.5rem] p-8 overflow-hidden shadow-2xl ${isDark ? 'bg-[#0A0A0C] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400"><BrainCircuit size={22} /></div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest opacity-50 italic">AI Challenge</h3>
              <p className="text-[10px] font-bold text-purple-500 uppercase">{algoKey}</p>
            </div>
          </div>
          <div className="text-[10px] font-black opacity-40 uppercase tracking-widest">Question {currentIdx+1}/{questions.length}</div>
        </div>

        <div className="w-full h-2 bg-white/5 rounded-full mb-10 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="min-h-[300px]">
            <span className="text-[10px] font-black text-purple-500 uppercase mb-2 block">{q.level} • {q.type.replace(/_/g, ' ')}</span>
            <h2 className="text-xl md:text-2xl font-black mb-10 leading-tight italic">"{q.question}"</h2>
            <div className="grid gap-3">
              {q.type === 'mcq' ? (
                q.options.map((opt, i) => (
                  <button key={i} onClick={() => setSelectedOpt(opt)} className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group
                    ${selectedOpt === opt ? 'bg-purple-500/10 border-purple-500 text-purple-400' : isDark ? 'bg-white/5 border-white/5 hover:border-white/20' : 'bg-slate-50 border-slate-100 hover:border-purple-200'}`}>
                    <span className="font-bold text-sm">{opt}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedOpt === opt ? 'border-purple-500 bg-purple-500' : 'border-white/10'}`}>
                      {selectedOpt === opt && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                  </button>
                ))
              ) : (
                <input type="text" placeholder="Technical term..." className={`w-full p-5 rounded-2xl border-2 bg-transparent outline-none font-bold text-purple-400 focus:border-purple-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`} onChange={(e) => setSelectedOpt(e.target.value)} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <button disabled={!selectedOpt || evaluating} onClick={handleNext} className="w-full mt-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl disabled:opacity-20">
          {evaluating ? <><Loader2 className="animate-spin" /> Evaluating...</> : <>{currentIdx === questions.length - 1 ? 'Finish Challenge' : 'Next Question'} <ArrowRight size={20} /></>}
        </button>
      </div>
    </motion.div>
  );
};

/**
 * ============================================================
 * 3. SUB-COMPONENT: EVALUATION & CELEBRATION (Results UI)
 * ============================================================
 */
const CompletionCelebration = ({ isOpen, results, onContinue, onRestart, isDark }) => {
  if (!results) return null;
  const passed = results.score >= 70;

  // CONFETTI EFFECT
  useEffect(() => {
    if (isOpen && passed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6']
      });
    }
  }, [isOpen, passed]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 40 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className={`max-w-3xl w-full border rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative my-auto overflow-hidden ${isDark ? 'bg-[#0a0a0c] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
          >
            {/* Celebration Header */}
            <div className="text-center mb-12 relative z-10">
              <motion.div 
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl bg-gradient-to-tr ${passed ? 'from-yellow-400 to-orange-600 shadow-yellow-500/20' : 'from-gray-500 to-slate-700'}`}
              >
                 <Trophy className="text-white w-12 h-12" strokeWidth={2.5} />
              </motion.div>
              
              <h2 className="text-4xl font-black tracking-tight mb-2">
                {passed ? 'Arena Mastered!' : 'Keep Grinding!'}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 italic">
                    {results.score}%
                </span>
                <span className="font-bold text-xs uppercase opacity-40 tracking-widest">Accuracy Score</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Points Earned</p>
                    <p className="text-3xl font-black text-emerald-400">+{results.reward.points}</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">New Streak</p>
                    <p className="text-3xl font-black text-orange-500 flex items-center justify-center gap-2">
                        🔥 {results.reward.streak}
                    </p>
                </div>
            </div>

            {/* Detailed AI Explanations */}
            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-30 mb-4 px-2">Deep Dive Review</h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 mb-10 custom-scrollbar">
              {results.results.map((item, i) => (
                <div key={i} className={`p-6 rounded-3xl border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-start gap-4 mb-4">
                    {item.isCorrect 
                        ? <div className="p-1.5 bg-emerald-500/20 rounded-lg"><CheckCircle2 className="text-emerald-500" size={18} /></div>
                        : <div className="p-1.5 bg-red-500/20 rounded-lg"><XCircle className="text-red-500" size={18} /></div>
                    }
                    <div>
                        <h4 className="font-black text-sm leading-snug">{item.question}</h4>
                        {!item.isCorrect && <p className="text-[10px] mt-1 font-bold text-red-400 uppercase">Answer: {item.correctAnswer}</p>}
                    </div>
                  </div>
                  
                  <div className={`p-5 rounded-2xl text-xs leading-relaxed font-medium relative border-l-4 border-purple-500 ${isDark ? 'bg-purple-500/10 text-purple-200' : 'bg-purple-50 text-purple-900'}`}>
                    <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-[0.2em] text-[9px] text-purple-500">
                        <Sparkles size={12} fill="currentColor" /> AI TUTOR FEEDBACK
                    </div>
                    {item.explanation || item.aiExplanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
                <button onClick={onRestart} className="flex-1 py-5 bg-white/5 border border-white/10 hover:bg-white/10 font-black rounded-2xl flex items-center justify-center gap-2 transition-all"><RotateCcw size={18}/> Retry</button>
                <button onClick={onContinue} className="flex-[2] py-5 bg-white text-black hover:bg-purple-500 hover:text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl group">
                  CONTINUE <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * ============================================================
 * MAIN EXPORT: QUIZ ARENA SYSTEM
 * ============================================================
 */
const QuizArena = ({ algoKey, isDark, onMasteryComplete }) => {
  const dispatch = useDispatch();
  const { questions, results, loading, evaluating } = useSelector(state => state.quiz);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    return () => dispatch(clearQuizSession());
  }, [dispatch]);

  const handleStart = () => {
    dispatch(startAiQuiz(algoKey));
    setShowQuizModal(true);
  };

  const handleSubmit = (userAnswers) => {
    dispatch(evaluateQuiz({ algoKey, userAnswers })).then((res) => {
        if(!res.error) {
            setShowQuizModal(false);
            setShowCelebration(true);
        }
    });
  };

  const handleRestart = () => {
    setShowCelebration(false);
    dispatch(clearQuizSession());
    handleStart();
  };

  return (
    <>
      <MasteryLobby algoKey={algoKey} isDark={isDark} onStart={handleStart} loading={loading} />

      <AnimatePresence>
        {showQuizModal && questions.length > 0 && (
          <QuizModal 
            algoKey={algoKey}
            questions={questions}
            isDark={isDark}
            evaluating={evaluating}
            onSubmit={handleSubmit}
            onClose={() => setShowQuizModal(false)}
          />
        )}
      </AnimatePresence>

      <CompletionCelebration 
        isOpen={showCelebration}
        results={results}
        isDark={isDark}
        onRestart={handleRestart}
        onContinue={() => {
            setShowCelebration(false);
            if(onMasteryComplete) onMasteryComplete();
        }}
      />
    </>
  );
};

export default QuizArena;