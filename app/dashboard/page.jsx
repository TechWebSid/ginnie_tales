"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Protection & Data Fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/signin"); // Boot them out if not logged in
      } else {
        setUser(currentUser);
        // Get the extra magic data (Explorer Name, Stars) from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-20">
    

      <main className="max-w-7xl mx-auto p-8">
        {/* 👋 WELCOME SECTION */}
        <header className="mb-12">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-[1000] text-slate-800 tracking-tighter uppercase italic"
          >
            Welcome back, <br/>
            <span className="text-blue-500">{userData?.explorerName || "Explorer"}!</span> 👋
          </motion.h1>
          <p className="text-slate-400 font-bold text-lg uppercase tracking-widest mt-4">
            What's the mission for today?
          </p>
        </header>

        {/* 🃏 MAIN ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CREATE STORY CARD (The Big One) */}
          <ActionCard 
            title="Create Story"
            desc="Turn your ideas into 3D magic"
            emoji="🎨"
            color="bg-blue-500"
            shadow="shadow-[0_15px_0_#1e40af]"
            href="/story"
            large
          />

          <ActionCard 
            title="My Library"
            desc="Your saved adventures"
            emoji="📚"
            color="bg-purple-500"
            shadow="shadow-[0_15px_0_#6b21a8]"
            href="/history"
          />

          <ActionCard 
            title="Order Vault"
            desc="Physical prints & books"
            emoji="📦"
            color="bg-emerald-500"
            shadow="shadow-[0_15px_0_#065f46]"
            href="/orders"
          />
        </div>

        {/* 📊 MINI STATS / QUICK LINKS */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
           <QuickLink emoji="🛒" label="Cart" count={2} />
           <QuickLink emoji="🏷️" label="Coupons" />
           <QuickLink emoji="⚡" label="Settings" />
           <QuickLink emoji="💎" label="Premium" />
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ActionCard({ title, desc, emoji, color, shadow, href, large = false }) {
  return (
    <Link href={href} className={`${large ? 'md:col-span-2' : ''} group`}>
      <motion.div 
        whileHover={{ y: -5 }}
        whileTap={{ y: 5 }}
        className={`${color} ${shadow} rounded-[3rem] p-10 h-full relative overflow-hidden border-4 border-white`}
      >
        <div className="relative z-10">
          <span className="text-6xl mb-6 block">{emoji}</span>
          <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter mb-2">{title}</h3>
          <p className="text-white/80 font-bold uppercase tracking-widest text-sm">{desc}</p>
        </div>
        {/* Background Decorative Emoji */}
        <div className="absolute -bottom-10 -right-10 text-[12rem] opacity-20 group-hover:rotate-12 transition-transform">
          {emoji}
        </div>
      </motion.div>
    </Link>
  );
}

function QuickLink({ emoji, label, count }) {
  return (
    <div className="bg-white border-4 border-slate-100 p-6 rounded-[2rem] flex flex-col items-center justify-center hover:border-blue-200 cursor-pointer transition-all">
       <span className="text-3xl mb-2">{emoji}</span>
       <span className="font-black text-slate-800 uppercase tracking-tighter text-sm">{label}</span>
       {count && (
         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full border-2 border-white">
           {count}
         </span>
       )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F0F4FF] flex flex-col items-center justify-center">
       <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-7xl mb-8"
       >
         🌀
       </motion.div>
       <h2 className="text-2xl font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Loading Magic...</h2>
    </div>
  );
}