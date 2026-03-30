"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Firebase tools
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();

  // 1. Form States
  const [explorerName, setExplorerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Account Creation Logic
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set their Display Name in Auth
      await updateProfile(user, { displayName: explorerName });

      // Create a "User Profile" in Firestore to store extra magic data
      await setDoc(doc(db, "users", user.uid), {
        explorerName: explorerName,
        email: email,
        createdAt: new Date().toISOString(),
        role: "explorer",
        stars: 0 // Initial points/stars
      });

      router.push("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in the club! Try logging in.");
      } else {
        setError("The magic failed! Try a stronger secret code.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Social Logic
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Even for Google, we save them to Firestore if it's their first time
      await setDoc(doc(db, "users", result.user.uid), {
        explorerName: result.user.displayName,
        email: result.user.email,
        createdAt: new Date().toISOString(),
        role: "explorer"
      }, { merge: true });
      
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-6 overflow-hidden relative font-sans">
      
      {/* 🎈 Floating Adventure Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-emerald-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[120px] opacity-60" />
        <FloatingIcon emoji="🦖" top="15%" left="8%" delay={0} />
        <FloatingIcon emoji="🚀" top="75%" right="10%" delay={1} />
        <FloatingIcon emoji="🏰" bottom="20%" left="12%" delay={0.5} />
        <FloatingIcon emoji="🐙" top="10%" right="20%" delay={1.5} />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* 🎨 LEFT SIDE: THE MISSION BRIEF */}
        <div className="hidden lg:flex flex-col">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-[10px] border-white shadow-2xl rounded-[4rem] p-12 rotate-[2deg] relative"
          >
            <div className="absolute -top-6 -right-6 bg-emerald-500 text-white font-black px-6 py-3 rounded-2xl border-4 border-white shadow-lg rotate-12 uppercase tracking-tighter text-sm">
              New Recruit!
            </div>

            <h2 className="text-6xl font-[1000] text-slate-800 leading-[0.9] tracking-tighter uppercase italic mb-8">
              Begin Your<br/>
              <span className="text-emerald-500 underline decoration-emerald-100 underline-offset-8">Legend</span>
            </h2>
            
            <ul className="space-y-6">
               <FeatureItem emoji="🎨" text="Turn any photo into a hero" />
               <FeatureItem emoji="📚" text="Unlimited magical storybooks" />
               <FeatureItem emoji="🛡️" text="100% Kid-Safe & Private" />
            </ul>
          </motion.div>
        </div>

        {/* 🎫 RIGHT SIDE: THE ENROLLMENT FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-[4rem] p-10 md:p-16 relative overflow-hidden"
        >
          {/* Progress Bar Visual */}
          <div className="absolute top-0 left-0 w-full h-3 bg-slate-50">
             <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: loading ? "70%" : "33%" }}
                className="h-full bg-emerald-400 transition-all duration-1000"
             />
          </div>

          <div className="text-center mb-10">
            <h3 className="text-4xl font-[1000] text-slate-800 tracking-tighter uppercase italic leading-none">Join the Club</h3>
            {error && <p className="text-red-500 font-bold text-[10px] mt-2 bg-red-50 py-1 px-3 rounded-lg inline-block">{error}</p>}
          </div>

          <form className="space-y-5" onSubmit={handleSignUp}>
            {/* Name Input */}
            <div className="space-y-2">
              <label className="ml-4 text-[10px] font-[1000] text-slate-400 uppercase tracking-widest">Explorer Name</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">👤</span>
                <input 
                  required
                  type="text" 
                  value={explorerName}
                  onChange={(e) => setExplorerName(e.target.value)}
                  placeholder="Super Sam"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-4 border-transparent rounded-[2rem] text-lg font-bold text-slate-700 outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="ml-4 text-[10px] font-[1000] text-slate-400 uppercase tracking-widest">Parent's Email</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">📧</span>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@magic.com"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-4 border-transparent rounded-[2rem] text-lg font-bold text-slate-700 outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="ml-4 text-[10px] font-[1000] text-slate-400 uppercase tracking-widest">Secret Code</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">🔐</span>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-4 border-transparent rounded-[2rem] text-lg font-bold text-slate-700 outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-[1000] text-xl tracking-[0.2em] shadow-[0_12px_0_#1e293b] hover:-translate-y-1 hover:shadow-[0_15px_0_#1e293b] active:translate-y-2 active:shadow-none transition-all uppercase italic flex items-center justify-center gap-4 disabled:opacity-50"
            >
               {loading ? "Registering..." : "CREATE ACCOUNT"} <span className="text-2xl">✨</span>
            </button>
          </form>

          <div className="mt-10 pt-10 border-t-4 border-slate-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SocialButton 
                    onClick={handleGoogleSignUp}
                    text="Google"
                    icon={<svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.16-4.53z" fill="#EA4335"/></svg>} 
                />
                <SocialButton 
                    text="Github"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>} 
                />
             </div>
          </div>

          <p className="mt-8 text-center text-slate-300 font-bold text-xs uppercase tracking-widest">
            ALREADY IN THE CLUB? <Link href="/signin" className="text-emerald-500 hover:underline ml-2">LOG IN</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ... FeatureItem, SocialButton, FloatingIcon components remain same as your snippet
function FeatureItem({ emoji, text }) {
  return (
    <li className="flex items-center gap-4">
       <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border-2 border-emerald-100 shadow-inner shrink-0">
          {emoji}
       </div>
       <span className="font-black text-slate-600 uppercase tracking-tighter text-lg">{text}</span>
    </li>
  );
}

function SocialButton({ icon, text, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-3 py-4 border-4 border-slate-50 rounded-[1.5rem] hover:bg-slate-50 transition-all text-slate-500 font-[1000] text-[10px] uppercase tracking-widest w-full">
      {icon} {text}
    </button>
  );
}

function FloatingIcon({ emoji, top, left, right, bottom, delay }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute text-5xl select-none"
      style={{ top, left, right, bottom }}
    >
      {emoji}
    </motion.div>
  );
}