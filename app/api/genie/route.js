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
    console.log(`Context: Kid Name: ${kidName}, Age: ${ageGroup}, Style: ${style}`);

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });
    const imageDataUrl = imageBase64?.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`;

    // --- MODE: TEXT GENERATION (Gemini) ---
if (mode === "generateText") {
  console.log("Starting Step: 25-Page Story Writing...");
  
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
      console.log("Gemini raw output received.");

      const clean = typeof output === "string" ? output : output.join("");
      const match = clean.match(/\{[\s\S]*\}/);
      
      if (match) {
        const parsed = JSON.parse(match[0]);
        console.log("Story JSON successfully parsed. Pages generated: ", parsed.pages.length);
        return Response.json({ success: true, pages: parsed.pages });
      }
      
      console.error("JSON Parsing Error: Could not find JSON block in Gemini output.");
      throw new Error("Failed to parse story JSON");
    }

 // --- MODE: IMAGE GENERATION ---
if (mode === "generateImage") {
  console.log("Starting Step: Image Generation (Flux PuLID)...");
  
  await delay(800); 

  const stylePrompts = {
    "Ghibli": "Studio Ghibli style, cinematic wide shot, detailed Ghibli backgrounds, Hayao Miyazaki inspired, lush scenery",
    "watercolor": "Dreamy soft watercolor, artistic double exposure style, whimsical landscape, gentle textures",
    "sticker art": "Cute vector sticker art, clean playful composition, vibrant world-building, bold colors",
    "soft anime": "High-end cinematic anime, Makoto Shinkai lighting, breathtaking scenery, expressive environment"
  };

  const selectedStyle = stylePrompts[style] || stylePrompts["Ghibli"];

  // --- NEW BALANCED PROMPT LOGIC ---
  // Hum character ko background ke saath 'blend' kar rahe hain taaki poora scene dikhe
  const finalPrompt = `A breathtaking ${selectedStyle} children's book illustration. 
    SCENE: In a vast and detailed ${theme} world, the child ${kidName} is seen ${pageText}. 
    The illustration must feature ${kidName} as a central part of this scene, interacting with the environment. 
    High detail, 8k, whimsical storytelling style, consistent character features.`;

  const output = await replicate.run(
    "bytedance/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b",
    {
      input: {
        prompt: finalPrompt,
        main_face_image: imageDataUrl,
        num_outputs: 1,
        guidance_scale: 4.5, 
        num_inference_steps: 35, 
        face_image_weight: 0.85, 
        negative_prompt: "realistic, photograph, 3d render, text, watermark, distorted face, adult, missing character, portrait only, zoom-in only",
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
          // Remove "crop: fill" if you want full aspect ratio control
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