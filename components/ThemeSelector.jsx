"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Book, Rocket, Heart, 
  Palette, Globe, Coffee, GraduationCap,
  ChevronRight, Star, Wand2
} from "lucide-react";

const THEME_DATA = {
  "Educational": { icon: <GraduationCap />, color: "bg-amber-400", border: "border-amber-500", subjects: ["Solar System Adventure", "Deep Sea Creatures", "How Tiny Seeds Grow", "The Human Body Secret", "Numbers in the Jungle", "History of Dinosaurs"] },
  "Fairy Tales": { icon: <Wand2 />, color: "bg-pink-400", border: "border-pink-500", subjects: ["The Crystal Palace", "A Dragon's First Breath", "The Midnight Ball", "Talking Forest Animals", "Secret of the Moon Fairy"] },
  "Adventure": { icon: <Rocket />, color: "bg-indigo-500", border: "border-indigo-600", subjects: ["Lost in the Candy Clouds", "Desert Island Treasure", "Mountain of Miracles", "The Flying Treehouse", "Mission to Mars"] },
  "Activities": { icon: <Palette />, color: "bg-orange-400", border: "border-orange-500", subjects: ["Grandma's Magic Kitchen", "The Backyard Campout", "Building a Robot Friend", "A Rainy Day Parade"] },
  "Worlds": { icon: <Globe />, color: "bg-emerald-400", border: "border-emerald-500", subjects: ["The Underwater Kingdom", "City of Floating Bubbles", "Land of Giant Toys", "The Planet of Sweets"] },
  "Family": { icon: <Heart />, color: "bg-rose-400", border: "border-rose-500", subjects: ["A Day with Superhero Dad", "Mom's Magic Garden", "The Big Family Picnic", "Going to Grandpa's Farm"] },
};

export default function ThemeSelector() {
  const [activeCat, setActiveCat] = useState("Educational");
  const [hoveredSubject, setHoveredSubject] = useState(null);

  return (
    <section className="relative min-h-screen py-24 px-4 bg-[#FFF9FE] overflow-hidden">
      
      {/* 🌌 Background Magic Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-pink-100 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Text */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-8xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none mb-6"
          >
            Pick Your <br/>
            <span className="text-pink-500 drop-shadow-[0_5px_0_#db2777]">Magic Door</span>
          </motion.h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Where will we go today?</p>
        </div>

        {/* 🏷️ CATEGORY TABS (Scrollable on mobile) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.entries(THEME_DATA).map(([name, data]) => (
            <motion.button
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCat(name)}
              className={`
                flex items-center gap-2 px-6 py-4 rounded-3xl font-black text-sm uppercase tracking-wider transition-all border-b-4
                ${activeCat === name 
                  ? `${data.color} text-white ${data.border.replace('border-', 'border-b-')} shadow-lg` 
                  : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"}
              `}
            >
              {React.cloneElement(data.icon, { size: 20 })}
              {name}
            </motion.button>
          ))}
        </div>

        {/* 🃏 SUBJECTS DISPLAY AREA */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {THEME_DATA[activeCat].subjects.map((subject, idx) => (
                <ThemeCard 
                  key={subject} 
                  title={subject} 
                  color={THEME_DATA[activeCat].color} 
                  index={idx}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 🎲 Surprise Footer */}
        <div className="mt-20 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.9 }}
            className="px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center gap-4 shadow-[0_10px_0_#000] active:translate-y-2 active:shadow-none transition-all"
          >
            RANDOM ADVENTURE 🎲
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function ThemeCard({ title, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10, rotate: index % 2 === 0 ? 1 : -1 }}
      className="group cursor-pointer"
    >
      <div className={`relative p-8 h-48 bg-white rounded-[2.5rem] border-4 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden transition-all group-hover:border-pink-300`}>
        
        {/* Background Accent */}
        <div className={`absolute -right-8 -top-8 w-24 h-24 ${color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`} />
        
        <div className="relative z-10">
          <div className={`w-12 h-12 ${color} rounded-2xl mb-4 flex items-center justify-center text-white shadow-lg`}>
            <Sparkles size={24} />
          </div>
          <h4 className="text-xl font-[1000] text-slate-800 leading-tight">
            {title}
          </h4>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1">
             {[...Array(3)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
          </div>
          <motion.div 
            whileHover={{ x: 5 }}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}