"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, Heart, CheckCircle2, Star, Sparkles as SparklesIcon } from "lucide-react";

const safetyFeatures = [
  {
    icon: <Lock className="w-12 h-12 text-pink-500" />,
    title: "PRIVATE PHOTOS",
    desc: "We never store your personal photos. After the story is created, they vanish into thin air!",
    accent: "bg-pink-50",
    border: "border-pink-200",
    rotate: "-2deg"
  },
  {
    icon: <EyeOff className="w-12 h-12 text-blue-500" />,
    title: "NO AD TRACKING",
    desc: "No third-party ads. Your child's imagination is the only thing we care about here.",
    accent: "bg-blue-50",
    border: "border-blue-200",
    rotate: "1deg"
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-emerald-500" />,
    title: "KID-SAFE AI",
    desc: "Strict content filters are in place. Only happy endings and magical adventures allowed.",
    accent: "bg-emerald-50",
    border: "border-emerald-200",
    rotate: "2deg"
  },
];

export default function SafetyZone() {
  return (
    <section className="relative py-32 px-6 bg-[#FDFDFF] text-slate-900 overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* 🎈 FLOATING PROPS (Similar to ThemeSelector for consistency) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[15%] left-[10%] text-blue-100 opacity-60">
            <ShieldCheck size={160} strokeWidth={0.5} />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-[10%] right-[5%] text-pink-100 opacity-60">
            <Heart size={140} strokeWidth={0.5} />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Header - Comic Style */}
        <div className="text-center mb-24 relative">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1, rotate: -12 }}
            className="absolute -top-16 left-1/2 -translate-x-32 bg-yellow-400 text-slate-900 font-[1000] px-4 py-1 rounded-lg border-4 border-white shadow-lg text-xs tracking-widest z-20"
          >
            100% SECURE
          </motion.div>

          <h2 className="text-6xl md:text-[9rem] font-[1000] tracking-tighter italic uppercase leading-[0.8] mb-4">
            A <span className="text-pink-500 drop-shadow-[0_5px_0_#FCE7F3]">Safe</span> Space<br />
            <span className="text-blue-500 underline decoration-[12px] decoration-blue-100 underline-offset-[10px]">For Magic</span>
          </h2>
          <p className="text-xl font-black text-slate-400 uppercase tracking-[0.4em] mt-8 flex items-center justify-center gap-3">
             <Star className="fill-yellow-400 text-yellow-400" size={20}/> Parental Peace of Mind <Star className="fill-yellow-400 text-yellow-400" size={20}/>
          </p>
        </div>

        {/* Bento Grid - 3D Paper Stack Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 perspective-1000">
          {safetyFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -15, 
                rotateY: i === 0 ? 10 : i === 2 ? -10 : 0,
                scale: 1.02
              }}
              className="relative group bg-white p-12 rounded-[4rem] border-[14px] border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col items-center text-center transition-all transform-gpu preserve-3d"
              style={{ rotate: f.rotate }}
            >
              {/* Magic Stamp Background Decor */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <CheckCircle2 size={200} />
              </div>

              {/* Icon Container */}
              <div className={`${f.accent} ${f.border} border-4 p-8 rounded-[2.5rem] mb-10 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {f.icon}
              </div>

              <h3 className="text-3xl font-[1000] tracking-tighter uppercase mb-4 text-slate-800 leading-none">
                {f.title}
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed text-base max-w-[240px]">
                {f.desc}
              </p>

              {/* Holographic Sparkle Corner */}
              <div className="absolute top-8 right-8 text-slate-200 group-hover:text-yellow-400 transition-colors">
                <SparklesIcon size={32} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout - "The Promise" */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 relative"
        >
          {/* Subtle connecting line */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-slate-100 to-slate-200 hidden md:block" />
          
          <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 border-[12px] border-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#3b82f6,transparent)] animate-pulse" />
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl border-4 border-white/20">
                <Heart className="w-12 h-12 text-white fill-white animate-bounce" />
              </div>
              <div className="text-left">
                <h4 className="text-3xl md:text-4xl font-[1000] text-white tracking-tighter uppercase leading-none mb-2">Our Pinky Promise</h4>
                <p className="text-blue-100/70 font-bold text-lg">We build for our own kids, so we built it for yours.</p>
              </div>
            </div>

            <button className="relative z-10 px-12 py-6 bg-white text-slate-900 rounded-[2rem] font-[1000] text-xl tracking-widest hover:bg-yellow-400 hover:-translate-y-2 active:translate-y-1 transition-all shadow-[0_10px_0_#e2e8f0] hover:shadow-[0_10px_0_#ca8a04]">
              LEARN MORE
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}

function Sparkles({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}