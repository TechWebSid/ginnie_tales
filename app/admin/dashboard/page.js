"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// NEW COMPONENTS
import AdminStats from "@/components/admin/AdminStats";
import UserDirectory from "@/components/admin/UserDirectory";
import LibraryFeed from "@/components/admin/LibraryFeed";
import { BookOpen, Users, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/signin");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
      <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4" />
      <span className="font-black text-sm uppercase tracking-[0.4em] text-slate-400 animate-pulse text-center">
        Verifying Command Credentials...
      </span>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#F0F4FF] p-4 sm:p-6 md:p-12 font-sans relative overflow-x-hidden">
      
      {/* 🔮 Aesthetic Background Elements */}
      <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-[0.02] select-none w-44 md:w-64">
        <img src="/genie.png" alt="Oversight Genie" className="w-full h-auto" />
      </div>

      {/* --- HEADER COMMAND CENTER --- */}
      {/* FIXED: Boosted top safety margins (pt-28 md:pt-36) to cleanly clear space beneath global layout headers */}
      <header className="max-w-7xl mx-auto mb-8 md:mb-16 pt-28 md:pt-36 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none">
            Admin <span className="text-blue-500 block sm:inline">Command</span> Center
          </h1>
          <p className="text-slate-400 font-black text-[9px] sm:text-xs uppercase tracking-[0.25em] block opacity-80">
            GinnieTales Oversight v1.0
          </p>
        </div>
        
        {/* Responsive Status Badge Tracker */}
        <div className="bg-white p-4 px-6 md:px-8 rounded-2xl md:rounded-3xl shadow-sm border-2 border-white flex gap-6 w-full sm:w-auto justify-between sm:justify-start items-center">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">System Pulse</span>
            <span className="font-black uppercase italic text-xs md:text-sm text-green-500 flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span> 
              Live Feed
            </span>
          </div>
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <ShieldAlert size={16} />
          </div>
        </div>
      </header>

      {/* --- MAIN ACTION CONTROL GRIDS --- */}
      <main className="max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <AdminStats />

        {/* SECTION 2: LIBRARY RECENT FEED CARDS */}
        <section className="bg-white p-5 sm:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-xl shadow-blue-100/40 border-2 border-white/50">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
              <BookOpen size={20} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-xl md:text-3xl font-[1000] text-slate-900 uppercase italic tracking-tight">Recent Tales</h2>
          </div>
          <LibraryFeed />
        </section>

        {/* SECTION 3: USER SYSTEM DIRECTORY */}
        <section className="bg-slate-900 p-5 sm:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl text-white border border-slate-800">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0">
              <Users size={20} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-xl md:text-3xl font-[1000] uppercase italic tracking-tight">User Directory</h2>
          </div>
          <UserDirectory />
        </section>
      </main>
    </div>
  );
}