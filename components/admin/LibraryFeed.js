"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, BookOpen, X, Loader2 } from "lucide-react";

export default function LibraryFeed() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isDownloading, setIsDownloading] = useState(null); // Tracks ID of downloading story

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

  const downloadVendorPDF = async (story) => {
    setIsDownloading(story.id);
    const brandName = "GinnieTales";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; }
            .page { width: 297mm; height: 210mm; display: flex; page-break-after: always; overflow: hidden; position: relative; }
            .img-side { width: 50%; height: 100%; }
            .img-side img { width: 100%; height: 100%; object-fit: cover; }
            .text-side { width: 50%; height: 100%; background: #FFFCF9; padding: 60px; display: flex; flex-direction: column; justify-content: center; border-left: 1px solid #eee; }
            .story-text { font-size: 28px; line-height: 1.6; color: #1e293b; font-weight: 500; }
            .footer { margin-top: auto; font-size: 14px; color: #ec4899; font-weight: 800; text-transform: uppercase; border-top: 2px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="page" style="background: #ec4899; justify-content: center; align-items: center; color: white;">
            <img src="${story.coverImage}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.5;" />
            <div style="position:relative; z-index:10; text-align:center; background: rgba(0,0,0,0.3); padding: 40px; backdrop-filter: blur(10px); border-radius: 40px;">
                <h1 style="font-size: 50px; text-transform: uppercase; letter-spacing: -2px;">${story.prompt}</h1>
                <p style="margin-top: 10px; font-weight: 800; opacity: 0.8;">VENDOR COPY - GINNIETALES</p>
            </div>
          </div>
          ${story.pages.map((text, i) => `
            <div class="page">
              <div class="img-side"><img src="${story.images?.[i] || story.coverImage}" /></div>
              <div class="text-side">
                <p class="story-text">${text}</p>
                <div class="footer">${brandName.toUpperCase()} | PAGE ${i + 1}</div>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlContent }),
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
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {story.userId.slice(0, 8)}...</span>
                <span className="font-black text-slate-800 text-sm">{story.pages?.length || 0} Pages</span>
              </div>

              <button 
                onClick={() => downloadVendorPDF(story)}
                disabled={isDownloading === story.id}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDownloading === story.id ? <Loader2 className="animate-spin" size={14} /> : <FileDown size={14} />}
                {isDownloading === story.id ? "Generating..." : "Download Vendor PDF"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- READER MODAL --- */}
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