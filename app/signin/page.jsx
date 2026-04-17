"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase"; 
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUserByRole = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    let role = "user";

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0] || "Explorer", 
        role: "user",
        createdAt: serverTimestamp(),
      });
    } else {
      const userData = userDoc.data();
      role = userData.role || "user";
      if (!userData.displayName) {
        await setDoc(userRef, { 
          displayName: user.displayName || user.email.split('@')[0] || "Explorer" 
        }, { merge: true });
      }
    }

    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "operational") router.push("/operations");
    else router.push("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await redirectUserByRole(user);
    } catch (err) {
      setError("Magic code or email is incorrect! 🧙‍♂️");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      await redirectUserByRole(user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-4 md:p-6 overflow-x-hidden relative font-sans">
      
      {/* 🌌 Background Magic Dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-200 rounded-full blur-[80px] md:blur-[150px] opacity-50" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-200 rounded-full blur-[80px] md:blur-[150px] opacity-50" />
        <FloatingEmoji emoji="⭐" top="10%" left="5%" delay={0} />
        <FloatingEmoji emoji="✨" top="85%" left="10%" delay={1} />
        <FloatingEmoji emoji="🌟" top="5%" right="10%" delay={0.5} />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* 🎨 LEFT SIDE: HERO (Hidden on mobile for better UX, or scaled down) */}
        <div className="hidden lg:flex flex-col">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white border-[10px] border-white shadow-2xl rounded-[4rem] p-12 rotate-[-2deg] relative overflow-hidden">
               <h2 className="text-7xl font-[1000] text-slate-800 leading-[0.8] tracking-tighter uppercase italic mb-8">
                Ready for <br/> <span className="text-blue-500">Adventure?</span>
              </h2>
              <p className="text-xl font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-sm">
                Log in to access your vault of magical stories and 3D worlds.
              </p>
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-[10rem] mt-10 flex justify-center select-none">
                🧞‍♂️
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 🎫 RIGHT SIDE: THE MAGIC PASSPORT */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-[6px] md:border-[12px] border-white shadow-xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 relative mx-auto w-full max-w-[500px] lg:max-w-full"
        >
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block bg-yellow-400 text-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-lg mb-4 md:mb-6 rotate-12 border-4 border-white text-2xl md:text-3xl">
               🔑
            </div>
            <h3 className="text-3xl md:text-4xl font-[1000] text-slate-800 tracking-tighter uppercase italic">Member Entry</h3>
            <p className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest mt-2">Enter your magic credentials</p>
          </div>

          {error && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-500 rounded-2xl text-[10px] font-bold uppercase text-center">
              {error}
            </motion.div>
          )}

          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1 md:space-y-2">
              <label className="ml-4 text-[10px] font-[1000] text-slate-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <span className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-lg md:text-xl">📧</span>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@magic.com"
                  className="w-full pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-6 bg-slate-50 border-4 border-transparent rounded-[1.5rem] md:rounded-[2rem] text-base md:text-lg font-bold text-slate-700 outline-none focus:border-blue-200 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1 md:space-y-2">
              <label className="ml-4 text-[10px] font-[1000] text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <span className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-lg md:text-xl">🔒</span>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-6 bg-slate-50 border-4 border-transparent rounded-[1.5rem] md:rounded-[2rem] text-base md:text-lg font-bold text-slate-700 outline-none focus:border-blue-200 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-[1000] text-lg md:text-xl tracking-[0.1em] md:tracking-[0.2em] shadow-[0_8px_0_#1e293b] md:shadow-[0_12px_0_#1e293b] hover:-translate-y-1 hover:shadow-[0_15px_0_#1e293b] active:translate-y-2 active:shadow-none transition-all uppercase italic flex items-center justify-center gap-4 disabled:opacity-50"
            >
               {loading ? "Waking..." : "Open Vault"} <span className="text-xl md:text-2xl">🚀</span>
            </button>
          </form>

          <div className="mt-8 md:mt-12">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="h-[2px] grow bg-slate-100" />
              <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] md:tracking-[0.3em] shrink-0">OR USE MAGIC</span>
              <div className="h-[2px] grow bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
               <SocialButton onClick={handleGoogleLogin} text="Google" icon={<svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.16-4.53z" fill="#EA4335"/></svg>} />
               <SocialButton onClick={() => {}} text="Github" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>} />
            </div>
          </div>

          <p className="mt-8 md:mt-12 text-center text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest">
            New Explorer? <Link href="/signup" className="text-blue-500 hover:underline ml-1 md:ml-2">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function SocialButton({ icon, text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 border-[3px] md:border-4 border-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all text-slate-600 font-black text-[9px] md:text-xs uppercase tracking-widest"
    >
      {icon} {text}
    </button>
  );
}

function FloatingEmoji({ emoji, top, left, right, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute text-2xl md:text-4xl select-none pointer-events-none"
      style={{ top, left, right }}
    >
      {emoji}
    </motion.div>
  );
}