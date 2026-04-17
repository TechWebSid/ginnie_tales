"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Book, Sparkles, Rocket, Palette, Globe, 
  Heart, Gift, GraduationCap, ArrowRight, Stars 
} from "lucide-react";

const THEME_SUBJECTS = {
  "Educational": { icon: <GraduationCap />, color: "bg-[#118AB2]", subjects: ["Solar System Adventure", "Deep Sea Creatures", "How Tiny Seeds Grow", "The Human Body Secret"] },
  "Fairy Tales": { icon: <Sparkles />, color: "bg-[#EF476F]", subjects: ["The Crystal Palace", "A Dragon's First Breath", "The Midnight Ball", "Talking Forest Animals"] },
  "Adventure": { icon: <Rocket />, color: "bg-[#073B4C]", subjects: ["Lost in the Candy Clouds", "Desert Island Treasure", "Mountain of Miracles", "The Flying Treehouse"] },
  "Activities": { icon: <Palette />, color: "bg-[#06D6A0]", subjects: ["Grandma's Magic Kitchen", "The Backyard Campout", "Building a Robot Friend", "A Rainy Day Parade"] },
  "Worlds": { icon: <Globe />, color: "bg-[#4CC9F0]", subjects: ["The Underwater Kingdom", "City of Floating Bubbles", "Land of Giant Toys", "The Planet of Sweets"] },
  "Stories": { icon: <Book />, color: "bg-[#FFD166]", subjects: ["A Letter to the Moon", "The Dog Who Could Talk", "Lost Sock Mystery", "The Library of Magic Books"] },
  "Holidays": { icon: <Gift />, color: "bg-[#FF9F1C]", subjects: ["The Christmas Elf's Mistake", "Halloween at Ghost Mansion", "The Diwali Light Mystery", "Eid Celebration Surprise"] },
  "Family": { icon: <Heart />, color: "bg-[#FF4D6D]", subjects: ["A Day with Superhero Dad", "Mom's Magic Garden", "The Big Family Picnic", "Going to Grandpa's Farm"] }
};

export default function ThemesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Educational");

  return (
    <div className="min-h-screen bg-[#FEF9EF] p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#FFD166] rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], x: [0, 100, 0] }} 
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#06D6A0] rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 text-[#EF476F] font-black uppercase tracking-[0.3em] text-sm mb-4"
            >
              <Stars size={20} className="fill-current" /> Choose Your Universe
            </motion.div>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-[1000] text-[#073B4C] leading-[0.9] tracking-tighter uppercase"
            >
              Magical <br /> <span className="text-[#06D6A0]">Themes</span>
            </motion.h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/story")}
            className="group px-8 py-6 bg-[#073B4C] text-white rounded-[2rem] font-black uppercase text-xl shadow-[8px_8px_0px_#EF476F] flex items-center gap-4 hover:bg-[#EF476F] hover:shadow-[8px_8px_0px_#073B4C] transition-all"
          >
            Build Your Story <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-4 flex flex-col gap-3">
            {Object.keys(THEME_SUBJECTS).map((category, idx) => (
              <motion.button
                key={category}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center justify-between p-5 rounded-2xl border-4 transition-all ${
                  selectedCategory === category 
                  ? "bg-white border-[#073B4C] shadow-[6px_6px_0px_#073B4C] -translate-y-1" 
                  : "bg-transparent border-transparent hover:bg-white/50 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`p-3 rounded-xl ${selectedCategory === category ? THEME_SUBJECTS[category].color + ' text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {THEME_SUBJECTS[category].icon}
                  </span>
                  <span className="font-black uppercase tracking-tight text-lg">{category}</span>
                </div>
                {selectedCategory === category && <div className="w-2 h-2 rounded-full bg-[#EF476F]" />}
              </motion.button>
            ))}
          </nav>

          {/* Subjects Grid */}
          <main className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {THEME_SUBJECTS[selectedCategory].subjects.map((subject, idx) => (
                  <motion.div
                    key={subject}
                    whileHover={{ y: -10 }}
                    className="group bg-white p-8 rounded-[2.5rem] border-4 border-[#073B4C] shadow-[10px_10px_0px_#073B4C] relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      {THEME_SUBJECTS[selectedCategory].icon}
                    </div>
                    
                    <h3 className="text-3xl font-[1000] text-[#073B4C] uppercase leading-tight relative z-10">
                      {subject}
                    </h3>
                    
                    <button 
                      onClick={() => router.push(`/story?theme=${selectedCategory}&subject=${subject}`)}
                      className="mt-6 flex items-center gap-2 font-black uppercase text-sm text-[#EF476F] group-hover:gap-4 transition-all"
                    >
                      Write this tale <ArrowRight size={18} />
                    </button>

                    <div className={`absolute bottom-0 left-0 h-2 w-0 group-hover:w-full transition-all duration-500 ${THEME_SUBJECTS[selectedCategory].color}`} />
                  </motion.div>
                ))}
                
                {/* Decorative Tile */}
                <div className="hidden md:flex bg-[#FFD166]/20 rounded-[2.5rem] border-4 border-dashed border-[#073B4C]/20 items-center justify-center p-8 text-center">
                  <p className="font-bold text-[#073B4C]/40 italic uppercase text-sm tracking-widest">
                    More {selectedCategory} tales <br /> being brewed in the teapot...
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}