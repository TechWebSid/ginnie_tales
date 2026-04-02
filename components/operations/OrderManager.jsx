"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

const STATUS_FLOW = ["Processing", "Sent for Printing", "Shipped", "Delivered"];

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("hardcopy"); // Default to Hardcopy for Ops

  useEffect(() => {
    // Real-time listener for ALL orders
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastUpdated: serverTimestamp()
      });
      // Optional: Add a sound or toast notification here
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === "hardcopy") return o.planType === "hardcopy";
    if (filter === "digital") return o.planType === "digital" || !o.planType;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* FILTER CONTROLS */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <button 
          onClick={() => setFilter("hardcopy")}
          className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-tighter transition-all ${filter === 'hardcopy' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-slate-400'}`}
        >
          📦 Hardcopy Orders
        </button>
        <button 
          onClick={() => setFilter("digital")}
          className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-tighter transition-all ${filter === 'digital' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-slate-400'}`}
        >
          📱 Digital Only
        </button>
      </div>

      {/* ORDERS GRID */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-white flex flex-col md:flex-row gap-8 items-center transition-all hover:border-orange-200">
            
            {/* Story Preview */}
        <div className="w-24 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner flex items-center justify-center">
  {order.coverImage ? (
    <img 
      src={order.coverImage} 
      className="w-full h-full object-cover" 
      alt={order.storyTitle} 
    />
  ) : (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl">📖</span>
      <span className="text-[8px] font-black text-slate-400 uppercase">No Cover</span>
    </div>
  )}
</div>

            {/* Info Section */}
            <div className="flex-1 space-y-2">
               <div className="flex items-center gap-3">
                 <h3 className="text-xl font-black text-slate-900 italic tracking-tight">{order.storyTitle}</h3>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.planType === 'hardcopy' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                   {order.planType?.toUpperCase()}
                 </span>
               </div>
               <p className="text-xs font-mono text-slate-400">ORDER_ID: {order.orderId || order.id}</p>
               
               {/* Shipping Info - Only if Hardcopy */}
               {order.planType === 'hardcopy' && order.shipping && (
                 <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Shipping Address</p>
                    <p className="text-sm font-bold text-slate-700">{order.shipping.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{order.shipping.address}, {order.shipping.city}, {order.shipping.pincode}</p>
                    <p className="text-sm font-black text-orange-600 mt-2">📞 {order.shipping.phone}</p>
                 </div>
               )}
            </div>

            {/* Status Control */}
           {/* Status Control Section */}
<div className="w-full md:w-64 space-y-3">
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {order.planType === 'hardcopy' ? "Update Status" : "Order Status"}
    </label>

    {/* Yahan Check Lagaya Hai: Dropdown sirf Hardcopy ke liye */}
    {order.planType === 'hardcopy' ? (
      <select 
        value={order.status}
        onChange={(e) => handleStatusChange(order.id, e.target.value)}
        className="w-full p-4 rounded-2xl bg-slate-100 border-none font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer"
      >
        {STATUS_FLOW.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    ) : (
      /* Digital orders ke liye sirf static text dikhega */
      <div className="w-full p-4 rounded-2xl bg-blue-50 border border-blue-100 font-bold text-blue-600 text-center uppercase text-xs">
        Digital Fulfilled ✅
      </div>
    )}
  </div>

  {/* Status Visual - Ye dono ke liye dikhega current state batane ke liye */}
  <div className={`p-4 rounded-2xl ${order.planType === 'hardcopy' ? 'bg-slate-900' : 'bg-slate-200'}`}>
    <p className={`text-[10px] font-black uppercase ${order.planType === 'hardcopy' ? 'text-slate-500' : 'text-slate-400'}`}>
      Current View
    </p>
    <p className={`font-black italic text-center uppercase tracking-wider ${order.planType === 'hardcopy' ? 'text-white' : 'text-slate-600'}`}>
      {order.status}
    </p>
  </div>
</div>

          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="py-20 text-center font-black text-slate-300 uppercase tracking-[0.5em]">No Pending Tasks</div>
        )}
      </div>
    </div>
  );
}