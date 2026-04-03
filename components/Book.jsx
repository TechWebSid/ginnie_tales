"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, 
  FileDown, BookOpen, RotateCcw, Lock, Zap, Loader2, Palette, RefreshCcw 
} from "lucide-react";

export default function Book({ 
  pages = [], 
  images = [], 
  title = "MY MAGIC ADVENTURE",
  isPaid = false, 
  onPay, 
  isProcessing = false,
  onResume, // NEW PROP
  isStopped = false // NEW PROP
}) {
  const [view, setView] = useState("closed-front");
  const [pageIndex, setPageIndex] = useState(0);

  // Check if current image is a placeholder/locked string
  const isImagePlaceholder = images[pageIndex]?.includes("Locked") || images[pageIndex]?.includes("placehold.co");
  const isLockedPage = pageIndex >= 2 && !isPaid;

  useEffect(() => {
    if (isPaid && view === "closed-front") {
      setView("open");
    }
    if (!isPaid) {
      setView("closed-front");
      setPageIndex(0);
    }
  }, [isPaid]);

  if (!pages || pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 font-black tracking-widest animate-pulse">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#EF476F]" />
        MAGICAL PAGES ARE LOADING...
      </div>
    );
  }

  const handleNext = () => {
    if (view === "closed-front") {
      setView("open");
      setPageIndex(0);
    } else if (view === "open") {
      if (pageIndex === 1 && !isPaid) {
        setPageIndex(2); 
        return;
      }
      if (pageIndex < pages.length - 1) {
        setPageIndex(pageIndex + 1);
      } else {
        setView("closed-back");
      }
    }
  };

  const handleBack = () => {
    if (view === "closed-back") {
      setView("open");
      setPageIndex(pages.length - 1);
    } else if (view === "open") {
      if (pageIndex > 0) {
        setPageIndex(pageIndex - 1);
      } else {
        setView("closed-front");
      }
    }
  };

  const resetBook = () => {
    setPageIndex(0);
    setView("closed-front");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        
        {/* --- FRONT COVER PREVIEW --- */}
        {view === "closed-front" && (
          <motion.div key="front" 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="relative w-[320px] h-[460px] md:w-[380px] md:h-[540px] shadow-[20px_20px_0px_#073B4C] rounded-[3rem] p-0 bg-black cursor-pointer border-8 border-white overflow-hidden"
            onClick={handleNext}
          >
            <img src={images[0]} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6 text-center z-20">
                <h1 className="text-2xl md:text-3xl font-[1000] text-[#FFD166] italic uppercase leading-tight tracking-tight mb-2">A MAGICAL STORY INSIDE</h1>
                <div className="text-[#06D6A0] font-black italic text-sm tracking-widest mb-1 uppercase">Crafted by GinnieTales ✨</div>
                <div className="text-white/60 font-bold text-[8px] tracking-[0.2em] uppercase">Order your storybook at GinnieTales.com</div>
                <div className="mt-6 text-white/40 text-[10px] font-black tracking-widest animate-pulse uppercase">Tap to Read</div>
            </div>
          </motion.div>
        )}

        {/* --- MAIN STORY VIEW --- */}
        {view === "open" && (
          <motion.div key="open" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row overflow-hidden border-[8px] md:border-[12px] border-white min-h-[550px] relative"
          >
            {/* LEFT SIDE: IMAGE */}
            <div className="w-full lg:w-1/2 h-[300px] lg:h-[650px] bg-[#F1FAEE] relative overflow-hidden">
              <img 
                src={images[pageIndex] || images[0]} 
                className={`w-full h-full object-cover transition-all duration-700 ${isLockedPage || (isPaid && isImagePlaceholder) ? 'blur-2xl grayscale brightness-50' : ''}`} 
                alt="Illustration" 
              />

              {/* OVERLAY 1: LOCKED (NOT PAID) */}
              {isLockedPage && !isProcessing && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center text-white bg-[#073B4C]/60 backdrop-blur-md">
                  <div className="w-20 h-20 bg-[#FFD166] rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                    <Lock className="w-10 h-10 text-[#073B4C]" />
                  </div>
                  <h3 className="text-3xl font-[1000] mb-2 tracking-tighter uppercase">The Tale Paused...</h3>
                  <button onClick={onPay} className="group flex items-center gap-3 px-8 py-5 bg-[#EF476F] text-white font-[1000] rounded-2xl shadow-[0_10px_0px_#C9184A] hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm">
                    <Zap fill="currentColor" size={18} /> Unlock Magic
                  </button>
                </div>
              )}

              {/* OVERLAY 2: RESUME (PAID BUT STOPPED) */}
              {isPaid && isImagePlaceholder && !isProcessing && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center text-white bg-[#073B4C]/80 backdrop-blur-xl">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="mb-6"
                  >
                    <RefreshCcw className="w-16 h-16 text-[#06D6A0]" />
                  </motion.div>
                  <h3 className="text-2xl font-[1000] mb-4 uppercase tracking-tight">Magic is Paused</h3>
                  <p className="text-sm font-bold text-white/70 mb-8 max-w-[200px]">We haven't painted this page yet!</p>
                  <button 
                    onClick={onResume} 
                    className="px-8 py-4 bg-[#06D6A0] text-white font-[1000] rounded-2xl shadow-[0_6px_0px_#048a68] hover:translate-y-1 hover:shadow-none transition-all uppercase text-xs border-2 border-white/20"
                  >
                    Resume Magic
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: TEXT */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[650px] flex flex-col bg-[#FFFCF9] p-8 lg:p-16 relative">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className={`${isLockedPage ? 'blur-md opacity-20' : ''} text-lg lg:text-xl font-bold text-[#073B4C] leading-[1.8] first-letter:text-7xl first-letter:font-[1000] first-letter:text-[#EF476F] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] pt-2`}>
                  {pages[pageIndex]}
                </p>
              </div>
              <div className="mt-8 border-t-4 border-[#F1FAEE] pt-6 flex justify-between items-center">
                  <span className="font-[1000] text-[10px] text-[#118AB2] uppercase tracking-widest">Page {pageIndex + 1} / {pages.length}</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: Math.min(pages.length, 10) }).map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-500 ${pageIndex % 10 === i ? 'bg-[#EF476F] w-6' : 'bg-[#06D6A0]/20 w-2'}`} />
                    ))}
                  </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- BACK COVER PREVIEW --- */}
        {view === "closed-back" && (
          <motion.div key="back" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.8 }}
            className="w-[320px] h-[460px] md:w-[380px] md:h-[540px] bg-[#480CA8] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center border-8 border-white relative overflow-hidden"
          >
            <div className="absolute inset-4 border-4 border-white/20 rounded-[2rem] flex flex-col items-center justify-center p-6">
                <div className="text-6xl mb-6">🧞‍♂️</div>
                <h2 className="text-[#FFD166] text-5xl font-[1000] italic uppercase tracking-tighter mb-2">The End</h2>
                <p className="text-[#BEE9E8] font-black uppercase text-[10px] tracking-[0.3em] mb-12">Your Adventure Lives On</p>
                <div className="text-[#4CC9F0] font-[1000] italic text-lg tracking-widest mb-10">GinnieTales.in</div>
                <button onClick={resetBook} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-black uppercase text-[10px] tracking-widest">
                   <RotateCcw size={14} /> Read Again
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING CONTROLS --- */}
      <div className="mt-10 flex items-center gap-4 md:gap-8">
        <button onClick={handleBack} disabled={view === "closed-front" || isProcessing} className="p-4 bg-white rounded-2xl shadow-[4px_4px_0px_#073B4C] border-2 border-[#073B4C] hover:bg-[#F1FAEE] disabled:opacity-20 active:translate-y-1">
          <ArrowLeft size={20} />
        </button>
        {view === "open" && isPaid && !isImagePlaceholder && (
            <button onClick={() => {}} className="px-8 py-4 bg-[#06D6A0] text-white rounded-2xl shadow-[4px_4px_0px_#059669] font-[1000] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all uppercase text-xs border-2 border-white">
              <FileDown size={18} /> Save PDF
            </button>
        )}
        <button onClick={handleNext} disabled={view === "closed-back" || (isLockedPage && !isPaid) || isProcessing} className="p-4 bg-white rounded-2xl shadow-[4px_4px_0px_#073B4C] border-2 border-[#073B4C] hover:bg-[#F1FAEE] disabled:opacity-20 active:translate-y-1">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}