import Replicate from "replicate";

export const maxDuration = 300; // Increased for background tasks if supported
export const dynamic = "force-dynamic";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function POST(req) {
  try {
    if (!process.env.REPLICATE_API_KEY) {
      return Response.json({ success: false, error: "Missing API key" }, { status: 200 });
    }

    const body = await req.json();
    const { imageBase64, storyPrompt, mode, pageText } = body;

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });
    const imageDataUrl = imageBase64?.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`;

    // =========================================================
    // MODE: GENERATE TEXT (The 25-Page Outline)
    // =========================================================
    if (mode === "generateText") {
      console.log("📝 Generating 25-page story outline...");
      
      const output = await replicate.run("google/gemini-2.5-flash", {
        input: {
          images: [imageDataUrl],
          prompt: `
            You are an elite children's book author. Based on this photo and the idea: "${storyPrompt}", 
            write a cinematic 25-page adventure.

            STRUCTURE RULES:
            - Page 1: Introduction to the hero and their world.
            - Pages 2-24: Rising action, discovery, challenges, and magic.
            - Page 25: A heartwarming and epic conclusion.
            - Each page must be exactly 1 paragraph (2-3 sentences).

            RETURN ONLY A JSON OBJECT:
            {
              "pages": ["page 1 text...", "page 2 text...", ... "page 25 text..."]
            }
          `,
        },
      });

      const clean = typeof output === "string" ? output : output.join("");
      const match = clean.match(/\{[\s\S]*\}/);
      
      if (match) {
        const parsed = JSON.parse(match[0]);
        return Response.json({ success: true, pages: parsed.pages });
      }
      throw new Error("Failed to parse story JSON");
    }

    // =========================================================
    // MODE: GENERATE IMAGE (Single Page Mode)
    // =========================================================
    if (mode === "generateImage") {
      console.log("🎨 Painting page image...");

      const output = await replicate.run(
        "bytedance/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b",
        {
          input: {
            prompt: `A cinematic, high-end children's book illustration. SCENE: ${pageText}. Keep the person's identity consistent with the reference photo. Soft magical lighting, 8k resolution, whimsical atmosphere.`,
            main_face_image: imageDataUrl,
            num_outputs: 1,
            guidance_scale: 3.8,
            num_inference_steps: 28,
            start_step: 5,
            negative_prompt: "cartoon, anime, distorted, low quality, blurry, text, watermark",
          },
        }
      );

      let finalUrl = "";
      if (Array.isArray(output) && output.length > 0) {
        const img = output[0];
        finalUrl = typeof img === "string" ? img : img?.url?.() || img?.url || "";
      }

      return Response.json({ 
        success: !!finalUrl, 
        imageUrl: finalUrl || "https://placehold.co/600x800/png?text=Image+Failed" 
      });
    }

    return Response.json({ success: false, error: "Invalid Mode" });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return Response.json({ success: false, error: error.message });
  }
}