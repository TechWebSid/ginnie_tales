import { motion, AnimatePresence } from "framer-motion";
import { XCircle, FileDown, BookOpen, Truck, ChevronLeft, Sparkles, Star } from "lucide-react";

export default function MagicalCart({ 
  isOpen, onClose, showShippingForm, setShowShippingForm, 
  handlePlanSelection, shippingDetails, setShippingDetails, startPayment 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-[#073B4C]/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 max-w-3xl w-full border-[6px] md:border-[10px] border-[#FFD166] relative shadow-[20px_20px_0px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-[#073B4C]/30 hover:text-[#EF476F] transition-colors"
            >
              <XCircle size={36} strokeWidth={2.5} />
            </button>

            {!showShippingForm ? (
              <div className="flex flex-col h-full">
                <div className="text-center mb-8 md:mb-12">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="inline-block mb-4"
                  >
                    <Sparkles className="text-[#FFD166] w-10 h-10 mx-auto" />
                  </motion.div>
                  <h2 className="text-3xl md:text-5xl font-[1000] text-[#073B4C] uppercase leading-none tracking-tighter">
                    Unlock Your <span className="text-[#EF476F]">Tale!</span>
                  </h2>
                  <p className="text-[#118AB2] font-black uppercase text-[10px] md:text-xs tracking-[0.2em] mt-3">
                    Choose how you want to keep the magic
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Digital Plan */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    onClick={() => handlePlanSelection('ebook')} 
                    className="group cursor-pointer border-[4px] border-dashed border-[#118AB2]/30 rounded-[2rem] p-6 md:p-8 bg-[#F8F9FA] hover:bg-white hover:border-[#118AB2] hover:shadow-[8px_8px_0px_#118AB2] transition-all flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FileDown className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-[#073B4C] uppercase mb-2">Digital E-Book</h3>
                    <p className="text-slate-500 text-xs font-bold mb-4 px-4">Instant Access! Read on any tablet or phone.</p>
                    <span className="text-4xl font-[1000] text-[#EF476F] mt-auto">₹499</span>
                  </motion.div>

                  {/* Physical Plan */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    onClick={() => handlePlanSelection('hardcopy')} 
                    className="group cursor-pointer border-[4px] border-[#06D6A0] rounded-[2rem] p-6 md:p-8 bg-[#F1FAEE] hover:bg-white hover:shadow-[8px_8px_0px_#06D6A0] transition-all flex flex-col items-center text-center relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 bg-[#FFD166] px-3 py-1 rounded-full text-[10px] font-black text-[#073B4C] uppercase tracking-tighter border-2 border-[#073B4C]">Best Value</div>
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <BookOpen className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-[#073B4C] uppercase mb-2">Hardcover Book</h3>
                    <p className="text-slate-500 text-xs font-bold mb-4 px-4">Premium print + Free Digital copy included!</p>
                    <span className="text-4xl font-[1000] text-[#EF476F] mt-auto">₹1499</span>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 py-2">
                <div className="text-center">
                  <div className="bg-[#06D6A0]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Truck className="text-[#06D6A0]" size={32} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-[1000] text-[#073B4C] uppercase tracking-tight">Delivery Details</h2>
                  <p className="text-slate-400 font-bold text-sm">Where should the postman bring your tale?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#073B4C] uppercase ml-2 opacity-50">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210" 
                      className="w-full p-4 rounded-2xl bg-[#F8F9FA] border-2 border-[#F1FAEE] focus:border-[#06D6A0] outline-none font-bold text-slate-700 transition-all"
                      onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#073B4C] uppercase ml-2 opacity-50">Pincode</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 110001" 
                      className="w-full p-4 rounded-2xl bg-[#F8F9FA] border-2 border-[#F1FAEE] focus:border-[#06D6A0] outline-none font-bold text-slate-700 transition-all"
                      onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-[#073B4C] uppercase ml-2 opacity-50">Full Address</label>
                    <textarea 
                      placeholder="House No, Street, Landmark, City..." 
                      className="w-full p-4 rounded-2xl bg-[#F8F9FA] border-2 border-[#F1FAEE] focus:border-[#06D6A0] outline-none font-bold text-slate-700 min-h-[120px] transition-all"
                      onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => setShowShippingForm(false)} 
                    className="flex-1 font-black text-[#073B4C] py-4 md:py-0 hover:text-[#EF476F] transition-colors uppercase text-sm flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Go Back
                  </button>
                  <button 
                    disabled={!shippingDetails.phone || !shippingDetails.address}
                    onClick={() => startPayment('hardcopy')} 
                    className="flex-[2] py-5 bg-[#06D6A0] hover:bg-[#05b88a] text-white rounded-[1.5rem] font-[1000] uppercase text-lg shadow-[0_6px_0px_#048a68] active:translate-y-1 active:shadow-none transition-all disabled:grayscale disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                  >
                    Proceed to Pay ₹1499
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}