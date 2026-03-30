"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Star, Moon, Sun } from "lucide-react";

/**
 * Splits text into kid-friendly chunks (shorter pages for easier reading).
 */
function splitTextIntoPages(text, limit = 500) {
  if (!text) return ["Once upon a time, a new magic story was waiting to be told..."];
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

export default function MagicBook({ story, image }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const textPages = splitTextIntoPages(story);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-6 w-full max-w-5xl mx-auto selection:bg-pink-200">
      
      {!open ? (
        /* --- MAGICAL CLOSED COVER --- */
        <motion.div
          layoutId="book-magic"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-[300px] h-[420px] cursor-pointer group"
        >
          {/* Animated Glow behind the book */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
          
          <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl border-[12px] border-white overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            {/* Cover Art Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-purple-50" />
            
            {/* Illustration Preview */}
            <div className="relative z-10 w-full h-48 bg-slate-100 rounded-2xl mb-6 overflow-hidden border-4 border-white shadow-inner">
               <img src={image} alt="Cover" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10">
              <h1 className="text-3xl font-[1000] text-slate-800 leading-tight mb-2">
                MY <span className="text-pink-500">MAGIC</span><br/>ADVENTURE
              </h1>
              <div className="flex justify-center gap-2 mb-4">
                <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 py-2 px-4 rounded-full">
                Tap to Open ✨
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        /* --- OPEN MAGIC SPREAD --- */
        <div className="flex flex-col items-center gap-6 w-full">
          
          <motion.div
            layoutId="book-magic"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col lg:flex-row w-full min-h-[550px] lg:h-[650px] bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-[12px] border-white overflow-hidden"
          >
            {/* LEFT PAGE: FULL IMAGE */}
            <div className="w-full lg:w-1/2 h-[300px] lg:h-full relative overflow-hidden bg-slate-50">
               <AnimatePresence mode="wait">
                 <motion.img
                    key={image}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={image}
                    alt="Story Scene"
                    className="w-full h-full object-cover"
                 />
               </AnimatePresence>
               {/* Decorative corner curve */}
               <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-bl-3xl lg:hidden" />
            </div>

            {/* THE SPINE LINE */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-2 -ml-1 bg-slate-100 z-10 shadow-inner" />

            {/* RIGHT PAGE: STORY TEXT */}
            <div className="w-full lg:w-1/2 h-full flex flex-col p-8 lg:p-12 relative bg-[#fffdfa]">
               {/* Confetti Background Detail */}
               <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="text-purple-500" size={20} />
                    <span className="text-xs font-black text-purple-300 uppercase tracking-widest">Ginnie Tales</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <p className="text-xl lg:text-2xl font-bold text-slate-700 leading-relaxed first-letter:text-5xl first-letter:text-pink-500 first-letter:font-black first-letter:mr-2">
                        {textPages[page]}
                      </p>
                    </motion.div>
                  </AnimatePresence>
               </div>

               {/* PAGE FOOTER */}
               <div className="mt-8 flex justify-between items-center border-t-2 border-slate-50 pt-6">
                  <div className="flex gap-1">
                    {[...Array(textPages.length)].map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all ${i === page ? 'w-6 bg-pink-500' : 'w-2 bg-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-black text-slate-300">
                    {page + 1} / {textPages.length}
                  </span>
               </div>
            </div>
          </motion.div>

          {/* --- NAVIGATION CONTROLS --- */}
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-4 bg-white rounded-2xl shadow-lg border-b-4 border-slate-200 text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50"
            >
              <ArrowLeft size={24} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setOpen(false); setPage(0); }}
              className="px-8 py-4 bg-white rounded-2xl shadow-lg border-b-4 border-slate-200 font-black text-xs text-slate-400 tracking-widest hover:text-pink-500 transition-colors"
            >
              CLOSE BOOK
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={page >= textPages.length - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-4 bg-pink-500 rounded-2xl shadow-lg border-b-4 border-pink-700 text-white disabled:opacity-30 transition-all hover:bg-pink-400"
            >
              <ArrowRight size={24} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Styles for the kid-friendly scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}