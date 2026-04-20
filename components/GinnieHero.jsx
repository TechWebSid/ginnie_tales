"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { 
  Wand2, Sparkles, Star, Rocket, 
  ArrowRight, ShieldCheck, Play, 
  Plus, Camera, Heart
} from "lucide-react";
import Link from "next/link";

const GinnieHero = () => {
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.set([leftCurtainRef.current, rightCurtainRef.current], { x: "0%" })
      .set(".content-stagger", { opacity: 0, y: 30 })
      .set(".genie-center", { scale: 0.8, opacity: 0, filter: "blur(10px)" });

    tl.to([leftCurtainRef.current, rightCurtainRef.current], {
      x: (i) => (i === 0 ? "-100%" : "100%"),
      duration: 1.8,
      ease: "power4.inOut",
      delay: 0.3
    })
    .to(".genie-center", {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "expo.out"
    }, "-=0.8")
    .to(".content-stagger", {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=1");
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#FFF5F7] flex font-sans">
      
      {/* 🎭 THE PINK SILK CURTAINS */}
      <div className="absolute inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-[#FF4D91] border-r border-white/20 shadow-2xl relative">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:20px_20px]" />
        </div>
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-[#FF4D91] border-l border-white/20 shadow-2xl relative">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:20px_20px]" />
        </div>
      </div>

      {/* 🌌 DREAMY PINK GRADIENT BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#FFDDEE_0%,_#FFF5F7_100%)]" />
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] bg-pink-300/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px]" />
      </div>

      {/* 🧊 CONTENT CONTAINER */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center h-full px-6 md:px-12">
        
        {/* LEFT: PINK INFO PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8 py-12">
          <div className="content-stagger">
            <span className="px-4 py-1.5 rounded-full bg-white border border-pink-100 text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              💖 Your child, our hero
            </span>
          </div>

          <h1 className="content-stagger text-[4.5rem] md:text-[6.5rem] font-black leading-[0.85] tracking-tighter text-slate-800">
            Ginnie<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D91] via-[#FF7EB3] to-[#FFB7D5]">
              Tales.
            </span>
          </h1>

          <p className="content-stagger text-lg md:text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
            Create magical bedtime memories. <span className="text-pink-600 font-bold underline decoration-pink-200 decoration-4">The first AI storybook</span> that turns photos into fairytale adventures.
          </p>

          <div className="content-stagger flex flex-wrap gap-4 pt-4">
          <Link href="/story">
  <button className="group relative px-8 py-4 bg-[#FF4D91] text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-pink-200 hover:bg-[#E63E7D]">
    <span className="flex items-center gap-2 text-lg">
      Start Magic <Wand2 size={20} className="animate-sparkle" />
    </span>
  </button>
</Link>
            
            <button className="px-8 py-4 bg-white hover:bg-pink-50 border-2 border-pink-100 text-pink-500 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                <Play size={12} className="fill-pink-500 text-pink-500 ml-0.5" />
              </div>
              See Magic
            </button>
          </div>

          {/* Social Proof */}
          <div className="content-stagger pt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center overflow-hidden shadow-md">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+123}`} alt="avatar" />
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Joined by <span className="text-pink-500">12k+ Happy Families</span>
            </p>
          </div>
        </div>

        {/* RIGHT: THE PINK STAGE */}
        <div className="w-full lg:w-1/2 h-full relative flex items-center justify-center">
          
          {/* Main Character: Genie */}
          <div className="genie-center relative z-20">
            <motion.div
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src="/genie.png" 
                alt="Genie" 
                className="w-[300px] md:w-[450px] drop-shadow-[0_20px_60px_rgba(255,77,145,0.2)]"
              />
            </motion.div>
          </div>

          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [10, -10, 10], rotate: [-5, -8, -5] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="content-stagger absolute bottom-[15%] left-0 md:left-[5%] z-30 p-4 bg-white/80 backdrop-blur-md border border-pink-100 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-[#FF4D91] rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-200">
              <ShieldCheck size={24} />
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-black text-pink-400 uppercase">Child Safety</p>
              <p className="text-xs font-bold text-slate-700">100% Safe AI</p>
            </div>
          </motion.div>

          {/* Background Decor */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Star className="content-stagger absolute top-[20%] left-[10%] text-yellow-400 fill-yellow-400 opacity-40 animate-pulse" size={32} />
            <Heart className="content-stagger absolute bottom-[25%] right-[10%] text-pink-300 fill-pink-300 opacity-40" size={48} />
            <Rocket className="content-stagger absolute top-[15%] right-[20%] text-orange-300 opacity-30 -rotate-12" size={56} />
            <Sparkles className="content-stagger absolute top-1/2 right-1/4 text-pink-400 opacity-30" size={24} />
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 1; scale: 1; }
          50% { opacity: 0.7; scale: 1.1; }
        }
        .animate-sparkle {
          animation: sparkle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default GinnieHero;