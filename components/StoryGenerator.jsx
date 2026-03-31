"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wand2, Sparkles, Star, Heart, Zap, Cloud, Rocket, 
  Crown, Gift, Smile, Camera, BookOpen, Palette, 
  ArrowLeft, RefreshCw, Loader2, History 
} from "lucide-react";
import { useRouter } from "next/navigation";

// Firebase & Auth Imports
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; 

import Book from "@/components/Book";

export default function StoryGenerator() {
  const { user } = useAuth();
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState("");

  // --- FILE HANDLING ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Oops! That's not a photo!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("That photo is a bit too big!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- GENERATION & FIREBASE STORAGE ---
  const clientSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !user) return;

    setLoading(true);
    setError(null);
    setOutput(null);
    setLoadingStage("🧠 Analyzing your photo...");

    const formData = new FormData(e.target);
    const storyPrompt = formData.get("storyPrompt");

    try {
      // 1. Call AI API
      const res = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview, storyPrompt }),
      });

      setLoadingStage("✍️ Writing your story...");
      const result = await res.json();

      if (result.success) {
        setLoadingStage("🎨 Saving to your Library...");

        // 2. Prepare Story Data for Firestore
        const storyData = {
          userId: user.uid,
          prompt: storyPrompt,
          pages: result.pages,
          images: result.images,
          createdAt: serverTimestamp(),
          coverImage: result.images[0], // First image as thumbnail
        };

        // 3. Save to Firebase "stories" collection
        await addDoc(collection(db, "stories"), storyData);

        // 4. Update UI
        setOutput({ pages: result.pages, images: result.images });
        setError(null);
      } else {
        setError(result.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      setError("Magic network error. Try again!");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  // --- GSAP CURTAIN ANIMATION ---
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to([leftCurtainRef.current, rightCurtainRef.current], {
      x: (i) => (i === 0 ? "-105%" : "105%"),
      duration: 1.5,
      ease: "expo.inOut",
      delay: 0.5,
    }).to(flashRef.current, { opacity: 0, duration: 0.5 });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F0F4FF] font-sans text-slate-800">
      
      {/* 🌪️ THEATER CURTAINS */}
      <div className="absolute inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-gradient-to-r from-[#FFD93D] to-[#FFED4E] border-r-4 border-yellow-500/20 shadow-2xl" />
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-gradient-to-l from-[#FFD93D] to-[#FFED4E] border-l-4 border-yellow-500/20 shadow-2xl" />
      </div>
      <div ref={flashRef} className="absolute inset-0 z-[110] bg-white pointer-events-none" />

      {/* 🌌 ANIMATED BACKGROUND DECOR */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 360] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
            className="absolute opacity-20"
          >
            {/* Shapes or sparkles could go here */}
          </motion.div>
        ))}
      </div>

      {/* 🧞 NAVIGATION / HEADER */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border-2 border-white cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-inner">
            🧞
          </div>
          <h1 className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
            GinnieTales
          </h1>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/history")}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-b-4 border-slate-200 rounded-2xl font-black text-xs text-slate-600 shadow-lg"
          >
            <History size={16} /> MY STORIES
          </motion.button>

          {output && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setOutput(null); setPreview(null); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-black text-xs shadow-lg"
              >
                <RefreshCw size={16} /> CREATE NEW
              </motion.button>
          )}
        </div>
      </header>

      {/* 🎪 MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        
        <AnimatePresence mode="wait">
          {!output ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto"
            >
              {/* HERO SECTION */}
              <div className="text-center mb-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <img src="/genie.png" alt="Genie" className="w-32 h-auto drop-shadow-xl" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-[1000] text-slate-800 leading-tight">
                    Turn your <span className="text-pink-500 underline decoration-yellow-400">Photo</span> into a 
                    <span className="text-blue-500"> Magic Tale!</span>
                </h2>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white relative">
                
                {/* DECORATIVE STICKERS */}
                <div className="absolute -top-6 -right-6 rotate-12 bg-yellow-400 p-3 rounded-2xl shadow-lg border-4 border-white hidden sm:block">
                    <Crown className="text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 -rotate-12 bg-pink-500 p-3 rounded-2xl shadow-lg border-4 border-white hidden sm:block">
                    <Sparkles className="text-white" />
                </div>

                <form onSubmit={clientSubmit} className="space-y-8">
                  {error && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-500 font-bold">
                      <Smile size={24} className="rotate-180" /> {error}
                    </motion.div>
                  )}

                  {/* 1. UPLOAD BOX */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
                        <Camera size={18} className="text-blue-500" /> 1. Pick a Selfie
                    </label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`
                        border-4 border-dashed rounded-[1.5rem] p-6 transition-all flex flex-col items-center justify-center gap-3
                        ${preview ? 'border-green-400 bg-green-50' : 'border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50'}
                      `}>
                        {preview ? (
                          <div className="relative">
                            <img src={preview} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md" alt="Preview" />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"><Smile size={16}/></div>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                <Palette size={32} />
                            </div>
                            <span className="font-bold text-slate-500">Tap to upload your magic photo</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. PROMPT BOX */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
                        <BookOpen size={18} className="text-purple-500" /> 2. Describe Your Adventure
                    </label>
                    <textarea
                      name="storyPrompt"
                      required
                      placeholder="e.g. A space explorer finding a planet made of candy!"
                      className="w-full p-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100 focus:border-purple-400 focus:ring-0 transition-all font-medium text-slate-700 min-h-[120px]"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    disabled={loading || !preview}
                    type="submit"
                    className="group relative w-full py-5 bg-gradient-to-r from-[#FF477E] to-[#FF6B9D] rounded-[1.5rem] text-white font-black tracking-widest text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-[0_8px_0_#D4145A] disabled:opacity-50 disabled:grayscale overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" /> {loadingStage}
                        </>
                      ) : (
                        <>
                          <Wand2 size={24} /> START THE MAGIC
                        </>
                      )}
                    </span>
                    {loading && (
                        <motion.div 
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    )}
                  </button>
                </form>
              </div>

              {/* FOOTER INFO */}
              <div className="mt-8 flex justify-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                   <Zap size={14} className="text-yellow-500" /> Fast Magic
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                   <Heart size={14} className="text-pink-500" /> AI-Generated Art
                </div>
              </div>
            </motion.div>
          ) : (
            /* STORY OUTPUT VIEW */
            <motion.div 
              key="output"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <div className="flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setOutput(null);
                    setPreview(null);
                  }}
                  className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-2xl shadow-[0_6px_0_#7c3aed] hover:shadow-[0_8px_0_#7c3aed] active:translate-y-1 active:shadow-none transition-all"
                >
                  <ArrowLeft size={18} />
                  CREATE MORE STORIES
                </motion.button>
                
                <motion.div 
                    initial={{ y: 20 }} animate={{ y: 0 }}
                    className="mb-8 text-center"
                >
                    <span className="px-6 py-2 bg-yellow-400 text-white font-black rounded-full text-xs tracking-widest shadow-lg uppercase">
                        ✨ Saved to your history ✨
                    </span>
                </motion.div>

                {/* THE 3D BOOK COMPONENT */}
                <div className="w-full flex justify-center">
                    <Book
                      pages={output.pages}
                      images={output.images}
                    />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🎪 FOOTER */}
      <footer className="relative z-10 mt-20 pb-10 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Powered by Magic & AI • Gemini + Flux
        </p>
      </footer>
    </div>
  );
}