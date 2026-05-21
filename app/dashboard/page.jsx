"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import RoleGuard from "@/components/auth/RoleGuard";
import { 
  Sparkles, Wand2, Star, Heart, CloudLightning, 
  User, Bookmark, Plus, Shuffle, ArrowRight, BookOpen
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Magic Combinator State (Using your actual form presets)
  const [magicCombo, setMagicCombo] = useState({
    theme: "Adventure",
    subject: "Lost in the Candy Clouds",
    style: "Ghibli"
  });

  const generateMagicCombo = () => {
    const themes = ["Educational", "Fairy Tales", "Adventure", "Worlds"];
    const styles = ["Ghibli", "watercolor", "sticker art", "soft anime"];
    const sampleSubjects = {
      "Educational": "Solar System Adventure",
      "Fairy Tales": "The Crystal Palace",
      "Adventure": "Lost in the Candy Clouds",
      "Worlds": "The Planet of Sweets"
    };

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const selectedSubject = sampleSubjects[randomTheme];

    setMagicCombo({
      theme: randomTheme,
      subject: selectedSubject,
      style: randomStyle
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/signin"); 
      } else {
        setUser(currentUser);
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

  if (loading) return <LoadingScreen />;

  return (
    <RoleGuard allowedRoles={["explorer"]}>
      <div className="min-h-screen bg-[#F8FAFF] pt-24 pb-24 relative overflow-x-hidden select-none">
        
        {/* 🌌 IMMERSIVE FLOATING GENIE VIBES CONTAINER */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[5%] left-[-10%] w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[140px] animate-pulse" />

          {/* 🧞‍♂️ Giant Floating Genie */}
          <motion.div 
            animate={{ y: [0, -25, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[8%] right-[2%] md:right-[4%] w-40 sm:w-56 lg:w-72 opacity-95 lg:opacity-100 hidden sm:block mix-blend-multiply"
          >
            <img src="/genie.png" alt="Ginnie Magical Guide" className="w-full h-auto drop-shadow-[0_30px_50px_rgba(147,51,234,0.25)]" />
          </motion.div>

          {/* Floating Sparkles & Icons */}
          <motion.div animate={{ scale: [0.8, 1.2, 0.8] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[18%] left-[6%] text-yellow-400"><Star size={24} className="fill-yellow-300" /></motion.div>
          <motion.div animate={{ scale: [1.2, 0.8, 1.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute top-[60%] right-[8%] text-purple-400"><Sparkles size={28} className="fill-purple-200" /></motion.div>
          
          {/* Animated Magic Smoke Bubbles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-tr from-purple-400/10 to-pink-400/20 rounded-full border border-white/20 backdrop-blur-[1px]"
              style={{
                width: Math.random() * 30 + 20,
                height: Math.random() * 30 + 20,
                left: `${Math.random() * 85 + 5}%`,
                top: `${Math.random() * 70 + 20}%`,
              }}
              animate={{ y: [0, -40, 0], x: [0, Math.random() * 20 - 10, 0] }}
              transition={{ duration: Math.random() * 4 + 5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>

        <main className="max-w-7xl mx-auto p-5 md:p-8 relative z-10 space-y-12 md:space-y-16">
          
          {/* 👋 WELCOME INTRO */}
          <header className="mb-4">
            <motion.h1 
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-[1000] text-slate-800 tracking-tighter uppercase italic leading-[0.85]"
            >
              Welcome back, <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 block sm:inline drop-shadow-sm">
                {userData?.explorerName || "Explorer"}!
              </span> 👋
            </motion.h1>
            <p className="text-slate-400 font-black text-[10px] md:text-sm uppercase tracking-[0.25em] mt-4 opacity-80 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-500 animate-pulse" /> Ready for a new masterwork?
            </p>
          </header>

          {/* 🃏 SECTION 1: MAIN ACTION CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <ActionCard 
              title="Create Story"
              desc="Turn your ideas into 3D magic"
              emoji="🎨"
              color="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"
              shadow="shadow-[0_8px_0_#1e40af] md:shadow-[0_15px_0_#1e40af]"
              href="/story"
              large
            />
            <ActionCard 
              title="My Library"
              desc="Your saved adventures"
              emoji="📚"
              color="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700"
              shadow="shadow-[0_8px_0_#6b21a8] md:shadow-[0_15px_0_#6b21a8]"
              href="/history"
            />
            <ActionCard 
              title="Order Vault"
              desc="Physical prints & books"
              emoji="📦"
              color="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600"
              shadow="shadow-[0_8px_0_#065f46] md:shadow-[0_15px_0_#065f46]"
              href="/dashboard/orders"
            />
          </div>

          {/* 🧞‍♂️ SECTION 2: GINNIE'S MAGIC COMBINATOR (RELEVANT FLOW BUILDER) */}
          <section className="bg-white border-[3px] md:border-4 border-[#073B4C] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-[6px_6px_0px_#118AB2] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-[#06D6A0]/10 text-[#06D6A0] font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-[#06D6A0]/20">
                  <Wand2 size={12} /> Recipe Randomizer
                </div>
                <h2 className="text-2xl md:text-3xl font-[1000] text-[#073B4C] uppercase tracking-tight italic">Ginnie's Story Combinator</h2>
                
                {/* Visual Recipe Tokens */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1.5 bg-blue-50 border-2 border-blue-100 text-blue-600 font-black text-[10px] md:text-xs rounded-xl uppercase">✨ Theme: {magicCombo.theme}</span>
                  <span className="px-3 py-1.5 bg-purple-50 border-2 border-purple-100 text-purple-600 font-black text-[10px] md:text-xs rounded-xl uppercase">🎬 Subject: {magicCombo.subject}</span>
                  <span className="px-3 py-1.5 bg-pink-50 border-2 border-pink-100 text-pink-600 font-black text-[10px] md:text-xs rounded-xl uppercase">🎨 Style: {magicCombo.style}</span>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <button 
                  onClick={generateMagicCombo}
                  className="flex-1 sm:flex-none px-5 py-3.5 bg-white border-2 border-[#073B4C] text-[#073B4C] font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 shadow-[3px_3px_0px_#073B4C] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <Shuffle size={14} /> Shuffle Mix
                </button>
                <Link 
                  href={`/story?theme=${magicCombo.theme}&subject=${magicCombo.subject}&style=${magicCombo.style}`}
                  className="flex-1 sm:flex-none px-6 py-4 bg-[#EF476F] text-white font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 shadow-[3px_3px_0px_#C9184A] border-2 border-white hover:bg-[#fa557b] active:translate-y-0.5 active:shadow-none transition-all text-center"
                >
                  Cook This Tale! <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          {/* 👥 SECTION 3: MY ACTIVE CAST (CHARACTER BLUEPRINTS) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl md:text-3xl font-[1000] text-slate-800 uppercase tracking-tight italic flex items-center gap-2">
                <User size={20} className="text-blue-500" /> My Active Cast
              </h2>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hero Archetypes</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-[#073B4C] p-4 rounded-2xl shadow-[4px_4px_0px_#073B4C] flex flex-col items-center text-center relative overflow-hidden group">
                <div className="w-16 h-16 bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden shadow-inner mb-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.explorerName || 'Sid'}`} alt="Hero avatar" />
                </div>
                <h4 className="font-black text-sm text-[#073B4C] uppercase truncate max-w-full">{userData?.explorerName || "Explorer Hero"}</h4>
                <p className="text-[9px] font-bold text-[#118AB2] uppercase tracking-wider">Main Protagonist</p>
              </div>

              <Link href="/story" className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group text-center min-h-[140px]">
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors mb-2">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-black text-slate-400 group-hover:text-blue-500 uppercase tracking-tight">New Hero</span>
              </Link>
            </div>
          </section>

          {/* ⏳ SECTION 4: RESUME ADVENTURE / RECENT DRAFTS */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-3xl font-[1000] text-slate-800 uppercase tracking-tight italic flex items-center gap-2 px-2">
              <Bookmark size={20} className="text-purple-500" /> Resume Adventure
            </h2>
            
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-16 bg-[#F1FAEE] border-2 border-[#073B4C] rounded-lg shadow-sm flex items-center justify-center font-black text-[#118AB2] text-xs shrink-0 rotate-[-3deg]">📖</div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-base text-[#073B4C] uppercase truncate">Your Last Creative Masterpiece</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Status: Ready in Library Feed</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/history')}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black uppercase text-xs rounded-xl shadow-md tracking-wider shrink-0 hover:opacity-90 active:scale-95 transition-all"
              >
                Jump Back In
              </button>
            </div>
          </section>

          {/* 📊 MINI QUICK LINKS PANEL */}
          <div className="mt-14 grid grid-cols-4 gap-3 md:gap-6 relative z-10">
             <QuickLink emoji="🛒" label="Cart" count={2} />
             <QuickLink emoji="🏷️" label="Coupons" />
             <QuickLink emoji="⚡" label="Settings" />
             <QuickLink emoji="💎" label="Premium" />
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}

// --- CARD UTILITY SUB-COMPONENT ---
function ActionCard({ title, desc, emoji, color, shadow, href, large = false }) {
  return (
    <Link href={href} className={`${large ? 'col-span-2' : 'col-span-1'} group h-full block`}>
      <motion.div 
        whileHover={{ y: -6, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`${color} ${shadow} rounded-[1.8rem] md:rounded-[3rem] p-5 sm:p-6 md:p-10 h-full relative overflow-hidden border-2 md:border-4 border-white flex flex-col justify-end min-h-[150px] sm:min-h-[180px] md:min-h-[270px] transition-all duration-300`}
      >
        <div className="relative z-10 space-y-1">
          <span className="text-4xl sm:text-5xl md:text-7xl mb-2 md:mb-5 block group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 select-none">
            {emoji}
          </span>
          <h3 className="text-xl sm:text-2xl md:text-5xl font-[1000] text-white uppercase italic tracking-tighter leading-none flex items-center gap-2">
            {title} <Wand2 size={24} className="text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-300 hidden md:block" />
          </h3>
          <p className="text-white/80 font-black uppercase tracking-wider text-[8px] sm:text-[9px] md:text-xs mt-1">{desc}</p>
        </div>
        <div className="absolute -bottom-6 -right-6 text-8xl md:text-[14rem] opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 pointer-events-none select-none">
          {emoji}
        </div>
      </motion.div>
    </Link>
  );
}

function QuickLink({ emoji, label, count }) {
  return (
    <div className="bg-white border-2 md:border-4 border-slate-100 p-3 sm:p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 cursor-pointer transition-all relative group shadow-sm">
       <span className="text-xl sm:text-2xl md:text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">{emoji}</span>
       <span className="font-black text-slate-700 uppercase tracking-tighter text-[8px] sm:text-[9px] md:text-xs group-hover:text-blue-500 transition-colors">{label}</span>
       {count && (
         <span className="absolute -top-1 -right-1 bg-[#EF476F] text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border-2 border-white shadow-md font-black">
           {count}
         </span>
       )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center p-6 text-center">
       <motion.div 
        animate={{ y: [0, -15, 0], rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl md:text-9xl mb-6 select-none filter drop-shadow-md"
       >
         🧞‍♂️
       </motion.div>
       <h2 className="text-lg md:text-2xl font-[1000] text-blue-500 uppercase tracking-[0.4em] animate-pulse">Summoning Portal...</h2>
    </div>
  );
}