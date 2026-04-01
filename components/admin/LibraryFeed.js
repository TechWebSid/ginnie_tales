"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { motion } from "framer-motion";

export default function LibraryFeed() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Fetching the last 20 stories generated
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

  if (loading) return <div className="p-10 text-slate-400 font-bold animate-pulse">Opening the Library Vault...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-[1000] text-slate-800 uppercase italic tracking-tighter">
            Global <span className="text-purple-500">Library</span> Feed
          </h3>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Monitoring the latest 3D creations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <motion.div 
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-4 border-white shadow-lg rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all"
          >
            {/* Cover Image Preview */}
            <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
              {story.coverImage ? (
                <img 
                  src={story.coverImage} 
                  alt="Story Cover" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl">🖼️</div>
              )}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {story.status || "Unknown"}
              </div>
            </div>

            {/* Story Details */}
            <div className="p-6">
              <div className="mb-4">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Original Prompt</span>
                <p className="text-slate-700 font-bold text-sm line-clamp-2 italic">
                  "{story.prompt || "No prompt found"}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Creator ID</span>
                  <span className="text-[10px] font-mono text-blue-500 font-bold truncate w-24">
                    {story.userId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Pages</span>
                  <span className="font-black text-slate-800 text-sm">{story.pages?.length || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}