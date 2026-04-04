"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Sparkles, Map, CookingPot, 
  Globe, BookOpen, Gift, Heart, X, 
  ChevronRight, Star, Cloud, MousePointer2 
} from "lucide-react";

const THEME_DATA = {
  "Educational": { icon: <Rocket />, color: "bg-blue-400", light: "bg-blue-50", text: "text-blue-600", span: "md:col-span-2 md:row-span-2", desc: "Learn about the stars, the sea, and how the world works!", subjects: ["Solar System Adventure", "Deep Sea Creatures", "How Tiny Seeds Grow", "The Human Body Secret", "Numbers in the Jungle", "History of Dinosaurs", "Rainforest Wonders"] },
  "Fairy Tales": { icon: <Sparkles />, color: "bg-pink-400", light: "bg-pink-50", text: "text-pink-600", span: "md:col-span-2 md:row-span-1", desc: "Dragons, knights, and magical forests await.", subjects: ["The Crystal Palace", "A Dragon's First Breath", "The Midnight Ball", "Talking Forest Animals", "Secret of the Moon Fairy", "The Gingerbread House", "The Brave Little Knight"] },
  "Adventure": { icon: <Map />, color: "bg-orange-400", light: "bg-orange-50", text: "text-orange-600", span: "md:col-span-1 md:row-span-2", desc: "Buckle up for wild journeys!", subjects: ["Lost in the Candy Clouds", "Desert Island Treasure", "Mountain of Miracles", "The Flying Treehouse", "Mission to Mars", "Deep Cave Discovery", "The Time Machine Trip"] },
  "Activities": { icon: <CookingPot />, color: "bg-yellow-400", light: "bg-yellow-50", text: "text-yellow-600", span: "md:col-span-1 md:row-span-1", desc: "Everyday fun turned into magic.", subjects: ["Grandma's Magic Kitchen", "The Backyard Campout", "Building a Robot Friend", "A Rainy Day Parade", "Painting the Rainbow", "The Secret Treehouse Club", "My First Soccer Match"] },
  "Worlds": { icon: <Globe />, color: "bg-purple-400", light: "bg-purple-50", text: "text-purple-600", span: "md:col-span-2 md:row-span-2", desc: "Explore places you've only dreamed of.", subjects: ["The Underwater Kingdom", "City of Floating Bubbles", "Land of Giant Toys", "The Planet of Sweets", "Hidden Jungle Temple", "Cloud Castle Journey", "The Ice Cream Village"] },
  "Stories": { icon: <BookOpen />, color: "bg-teal-400", light: "bg-teal-50", text: "text-teal-600", span: "md:col-span-1 md:row-span-1", desc: "Heartwarming tales for bedtime.", subjects: ["A Letter to the Moon", "The Dog Who Could Talk", "Lost Sock Mystery", "The Library of Magic Books", "My Robot's Birthday", "The Cat Who Was a King", "The Tree That Grew Gold"] },
  "Holidays": { icon: <Gift />, color: "bg-red-400", light: "bg-red-50", text: "text-red-600", span: "md:col-span-1 md:row-span-2", desc: "Celebrate the best days of the year!", subjects: ["The Christmas Elf's Mistake", "Halloween at Ghost Mansion", "The Diwali Light Mystery", "Eid Celebration Surprise", "Easter Egg Hunt Adventure", "New Year's Eve Wish", "The Summer Camp Story"] },
  "Family": { icon: <Heart />, color: "bg-rose-400", light: "bg-rose-50", text: "text-rose-600", span: "md:col-span-2 md:row-span-1", desc: "Stories about the ones we love most.", subjects: ["A Day with Superhero Dad", "Mom's Magic Garden", "The Big Family Picnic", "Going to Grandpa's Farm", "My Little Brother is an Alien", "Visiting the Big City", "Family Road Trip Fun"] }
};

export default function UltimateThemePage() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (selectedTheme) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedTheme]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FFFDF5] relative overflow-x-hidden pb-20">
      
      {/* Background Decor - Hidden on very small screens for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <motion.div animate={{ x: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 8 }} className="absolute top-10 left-[5%] text-blue-100 opacity-50"><Cloud size={100} fill="currentColor" /></motion.div>
        <motion.div animate={{ x: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 10 }} className="absolute top-32 right-[5%] text-pink-50 opacity-50"><Cloud size={140} fill="currentColor" /></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Responsive Header */}
        <header className="pt-16 md:pt-24 pb-12 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6 border-4 border-white rotate-3">
            <Sparkles size={32} />
          </motion.div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-[1000] tracking-tighter text-slate-900 leading-[0.9] mb-4 uppercase italic px-2">
            Pick Your <br className="hidden sm:block"/>
            <span className="text-blue-600">Adventure</span>
          </h1>
          <p className="text-slate-500 font-black text-lg md:text-2xl uppercase tracking-tight px-4">
            Click a world to find your story! ✨
          </p>
        </header>

        {/* Dynamic Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-4 md:gap-6">
          {Object.entries(THEME_DATA).map(([key, value], idx) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.01 }}
              onClick={() => setSelectedTheme(key)}
              // Logic: use defined span on desktop (md+), full width on mobile
              className={`${value.span} col-span-1 row-span-1 ${value.light} p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] md:border-[12px] border-white shadow-lg hover:shadow-xl transition-all flex flex-col items-start text-left relative group overflow-hidden`}
            >
              {/* Ghost Icon - Hidden on mobile to keep text readable */}
              <div className="absolute -bottom-4 -right-4 text-white opacity-20 group-hover:scale-125 transition-transform duration-500 hidden md:block">
                {React.cloneElement(value.icon, { size: 140 })}
              </div>

              <div className={`${value.color} w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-md mb-4 group-hover:rotate-6 transition-transform`}>
                {React.cloneElement(value.icon, { size: 24 })}
              </div>
              
              <h3 className={`text-xl md:text-3xl font-[1000] uppercase italic tracking-tighter leading-none mb-2 ${value.text}`}>
                {key}
              </h3>
              <p className="text-slate-500 font-bold text-xs md:text-sm leading-snug max-w-[180px] line-clamp-2 md:line-clamp-none">
                {value.desc}
              </p>

              <div className="mt-auto flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full border border-white/50">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {value.subjects.length} Stories
                </span>
                <ChevronRight size={12} className="text-slate-400" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Responsive Modal */}
      <AnimatePresence>
        {selectedTheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTheme(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
              layoutId={`card-${selectedTheme}`}
              className="bg-white w-full max-w-5xl rounded-[2.5rem] md:rounded-[4rem] border-[8px] md:border-[16px] border-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh]"
            >
              {/* Mobile/Desktop Sidebar Header */}
              <div className={`${THEME_DATA[selectedTheme].color} p-8 md:p-12 md:w-2/5 flex flex-col items-center justify-center text-white text-center shrink-0`}>
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/20 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] mb-4 md:mb-6 shadow-inner border-2 border-white/20">
                   {React.cloneElement(THEME_DATA[selectedTheme].icon, { size: 48 })}
                 </motion.div>
                 <h2 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter leading-none mb-2 md:mb-4">
                   {selectedTheme}
                 </h2>
                 <p className="text-sm md:text-base font-bold opacity-90 max-w-xs hidden md:block">
                   {THEME_DATA[selectedTheme].desc}
                 </p>
              </div>

              {/* Story Subjects Grid - Scrollable */}
              <div className="p-6 md:p-12 md:w-3/5 overflow-y-auto bg-[#FDFDFF] flex-1">
                <div className="mb-6 flex items-center justify-between sticky top-0 bg-[#FDFDFF] py-2 z-10">
                    <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Select Your Story</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                      {THEME_DATA[selectedTheme].subjects.length} Found
                    </span>
                </div>
                
                <div className="grid gap-3 md:gap-4">
                  {THEME_DATA[selectedTheme].subjects.map((sub, i) => (
                    <motion.button
                      key={sub}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100 flex items-center justify-between group shadow-sm transition-all text-left"
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center text-slate-300 font-black group-hover:bg-blue-500 group-hover:text-white transition-all text-sm">
                           {i + 1}
                        </div>
                        <span className="text-lg md:text-xl font-[1000] text-slate-800 uppercase italic tracking-tighter leading-tight">
                          {sub}
                        </span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-all shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Close Icon - Accessible on Mobile */}
              <button 
                onClick={() => setSelectedTheme(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-black/10 hover:bg-red-500 text-white md:text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-all z-20"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}