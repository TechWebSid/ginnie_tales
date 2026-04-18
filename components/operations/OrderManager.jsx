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
import { Mail, Loader2, CheckCircle2 } from "lucide-react"; // Icons for Ops

const STATUS_FLOW = ["Processing", "Sent for Printing", "Shipped", "Delivered"];

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("hardcopy");
  const [sendingId, setSendingId] = useState(null); // Tracking email state

  useEffect(() => {
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

  // --- HTML TEMPLATE (Same as Admin/Library) ---
  const generateOpsHtml = (order) => {
    const frontCoverImg = order.coverImage || "https://placehold.co/600x800?text=No+Cover";
    return `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=Inter:wght@900&display=swap');
            body { margin: 0; padding: 0; background: #FEF9EF; font-family: 'Inter', sans-serif; }
            @page { size: 297mm 210mm; margin: 0; }
            .page { width: 297mm; height: 210mm; display: flex; page-break-after: always; border: 15px solid white; box-sizing: border-box; position: relative; overflow: hidden; background: #FFFCF9; }
            .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
            .vignette { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); z-index: 2; }
            .cover-text { position: absolute; bottom: 50px; width: 100%; text-align: center; z-index: 10; color: #FFD166; font-size: 40px; text-transform: uppercase; font-style: italic; }
            .img-side { width: 50%; height: 100%; border-right: 10px solid white; }
            .img-side img { width: 100%; height: 100%; object-fit: cover; }
            .text-side { width: 50%; padding: 60px; display: flex; align-items: center; background: #FFFCF9; }
            .story-p { font-size: 28px; line-height: 1.5; font-weight: 800; color: #073B4C; }
            .back-cover { background: #480CA8 !important; justify-content: center; align-items: center; color: white; }
          </style>
        </head>
        <body>
          <div class="page"><img src="${frontCoverImg}" class="hero-bg"/><div class="vignette"></div><div class="cover-text">${order.storyTitle}</div></div>
          ${order.pages?.map((text, i) => `
            <div class="page">
              <div class="img-side"><img src="${order.images?.[i] || frontCoverImg}"/></div>
              <div class="text-side"><p class="story-p">${text}</p></div>
            </div>
          `).join('') || ''}
          <div class="page back-cover"><h1>GINNIETALES OPS COPY</h1></div>
        </body>
      </html>
    `;
  };

  // --- SEND TO PRINTING GMAIL ---
  const sendToPrinting = async (order) => {
    setSendingId(order.id);
    try {
      const res = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyHtml: generateOpsHtml(order),
          userEmail: "siddharthasrivastava30@gmail.com", // Aapki working email
          storyTitle: `PRINT_READY_${order.orderId || order.id.slice(0,6)}`
        })
      });

      if (res.ok) {
        // Automatically update status to "Sent for Printing" after successful email
        if(order.planType === 'hardcopy') {
          await handleStatusChange(order.id, "Sent for Printing");
        }
        alert("Sent to Printing Gmail! 🧞‍♂️🖨️");
      } else {
        alert("Failed to send.");
      }
    } catch (err) {
      console.error(err);
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