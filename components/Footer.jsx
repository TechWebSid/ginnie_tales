"use client";
import React from "react";
import { motion } from "framer-motion";
import { Wand2, ArrowUpRight, Sparkles } from "lucide-react";

// Custom SVG components for guaranteed rendering
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-1 2-1 4a8 8 0 0 1-9 8 18 18 0 0 1-10-2c0 1 1 3 4 3 0 1-2 2-3 2 3 1 7 2 12 0a12 12 0 0 0 8-11 8 8 0 0 0 1-2z"></path></svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 pb-4 pt-20 bg-[#FDFDFF]">
      <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] md:rounded-[5rem] overflow-hidden relative">
        
        {/* Animated Background Accents */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="px-8 md:px-20 pt-20 pb-12 relative z-10">
          
          {/* Top Section: Branding & Major CTA */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 border-b border-white/5 pb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] rotate-3 hover:rotate-12 transition-transform duration-500">
                  <Wand2 className="text-white" size={28} />
                </div>
                <span className="text-4xl font-[1000] tracking-tighter text-white uppercase italic">
                  Genie<span className="text-blue-400">Tales</span>
                </span>
              </div>
              <p className="text-slate-400 font-bold max-w-sm text-lg leading-tight">
                Crafting personalized 3D adventures where <span className="text-white">your child is the star.</span>
              </p>
            </div>

            <motion.a
              href="/create"
              whileHover={{ scale: 1.05, rotate: -1.5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-4 bg-white text-slate-900 px-12 py-8 rounded-[2.5rem] font-[1000] text-2xl uppercase italic tracking-tighter shadow-2xl transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="text-blue-500 group-hover:rotate-12 transition-transform" size={24} />
              <span className="relative">Create Your Story</span>
              <ArrowUpRight className="relative group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.a>
          </div>

          {/* Middle Section: Links & Studios Credit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 py-20">
            
            {/* Column 1: Navigation */}
            <div className="space-y-8">
              <h4 className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">Explore</h4>
              <nav className="flex flex-col gap-5">
                <a href="/privacy" className="text-slate-300 font-bold text-xl hover:text-white transition-colors flex items-center gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </a>
                <a href="/terms" className="text-slate-300 font-bold text-xl hover:text-white transition-colors flex items-center gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms & Conditions
                </a>
              </nav>
            </div>

            {/* Column 2: Social Presence */}
            <div className="space-y-8">
              <h4 className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Follow the Magic</h4>
              <div className="flex gap-4">
                {[
                  { icon: <InstagramIcon />, label: "Instagram" },
                  { icon: <TwitterIcon />, label: "Twitter" },
                  { icon: <YoutubeIcon />, label: "YouTube" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -8, backgroundColor: "#1e293b" }}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all"
                    href="#"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Column 3: Studio Credit */}
            <div className="flex flex-col lg:items-end justify-start space-y-6">
               <div className="text-left lg:text-right">
                <span className="block text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Engineering Excellence</span>
                <a 
                  href="https://www.codequarrystudios.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-[2rem] transition-all"
                >
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-black text-blue-500 uppercase tracking-tighter">Crafted By</span>
                    <span className="text-white font-[1000] tracking-tighter text-lg uppercase italic leading-none">
                      Code-Quarry Studios
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-[20deg] transition-transform shadow-lg">
                    <ArrowUpRight size={20} className="text-white" />
                  </div>
                </a>
               </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
              © {currentYear} GenieTales. Digital Storytelling Reimagined.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">System Operational</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Visual Spacer */}
      <div className="h-4" />
    </footer>
  );
}