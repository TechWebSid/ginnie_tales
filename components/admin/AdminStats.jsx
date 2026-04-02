"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, BookText, HardDriveDownload, Package, Loader2 } from "lucide-react";

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-[2.5rem] animate-pulse border-4 border-white" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label="Total Revenue" 
        value={`₹${stats?.totalEarning || 0}`} 
        icon={<Wallet />} 
        color="bg-blue-600" 
        delay={0.1}
      />
      <StatCard 
        label="Total Orders" 
        value={stats?.totalOrders || 0} 
        icon={<Package />} 
        color="bg-slate-900" 
        delay={0.2}
      />
      <StatCard 
        label="E-Books Sold" 
        value={stats?.ebookCount || 0} 
        icon={<HardDriveDownload />} 
        color="bg-emerald-500" 
        delay={0.3}
      />
      <StatCard 
        label="Hardcopies" 
        value={stats?.hardcopyCount || 0} 
        icon={<BookText />} 
        color="bg-orange-500" 
        delay={0.4}
      />
    </div>
  );
}

function StatCard({ label, value, icon, color, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-[2.5rem] shadow-sm border-4 border-white flex items-center gap-6 group hover:shadow-xl transition-all duration-500"
    >
      <div className={`w-16 h-16 ${color} rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">
          {label}
        </span>
        <span className="text-3xl font-[1000] text-slate-900 tracking-tighter italic">
          {value}
        </span>
      </div>
    </motion.div>
  );
}