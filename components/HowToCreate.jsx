"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Sparkles, Upload, Wand2, BookOpen, Star, MousePointer2, Palette, Sparkle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Name Your Hero",
    desc: "Every legend starts with a name. Tell us who the brave adventurer is! This personalizes the entire story experience.",
    icon: <Star size={40} />,
    color: "bg-orange-500",
    shadow: "shadow-orange-200",
    img: "🏷️",
    rotate: "-2deg"
  },
  {
    title: "Choose the Vibe",
    desc: "Select a theme like 'Educational' or 'Candy Clouds'. Our AI adapts the vocabulary to fit the mood.",
    icon: <BookOpen size={40} />,
    color: "bg-purple-500",
    shadow: "shadow-purple-200",
    img: "🍭",
    rotate: "2deg"
  },
  {
    title: "Select Art Style",
    desc: "From Ghibli-inspired dreams to playful Sticker Art. Pick the visual magic that sparks their imagination.",
    icon: <Palette size={40} />,
    color: "bg-teal-500",
    shadow: "shadow-teal-200",
    img: "🎨",
    rotate: "-1.5deg"
  },
  {
    title: "The Magic Mirror",
    desc: "Upload a clear photo, and our Genie morphs your child directly into every illustration in the book!",
    icon: <Upload size={40} />,
    color: "bg-rose-500",
    shadow: "shadow-rose-200",
    img: "📸",
    rotate: "1deg"
  }
];

export default function HowToCreate() {
  const stepsRef = useRef([]);

  useEffect(() => {
    // Reveal Header Elements
    gsap.from(".reveal-text", {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out"
    });

    // Step Cards Animation
    stepsRef.current.forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 100, rotate: i % 2 === 0 ? -10 : 10 },
        {
          opacity: 1,
          y: 0,
          rotate: steps[i].rotate,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          }
        }
      );
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-[#FDFDFF] overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - High Contrast Brutalist Style */}
        <div className="text-center mb-32">
          <div className="reveal-text inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 border-2 border-slate-100 mb-8">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Creation Guide</span>
          </div>
          <h2 className="reveal-text text-6xl md:text-9xl font-[1000] tracking-tighter italic uppercase leading-[0.8] text-slate-900 mb-8">
            How to make <br/>
            <span className="text-blue-600">Magic</span>
          </h2>
          <p className="reveal-text max-w-xl mx-auto text-slate-500 font-bold text-xl leading-tight">
            The secret recipe behind every Genie Tale. <br/>
            <span className="text-slate-300">Takes less than 120 seconds.</span>
          </p>
        </div>

        {/* Vertical Stacking Cards with Side-Offset */}
        <div className="relative space-y-24">
          {/* Background Path (Visual Guide) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2 hidden md:block" />

          {steps.map((step, i) => (
            <div 
              key={i} 
              ref={el => stepsRef.current[i] = el}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 relative z-10`}
            >
              {/* Card Container */}
              <div className={`
                w-full md:w-[60%] bg-white p-8 md:p-12 rounded-[3.5rem] 
                border-[10px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]
                relative hover:scale-[1.03] transition-transform duration-500
              `}>
                {/* Large Floating Emoji Background */}
                <div className="absolute -top-10 -right-6 md:right-10 opacity-10 text-9xl font-black select-none pointer-events-none">
                    {step.img}
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  {/* Icon Box */}
                  <div className={`w-24 h-24 shrink-0 ${step.color} rounded-3xl flex items-center justify-center text-white shadow-2xl ${step.shadow} rotate-[-5deg]`}>
                    {step.icon}
                  </div>

                  <div>
                    <div className="text-blue-500 font-black text-xs uppercase tracking-widest mb-2">Step 0{i + 1}</div>
                    <h3 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase italic text-slate-800 mb-4 leading-none">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 font-bold text-lg leading-snug max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Corner Decoration */}
                <Sparkle size={24} className="absolute bottom-8 right-8 text-slate-100" />
              </div>

              {/* Connector Dot for Desktop */}
              <div className="hidden md:flex w-12 h-12 rounded-full bg-white border-8 border-slate-100 shrink-0 z-20 shadow-sm" />
              
              {/* Spacer for zig-zag */}
              <div className="hidden md:block w-[30%]" />
            </div>
          ))}
        </div>

        {/* Big Bold CTA Footer */}
        <div className="mt-48 text-center relative">
           {/* Decorative Blobs */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-[100px] -z-10" />
           
           <button className="
            group relative px-12 py-10 bg-slate-900 text-white rounded-[3rem] 
            font-[1000] text-3xl tracking-tighter uppercase italic
            shadow-[0_15px_0_#000] hover:shadow-[0_18px_0_#000] 
            hover:-translate-y-2 active:translate-y-2 active:shadow-none 
            transition-all flex flex-col items-center gap-2 mx-auto
           ">
            <span className="flex items-center gap-4">
              <Wand2 size={32} className="group-hover:rotate-12 transition-transform text-pink-400" />
              Create Your Magic
            </span>
            <span className="text-xs font-black tracking-[0.3em] text-slate-500 opacity-80 group-hover:text-pink-400">
              It's storytime!
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}