"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, RefreshCw, ArrowLeft, partyPopper } from "lucide-react";

export default function VerifyEmail() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.emailVerified) {
          router.push("/dashboard");
        }
      } else {
        router.push("/signup");
      }
    });

    // Auto-check logic: Checks every 3 seconds if user verified their email
    const checkVerification = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(checkVerification);
          router.push("/dashboard");
        }
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(checkVerification);
    };
  }, [router]);

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage("A fresh magic link has been sent to your inbox! ✨");
    } catch (err) {
      setMessage("Wait a bit before requesting another link.");
    } finally {
      setTimeout(() => setResending(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border-[10px] border-white shadow-2xl rounded-[3rem] p-10 text-center relative z-10"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-emerald-50">
          <Mail size={40} />
        </div>

        <h1 className="text-4xl font-[1000] text-slate-800 tracking-tighter uppercase italic leading-none mb-4">
          Check Your <br /><span className="text-emerald-500">Magic Mail</span>
        </h1>

        <p className="text-slate-500 font-bold mb-8 leading-snug">
          We've sent a verification link to <span className="text-slate-800">{user?.email}</span>. Click it to unlock your adventure!
        </p>

        {message && (
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase">
            {message}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-400 animate-pulse font-black text-[10px] uppercase tracking-widest mb-4">
            <RefreshCw size={14} className="animate-spin" /> Waiting for you to verify...
          </div>

          <button 
            onClick={handleResend}
            disabled={resending}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-[1000] tracking-widest uppercase italic shadow-[0_8px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Link"}
          </button>

          <button 
            onClick={() => auth.signOut()}
            className="flex items-center justify-center gap-2 w-full text-slate-400 font-black text-xs uppercase tracking-widest hover:text-red-400 transition-colors pt-4"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}