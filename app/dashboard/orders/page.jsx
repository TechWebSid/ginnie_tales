"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Truck, CheckCircle, Clock, ArrowLeft, ExternalLink, 
  MapPin, Phone, BookOpen, ShoppingBag 
} from "lucide-react";
import { useRouter } from "next/navigation";

import Script from "next/script";
import { XCircle, Sparkles } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";

const StatusBadge = ({ status }) => {
  const styles = {
    "sent for printing": "bg-blue-100 text-blue-600 border-blue-200",
    "shipped": "bg-yellow-100 text-yellow-600 border-yellow-200",
    "delivered": "bg-green-100 text-green-600 border-green-200",
    "processing": "bg-purple-100 text-purple-600 border-purple-200",
  };

  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-[1000] uppercase tracking-widest border-2 ${styles[status.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
const [upgradingOrder, setUpgradingOrder] = useState(null); // Stores the order being upgraded
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
    <div className="min-h-screen bg-[#FEF9EF] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Package className="text-[#EF476F] w-12 h-12" />
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
  const UPGRADE_PRICE = 1000; // Difference amount

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
  <div className="min-h-screen bg-[#FEF9EF] p-6 md:p-12 font-sans">
    <div className="max-w-6xl mx-auto">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div>
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-[#118AB2] font-black uppercase text-xs mb-2 hover:translate-x-[-5px] transition-transform">
            <ArrowLeft size={16} /> Back to Magic
          </button>
          <h1 className="text-5xl md:text-6xl font-[1000] text-[#073B4C] tracking-tighter uppercase leading-none">
            My <span className="text-[#EF476F]">Adventures</span>
          </h1>
        </div>
        <div className="hidden md:block bg-white p-4 rounded-3xl shadow-[4px_4px_0px_#073B4C] border-2 border-[#073B4C]">
          <ShoppingBag className="text-[#073B4C]" />
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-[#118AB2]/20">
          <BookOpen className="mx-auto w-16 h-16 text-[#118AB2]/30 mb-4" />
          <p className="text-[#073B4C] font-black text-xl uppercase">No tales ordered yet!</p>
          <button onClick={() => router.push("/")} className="mt-6 px-8 py-4 bg-[#06D6A0] text-white rounded-2xl font-black uppercase shadow-lg hover:scale-105 transition-all">
            Start Your First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-[2.5rem] border-4 border-[#073B4C] p-6 md:p-8 shadow-[8px_8px_0px_#073B4C] hover:shadow-[12px_12px_0px_#EF476F] transition-all overflow-hidden"
              >
                <div className="grid md:grid-cols-[180px_1fr_auto] gap-8 items-center">
                  
                  {/* Cover Preview */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-[#073B4C] shadow-md group-hover:rotate-2 transition-transform">
                    {order.coverImage ? (
                      <img src={order.coverImage} className="w-full h-full object-cover" alt="Story Cover" />
                    ) : (
                      <div className="w-full h-full bg-[#F1FAEE] flex items-center justify-center text-[#118AB2] font-black">COVER</div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div>
                      <StatusBadge status={order.status || "Sent for Printing"} />
                      <h3 className="text-2xl md:text-3xl font-[1000] text-[#073B4C] uppercase tracking-tighter mt-2">
                        {order.storyTitle || "Mysterious Adventure"}
                      </h3>
                      <p className="text-xs font-black text-[#118AB2] uppercase tracking-widest opacity-60">ID: {order.id.slice(0, 8)}</p>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FFD166] rounded-lg flex items-center justify-center border-2 border-[#073B4C] shadow-[2px_2px_0px_#073B4C]">
                          <MapPin size={14} className="text-[#073B4C]" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 max-w-[200px] line-clamp-1">{order.shipping?.address || "Digital Download"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#06D6A0] rounded-lg flex items-center justify-center border-2 border-[#073B4C] shadow-[2px_2px_0px_#073B4C]">
                          <Phone size={14} className="text-[#073B4C]" />
                        </div>
                        <span className="text-xs font-bold text-slate-500">{order.shipping?.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => router.push(`/story/${order.storyId}`)}
                      className="px-6 py-3 bg-[#EF476F] text-white rounded-xl font-black uppercase text-xs shadow-[4px_4px_0px_#C9184A] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                    >
                      Read Online <ExternalLink size={14} />
                    </button>
                    
                    {/* Upgrade Button Logic */}
                    {order.planType === "ebook" && (
                      <button 
                        onClick={() => handleUpgradeClick(order)}
                        className="px-6 py-3 bg-[#06D6A0] text-white rounded-xl font-black uppercase text-xs shadow-[4px_4px_0px_#059669] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                      >
                        Order Hardcopy <Package size={14} />
                      </button>
                    )}

                    <div className="text-center">
                      <span className="text-2xl font-[1000] text-[#073B4C]">₹{order.amount / 100}</span>
                      {order.planType === "ebook" && <p className="text-[10px] font-bold text-[#118AB2]">DIGITAL ONLY</p>}
                    </div>
                  </div>
                </div>

                {/* Date Stamp */}
                <div className="absolute top-4 right-8 opacity-10 pointer-events-none">
                  <span className="text-6xl font-black">{new Date(order.createdAt?.seconds * 1000).getFullYear()}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>

    {/* Razorpay Script Required for the upgrade payment */}
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

    {/* Shipping Modal for Upgrades */}
    <AnimatePresence>
      {showShipping && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[2rem] p-8 max-w-lg w-full border-8 border-[#FFD166] relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#073B4C] uppercase">Shipping Details</h2>
              <button onClick={() => setShowShipping(false)} className="text-slate-300 hover:text-[#EF476F]">
                <XCircle size={32} />
              </button>
            </div>
            
            <div className="space-y-4">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-[#EF476F] outline-none font-bold" 
                onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} 
              />
              <textarea 
                placeholder="Full Delivery Address" 
                className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-[#EF476F] outline-none font-bold min-h-[100px]" 
                onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Pincode" 
                className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-[#EF476F] outline-none font-bold" 
                onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})} 
              />
              
              <button 
                disabled={isUpgrading || !shippingDetails.phone || !shippingDetails.address}
                onClick={startUpgradePayment}
                className="w-full py-5 bg-[#EF476F] text-white rounded-2xl font-black uppercase shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isUpgrading ? "Starting Magic..." : "Pay ₹1000 for Hardcover"} <Sparkles size={18} />
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