import Replicate from "replicate";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const maxDuration = 300; 
export const dynamic = "force-dynamic";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function POST(req) {
  try {
    console.log("--- STARTING POST REQUEST ---");
    
    if (!process.env.REPLICATE_API_KEY) {
      console.error("Error: Missing REPLICATE_API_KEY");
      return Response.json({ success: false, error: "Missing API key" });
    }

    const body = await req.json();
    const { 
      imageBase64, mode, pageText, 
      kidName, ageGroup, theme, subject, style 
    } = body;

    console.log(`Mode detected: ${mode}`);
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });
    const imageDataUrl = imageBase64?.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`;

    // --- MODE: TEXT GENERATION (Gemini) ---
    if (mode === "generateText") {
      const prompt = `
        You are an award-winning children's book author. Write a detailed 25-page story for a ${ageGroup} old child named "${kidName}".
        THEME: ${theme}
        SUBJECT: ${subject}
        
        STRICT STRUCTURE:
        - Exactly 25 pages.
        - Each page MUST be a single paragraph of 40-50 words.
        - The story must have a clear beginning (Pages 1-5), rising action (6-15), climax (16-20), and a heartwarming ending (21-25).
        
        RETURN ONLY JSON:
        { "pages": ["page 1 text...", "page 2 text...", ... "page 25 text..."] }
      `;

      const output = await replicate.run("google/gemini-2.5-flash", { input: { images: [imageDataUrl], prompt } });
      const clean = typeof output === "string" ? output : output.join("");
      const match = clean.match(/\{[\s\S]*\}/);
      
      if (match) {
        const parsed = JSON.parse(match[0]);
        return Response.json({ success: true, pages: parsed.pages });
      }
      throw new Error("Failed to parse story JSON");
    }

    // --- MODE: IMAGE GENERATION ---
    if (mode === "generateImage") {
      console.log("Starting Step: Context-Aware Consistent Image Generation...");
      
      await delay(800); 

      const stylePrompts = {
        "Ghibli": "Studio Ghibli style anime illustration, highly detailed masterfully painted storytelling environment, Hayao Miyazaki aesthetic, lush rich hand-drawn colors",
        "watercolor": "Dreamy whimsical soft watercolor children's book illustration painting, detailed canvas textures, beautiful clean lines",
        "sticker art": "Cute vector sticker art style, crisp playful graphics, flat vibrant child-friendly background composition",
        "soft anime": "High-end cinematic anime style, Makoto Shinkai lighting, magical skies, breathtaking colorful environment"
      };

      const selectedStyle = stylePrompts[style] || stylePrompts["Ghibli"];

      // 👕 OUTFIT ANCHOR LOGIC
      let uniformOutfit = "wearing a signature magical glowing explorer outfit";
      if (theme.toLowerCase().includes("space") || subject.toLowerCase().includes("space") || subject.toLowerCase().includes("mars")) {
        uniformOutfit = "wearing a signature white and gold retro space suit";
      } else if (theme.toLowerCase().includes("fairy") || theme.toLowerCase().includes("world")) {
        uniformOutfit = "wearing a distinctive royal emerald green velvet tunic with gold stitching";
      } else if (theme.toLowerCase().includes("underwater") || theme.toLowerCase().includes("sea")) {
        uniformOutfit = "wearing a classic bright yellow retro diving suit";
      }

      // --- 🎯 THE CRITICAL STRUCTURAL FIX FOR OBJECTS & CONTEXT ---
      // 1. Forced wide storytelling canvas rules directly in the main layout configuration setup.
      // 2. Explicitly demanded that items, hands, arms, and current action props are visible inside the scene.
      const finalPrompt = `A beautiful detailed wide children's book illustration in ${selectedStyle}. 
        SHOT STRUCTURE: Wide storytelling scene showing the child ${kidName}'s body from the waist up, fully showing hands, arms, and interactive objects.
        CHARACTER PROFILE: The child named ${kidName}, forward-facing with a clear visible face, ${uniformOutfit}, maintaining a perfectly consistent face structure and hairstyle matching the reference image.
        STORY ACTION CONTEXT: ${pageText}. 
        MANDATORY ELEMENTS: The child ${kidName} is actively holding, touching, or interacting with the objects, items, food, characters, or elements described in the story text. If text mentions ice cream, a cone or cup must be physically in hand.
        ENVIRONMENT: Vibrant full-scale scene background matching the ${theme} theme.
        CRITICAL RULES: Wide shot framing, hands and story props must be fully visible within the page frame, no chopped arms, no close-up portraits, storytelling action takes absolute priority while keeping face clear and consistent.`;

      const output = await replicate.run(
        "bytedance/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b",
        {
          input: {
            prompt: finalPrompt,
            main_face_image: imageDataUrl,
            num_outputs: 1,
            guidance_scale: 6.5, // Pushed up slightly to firmly ground the model to prompt objects rules
            num_inference_steps: 42, 
            face_image_weight: 0.85, // Balanced at 0.85 to unlock room for dynamic interactions to render cleanly
            
            // ✅ EXTRA POWER FIX: Forcing explicit dimensions parameters to avoid standard tight vertical avatar cuts
            width: 1024,
            height: 768,
            
            negative_prompt: "realistic, photograph, photo, 3d render, text, words, labels, watermark, logo, blurred face, missing objects, headshot only, passport photo, extreme close up, tight crop, portrait only with no context, backward facing, hands cut off, hidden object, frame clipping",
          },
        }
      );

      console.log("Replicate image generation complete.");

      let tempUrl = "";
      if (Array.isArray(output) && output.length > 0) {
        const img = output[0];
        const rawUrl = typeof img === "string" ? img : img?.url?.() || img?.url || "";
        tempUrl = String(rawUrl).trim(); 
      }

      let permanentUrl = tempUrl;
      if (tempUrl) {
        try {
          console.log("Starting Step: Cloudinary Upload...");
          const uploadRes = await cloudinary.uploader.upload(tempUrl, {
            folder: "ginnie_tales_library",
            overwrite: true,
            resource_type: "image",
            transformation: [
              { width: 1024, quality: "auto", fetch_format: "auto" }
            ]
          });
          permanentUrl = uploadRes.secure_url;
        } catch (e) { 
          console.error("Cloudinary Failed:", e.message);
        }
      }

      return Response.json({ success: !!permanentUrl, imageUrl: permanentUrl });
    }
  } catch (error) {
    console.error("CRITICAL ERROR in POST handler:", error.message);
    return Response.json({ success: false, error: error.message });
  }
}