"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wand2, Camera, Sparkles, Palette, User, 
  Baby, Layout, CheckCircle2, X 
} from "lucide-react";
import { useState } from "react";

const THEME_SUBJECTS = {
  "Educational": ["Solar System Adventure", "Deep Sea Creatures", "How Tiny Seeds Grow", "The Human Body Secret", "Numbers in the Jungle", "History of Dinosaurs", "Rainforest Wonders"],
  "Fairy Tales": ["The Crystal Palace", "A Dragon's First Breath", "The Midnight Ball", "Talking Forest Animals", "Secret of the Moon Fairy", "The Gingerbread House", "The Brave Little Knight"],
  "Adventure": ["Lost in the Candy Clouds", "Desert Island Treasure", "Mountain of Miracles", "The Flying Treehouse", "Mission to Mars", "Deep Cave Discovery", "The Time Machine Trip"],
  "Activities": ["Grandma's Magic Kitchen", "The Backyard Campout", "Building a Robot Friend", "A Rainy Day Parade", "Painting the Rainbow", "The Secret Treehouse Club", "My First Soccer Match"],
  "Worlds": ["The Underwater Kingdom", "City of Floating Bubbles", "Land of Giant Toys", "The Planet of Sweets", "Hidden Jungle Temple", "Cloud Castle Journey", "The Ice Cream Village"],
  "Stories": ["A Letter to the Moon", "The Dog Who Could Talk", "Lost Sock Mystery", "The Library of Magic Books", "My Robot's Birthday", "The Cat Who Was a King", "The Tree That Grew Gold"],
  "Holidays": ["The Christmas Elf's Mistake", "Halloween at Ghost Mansion", "The Diwali Light Mystery", "Eid Celebration Surprise", "Easter Egg Hunt Adventure", "New Year's Eve Wish", "The Summer Camp Story"],
  "Family": ["A Day with Superhero Dad", "Mom's Magic Garden", "The Big Family Picnic", "Going to Grandpa's Farm", "My Little Brother is an Alien", "Visiting the Big City", "Family Road Trip Fun"]
};

export default function GenerationForm({ 
  onSubmit, handleFileChange, preview, loading, loadingStage, progress, setPreview 
}) {
  const [selectedTheme, setSelectedTheme] = useState("Adventure");

  // Helper to clear the selected image
  const clearPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (setPreview) setPreview(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-20 pb-12 lg:pt-44 px-4 md:px-8 max-w-7xl mx-auto"
    >
      {/* --- HERO TEXT SECTION --- */}
      <div className="space-y-4 md:space-y-8 text-center lg:text-left order-1">
        <motion.div 
          animate={{ 
            rotate: [0, 8, -8, 0], 
            y: [0, -10, 0],
          }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          className="w-16 h-16 md:w-28 md:h-28 bg-[#FFD166] rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto lg:mx-0 shadow-[4px_4px_0px_#EE964B] md:shadow-[8px_8px_0px_#EE964B] border-[3px] md:border-[5px] border-white relative"
        >
          <Wand2 className="text-[#073B4C] w-8 h-8 md:w-14 md:h-14" />
          <div className="absolute -top-1 -right-1 bg-[#EF476F] p-1 md:p-2 rounded-full border-2 border-white animate-bounce">
            <Sparkles size={12} className="text-white md:hidden" />
            <Sparkles size={16} className="text-white hidden md:block" />
          </div>
        </motion.div>
        
        <div className="space-y-2 md:space-y-6">
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-[1000] text-[#073B4C] leading-[1] lg:leading-[0.85] tracking-tighter uppercase">
            CREATE YOUR <br /> 
            <span className="text-[#EF476F] drop-shadow-[2px_2px_0px_rgba(239,71,111,0.2)]">LEGEND!</span>
          </h2>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-6 md:py-3 rounded-xl border-[2px] border-[#118AB2]/20 shadow-sm mt-2">
            <CheckCircle2 className="text-[#06D6A0]" size={14} />
            <p className="text-[#118AB2] font-black text-[10px] sm:text-xs md:text-xl uppercase tracking-tight">
              Personalize every detail! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* --- FORM CARD SECTION --- */}
      <div className="relative w-full max-w-xl mx-auto lg:max-w-none order-2">
        <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] p-5 sm:p-7 md:p-10 shadow-[6px_6px_0px_#118AB2] md:shadow-[12px_12px_0px_#118AB2] border-[3px] md:border-[5px] border-[#073B4C]">
          
          {/* Overlay Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] bg-[#FFD166]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-[1.8rem] md:rounded-[2.8rem]"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="mb-4 p-3 bg-white rounded-full shadow-lg">
                  <Palette className="w-8 h-8 md:w-16 md:h-16 text-[#EF476F]" />
                </motion.div>
                <h3 className="text-xl md:text-3xl font-[1000] text-[#073B4C] uppercase mb-4 tracking-tight">{loadingStage}</h3>
                <div className="w-full max-w-xs bg-[#073B4C]/10 h-4 md:h-6 rounded-full border-[2.5px] border-[#073B4C] overflow-hidden p-0.5">
                  <motion.div className="h-full bg-[#EF476F] rounded-full" initial={{ width: 0 }} animate={{ width: `${(progress / 2) * 100}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-5 md:space-y-7">
            {/* Input Group: Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase opacity-70 flex items-center gap-2 ml-1">
                  <User size={12} className="text-[#EF476F]" /> Kid's Name
                </label>
                <input name="kidName" required placeholder="E.g. Aryan" className="w-full p-3.5 md:p-4 rounded-xl bg-[#F8F9FA] border-[3px] border-[#F1FAEE] focus:border-[#EF476F] focus:bg-white outline-none font-bold text-sm md:text-base transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase opacity-70 flex items-center gap-2 ml-1">
                  <Baby size={12} className="text-[#EF476F]" /> Age Group
                </label>
                <select name="ageGroup" className="w-full p-3.5 md:p-4 rounded-xl bg-[#F8F9FA] border-[3px] border-[#F1FAEE] focus:border-[#EF476F] outline-none font-bold text-sm md:text-base cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwNzNCNEMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat">
                  <option>2-4 Years</option>
                  <option>5-7 Years</option>
                  <option>8-10 Years</option>
                </select>
              </div>
            </div>

            {/* Input Group: Theme & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase opacity-70 flex items-center gap-2 ml-1">
                  <Layout size={12} className="text-[#118AB2]" /> Theme
                </label>
                <select name="theme" onChange={(e) => setSelectedTheme(e.target.value)} className="w-full p-3.5 md:p-4 rounded-xl bg-[#F8F9FA] border-[3px] border-[#F1FAEE] focus:border-[#118AB2] outline-none font-bold text-sm md:text-base">
                  {Object.keys(THEME_SUBJECTS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase opacity-70 flex items-center gap-2 ml-1">
                  <Sparkles size={12} className="text-[#118AB2]" /> Subject
                </label>
                <select name="subject" className="w-full p-3.5 md:p-4 rounded-xl bg-[#F8F9FA] border-[3px] border-[#F1FAEE] focus:border-[#118AB2] outline-none font-bold text-sm md:text-base">
                  {THEME_SUBJECTS[selectedTheme].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-2.5">
              <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase opacity-70 flex items-center gap-2 ml-1">
                <Palette size={12} className="text-[#06D6A0]" /> Illustration Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Ghibli", "watercolor", "sticker art", "soft anime"].map((s) => (
                  <label key={s} className="group cursor-pointer">
                    <input type="radio" name="style" value={s} defaultChecked={s === "Ghibli"} className="hidden peer" />
                    <div className="py-2.5 px-1 text-[9px] md:text-[10px] text-center font-black border-[3px] border-[#F8F9FA] rounded-xl peer-checked:border-[#06D6A0] peer-checked:bg-[#06D6A0]/10 peer-checked:text-[#06D6A0] uppercase transition-all shadow-sm">
                      {s}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* FIXED UPLOAD SECTION */}
            <div className="space-y-2">
               <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase opacity-70 flex items-center gap-2 ml-1">
                  <Camera size={12} className="text-[#EF476F]" /> Upload Photo
               </label>
               <label className="block group cursor-pointer relative">
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                  
                  <div className={`relative w-full aspect-video md:aspect-[16/10] max-h-48 md:max-h-60 rounded-2xl border-[3px] border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300
                    ${preview 
                      ? 'border-[#EF476F] bg-slate-50 shadow-inner' 
                      : 'border-[#118AB2]/30 bg-[#F8F9FA] hover:border-[#118AB2] hover:bg-[#F1FAEE]'}`}>
                    
                    {preview ? (
                      <>
                        <img 
                          src={preview} 
                          className="w-full h-full object-contain p-1" 
                          alt="Preview" 
                        />
                        <button 
                          onClick={clearPhoto}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[#EF476F] shadow-md border border-pink-100 hover:bg-white hover:scale-110 transition-all z-10"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-[2px] py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[8px] font-black text-white uppercase tracking-widest">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#118AB2]/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                          <Camera size={20} className="text-[#118AB2]" />
                        </div>
                        <p className="text-[10px] md:text-xs font-black text-[#118AB2] uppercase">Tap to Upload</p>
                        <p className="text-[8px] text-slate-400 mt-1">High quality face shots work best!</p>
                      </div>
                    )}
                  </div>
               </label>
            </div>

            <button 
              disabled={!preview || loading} 
              className="w-full py-4 md:py-5 bg-[#EF476F] text-white font-[1000] rounded-2xl shadow-[0_6px_0px_#C9184A] text-base md:text-xl uppercase border-[3px] border-white disabled:opacity-50 disabled:shadow-none disabled:translate-y-[2px] transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_0px_#C9184A] active:translate-y-[4px] active:shadow-none"
            >
              MAKE MAGIC!
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}