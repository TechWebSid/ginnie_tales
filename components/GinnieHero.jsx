"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Wand2, Clock, Users, Sparkles, Star, Heart, Zap, Cloud, Rocket, Crown, Gift, Smile, Camera, BookOpen, Palette } from "lucide-react";

const GinnieHero = () => {
  const [bubbles, setBubbles] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const genieRef = useRef(null);
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    // Generate playful background bubbles
    setBubbles([...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      duration: 4 + Math.random() * 4,
    })));

    // Generate floating confetti
    setConfetti([...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    })));

    const tl = gsap.timeline();

    // Initial State: Curtains closed, Genie hidden
    tl.set([leftCurtainRef.current, rightCurtainRef.current], { x: "0%", opacity: 1 })
      .set(genieRef.current, { y: 50, opacity: 0, scale: 0.7 })
      .set(".reveal-item", { scale: 0.9, opacity: 0 })
      .set(".float-item", { y: 20, opacity: 0 });

    // The Opening Animation
    tl.to(flashRef.current, { opacity: 0.3, duration: 0.1, repeat: 1, yoyo: true })
      .to([leftCurtainRef.current, rightCurtainRef.current], {
        x: (i) => i === 0 ? "-105%" : "105%",
        duration: 1.5,
        ease: "expo.inOut",
      }, "-=0.1")
      .to(genieRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
      }, "-=0.8")
      .to(".reveal-item", {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.5")
      .to(".float-item", {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.6,
        ease: "back.out(1.2)",
      }, "-=0.3");
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F0F4FF] flex items-center justify-center font-sans">
      
      {/* 🌪️ PUPPET THEATER CURTAINS */}
      <div className="absolute inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-gradient-to-r from-[#FFD93D] to-[#FFED4E] shadow-[5px_0_30px_rgba(0,0,0,0.1)] border-r-4 border-yellow-500/20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
        </div>
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-gradient-to-l from-[#FFD93D] to-[#FFED4E] shadow-[-5px_0_30px_rgba(0,0,0,0.1)] border-l-4 border-yellow-500/20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
        </div>
      </div>

      {/* ⚡ SPARKLE FLASH */}
      <div ref={flashRef} className="absolute inset-0 z-[110] bg-white opacity-0 pointer-events-none" />

      {/* 🌌 BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#E0E7FF] via-[#FDF2F8] to-[#DBEAFE]">
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: b.duration, repeat: Infinity }}
            className="absolute rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm"
            style={{ top: `${b.y}%`, left: `${b.x}%`, width: b.size, height: b.size }}
          />
        ))}

        {/* Floating Confetti */}
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            animate={{ 
              y: [0, -30, 0],
              rotate: [c.rotation, c.rotation + 180, c.rotation + 360],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ duration: c.duration, repeat: Infinity, delay: c.delay }}
            className="absolute w-2 h-2 rounded-sm"
            style={{ 
              top: `${c.y}%`, 
              left: `${c.x}%`,
              background: ['#FF6B9D', '#C084FC', '#60A5FA', '#FCD34D', '#4ADE80'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>

      {/* 🎴 LEFT FLOATING CARDS */}
      <div className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 space-y-3 sm:space-y-4 hidden sm:block">
        <motion.div 
          className="float-item w-16 sm:w-20 md:w-24 h-20 sm:h-24 md:h-28 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center rotate-[-8deg]"
          animate={{ y: [0, -15, 0], rotate: [-8, -12, -8] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Crown className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
          <span className="text-[8px] sm:text-[9px] md:text-xs font-black text-white mt-1">HERO</span>
        </motion.div>

        <motion.div 
          className="float-item w-16 sm:w-20 md:w-24 h-20 sm:h-24 md:h-28 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center rotate-[5deg]"
          animate={{ y: [0, -12, 0], rotate: [5, 8, 5] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
        >
          <Camera className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
          <span className="text-[8px] sm:text-[9px] md:text-xs font-black text-white mt-1">SNAP</span>
        </motion.div>

        <motion.div 
          className="float-item w-16 sm:w-20 md:w-24 h-20 sm:h-24 md:h-28 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center rotate-[-5deg]"
          animate={{ y: [0, -18, 0], rotate: [-5, -9, -5] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <Sparkles className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
          <span className="text-[8px] sm:text-[9px] md:text-xs font-black text-white mt-1">MAGIC</span>
        </motion.div>
      </div>

      {/* 🎴 RIGHT FLOATING CARDS */}
      <div className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 space-y-3 sm:space-y-4 hidden sm:block">
        <motion.div 
          className="float-item w-16 sm:w-20 md:w-24 h-20 sm:h-24 md:h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center rotate-[8deg]"
          animate={{ y: [0, -14, 0], rotate: [8, 12, 8] }}
          transition={{ duration: 4.2, repeat: Infinity }}
        >
          <BookOpen className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
          <span className="text-[8px] sm:text-[9px] md:text-xs font-black text-white mt-1">STORY</span>
        </motion.div>

        <motion.div 
          className="float-item w-16 sm:w-20 md:w-24 h-20 sm:h-24 md:h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center rotate-[-6deg]"
          animate={{ y: [0, -16, 0], rotate: [-6, -10, -6] }}
          transition={{ duration: 4.8, repeat: Infinity, delay: 0.7 }}
        >
          <Palette className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
          <span className="text-[8px] sm:text-[9px] md:text-xs font-black text-white mt-1">COLOR</span>
        </motion.div>

        <motion.div 
          className="float-item w-16 sm:w-20 md:w-24 h-20 sm:h-24 md:h-28 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center rotate-[7deg]"
          animate={{ y: [0, -13, 0], rotate: [7, 11, 7] }}
          transition={{ duration: 5.2, repeat: Infinity, delay: 1.2 }}
        >
          <Rocket className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
          <span className="text-[8px] sm:text-[9px] md:text-xs font-black text-white mt-1">FUN</span>
        </motion.div>
      </div>

      {/* 🎪 TOP DECORATIVE STICKERS */}
      <motion.div 
        className="float-item absolute left-[15%] sm:left-[20%] top-[8%] sm:top-[12%] z-10"
        animate={{ y: [0, -10, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-white rounded-full shadow-2xl border-4 border-yellow-200 flex items-center justify-center">
          <Star className="w-6 sm:w-8 md:w-10 h-6 sm:w-8 md:h-10 text-yellow-400 fill-yellow-400" />
        </div>
      </motion.div>

      <motion.div 
        className="float-item absolute right-[15%] sm:right-[20%] top-[10%] sm:top-[15%] z-10"
        animate={{ y: [0, 10, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-white rounded-full shadow-2xl border-4 border-pink-200 flex items-center justify-center">
          <Heart className="w-6 sm:w-8 md:w-10 h-6 sm:w-8 md:h-10 text-pink-400 fill-pink-400" />
        </div>
      </motion.div>

      {/* 🎁 BOTTOM CORNER GIFTS */}
      <motion.div 
        className="float-item absolute left-[8%] sm:left-[12%] bottom-[15%] sm:bottom-[20%] z-10"
        animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <div className="w-10 sm:w-14 md:w-16 h-10 sm:h-14 md:h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl shadow-xl border-3 border-white flex items-center justify-center rotate-12">
          <Gift className="w-5 sm:w-7 md:w-8 h-5 sm:w-7 md:h-8 text-white" />
        </div>
      </motion.div>

      <motion.div 
        className="float-item absolute right-[8%] sm:right-[12%] bottom-[18%] sm:bottom-[22%] z-10"
        animate={{ y: [0, -10, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      >
        <div className="w-10 sm:w-14 md:w-16 h-10 sm:h-14 md:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-xl border-3 border-white flex items-center justify-center -rotate-12">
          <Smile className="w-5 sm:w-7 md:w-8 h-5 sm:w-7 md:h-8 text-white" />
        </div>
      </motion.div>

      {/* ⭐ CORNER LIGHTNING BOLTS */}
      <motion.div 
        className="float-item absolute left-[25%] top-[22%] z-10 hidden md:block"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-8 md:w-10 h-8 md:h-10 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
      </motion.div>

      <motion.div 
        className="float-item absolute right-[25%] top-[25%] z-10 hidden md:block"
        animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        <Zap className="w-8 md:w-10 h-8 md:h-10 text-pink-400 fill-pink-400 drop-shadow-lg" />
      </motion.div>

      {/* 🧞 CENTER CONTENT CONTAINER */}
      <div className="relative z-20 w-full max-w-7xl mx-auto h-full flex flex-col items-center justify-center px-4 py-6">
        
        {/* The Genie - Compact positioning */}
        <div ref={genieRef} className="relative w-full max-w-[200px] sm:max-w-[280px] md:max-w-[360px] mb-3 sm:mb-4">
          <motion.img
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            src="/genie.png"
            alt="Genie"
            className="w-full h-auto drop-shadow-2xl"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 sm:px-4 py-1 rounded-full shadow-lg border-2 border-purple-100 text-[9px] sm:text-[10px] md:text-xs font-black text-purple-600 uppercase tracking-wider whitespace-nowrap">
            ✨ IT'S STORY TIME!
          </div>
        </div>

        {/* TITLES - Compact */}
        <div className="text-center mb-3 sm:mb-4">
          <h1 className="reveal-item text-[3.5rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[9rem] font-[1000] italic tracking-tight uppercase leading-[0.8]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-500 to-indigo-600 drop-shadow-lg">Ginnie</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-500 to-purple-600 drop-shadow-lg">Tales</span>
          </h1>
          <p className="reveal-item text-[10px] sm:text-xs md:text-base lg:text-lg text-slate-600 font-bold mt-1 sm:mt-2 px-4">
            The magical app where <span className="text-pink-500">YOU</span> become the hero! 🚀
          </p>
        </div>

        {/* FEATURES - Compact */}
        <div className="reveal-item flex flex-wrap justify-center gap-2 mb-4 sm:mb-5 max-w-md">
          {["🌈 Colorful", "📸 Magic Face", "🛡️ Kids Safe"].map((f, i) => (
            <div key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-b-4 border-slate-200 rounded-xl text-[9px] sm:text-[10px] md:text-xs font-black text-slate-700 shadow-md hover:shadow-lg transition-shadow">
              {f}
            </div>
          ))}
        </div>

        {/* CTA BUTTON - Compact */}
        <button className="reveal-item group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#FF477E] to-[#FF6B9D] rounded-2xl text-white font-black tracking-widest text-xs sm:text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-[0_6px_0_#D4145A] hover:shadow-[0_8px_0_#D4145A] mb-4">
          <span className="flex items-center gap-2">
            <Wand2 size={18} className="sm:w-5 sm:h-5" /> START THE MAGIC
          </span>
        </button>

        {/* SOCIAL PROOF - Compact */}
        <div className="reveal-item flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Clock size={12} className="sm:w-3.5 sm:h-3.5" /> APRIL 2026
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5 text-pink-500">
            <Users size={12} className="sm:w-3.5 sm:h-3.5" /> 2,400+ HEROES
          </div>
        </div>
      </div>

      {/* 🌥️ DECORATIVE CLOUDS - Bottom corners */}
      <motion.div 
        className="absolute bottom-0 left-0 opacity-30 z-5"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Cloud className="text-blue-200 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 -mb-4" />
      </motion.div>
      <motion.div 
        className="absolute bottom-0 right-0 opacity-30 z-5"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <Cloud className="text-pink-200 w-20 sm:w-28 md:w-36 h-20 sm:h-28 md:h-36 -mb-6" />
      </motion.div>

      {/* 🎪 RAINBOW ARCS - Top decorations */}
      <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-20 pointer-events-none z-5">
        <div className="absolute -top-16 left-[10%] w-32 h-32 border-8 border-red-400 rounded-full" />
        <div className="absolute -top-20 left-[15%] w-40 h-40 border-8 border-yellow-400 rounded-full" />
        <div className="absolute -top-24 left-[20%] w-48 h-48 border-8 border-green-400 rounded-full" />
      </div>

      <div className="absolute top-0 right-0 w-full h-32 overflow-hidden opacity-20 pointer-events-none z-5">
        <div className="absolute -top-16 right-[10%] w-32 h-32 border-8 border-blue-400 rounded-full" />
        <div className="absolute -top-20 right-[15%] w-40 h-40 border-8 border-purple-400 rounded-full" />
        <div className="absolute -top-24 right-[20%] w-48 h-48 border-8 border-pink-400 rounded-full" />
      </div>
    </div>
  );
};

export default GinnieHero;