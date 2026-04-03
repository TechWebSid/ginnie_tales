import { motion, AnimatePresence } from "framer-motion";
import { XCircle, FileDown, BookOpen } from "lucide-react";

export default function MagicalCart({ 
  isOpen, onClose, showShippingForm, setShowShippingForm, 
  handlePlanSelection, shippingDetails, setShippingDetails, startPayment 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <motion.div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-3xl w-full border-[10px] border-[#FFD166] relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-[#EF476F]"><XCircle size={32} /></button>

            {!showShippingForm ? (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-[1000] text-[#073B4C] uppercase mb-2">Unlock The Magic</h2>
                  <p className="text-[#118AB2] font-black uppercase text-xs">Select your adventure pack</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div onClick={() => handlePlanSelection('ebook')} className="cursor-pointer border-4 border-dashed rounded-[2rem] p-6 bg-blue-50/50 hover:bg-white text-center">
                    <FileDown className="mx-auto text-blue-600 mb-4" size={40} />
                    <h3 className="text-xl font-black text-[#073B4C]">Digital E-Book</h3>
                    <span className="text-3xl font-[1000] text-[#EF476F]">₹499</span>
                  </div>
                  <div onClick={() => handlePlanSelection('hardcopy')} className="cursor-pointer border-4 border-[#06D6A0] rounded-[2rem] p-6 bg-[#F1FAEE] hover:bg-white text-center">
                    <BookOpen className="mx-auto text-green-600 mb-4" size={40} />
                    <h3 className="text-xl font-black text-[#073B4C]">Hardcover Book</h3>
                    <span className="text-3xl font-[1000] text-[#EF476F]">₹1499</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <h2 className="text-3xl font-[1000] text-[#073B4C] uppercase text-center">Where should we send it?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" placeholder="Phone Number" className="w-full p-4 rounded-2xl bg-[#F1FAEE] outline-none font-bold"
                    onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} />
                  <input type="text" placeholder="Pincode" className="w-full p-4 rounded-2xl bg-[#F1FAEE] outline-none font-bold"
                    onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})} />
                  <textarea placeholder="Full Address" className="w-full p-4 rounded-2xl bg-[#F1FAEE] outline-none font-bold md:col-span-2 min-h-[100px]"
                    onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowShippingForm(false)} className="flex-1 font-black text-[#073B4C]">Back</button>
                  <button 
                    disabled={!shippingDetails.phone || !shippingDetails.address}
                    onClick={() => startPayment('hardcopy')} 
                    className="flex-[2] py-4 bg-[#06D6A0] text-white rounded-2xl font-[1000] uppercase shadow-lg"
                  >Proceed to Pay ₹1499</button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}