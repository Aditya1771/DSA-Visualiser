import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { sendSignupOtp } from "../Stores/authSlice";
import { User, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({ firstName: "", emailId: "", password: "" });
  const { error, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleAction = (e) => {
  e.preventDefault();
  dispatch(sendSignupOtp(formData)).then((res) => {
    if (!res.error) navigate("/verify-otp?purpose=signup");
  });
};

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
            <UserPlus className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-3xl font-black text-white">Join the Arena</h2>
          <p className="text-gray-400 text-sm mt-2">Start your journey into algorithms</p>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}
          
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="First Name"
              required
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
              onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="password"
              placeholder="Strong Password"
              required
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 mt-6"
          >
            {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;