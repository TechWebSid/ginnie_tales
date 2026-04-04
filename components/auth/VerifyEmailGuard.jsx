"use client";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function VerifyEmailGuard({ children }) {
  const { user, loading } = useAuth();
  const [resent, setResent] = useState(false);
  const [verified, setVerified] = useState(false);

  // Sync internal state with Firebase user object
  useEffect(() => {
    if (user) {
      setVerified(user.emailVerified);
    }
  }, [user]);

  if (loading) return null;

  // If user is logged in but NOT verified, show this screen
  if (user && !verified) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-6 text-center font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border-[12px] border-white max-w-xl w-full relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400" />
          
          <div className="text-8xl mb-8">📬</div>
          
          <h2 className="text-4xl md:text-5xl font-[1000] text-slate-800 uppercase italic tracking-tighter leading-none mb-6">
            Check Your <span className="text-blue-500">Magic Mail!</span>
          </h2>
          
          <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed">
            We sent a verification link to <br/>
            <span className="text-slate-900 underline decoration-yellow-400 decoration-4 underline-offset-4">{user.email}</span>. 
            Click it to unlock your dashboard!
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-[1000] text-xl tracking-widest shadow-[0_10px_0_#1e293b] hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all uppercase italic"
            >
              I've Verified! Refresh 🚀
            </button>

            <button 
              disabled={resent}
              onClick={async () => {
                await sendEmailVerification(auth.currentUser);
                setResent(true);
              }}
              className="text-slate-400 font-black uppercase text-xs tracking-widest hover:text-blue-500 transition-colors pt-4"
            >
              {resent ? "✨ Link Resent! Check Spam Folder" : "Didn't get the email? Resend Link"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // If verified or not logged in (handled by RoleGuard), show the dashboard
  return children;
}