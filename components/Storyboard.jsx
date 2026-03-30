"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Wand2, BookOpen, Star, Sparkles, ArrowDown } from "lucide-react";

const steps = [
  {
    title: "Snap a Selfie",
    desc: "Just a regular photo! Our magic works best with a clear, happy smile and good lighting.",
    icon: <Camera size={40} className="text-blue-500" />,
    color: "border-blue-100",
    badge: "bg-blue-500",
    img: "📸",
    rotate: "-1deg"
  },
  {
    title: "AI Magic Sparkles",
    desc: "Our Genie transforms the photo into a 3D Pixar-style masterpiece in seconds.",
    icon: <Wand2 size={40} className="text-pink-500" />,
    color: "border-pink-100",
    badge: "bg-pink-500",
    img: "✨",
    rotate: "1.5deg"
  },
  {
    title: "Your Story is Ready",
    desc: "Your child is now the hero of their own high-quality adventure book. Ready to read!",
    icon: <BookOpen size={40} className="text-purple-500" />,
    color: "border-purple-100",
    badge: "bg-purple-500",
    img: "📖",
    rotate: "-0.5deg"
  }
];

export default function Storyboard() {
  return (
    <section className="py-32 px-6 bg-[#FDFDFF] relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Area */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 border-2 border-slate-100 mb-6"
          >
            <Sparkles size={14} className="text-yellow-500" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">3 Easy Steps</span>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-[1000] tracking-tighter italic uppercase leading-[0.85] text-slate-800">
            How it <span className="text-blue-500">Works</span>
          </h2>
        </div>

        {/* Vertical Stacking Cards */}
        <div className="space-y-40">
          {steps.map((step, i) => (
            <div key={i} className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px" }}
                style={{ rotate: step.rotate }}
                className={`
                  relative bg-white p-8 md:p-16 rounded-[4rem] 
                  border-[12px] border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]
                  flex flex-col md:flex-row items-center gap-12
                  hover:scale-[1.02] transition-transform duration-500
                `}
              >
                {/* Step Badge */}
                <div className={`absolute -top-6 -left-6 w-16 h-16 ${step.badge} rounded-2xl flex items-center justify-center text-white font-[1000] text-2xl shadow-xl rotate-[-10deg] border-4 border-white`}>
                  {i + 1}
                </div>

                {/* Left: 3D-ish Icon Box */}
                <div className="w-48 h-48 bg-slate-50 rounded-[3rem] flex items-center justify-center shrink-0 border-4 border-white shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-200/50" />
                  <div className="relative z-10 scale-[1.5]">
                    {step.icon}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="text-center md:text-left">
                  <h3 className="text-4xl md:text-6xl font-[1000] tracking-tighter uppercase italic text-slate-800 mb-4 leading-none">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 font-bold text-lg md:text-xl leading-relaxed max-w-md">
                    {step.desc}
                  </p>
                  
                  {/* Decorative Stars */}
                  <div className="mt-8 flex gap-1 justify-center md:justify-start">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* "Paper" Detail */}
                <div className="absolute top-10 right-10 opacity-[0.05] text-9xl font-black select-none">
                    {step.img}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-40 text-center">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-16 py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl tracking-[0.15em] shadow-[0_12px_0_#475569] hover:shadow-[0_15px_0_#475569] hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all uppercase italic"
          >
            Create Your Magic 🪄
          </motion.button>
        </div>
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-24 h-48 bg-blue-500/5 rounded-r-full blur-2xl" />
      <div className="absolute bottom-1/4 right-0 w-24 h-48 bg-pink-500/5 rounded-l-full blur-2xl" />
    </section>
  );
}