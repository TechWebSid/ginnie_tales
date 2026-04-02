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

  // Logic: Check if the current page is actually generated or just a placeholder
  const isImageLoading = images[pageIndex]?.includes("Locked") || images[pageIndex]?.includes("placehold.co");
  const isLockedPage = pageIndex >= 2 && !isPaid;

  // Auto-advance view when payment starts if user was on the lock screen
  useEffect(() => {
    if (isPaid && view === "closed-front") {
      setView("open");
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
      // Prevent moving past page 2 if not paid
      if (pageIndex === 1 && !isPaid) {
        setPageIndex(2); // Show the lock screen
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
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=Inter:ital,wght@0,400;0,700;0,900;1,900&display=swap');
              
              body { margin: 0; padding: 0; background: #FEF9EF; font-family: 'Inter', sans-serif; color: #1A365D; }
              
              .page { 
                width: 297mm; height: 210mm; 
                display: flex; page-break-after: always; 
                border: 15px solid white; box-sizing: border-box;
                position: relative; overflow: hidden;
              }

              /* --- FRONT COVER Fix (Centered Text) --- */
              .front-cover {
                background: #000;
                justify-content: flex-end; /* Pushes content to bottom */
                align-items: center; /* Horizontally centers */
              }
              .hero-bg {
                position: absolute; inset: 0;
                width: 100%; height: 100%;
                object-fit: cover;
                opacity: 0.9;
                z-index: 1;
              }
              .vignette {
                position: absolute; inset: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 60%);
                z-index: 2;
              }
              .cover-footer {
                position: relative; z-index: 10;
                padding-bottom: 60px; /* Moves text just below face */
                text-align: center;
                width: 100%; /* Ensures inner centering */
              }
              .generic-title { 
                font-size: 50px;
                font-weight: 900; font-style: italic;
                color: #FFD166;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 0 10px 20px rgba(0,0,0,0.5);
              }

              /* --- STORY PAGES Fix (Images Back) --- */
              .img-container { width: 50%; height: 100%; border-right: 10px solid white; }
              .img-container img { width: 100%; height: 100%; object-fit: cover; }
              
              /* Typography from website style */
              .text-container { 
                width: 50%; padding: 60px; 
                display: flex; align-items: center; justify-content: center; 
                position: relative;
                background: #FFFCF9;
              }
              .story-text {
                font-size: 38px; line-height: 1.3; font-weight: 800; letter-spacing: -1px; margin: 0;
                color: #1A365D;
              }
              .story-text::first-letter {
                color: #EF476F; font-family: 'Plus Jakarta Sans', sans-serif; float: left;
                font-size: 110px; line-height: 0.8; padding-right: 15px; font-weight: 900;
              }

              /* Pagination Footer */
              .footer {
                position: absolute; bottom: 50px; left: 60px; right: 60px;
                display: flex; justify-content: space-between; align-items: center;
                border-top: 2px solid #F0F0F0; padding-top: 20px;
                width: calc(100% - 120px);
              }
              .page-info { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 14px; letter-spacing: 2px; }
              .sparkle-icon { color: #EF476F; font-size: 20px; }
              
              .dots { display: flex; gap: 8px; }
              .dot { width: 10px; height: 10px; border-radius: 50%; background: #E2E8F0; }
              .dot.active { width: 25px; border-radius: 10px; background: #EF476F; }

              /* --- BACK COVER DESIGN (PREMIUM) --- */
              .back-cover {
                background: #EF476F;
                color: white; border: none;
                justify-content: center; align-items: center;
              }
              .back-inner {
                width: 85%; height: 85%;
                border: 8px double rgba(255,255,255,0.3);
                display: flex; flex-direction: column; align-items: center; justify-content: center;
              }
            </style>
          </head>
          <body>
            
            <div class="page front-cover">
              <img src="${frontCoverImg}" class="hero-bg" />
              <div class="vignette"></div>
              <div class="cover-footer">
                <div style="font-size: 12px; letter-spacing: 8px; margin-bottom: 20px; color: #06D6A0; font-weight: 900;">A GINNIETALES ORIGINAL</div>
                <h1 class="generic-title">A MAGICAL STORY INSIDE</h1>
              </div>
            </div>

            ${pages.map((text, i) => `
              <div class="page">
                <div class="img-container">
                  <img src="${images[i] || images[0]}" />
                </div>
                <div class="text-container">
                    <p class="story-text">${text}</p>
                    
                    <div class="footer">
                      <div class="page-info">
                        <span class="sparkle-icon">✨</span>
                        PAGE ${i + 1} / ${pages.length}
                      </div>
                      <div class="dots">
                        ${pages.map((_, dotIdx) => `
                          <div class="dot ${dotIdx === i ? 'active' : ''}"></div>
                        `).join('')}
                      </div>
                    </div>
                </div>
              </div>
            `).join('')}

            <div class="page back-cover">
              <div class="back-inner">
                <div style="font-size: 60px; margin-bottom: 20px;">📖</div>
                <h2 style="font-size: 100px; font-weight: 900; font-style: italic; color: #FFD166; margin: 0; text-transform: uppercase;">The End</h2>
                <p style="letter-spacing: 5px; font-weight: 900; margin-top: 20px; color: #073B4C;">YOUR ADVENTURE LIVES ON</p>
                <div style="margin-top: 60px; font-size: 24px; font-weight: 900; font-style: italic; color: #FFD166; letter-spacing: 4px;">GinnieTales.in</div>
              </div>
            </div>

          </body>
        </html>
      `;

      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}_MagicBook.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Magic failed! Make sure all images are loaded.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {/* --- FRONT COVER --- */}
        {view === "closed-front" && (
          <motion.div key="front" 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="relative w-[320px] h-[460px] md:w-[380px] md:h-[540px] shadow-[20px_20px_0px_#073B4C] rounded-[3rem] p-3 bg-[#EF476F] cursor-pointer border-8 border-white"
            onClick={handleNext}
          >
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
              <img src={images[0]} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#073B4C] via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                  <Sparkles className="text-[#FFD166] w-10 h-10 mb-4 animate-pulse" />
                  <h1 className="text-2xl md:text-3xl font-[1000] text-white uppercase leading-tight tracking-tighter mb-4">{title}</h1>
                  <span className="text-[10px] text-white/70 font-black tracking-[0.3em] animate-bounce uppercase">Tap to Read</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- MAIN STORY VIEW --- */}
        {view === "open" && (
          <motion.div key="open" 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row overflow-hidden border-[8px] md:border-[12px] border-white min-h-[550px] relative"
          >
            {/* LEFT SIDE: THE ARTWORK */}
            <div className="w-full lg:w-1/2 h-[300px] lg:h-[650px] bg-[#F1FAEE] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageIndex}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <img 
                    src={images[pageIndex] || images[0]} 
                    className={`w-full h-full object-cover transition-all duration-700 ${isLockedPage || (isPaid && isImageLoading) ? 'blur-2xl grayscale brightness-50' : ''}`} 
                    alt="Illustration" 
                  />
                </motion.div>
              </AnimatePresence>

              {/* LOCK STATE: Before Payment */}
              {isLockedPage && !isProcessing && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center text-white bg-[#073B4C]/60 backdrop-blur-md">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-20 h-20 bg-[#FFD166] rounded-full flex items-center justify-center mb-6 shadow-2xl">
                    <Lock className="w-10 h-10 text-[#073B4C]" />
                  </motion.div>
                  <h3 className="text-3xl font-[1000] mb-2 tracking-tighter uppercase">The Tale Paused...</h3>
                  <p className="text-xs font-bold opacity-90 mb-8 max-w-[250px] leading-relaxed uppercase tracking-wider">Unlock all {pages.length} pages and get the high-quality PDF!</p>
                  <button 
                    onClick={onPay}
                    className="group flex items-center gap-3 px-8 py-5 bg-[#EF476F] text-white font-[1000] rounded-2xl shadow-[0_10px_0px_#C9184A] hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm"
                  >
                    <Zap fill="currentColor" size={18} /> Unlock Magic
                  </button>
                </div>
              )}

              {/* GENERATING STATE: After Payment, while images are being painted */}
              {isPaid && isImageLoading && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center text-white bg-[#118AB2]/40 backdrop-blur-xl">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                        <Palette className="w-16 h-16 text-[#FFD166]" />
                    </motion.div>
                    <h3 className="text-2xl font-[1000] mt-6 uppercase tracking-tighter">Genie is Painting...</h3>
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] mt-2">Creating HD Art for Page {pageIndex + 1}</p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: THE STORY */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[650px] flex flex-col bg-[#FFFCF9] p-8 lg:p-16 relative">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={pageIndex} 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className={`${isLockedPage ? 'blur-md select-none opacity-20' : ''}`}
                  >
                    <p className="text-lg lg:text-xl font-bold text-[#073B4C] leading-[1.8] first-letter:text-7xl first-letter:font-[1000] first-letter:text-[#EF476F] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] pt-2">
                      {pages[pageIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Indicator */}
              <div className="mt-8 border-t-4 border-[#F1FAEE] pt-6">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 font-[1000] text-[10px] text-[#118AB2] uppercase tracking-widest">
                    {isLockedPage ? <Lock size={12} /> : <Sparkles size={12} />}
                    Page {pageIndex + 1} / {pages.length}
                  </span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: Math.min(pages.length, 10) }).map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-500 ${pageIndex % 10 === i ? 'bg-[#EF476F] w-6' : 'bg-[#06D6A0]/20 w-2'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- BACK COVER --- */}
        {view === "closed-back" && (
          <motion.div key="back" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.8 }}
            className="w-[320px] h-[460px] bg-[#073B4C] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center border-8 border-white"
          >
            <div className="w-20 h-20 bg-[#06D6A0] rounded-full flex items-center justify-center mb-8 shadow-lg">
              <CheckCircle2 className="text-white w-10 h-10" />
            </div>
            <h2 className="text-white text-4xl font-[1000] uppercase tracking-tighter mb-2">The End</h2>
            <p className="text-[#118AB2] font-black uppercase text-[10px] tracking-[0.2em] mb-10">A Beautiful Tale, Well Read</p>
            <button onClick={resetBook} className="flex items-center gap-2 text-[#FFD166] hover:text-white transition-colors font-black uppercase text-xs tracking-widest">
               <RotateCcw size={16} /> Read Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING CONTROLS --- */}
      <div className="mt-10 flex items-center gap-4 md:gap-8">
        <button 
          onClick={handleBack} 
          disabled={view === "closed-front" || isProcessing} 
          className="p-4 bg-white rounded-2xl shadow-[4px_4px_0px_#073B4C] border-2 border-[#073B4C] hover:bg-[#F1FAEE] disabled:opacity-20 transition-all active:translate-y-1 active:shadow-none"
        >
          <ArrowLeft className="text-[#073B4C]" size={20} />
        </button>

        {view === "open" && isPaid && (
        <button 
  onClick={downloadPDF} 
  className="px-8 py-4 bg-[#06D6A0] text-white rounded-2xl shadow-[4px_4px_0px_#059669] font-[1000] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all uppercase text-xs border-2 border-white"
>
  <FileDown size={18} /> Save PDF
</button>
        )}

        <button 
          onClick={handleNext} 
          disabled={view === "closed-back" || (isLockedPage && !isPaid) || isProcessing} 
          className="p-4 bg-white rounded-2xl shadow-[4px_4px_0px_#073B4C] border-2 border-[#073B4C] hover:bg-[#F1FAEE] disabled:opacity-20 transition-all active:translate-y-1 active:shadow-none"
        >
          <ArrowRight className="text-[#073B4C]" size={20} />
        </button>
      </div>
    </div>
  );
}