import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, Save, ArrowLeft, Globe, 
  Link as LinkIcon, Edit3, CheckCircle, Home, 
  ChevronRight, LayoutGrid, Settings 
} from 'lucide-react';
import { updateUser, clearError } from '../Stores/authSlice'; 

// --- ANIMATION VARIANTS (Dashboard Sync) ---
const blobVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 45, 0],
    x: [0, 50, 0],
    y: [0, -50, 0],
    transition: { 
      duration: 15, 
      repeat: Infinity, 
      ease: "easeInOut" 
    },
  },
};

const UpdateProfilePage = () => {
  const { user, loading: sliceLoading, error } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme?.value || "dark");
  const isDark = theme === "dark";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    githubUrl: '',
    linkedinUrl: '',
    about: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showSavedStatus, setShowSavedStatus] = useState(false);

  // --- SYNC FORM WITH REDUX ---
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        about: user.about || ''
      });
      setImagePreview(user.profilePicture || null);
    }
  }, [user]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  // --- IMAGE COMPRESSION (High Speed) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(compressedBase64);
        };
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSavedStatus(false);

    const payload = { 
        ...formData, 
        profilePicture: imagePreview 
    };

    const resultAction = await dispatch(updateUser(payload));
    
    if (updateUser.fulfilled.match(resultAction)) {
      setShowSavedStatus(true);
      // Seamlessly navigate back after short visual confirmation
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 font-sans selection:bg-purple-500 selection:text-white
      ${isDark ? "bg-[#050505] text-slate-200" : "bg-[#F8FAFC] text-slate-600"}`}
    >
      {/* =========================================
          BACKGROUND SYSTEM (Dashboard Sync)
      ========================================= */}
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
        
        {/* --- BREADCRUMBS --- */}
        <div className="relative mb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-center relative">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 md:mb-0 md:absolute md:left-0 md:top-1 flex items-center gap-3 text-sm font-medium"
            >
              <button onClick={() => navigate('/profile')} className={`flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 ${isDark ? "text-gray-500 hover:text-white" : "text-slate-400 hover:text-purple-600"}`}>
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <ChevronRight className={`w-4 h-4 ${isDark ? "text-gray-700" : "text-slate-300"}`} />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md cursor-default ${isDark ? "bg-white/5 border-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" : "bg-white/60 border-slate-200 text-slate-700 shadow-sm"}`}>
                <Settings className={`w-3.5 h-3.5 ${isDark ? "text-purple-400" : "text-purple-600"}`}/>
                <span>Settings</span>
              </div>
            </motion.div>

            
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Avatar Column */}
            <div className="lg:col-span-4">
                <div className={`group relative p-8 rounded-[2.5rem] border backdrop-blur-xl text-center flex flex-col items-center sticky top-32
                  ${isDark ? "bg-[#0A0A0A]/60 border-white/5 shadow-2xl" : "bg-white/80 border-slate-100 shadow-xl"}`}>
                    
                    <div className="relative mb-6 z-10" onClick={() => fileInputRef.current.click()}>
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-all" />
                        <div className={`relative w-40 h-40 rounded-full cursor-pointer overflow-hidden border-4 ${isDark ? "border-white/10" : "border-white shadow-lg"} transition-all`}>
                            <img src={imagePreview || `https://ui-avatars.com/api/?name=${formData.firstName}&background=a855f7&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <Camera size={24} className="text-white" />
                                <span className="text-[10px] font-bold uppercase text-white tracking-widest">Change Photo</span>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className={`font-black uppercase tracking-widest text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Profile Picture</h3>
                        <p className="text-[11px] opacity-50 mt-1">(keep image size 5mb)</p>
                    </div>
                </div>
            </div>

            {/* Right: Input Column */}
            <div className="lg:col-span-8 space-y-6">
                <div className={`p-8 md:p-10 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl transition-all
                    ${isDark ? 'bg-[#0A0A0A]/60 border-white/5' : 'bg-white/80 border-slate-100 shadow-xl'}`}>
                    
                    {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-bold italic">⚠️ {error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} icon={User} placeholder="Enter name" isDark={isDark} />
                        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} icon={User} placeholder="Enter surname" isDark={isDark} />
                    </div>

                    <div className="space-y-6 mb-10">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-500 ml-1">Connect Channels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="GitHub" name="githubUrl" value={formData.githubUrl} onChange={handleChange} icon={Globe} placeholder="github.com/..." isDark={isDark} />
                            <InputField label="LinkedIn" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} icon={LinkIcon} placeholder="linkedin.com/..." isDark={isDark} />
                        </div>
                        <div className="relative">
                            <label className={`text-[11px] font-black uppercase tracking-widest mb-3 block ml-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Developer Bio</label>
                            <textarea 
                              name="about" 
                              value={formData.about} 
                              onChange={handleChange} 
                              rows="5" 
                              className={`w-full border rounded-2xl p-5 text-sm outline-none transition-all resize-none font-bold ${
                                isDark 
                                ? 'bg-black/20 border-white/10 text-white focus:border-purple-500/50' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600'
                              }`} 
                              placeholder="Tell the Arena about yourself..." 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button 
                            type="submit" 
                            disabled={sliceLoading}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 py-4 font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg
                                ${showSavedStatus 
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500'
                                }`}
                        >
                            {sliceLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : showSavedStatus ? (
                                <>
                                    <CheckCircle size={20} />
                                    <span>Profile Saved!</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Commit Changes</span>
                                </>
                            )}
                        </motion.button>
                        
                        <button 
                            type="button"
                            onClick={() => navigate('/profile')}
                            className={`px-8 py-4 font-black uppercase tracking-widest rounded-2xl border transition-all
                                ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
      </main>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, icon: Icon, placeholder, isDark }) => (
    <div className="relative group w-full">
        <label className={`text-[11px] font-black uppercase tracking-widest mb-3 block ml-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{label}</label>
        <div className="relative">
            <Icon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-white/20 group-focus-within:text-purple-500' : 'text-slate-300 group-focus-within:text-purple-600'}`} />
            <input 
              type="text" 
              name={name} 
              value={value} 
              onChange={onChange} 
              placeholder={placeholder} 
              className={`w-full border rounded-2xl pl-12 pr-6 py-4 text-sm outline-none transition-all font-bold ${
                isDark 
                ? 'bg-black/20 border-white/10 text-white focus:border-purple-500/50' 
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600'
              }`} 
            />
        </div>
    </div>
);

export default UpdateProfilePage;