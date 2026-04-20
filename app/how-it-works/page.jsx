"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  UserCircle2, Sparkles, Camera, Wand2, 
  Rocket, Star, Heart, Zap, ChevronDown
} from "lucide-react";

const STEPS = [
  {
    title: "The Hero's Name",
    desc: "Give your legend an identity! Every story starts with a name.",
    icon: <UserCircle2 size={32} />,
    color: "#FF70A6",
    rotation: "-2deg"
  },
{
    title: "Pick a World",
    desc: "From Dino Jungles to Candy Clouds—you choose the stage!",
    icon: <Sparkles size={32} />, // Fix is here
    color: "#4CC9F0",
    rotation: "2deg"
  },
  {
    title: "The Magic Photo",
    desc: "Snap a pic! Our AI paints your child into every page.",
    icon: <Camera size={32} />,
    color: "#FFD670",
    rotation: "-1deg"
  },
  {
    title: "Poof! Storytime",
    desc: "In minutes, a 24-page cinematic masterpiece is born.",
    icon: <Wand2 size={32} />,
    color: "#06D6A0",
    rotation: "1deg"
  }
];

export default function MagicRecipe() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans selection:bg-pink-200 overflow-x-hidden">
      
      {/* 🚀 Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-2 bg-pink-500 z-50 origin-left" style={{ scaleX }} />

      {/* 🎨 FLOATING BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-[10%] left-[5%] animate-bounce"><Star size={80} fill="#FFD670" color="#FFD670" /></div>
        <div className="absolute bottom-[20%] right-[5%] animate-pulse"><Heart size={100} fill="#FF70A6" color="#FF70A6" /></div>
        <div className="absolute top-[40%] right-[10%] rotate-12"><Zap size={60} fill="#4CC9F0" color="#4CC9F0" /></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* 👑 BOLD HEADER SECTION */}
        <header className="pt-16 pb-12 md:pt-24 md:pb-20 text-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#2D3047] rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest mb-6 shadow-[4px_4px_0px_#2D3047]"
          >
            <Sparkles size={14} className="text-pink-500" />
            How the magic happens
          </motion.div>
          
          <h1 className="text-[14vw] md:text-[9rem] font-[1000] text-[#2D3047] leading-[0.85] tracking-tighter uppercase italic mb-4">
            Magic <br /> 
            <span className="text-blue-500 drop-shadow-[4px_4px_0px_#2D3047]">Recipe</span>
          </h1>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-8 flex justify-center opacity-40"
          >
            <ChevronDown size={40} />
          </motion.div>
        </header>

        {/* 🎢 THE INTERACTIVE PATH */}
        <div className="relative pb-20">
          {/* Central Path Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-2 bg-[#2D3047] md:-translate-x-1/2 rounded-full opacity-10" />

          <div className="space-y-12 md:space-y-24 relative">
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex items-center w-full ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                {/* Content Side */}
                <div className="w-full md:w-[48%] pl-16 md:pl-0">
                  <div 
                    className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-[4px] md:border-[6px] border-[#2D3047] shadow-[8px_8px_0px_#2D3047] md:shadow-[16px_16px_0px_#2D3047] relative group hover:-rotate-0 transition-transform duration-300"
                    style={{ rotate: step.rotation }}
                  >
                    <div 
                      className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg border-4 border-[#2D3047] transform group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-[#2D3047] uppercase tracking-tighter mb-3 leading-none">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-lg font-bold leading-snug">
                      {step.desc}
                    </p>
                    
                    {/* Number Badge */}
                    <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-12 h-12 md:w-16 md:h-16 bg-pink-500 text-white rounded-full flex items-center justify-center font-black text-lg md:text-2xl border-4 border-[#2D3047] shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                </div>

                {/* Path Dot */}
                <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-white border-[4px] md:border-[6px] border-[#2D3047] rounded-full z-20">
                    <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20" />
                </div>

                <div className="hidden md:block w-[48%]" />
              </motion.div>
            ))}
          </div>
        </div>

   {/* 🚀 ULTIMATE CALL TO ACTION */}
<section className="mt-20 pb-32 text-center px-4">
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    className="bg-[#F8FAFF] border-[4px] border-[#2D3047] rounded-[3rem] p-8 md:p-16 shadow-[12px_12px_0px_#2D3047] max-w-4xl mx-auto"
  >
    <h2 className="text-4xl md:text-6xl font-[1000] text-[#2D3047] uppercase tracking-tighter mb-12 leading-none">
      Ready for <br className="md:hidden" /> Your Adventure?
    </h2>
    
    <motion.button 
      whileHover={{ scale: 1.05, rotate: "1deg" }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/story")}
      /* FORCING COLORS HERE: 
         We use style={{...}} to guarantee background and text colors 
      */
      style={{ 
        backgroundColor: '#2D3047', 
        color: '#FFFFFF',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      className="group relative gap-4 md:gap-6 px-10 py-6 md:px-16 md:py-10 rounded-[2rem] font-black text-2xl md:text-4xl uppercase tracking-tighter shadow-2xl border-b-[10px] border-black transition-all"
    >
      <span className="relative z-10">Start The Magic</span>
      <Rocket className="relative z-10 w-8 h-8 md:w-12 md:h-12 text-pink-400 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
      
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
    </motion.button>
    
    {/* 🏷️ BADGES: These are looking good based on your screenshot, but let's sharpen them */}
    <div className="mt-16 flex flex-wrap justify-center gap-4">
       {[
         { icon: <Zap size={18} fill="#FFD670" />, text: "2 Minute Build", bg: "bg-[#FFF9E5]" },
         { icon: <Star size={18} fill="#4CC9F0" />, text: "Premium Quality", bg: "bg-[#E5F9FF]" },
         { icon: <Heart size={18} fill="#FF70A6" />, text: "Kids Love It", bg: "bg-[#FFE5F0]" }
       ].map((badge, bIdx) => (
         <div 
            key={bIdx} 
            className={`flex items-center gap-2 px-6 py-3 ${badge.bg} text-[#2D3047] rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest border-[3px] border-[#2D3047] shadow-[5px_5px_0px_#2D3047]`}
         >
            {badge.icon} 
            <span>{badge.text}</span>
         </div>
       ))}
    </div>
  </motion.div>
</section>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700;900&display=swap');
        
        body {
          font-family: 'Fredoka', sans-serif;
          background-color: #FFFBF5;
          color: #2D3047;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}