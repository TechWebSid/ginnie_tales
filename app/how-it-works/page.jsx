"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  UserCircle2, 
  Sparkles, 
  Camera, 
  Wand2, 
  BookOpen, 
  CheckCircle2,
  ArrowRight,
  Zap
} from "lucide-react";

const Steps = [
  {
    id: "01",
    title: "Identity & Soul",
    desc: "Start by giving your hero a name and choosing their age. This sets the foundation for the magic logic.",
    icon: <UserCircle2 className="w-8 h-8" />,
    color: "from-[#EF476F] to-[#FF9F1C]",
    tag: "Profile Set"
  },
  {
    id: "02",
    title: "Theme & Universe",
    desc: "Pick a theme like 'Educational' or 'Fairy Tales'. Our AI uses this to craft the atmospheric narrative.",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-[#06D6A0] to-[#118AB2]",
    tag: "World Building"
  },
  {
    id: "03",
    title: "The Visual Spark",
    desc: "Upload a photo of your child. Our Genie AI will blend their likeness into the chosen art style.",
    icon: <Camera className="w-8 h-8" />,
    color: "from-[#4CC9F0] to-[#480CA8]",
    tag: "Visual Synthesis"
  },
  {
    id: "04",
    title: "Make Magic!",
    desc: "Hit the button! Watch as our Genie paints 12 unique pages and weaves a personalized story.",
    icon: <Wand2 className="w-8 h-8" />,
    color: "from-[#FFD166] to-[#EF476F]",
    tag: "Generation"
  }
];

export default function AlchemyLab() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FEF9EF] relative overflow-hidden font-sans pb-20">
      {/* Dynamic Background Noise/Gradients */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EF476F] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#06D6A0] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        {/* Hero Branding */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white border-2 border-[#073B4C] rounded-full shadow-[4px_4px_0px_#073B4C] mb-8"
          >
            <Zap size={16} className="text-[#FFD166] fill-[#FFD166]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#073B4C]">Magic Protocol 2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-9xl font-[1000] text-[#073B4C] leading-none tracking-tighter uppercase mb-6"
          >
            The Alchemy <br /> <span className="text-[#EF476F]">Lab</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-500 font-bold max-w-2xl mx-auto leading-tight"
          >
            How we turn a single photo into a 24-page cinematic adventure. Simple for kids, powerful for parents.
          </motion.p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-[#073B4C] rounded-[3rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-5 group-hover:translate-y-5" />
              
              <div className="relative bg-white border-[6px] border-[#073B4C] rounded-[3rem] p-10 h-full flex flex-col justify-between overflow-hidden">
                {/* Background Number */}
                <span className="absolute -right-4 -top-8 text-[12rem] font-black text-slate-50 opacity-[0.03] select-none pointer-events-none">
                  {step.id}
                </span>

                <div>
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} border-4 border-[#073B4C] flex items-center justify-center text-white mb-8 shadow-lg`}>
                    {step.icon}
                  </div>
                  
                  <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-[#073B4C] text-[10px] font-black uppercase tracking-widest mb-4">
                    {step.tag}
                  </div>
                  
                  <h2 className="text-4xl font-[1000] text-[#073B4C] uppercase tracking-tighter mb-4">
                    {step.title}
                  </h2>
                  
                  <p className="text-lg text-slate-500 font-bold leading-snug">
                    {step.desc}
                  </p>
                </div>

                {/* Checklist Footer */}
                <div className="mt-10 pt-8 border-t-2 border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#06D6A0] font-bold text-sm">
                    <CheckCircle2 size={18} /> Step Verified
                  </div>
                  <div className="text-[#073B4C]/20 font-black text-2xl uppercase tracking-tighter">
                    {step.id}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Massive Call to Action */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="mt-32 relative group"
        >
          <div className="absolute inset-0 bg-[#EF476F] rounded-[4rem] translate-y-4" />
          
          <button 
            onClick={() => router.push("/story")}
            className="relative w-full bg-[#073B4C] border-[8px] border-white rounded-[4rem] p-12 md:p-20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group"
          >
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            
            <div className="text-left">
              <h2 className="text-5xl md:text-7xl font-[1000] text-white uppercase tracking-tighter leading-none mb-4">
                Ready to Ignite <br /> the <span className="text-[#06D6A0]">Genie?</span>
              </h2>
              <p className="text-white/60 font-bold text-xl uppercase tracking-[0.2em]">
                Takes only 2 minutes to generate
              </p>
            </div>

            <div className="bg-[#EF476F] p-8 rounded-full border-4 border-white shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <ArrowRight size={48} className="text-white" />
            </div>
          </button>
        </motion.div>

        {/* Quality Guarantees */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "AI Precision", val: "99.9%" },
            { label: "Paper Quality", val: "220 GSM" },
            { label: "Fast Delivery", val: "48 Hours" },
            { label: "Magic Factor", val: "Infinite" }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-[1000] text-[#073B4C] uppercase leading-none">{stat.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}