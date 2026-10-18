import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { sendLoginOtp, googleLoginUser } from "../Stores/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const { error, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(sendLoginOtp(formData)).then((res) => {
    if (!res.error) navigate("/verify-otp?purpose=login");
  });
};
  const handleGoogleSuccess = useCallback((credentialResponse) => {
    dispatch(googleLoginUser(credentialResponse.credential)).then((res) => {
      if (!res.error) navigate("/dashboard");
    });
  }, [dispatch, navigate]);

  const handleGoogleError = useCallback(() => {
    console.log("Google Login Failed");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm mt-2">Enter your credentials to enter the Arena</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
            >
              {loading ? "Verifying..." : "Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-gray-500 text-xs font-bold uppercase">Or</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex justify-center">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  width="350"
                />
             </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 font-bold hover:text-purple-300">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;