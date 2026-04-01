"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, 
  FileDown, BookOpen, RotateCcw, Lock, Zap, Loader2 
} from "lucide-react";

export default function MagicBook({ 
  pages = [], 
  images = [], 
  title = "MY MAGIC ADVENTURE",
  isPaid = false, 
  onPay, 
  isProcessing = false 
}) {
  const [view, setView] = useState("closed-front");
  const [pageIndex, setPageIndex] = useState(0);

  // Logic: Unlock logic for testing
  const isLockedPage = pageIndex >= 2 && !isPaid;

  if (!pages || pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 font-black tracking-widest animate-pulse">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-500" />
        MAGICAL PAGES ARE LOADING...
      </div>
    );
  }

  const handleNext = () => {
    if (view === "closed-front") {
      setView("open");
      setPageIndex(0);
    } else if (view === "open") {
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
    if (!isPaid) {
      alert("Oops! You need to unlock the full magic to download the PDF.");
      return;
    }

    const yellowStarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#fde047" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: 297mm 210mm; margin: 0; }
            body { margin: 0; padding: 0; font-family: 'Helvetica', sans-serif; background: #fff; }
            .page { width: 297mm; height: 210mm; display: flex; overflow: hidden; page-break-after: always; position: relative; }
            .cover { width: 100%; height: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #ec4899; }
            .glass-box { background: rgba(0, 0, 0, 0.7); padding: 60px; border-radius: 40px; text-align: center; border: 2px solid rgba(255,255,255,0.2); width: 60%; z-index: 10; color: white; }
            .img-side { width: 50%; height: 100%; }
            .img-side img { width: 100%; height: 100%; object-fit: cover; }
            .text-side { width: 50%; height: 100%; background: #FFFCF9; padding: 80px; display: flex; flex-direction: column; justify-content: space-between; position: relative; border-left: 2px solid #eee; }
            .story-content { font-size: 26px; line-height: 1.6; color: #1a202c; flex-grow: 1; margin-bottom: 40px; }
            .bottom-border { border-bottom: 4px solid #ec4899; width: 100px; margin-bottom: 20px; }
            .dropcap { font-size: 70px; font-weight: 900; color: #ec4899; float: left; margin-right: 15px; line-height: 0.8; padding-top: 10px; }
            .back-cover { width: 100%; height: 100%; background: #1e293b; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; }
          </style>
        </head>
        <body>
          <div class="page"><div class="cover"><img src="${images[0]}" style="position: absolute; inset:0; width:100%; height:100%; object-fit:cover;" /><div class="glass-box"><div>${yellowStarSvg}</div><h1 style="font-size:45px;">${title}</h1></div></div></div>
          ${pages.map((text, i) => `
            <div class="page">
              <div class="img-side"><img src="${images[i] || images[0]}" /></div>
              <div class="text-side">
                <div class="story-content">
                  <span class="dropcap">${text.charAt(0)}</span>${text.substring(1)}
                </div>
                <div>
                   <div class="bottom-border"></div>
                   <div style="font-size:14px; color:#94a3b8; font-weight: bold;">PAGE ${i + 1} OF ${pages.length}</div>
                </div>
              </div>
            </div>
          `).join('')}
          <div class="page"><div class="back-cover"><h2 style="font-size:50px;">The End</h2></div></div>
        </body>
      </html>
    `;
    
    try {
      const response = await fetch("/api/pdf", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ html }) 
      });
      if (!response.ok) throw new Error("PDF generation failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) { 
      console.error("Download Error:", err);
      alert("Oops! The magic printer is stuck. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-6xl mx-auto min-h-[90vh]">
      <AnimatePresence mode="wait">
        {/* --- FRONT COVER (Cinematic) --- */}
        {view === "closed-front" && (
          <motion.div key="front" 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="relative w-[360px] h-[520px] shadow-2xl rounded-[3rem] p-3 bg-gradient-to-br from-[#ec4899] to-[#be123c] cursor-pointer border-8 border-white"
            onClick={handleNext}
          >
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
              <img src={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Cover" />
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/20 backdrop-blur-[2px]">
                <div className="bg-white/10 backdrop-blur-xl border border-white/30 w-full py-16 rounded-[2.5rem] flex flex-col items-center">
                  <Sparkles className="text-[#fde047] w-12 h-12 mb-4 animate-pulse" />
                  <h1 className="text-2xl font-[1000] text-white text-center uppercase px-4 leading-tight tracking-tighter">{title}</h1>
                  <span className="mt-8 text-[10px] text-white/70 font-black tracking-[0.3em] animate-bounce">TAP TO OPEN</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- MAIN STORY VIEW --- */}
        {view === "open" && (
          <motion.div key="open" 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row overflow-hidden border-[12px] border-white min-h-[600px] relative"
          >
            {/* LEFT SIDE: THE ARTWORK */}
            <div className="w-full lg:w-1/2 h-[350px] lg:h-[650px] bg-slate-100 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={pageIndex} 
                  initial={{ opacity: 0, scale: 1.1 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  src={images[pageIndex] || images[0]} 
                  className={`w-full h-full object-cover transition-all duration-1000 ${isLockedPage ? 'blur-2xl grayscale brightness-50' : ''}`} 
                  alt="Illustration" 
                />
              </AnimatePresence>

              {/* LOCK OVERLAY FOR TESTING */}
              {isLockedPage && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center text-white bg-black/40 backdrop-blur-md">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-2xl"
                  >
                    <Lock className="w-12 h-12 text-yellow-400" />
                  </motion.div>
                  <h3 className="text-4xl font-[1000] mb-4 tracking-tighter">CONTINUE THE EPIC?</h3>
                  <p className="text-sm font-bold opacity-80 mb-10 max-w-[300px] leading-relaxed">
                    Unlock the remaining 23 cinematic pages and high-quality PDF to keep this magic forever!
                  </p>
                  <button 
                    onClick={onPay} // Calling the generator logic from parent
                    disabled={isProcessing}
                    className="group relative flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-[1000] rounded-[2rem] shadow-[0_15px_30px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Zap fill="currentColor" size={24} />}
                    {isProcessing ? "PREPARING MAGIC..." : "UNLOCK FULL STORY"}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: THE STORY */}
            <div className="w-full lg:w-1/2 h-[500px] lg:h-[650px] flex flex-col bg-[#FFFCF9] p-10 lg:p-20 relative">
              <div className="flex-1 flex flex-col justify-start overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={pageIndex} 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`h-full transition-all duration-700 ${isLockedPage ? 'blur-lg select-none opacity-30' : ''}`}
                  >
                    <p className="text-xl lg:text-2xl font-medium text-[#1e293b] leading-[1.8] first-letter:text-8xl first-letter:text-[#ec4899] first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.7] first-letter:pt-2">
                      {pages[pageIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Indicator / Footer */}
              <div className="mt-10 border-t-2 border-slate-100 pt-8">
                <div className="flex justify-between items-center text-[#94a3b8] font-black text-[11px] uppercase tracking-[0.25em]">
                  <span className="flex items-center gap-2">
                    {isLockedPage ? <Lock size={14} className="text-orange-500" /> : <Sparkles size={14} className="text-blue-500" />}
                    PAGE {pageIndex + 1} OF {pages.length}
                  </span>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-500 ${Math.floor(pageIndex % 5) === i ? 'bg-[#ec4899] w-8' : 'bg-slate-200 w-2'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- BACK COVER (Conclusion) --- */}
        {view === "closed-back" && (
          <motion.div key="back" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.8 }}
            className="w-[360px] h-[520px] bg-[#1e293b] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center border-8 border-slate-700"
          >
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-br from-[#ec4899] to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-[0_15px_30px_rgba(236,72,153,0.3)]"
            >
              <CheckCircle2 className="text-white w-12 h-12" />
            </motion.div>
            <h2 className="text-white text-5xl font-[1000] uppercase italic tracking-tighter mb-4">The End</h2>
            <p className="text-slate-400 font-bold mb-12">A new adventure awaits...</p>
            <button onClick={resetBook} className="group text-slate-500 hover:text-white transition-all flex items-center gap-3 text-xs font-black tracking-widest uppercase">
               <RotateCcw size={18} className="group-hover:rotate-[-180deg] transition-transform duration-500" /> READ AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EXTERNAL CONTROLS --- */}
      <div className="mt-12 flex items-center gap-6">
        <button 
          onClick={handleBack} 
          disabled={view === "closed-front"} 
          className="p-5 bg-white rounded-2xl shadow-xl border-b-4 border-slate-200 hover:bg-slate-50 disabled:opacity-20 transition-all active:scale-90"
        >
          <ArrowLeft className="text-slate-600" />
        </button>

        {view === "closed-front" && (
          <button onClick={handleNext} className="px-12 py-5 bg-[#ec4899] text-white rounded-2xl shadow-2xl font-[1000] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter">
            <BookOpen size={24} /> Start Reading
          </button>
        )}

        {view === "open" && isPaid && (
          <button onClick={downloadPDF} className="px-10 py-5 bg-blue-600 text-white rounded-2xl shadow-2xl font-[1000] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
            <FileDown size={24} /> SAVE STORY (PDF)
          </button>
        )}

        <button 
          onClick={handleNext} 
          disabled={view === "closed-back" || isLockedPage} 
          className="p-5 bg-white rounded-2xl shadow-xl border-b-4 border-slate-200 hover:bg-slate-50 disabled:opacity-20 transition-all active:scale-90"
        >
          <ArrowRight className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}