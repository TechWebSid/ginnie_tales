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

// Firebase & Auth
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; 

import Book from "@/components/Book";

export default function StoryGenerator() {
  const { user } = useAuth();
  const router = useRouter();

  // --- STATE ---
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null); // { pages: [], images: [] }
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState("");
  const [progress, setProgress] = useState(0); // 0 to 25

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

  // --- THE 25-PAGE SEQUENCER ---
  const clientSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !user) return;

    setLoading(true);
    setError(null);
    setOutput(null);
    setProgress(0);
    
    const formData = new FormData(e.target);
    const storyPrompt = formData.get("storyPrompt");

    try {
      // PHASE 1: GENERATE 25-PAGE TEXT OUTLINE
      setLoadingStage("🧠 Imagining your 25-page adventure...");
      const textRes = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageBase64: preview, 
          storyPrompt, 
          mode: "generateText" 
        }),
      });

      const textData = await textRes.json();
      if (!textData.success) throw new Error(textData.error || "Text generation failed");

      const allPages = textData.pages; // Array of 25 strings
      const allImages = new Array(25).fill("https://placehold.co/600x800/png?text=Painting...");

      // Set initial output so the UI can show the "Loading Book"
      setOutput({ pages: allPages, images: allImages });

      // PHASE 2: GENERATE IMAGES ONE-BY-ONE (The Sequencer)
      const finalImages = [];

      for (let i = 0; i < allPages.length; i++) {
        setLoadingStage(`🎨 Painting Page ${i + 1} of 25...`);
        setProgress(i + 1);

        const imgRes = await fetch("/api/genie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            imageBase64: preview, 
            pageText: allPages[i], 
            mode: "generateImage" 
          }),
        });

        const imgData = await imgRes.json();
        const url = imgData.imageUrl || "https://placehold.co/600x800/png?text=Error";
        
        finalImages.push(url);
        
        // Optional: Update UI live so images appear as they finish
        setOutput(prev => ({
          ...prev,
          images: [...finalImages, ...new Array(25 - finalImages.length).fill("https://placehold.co/600x800/png?text=Waiting...")]
        }));
      }

      // PHASE 3: SAVE TO FIREBASE
      setLoadingStage("✨ Archiving your masterpiece...");
      await addDoc(collection(db, "stories"), {
        userId: user.uid,
        prompt: storyPrompt,
        pages: allPages,
        images: finalImages,
        createdAt: serverTimestamp(),
        coverImage: finalImages[0],
      });

      setError(null);
    } catch (err) {
      console.error(err);
      setError("The magic was interrupted. Please try again!");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  // --- GSAP CURTAIN ---
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
      
      {/* THEATER CURTAINS */}
      <div className="absolute inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-gradient-to-r from-[#FFD93D] to-[#FFED4E] border-r-4 border-yellow-500/20 shadow-2xl" />
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-gradient-to-l from-[#FFD93D] to-[#FFED4E] border-l-4 border-yellow-500/20 shadow-2xl" />
      </div>
      <div ref={flashRef} className="absolute inset-0 z-[110] bg-white pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div onClick={() => router.push("/")} className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border-2 border-white cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">🧞</div>
          <h1 className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">GinnieTales</h1>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => router.push("/history")} className="flex items-center gap-2 px-5 py-2.5 bg-white border-b-4 border-slate-200 rounded-2xl font-black text-xs text-slate-600 shadow-lg hover:bg-slate-50 transition-all">
            <History size={16} /> HISTORY
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!output || loading ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
              
              <div className="text-center mb-10">
                <motion.img animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} src="/genie.png" className="w-32 mx-auto mb-4 drop-shadow-xl" />
                <h2 className="text-4xl md:text-5xl font-[1000] text-slate-800 leading-tight">
                  A Massive <span className="text-blue-500">25-Page</span> <br/> 
                  <span className="text-pink-500 underline decoration-yellow-400">Epic</span> Awaits!
                </h2>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-2xl border-4 border-white relative">
                {loading && (
                   <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm rounded-[1.8rem] flex flex-col items-center justify-center p-10 text-center">
                      <div className="relative w-24 h-24 mb-6">
                        <Loader2 className="w-full h-full text-blue-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-blue-600">
                          {Math.round((progress / 25) * 100)}%
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">{loadingStage}</h3>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest animate-pulse">Dont close this tab, the magic is working...</p>
                      <div className="w-full bg-slate-100 h-3 rounded-full mt-8 overflow-hidden border-2 border-white shadow-inner">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${(progress / 25) * 100}%` }}
                        />
                      </div>
                   </div>
                )}

                <form onSubmit={clientSubmit} className="space-y-8">
                  {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl font-bold flex gap-2"><Smile className="rotate-180"/> {error}</div>}

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Camera size={18} className="text-blue-500"/> 1. Hero's Photo</label>
                    <div className="relative group border-4 border-dashed rounded-3xl p-8 hover:bg-blue-50 transition-all cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {preview ? (
                        <img src={preview} className="w-32 h-32 mx-auto rounded-2xl object-cover border-4 border-white shadow-xl" />
                      ) : (
                        <div className="text-center text-slate-400 font-bold"><Palette size={40} className="mx-auto mb-2 opacity-20"/> Click to Upload</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={18} className="text-purple-500"/> 2. The Grand Idea</label>
                    <textarea name="storyPrompt" required placeholder="Describe an epic 25-page journey..." className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-purple-400 outline-none font-medium min-h-[120px]" />
                  </div>

                  <button disabled={loading || !preview} className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl rounded-3xl shadow-[0_8px_0_#be123c] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                    GENERATE 25-PAGE BOOK
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="output" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center">
                <button onClick={() => { setOutput(null); setPreview(null); }} className="mb-10 px-8 py-4 bg-white border-b-4 border-slate-200 rounded-2xl font-black text-slate-600 shadow-xl flex items-center gap-2 hover:-translate-y-1 transition-all">
                  <ArrowLeft size={20}/> START NEW ADVENTURE
                </button>
                
                {/* 3D BOOK COMPONENT */}
                <div className="w-full flex justify-center perspective-lg">
                    <Book pages={output.pages} images={output.images} />
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 pb-10 text-center opacity-30 font-black text-[10px] uppercase tracking-[0.2em]">
        GinnieTales Cinematic v2.5 • Powered by Flux & Gemini
      </footer>
    </div>
  );
}