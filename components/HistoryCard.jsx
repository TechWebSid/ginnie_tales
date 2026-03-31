"use client";

import { motion } from "framer-motion";
import { BookOpen, Download, Calendar, Wand2, Trash2 } from "lucide-react";

export default function HistoryCard({ story, onOpen, onDelete }) {
  // Format the Firebase Timestamp
  const date = story.createdAt?.toDate 
    ? story.createdAt.toDate().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) 
    : "Magic Moment";

  const handleDownload = (e) => {
    e.stopPropagation(); 
    const storyText = story.pages.join("\n\n");
    const blob = new Blob([storyText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GinnieTale-${story.prompt.substring(0, 20)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Don't open the book when clicking delete
    if (window.confirm("Are you sure you want to delete this magic tale?")) {
      onDelete(story.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2.5rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border-4 border-white hover:border-blue-100 transition-all cursor-pointer"
      onClick={() => onOpen(story)}
    >
      {/* IMAGE PREVIEW */}
      <div className="relative aspect-[4/5] mb-5 overflow-hidden rounded-[1.8rem] bg-slate-100 border-2 border-slate-50">
        <img
          src={story.images[0] || story.coverImage}
          alt="Story Cover"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
           <p className="text-white text-xs font-bold italic line-clamp-2">
             "{story.prompt}"
           </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
            <Calendar size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
          </div>
          
          {/* TRASH ICON */}
          <button 
            onClick={handleDelete}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <h3 className="text-lg font-[1000] text-slate-800 line-clamp-1 leading-tight px-1">
          {story.prompt}
        </h3>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-[0_4px_0_#1e40af] active:translate-y-1 active:shadow-none transition-all">
            <BookOpen size={14} /> READ
          </button>
          <button 
            onClick={handleDownload}
            className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-200 transition-colors"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}