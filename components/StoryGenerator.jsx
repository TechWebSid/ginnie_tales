"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, XCircle, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; 

import Book from "@/components/Book";
import GenerationForm from "./story-generator/GenerationForm";   // Ensure path is correct
import MagicalCart from "./story-generator/MagicalCart"     // Ensure path is correct

export default function StoryGenerator() {
  const { user } = useAuth();
  const router = useRouter();

  // --- States ---
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null); 
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState("");
  const [progress, setProgress] = useState(0); 
  const [storyId, setStoryId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  
  // Payment States
  const [showCart, setShowCart] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    phone: "",
    address: "",
    pincode: "",
    city: ""
  });

  // --- Refs ---
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const abortControllerRef = useRef(null);

  // --- Logic Handlers ---
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

  const handlePlanSelection = (plan) => {
    if (plan === "hardcopy") {
      setShowShippingForm(true);
    } else {
      startPayment("ebook");
    }
  };

  const startPayment = async (plan) => {
    if (plan === "hardcopy" && (!shippingDetails.phone || !shippingDetails.address)) {
      setShowShippingForm(true);
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    setLoading(true);
    setLoadingStage("💎 Preparing Checkout...");
    const price = plan === "hardcopy" ? 1499 : 499;

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price, storyId: storyId, planType: plan }),
      });
      
      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: "INR",
        name: "Genie Tales",
        description: plan === "hardcopy" ? "Hardcover + Digital E-Book" : "Digital E-Book Only",
        order_id: order.id,
        handler: async function (response) {
          await verifyAndStartMagic(response, plan);
        },
        prefill: { email: user?.email || "", contact: shippingDetails.phone || "" },
        theme: { color: "#EF476F" },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setLoading(false);
    }
  };

  const verifyAndStartMagic = async (rzpResponse, plan) => {
    setLoading(true);
    setLoadingStage("🛡️ Verifying Payment...");
    try {
      const res = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rzpResponse,
          storyId: storyId,
          planType: plan,
          userId: user?.uid,
          shipping: plan === "hardcopy" ? shippingDetails : null 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsPaid(true);
        setShowCart(false);
        setShowShippingForm(false);
        await generateRemainingPages(); 
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const generateRemainingPages = async () => {
    if (!output || !storyId) return;
    setLoading(true);
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
          body: JSON.stringify({ imageBase64: preview, pageText: output.pages[i], mode: "generateImage" }),
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
          paid: true,
          lastUpdated: serverTimestamp()
        });
        setLoadingStage("✨ Tale Completed!");
        setTimeout(() => setLoading(false), 2000);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const clientSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !user) return;
    setLoading(true);
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* --- Cinematic Curtains --- */}
      <div className="fixed inset-0 z-[100] flex pointer-events-none">
        <div ref={leftCurtainRef} className="w-1/2 h-full bg-[#FF4D6D] border-r-4 md:border-r-8 border-[#C9184A] flex items-center justify-end pr-4 md:pr-10">
            <span className="text-white/20 font-black text-6xl md:text-9xl uppercase rotate-90 select-none tracking-widest">MAGIC</span>
        </div>
        <div ref={rightCurtainRef} className="w-1/2 h-full bg-[#FF4D6D] border-l-4 md:border-l-8 border-[#C9184A] flex items-center justify-start pl-4 md:pl-10">
            <span className="text-white/20 font-black text-6xl md:text-9xl uppercase -rotate-90 select-none tracking-widest">TALES</span>
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          {!output || (loading && progress <= 2) ? (
            <GenerationForm 
              onSubmit={clientSubmit}
              handleFileChange={handleFileChange}
              preview={preview}
              loading={loading}
              loadingStage={loadingStage}
              progress={progress}
            />
          ) : (
            <motion.div key="book-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center pt-4 md:pt-10">
                {loading && (
                   <div className="fixed inset-0 z-[200] bg-[#073B4C]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-6"><Star className="w-16 h-16 md:w-20 md:h-20 text-[#FFD166] fill-[#FFD166]" /></motion.div>
                      <h3 className="text-4xl md:text-6xl font-[1000] mb-2 uppercase text-[#06D6A0] tracking-tighter">Painting Tale...</h3>
                      <p className="text-lg md:text-xl font-black text-[#FFD166] mb-8 uppercase">{loadingStage}</p>
                      <div className="w-full max-w-md bg-white/20 h-6 md:h-8 rounded-full border-4 border-white mb-10 p-1 overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-[#EF476F] to-[#FFD166] rounded-full" animate={{ width: `${(progress / (output.pages.length || 4)) * 100}%` }} />
                      </div>
                      <button onClick={handleCancel} className="flex items-center gap-2 px-8 py-4 bg-[#EF476F] border-2 border-white rounded-2xl text-white font-black uppercase shadow-lg active:scale-95"><XCircle size={20} /> Stop</button>
                   </div>
                )}

                <div className="flex w-full justify-start mb-6">
                    <button onClick={() => setOutput(null)} className="px-6 py-3 bg-white text-[#073B4C] border-2 border-[#073B4C] rounded-xl font-black flex items-center gap-2 shadow-[3px_3px_0px_#073B4C] uppercase text-xs">
                        <ArrowLeft size={16}/> New Story
                    </button>
                </div>
                
                <div className="w-full overflow-x-auto pb-8 flex justify-center">
                    <div className="min-w-[320px] w-full max-w-4xl">
                        <Book 
                          pages={output.pages} 
                          images={output.images} 
                          title={output.title || "MY ADVENTURE"}
                          isPaid={isPaid} 
                          onPay={() => setShowCart(true)} 
                          isProcessing={loading}
                        />
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MagicalCart 
          isOpen={showCart}
          onClose={() => { setShowCart(false); setShowShippingForm(false); }}
          showShippingForm={showShippingForm}
          setShowShippingForm={setShowShippingForm}
          handlePlanSelection={handlePlanSelection}
          shippingDetails={shippingDetails}
          setShippingDetails={setShippingDetails}
          startPayment={startPayment}
        />
      </main>
    </div>
  );
}