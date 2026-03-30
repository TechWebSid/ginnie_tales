"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Mountain, TentTree, Rocket, Ghost, Waves, Sparkles, 
  Orbit, Palmtree, Shell, Zap, Star, Cloud 
} from "lucide-react";

const themes = [
  {
    title: "Dino Jungle",
    icon: <TentTree className="w-12 h-12" />,
    color: "bg-emerald-400",
    shadow: "shadow-[0_15px_0_#059669]",
    rotate: "-3deg",
    delay: 0.1
  },
  {
    title: "Space Cadet",
    icon: <Rocket className="w-12 h-12" />,
    color: "bg-indigo-500",
    shadow: "shadow-[0_15px_0_#4338ca]",
    rotate: "2deg",
    delay: 0.2
  },
  {
    title: "Deep Sea",
    icon: <Waves className="w-12 h-12" />,
    color: "bg-cyan-400",
    shadow: "shadow-[0_15px_0_#0891b2]",
    rotate: "-2deg",
    delay: 0.3
  },
  {
    title: "Magic Castle",
    icon: <Sparkles className="w-12 h-12" />,
    color: "bg-pink-500",
    shadow: "shadow-[0_15px_0_#be185d]",
    rotate: "4deg",
    delay: 0.4
  }
];

export default function ThemeSelector() {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="relative py-32 px-6 bg-[#F8FAFF] overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* 🎈 FLOATING DECORATIVE ELEMENTS (LEFT & RIGHT) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left Side Stickers */}
        <FloatingSticker Icon={Palmtree} color="text-emerald-200" top="15%" left="5%" rotate="-15deg" delay={0} />
        <FloatingSticker Icon={Orbit} color="text-indigo-200" top="45%" left="2%" rotate="10deg" delay={1} />
        <FloatingSticker Icon={Star} color="text-yellow-200" top="75%" left="8%" rotate="-5deg" delay={0.5} />

        {/* Right Side Stickers */}
        <FloatingSticker Icon={Cloud} color="text-blue-200" top="10%" right="5%" rotate="10deg" delay={1.5} />
        <FloatingSticker Icon={Shell} color="text-cyan-200" top="50%" right="3%" rotate="-20deg" delay={0.2} />
        <FloatingSticker Icon={Zap} color="text-pink-200" top="80%" right="7%" rotate="15deg" delay={0.8} />
      </div>

      {/* 🌌 Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[140px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[140px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* Section Header */}
        <div className="text-center mb-24 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-400"
          >
            <Sparkles size={48} className="animate-pulse" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[9rem] font-[1000] text-slate-900 tracking-tighter uppercase italic leading-[0.8] mb-4"
          >
            Choose <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-indigo-400 to-indigo-700 drop-shadow-xl">Your Story</span>
          </motion.h2>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-12 bg-slate-200" />
            <p className="text-xl font-black text-slate-400 uppercase tracking-[0.3em]">
              The Adventure Starts Here
            </p>
            <div className="h-[2px] w-12 bg-slate-200" />
          </div>
        </div>

        {/* 3D Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 perspective-2000">
          {themes.map((theme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: theme.delay, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 15, 
                rotateX: -10,
                transition: { type: "spring", stiffness: 300 } 
              }}
              className={`
                relative h-[420px] ${theme.color} ${theme.shadow} 
                rounded-[4rem] border-[12px] border-white 
                flex flex-col items-center justify-center p-8 
                cursor-pointer group select-none
                transform-gpu preserve-3d
              `}
              style={{ rotate: theme.rotate }}
            >
              {/* Backglow effect on hover */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-2xl transition-opacity rounded-[4rem]" />

              {/* Floating Icon with extra 3D pop */}
              <div className="relative bg-white/20 p-8 rounded-[2.5rem] backdrop-blur-sm border-2 border-white/40 group-hover:translate-z-20 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                <div className="text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]">
                  {React.cloneElement(theme.icon, { size: 64 })}
                </div>
              </div>

              <h3 className="mt-10 text-3xl font-[1000] text-white tracking-tighter uppercase text-center drop-shadow-[0_5px_0_rgba(0,0,0,0.1)]">
                {theme.title}
              </h3>

              <div className="mt-4 flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {[...Array(5)].map((_, star) => (
                  <Star key={star} size={12} className="fill-white text-white" />
                ))}
              </div>

              {/* "Select" Sticker */}
              <motion.div 
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                whileHover={{ opacity: 1, scale: 1, rotate: 12 }}
                className="absolute -bottom-4 bg-yellow-400 text-slate-900 font-black px-8 py-3 rounded-2xl border-[6px] border-white shadow-2xl z-20"
              >
                LET'S GO! 🚀
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Interactive "Surprise" Button */}
        <div className="mt-28 text-center relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-20 py-10 bg-slate-900 text-white rounded-[3rem] font-[1000] text-3xl tracking-[0.2em] shadow-[0_15px_0_#1e293b] hover:shadow-[0_20px_0_#1e293b] hover:-translate-y-2 active:translate-y-4 active:shadow-none transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-6">
              SURPRISE ME! 🎲
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}

function FloatingSticker({ Icon, color, top, left, right, rotate, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={{ 
        y: [0, -20, 0],
        rotate: [rotate, (parseInt(rotate) + 10) + 'deg', rotate] 
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        delay: delay,
        ease: "easeInOut" 
      }}
      className={`absolute ${color} pointer-events-none opacity-40`}
      style={{ top, left, right }}
    >
      <Icon size={120} strokeWidth={1} />
    </motion.div>
  );
}