"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, ArrowLeft, Loader2, History, Sparkles, Wand2, XCircle, Rocket, Star, Palette
} from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; 

import Book from "@/components/Book";

export default function StoryGenerator() {
  const { user } = useAuth();
  const router = useRouter();

  // States
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null); 
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState("");
  const [progress, setProgress] = useState(0); 
  const [storyId, setStoryId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Refs
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsCancelled(true);
    setLoading(false);
  };

  // Full Story Generation (Post-Payment)
  const handlePaymentAndResume = async () => {
    if (!output || !storyId) return;
    
    setLoading(true);
    setIsPaid(true); 
    setIsCancelled(false);
    const updatedImages = [...output.images];

    try {
      for (let i = 2; i < output.pages.length; i++) {
        if (isCancelled) break;
        setLoadingStage(`🎨 Painting Page ${i + 1}...`);
        setProgress(i + 1);

        abortControllerRef.current = new AbortController();

        const imgRes = await fetch("/api/genie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            imageBase64: preview, 
            pageText: output.pages[i], 
            mode: "generateImage" 
          }),
          signal: abortControllerRef.current.signal
        });

        const imgData = await imgRes.json();
        updatedImages[i] = imgData.imageUrl || "https://placehold.co/600x800/png?text=Error";
        setOutput(prev => ({ ...prev, images: [...updatedImages] }));
      }

      if (!isCancelled) {
        await updateDoc(doc(db, "stories", storyId), {
          images: updatedImages,
          status: "completed",
          paid: true
        });
        setLoadingStage("✨ Tale Completed!");
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError("The magic was interrupted.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Genie Trigger
  const clientSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !user) return;

    setLoading(true);
    setError(null);
    setProgress(0);
    setIsCancelled(false);
    
    const formData = new FormData(e.target);
    const storyPrompt = formData.get("storyPrompt");

    try {
      setLoadingStage("🔮 Mixing Magic Dust...");
      const textRes = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview, storyPrompt, mode: "generateText" }),
      });

      const textData = await textRes.json();
      const allPages = textData.pages; 
      const finalImages = new Array(allPages.length).fill("https://placehold.co/600x800?text=Locked");
      setOutput({ pages: allPages, images: finalImages, title: storyPrompt });

      // Generate first 2 pages for free preview
      for (let i = 0; i < 2; i++) {
        setLoadingStage(`✨ Creating Page ${i + 1}...`);
        setProgress(i + 1);
        const imgRes = await fetch("/api/genie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: preview, pageText: allPages[i], mode: "generateImage" }),
        });
        const imgData = await imgRes.json();
        finalImages[i] = imgData.imageUrl;
        setOutput(prev => ({ ...prev, images: [...finalImages] }));
      }

      const docRef = await addDoc(collection(db, "stories"), {
        userId: user.uid,
        pages: allPages,
        images: finalImages,
        status: "preview",
        paid: false,
        createdAt: serverTimestamp(),
        coverImage: finalImages[0],
        prompt: storyPrompt
      });
      setStoryId(docRef.id);

    } catch (err) {
      setError("The magic was interrupted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.to(leftCurtainRef.current, { x: "-100%", duration: 1.4, ease: "expo.inOut", delay: 0.5 });
    gsap.to(rightCurtainRef.current, { x: "100%", duration: 1.4, ease: "expo.inOut", delay: 0.5 });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FEF9EF] overflow-x-hidden font-sans pb-10">
      
      {/* 🎪 Cinematic Curtains (Responsive Text) */}
      <div className="fixed inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-[#FF4D6D] border-r-4 md:border-r-8 border-[#C9184A] flex items-center justify-end pr-4 md:pr-10">
            <span className="text-white/20 font-black text-6xl md:text-9xl uppercase rotate-90 select-none tracking-widest">MAGIC</span>
        </div>
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-[#FF4D6D] border-l-4 md:border-l-8 border-[#C9184A] flex items-center justify-start pl-4 md:pl-10">
            <span className="text-white/20 font-black text-6xl md:text-9xl uppercase -rotate-90 select-none tracking-widest">TALES</span>
        </div>
      </div>

      {/* 🍭 Header (Flex-Col on mobile, Row on desktop) */}
      <header className="relative z-50 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 max-w-7xl mx-auto">
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          onClick={() => router.push("/")} 
          className="flex items-center gap-3 cursor-pointer"
        >
        
         
        </motion.div>

      
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          
          {!output || (loading && progress <= 2) ? (
            <motion.div 
              key="generator-form" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-4 md:pt-10"
            >
              {/* Left Side */}
              <div className="space-y-6 text-center lg:text-left">
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 md:w-32 md:h-32 bg-[#FFD166] rounded-[2rem] flex items-center justify-center mx-auto lg:mx-0 shadow-[6px_6px_0px_#EE964B] border-4 border-white"
                >
                    <Wand2 className="text-white w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                </motion.div>
                <div className="space-y-4">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-[1000] text-[#073B4C] leading-[0.9] tracking-tighter">
                      BE THE <br /> <span className="text-[#EF476F]">HERO!</span>
                    </h2>
                    <p className="text-[#118AB2] font-black text-lg md:text-xl bg-white/60 backdrop-blur-sm p-4 rounded-2xl inline-block border-2 border-[#118AB2]/10">
                      Upload your photo to start! 🚀
                    </p>
                </div>
              </div>

              {/* Form Container */}
              <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                <div className="absolute -inset-2 md:-inset-6 bg-[#06D6A0] rounded-[2.5rem] md:rounded-[4rem] rotate-2 opacity-10 blur-xl" />
                <div className="relative bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-[8px_8px_0px_#118AB2] border-4 border-[#073B4C] overflow-hidden">
                    
                    {/* Inner Loader */}
                    {loading && (
                        <motion.div className="absolute inset-0 z-[60] bg-[#FFD166] flex flex-col items-center justify-center p-6 text-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                <Palette className="w-16 h-16 text-[#EF476F]" />
                            </motion.div>
                            <h3 className="text-2xl font-[1000] text-[#073B4C] uppercase mt-4">{loadingStage}</h3>
                            <div className="w-full bg-white/50 h-5 rounded-full mt-6 border-[3px] border-[#073B4C] p-1 overflow-hidden">
                                <motion.div className="h-full bg-[#EF476F] rounded-full" animate={{ width: `${(progress / 2) * 100}%` }} />
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={clientSubmit} className="space-y-5 md:space-y-6">
                        <label className="relative block group cursor-pointer">
                            <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                            <div className={`aspect-square sm:aspect-video lg:aspect-square rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${preview ? 'border-[#EF476F]' : 'border-[#118AB2]/30 bg-[#F1FAEE] group-hover:bg-[#E1F5FE]'}`}>
                                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : (
                                    <div className="text-center p-4">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto text-[#118AB2] border-2 border-[#118AB2] mb-3"><Camera size={28} /></div>
                                        <p className="font-[1000] text-[#118AB2] text-sm uppercase tracking-tighter">Tap to add your face!</p>
                                    </div>
                                )}
                            </div>
                        </label>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#073B4C] uppercase ml-1 flex items-center gap-2">
                                <Rocket size={14} /> Story Prompt
                            </label>
                            <textarea 
                              name="storyPrompt" 
                              required 
                              className="w-full p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-[#F1FAEE] border-2 border-transparent focus:border-[#EF476F] focus:bg-white transition-all min-h-[100px] md:min-h-[120px] outline-none font-bold text-[#073B4C] text-sm md:text-base" 
                              placeholder="E.g. A space adventure with my cat..." 
                            />
                        </div>

                        <button 
                          disabled={!preview || loading} 
                          className="w-full py-5 md:py-6 bg-[#EF476F] text-white font-[1000] rounded-[1.5rem] md:rounded-[2rem] shadow-[4px_4px_0px_#C9184A] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 text-xl md:text-2xl uppercase border-2 border-white disabled:opacity-50"
                        >
                            <Sparkles size={24} /> MAKE MAGIC!
                        </button>
                    </form>
                </div>
              </div>
            </motion.div>
          ) : (
            
            <motion.div key="book-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center pt-4 md:pt-10">
                
                {/* 🌈 Responsive Full Gen Loader */}
                {loading && (
                   <div className="fixed inset-0 z-[200] bg-[#073B4C]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-6">
                        <Star className="w-16 h-16 md:w-20 md:h-20 text-[#FFD166] fill-[#FFD166]" />
                      </motion.div>
                      <h3 className="text-4xl md:text-6xl font-[1000] mb-2 uppercase text-[#06D6A0] tracking-tighter">Painting Tale...</h3>
                      <p className="text-lg md:text-xl font-black text-[#FFD166] mb-8 uppercase">{loadingStage}</p>
                      
                      <div className="w-full max-w-md bg-white/20 h-6 md:h-8 rounded-full border-4 border-white mb-10 p-1 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#EF476F] to-[#FFD166] rounded-full" 
                          animate={{ width: `${(progress / (output.pages.length || 25)) * 100}%` }} 
                        />
                      </div>

                      <button 
                        onClick={handleCancel} 
                        className="flex items-center gap-2 px-8 py-4 bg-[#EF476F] border-2 border-white rounded-2xl text-white font-black uppercase shadow-lg active:scale-95"
                      >
                        <XCircle size={20} /> Stop
                      </button>
                   </div>
                )}

                <div className="flex w-full justify-start mb-6">
                    <button 
                      onClick={() => setOutput(null)} 
                      className="px-6 py-3 bg-white text-[#073B4C] border-2 border-[#073B4C] rounded-xl font-black flex items-center gap-2 shadow-[3px_3px_0px_#073B4C] active:translate-y-1 active:shadow-none uppercase text-xs"
                    >
                        <ArrowLeft size={16}/> New Story
                    </button>
                </div>
                
                {/* Book Wrapper (Handles horizontal scroll if needed) */}
                <div className="w-full overflow-x-auto pb-8 flex justify-center">
                    <div className="min-w-[320px] w-full max-w-4xl">
                        <Book 
                          pages={output.pages} 
                          images={output.images} 
                          title={output.title || "MY ADVENTURE"}
                          isPaid={isPaid} 
                          onPay={handlePaymentAndResume}
                          isProcessing={loading}
                        />
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}