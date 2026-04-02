"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import OrderManager from "@/components/operations/OrderManager";

export default function OperationsDashboard() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Updated role check to "operational"
          if (userData.role === "admin" || userData.role === "operational") {
            setHasAccess(true);
          } else {
            router.push("/dashboard");
          }
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

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black tracking-[1em] uppercase animate-pulse italic">Accessing Ops...</div>;

  if (!hasAccess) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-[1000] text-slate-900 tracking-tighter uppercase italic">
            Ops <span className="text-orange-500 underline decoration-slate-900">Unit</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 text-[10px]">GinnieTales Logistics & Print</p>
        </div>
        <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Time</p>
            <p className="font-mono text-slate-900 font-bold">{new Date().toLocaleTimeString()}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <OrderManager />
      </main>
    </div>
  );
}