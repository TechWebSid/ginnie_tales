"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, 
  FileDown, BookOpen, RotateCcw, Lock, Zap, Loader2, Palette 
} from "lucide-react";

export default function Book({ 
  pages = [], 
  images = [], 
  title = "MY MAGIC ADVENTURE",
  isPaid = false, 
  onPay, 
  isProcessing = false 
}) {
  const [view, setView] = useState("closed-front");
  const [pageIndex, setPageIndex] = useState(0);

  const isImageLoading = images[pageIndex]?.includes("Locked") || images[pageIndex]?.includes("placehold.co");
  const isLockedPage = pageIndex >= 2 && !isPaid;

 useEffect(() => {
  if (isPaid && view === "closed-front") {
    setView("open");
  }
  // Agar payment false ho jaye (Reset ke waqt), toh book ko band kar do
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

const downloadPDF = async () => {
  try {
    const frontCoverImg = images[0] || "https://placehold.co/600x800?text=My+Story";
    const htmlContent = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=Inter:ital,wght@0,900;1,900&display=swap');
            body { margin: 0; padding: 0; background: #FEF9EF; font-family: 'Inter', sans-serif; color: #1A365D; }
            .page { width: 297mm; height: 210mm; display: flex; page-break-after: always; border: 15px solid white; box-sizing: border-box; position: relative; overflow: hidden; }
            .front-cover { background: #000; justify-content: flex-end; align-items: center; }
            .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
            .vignette { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 30%, transparent 50%); z-index: 2; }
            .cover-content { position: relative; z-index: 10; padding-bottom: 30px; text-align: center; width: 100%; }
            .generic-title { font-size: 45px; font-weight: 900; font-style: italic; color: #FFD166; margin: 0 0 10px 0; text-transform: uppercase; text-shadow: 0 5px 15px rgba(0,0,0,0.8); }
            .crafted-by { font-size: 18px; font-weight: 900; font-style: italic; color: #06D6A0; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
            .order-link { font-size: 12px; color: white; opacity: 0.8; letter-spacing: 4px; }
            .img-container { width: 50%; height: 100%; border-right: 10px solid white; }
            .img-container img { width: 100%; height: 100%; object-fit: cover; }
            .text-container { width: 50%; padding: 60px; background: #FFFCF9; display: flex; align-items: center; }
            .story-text { font-size: 38px; line-height: 1.3; font-weight: 800; letter-spacing: -1px; margin: 0; }
            .story-text::first-letter { color: #EF476F; font-family: 'Plus Jakarta Sans', sans-serif; float: left; font-size: 110px; line-height: 0.8; padding-right: 15px; font-weight: 900; }
            .back-cover { background: #480CA8; color: white; border: none; justify-content: center; align-items: center; }
            .back-inner { width: 90%; height: 90%; border: 8px double rgba(255,255,255,0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; }
          </style>
        </head>
        <body>
          <div class="page front-cover">
            <img src="${frontCoverImg}" class="hero-bg" />
            <div class="vignette"></div>
            <div class="cover-content">
              <h1 class="generic-title">A MAGICAL STORY INSIDE</h1>
              <div class="crafted-by">Crafted by GinnieTales ✨</div>
              <div class="order-link">ORDER YOUR STORYBOOK AT GINNIETALES.COM</div>
            </div>
          </div>
          ${pages.map((text, i) => `
            <div class="page">
              <div class="img-container">
                <img src="${images[i + 1] || images[i] || images[0]}" />
              </div>
              <div class="text-container">
                <p class="story-text">${text}</p>
              </div>
            </div>
          `).join('')}
          <div class="page back-cover">
            <div class="back-inner">
              <div style="font-size: 80px; margin-bottom: 20px;">🧞‍♂️</div>
              <h2 style="font-size: 90px; font-weight: 900; font-style: italic; color: #FFD166; margin: 0; text-transform: uppercase;">The End</h2>
              <p style="letter-spacing: 5px; font-weight: 900; margin-top: 20px; color: #BEE9E8;">YOUR ADVENTURE LIVES ON</p>
              <div style="margin-top: 60px; font-size: 24px; font-weight: 900; font-style: italic; color: #4CC9F0; letter-spacing: 4px;">GinnieTales.in</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("/api/pdf", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ html: htmlContent }) 
    });

    if (!res.ok) throw new Error("PDF generation failed");

    const blob = await res.blob();
    
    // ✅ MOBILE FIX: Convert blob to Base64 and trigger download
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      const link = document.createElement("a");
      link.href = base64data;
      link.download = "GinnieTales_MagicBook.pdf";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    };
    reader.readAsDataURL(blob);

  } catch (err) { 
    console.error("PDF Error:", err); 
    alert("Download failed. If on mobile, please check browser permissions or try Chrome.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        
        {/* --- FRONT COVER PREVIEW (MATCHES PDF) --- */}
      {view === "closed-front" && (
  <motion.div key="front" 
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ rotateY: -90, opacity: 0 }}
    transition={{ duration: 0.8, ease: "circOut" }}
    className="relative w-[320px] h-[460px] md:w-[380px] md:h-[540px] shadow-[20px_20px_0px_#073B4C] rounded-[3rem] p-0 bg-black cursor-pointer border-8 border-white overflow-hidden"
    onClick={handleNext}
  >
    {/* Hamesha array ki pehli image (Cover) dikhayega */}
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
    <div className="w-full lg:w-1/2 h-[300px] lg:h-[650px] bg-[#F1FAEE] relative overflow-hidden">
        {/* Page 1 (pageIndex=0) aur Page 2 (pageIndex=1) ke liye images[pageIndex] use karo */}
        <img 
          src={images[pageIndex] || images[0]} 
          className={`w-full h-full object-cover transition-all duration-700 ${isLockedPage || (isPaid && isImageLoading) ? 'blur-2xl grayscale brightness-50' : ''}`} 
          alt="Illustration" 
        />
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
    </div>

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
        {/* --- BACK COVER PREVIEW (PURPLE THEME) --- */}
        {view === "closed-back" && (
          <motion.div key="back" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.8 }}
            className="w-[320px] h-[460px] md:w-[380px] md:h-[540px] bg-[#480CA8] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center border-8 border-white relative overflow-hidden"
          >
            {/* Double Border Effect like PDF */}
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
        {view === "open" && isPaid && (
            <button onClick={downloadPDF} className="px-8 py-4 bg-[#06D6A0] text-white rounded-2xl shadow-[4px_4px_0px_#059669] font-[1000] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all uppercase text-xs border-2 border-white">
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