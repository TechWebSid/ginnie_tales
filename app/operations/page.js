"use client";
import React from "react";
import OrderManager from "@/components/operations/OrderManager";
import RoleGuard from "@/components/auth/RoleGuard";

export default function OperationsDashboard() {
  // Page ka apna redirect logic nikal diya, kyunki RoleGuard check kar raha hai
  return (
    <RoleGuard allowedRoles={['operational', 'admin']}>
      <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10">
        <header className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-[1000] text-slate-900 tracking-tighter uppercase italic">
              Ops <span className="text-orange-500 underline decoration-slate-900">Unit</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 text-[10px]">
              GinnieTales Logistics & Print
            </p>
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
    </RoleGuard>
  );
}