import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router"; 
import { 
  Trophy, Zap, Award, CheckCircle, 
  Settings, ArrowLeft, Mail, Calendar,
  Code2, Star, ExternalLink, Github, Linkedin, 
  Home, ChevronRight, LayoutGrid,User
} from "lucide-react";
import DSADashboard from "../Components/DSADashboard";

// --- ANIMATION VARIANTS (Styled to match Dashboard) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const blobVariants = {
  animate: {
    scale: [1, 1.1, 1],
    rotate: [0, 45, 0],
    x: [0, 30, 0],
    y: [0, -30, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme?.value || "dark");
  const isDark = theme === "dark";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white
      ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}
    >
      <div 
        className={`fixed inset-0 pointer-events-none z-0 
        ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div variants={blobVariants} animate="animate" className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-200 mix-blend-multiply"}`} />
        <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className={`absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}`} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* =========================================
            HEADER SECTION (Breadcrumbs + Title)
        ========================================= */}
        <div className="relative mb-20">
          <div className="flex flex-col md:flex-row md:items-start md:justify-center relative">
            
            {/* Breadcrumbs Left */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1 flex items-center gap-3 text-sm font-medium"
            >
              <Link to="/" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? "text-gray-500 hover:text-white" : "text-slate-400 hover:text-purple-600"}`}>
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <ChevronRight className={`w-4 h-4 ${isDark ? "text-gray-700" : "text-slate-300"}`} />
              <Link to="/dashboard" className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? "text-gray-500 hover:text-white" : "text-slate-400 hover:text-purple-600"}`}>
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <ChevronRight className={`w-4 h-4 ${isDark ? "text-gray-700" : "text-slate-300"}`} />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md cursor-default ${isDark ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}>
                <User className={`w-3.5 h-3.5 ${isDark ? "text-purple-400" : "text-purple-600"}`}/>
                <span>Profile</span>
              </div>
            </motion.div>

            

            {/* Settings Right */}
            <Link 
              to="/profile/update"
              className={`md:absolute md:right-0 md:top-0 p-2.5 rounded-xl border transition-all 
              ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-purple-400' : 'bg-white border-slate-200 hover:shadow-md text-purple-600'}`}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <motion.div 
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* --- LEFT: IDENTITY COLUMN --- */}
          <motion.div variants={cardVariants} className="lg:col-span-4 space-y-6">
            <div className={`group relative p-8 rounded-[2.5rem] border backdrop-blur-xl text-center flex flex-col items-center
              ${isDark ? "bg-[#0A0A0A]/60 border-white/5" : "bg-white/80 border-slate-100 shadow-xl"}`}>
              
              {/* Glossy Hover Effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]
                ${isDark ? "bg-gradient-to-br from-purple-900/10 via-transparent to-transparent" : "bg-gradient-to-br from-purple-50/50 via-transparent to-transparent"}`} />

              <div className="relative mb-6 z-10">
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-20 animate-pulse" />
                <img 
                  src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || "User")}&background=a855f7&color=fff`}
                  alt="Avatar" className="w-32 h-32 rounded-full relative border-4 border-white/10 object-cover shadow-2xl"
                />
              </div>

              <div className="relative z-10">
                <h1 className="text-2xl font-black mb-1">{user.firstName} {user.lastName || ""}</h1>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-sm
                  ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                  {user.role}
                </span>

                <div className="flex gap-3 my-8 justify-center">
                  {[ { icon: Github, link: user.githubUrl }, { icon: Linkedin, link: user.linkedinUrl } ].map((social, i) => (
                    social.link && (
                      <a key={i} href={social.link} target="_blank" rel="noreferrer" 
                        className={`p-3 rounded-xl border transition-all ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10 hover:text-purple-400" : "bg-slate-50 border-slate-100 hover:bg-white hover:text-purple-600 hover:shadow-md"}`}>
                        <social.icon size={18} />
                      </a>
                    )
                  ))}
                </div>

                <div className="w-full space-y-3 pt-6 border-t border-white/5 text-left text-sm opacity-60">
                  <div className="flex items-center gap-3"><Mail size={16} className="text-purple-500/50"/> {user.emailId}</div>
                  <div className="flex items-center gap-3"><Calendar size={16} className="text-purple-500/50"/> Arena member since {new Date(user.createdAt).getFullYear()}</div>
                </div>
              </div>
            </div>

            {/* Mastery Streak Mini Card */}
            <div className={`p-6 rounded-3xl border backdrop-blur-md transition-all
              ${isDark ? 'bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Active Streak</p>
                    <h3 className="text-3xl font-black mt-1">🔥 {user.currentStreak || 0} Days</h3>
                  </div>
                  <Zap className="w-10 h-10 text-orange-500 opacity-40 animate-pulse" />
               </div>
            </div>
          </motion.div>

          {/* --- RIGHT: CONTENT COLUMN --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Glossy Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { 
                  label: "Total Points", 
                  val: user?.totalPoints || 0, 
                  icon: Trophy, 
                  color: "text-yellow-500", 
                  bg: "bg-yellow-500/10" 
                },
                { 
                  label: "Algos Solved", 
                  val: user?.completedAlgorithms.length || 0, 
                  icon: Code2, 
                  color: "text-purple-500", 
                  bg: "bg-purple-500/10" 
                },
                { 
                  label: "Best Record", 
                  val: user?.longestStreak || 0, 
                  icon: Star, 
                  color: "text-indigo-500", 
                  bg: "bg-indigo-500/10" 
                },
              ].map((stat, i) => (
                <motion.div key={i} variants={cardVariants} whileHover="hover"
                  className={`p-6 rounded-[2rem] border backdrop-blur-md ${isDark ? 'bg-[#0A0A0A]/60 border-white/5' : 'bg-white/80 border-slate-100 shadow-md'}`}>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon size={22}/>
                  </div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black mt-1">{stat.val}</h3>
                </motion.div>
              ))}
            </div>

            {/* About Me Section */}
            {user.about && (
              <motion.div variants={cardVariants}
                className={`p-8 rounded-[2.5rem] border backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Star size={14} /> Developer Bio
                </h3>
                <p className="leading-relaxed text-sm opacity-70 italic">"{user.about}"</p>
              </motion.div>
            )}

            {/* Mastered Algorithms grid */}
            <motion.div variants={cardVariants}
              className={`group relative p-8 rounded-[2.5rem] border backdrop-blur-xl ${isDark ? 'bg-[#0A0A0A]/60 border-white/5' : 'bg-white/80 border-slate-100'}`}>
              
              <h2 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                <CheckCircle className="text-emerald-500" size={20} /> Mastered Algorithms
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                {user?.completedAlgorithms?.length > 0 ? (
                  user.completedAlgorithms.map((algo, i) => (
                    <motion.div 
                      key={i} whileHover={{ x: 4 }}
                      className={`flex items-center justify-between p-4 border rounded-2xl transition-all
                        ${isDark ? 'bg-white/5 border-white/5 hover:border-purple-500/30' : 'bg-slate-50 border-slate-100 hover:border-purple-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                        <span className="text-sm font-bold">{algo}</span>
                      </div>
                      <ExternalLink size={12} className="opacity-20 group-hover:opacity-100 text-purple-500 transition-opacity" />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic col-span-2 py-4">Finish your first algorithm to see it here.</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;