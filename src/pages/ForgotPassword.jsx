import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../Stores/authSlice";
import { Mail, Lock, ArrowRight, ShieldCheck, KeyRound, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [emailId, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const { error, loading, otpPending, resetToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (resetToken && step === 2) setStep(3);
  }, [resetToken, step]);

  useEffect(() => {
    if (otpPending?.purpose === "forgot-password" && otpPending.emailId === emailId) {
      setStep(2);
    }
  }, [otpPending, emailId]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendForgotPasswordOtp({ emailId })).unwrap();
    } catch {
      // The rejected thunk updates the shared auth error shown on this page.
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyForgotPasswordOtp({ emailId, otp }));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ resetToken, newPassword, confirmPassword })).then((res) => {
      if (!res.error) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
              {step === 1 && <Mail className="w-6 h-6 text-purple-400" />}
              {step === 2 && <ShieldCheck className="w-6 h-6 text-purple-400" />}
              {step === 3 && <KeyRound className="w-6 h-6 text-purple-400" />}
            </div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Set New Password"}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && `Code sent to ${emailId}`}
              {step === 3 && "Choose a strong new password"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center mb-5">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl text-center mb-5 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Password reset! Redirecting to login...
            </div>
          )}

          {step === 1 && !success && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
              >
                {loading ? "Sending..." : "Send Reset Code"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && !success && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-2xl tracking-[0.6em] font-black focus:outline-none focus:border-purple-500/50"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
              >
                {loading ? "Verifying..." : "Verify Code"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 3 && !success && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
              >
                {loading ? "Resetting..." : "Reset Password"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-8">
            Remembered it?{" "}
            <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300">
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
