"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, BookOpen, X, Loader2, Mail, CheckCircle } from "lucide-react";

export default function LibraryFeed() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isDownloading, setIsDownloading] = useState(null); 
  const [isSendingEmail, setIsSendingEmail] = useState(null); // NEW: Track email sending state

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        const storyList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStories(storyList);
      } catch (error) {
        console.error("Error fetching library:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  // --- HTML TEMPLATE GENERATOR (Same for Download & Email) ---
  const generateFullHtml = (story) => {
    const brandName = "GinnieTales";
    const frontCoverImg = story.coverImage || story.images?.[0] || "https://placehold.co/600x800?text=My+Story";
    
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=Inter:ital,wght@0,900;1,900&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 0; background: #FEF9EF; font-family: 'Inter', sans-serif; color: #1A365D; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { size: 297mm 210mm; margin: 0; }
            .page { width: 297mm; height: 210mm; display: flex; page-break-after: always; border: 15px solid white; box-sizing: border-box; position: relative; overflow: hidden; background: #FFFCF9; }
            .front-cover { background: #000 !important; justify-content: flex-end; align-items: center; }
            .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
            .vignette { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 30%, transparent 50%); z-index: 2; }
            .cover-content { position: relative; z-index: 10; padding-bottom: 30px; text-align: center; width: 100%; }
            .generic-title { font-size: 45px; font-weight: 900; font-style: italic; color: #FFD166 !important; margin: 0 0 10px 0; text-transform: uppercase; text-shadow: 0 5px 15px rgba(0,0,0,0.8); }
            .img-container { width: 50%; height: 100%; border-right: 10px solid white; overflow: hidden; }
            .img-container img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .text-container { width: 50%; padding: 60px; background: #FFFCF9 !important; display: flex; align-items: center; box-sizing: border-box; }
            .story-text { font-size: 28px; line-height: 1.4; font-weight: 800; letter-spacing: -1px; margin: 0; text-align: left; }
            .story-text::first-letter { color: #EF476F !important; font-family: 'Plus Jakarta Sans', sans-serif; float: left; font-size: 80px; line-height: 0.8; padding-right: 15px; font-weight: 900; }
            .back-cover { background: #480CA8 !important; color: white !important; border: none; justify-content: center; align-items: center; }
            .back-inner { width: 90%; height: 90%; border: 8px double rgba(255,255,255,0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; }
            * { -webkit-print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          <div class="page front-cover">
            <img src="${frontCoverImg}" class="hero-bg" />
            <div class="vignette"></div>
            <div class="cover-content">
              <h1 class="generic-title">A MAGICAL STORY INSIDE</h1>
              <div style="font-size: 18px; font-weight: 900; font-style: italic; color: #06D6A0; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px;">Crafted by GinnieTales ✨</div>
              <div style="font-size: 12px; color: white; opacity: 0.8; letter-spacing: 4px;">VENDOR COPY | ID: ${story.id.slice(0,8)}</div>
            </div>
          </div>
          ${story.pages.map((text, i) => `
            <div class="page">
              <div class="img-container"><img src="${story.images?.[i] || story.coverImage}" /></div>
              <div class="text-container">
                <p class="story-text">${text}</p>
              </div>
            </div>
          `).join('')}
          <div class="page back-cover">
            <div class="back-inner">
              <div style="font-size: 80px; margin-bottom: 20px;">🧞‍♂️</div>
              <h2 style="font-size: 90px; font-weight: 900; font-style: italic; color: #FFD166; margin: 0; text-transform: uppercase;">The End</h2>
              <div style="margin-top: 60px; font-size: 24px; font-weight: 900; font-style: italic; color: #4CC9F0; letter-spacing: 4px;">GinnieTales Admin View</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // --- 1. NEW: SEND TO ADMIN GMAIL ---
  const sendAdminEmail = async (story) => {
    setIsSendingEmail(story.id);
    try {
      const response = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyHtml: generateFullHtml(story),
          userEmail: "siddharthasrivastava40@gmail.com", // Hardcoded Admin Email
          storyTitle: `ADMIN_COPY_${story.id.slice(0,6)}`
        }),
      });

      if (response.ok) {
        alert("Magic Sent to Admin Gmail! 🧞‍♂️📧");
      } else {
        throw new Error("Email failed");
      }
    } catch (err) {
      alert("Email Error: " + err.message);
    } finally {
      setIsSendingEmail(null);
    }
  };

  // --- 2. EXISTING: DOWNLOAD VENDOR PDF ---
  const downloadVendorPDF = async (story) => {
    setIsDownloading(story.id);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: generateFullHtml(story) }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VENDOR_COPY_${story.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Magic failed: " + err.message);
    } finally {
      setIsDownloading(null);
    }
  };

  if (loading) return <div className="p-10 text-slate-400 font-bold animate-pulse uppercase tracking-widest">Scanning the Library...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h3 className="text-3xl font-[1000] text-slate-800 uppercase italic tracking-tighter">
          Global <span className="text-purple-500">Library</span> Feed
        </h3>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Vendor-Ready Oversight</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <motion.div 
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-4 border-white shadow-lg rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all flex flex-col"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setSelectedStory(story)}>
              <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white text-slate-900 px-6 py-2 rounded-full font-black uppercase italic text-xs flex items-center gap-2">
                  <BookOpen size={14} /> Open Book
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-700 font-bold text-sm line-clamp-2 italic flex-1 mb-4">"{story.prompt}"</p>
              
              <div className="flex items-center justify-between py-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {story.userId?.slice(0, 8)}...</span>
                <span className="font-black text-slate-800 text-sm">{story.pages?.length || 0} Pages</span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => downloadVendorPDF(story)}
                  disabled={isDownloading === story.id}
                  className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading === story.id ? <Loader2 className="animate-spin" size={14} /> : <FileDown size={14} />}
                  {isDownloading === story.id ? "Generating..." : "Download PDF"}
                </button>

                <button 
                  onClick={() => sendAdminEmail(story)}
                  disabled={isSendingEmail === story.id}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                >
                  {isSendingEmail === story.id ? <Loader2 className="animate-spin" size={14} /> : <Mail size={14} />}
                  {isSendingEmail === story.id ? "Sending Magic..." : "Send to Admin Gmail"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- READER MODAL (No changes here) --- */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl p-4 md:p-10 flex items-center justify-center">
            <div className="max-w-6xl w-full h-[90vh] bg-white rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl">
              <button onClick={() => setSelectedStory(null)} className="absolute top-6 right-6 z-50 bg-slate-100 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all">
                <X size={24} />
              </button>

              <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-20 custom-scrollbar">
                {selectedStory.pages.map((text, i) => (
                  <div key={i} className={`flex flex-col lg:flex-row gap-12 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="w-full lg:w-1/2 aspect-square rounded-[2rem] overflow-hidden border-8 border-slate-50 shadow-xl">
                      <img src={selectedStory.images?.[i] || selectedStory.coverImage} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <span className="text-7xl font-black text-slate-100 block mb-4">0{i+1}</span>
                      <p className="text-2xl font-bold text-slate-600 leading-relaxed italic">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}