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
import { Mail, Loader2, FileDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // <-- Add this import

const STATUS_FLOW = ["Processing", "Sent for Printing", "Shipped", "Delivered"];

export default function OrderManager() {
  const { user } = useAuth(); // <-- Get user state
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("hardcopy");
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    // 1. Agar user nahi hai (logout), toh listener mat lagao aur orders khali kar do
    if (!user) {
      setOrders([]);
      return;
    }

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    // 2. onSnapshot ko error handler ke saath setup karo
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      },
      (error) => {
        // 3. Logout ke time aane wali permission error ko yahan handle karo
        if (error.code === 'permission-denied') {
          console.warn("Ops Listener: Permissions revoked (User logged out).");
        } else {
          console.error("Firestore Error:", error);
        }
      }
    );

    // 4. Cleanup function: Component unmount ya user logout pe listener band karega
    return () => unsubscribe();
  }, [user]); // <-- User dependency add karna zaroori hai

  // --- 100% SAME TEMPLATE AS LIBRARY FEED ---
  const generateOpsHtml = (order) => {
    // Yahan check karo agar data missing hai toh placeholder use ho
    const pages = order.pages || [];
    const images = order.images || [];
    const frontCoverImg = order.coverImage || images[0] || "https://placehold.co/600x800?text=No+Cover";
    
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=Inter:ital,wght@0,900;1,900&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 0; background: #FEF9EF; font-family: 'Inter', sans-serif; color: #1A365D; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { size: 297mm 210mm; margin: 0; }
            .page { width: 297mm; height: 210mm; display: flex; page-break-after: always; border: 15px solid white; box-sizing: border-box; position: relative; overflow: hidden; background: #FFFCF9; }
            .front-cover { background: #000 !important; justify-content: flex-end; align-items: center; }
            .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
            .vignette { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 30%, transparent 50%); z-index: 2; }
            .cover-content { position: relative; z-index: 10; padding-bottom: 30px; text-align: center; width: 100%; }
            .generic-title { font-size: 45px; font-weight: 900; font-style: italic; color: #FFD166 !important; margin: 0 0 10px 0; text-transform: uppercase; text-shadow: 0 5px 15px rgba(0,0,0,0.8); }
            .img-container { width: 50%; height: 100%; border-right: 10px solid white; overflow: hidden; }
            .img-container img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .text-container { width: 50%; padding: 60px; background: #FFFCF9 !important; display: flex; align-items: center; box-sizing: border-box; }
            .story-text { font-size: 28px; line-height: 1.4; font-weight: 800; letter-spacing: -1px; margin: 0; text-align: left; }
            .story-text::first-letter { color: #EF476F !important; font-family: 'Plus Jakarta Sans', sans-serif; float: left; font-size: 80px; line-height: 0.8; padding-right: 15px; font-weight: 900; }
            .back-cover { background: #480CA8 !important; color: white !important; border: none; justify-content: center; align-items: center; }
            .back-inner { width: 90%; height: 90%; border: 8px double rgba(255,255,255,0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; }
            * { -webkit-print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          <div class="page front-cover">
            <img src="${frontCoverImg}" class="hero-bg" />
            <div class="vignette"></div>
            <div class="cover-content">
              <h1 class="generic-title">A MAGICAL STORY INSIDE</h1>
              <div style="font-size: 18px; font-weight: 900; font-style: italic; color: #06D6A0; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px;">Crafted by GinnieTales ✨</div>
              <div style="font-size: 12px; color: white; opacity: 0.8; letter-spacing: 4px;">VENDOR COPY | ORDER: ${order.orderId || order.id.slice(0,8)}</div>
            </div>
          </div>
          ${pages.map((text, i) => `
            <div class="page">
              <div class="img-container"><img src="${images[i] || frontCoverImg}" /></div>
              <div class="text-container">
                <p class="story-text">${text}</p>
              </div>
            </div>
          `).join('')}
          <div class="page back-cover">
            <div class="back-inner">
              <div style="font-size: 80px; margin-bottom: 20px;">🧞‍♂️</div>
              <h2 style="font-size: 90px; font-weight: 900; font-style: italic; color: #FFD166; margin: 0; text-transform: uppercase;">The End</h2>
              <div style="margin-top: 60px; font-size: 24px; font-weight: 900; font-style: italic; color: #4CC9F0; letter-spacing: 4px;">GinnieTales Admin View</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const sendToPrinting = async (order) => {
    // CRITICAL CHECK: Agar data missing hai toh warn karo
    if (!order.pages || order.pages.length === 0) {
      alert("Error: Pages missing in this Order document! Check your Firebase verify route.");
      return;
    }

    setSendingId(order.id);
    try {
      const response = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyHtml: generateOpsHtml(order),
          userEmail: "siddharthasrivastava30@gmail.com", // Admin/Ops email
          storyTitle: `PRINT_READY_${order.orderId || order.id.slice(0,6)}`
        }),
      });

      if (response.ok) {
        if(order.planType === 'hardcopy') {
          await handleStatusChange(order.id, "Sent for Printing");
        }
        alert("Magic Sent to Printing! 🧞‍♂️📧");
      } else {
        throw new Error("Email failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSendingId(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastUpdated: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
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
            <div className="w-24 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner flex items-center justify-center relative group">
              {order.coverImage ? (
                <img src={order.coverImage} className="w-full h-full object-cover" alt={order.storyTitle} />
              ) : (
                <span className="text-2xl">📖</span>
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
               <p className="text-xs font-mono text-slate-400 uppercase">Order ID: {order.orderId || order.id.slice(0,10)}</p>
               
               {order.planType === 'hardcopy' && order.shipping && (
                 <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Shipping Details</p>
                    <p className="text-sm font-bold text-slate-700">{order.shipping.name} - <span className="text-orange-600">{order.shipping.phone}</span></p>
                    <p className="text-xs text-slate-500 leading-relaxed">{order.shipping.address}, {order.shipping.city} - {order.shipping.pincode}</p>
                 </div>
               )}
            </div>

            {/* Status & Actions Section */}
            <div className="w-full md:w-72 space-y-3">
              <button 
                onClick={() => sendToPrinting(order)}
                disabled={sendingId === order.id}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all disabled:opacity-50 shadow-xl"
              >
                {sendingId === order.id ? <Loader2 className="animate-spin" size={14} /> : <Mail size={14} />}
                {sendingId === order.id ? "Sending..." : "Send to Printing"}
              </button>

              <div className="flex flex-col gap-1">
                {order.planType === 'hardcopy' ? (
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-100 border-none font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer text-sm"
                  >
                    {STATUS_FLOW.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full p-4 rounded-2xl bg-blue-50 border border-blue-100 font-bold text-blue-600 text-center uppercase text-[10px] tracking-widest">
                    Digital Fulfilled ✅
                  </div>
                )}
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