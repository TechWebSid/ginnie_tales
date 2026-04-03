"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Truck, CheckCircle, Clock, ArrowLeft, ExternalLink, 
  MapPin, Phone, BookOpen, ShoppingBag, X, Sparkles, Star, CreditCard
} from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import RoleGuard from "@/components/auth/RoleGuard";

const StatusBadge = ({ status }) => {
  const configs = {
    "sent for printing": { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: <Clock size={12} /> },
    "shipped": { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: <Truck size={12} /> },
    "delivered": { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle size={12} /> },
    "processing": { color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", icon: <Sparkles size={12} /> },
    "digital delivered": { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle size={12} /> },
  };

  const config = configs[status.toLowerCase()] || { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", icon: <Package size={12} /> };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.color} ${config.border} shadow-sm`}>
      {config.icon}
      {status}
    </div>
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
        const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleUpgradeClick = (order) => {
    setUpgradingOrder(order);
    setShowShipping(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FEF9EF] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Package className="text-[#EF476F] w-16 h-16" />
      </motion.div>
      <p className="font-black text-[#073B4C] uppercase tracking-widest animate-pulse">Summoning your tales...</p>
    </div>
  );

  return (
    <RoleGuard allowedRoles={["explorer"]}>
      {/* 
         FIX: Added pt-28 (Mobile) and md:pt-36 (Desktop) 
         to prevent the header from hiding behind the fixed navbar 
      */}
      <div className="min-h-screen bg-[#FEF9EF] relative overflow-hidden pt-28 md:pt-36">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-[#FFD166]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#118AB2]/10 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-16 relative z-10">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <button 
                onClick={() => router.push("/")} 
                className="group flex items-center gap-2 text-[#118AB2] font-black uppercase text-xs hover:text-[#073B4C] transition-colors"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Return to Kingdom
              </button>
              <h1 className="text-5xl md:text-8xl font-[1000] text-[#073B4C] tracking-tighter uppercase leading-[0.8] mb-2">
                My <span className="text-[#EF476F] block md:inline">Adventures</span>
              </h1>
              <p className="text-[#118AB2] font-bold text-sm md:text-base uppercase tracking-tighter italic">
                A collection of your magical journeys and hardcopy treasures
              </p>
            </div>
            
            {/* Library Size Counter */}
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 pr-6 rounded-full border-2 border-[#073B4C]/5 self-start md:self-center shadow-sm">
              <div className="w-12 h-12 bg-[#06D6A0] rounded-full flex items-center justify-center border-2 border-[#073B4C] shadow-[2px_2px_0px_#073B4C]">
                <Star className="text-white fill-white" size={20} />
              </div>
              <div className="pr-2">
                <p className="text-[10px] font-black text-[#073B4C]/40 uppercase leading-none mb-1">Library Size</p>
                <p className="text-xl font-black text-[#073B4C] leading-none">{orders.length} Books</p>
              </div>
            </div>
          </header>

          {/* Orders List */}
          {orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white/80 backdrop-blur-sm rounded-[4rem] border-4 border-dashed border-[#118AB2]/20"
            >
              <div className="w-24 h-24 bg-[#F1FAEE] rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-[#118AB2]/30" />
              </div>
              <h2 className="text-2xl font-black text-[#073B4C] uppercase mb-2">Your shelf is empty!</h2>
              <p className="text-slate-500 font-medium mb-8">Every hero needs a story. Let's create yours.</p>
              <button 
                onClick={() => router.push("/")} 
                className="px-10 py-5 bg-[#06D6A0] text-white rounded-2xl font-black uppercase shadow-[0_8px_0_#059669] hover:shadow-none hover:translate-y-1 transition-all"
              >
                Write Your First Tale
              </button>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-[2.5rem] border-[3px] border-[#073B4C] p-5 md:p-8 shadow-[12px_12px_0px_#073B4C] hover:shadow-[12px_12px_0px_#EF476F] transition-all"
                  >
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                      
                      {/* Book Thumbnail */}
                      <div className="relative w-full max-w-[200px] lg:w-48 aspect-[3/4] flex-shrink-0">
                        <div className="absolute inset-0 bg-[#073B4C] rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                        <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-[#073B4C] bg-slate-100 shadow-inner">
                          {order.coverImage ? (
                            <img src={order.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-slate-300" /></div>
                          )}
                        </div>
                      </div>

                      {/* Info & Details */}
                      <div className="flex-1 w-full space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <StatusBadge status={order.status || "Processing"} />
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {order.id.slice(-8)}</span>
                        </div>

                        <div>
                          <h3 className="text-3xl md:text-5xl font-[1000] text-[#073B4C] uppercase tracking-tighter leading-[0.9] group-hover:text-[#EF476F] transition-colors">
                            {order.storyTitle || "An Untold Adventure"}
                          </h3>
                          <p className="text-[#118AB2] font-black text-[10px] uppercase tracking-widest mt-1">Ordered on {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-[#073B4C]/10 shadow-sm">
                              <MapPin size={18} className="text-[#EF476F]" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                              <p className="text-xs font-bold text-[#073B4C] line-clamp-1">{order.shipping?.address || "Digital Realm (Email)"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-[#073B4C]/10 shadow-sm">
                              <Package size={18} className="text-[#118AB2]" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Edition</p>
                              <p className="text-xs font-bold text-[#073B4C] uppercase tracking-tight">{order.planType === 'ebook' ? '✨ Digital E-Book' : '📚 Premium Hardcover'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-6 border-t lg:border-t-0 lg:border-l border-[#073B4C]/10 pt-6 lg:pt-0 lg:pl-10">
                        <div className="text-left lg:text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investment</p>
                          {/* FIX: Use short-circuiting to prevent NaN display */}
                          <p className="text-4xl font-[1000] text-[#073B4C]">
                            ₹{order.amount ? (order.amount / 100).toLocaleString('en-IN') : '0'}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-3 min-w-[180px]">
                          <button 
                            onClick={() => router.push(`/story/${order.storyId}`)}
                            className="w-full py-4 bg-[#073B4C] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#118AB2] transition-colors flex items-center justify-center gap-2 shadow-md"
                          >
                            Read Online <ExternalLink size={14} />
                          </button>
                          
                          {order.planType === "ebook" && (
                            <button 
                              onClick={() => handleUpgradeClick(order)}
                              className="w-full py-4 bg-[#06D6A0] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-[0_4px_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 border-2 border-white/20"
                            >
                              Upgrade to Hardcopy <Sparkles size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Shipping Modal */}
        <AnimatePresence>
          {showShipping && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShipping(false)} className="absolute inset-0 bg-[#073B4C]/90 backdrop-blur-md" />
              
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }} 
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative bg-white w-full max-w-lg rounded-[3rem] border-[6px] border-[#FFD166] shadow-2xl overflow-hidden"
              >
                <div className="bg-[#FFD166] p-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Truck className="text-[#073B4C]" size={20} />
                    </div>
                    <h2 className="text-xl font-black text-[#073B4C] uppercase">Delivery Details</h2>
                  </div>
                  <button onClick={() => setShowShipping(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X size={24} className="text-[#073B4C]" /></button>
                </div>

                <div className="p-8 space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#118AB2] uppercase ml-2">Contact Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210" 
                      className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#EF476F] outline-none font-bold transition-all" 
                      onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#118AB2] uppercase ml-2">Full Address</label>
                    <textarea 
                      placeholder="House No, Street, Landmark..." 
                      className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#EF476F] outline-none font-bold min-h-[120px] transition-all resize-none" 
                      onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#118AB2] uppercase ml-2">Pincode</label>
                      <input 
                        type="text" 
                        placeholder="110001" 
                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#EF476F] outline-none font-bold transition-all" 
                        onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})} 
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
                        <CheckCircle className="text-emerald-500" size={14} />
                        <span className="text-[9px] font-bold text-emerald-700 leading-tight uppercase">Free Shipping <br/>Included</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={isUpgrading || !shippingDetails.phone || !shippingDetails.address}
                    onClick={startUpgradePayment}
                    className="w-full mt-4 py-5 bg-[#EF476F] text-white rounded-2xl font-[1000] uppercase shadow-[0_8px_0_#C9184A] flex items-center justify-center gap-3 hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50"
                  >
                    {isUpgrading ? "Processing..." : "Pay ₹1,000 & Upgrade"} <CreditCard size={18} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </div>
    </RoleGuard>
  );
}