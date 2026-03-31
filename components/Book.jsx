"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, FileDown, BookOpen, RotateCcw } from "lucide-react";

// NOTE: We removed splitTextIntoPages because 'pages' is now an array from the API
export default function MagicBook({ pages = [], images = [], title = "MY MAGIC ADVENTURE" }) {
  const [view, setView] = useState("closed-front"); // "closed-front" | "open" | "closed-back"
  const [pageIndex, setPageIndex] = useState(0);

  // Safety check: if pages aren't loaded yet
  if (!pages || pages.length === 0) {
    return <div className="text-slate-500 font-bold">Magical pages are loading...</div>;
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
            .text-side { width: 50%; height: 100%; background: #FFFCF9; padding: 80px; display: flex; flex-direction: column; justify-content: center; position: relative; }
            .story-content { font-size: 24px; line-height: 1.6; color: #1a202c; }
            .dropcap { font-size: 60px; font-weight: 900; color: #ec4899; float: left; margin-right: 10px; line-height: 1; }
            .back-cover { width: 100%; height: 100%; background: #1e293b; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; }
          </style>
        </head>
        <body>
          <div class="page"><div class="cover"><img src="${images[0]}" style="position: absolute; inset:0; width:100%; height:100%; object-fit:cover;" /><div class="glass-box"><div>${yellowStarSvg}</div><h1 style="font-size:45px;">${title}</h1></div></div></div>
          ${pages.map((text, i) => `
            <div class="page">
              <div class="img-side"><img src="${images[i] || images[0]}" /></div>
              <div class="text-side">
                <div class="story-content"><span class="dropcap">${text.charAt(0)}</span>${text.substring(1)}</div>
                <div style="position:absolute; bottom:40px; right:40px; font-size:12px; color:#cbd5e1;">PAGE ${i + 1} OF 4</div>
              </div>
            </div>
          `).join('')}
          <div class="page"><div class="back-cover"><h2 style="font-size:50px;">The End</h2></div></div>
        </body>
      </html>
    `;
    
    try {
      const res = await fetch("/api/pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ html }) });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "Magic_Story.pdf"; a.click();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto min-h-[85vh]">
      <AnimatePresence mode="wait">
        
        {/* --- FRONT COVER --- */}
        {view === "closed-front" && (
          <motion.div key="front" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ rotateY: -90, opacity: 0 }}
            className="relative w-[360px] h-[520px] shadow-2xl rounded-[3rem] p-3 bg-[#ec4899]"
          >
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
              <img src={images[0]} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/20">
                <div className="bg-white/10 backdrop-blur-xl border border-white/30 w-full py-16 rounded-[2.5rem] flex flex-col items-center">
                  <Sparkles className="text-[#fde047] w-12 h-12 mb-4" />
                  <h1 className="text-2xl font-black text-white text-center uppercase px-4 leading-tight">{title}</h1>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- INSIDE PAGES --- */}
        {view === "open" && (
          <motion.div key="open" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border-[12px] border-white"
          >
            <div className="w-full lg:w-1/2 h-[350px] lg:h-[650px]">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={pageIndex}
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  src={images[pageIndex] || images[0]} 
                  className="w-full h-full object-cover" 
                  alt="Illustration" 
                />
              </AnimatePresence>
            </div>
            <div className="w-full lg:w-1/2 h-[500px] lg:h-[650px] flex flex-col bg-[#FFFCF9] p-10 lg:p-16 justify-center relative">
              <div className="flex-1 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p key={pageIndex} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    className="text-2xl lg:text-3xl font-medium text-[#1e293b] leading-[1.8] first-letter:text-7xl first-letter:text-[#ec4899] first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]"
                  >
                    {pages[pageIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="mt-8 pt-6 border-t flex justify-between items-center text-[#94a3b8] font-bold text-xs uppercase tracking-widest">
                <span>PAGE {pageIndex + 1} / {pages.length}</span>
                <div className="flex gap-2">
                  {pages.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === pageIndex ? 'bg-[#ec4899] w-8' : 'bg-slate-200 w-2'}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- BACK COVER --- */}
        {view === "closed-back" && (
          <motion.div key="back" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
            className="w-[360px] h-[520px] bg-[#1e293b] rounded-l-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="w-20 h-20 bg-[#ec4899] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#ec4899]/20">
              <CheckCircle2 className="text-white w-10 h-10" />
            </div>
            <h2 className="text-white text-4xl font-black uppercase italic tracking-tighter">The End</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTROLS --- */}
      <div className="mt-12 flex items-center gap-4">
        <button onClick={handleBack} disabled={view === "closed-front"} className="p-5 bg-white rounded-2xl shadow-md disabled:opacity-20 transition-all"><ArrowLeft/></button>
        
        {view === "closed-front" && (
          <button onClick={() => setView("open")} className="px-10 py-5 bg-[#ec4899] text-white rounded-2xl shadow-xl font-black flex items-center gap-3">
            <BookOpen size={20} /> OPEN BOOK
          </button>
        )}

        {view === "open" && (
          <button onClick={downloadPDF} className="px-10 py-5 bg-[#2563eb] text-white rounded-2xl shadow-xl font-black flex items-center gap-3">
            <FileDown size={20} /> DOWNLOAD PDF
          </button>
        )}

        {view === "closed-back" && (
          <button onClick={resetBook} className="px-10 py-5 bg-[#ec4899] text-white rounded-2xl shadow-xl font-black flex items-center gap-3">
            <RotateCcw size={20} /> START OVER
          </button>
        )}

        <button onClick={handleNext} disabled={view === "closed-back"} className="p-5 bg-white rounded-2xl shadow-md disabled:opacity-20 transition-all"><ArrowRight/></button>
      </div>
    </div>
  );
}