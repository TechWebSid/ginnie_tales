"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import UserDirectory from "@/components/admin/UserDirectory";
import LibraryFeed from "@/components/admin/LibraryFeed"; // NEW IMPORT

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

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black tracking-[1em] uppercase animate-pulse">Verify Admin...</div>;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#F0F4FF] p-8 md:p-12">
      <header className="max-w-7xl mx-auto mb-16 flex justify-between items-center">
        <div>
            <h1 className="text-6xl font-[1000] text-slate-900 tracking-tighter uppercase italic">
            Admin <span className="text-blue-500">Command</span> Center
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">GinnieTales Oversight v1.0</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border-4 border-white flex gap-6">
            <StatSmall label="Active Feed" value="Live" color="text-green-500" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-20">
        {/* SECTION 1: LIBRARY FEED (Visual Content) */}
        <section>
           <LibraryFeed />
        </section>

        {/* SECTION 2: USER DIRECTORY (Data) */}
        <section>
           <UserDirectory />
        </section>
      </main>
    </div>
  );
}

function StatSmall({ label, value, color }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
            <span className={`font-black uppercase italic ${color}`}>{value}</span>
        </div>
    )
}