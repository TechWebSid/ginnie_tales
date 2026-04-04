"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Rocket, Sparkles, Map, Globe, Heart, 
  Star, Cloud, Zap, Orbit, 
  ChevronRight, ArrowRight, Ghost, Moon, Sun
} from "lucide-react";

const FEATURED_THEMES = [
  {
    id: "Educational",
    title: "Educational",
    icon: <Rocket className="w-12 h-12" />,
    color: "bg-blue-400",
    shadow: "shadow-[0_12px_0_#2563eb]",
    desc: "Learn about the stars, the sea, and how the world works!",
    span: "lg:col-span-2 lg:row-span-2",
    rotate: "-2deg",
    pattern: "radial-gradient(circle, #ffffff33 1px, transparent 1px)",
    patternSize: "20px 20px",
    particles: [Orbit, Star, Globe]
  },
  {
    id: "Fairy Tales",
    title: "Fairy Tales",
    icon: <Sparkles className="w-12 h-12" />,
    color: "bg-pink-400",
    shadow: "shadow-[0_12px_0_#db2777]",
    desc: "Dragons, knights, and magical forests await.",
    span: "lg:col-span-2 lg:row-span-1",
    rotate: "1deg",
    pattern: "repeating-linear-gradient(45deg, #ffffff1a 0, #ffffff1a 2px, transparent 0, transparent 50%)",
    patternSize: "15px 15px",
    particles: [Sparkles, Heart]
  },
  {
    id: "Adventure",
    title: "Adventure",
    icon: <Map className="w-12 h-12" />,
    color: "bg-orange-400",
    shadow: "shadow-[0_12px_0_#ea580c]",
    desc: "Buckle up for wild journeys!",
    span: "lg:col-span-1 lg:row-span-1",
    rotate: "3deg",
    pattern: "radial-gradient(#ffffff4d 2px, transparent 2px)",
    patternSize: "30px 30px",
    particles: [Zap]
  },
  {
    id: "Worlds",
    title: "Worlds",
    icon: <Globe className="w-12 h-12" />,
    color: "bg-purple-400",
    shadow: "shadow-[0_12px_0_#7c3aed]",
    desc: "Explore places you've only dreamed of.",
    span: "lg:col-span-2 lg:row-span-1",
    rotate: "-1.5deg",
    pattern: "linear-gradient(90deg, #ffffff1a 1px, transparent 1px)",
    patternSize: "40px 40px",
    particles: [Moon, Cloud]
  },
  {
    id: "Family",
    title: "Family",
    icon: <Heart className="w-12 h-12" />,
    color: "bg-rose-400",
    shadow: "shadow-[0_12px_0_#e11d48]",
    desc: "Stories about the ones we love most.",
    span: "lg:col-span-1 lg:row-span-1",
    rotate: "2deg",
    pattern: "radial-gradient(circle, #ffffff33 2px, transparent 0)",
    patternSize: "25px 25px",
    particles: [Sun]
  }
];

export default function ThemeSelector() {
  return (
    <section className="relative py-24 lg:py-32 px-6 bg-[#F8FAFF] overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* 🎈 FLOATING DECORATIVE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingSticker Icon={Orbit} color="text-indigo-100" top="10%" left="2%" rotate="-15deg" delay={0} />
        <FloatingSticker Icon={Star} color="text-yellow-100" top="60%" left="5%" rotate="10deg" delay={1} />
        <FloatingSticker Icon={Cloud} color="text-blue-100" top="15%" right="5%" rotate="10deg" delay={0.5} />
        <FloatingSticker Icon={Zap} color="text-pink-100" top="70%" right="2%" rotate="-15deg" delay={1.5} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-[0.8] mb-6"
          >
            Pick Your <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Magic World</span>
          </motion.h2>
          <p className="text-lg md:text-xl font-black text-slate-400 uppercase tracking-[0.2em]">
            Where will your face go today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[280px] gap-8 perspective-2000">
          {FEATURED_THEMES.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -10,
                rotateX: -5,
                transition: { type: "spring", stiffness: 400 }
              }}
              className={`
                relative ${theme.span} ${theme.color} ${theme.shadow} 
                rounded-[3.5rem] border-[10px] border-white 
                flex flex-col p-10 cursor-pointer group transform-gpu preserve-3d overflow-hidden
              `}
              style={{ rotate: theme.rotate }}
            >
              {/* --- FILL ELEMENT: BACKGROUND PATTERN --- */}
              <div 
                className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ 
                    backgroundImage: theme.pattern,
                    backgroundSize: theme.patternSize
                }}
              />

              {/* --- FILL ELEMENT: FLOATING INTERNAL PARTICLES --- */}
              {theme.particles.map((PIcon, idx) => (
                <motion.div
                    key={idx}
                    animate={{ 
                        y: [0, -20, 0], 
                        x: [0, 10, 0],
                        rotate: [0, 10, 0] 
                    }}
                    transition={{ duration: 3 + idx, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute text-white/20 pointer-events-none"
                    style={{ 
                        top: `${20 + (idx * 30)}%`, 
                        right: `${10 + (idx * 20)}%` 
                    }}
                >
                    <PIcon size={idx === 0 ? 80 : 40} />
                </motion.div>
              ))}

              {/* Content */}
              <div className="relative z-10 bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center backdrop-blur-md border-2 border-white/40 group-hover:scale-110 transition-transform duration-500">
                <div className="text-white drop-shadow-lg">
                  {theme.icon}
                </div>
              </div>

              <div className="mt-auto relative z-10">
                <h3 className="text-3xl lg:text-4xl font-[1000] text-white tracking-tighter uppercase mb-2 drop-shadow-md">
                  {theme.title}
                </h3>
                <p className="text-white font-bold leading-tight opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {theme.desc}
                </p>
              </div>

              <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <div className="bg-white p-3 rounded-full text-slate-900 shadow-xl">
                  <ArrowRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ... (Explore All Button remains the same) */}
      </div>

      <style jsx>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
}

function FloatingSticker({ Icon, color, top, left, right, rotate, delay }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -30, 0],
        rotate: [rotate, (parseInt(rotate) + 15) + 'deg', rotate] 
      }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
      className={`absolute ${color} pointer-events-none opacity-40`}
      style={{ top, left, right }}
    >
      <Icon size={160} strokeWidth={0.5} />
    </motion.div>
  );
}