import { Github, Twitter, Linkedin, Mail, Terminal } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { motion } from "framer-motion";

// --- ANIMATION VARIANTS (Matching Body) ---
const blobVariants = {
  animate: {
    scale: [1, 1.1, 1],
    rotate: [0, 30, 0],
    x: [0, 30, 0],
    y: [0, -30, 0],
    transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Footer() {
  const theme = useSelector((state) => state.theme.value);
  const isDark = theme === "dark";

  // Social Link: Subtle hover glow matching Body
  const SocialLink = ({ href, icon: Icon }) => (
    <a
      href={href}
      className={`p-2 rounded-lg transition-all duration-300 group
        ${isDark 
          ? "hover:bg-white/10 text-gray-500 hover:text-white" 
          : "hover:bg-purple-100/50 text-slate-400 hover:text-purple-600"}
      `}
    >
      <Icon size={20} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
    </a>
  );

  // Footer Link: Clean typography with color shift
  const FooterLink = ({ to, label }) => (
    <li>
      <Link 
        to={to} 
        className={`
          text-sm font-medium block py-1 transition-colors duration-200
          ${isDark 
            ? "text-gray-500 hover:text-purple-300" 
            : "text-slate-500 hover:text-purple-600"}
        `}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <footer 
      className={`relative w-full overflow-hidden border-t font-sans transition-colors duration-700
        ${isDark 
          ? "bg-[#050505] text-white border-white/5" 
          : "bg-[#F8FAFC] text-slate-900 border-slate-200/60"}
      `}
    >
      {/* =========================================
          BACKGROUND SYSTEM (Matches Body)
      ========================================= */}
      
      {/* 1. Technical Grid Overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 
        ${isDark ? "opacity-[0.1]" : "opacity-[0.25]"}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#cbd5e1'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to top, black, transparent 90%)' // Fade out at top
        }}
      />

      {/* 2. Ambient Blobs (Bottom Focused) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={blobVariants}
          animate="animate"
          className={`absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20
            ${isDark ? "bg-purple-900 mix-blend-screen" : "bg-purple-300 mix-blend-multiply"}
          `}
        />
        <motion.div
          variants={blobVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className={`absolute -bottom-[20%] -right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20
            ${isDark ? "bg-blue-900 mix-blend-screen" : "bg-cyan-200 mix-blend-multiply"}
          `}
        />
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 md:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className={`
                p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300
                ${isDark 
                  ? "bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                  : "bg-white/60 border-white/60 shadow-sm group-hover:shadow-purple-200 group-hover:bg-white"}
              `}>
                <Terminal size={20} className={isDark ? "text-purple-300" : "text-purple-600"} />
              </div>
              <span className={`text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r 
                ${isDark ? "from-indigo-300 via-purple-300 to-pink-300" : "from-indigo-600 via-purple-600 to-pink-600"}
              `}>
                AlgoArena
              </span>
            </Link>
            
            <p className={`text-sm leading-relaxed max-w-xs font-medium
              ${isDark ? "text-gray-500" : "text-slate-500"}
            `}>
              Visualizing the complexity of code. Build, race, and master algorithms in a high-performance environment.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <SocialLink href="#" icon={Github} />
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Linkedin} />
              <SocialLink href="#" icon={Mail} />
            </div>
          </div>

          {/* Spacer (Desktop) */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links Columns */}
          <div>
            <h4 className={`font-bold mb-6 text-xs uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>
              Product
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/algorithms" label="Visualizer" />
              <FooterLink to="/race" label="Algo Racing" />
              <FooterLink to="/challenges" label="Challenges" />
              <FooterLink to="/pricing" label="Pricing" />
            </ul>
          </div>

          <div>
            <h4 className={`font-bold mb-6 text-xs uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>
              Resources
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/docs" label="Documentation" />
              <FooterLink to="/api" label="API Reference" />
              <FooterLink to="/blogs" label="Engineering Blog" />
              <FooterLink to="/community" label="Community" />
            </ul>
          </div>

          <div>
            <h4 className={`font-bold mb-6 text-xs uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>
              Company
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/careers" label="Careers" />
              <FooterLink to="/brand" label="Brand Kit" />
              <FooterLink to="/contact" label="Contact" />
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t backdrop-blur-sm
          ${isDark ? "border-white/5" : "border-slate-200/60"}
        `}>
          <p className={`text-xs font-medium ${isDark ? "text-gray-600" : "text-slate-400"}`}>
            © {new Date().getFullYear()} AlgoArena Inc. All rights reserved.
          </p>

          <div className="flex gap-8">
            <Link to="/privacy" className={`text-xs font-medium transition-colors hover:text-purple-500 ${isDark ? "text-gray-600" : "text-slate-400"}`}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={`text-xs font-medium transition-colors hover:text-purple-500 ${isDark ? "text-gray-600" : "text-slate-400"}`}>
              Terms of Service
            </Link>
            <Link to="/cookies" className={`text-xs font-medium transition-colors hover:text-purple-500 ${isDark ? "text-gray-600" : "text-slate-400"}`}>
              Cookie Settings
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}