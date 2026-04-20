"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Book, Sparkles, Rocket, Palette, Globe, 
  Heart, Gift, GraduationCap, ArrowRight, Stars,
  Zap, Cloud, Sun, Moon
} from "lucide-react";

const THEME_SUBJECTS = {
  "Educational": { icon: <GraduationCap />, color: "#4CC9F0", subjects: ["Solar System Adventure", "Deep Sea Creatures", "How Tiny Seeds Grow", "The Human Body Secret"] },
  "Fairy Tales": { icon: <Sparkles />, color: "#FF70A6", subjects: ["The Crystal Palace", "A Dragon's First Breath", "The Midnight Ball", "Talking Forest Animals"] },
  "Adventure": { icon: <Rocket />, color: "#70D6FF", subjects: ["Lost in the Candy Clouds", "Desert Island Treasure", "Mountain of Miracles", "The Flying Treehouse"] },
  "Activities": { icon: <Palette />, color: "#FF9770", subjects: ["Grandma's Magic Kitchen", "The Backyard Campout", "Building a Robot Friend", "A Rainy Day Parade"] },
  "Worlds": { icon: <Globe />, color: "#80FFDB", subjects: ["The Underwater Kingdom", "City of Floating Bubbles", "Land of Giant Toys", "The Planet of Sweets"] },
  "Stories": { icon: <Book />, color: "#FFD670", subjects: ["A Letter to the Moon", "The Dog Who Could Talk", "Lost Sock Mystery", "The Library of Magic Books"] },
  "Holidays": { icon: <Gift />, color: "#FFD166", subjects: ["The Christmas Elf's Mistake", "Halloween at Ghost Mansion", "The Diwali Light Mystery", "Eid Celebration Surprise"] },
  "Family": { icon: <Heart />, color: "#FFADAD", subjects: ["A Day with Superhero Dad", "Mom's Magic Garden", "The Big Family Picnic", "Going to Grandpa's Farm"] }
};

export default function ThemesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Educational");

  return (
    <div className="min-h-screen bg-[#FFF9F0] p-6 md:p-12 overflow-hidden relative">
      
      {/* ☁️ FLOATING CLOUD BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ x: [-20, 20, -20] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-10 left-[5%] text-blue-100"><Cloud size={180} fill="currentColor" /></motion.div>
        <motion.div animate={{ x: [20, -20, 20] }} transition={{ duration: 12, repeat: Infinity }} className="absolute top-[40%] right-[2%] text-pink-100"><Cloud size={150} fill="currentColor" /></motion.div>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-10 left-[15%] text-yellow-100"><Sun size={120} fill="currentColor" /></motion.div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* 👋 FRIENDLY HEADER */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-lg mb-6 text-pink-500 font-bold"
          >
            <Stars size={20} /> Let's Pick an Adventure!
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-[#4A4E69] tracking-tight leading-none">
            Where to <span className="text-pink-400 italic">Go?</span>
          </h1>
        </header>

        {/* 🎀 CATEGORY BUBBLES */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {Object.keys(THEME_SUBJECTS).map((category) => {
            const active = selectedCategory === category;
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedCategory(category)}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-full font-black transition-all
                  ${active 
                    ? "bg-white text-[#4A4E69] shadow-[0_10px_0_#fec5bb] -translate-y-2" 
                    : "bg-[#fec5bb]/20 text-[#4A4E69]/60 hover:bg-white"
                  }
                `}
              >
                <span style={{ color: active ? THEME_SUBJECTS[category].color : 'inherit' }}>
                    {THEME_SUBJECTS[category].icon}
                </span>
                {category}
              </motion.button>
            );
          })}
        </div>

        {/* 🍭 THE STORY CANDY GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 px-4"
          >
            {THEME_SUBJECTS[selectedCategory].subjects.map((subject, idx) => (
              <motion.div
                key={subject}
                whileHover={{ y: -12, rotate: idx % 2 === 0 ? 2 : -2 }}
                className="relative cursor-pointer group"
                onClick={() => router.push(`/story?theme=${selectedCategory}&subject=${subject}`)}
              >
                {/* Bouncy Shadow */}
                <div className="absolute inset-0 bg-black/5 rounded-[3rem] translate-y-4 blur-xl group-hover:opacity-0 transition-opacity" />
                
                <div 
                    className="relative bg-white p-10 rounded-[3.5rem] border-[8px] flex flex-col justify-between min-h-[300px] transition-all"
                    style={{ borderColor: THEME_SUBJECTS[selectedCategory].color + '33' }} // 20% opacity border
                >
                  <div className="flex justify-between items-start">
                    <div 
                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg rotate-[-10deg] group-hover:rotate-0 transition-transform"
                        style={{ backgroundColor: THEME_SUBJECTS[selectedCategory].color }}
                    >
                      {THEME_SUBJECTS[selectedCategory].icon}
                    </div>
                    <div className="flex gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <Stars size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-black text-yellow-600">NEW</span>
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-[#4A4E69] leading-tight">
                    {subject}
                  </h3>

                  <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                    <div className="h-12 w-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                        <ArrowRight />
                    </div>
                    <span className="font-black text-slate-400 text-sm uppercase tracking-widest">Start Magic</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 🎈 FLOATING FOOTER BUTTON */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
        >
          <button 
            onClick={() => router.push("/story")}
            className="px-12 py-6 bg-[#4A4E69] text-white rounded-full font-black text-2xl shadow-[0_15px_30px_rgba(74,78,105,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center gap-4"
          >
            I'll Choose My Own! <Rocket />
          </button>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&display=swap');
        body {
          font-family: 'Fredoka', sans-serif;
        }
      `}</style>
    </div>
  );
}