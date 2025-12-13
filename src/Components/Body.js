import { Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useState } from "react";

// --- ANIMATION VARIANTS ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    x: [0, 50, 0],
    y: [0, -50, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

// --- SORTING BAR ANIMATIONS ---
const barVariants = {
  initial: { height: 20 },
  animate: (i) => ({
    height: [20, 60 + Math.random() * 40, 30, 80, 20],
    transition: {
      repeat: Infinity,
      duration: 2 + Math.random(),
      delay: i * 0.1,
      ease: "easeInOut",
    },
  }),
};

// =====================================================
//    VISUALIZER COMPONENT (HERO)
// =====================================================

const AlgoVisualizerCard = ({ isDark }) => {
  const bars = Array.from({ length: 12 }); 

  return (
    <div className="relative w-full max-w-lg aspect-square lg:aspect-[4/3] perspective-1000">
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotateX: [0, 2, 0],
          rotateY: [0, -2, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-3xl border backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col
          ${
            isDark
              ? "bg-gray-900/60 border-white/10 shadow-purple-900/30"
              : "bg-white/40 border-white/60 shadow-purple-200/50"
          }
        `}
      >
        {/* HEADER */}
        <div className={`px-5 py-4 border-b flex items-center justify-between
          ${isDark ? "border-white/5 bg-black/20" : "border-white/40 bg-white/40"}
        `}>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className={`text-[10px] font-mono tracking-widest opacity-50 uppercase ${isDark ? "text-white" : "text-slate-800"}`}>
            Sort_Engine_v2.tsx
          </div>
        </div>

        {/* CANVAS */}
        <div className="flex-1 relative p-8 flex items-end justify-between gap-1.5">
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: `radial-gradient(${isDark ? "#fff" : "#000"} 1px, transparent 1px)`, backgroundSize: "16px 16px" }}
          />

          {bars.map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={barVariants}
              initial="initial"
              animate="animate"
              className={`w-full rounded-t-sm backdrop-blur-sm
                ${isDark ? "bg-purple-500/60" : "bg-purple-600/50"}
              `}
              style={{
                boxShadow: isDark ? "0 0 10px rgba(168,85,247,0.4)" : "none"
              }}
            >
              {/* Shine effect on bars */}
              <div className="w-full h-full bg-gradient-to-t from-transparent to-white/30 opacity-50" />
            </motion.div>
          ))}

          {/* Scanner */}
          <motion.div
            animate={{ left: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className={`absolute top-0 bottom-0 w-[2px] z-10
              ${isDark ? "bg-white/50 shadow-[0_0_15px_white]" : "bg-purple-600/30"}
            `}
          />
        </div>

        {/* Floating Badge */}
        <div className={`absolute bottom-6 right-6 px-3 py-1.5 rounded-lg text-[10px] font-mono border backdrop-blur-md
            ${isDark ? "bg-black/50 border-white/10 text-emerald-400" : "bg-white/60 border-white/50 text-emerald-700"}
        `}>
          Status: Sorting...
        </div>
      </motion.div>

      {/* Decorative Blur Behind */}
      <div className={`absolute inset-4 blur-3xl opacity-40 -z-10
        ${isDark ? "bg-gradient-to-tr from-purple-600 to-blue-600" : "bg-gradient-to-tr from-purple-400 to-cyan-300"}
      `} />
    </div>
  );
};

// =====================================================
//    MAIN PAGE COMPONENT
// =====================================================

export default function Body() {
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);

  const features = [
    { icon: "⚡", title: "Algo Racing", desc: "Real-time sorting battles.", color: "text-rose-500", bg: "bg-rose-500/10", border: "group-hover:border-rose-500/40" },
    { icon: "🌳", title: "Tree Builder", desc: "Visualize BST, AVL & Heaps.", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/40" },
    { icon: "🧭", title: "Pathfinder", desc: "A* & Dijkstra Maze solving.", color: "text-blue-500", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/40" },
    { icon: "📊", title: "Complexity", desc: "Big-O Analytics & Charts.", color: "text-amber-500", bg: "bg-amber-500/10", border: "group-hover:border-amber-500/40" },
  ];

  const steps = [
    { id: "01", title: "Select Algorithm", desc: "Choose from 15+ sorting and searching templates." },
    { id: "02", title: "Input Data", desc: "Draw walls in grids or input your own array values." },
    { id: "03", title: "Visualize Flow", desc: "Control speed and watch the pointers move in real-time." },
  ];

  const testimonials = [
    { name: "David Kim", role: "Software Eng. @ Google", text: "Most visualizers are too abstract. This one actually shows the step-by-step logic I needed." },
    { name: "Sarah Jenkins", role: "CS Professor", text: "The pathfinding module makes A* algorithm click instantly for students. I use it in lectures." },
    { name: "Elena Rodriquez", role: "Frontend Dev", text: "The UI is gorgeous. It makes studying complex topics actually feel like playing a game." },
  ];

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white
      ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}
    >
      {/* =========================================
          BACKGROUND LAYER
      ========================================= */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 
        ${isDark ? "opacity-[0.1]" : "opacity-[0.25]"}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>

      {/* =========================================
          HERO SECTION
      ========================================= */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col lg:flex-row items-center justify-between gap-16"
      >
        <motion.div variants={itemVariants} className="flex-1 text-center lg:text-left">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border backdrop-blur-md
            ${isDark ? "bg-white/5 border-white/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "bg-white/60 border-white/60 text-purple-600 shadow-sm"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            V2.0 Now Live
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
            Visualizing <br />
            <span className={`bg-clip-text text-transparent bg-gradient-to-r 
              ${isDark ? "from-indigo-400 via-purple-400 to-pink-400" : "from-indigo-600 via-purple-600 to-pink-600"}`}>
              Algorithms
            </span>
          </h1>

          <p className={`text-base md:text-lg mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed
            ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Build strong mental models of Data Structures. See how data moves, changes, and connects in our 3D engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link to="/algorithms">
              <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" }} whileTap={{ scale: 0.98 }}
                className={`px-8 py-4 rounded-xl font-bold text-sm transition-all
                ${isDark ? "bg-white text-black hover:bg-gray-100" : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20"}`}>
                Start Exploring
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`px-8 py-4 rounded-xl font-bold text-sm border backdrop-blur-md transition-all
              ${isDark ? "border-white/10 text-white hover:bg-white/5" : "bg-white/40 border-white/60 text-slate-700 hover:bg-white/60 shadow-sm"}`}>
              View GitHub
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex-1 w-full flex justify-center lg:justify-end">
          <AlgoVisualizerCard isDark={isDark} />
        </motion.div>
      </motion.div>

      {/* =========================================
          FEATURES SECTION
      ========================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden
                ${isDark 
                  ? "bg-gray-900/30 border-white/10 hover:bg-gray-800/50 backdrop-blur-md" 
                  : "bg-white/50 border-white/60 hover:bg-white/80 shadow-lg shadow-purple-100/50 backdrop-blur-xl"
                }
                ${f.border}
              `}
            >
               {/* Light Mode Glow Blob */}
              {!isDark && <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity ${f.bg.replace('/10', '')}`} />}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 ${f.bg} ${f.color}`}>
                {f.icon}
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>{f.title}</h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS (STEPS)
      ========================================= */}
      <section className={`py-24 border-y backdrop-blur-sm relative z-10 mt-12
        ${isDark ? "border-white/5 bg-white/[0.01]" : "border-slate-200/50 bg-white/40"}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Three Steps to Mastery</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Simple, intuitive, and effective.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Connecting Line */}
             <div className={`hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] 
              ${isDark ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-purple-300/30 to-transparent"}`} 
            />

            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 border shadow-xl transition-transform hover:-translate-y-2 duration-300
                  ${isDark 
                    ? "bg-[#111] border-white/10 text-white shadow-purple-900/10" 
                    : "bg-white border-white/80 text-purple-600 shadow-purple-100/80"}`}>
                  {step.id}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{step.title}</h3>
                <p className={`text-xs max-w-[220px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          TESTIMONIALS SECTION
      ========================================= */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
           <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Devs ❤️ This.</h2>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Don't just take our word for it.</p>
            </div>
            <div className={`text-xs font-bold px-4 py-2 rounded-full border ${isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200"}`}>
               ⭐ 4.9/5 Average Rating
            </div>
          </motion.div>

          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            onMouseLeave={() => setHoveredTestimonial(null)}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredTestimonial(i)}
                className={`p-8 rounded-3xl border transition-all duration-500 cursor-default
                  ${isDark 
                    ? "bg-gray-900/40 border-white/5 backdrop-blur-md" 
                    : "bg-white/70 border-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-2xl"
                  }
                  ${hoveredTestimonial !== null && hoveredTestimonial !== i 
                    ? "opacity-40 blur-[1px] scale-95" 
                    : "opacity-100 hover:-translate-y-2 hover:border-purple-400/30"
                  }
                `}
              >
                <div className="flex gap-1 mb-4 text-amber-400 text-[10px]">★★★★★</div>
                <p className={`text-sm italic mb-6 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? "bg-white/10 text-white" : "bg-purple-100 text-purple-700"}`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{t.name}</h4>
                    <p className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          CALL TO ACTION (CTA)
      ========================================= */}
      <section className="py-20 px-6 relative z-10 pb-32">
        <div className={`max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group
          ${isDark 
            ? "bg-gradient-to-b from-purple-900/30 to-black/80 border border-white/10 backdrop-blur-xl" 
            : "bg-gradient-to-br from-white to-purple-50 border border-white/80 shadow-2xl shadow-purple-500/10 backdrop-blur-3xl"}
        `}>
          
          {/* Ambient Glows inside CTA */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 blur-3xl pointer-events-none
            ${isDark ? "bg-gradient-to-b from-purple-500/20 to-transparent" : "bg-gradient-to-b from-purple-300/30 to-transparent"}`} 
          />

          <div className="relative z-10">
            <h2 className={`text-3xl md:text-5xl font-black mb-6 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Ready to master <br/> the code?
            </h2>
            <p className={`max-w-xl mx-auto mb-10 text-sm md:text-base ${isDark ? "text-slate-400" : "text-slate-500"}`}>
               Join thousands of developers using our visualizer to ace interviews and understand complex systems.
            </p>
            
            <Link to="/algorithms">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-10 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all
                ${isDark 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/30 hover:shadow-violet-500/50"}`}
              >
                Start Visualizing for Free
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}