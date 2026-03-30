"use client";

import { useState } from "react";
import Book from "@/components/Book";

export default function StoryGenerator() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setError(null);
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
    setLoadingStage("🧠 Analyzing your photo...");

    const formData = new FormData(e.target);
    const storyPrompt = formData.get("storyPrompt");

    try {
      const res = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: preview,
          storyPrompt,
        }),
      });

      setLoadingStage("✍️ Writing your story...");

      const result = await res.json();

      if (result.success) {
        setLoadingStage("🎨 Creating illustration...");

        setOutput({
          story: result.story,
          illustration: result.illustration,
        });
        setError(null);
      } else {
        setError(result.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white font-sans">
      
      {/* HEADER */}
      <div className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              📖
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                StoryBook AI
              </h1>
              <p className="text-xs text-zinc-500">Your Photo, Your Story</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* FORM */}
        {!output && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
              <form onSubmit={clientSubmit} className="space-y-6">

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* IMAGE UPLOAD */}
                <div>
                  <label className="text-purple-400 font-semibold">📸 Upload Photo</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  
                  {preview && (
                    <img src={preview} className="h-32 mt-3 rounded-lg" />
                  )}
                </div>

                {/* PROMPT */}
                <textarea
                  name="storyPrompt"
                  required
                  placeholder="Describe your story..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
                />

                {/* BUTTON */}
                <button
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold"
                >
                  {loading ? loadingStage : "🎨 Generate Story"}
                </button>

                {loading && (
                  <p className="text-center text-purple-400 text-sm animate-pulse">
                    Creating magic... ✨
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* OUTPUT → BOOK */}
        {output && (
          <div className="flex flex-col items-center gap-6">

            <button
              onClick={() => setOutput(null)}
              className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20"
            >
              ← Create Another
            </button>

            {/* 🔥 BOOK HERE */}
            <Book
              story={output.story}
              image={output.illustration}
            />

          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-white/10 mt-20 text-center py-6 text-xs text-white/40">
        Powered by Replicate • Gemini + Imagen
      </div>
    </div>
  );
}