import Replicate from "replicate";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

// Delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function POST(req) {
  try {
    // =========================
    // 1. ENV CHECK
    // =========================
    if (!process.env.REPLICATE_API_KEY) {
      return Response.json(
        { success: false, error: "Missing API key" },
        { status: 200 }
      );
    }

    // =========================
    // 2. PARSE REQUEST
    // =========================
    const body = await req.json();
    const { imageBase64, storyPrompt } = body;

    if (!imageBase64 || !storyPrompt) {
      return Response.json(
        { success: false, error: "Missing image or prompt" },
        { status: 200 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    const imageDataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/png;base64,${imageBase64}`;

    // =========================
    // 🧠 STEP 1: STORY (4 PAGES)
    // =========================
    console.log("📝 Generating 4-page story...");

    let storyPages = [];

    try {
      const output = await replicate.run("google/gemini-2.5-flash", {
        input: {
          images: [imageDataUrl],
          prompt: `
You are a professional children's story writer.

USER IDEA: ${storyPrompt}

Write EXACTLY 4 pages.

Rules:
- Each page = 1 paragraph
- Page 1 = intro
- Page 2 = journey
- Page 3 = climax
- Page 4 = ending

Return ONLY JSON:
{
  "pages": ["p1", "p2", "p3", "p4"]
}
          `,
        },
      });

      const clean =
        typeof output === "string" ? output : output.join("");

      const match = clean.match(/\{[\s\S]*\}/);

      if (match) {
        const parsed = JSON.parse(match[0]);
        storyPages = parsed.pages;
      }
    } catch (err) {
      console.error("❌ Story error:", err);
    }

    // Fallback
    if (!Array.isArray(storyPages) || storyPages.length !== 4) {
      console.log("⚠️ Using fallback story");
      storyPages = [
        "The adventure began on a bright morning...",
        "The hero traveled through unknown lands...",
        "A great challenge appeared before them...",
        "Victory was achieved and peace returned..."
      ];
    }

    // =========================
    // ⏳ DELAY
    // =========================
    console.log("⏳ Waiting before images...");
    await delay(8000);

    // =========================
    // 🎨 STEP 2: IMAGES
    // =========================
    console.log("🎨 Generating images...");
    const imageUrls = [];

    for (let i = 0; i < 4; i++) {
      try {
        console.log(`🖼️ Image ${i + 1}`);

        const output = await replicate.run(
          "bytedance/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b",
          {
            input: {
              prompt: `
A cinematic photo of the SAME person.

SCENE:
${storyPages[i]}

Keep identity consistent.
Realistic lighting.
Cinematic composition.
              `,
              main_face_image: imageDataUrl,
              num_outputs: 1,
              guidance_scale: 3.8,
              num_inference_steps: 28,
              start_step: 5,
              negative_prompt: `
cartoon, anime, distorted face,
extra limbs, watermark, low quality
              `,
            },
          }
        );

        // =========================
        // ✅ FIXED IMAGE EXTRACTION
        // =========================
        let finalUrl = "";

        console.log("RAW OUTPUT:", output);

        if (Array.isArray(output) && output.length > 0) {
          const img = output[0];

          if (typeof img === "string") {
            finalUrl = img;
          } 
          else if (img?.url && typeof img.url === "function") {
            finalUrl = img.url();
          } 
          else if (img?.url && typeof img.url === "string") {
            finalUrl = img.url;
          }
        }

        if (!finalUrl) {
          console.log("⚠️ Missing image URL");
          finalUrl = "https://placehold.co/600x800/png?text=Image+Failed";
        }

        imageUrls.push(finalUrl);

        // Delay to avoid rate limit
        if (i < 3) await delay(2000);

      } catch (err) {
        console.error(`❌ Image ${i + 1} failed:`, err);
        imageUrls.push("https://placehold.co/600x800/png?text=Error");
      }
    }

    console.log("✅ FINAL IMAGES:", imageUrls);

    // =========================
    // RESPONSE
    // =========================
    return Response.json({
      success: true,
      pages: storyPages,
      images: imageUrls,
    });

  } catch (error) {
    console.error("❌ FINAL ERROR:", error);

    return Response.json({
      success: false,
      pages: [],
      images: [],
      error: "Something went wrong",
    });
  }
}