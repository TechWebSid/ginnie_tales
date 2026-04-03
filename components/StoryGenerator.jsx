"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, XCircle, Star, Sparkles, AlertCircle } from "lucide-react";
import Script from "next/script";

import { db } from "@/lib/firebase";
import { addDoc, updateDoc, doc, serverTimestamp, collection } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; 

import Book from "@/components/Book";
import GenerationForm from "./story-generator/GenerationForm";
import MagicalCart from "./story-generator/MagicalCart";

export default function StoryGenerator() {
  const { user } = useAuth();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null); 
  const [loadingStage, setLoadingStage] = useState("");
  const [progress, setProgress] = useState(0); 
  const [storyId, setStoryId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [generationStopped, setGenerationStopped] = useState(false);

  const [storyConfig, setStoryConfig] = useState({
    kidName: "", ageGroup: "", theme: "", subject: "", style: "Ghibli"
  });
  
  const [showCart, setShowCart] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    phone: "", address: "", pincode: "", city: ""
  });

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
    setGenerationStopped(true);
    setLoading(false);
  };

  // The function to resume from where it was stopped
  const resumeMagic = async () => {
    setGenerationStopped(false);
    setIsCancelled(false);
    await generateRemainingPages();
  };

  const clientSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !user) return;
    setLoading(true);
    setIsCancelled(false);
    setGenerationStopped(false);
    
    const formData = new FormData(e.target);
    const config = {
      kidName: formData.get("kidName"),
      ageGroup: formData.get("ageGroup"),
      theme: formData.get("theme"),
      subject: formData.get("subject"),
      style: formData.get("style"),
      imageBase64: preview
    };
    setStoryConfig(config);

    try {
      setLoadingStage("🔮 Mixing Magic Dust...");
      const textRes = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, mode: "generateText" }),
      });
      const textData = await textRes.json();
      const allPages = textData.pages; 
      const finalImages = new Array(allPages.length).fill("https://placehold.co/600x800?text=Locked");
      
      setOutput({ pages: allPages, images: finalImages, title: config.subject });

      for (let i = 0; i < 2; i++) {
        setLoadingStage(`✨ Creating Page ${i + 1}...`);
        setProgress(i + 1);
        const imgRes = await fetch("/api/genie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...config, pageText: allPages[i], mode: "generateImage" }),
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
        kidName: config.kidName,
        style: config.style
      });
      setStoryId(docRef.id);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const generateRemainingPages = async () => {
    if (!output || !storyId) return;
    setLoading(true);
    const updatedImages = [...output.images];

    try {
      // Find the first index that is still "Locked" or a placeholder
      const startIndex = updatedImages.findIndex(img => img.includes("Locked") || img.includes("Error"));
      const actualStart = startIndex === -1 ? 2 : startIndex;

      for (let i = actualStart; i < output.pages.length; i++) {
        setLoadingStage(`🎨 Painting Page ${i + 1}...`);
        setProgress(i + 1);
        abortControllerRef.current = new AbortController();

        const imgRes = await fetch("/api/genie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...storyConfig, pageText: output.pages[i], mode: "generateImage" }),
          signal: abortControllerRef.current.signal
        });

        const imgData = await imgRes.json();
        updatedImages[i] = imgData.imageUrl || "https://placehold.co/600x800/png?text=Error";
        setOutput(prev => ({ ...prev, images: [...updatedImages] }));
      }

      await updateDoc(doc(db, "stories", storyId), {
        images: updatedImages,
        status: "completed",
        paid: true,
        lastUpdated: serverTimestamp()
      });
      setLoadingStage("✨ Tale Completed!");
      setTimeout(() => setLoading(false), 2000);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  };

  // Razorpay handlers... (Omitted for brevity, keep your original logic)
  const handlePlanSelection = (plan) => {
    if (plan === "hardcopy") setShowShippingForm(true);
    else startPayment("ebook");
  };

  const startPayment = async (plan) => {
    if (plan === "hardcopy" && (!shippingDetails.phone || !shippingDetails.address)) {
      setShowShippingForm(true);
      return;
    }
    if (!window.Razorpay) return alert("Razorpay SDK error.");
    setLoading(true);
    setLoadingStage("💎 Preparing Checkout...");
    const price = plan === "hardcopy" ? 1499 : 499;
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price, storyId, planType: plan }),
      });
      const { order } = await res.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: "INR",
        name: "Genie Tales",
        order_id: order.id,
        handler: async (res) => verifyAndStartMagic(res, plan),
        prefill: { email: user?.email, contact: shippingDetails.phone },
        theme: { color: "#EF476F" },
        modal: { ondismiss: () => setLoading(false) }
      };
      new window.Razorpay(options).open();
    } catch (err) { setLoading(false); }
  };

 const verifyAndStartMagic = async (rzpResponse, plan) => {
  setLoading(true);
  setLoadingStage("🛡️ Verifying Payment...");
  
  // FIX 1: Define priceInPaise inside this function
  const priceInPaise = plan === "hardcopy" ? 149900 : 49900;

  try {
    const res = await fetch("/api/razorpay/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...rzpResponse, 
        storyId, 
        planType: plan, 
        userId: user?.uid, 
        amount: priceInPaise, // Now this will work
        shipping: plan === "hardcopy" ? shippingDetails : null 
      }),
    });

    const data = await res.json();
    
    if (data.success) {
      setLoadingStage("✨ Payment Verified! Starting Magic...");
      setIsPaid(true);
      setShowCart(false);

      // FIX 2: Thoda intezaar karein taaki backend update confirm ho jaye
      // Phir generation call karein
      setTimeout(async () => {
        try {
          await generateRemainingPages(); 
          console.log("Generation started successfully");
        } catch (genErr) {
          console.error("Generation Trigger Error:", genErr);
          // Agar generation fail ho jaye toh page reload kar dein
          window.location.reload();
        }
      }, 2000); 

    } else {
      alert("Payment verification failed. Please contact support.");
      setLoading(false);
    }
  } catch (err) { 
    console.error("Verification Error:", err);
    setLoading(false); 
  }
};
  useEffect(() => {
    gsap.to(leftCurtainRef.current, { x: "-100%", duration: 1.4, ease: "expo.inOut", delay: 0.5 });
    gsap.to(rightCurtainRef.current, { x: "100%", duration: 1.4, ease: "expo.inOut", delay: 0.5 });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FEF9EF] overflow-x-hidden font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Cinematic Curtains */}
      <div className="fixed inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-[#FF4D6D] border-r-[6px] border-[#C9184A] flex items-center justify-end pr-10">
            <span className="text-white/20 font-black text-9xl uppercase rotate-90 tracking-widest">MAGIC</span>
        </div>
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-[#FF4D6D] border-l-[6px] border-[#C9184A] flex items-center justify-start pl-10">
            <span className="text-white/20 font-black text-9xl uppercase -rotate-90 tracking-widest">TALES</span>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {!output || (loading && progress <= 2) ? (
            <GenerationForm onSubmit={clientSubmit} handleFileChange={handleFileChange} preview={preview} loading={loading} loadingStage={loadingStage} progress={progress} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center pt-12">
                
                {/* Global Loading Overlay */}
                {loading && (
                   <div className="fixed inset-0 z-[200] bg-[#073B4C]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="mb-8 p-6 bg-[#FFD166] rounded-full">
                        <Sparkles className="w-16 h-16 text-[#073B4C] fill-[#073B4C]" />
                      </motion.div>
                      <h3 className="text-4xl font-black mb-4 text-[#06D6A0]">PAINTING TALE...</h3>
                      <p className="text-xl font-bold text-[#FFD166] mb-10 uppercase">{loadingStage}</p>
                      <div className="w-full max-w-xl bg-white/10 h-8 rounded-2xl border-[3px] border-white/30 mb-12 overflow-hidden p-1">
                        <motion.div className="h-full bg-gradient-to-r from-[#EF476F] to-[#FFD166] rounded-xl" animate={{ width: `${(progress / output.pages.length) * 100}%` }} />
                      </div>
                      <button onClick={handleCancel} className="flex items-center gap-3 px-10 py-5 bg-[#EF476F] border-b-4 border-[#C9184A] rounded-2xl font-black uppercase text-lg hover:bg-[#ff5d81] transition-all">
                        <XCircle size={24} /> Stop Magic
                      </button>
                   </div>
                )}

                {/* Generation Stopped Modal */}
                {generationStopped && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white p-10 rounded-[2.5rem] border-[6px] border-[#073B4C] shadow-[12px_12px_0px_#EF476F] max-w-md w-full text-center">
                      <AlertCircle size={64} className="text-[#EF476F] mx-auto mb-6" />
                      <h2 className="text-3xl font-[1000] text-[#073B4C] uppercase mb-4">Magic Paused!</h2>
                      <p className="text-slate-500 font-bold mb-8">You stopped the generation. You can resume anytime to see the full story.</p>
                      <button onClick={resumeMagic} className="w-full py-4 bg-[#06D6A0] text-white rounded-2xl font-black uppercase shadow-[0_4px_0px_#048a68] active:translate-y-1 mb-4">
                         Resume Painting
                      </button>
                      <button onClick={() => setGenerationStopped(false)} className="w-full py-2 text-[#073B4C] font-black uppercase text-sm">
                         Just Preview
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="flex w-full justify-between items-center mb-8 px-2">
                    <button onClick={() => { setOutput(null); setProgress(0); setIsPaid(false); setStoryId(null); setGenerationStopped(false); }} className="px-5 py-3 bg-white text-[#073B4C] border-[3px] border-[#073B4C] rounded-2xl font-black flex items-center gap-2 shadow-[6px_6px_0px_#073B4C] uppercase text-sm">
                        <ArrowLeft size={18} /> New Story
                    </button>
                </div>

                <div className="w-full relative px-2">
                  <Book 
                    pages={output.pages} 
                    images={output.images} 
                    title={output.title}
                    isPaid={isPaid} 
                    onPay={() => setShowCart(true)} 
                    isProcessing={loading}
                    onResume={resumeMagic} // Pass the resume function down
                    isStopped={generationStopped || (isPaid && output.images.some(img => img.includes("Locked")))}
                  />
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MagicalCart 
          isOpen={showCart} onClose={() => { setShowCart(false); setShowShippingForm(false); }}
          showShippingForm={showShippingForm} setShowShippingForm={setShowShippingForm}
          handlePlanSelection={handlePlanSelection} shippingDetails={shippingDetails}
          setShippingDetails={setShippingDetails} startPayment={startPayment}
        />
      </main>
    </div>
  );
}