"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Squash as Hamburger } from "hamburger-react";
import { Sparkles, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Firebase Imports
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Logout Logic
  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Magic Lab", href: "/story" },
    { name: "Safety", href: "/#safety" },
    { name: "Themes", href: "/#themes" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 pointer-events-none">
      {/* 🌫️ Top Fade for readability */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/60 via-white/20 to-transparent -z-10" />
      
      <div className="max-w-[90rem] mx-auto flex justify-between items-center pointer-events-auto">
        
        {/* 🎨 LOGO - Shifted slightly left to make room for center */}
        <Link href="/">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-white border-[5px] border-white shadow-[0_8px_0_#e2e8f0] px-6 py-3 rounded-2xl flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-blue-500 p-2 rounded-lg text-white">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <span className="font-[1000] text-2xl tracking-tighter italic uppercase text-slate-800">
              Ginnie<span className="text-blue-500">Tales</span>
            </span>
          </motion.div>
        </Link>

        {/* 💻 DESKTOP MENU - Pushed right to avoid the center Genie area */}
        {!loading && (
          <div className="hidden md:flex items-center gap-4 bg-white/90 backdrop-blur-xl border-[5px] border-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] px-4 py-2 rounded-[2rem] ml-auto">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="px-5 py-2 font-black text-sm uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">
                {link.name}
              </Link>
            ))}

            <div className="w-[2px] h-6 bg-slate-100 mx-2" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-100 transition-all">
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/signin">
                <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_6px_0_#1e293b] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">
                  <LogIn size={16} /> Sign In
                </button>
              </Link>
            )}
          </div>
        )}

        {/* 📱 MOBILE HAMBURGER */}
        <div className="md:hidden bg-white border-[5px] border-white shadow-xl rounded-2xl pointer-events-auto">
          <Hamburger toggled={isOpen} toggle={setOpen} size={24} color="#1e293b" rounded />
        </div>
      </div>

      {/* 📱 MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-28 left-6 right-6 bg-white border-[10px] border-white shadow-2xl rounded-[3rem] p-10 flex flex-col items-center gap-8 md:hidden pointer-events-auto"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setOpen(false)}
                className="text-3xl font-[1000] uppercase italic tracking-tighter text-slate-800 hover:text-blue-500"
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="w-full border-slate-100" />

            {user ? (
              <div className="flex flex-col w-full gap-4">
                <Link href="/dashboard" className="w-full" onClick={() => setOpen(false)}>
                    <button className="w-full bg-blue-500 text-white py-5 rounded-2xl font-black text-xl shadow-[0_8px_0_#1d4ed8]">
                        DASHBOARD
                    </button>
                </Link>
                <button 
                    onClick={handleLogout}
                    className="text-red-400 font-black uppercase tracking-widest text-sm"
                >
                    Logout 🚪
                </button>
              </div>
            ) : (
              <Link href="/signin" className="w-full" onClick={() => setOpen(false)}>
                <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-2xl tracking-widest shadow-[0_10px_0_#1e293b]">
                  SIGN IN
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}