"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Sparkles, Star, Flame, Trophy, Heart } from "lucide-react";

const myStories = [
  { title: "DINO JUNGLE", color: "bg-[#00D084]", shadow: "#00A368", icon: "🦖", accent: "bg-[#059669]", emoji: "🌴" },
  { title: "SPACE CADET", color: "bg-[#6366F1]", shadow: "#4338CA", icon: "🚀", accent: "bg-[#4F46E5]", emoji: "🪐" },
  { title: "MAGIC CASTLE", color: "bg-[#F472B6]", shadow: "#DB2777", icon: "🏰", accent: "bg-[#E01E79]", emoji: "✨" },
  { title: "DEEP OCEAN", color: "bg-[#38BDF8]", shadow: "#0284C7", icon: "🐙", accent: "bg-[#0EA5E9]", emoji: "🌊" },
  { title: "ROBOT CITY", color: "bg-[#94A3B8]", shadow: "#475569", icon: "🤖", accent: "bg-[#64748B]", emoji: "⚙️" },
  { title: "GHOST PARTY", color: "bg-[#FB923C]", shadow: "#EA580C", icon: "👻", accent: "bg-[#F97316]", emoji: "🍭" },
];

export default function Library() {
  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-40">
      
      {/* 🎩 PREMIUM HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-20 mb-32 flex flex-col md:flex-row items-end justify-between gap-10">
        <div className="relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-12 -left-8 bg-yellow-400 text-[10px] font-black px-3 py-1 rounded-full border-4 border-white shadow-lg rotate-[-15deg]">
            YOUR COLLECTION
          </motion.div>
          <h1 className="text-7xl md:text-[9rem] font-[1000] text-slate-900 leading-[0.8] tracking-tighter uppercase italic">
            Story<br/><span className="text-blue-600">Vault</span>
          </h1>
        </div>

        <div className="flex gap-4 mb-4">
           <div className="group relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Find an adventure..." 
                className="pl-16 pr-8 py-6 bg-white border-[6px] border-white rounded-[2.5rem] shadow-xl text-xl font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all w-80"
              />
           </div>
           <button className="bg-slate-900 text-white px-8 rounded-[2.5rem] shadow-[0_12px_0_#1e293b] hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center border-4 border-white">
              <Plus size={32} strokeWidth={4} />
           </button>
        </div>
      </div>

      {/* 📚 THE 3D SHELF GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-48">
        {myStories.map((story, i) => (
          <BookItem key={i} story={story} index={i} />
        ))}
      </div>
    </div>
  );
}

function BookItem({ story, index }) {
  return (
    <div className="relative group perspective-2000 flex flex-col items-center">
      
      {/* THE 3D BOOK BODY */}
      <motion.div 
        whileHover={{ rotateY: -35, rotateX: 5, x: 15 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="relative w-[300px] h-[400px] transform-gpu preserve-3d cursor-pointer"
      >
        
        {/* PAGES (The "Paper" Stack Effect) */}
        <div className="absolute top-[10px] right-[-12px] bottom-[10px] w-12 bg-white border-2 border-slate-200 rounded-r-md flex flex-col justify-between p-1 opacity-100 shadow-inner">
           {[...Array(15)].map((_, i) => (
             <div key={i} className="h-[1px] w-full bg-slate-100" />
           ))}
        </div>

        {/* SPINE (Curved Side) */}
        <div 
          className="absolute left-[-15px] top-0 bottom-0 w-[40px] rounded-l-3xl shadow-inner z-20"
          style={{ backgroundColor: story.shadow }}
        />

        {/* FRONT COVER */}
        <div 
          className={`absolute inset-0 ${story.color} rounded-r-[3rem] border-[12px] border-white shadow-2xl z-30 flex flex-col items-center overflow-hidden`}
        >
          {/* Cover Patterns */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,white_0%,transparent_50%)]" />
          </div>

          {/* Top Banner */}
          <div className={`${story.accent} w-full py-4 text-center border-b-4 border-white/20`}>
             <span className="text-white/60 font-black text-[10px] tracking-[0.4em] uppercase">GinnieTales Edition</span>
          </div>

          {/* Character Pop-out */}
          <div className="mt-10 mb-6 relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150" />
            <span className="text-[7rem] drop-shadow-[0_15px_10px_rgba(0,0,0,0.3)] relative z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 block">
              {story.icon}
            </span>
          </div>

          {/* Title Area */}
          <div className="px-6 text-center">
            <h3 className="text-3xl font-[1000] text-white tracking-tighter uppercase leading-none italic drop-shadow-lg">
              {story.title}
            </h3>
            <div className="h-1.5 w-12 bg-white/40 mx-auto mt-4 rounded-full" />
          </div>

          {/* Bottom Badge */}
          <div className="absolute bottom-8 right-8 rotate-[-15deg]">
             <div className="bg-yellow-400 p-3 rounded-2xl border-4 border-white shadow-lg">
                <Star className="fill-white text-white" size={20} />
             </div>
          </div>
        </div>
      </motion.div>

      {/* FOOTER METRICS (The "Stats" look cool) */}
      <div className="mt-16 flex flex-col items-center gap-4">
         <div className="flex gap-2">
            <MetricBadge icon={<Flame size={12}/>} text="READ 3x" color="bg-orange-100 text-orange-600" />
            <MetricBadge icon={<Trophy size={12}/>} text="UNLOCKED" color="bg-purple-100 text-purple-600" />
         </div>
         <h4 className="font-black text-slate-300 tracking-[0.3em] text-[10px] uppercase">Created on Oct 2026</h4>
      </div>

      {/* FLOATING DECORATIVE EMOJI */}
      <div className="absolute -top-10 -right-4 text-4xl opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-4 pointer-events-none">
        {story.emoji}
      </div>
    </div>
  );
}

function MetricBadge({ icon, text, color }) {
  return (
    <div className={`${color} px-3 py-1.5 rounded-xl flex items-center gap-2 font-[1000] text-[9px] border-2 border-white shadow-sm uppercase tracking-wider`}>
      {icon} {text}
    </div>
  );
}