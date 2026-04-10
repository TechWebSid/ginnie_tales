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
      console.log("Starting Step: Story Writing (Gemini)...");
      await delay(500); // Rate limit protection

      const prompt = `
        You are an elite children's book author. Write a 4-page story for a ${ageGroup} old child named "${kidName}".
        THEME: ${theme}
        SUBJECT: ${subject}
        
        STRUCTURE:
        - Page 1: Introduction of ${kidName} and the setting.
        - Page 2: The discovery or start of the journey.
        - Page 3: The climax or exciting action.
        - Page 4: A heartwarming conclusion and lesson.
        
        RULES:
        - Exactly 4 pages.
        - Each page: 1 paragraph (2-3 sentences).
        - Language: Simple, engaging, and perfect for ${ageGroup} age group.
        
        RETURN ONLY JSON:
        { "pages": ["...", "...", "...", "..."] }
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
      console.log(`Scene Description: ${pageText}`);
      
      await delay(800); // Rate limit protection

      const stylePrompts = {
        "Ghibli": "Studio Ghibli style, hand-drawn aesthetic, lush backgrounds, Hayao Miyazaki inspired, vibrant yet soft colors",
        "watercolor": "Soft watercolor painting, dreamy textures, artistic brush strokes, gentle pastel tones, whimsical",
        "sticker art": "Cute vector sticker art, bold outlines, vibrant flat colors, die-cut style, playful and clean",
        "soft anime": "Modern soft anime style, beautiful lighting, expressive eyes, high-quality digital illustration"
      };

      const selectedStyle = stylePrompts[style] || stylePrompts["Ghibli"];

      const output = await replicate.run(
        "bytedance/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b",
        {
          input: {
            prompt: `${selectedStyle} children's book illustration. SCENE: ${pageText}. Character is a child named ${kidName}. Ensure character consistency with the reference photo. 8k, whimsical atmosphere, high quality.`,
            main_face_image: imageDataUrl,
            num_outputs: 1,
            guidance_scale: 3.5,
            num_inference_steps: 25,
            negative_prompt: "realistic, 3d render, photograph, distorted, text, watermark, blurry face",
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

      console.log(`Temporary Image URL: ${tempUrl}`);

      let permanentUrl = tempUrl;
      if (tempUrl) {
        try {
          console.log("Starting Step: Cloudinary Upload...");
          const uploadRes = await cloudinary.uploader.upload(tempUrl, {
            folder: "ginnie_tales_library",
            overwrite: true,
            resource_type: "image",
            transformation: [
              { width: 800, crop: "limit" }, 
              { quality: "60", fetch_format: "auto" }
            ]
          });
          permanentUrl = uploadRes.secure_url;
          console.log("Cloudinary upload successful. Permanent URL:", permanentUrl);
        } catch (e) { 
          console.error("Cloudinary Upload Failed, falling back to temporary URL:", e.message);
        }
      }

      return Response.json({ success: !!permanentUrl, imageUrl: permanentUrl });
    }
  } catch (error) {
    console.error("CRITICAL ERROR in POST handler:", error.message);
    return Response.json({ success: false, error: error.message });
  }
}