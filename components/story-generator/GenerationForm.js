import { motion } from "framer-motion";
import { Wand2, Camera, Sparkles, Palette, User, Baby, Layout, CheckCircle2 } from "lucide-react";
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
  onSubmit, handleFileChange, preview, loading, loadingStage, progress 
}) {
  const [selectedTheme, setSelectedTheme] = useState("Adventure");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-28 pb-12 md:pt-32 lg:pt-44 px-2"
    >
      {/* --- HERO TEXT SECTION --- */}
      {/* Changed order-1 so it's on top for mobile, lg:order-1 keeps it left on desktop */}
      <div className="space-y-6 md:space-y-8 text-center lg:text-left order-1 lg:order-1">
        <motion.div 
          animate={{ 
            rotate: [0, 8, -8, 0], 
            y: [0, -10, 0],
          }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          className="w-20 h-20 md:w-28 md:h-28 bg-[#FFD166] rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto lg:mx-0 shadow-[6px_6px_0px_#EE964B] md:shadow-[8px_8px_0px_#EE964B] border-[4px] md:border-[5px] border-white relative"
        >
          <Wand2 className="text-[#073B4C] w-10 h-10 md:w-14 md:h-14" />
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#EF476F] p-1.5 md:p-2 rounded-full border-2 border-white animate-bounce">
            <Sparkles size={16} className="text-white" />
          </div>
        </motion.div>
        
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-[1000] text-[#073B4C] leading-[0.9] tracking-tighter uppercase">
            CREATE YOUR <br /> 
            <span className="text-[#EF476F] drop-shadow-[3px_3px_0px_rgba(239,71,111,0.2)]">LEGEND!</span>
          </h2>
          <div className="inline-flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-[#118AB2]/20 shadow-sm">
            <CheckCircle2 className="text-[#06D6A0]" size={18} />
            <p className="text-[#118AB2] font-black text-sm md:text-xl uppercase tracking-tight">
              Personalize every detail! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* --- FORM CARD SECTION --- */}
      {/* Changed order-2 so it's below text on mobile, lg:order-2 keeps it right on desktop */}
      <div className="relative w-full max-w-xl mx-auto lg:max-w-none order-2 lg:order-2">
        <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-10 shadow-[10px_10px_0px_#118AB2] border-[4px] md:border-[5px] border-[#073B4C] transition-all hover:shadow-[14px_14px_0px_#118AB2]">
          
          {/* Overlay Loading */}
          {loading && (
            <div className="absolute inset-0 z-[60] bg-[#FFD166]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-[1.8rem] md:rounded-[2.5rem]">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="mb-4 p-3 bg-white rounded-full shadow-lg"
              >
                <Palette className="w-10 h-10 md:w-16 md:h-16 text-[#EF476F]" />
              </motion.div>
              <h3 className="text-xl md:text-3xl font-[1000] text-[#073B4C] uppercase tracking-tight mb-4">{loadingStage}</h3>
              <div className="w-full bg-[#073B4C]/10 h-5 rounded-full border-[2px] md:border-[3px] border-[#073B4C] overflow-hidden p-0.5">
                <motion.div 
                  className="h-full bg-[#EF476F] rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress / 2) * 100}%` }} 
                />
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase ml-1 flex items-center gap-2 opacity-70">
                  <User size={12} className="text-[#EF476F]" /> Kid's Name
                </label>
                <input 
                  name="kidName" 
                  required 
                  placeholder="E.g. Aryan" 
                  className="w-full p-3 md:p-4 rounded-xl bg-[#F8F9FA] border-[2px] md:border-[3px] border-[#F1FAEE] focus:border-[#EF476F] focus:bg-white outline-none font-bold text-sm md:text-base transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase ml-1 flex items-center gap-2 opacity-70">
                  <Baby size={12} className="text-[#EF476F]" /> Age Group
                </label>
                <div className="relative">
                   <select name="ageGroup" className="w-full p-3 md:p-4 rounded-xl bg-[#F8F9FA] border-[2px] md:border-[3px] border-[#F1FAEE] focus:border-[#EF476F] outline-none font-bold text-sm md:text-base appearance-none cursor-pointer">
                    <option>2-4 Years</option>
                    <option>5-7 Years</option>
                    <option>8-10 Years</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#073B4C] text-[10px]">▼</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase ml-1 flex items-center gap-2 opacity-70">
                  <Layout size={12} className="text-[#118AB2]" /> Theme
                </label>
                <select 
                  name="theme" 
                  onChange={(e) => setSelectedTheme(e.target.value)} 
                  className="w-full p-3 md:p-4 rounded-xl bg-[#F8F9FA] border-[2px] md:border-[3px] border-[#F1FAEE] focus:border-[#118AB2] outline-none font-bold text-sm md:text-base"
                >
                  {Object.keys(THEME_SUBJECTS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase ml-1 flex items-center gap-2 opacity-70">
                  <Sparkles size={12} className="text-[#118AB2]" /> Subject
                </label>
                <select 
                  name="subject" 
                  className="w-full p-3 md:p-4 rounded-xl bg-[#F8F9FA] border-[2px] md:border-[3px] border-[#F1FAEE] focus:border-[#118AB2] outline-none font-bold text-sm md:text-base"
                >
                  {THEME_SUBJECTS[selectedTheme].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase ml-1 flex items-center gap-2 opacity-70">
                <Palette size={12} className="text-[#06D6A0]" /> Illustration Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                {["Ghibli", "watercolor", "sticker art", "soft anime"].map((s) => (
                  <label key={s} className="group cursor-pointer">
                    <input type="radio" name="style" value={s} defaultChecked={s === "Ghibli"} className="hidden peer" />
                    <div className="py-2.5 md:py-3 px-1 text-[9px] md:text-[10px] text-center font-black border-[2px] md:border-[3px] border-[#F8F9FA] rounded-lg md:rounded-xl peer-checked:border-[#06D6A0] peer-checked:bg-[#06D6A0]/10 peer-checked:text-[#06D6A0] uppercase transition-all">
                      {s}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] md:text-xs font-black text-[#073B4C] uppercase ml-1 flex items-center gap-2 opacity-70">
                  <Camera size={12} className="text-[#EF476F]" /> Upload Photo
               </label>
               <label className="block group cursor-pointer">
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                  <div className={`h-24 md:h-32 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${preview ? 'border-[#EF476F]' : 'border-[#118AB2]/30 bg-[#F8F9FA] hover:border-[#118AB2]'}`}>
                    {preview ? (
                      <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center">
                        <Camera size={20} className="text-[#118AB2] mx-auto opacity-40 mb-1" />
                        <p className="text-[8px] md:text-[10px] font-black text-[#118AB2] uppercase">Tap to Upload</p>
                      </div>
                    )}
                  </div>
               </label>
            </div>

            <button 
              disabled={!preview || loading} 
              className="w-full py-4 md:py-5 bg-[#EF476F] text-white font-[1000] rounded-xl md:rounded-2xl shadow-[0_5px_0px_#C9184A] text-base md:text-xl uppercase border-[2px] md:border-[3px] border-white disabled:opacity-50 transition-all hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none"
            >
              MAKE MAGIC!
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}