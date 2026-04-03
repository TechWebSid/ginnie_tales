import { motion } from "framer-motion";
import { Wand2, Camera, Rocket, Sparkles, Palette } from "lucide-react";

export default function GenerationForm({ 
  onSubmit, handleFileChange, preview, loading, loadingStage, progress 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-4 md:pt-10"
    >
      <div className="space-y-6 text-center lg:text-left">
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity }} 
          className="w-24 h-24 md:w-32 md:h-32 bg-[#FFD166] rounded-[2rem] flex items-center justify-center mx-auto lg:mx-0 shadow-[6px_6px_0px_#EE964B] border-4 border-white"
        >
          <Wand2 className="text-white w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-[1000] text-[#073B4C] leading-[0.9] tracking-tighter">
            BE THE <br /> <span className="text-[#EF476F]">HERO!</span>
          </h2>
          <p className="text-[#118AB2] font-black text-lg md:text-xl bg-white/60 backdrop-blur-sm p-4 rounded-2xl inline-block border-2 border-[#118AB2]/10">
            Upload your photo to start! 🚀
          </p>
        </div>
      </div>

      <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
        <div className="relative bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-[8px_8px_0px_#118AB2] border-4 border-[#073B4C] overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-[60] bg-[#FFD166] flex flex-col items-center justify-center p-6 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Palette className="w-16 h-16 text-[#EF476F]" />
              </motion.div>
              <h3 className="text-2xl font-[1000] text-[#073B4C] uppercase mt-4">{loadingStage}</h3>
              <div className="w-full bg-white/50 h-5 rounded-full mt-6 border-[3px] border-[#073B4C] p-1 overflow-hidden">
                <motion.div className="h-full bg-[#EF476F] rounded-full" style={{ width: `${(progress / 2) * 100}%` }} />
              </div>
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">
            <label className="relative block group cursor-pointer">
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
              <div className={`aspect-square sm:aspect-video lg:aspect-square rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${preview ? 'border-[#EF476F]' : 'border-[#118AB2]/30 bg-[#F1FAEE]'}`}>
                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : (
                  <div className="text-center p-4">
                    <Camera size={28} className="mx-auto text-[#118AB2] mb-3" />
                    <p className="font-[1000] text-[#118AB2] text-sm uppercase tracking-tighter">Tap to add your face!</p>
                  </div>
                )}
              </div>
            </label>
            <textarea name="storyPrompt" required className="w-full p-4 rounded-[1.5rem] bg-[#F1FAEE] border-2 border-transparent focus:border-[#EF476F] outline-none font-bold text-[#073B4C]" placeholder="E.g. A space adventure with my cat..." />
            <button disabled={!preview || loading} className="w-full py-5 bg-[#EF476F] text-white font-[1000] rounded-[1.5rem] shadow-[4px_4px_0px_#C9184A] text-xl uppercase border-2 border-white">
              <Sparkles size={24} className="inline mr-2" /> MAKE MAGIC!
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}