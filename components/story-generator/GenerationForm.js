import { motion } from "framer-motion";
import { Wand2, Camera, Sparkles, Palette, User, Baby, Layout } from "lucide-react";
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-10">
      <div className="space-y-6 text-center lg:text-left">
        <motion.div animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-24 h-24 bg-[#FFD166] rounded-[2rem] flex items-center justify-center mx-auto lg:mx-0 shadow-[6px_6px_0px_#EE964B] border-4 border-white">
          <Wand2 className="text-white w-12 h-12" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-5xl lg:text-7xl font-[1000] text-[#073B4C] leading-[0.9] tracking-tighter">CREATE YOUR <br /> <span className="text-[#EF476F]">LEGEND!</span></h2>
          <p className="text-[#118AB2] font-black text-lg bg-white/60 p-4 rounded-2xl border-2 border-[#118AB2]/10 inline-block">Personalize every detail of your tale! 🚀</p>
        </div>
      </div>

      <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
        <div className="relative bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_#118AB2] border-4 border-[#073B4C] overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-[60] bg-[#FFD166] flex flex-col items-center justify-center p-6 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Palette className="w-16 h-16 text-[#EF476F]" /></motion.div>
              <h3 className="text-2xl font-[1000] text-[#073B4C] mt-4">{loadingStage}</h3>
              <div className="w-full bg-white/50 h-4 rounded-full mt-6 border-2 border-[#073B4C] overflow-hidden">
                <motion.div className="h-full bg-[#EF476F]" style={{ width: `${(progress / 2) * 100}%` }} />
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#073B4C] uppercase ml-1 flex items-center gap-1"><User size={10} /> Kid's Name</label>
                <input name="kidName" required placeholder="E.g. Aryan" className="w-full p-3 rounded-xl bg-[#F1FAEE] border-2 border-transparent focus:border-[#EF476F] outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#073B4C] uppercase ml-1 flex items-center gap-1"><Baby size={10} /> Age Group</label>
                <select name="ageGroup" className="w-full p-3 rounded-xl bg-[#F1FAEE] border-2 border-transparent focus:border-[#EF476F] outline-none font-bold text-sm appearance-none">
                  <option>2-4 Years</option>
                  <option>5-7 Years</option>
                  <option>8-10 Years</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#073B4C] uppercase ml-1 flex items-center gap-1"><Layout size={10} /> Theme</label>
                <select name="theme" onChange={(e) => setSelectedTheme(e.target.value)} className="w-full p-3 rounded-xl bg-[#F1FAEE] border-2 border-transparent focus:border-[#EF476F] outline-none font-bold text-sm">
                  {Object.keys(THEME_SUBJECTS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#073B4C] uppercase ml-1 flex items-center gap-1"><Sparkles size={10} /> Subject</label>
                <select name="subject" className="w-full p-3 rounded-xl bg-[#F1FAEE] border-2 border-transparent focus:border-[#EF476F] outline-none font-bold text-sm">
                  {THEME_SUBJECTS[selectedTheme].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#073B4C] uppercase ml-1 flex items-center gap-1"><Palette size={10} /> Illustration Style</label>
              <div className="grid grid-cols-4 gap-2">
                {["Ghibli", "watercolor", "sticker art", "soft anime"].map((s) => (
                  <label key={s} className="cursor-pointer">
                    <input type="radio" name="style" value={s} defaultChecked={s === "Ghibli"} className="hidden peer" />
                    <div className="p-2 text-[9px] text-center font-black border-2 border-[#F1FAEE] rounded-lg peer-checked:border-[#EF476F] peer-checked:bg-[#EF476F]/10 uppercase transition-all">
                      {s}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-black text-[#073B4C] uppercase ml-1 flex items-center gap-1"><Camera size={10} /> Upload Photo</label>
               <label className="block cursor-pointer">
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                  <div className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden ${preview ? 'border-[#EF476F]' : 'border-[#118AB2]/30 bg-[#F1FAEE]'}`}>
                    {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Camera size={20} className="text-[#118AB2]" />}
                  </div>
               </label>
            </div>

            <button disabled={!preview || loading} className="w-full py-4 bg-[#EF476F] text-white font-[1000] rounded-xl shadow-[4px_4px_0px_#C9184A] text-lg uppercase border-2 border-white disabled:opacity-50 transition-all active:translate-y-1 active:shadow-none">
              MAKE MAGIC!
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}