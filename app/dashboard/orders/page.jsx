"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Truck, CheckCircle, Clock, ArrowLeft, ExternalLink, 
  MapPin, Phone, BookOpen, ShoppingBag, XCircle, Sparkles 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; 
import RoleGuard from "@/components/auth/RoleGuard";

const StatusBadge = ({ status }) => {
  const styles = {
    "sent for printing": "bg-blue-50 text-blue-600 border-blue-200",
    "shipped": "bg-yellow-50 text-yellow-600 border-yellow-200",
    "delivered": "bg-green-50 text-green-600 border-green-200",
    "processing": "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-[1000] uppercase tracking-widest border-2 ${styles[status.toLowerCase()] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradingOrder, setUpgradingOrder] = useState(null); 
  const [showShipping, setShowShipping] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({ phone: "", address: "", pincode: "" });
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-[#FEF9EF] flex items-center justify-center p-6">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
        <Package className="text-[#EF476F] w-14 h-14 drop-shadow-md" />
      </motion.div>
    </div>
  );

  const handleUpgradeClick = (order) => {
    setUpgradingOrder(order);
    setShowShipping(true);
  };

  const startUpgradePayment = async () => {
    if (!shippingDetails.phone || !shippingDetails.address) return alert("Please fill details");
    
    setIsUpgrading(true);
    const UPGRADE_PRICE = 1000; 

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: UPGRADE_PRICE, 
          storyId: upgradingOrder.storyId, 
          planType: "hardcopy" 
        }),
      });
      
      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: "INR",
        name: "Genie Tales Upgrade",
        description: "Upgrade to Hardcover Book",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              storyId: upgradingOrder.storyId,
              planType: "hardcopy",
              userId: user.uid,
              shipping: shippingDetails
            }),
          });
          if ((await verifyRes.json()).success) {
            alert("Success! Your hardcover is being prepared.");
            window.location.reload();
          }
        },
        prefill: { email: user?.email, contact: shippingDetails.phone },
        theme: { color: "#EF476F" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["explorer"]}>
      {/* FIXED: Background component adjustments without manual duplicated navbars */}
      <div className="min-h-screen bg-[#FEF9EF] pb-24 relative overflow-x-hidden">
        
        {/* Decorative elements behind content layer */}
        <div className="absolute top-36 right-0 z-0 pointer-events-none opacity-20 select-none w-32 md:w-44">
          <img src="/genie.png" alt="Lab Genie" className="w-full h-auto" />
        </div>

        {/* FIXED: Boosted top padding to pt-36/pt-44 so the global layout header never crushes the back button */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-36 md:pt-44 relative z-10">
          
          {/* Header Metadata Block */}
          <header className="flex items-center justify-between mb-10 md:mb-14">
            <div className="space-y-2">
              <button 
                onClick={() => router.push("/")} 
                className="inline-flex items-center gap-2 text-[#118AB2] font-[1000] uppercase text-xs hover:translate-x-[-4px] transition-transform outline-none"
              >
                <ArrowLeft size={14} strokeWidth={3} /> Back to Magic
              </button>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-[1000] text-[#073B4C] tracking-tighter uppercase leading-none">
                My <span className="text-[#EF476F]">Adventures</span>
              </h1>
            </div>
            <div className="hidden sm:flex bg-white p-4 rounded-2xl shadow-[4px_4px_0px_#073B4C] border-2 border-[#073B4C]">
              <ShoppingBag className="text-[#073B4C]" size={20} />
            </div>
          </header>

          {orders.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-[2rem] md:rounded-[3rem] border-4 border-dashed border-[#118AB2]/20 shadow-inner">
              <BookOpen className="mx-auto w-12 h-12 md:w-16 md:h-16 text-[#118AB2]/20 mb-4" />
              <p className="text-[#073B4C] font-black text-lg md:text-xl uppercase tracking-tight">No tales ordered yet!</p>
              <button 
                onClick={() => router.push("/")} 
                className="mt-6 px-6 py-4 bg-[#06D6A0] text-white rounded-xl font-[1000] uppercase text-sm shadow-[0_5px_0px_#048a68] border-2 border-white active:translate-y-1 active:shadow-none transition-all"
              >
                Start Your First Story
              </button>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group relative bg-white rounded-[2rem] md:rounded-[2.5rem] border-[3px] md:border-4 border-[#073B4C] p-5 md:p-8 shadow-[6px_6px_0px_#073B4C] hover:shadow-[10px_10px_0px_#EF476F] transition-all overflow-hidden"
                  >
                    <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] md:grid-cols-[160px_1fr_auto] gap-6 md:gap-8 items-center relative z-10">
                      
                      {/* Cover Preview Container */}
                      <div className="relative aspect-[3/4] w-28 sm:w-full rounded-xl overflow-hidden border-2 border-[#073B4C] shadow-sm group-hover:rotate-2 transition-transform self-center">
                        {order.coverImage ? (
                          <img src={order.coverImage} className="w-full h-full object-cover" alt="Story Blueprint Cover" />
                        ) : (
                          <div className="w-full h-full bg-[#F1FAEE] flex items-center justify-center text-[#118AB2] text-xs font-black">CANVAS</div>
                        )}
                      </div>

                      {/* Info Metadata Block */}
                      <div className="space-y-3 w-full text-center sm:text-left">
                        <div className="space-y-1">
                          <StatusBadge status={order.status || "Sent for Printing"} />
                          <h3 className="text-xl md:text-3xl font-[1000] text-[#073B4C] uppercase tracking-tighter leading-tight break-words max-w-xl">
                            {order.storyTitle || "Mysterious Adventure"}
                          </h3>
                          <p className="text-[10px] font-black text-[#118AB2] uppercase tracking-wider opacity-50">ID: {order.id.slice(0, 8)}</p>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-left">
                            <div className="w-7 h-7 bg-[#FFD166] rounded-lg flex items-center justify-center border-2 border-[#073B4C] shrink-0">
                              <MapPin size={12} className="text-[#073B4C]" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 line-clamp-1 max-w-xs md:max-w-sm">
                              {order.shipping?.address || "Digital Download"}
                            </span>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <div className="w-7 h-7 bg-[#06D6A0] rounded-lg flex items-center justify-center border-2 border-[#073B4C] shrink-0">
                              <Phone size={12} className="text-[#073B4C]" />
                            </div>
                            <span className="text-xs font-bold text-slate-500">{order.shipping?.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Interface Panel */}
                      <div className="flex flex-row md:flex-col items-center justify-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t sm:border-t-0 border-slate-100 md:self-center">
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => router.push(`/story/${order.storyId}`)}
                            className="w-full px-5 py-3 bg-[#EF476F] text-white rounded-xl font-black uppercase text-[10px] sm:text-xs shadow-[3px_3px_0px_#C9184A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-white"
                          >
                            Read Online <ExternalLink size={12} />
                          </button>
                          
                          {order.planType === "ebook" && (
                            <button 
                              onClick={() => handleUpgradeClick(order)}
                              className="w-full px-5 py-3 bg-[#06D6A0] text-white rounded-xl font-black uppercase text-[10px] sm:text-xs shadow-[3px_3px_0px_#059669] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-white"
                            >
                              Order Hardcopy <Package size={12} />
                            </button>
                          )}
                        </div>

                        <div className="text-center shrink-0 min-w-[80px]">
                          <span className="text-xl md:text-2xl font-[1000] text-[#073B4C] tracking-tight block leading-none">
                            ₹{order.amount ? (order.amount / 100) : (order.planType === "hardcopy" ? 1499 : 499)}
                          </span>
                          {order.planType === "ebook" && <p className="text-[8px] font-black text-[#118AB2] uppercase tracking-wide mt-1">Digital Link</p>}
                        </div>
                      </div>

                    </div>

                    <div className="absolute top-2 right-4 opacity-[0.04] pointer-events-none select-none hidden md:block">
                      <span className="text-7xl font-black tabular-nums">{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).getFullYear() : '2026'}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

        <AnimatePresence>
          {showShipping && (
            <div className="fixed inset-0 z-[300] bg-[#073B4C]/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#FFF9FB] rounded-[2rem] p-6 md:p-8 max-w-md w-full border-[5px] border-[#FFD166] relative shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-[1000] text-[#073B4C] uppercase tracking-tight">Delivery Hub</h2>
                  <button onClick={() => setShowShipping(false)} className="text-slate-300 hover:text-[#EF476F] transition-colors">
                    <XCircle size={28} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full p-3.5 bg-white rounded-xl border-2 border-slate-100 focus:border-[#06D6A0] outline-none font-bold text-sm text-slate-700 transition-all" 
                    onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} 
                  />
                  <textarea 
                    placeholder="Full Delivery Address" 
                    className="w-full p-3.5 bg-white rounded-xl border-2 border-slate-100 focus:border-[#06D6A0] outline-none font-bold text-sm text-slate-700 min-h-[90px] max-h-[140px] transition-all" 
                    onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Pincode" 
                    className="w-full p-3.5 bg-white rounded-xl border-2 border-slate-100 focus:border-[#06D6A0] outline-none font-bold text-sm text-slate-700 transition-all" 
                    onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})} 
                  />
                  
                  <button 
                    disabled={isUpgrading || !shippingDetails.phone || !shippingDetails.address}
                    onClick={startUpgradePayment}
                    className="w-full py-4 bg-[#EF476F] text-white rounded-xl font-black uppercase text-base shadow-[0_5px_0px_#C9184A] border-2 border-white flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {isUpgrading ? "Weaving Canvas..." : "Upgrade Book Plan"} <Sparkles size={16} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </RoleGuard>
  );
}