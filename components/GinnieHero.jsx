"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Wand2, Star, Rocket, Crown, Camera, 
  Palette, Heart, Sparkles, Gift, Zap 
} from "lucide-react";

const GinnieHero = () => {
  const containerRef = useRef(null);
  const leftCurtain = useRef(null);
  const rightCurtain = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Curtain Opening (Increased speed for snappier feel)
      tl.to(leftCurtain.current, { xPercent: -105, duration: 1, ease: "expo.inOut", delay: 0.2 })
        .to(rightCurtain.current, { xPercent: 105, duration: 1, ease: "expo.inOut" }, "<")
        
        // 2. Entrance
        .from(".reveal-text", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, "-=0.3")
        .from(".genie-main", { scale: 0.9, opacity: 0, duration: 1, ease: "back.out(1.5)" }, "-=0.7")
        .from(".sticker-float", { scale: 0, opacity: 0, stagger: 0.05, duration: 0.4, ease: "back.out(2)" }, "-=0.5");

      // 3. Floating loops
      gsap.to(".genie-bounce", { y: -15, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      
      document.querySelectorAll(".sticker-float").forEach((el, i) => {
        gsap.to(el, {
          y: "random(-12, 12)",
          rotation: "random(-8, 8)",
          duration: `random(2.5, 4)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[110vh] lg:min-h-screen w-full bg-[#F8FAFF] overflow-hidden flex flex-col">
      
      {/* 🎭 THEATER CURTAINS */}
      <div ref={leftCurtain} className="absolute inset-y-0 left-0 w-1/2 bg-[#FF477E] z-[100] border-r-4 border-[#D4145A] shadow-2xl" />
      <div ref={rightCurtain} className="absolute inset-y-0 right-0 w-1/2 bg-[#FF477E] z-[100] border-l-4 border-[#D4145A] shadow-2xl" />

      {/* 🌌 CONTENT CONTAINER - Increased top padding to avoid header overlap */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl mx-auto px-6 pt-32 pb-48 lg:pt-0 lg:pb-0 lg:flex-1 items-center gap-12">
        
        {/* --- LEFT SIDE: THE STAGE --- */}
        <div className="relative flex items-center justify-center min-h-[350px]">
          {/* Background Glow */}
          <div className="absolute w-[70%] h-[70%] bg-indigo-200/40 blur-[100px] rounded-full" />
          
          <div className="relative genie-main w-full max-w-[380px]">
            <img src="/genie.png" alt="Genie" className="genie-bounce w-full h-auto drop-shadow-2xl z-20 relative" />
            
            {/* Speech Bubble - Placed specifically to never hit face */}
            <div className="absolute -top-12 -right-8 bg-white px-5 py-2 rounded-2xl rounded-bl-none shadow-lg border-2 border-slate-100 rotate-12 hidden md:block z-30">
              <p className="text-xs font-black text-indigo-600 uppercase italic">Wanna play? ✨</p>
            </div>
          </div>

          {/* Fleeing Elements - Adjusted positions to clear the Genie & Text */}
          <Sticker Icon={Rocket} color="bg-orange-400" pos="top-0 -left-5" />
          <Sticker Icon={Camera} color="bg-blue-400" pos="-top-10 right-10" />
          <Sticker Icon={Heart} color="bg-pink-400" pos="bottom-10 -left-10" />
          <Sticker Icon={Star} color="bg-yellow-400" pos="bottom-0 right-20" />
          <Sticker Icon={Palette} color="bg-purple-400" pos="top-1/3 -left-16" />
          <Sticker Icon={Crown} color="bg-yellow-500" pos="top-1/2 -right-10" />
        </div>

        {/* --- RIGHT SIDE: THE CONTENT --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          
          <div className="space-y-0">
            <h2 className="reveal-text text-2xl md:text-3xl font-black text-slate-300 italic uppercase tracking-tighter">Ready to</h2>
            <h1 className="reveal-text text-6xl md:text-8xl lg:text-[9rem] font-[1000] italic uppercase leading-[0.8] tracking-tighter">
              <span className="text-slate-900 block">Make</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">Magic?</span>
            </h1>
          </div>

          <p className="reveal-text text-lg md:text-xl font-bold text-slate-600 max-w-md leading-tight">
            The magical app where <span className="text-pink-500 underline decoration-wavy underline-offset-4 decoration-pink-200">your face</span> turns into a storybook hero! 🚀
          </p>

          {/* CTA & TRUST BADGES */}
          <div className="reveal-text flex flex-col items-center lg:items-start gap-8 w-full">
            <button className="group relative px-10 py-5 bg-[#FF477E] rounded-[2rem] text-white font-black text-xl md:text-2xl tracking-widest shadow-[0_10px_0_#D4145A] hover:translate-y-[2px] active:translate-y-[8px] transition-all flex items-center gap-3 border-4 border-white/20">
              <Wand2 className="w-6 h-6" />
              START STORY
            </button>

            {/* TRUST BADGES - Set to relative z-50 and moved up with mt-4 */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 relative z-50 mb-9">
              {[
                { icon: "🛡️", text: "100% Kid Safe" },
                { icon: "✨", text: "AI Magic" },
                { icon: "🎨", text: "Unlimited Tales" }
              ].map((item, i) => (
                <span key={i} className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border-2 border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-md">
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🌥️ DECORATIVE CURVE - Lowered height and added transition */}
      <div className="absolute bottom-[-10px] left-0 w-full h-32 md:h-44 bg-white rounded-[100%_100%_0_0] shadow-[0_-15px_40px_rgba(0,0,0,0.04)] z-40 pointer-events-none" />
    </div>
  );
};

const Sticker = ({ Icon, color, pos }) => (
  <div className={`sticker-float absolute ${pos} z-30 p-3 ${color} rounded-2xl shadow-lg border-4 border-white text-white hidden sm:block`}>
    <Icon className="w-6 h-6" />
  </div>
);

export default GinnieHero;