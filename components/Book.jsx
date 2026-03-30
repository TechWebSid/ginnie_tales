"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Helper to split text into readable chunks without cutting words in half.
 */
function splitTextIntoPages(text, limit = 600) {
  if (!text) return ["The pages are blank..."];
  const words = text.split(" ");
  const pages = [];
  let currentPage = "";

  words.forEach((word) => {
    if ((currentPage + word).length > limit) {
      pages.push(currentPage.trim());
      currentPage = word + " ";
    } else {
      currentPage += word + " ";
    }
  });
  if (currentPage) pages.push(currentPage.trim());
  return pages;
}

export default function ModernBook({ story, image }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const textPages = splitTextIntoPages(story);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-4 sm:p-8 selection:bg-amber-200">
      
      {!open ? (
        /* --- PREMIUM CLOSED COVER --- */
        <motion.div
          layoutId="book-transform"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.02, rotateY: -8, x: 10 }}
          className="relative w-[340px] h-[480px] cursor-pointer"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {/* Spine Detail */}
          <div className="absolute left-0 inset-y-0 w-8 bg-black/40 rounded-l-lg z-20 shadow-[inset_-4px_0_10px_rgba(0,0,0,0.5)] border-r border-white/5" />
          
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-lg shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-10 border border-white/10 relative overflow-hidden">
            {/* Leather Texture Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />
            
            <div className="border-[1px] border-amber-500/30 p-8 text-center z-10 outline outline-1 outline-amber-500/20 outline-offset-8">
              <h1 className="text-3xl font-serif font-bold text-amber-100 tracking-[0.25em] uppercase leading-tight">
                Your <br/> Story
              </h1>
              <div className="h-[1px] w-16 bg-amber-500/50 mx-auto my-6" />
              <p className="text-amber-200/40 text-[10px] tracking-[0.4em] uppercase font-light">Collector's Edition</p>
            </div>
            
            <div className="absolute bottom-12 flex flex-col items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0" />
                <p className="text-white/30 text-xs font-serif italic tracking-widest">Click to Open</p>
            </div>
          </div>
        </motion.div>
      ) : (
        /* --- OPEN BOOK SPREAD --- */
        <div className="flex flex-col items-center gap-8 w-full max-w-6xl">
          <motion.div
            layoutId="book-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col md:flex-row w-full h-[700px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden bg-white"
          >
            {/* THE CENTER SPINE GUM (Visual Detail) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[4px] -ml-[2px] bg-black/10 z-40 shadow-[0_0_15px_rgba(0,0,0,0.3)]" />
            
            {/* LEFT PAGE: ILLUSTRATION */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex flex-col relative overflow-hidden border-r border-slate-100">
               <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
               
               {/* Spine Shadow for Left Page */}
               <div className="hidden md:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/15 to-transparent z-10 pointer-events-none" />

               <div className="h-full w-full p-8 md:p-14 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="w-full h-full relative"
                    >
                      <img
                        src={image || "/api/placeholder/400/600"}
                        alt="Story Illustration"
                        className="w-full h-full object-cover rounded shadow-2xl border-[12px] border-white ring-1 ring-black/5"
                      />
                    </motion.div>
                  </AnimatePresence>
               </div>
            </div>

            {/* RIGHT PAGE: TEXT CONTENT */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#fdfbf7] flex flex-col relative">
               {/* Paper Texture Overlay */}
               <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
               
               {/* Spine Shadow for Right Page */}
               <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/15 to-transparent z-30 pointer-events-none" />

               {/* Bottom Fade Mask (Fixes the "cut-off" look) */}
               <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent z-20 pointer-events-none" />

               {/* SCROLLABLE TEXT AREA */}
               <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-8 md:px-16 pt-16 md:pt-24 pb-32">
                  <span className="text-8xl font-serif text-indigo-900/5 absolute top-10 left-10 select-none">“</span>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="relative"
                    >
                      <p className="text-[19px] md:text-[22px] font-serif text-slate-800 leading-[1.85] first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-950 first-letter:leading-[0.7] first-letter:mt-2">
                        {textPages[page]}
                      </p>
                    </motion.div>
                  </AnimatePresence>
               </div>

               {/* PAGE FOOTER / PAGINATION */}
               <div className="absolute bottom-0 left-0 right-0 p-8 px-16 bg-gradient-to-t from-[#fdfbf7] to-[#fdfbf7]/0 z-30 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-sans tracking-[0.3em] text-slate-400 uppercase">Chronicle</span>
                    <div className="h-[1px] w-8 bg-indigo-900/20 mt-1" />
                  </div>
                  <span className="text-sm font-serif italic text-slate-500 tracking-widest">
                    {page + 1} <span className="mx-2 opacity-30">/</span> {textPages.length}
                  </span>
               </div>
            </div>
          </motion.div>

          {/* --- MINIMALIST NAVIGATION CONTROLS --- */}
          <div className="flex items-center gap-10 bg-slate-900/40 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="group flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-10 transition-all"
            >
              <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs uppercase tracking-widest hidden sm:block">Back</span>
            </button>

            <button 
              onClick={() => { setOpen(false); setPage(0); }}
              className="text-[10px] uppercase tracking-[0.4em] text-amber-500/60 hover:text-amber-400 transition-colors font-bold"
            >
              Close Journal
            </button>

            <button
              disabled={page >= textPages.length - 1}
              onClick={() => setPage((p) => p + 1)}
              className="group flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-10 transition-all"
            >
              <span className="text-xs uppercase tracking-widest hidden sm:block">Next</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for the hidden but functional scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.05) transparent;
        }
      `}</style>
    </div>
  );
}