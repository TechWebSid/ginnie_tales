"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Camera, Wand2, Stars, ArrowLeftRight, Heart, Zap } from "lucide-react";

export default function Comparison() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (event) => {
    if (!isResizing && event.type !== "touchmove") return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = event.pageX || (event.touches && event.touches[0].pageX);
    if (!x) return;
    
    const relativeX = x - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
    
    setSliderPosition(percentage);
  };

  useEffect(() => {
    const endResize = () => setIsResizing(false);
    window.addEventListener("mouseup", endResize);
    window.addEventListener("touchend", endResize);
    return () => {
      window.removeEventListener("mouseup", endResize);
      window.removeEventListener("touchend", endResize);
    };
  }, []);

  // PRO TIP: Using reliable placeholders that won't 404
  const beforeImage = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=2070";
  const afterImage = "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=2070";

  return (
    <section className="py-20 px-6 bg-[#FDFDFF] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/30 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Text */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 border-2 border-white shadow-sm"
          >
            <Sparkles size={14} /> Magic in the making
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-[1000] text-slate-800 leading-[0.9] tracking-tighter uppercase italic">
            See the <span className="text-pink-500">Result</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl font-bold text-slate-500 max-w-xl mx-auto leading-snug">
            Slide to see how we turn your photos into <span className="text-blue-500">3D Pixar-style</span> masterpieces!
          </p>
        </div>

        {/* Comparison Slider Container */}
        <div 
          ref={containerRef}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          className="relative w-full max-w-5xl aspect-[16/9] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-[12px] md:border-[20px] border-white shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] cursor-ew-resize select-none"
        >
          {/* AFTER IMAGE */}
          <div className="absolute inset-0 w-full h-full bg-slate-100">
             <img 
                src={afterImage} 
                alt="After Magic" 
                className="w-full h-full object-cover"
             />
             <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border-2 border-pink-100 flex items-center gap-2">
                <Wand2 className="text-pink-500 w-5 h-5" />
                <span className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Magic Tale</span>
             </div>
          </div>

          {/* BEFORE IMAGE (Clipped) */}
          <div 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img 
               src={beforeImage} 
               alt="Before Magic" 
               className="w-full h-full object-cover"
            />
             <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border-2 border-white/10 flex items-center gap-2">
                <Camera className="text-white w-5 h-5" />
                <span className="font-black text-white uppercase tracking-widest text-[10px]">Original</span>
             </div>
          </div>

          {/* THE SLIDER HANDLE */}
          <div 
            className="absolute top-0 bottom-0 z-30 w-1 md:w-2 bg-white cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={() => setIsResizing(true)}
            onTouchStart={() => setIsResizing(true)}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-[6px] border-pink-500 group transition-transform active:scale-90">
              <ArrowLeftRight className="text-pink-500 w-5 h-5 md:w-7 md:h-7" />
              <div className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-20" />
            </div>
          </div>
        </div>

        {/* BOTTOM FEATURES - FIXED GRID LAYOUT */}
        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature icon={<Stars className="text-yellow-500 fill-yellow-500"/>} title="Pixar Style" desc="Studio-grade 3D character rendering." />
            <Feature icon={<Heart className="text-rose-500 fill-rose-500"/>} title="Safe & Private" desc="We never store your personal photos." />
            <Feature icon={<Zap className="text-blue-500 fill-blue-500"/>} title="Instant Magic" desc="Generated in less than 30 seconds." />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
        <div className="bg-slate-50 p-4 rounded-xl">
            {icon}
        </div>
        <div className="text-left">
            <h4 className="font-black text-slate-800 text-sm md:text-base uppercase tracking-tighter leading-none mb-1">{title}</h4>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs tracking-tight">{desc}</p>
        </div>
    </div>
  );
}