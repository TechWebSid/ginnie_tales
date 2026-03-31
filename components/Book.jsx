"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, Star, CheckCircle2, FileDown, BookOpen, RotateCcw } from "lucide-react";

function splitTextIntoPages(text, limit = 300) {
  if (!text) return ["Once upon a time..."];
  const words = text.split(" ");
  const pages = [];
  let currentPage = "";

  words.forEach((word) => {
    const testPage = currentPage + word + " ";
    if (testPage.length > limit) {
      if (currentPage.trim()) pages.push(currentPage.trim());
      currentPage = word + " ";
    } else {
      currentPage = testPage;
    }
  });

  if (currentPage.trim()) pages.push(currentPage.trim());
  return pages;
}

export default function MagicBook({ story, image, title = "MY MAGIC ADVENTURE" }) {
  const [view, setView] = useState("closed-front"); // "closed-front" | "open" | "closed-back"
  const [page, setPage] = useState(0);

  const textPages = splitTextIntoPages(story, 300);

  // --- NAVIGATION LOGIC ---
  const handleNext = () => {
    if (view === "closed-front") {
      setView("open");
      setPage(0);
    } else if (view === "open") {
      if (page < textPages.length - 1) {
        setPage(page + 1);
      } else {
        setView("closed-back");
      }
    }
  };

  const handleBack = () => {
    if (view === "closed-back") {
      setView("open");
      setPage(textPages.length - 1);
    } else if (view === "open") {
      if (page > 0) {
        setPage(page - 1);
      } else {
        setView("closed-front");
      }
    }
  };

  const resetBook = () => {
    setPage(0);
    setView("closed-front");
  };

  // --- PDF EXPORT (Book Layout) ---
// --- PDF EXPORT (Book Layout) ---
  const downloadPDF = async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;700&family=Inter:wght@900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: 297mm 210mm; margin: 0; }
            body { margin: 0; padding: 0; font-family: 'Crimson Pro', serif; background: #fff; }
            .page { width: 297mm; height: 210mm; display: flex; overflow: hidden; page-break-after: always; }
            .text-side { width: 50%; height: 100%; background: #FFFCF9; padding: 100px 80px; display: flex; flex-direction: column; justify-content: center; position: relative; }
            .story-content { font-size: 28px; line-height: 1.8; color: #1a202c; }
            .dropcap { float: left; font-size: 80px; line-height: 1; font-weight: 700; margin-right: 12px; color: #ec4899; font-family: 'Inter', sans-serif; }
            
            /* Cover Styles */
            .cover { width: 100%; height: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #ec4899; }
            .glass-box { background: rgba(0, 0, 0, 0.7); padding: 60px; border-radius: 40px; text-align: center; border: 2px solid rgba(255,255,255,0.2); width: 60%; z-index: 10; }
            
            /* Back Cover Styles */
            .back-cover { width: 100%; height: 100%; background: #1e293b; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; }
            .end-circle { width: 100px; height: 100px; background: #ec4899; border-radius: 50%; margin-bottom: 30px; display: flex; justify-content: center; align-items: center; font-size: 50px; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="cover">
              <img src="${image}" style="position: absolute; inset:0; width:100%; height:100%; object-fit:cover;" />
              <div class="glass-box">
                <h1 style="color:white; font-family:'Inter'; font-size:50px; text-transform:uppercase;">${title}</h1>
              </div>
            </div>
          </div>

          ${textPages.map((text, i) => `
            <div class="page">
              <div style="width:50%;"><img src="${image}" style="width:100%; height:100%; object-fit:cover;" /></div>
              <div class="text-side">
                <div class="story-content">
                  <span class="dropcap">${text.charAt(0)}</span>${text.substring(1)}
                </div>
                <div style="position:absolute; bottom:50px; right:80px; font-family:'Inter'; font-size:14px; color:#cbd5e1;">
                  PAGE ${i + 1} OF ${textPages.length}
                </div>
              </div>
            </div>
          `).join('')}

          <div class="page">
            <div class="back-cover">
              <div class="end-circle">✓</div>
              <h2 style="font-family:'Inter'; font-size:60px; text-transform:uppercase; font-style:italic;">The End</h2>
              <p style="font-family:'Inter'; font-size:14px; letter-spacing:0.3em; color:#94a3b8; margin-top:20px; font-weight:bold;">
                GINNIETALES ORIGINAL
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    try {
      const res = await fetch("/api/pdf", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ html }) 
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); 
      a.href = url; 
      a.download = `${title.replace(/\s+/g, '_')}_Story.pdf`; 
      a.click();
    } catch (err) { console.error("PDF Generation Error:", err); }
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
              <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
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
            <div className="w-full lg:w-1/2 h-[350px] lg:h-[650px]"><img src={image} className="w-full h-full object-cover" alt="Art" /></div>
            <div className="w-full lg:w-1/2 h-[500px] lg:h-[650px] flex flex-col bg-[#FFFCF9] p-10 lg:p-16 justify-center relative">
              <div className="flex-1 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p key={page} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    className="text-2xl lg:text-3xl font-medium text-[#1e293b] leading-[1.8] first-letter:text-7xl first-letter:text-[#ec4899] first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]"
                  >
                    {textPages[page]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="mt-8 pt-6 border-t flex justify-between items-center text-[#94a3b8] font-bold text-xs uppercase tracking-widest">
                <span>PAGE {page + 1} / {textPages.length}</span>
                <div className="flex gap-2">
                  {textPages.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === page ? 'bg-[#ec4899] w-8' : 'bg-slate-200 w-2'}`} />
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
            <p className="text-[#94a3b8] mt-4 font-bold text-xs tracking-[0.3em]">GINNIETALES ORIGINAL</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CLEAN UX CONTROLS --- */}
      <div className="mt-12 flex items-center gap-4">
        {/* Navigation Arrows */}
        <button 
          onClick={handleBack} 
          disabled={view === "closed-front"}
          className="p-5 bg-white rounded-2xl shadow-md border border-slate-100 disabled:opacity-20 hover:bg-slate-50 transition-all active:scale-90"
        >
          <ArrowLeft className="text-slate-600" />
        </button>

        {/* Dynamic Context Button */}
        {view === "closed-front" && (
          <button onClick={() => setView("open")} className="px-10 py-5 bg-[#ec4899] text-white rounded-2xl shadow-xl font-black text-sm tracking-widest flex items-center gap-3 hover:scale-105 transition-all">
            <BookOpen size={20} /> OPEN BOOK
          </button>
        )}

        {view === "open" && (
          <button onClick={downloadPDF} className="px-10 py-5 bg-[#2563eb] text-white rounded-2xl shadow-xl font-black text-sm tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all active:scale-95">
            <FileDown size={20} /> DOWNLOAD PDF
          </button>
        )}

        {view === "closed-back" && (
          <button onClick={resetBook} className="px-10 py-5 bg-[#ec4899] text-white rounded-2xl shadow-xl font-black text-sm tracking-widest flex items-center gap-3 hover:scale-105 transition-all">
            <RotateCcw size={20} /> START OVER
          </button>
        )}

        <button 
          onClick={handleNext} 
          disabled={view === "closed-back"}
          className="p-5 bg-white rounded-2xl shadow-md border border-slate-100 disabled:opacity-20 hover:bg-slate-50 transition-all active:scale-90"
        >
          <ArrowRight className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}