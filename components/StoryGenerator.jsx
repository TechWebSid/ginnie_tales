"use client";

import { useState } from 'react';

export default function StoryGenerator() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB to save on upload time)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const clientSubmit = async (e) => {
    e.preventDefault();
    if (!preview) return;

    setLoading(true);
    setError(null);
    setOutput(null);
    setLoadingStage('Analyzing your photo...');
    
    const formData = new FormData(e.target);
    const storyPrompt = formData.get("storyPrompt");

    try {
      const res = await fetch('/api/genie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: preview, 
          storyPrompt 
        })
      });

      const result = await res.json();
      
      if (result.success) {
        setOutput({ 
          story: result.story, 
          illustration: result.illustration 
        });
        setError(null);
      } else {
        setError(result.error || 'Generation failed. Please try again.');
        setOutput(null);
      }
    } catch (err) {
      console.error("Storybook System Error:", err);
      setError('Network error. Please check your connection and try again.');
      setOutput(null);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white font-sans">
      
      {/* HEADER */}
      <div className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xl">📖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                StoryBook AI
              </h1>
              <p className="text-xs text-zinc-500">Your Photo, Your Story</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-600">Testing Mode</p>
            <p className="text-xs text-purple-400 font-mono">1 Page Preview</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* INPUT FORM */}
        {!output && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
              <form onSubmit={clientSubmit} className="space-y-6">
                
                {/* ERROR MESSAGE */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* UPLOAD SECTION */}
                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-3">
                    📸 Upload Your Photo
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={loading}
                    />
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all">
                      {preview ? (
                        <div className="space-y-3">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="h-32 w-32 object-cover rounded-xl mx-auto border-2 border-purple-500/50" 
                          />
                          <p className="text-sm text-green-400">✓ Photo loaded</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-4xl">🖼️</div>
                          <p className="text-white/60">Click to select your photo</p>
                          <p className="text-xs text-white/40">Max 5MB • JPG, PNG</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* STORY PROMPT */}
                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-3">
                    ✨ Your Story Idea
                  </label>
                  <textarea
                    name="storyPrompt"
                    rows="4"
                    placeholder="E.g., 'A brave astronaut exploring a mysterious alien planet' or 'A wizard discovering a magical library'"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-white/40 mt-2">Be specific! Better prompts = better stories</p>
                </div>

                {/* SUBMIT BUTTON */}
                <button 
                  type="submit"
                  disabled={loading || !preview}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {loadingStage || 'Creating magic...'}
                    </span>
                  ) : (
                    '🎨 Generate My Storybook'
                  )}
                </button>

                {loading && (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-purple-400 animate-pulse">
                      This takes 15-30 seconds...
                    </p>
                    <p className="text-xs text-white/40">
                      ⚡ Using ~$0.05 credit
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* STORYBOOK OUTPUT */}
        {output && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-700">
            
            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOutput(null)}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold transition-all"
              >
                ← Create Another
              </button>
            </div>

            {/* THE STORYBOOK */}
            <div className="max-w-6xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-900/20">
              <div className="grid md:grid-cols-2 min-h-[600px]">
                
                {/* LEFT PAGE - ILLUSTRATION */}
                <div className="relative bg-white p-8 flex items-center justify-center border-r-2 border-amber-900/10">
                  <div className="absolute top-4 left-4 text-xs font-serif text-amber-900/40">
                    Page 1
                  </div>
                  <img 
                    src={output.illustration} 
                    alt="Story Illustration" 
                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-xl"
                  />
                </div>

                {/* RIGHT PAGE - STORY TEXT */}
                <div className="relative bg-amber-50/50 p-12 flex flex-col justify-center">
                  <div className="absolute top-4 right-4 text-xs font-serif text-amber-900/40">
                    Page 2
                  </div>
                  <div className="space-y-6">
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    <p className="text-xl md:text-2xl font-serif leading-relaxed text-amber-950 whitespace-pre-wrap">
                      {output.story}
                    </p>
                    <div className="pt-6 flex items-center gap-2 text-amber-900/60">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                      <p className="text-sm font-serif italic">Your Personalized Story</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DOWNLOAD HINT */}
            <div className="text-center">
              <p className="text-sm text-white/60">
                💡 Right-click the storybook to save as image
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-xs text-white/40">
            Powered by Replicate • Llama 3.2 Vision + Flux 1.1 Pro
          </p>
        </div>
      </div>
    </div>
  );
}