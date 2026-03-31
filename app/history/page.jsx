"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, BookHeart, Sparkles, X } from "lucide-react";

// Firebase
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

// Components
import HistoryCard from "@/components/HistoryCard";
import Book from "@/components/Book";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");

    if (user) {
      const fetchUserStories = async () => {
        try {
          const q = query(
            collection(db, "stories"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          );
          
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setStories(data);
        } catch (err) {
          console.error("Error fetching stories:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserStories();
    }
  }, [user, authLoading, router]);

  // DELETE FUNCTION
  const handleDeleteStory = async (storyId) => {
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, "stories", storyId));
      
      // 2. Remove from local state immediately
      setStories((prev) => prev.filter((s) => s.id !== storyId));
    } catch (err) {
      console.error("Failed to delete story:", err);
      alert("Magic failed to delete this story. Try again!");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F0F4FF]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-4 text-blue-500"
        >
          <Loader2 size={48} />
        </motion.div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Opening Your Library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] pb-20">
      
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/story")}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back to Magic</span>
          </button>
          
          <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
             <BookHeart className="text-pink-500" size={18} />
             <span className="font-black text-slate-700 text-xs uppercase tracking-tighter">My Collection</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-[1000] text-slate-800 leading-none">
            Your Magic <br />
            <span className="text-blue-600">Adventure</span> History
          </h1>
          <p className="mt-4 text-slate-500 font-medium">Relive or remove your generated tales.</p>
        </header>

        {stories.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-[3rem] p-16 text-center shadow-sm border-4 border-white"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Sparkles className="text-slate-300" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">No Stories Yet!</h2>
            <button 
              onClick={() => router.push("/story")}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              CREATE A STORY
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {stories.map((story) => (
                <HistoryCard 
                  key={story.id} 
                  story={story} 
                  onOpen={(s) => setSelectedStory(s)} 
                  onDelete={handleDeleteStory}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={() => setSelectedStory(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-800 hover:rotate-90 transition-all z-[110]"
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-5xl h-full flex items-center justify-center"
            >
              <Book 
                pages={selectedStory.pages} 
                images={selectedStory.images} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}