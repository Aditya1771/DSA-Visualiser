import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { verifySignupOtp, verifyLoginOtp, resendOtp } from "../Stores/authSlice";
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router";

const OtpVerification = () => {
    const [searchParams] = useSearchParams();
  const purpose = searchParams.get("purpose") || "signup";
  const [otp, setOtp] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const { error, loading, otpPending } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If there's no pending OTP (page reload), bounce back
  useEffect(() => {
    if (!otpPending) {
      navigate(purpose === "signup" ? "/signup" : "/login");
    }
  }, [otpPending, navigate, purpose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailId = otpPending?.emailId;
    if (!emailId) return;

    const thunk = purpose === "signup" ? verifySignupOtp : verifyLoginOtp;

    dispatch(thunk({ emailId, otp })).then((res) => {
      if (!res.error) navigate("/dashboard");
    });
  };

  const handleResend = () => {
    const emailId = otpPending?.emailId;
    if (!emailId) return;
    dispatch(resendOtp({ emailId, purpose })).then((res) => {
      if (!res.error) {
        setResendMsg("New code sent to your email.");
        setTimeout(() => setResendMsg(""), 4000);
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
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Verify Your Email
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              We sent a 6-digit code to{" "}
              <span className="text-purple-300 font-semibold">
                {otpPending?.emailId || "your email"}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
                {error}
              </div>
            )}
            {resendMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl text-center">
                {resendMsg}
              </div>
            )}

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-2xl tracking-[0.6em] font-black focus:outline-none focus:border-purple-500/50 transition-all"
              autoFocus
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={loading}
            className="mt-5 w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-purple-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Didn't get the code? Resend
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerification;