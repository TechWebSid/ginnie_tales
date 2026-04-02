import Replicate from "replicate";

export const maxDuration = 300; 
export const dynamic = "force-dynamic";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function POST(req) {
  try {
    if (!process.env.REPLICATE_API_KEY) {
      console.error("❌ ERROR: REPLICATE_API_KEY is missing in .env.local");
      return Response.json({ success: false, error: "Missing API key" }, { status: 200 });
    }

    const body = await req.json();
    const { imageBase64, storyPrompt, mode, pageText } = body;

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });
    const imageDataUrl = imageBase64?.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`;

    // --- MODE: TEXT GENERATION ---
    if (mode === "generateText") {
      console.log(`\n🔮 [GENIE] Calling Replicate (Gemini) for Story: "${storyPrompt}"`);
      
    const output = await replicate.run("google/gemini-2.5-flash", {
    input: {
      images: [imageDataUrl],
      prompt: `
        You are an elite children's book author. Based on this photo and the idea: "${storyPrompt}", 
        write a short 4-page adventure for testing.

        STRUCTURE RULES:
        - Total Pages: Exactly 4.
        - Page 1: Introduction.
        - Page 2: The discovery.
        - Page 3: The climax/action.
        - Page 4: The heartwarming conclusion.
        - Each page must be exactly 1 paragraph (2-3 sentences).

        RETURN ONLY A JSON OBJECT:
        {
          "pages": ["page 1 text...", "page 2 text...", "page 3 text...", "page 4 text..."]
        }
          `,
        },
      });

      const clean = typeof output === "string" ? output : output.join("");
      const match = clean.match(/\{[\s\S]*\}/);
      
      if (match) {
        const parsed = JSON.parse(match[0]);
        console.log(`✅ [GENIE] Story Generated: ${parsed.pages.length} pages received.`);
        return Response.json({ success: true, pages: parsed.pages });
      }
      
      console.error("❌ [GENIE] Failed to parse JSON from Replicate response.");
      throw new Error("Failed to parse story JSON");
    }

    // --- MODE: IMAGE GENERATION ---
    if (mode === "generateImage") {
      const logSnippet = pageText?.substring(0, 30) + "...";
      console.log(`🎨 [GENIE] Generating Image for: "${logSnippet}"`);

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

      if (finalUrl) {
        console.log("🖼️ [GENIE] Image Created Successfully.");
      } else {
        console.warn("⚠️ [GENIE] Image Generation returned no URL.");
      }

      return Response.json({ 
        success: !!finalUrl, 
        imageUrl: finalUrl || "https://placehold.co/600x800/png?text=Image+Failed" 
      });
    }

    return Response.json({ success: false, error: "Invalid Mode" });

  } catch (error) {
    console.error("❌ API ERROR:", error.message);
    return Response.json({ success: false, error: error.message });
  }
}
