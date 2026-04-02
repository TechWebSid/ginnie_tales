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
import { BookOpen, Users } from "lucide-react";

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black tracking-[1em] uppercase animate-pulse">
      Verify Admin...
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#F0F4FF] p-8 md:p-12">
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-6xl font-[1000] text-slate-900 tracking-tighter uppercase italic">
            Admin <span className="text-blue-500">Command</span> Center
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">GinnieTales Oversight v1.0</p>
        </div>
        <div className="bg-white p-4 px-8 rounded-3xl shadow-sm border-4 border-white flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">System Status</span>
            <span className="font-black uppercase italic text-green-500 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Live Feed
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* SECTION 1: STATS (The New Component) */}
        <AdminStats />

        {/* SECTION 2: LIBRARY FEED */}
        <section className="bg-white p-8 rounded-[3.5rem] shadow-xl shadow-blue-100/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600"><BookOpen /></div>
            <h2 className="text-3xl font-[1000] text-slate-900 uppercase italic">Recent Tales</h2>
          </div>
          <LibraryFeed />
        </section>

        {/* SECTION 3: USER DIRECTORY */}
        <section className="bg-slate-900 p-8 rounded-[3.5rem] shadow-2xl text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><Users /></div>
            <h2 className="text-3xl font-[1000] uppercase italic">User Directory</h2>
          </div>
          <UserDirectory />
        </section>
      </main>
    </div>
  );
}