"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, BookOpen, ArrowLeft, Loader2, History 
} from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; 

import Book from "@/components/Book";

export default function StoryGenerator() {
  const { user } = useAuth();
  const router = useRouter();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null); 
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState("");
  const [progress, setProgress] = useState(0); 
  const [storyId, setStoryId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Direct Resume (No Payment Modal)
  const handlePaymentAndResume = async () => {
    if (!output || !storyId) return;
    
    setLoading(true);
    setIsPaid(true); // Direct unlock for testing
    const updatedImages = [...output.images];

    console.log("🚀 Resuming full story generation...");

    try {
      // Starting from page 3 (index 2) to 25
      for (let i = 2; i < output.pages.length; i++) {
        const stage = `🎨 Generating Image ${i + 1} of 25...`;
        console.log(stage); // Terminal/Console log
        setLoadingStage(stage);
        setProgress(i + 1);

        const imgRes = await fetch("/api/genie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            imageBase64: preview, 
            pageText: output.pages[i], 
            mode: "generateImage" 
          }),
        });

        const imgData = await imgRes.json();
        updatedImages[i] = imgData.imageUrl || "https://placehold.co/600x800/png?text=Error";
        
        // Live UI Update
        setOutput(prev => ({ ...prev, images: [...updatedImages] }));
      }

      console.log("✅ All 25 images generated successfully!");
      await updateDoc(doc(db, "stories", storyId), {
        images: updatedImages,
        status: "completed",
        paid: true
      });

    } catch (err) {
      console.error("❌ Generation Error:", err);
      setError("Something went wrong during generation.");
    } finally {
      setLoading(false);
    }
  };

  const clientSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !user) return;

    setLoading(true);
    setError(null);
    setProgress(0);
    
    const formData = new FormData(e.target);
    const storyPrompt = formData.get("storyPrompt");

    try {
      console.log("🧠 Step 1: Generating full 25-page story text...");
      setLoadingStage("🧠 Imagining your 25-page adventure...");
      
      const textRes = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview, storyPrompt, mode: "generateText" }),
      });

      const textData = await textRes.json();
      const allPages = textData.pages; 
      console.log("📖 Story text ready. Now generating free preview images...");

      const finalImages = new Array(25).fill("https://placehold.co/600x800?text=Locked");
      setOutput({ pages: allPages, images: finalImages });

      // Free Preview Loop
      for (let i = 0; i < 2; i++) {
        const stage = `🎨 Generating Preview ${i + 1}/2...`;
        console.log(stage);
        setLoadingStage(stage);
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
      });
      setStoryId(docRef.id);
      console.log("✨ Preview Book saved to Firestore:", docRef.id);

    } catch (err) {
      console.error("❌ Error:", err);
      setError("The magic was interrupted.");
    } finally {
      setLoading(false);
    }
  };

  // GSAP Animations...
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const flashRef = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to([leftCurtainRef.current, rightCurtainRef.current], { x: (i) => (i === 0 ? "-105%" : "105%"), duration: 1.5, ease: "expo.inOut", delay: 0.5 })
      .to(flashRef.current, { opacity: 0, duration: 0.5 });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#F0F4FF] font-sans text-slate-800">
      {/* Curtains */}
      <div className="absolute inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-[#FFD93D]" />
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-[#FFD93D]" />
      </div>
      <div ref={flashRef} className="absolute inset-0 z-[110] bg-white pointer-events-none" />

      <header className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <h1 onClick={() => router.push("/")} className="text-2xl font-black cursor-pointer">🧞 GinnieTales</h1>
        <button onClick={() => router.push("/history")} className="px-5 py-2.5 bg-white rounded-2xl font-black text-xs shadow-lg flex items-center gap-2">
          <History size={16} /> HISTORY
        </button>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!output || (loading && progress <= 2) ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                {loading && (
                   <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                      <h3 className="text-xl font-black">{loadingStage}</h3>
                      <div className="w-full bg-slate-100 h-3 rounded-full mt-8 overflow-hidden max-w-xs">
                        <motion.div className="h-full bg-blue-500" animate={{ width: `${(progress / 2) * 100}%` }} />
                      </div>
                   </div>
                )}
                <form onSubmit={clientSubmit} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase">Upload Photo</label>
                     <input type="file" onChange={handleFileChange} className="w-full p-4 border-2 border-dashed rounded-2xl" />
                   </div>
                   <textarea name="storyPrompt" required className="w-full p-5 rounded-2xl bg-slate-50 min-h-[120px]" placeholder="Story theme..." />
                   <button className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl shadow-lg">GENERATE FREE PREVIEW</button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
                {/* Loader Overlay for Full Story Resume */}
                {loading && (
                   <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center text-white">
                      <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mb-6" />
                      <h3 className="text-3xl font-black mb-2">Unlocking Full Story...</h3>
                      <p className="text-lg opacity-70 mb-8">{loadingStage}</p>
                      <div className="w-full max-w-md bg-white/20 h-4 rounded-full overflow-hidden border border-white/30">
                        <motion.div className="h-full bg-yellow-400 shadow-[0_0_20px_#facc15]" animate={{ width: `${(progress / 25) * 100}%` }} />
                      </div>
                   </div>
                )}

                <button onClick={() => setOutput(null)} className="mb-6 px-6 py-3 bg-white rounded-xl font-bold flex items-center gap-2">
                  <ArrowLeft size={20}/> NEW STORY
                </button>
                
                <div className="relative w-full flex justify-center">
                    <Book 
                      pages={output.pages} 
                      images={output.images} 
                      isPaid={isPaid} 
                      onPay={handlePaymentAndResume}
                      isProcessing={loading}
                    />
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}