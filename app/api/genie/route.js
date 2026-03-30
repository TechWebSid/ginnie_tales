import Replicate from "replicate";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

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

    if (storyPrompt.length < 10 || storyPrompt.length > 500) {
      return Response.json(
        { success: false, error: "Prompt must be 10–500 characters" },
        { status: 200 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    // =========================
    // 3. IMAGE PREP
    // =========================
    const imageDataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/png;base64,${imageBase64}`;

    // =========================
    // 🧠 STEP 1: STORY (LONG + DYNAMIC)
    // =========================
    console.log("📝 Generating story...");

    let storyText = "";

    try {
      const stream = replicate.stream("google/gemini-2.5-flash", {
        input: {
          images: [imageDataUrl],
          prompt: `
You are a professional children's story writer.

USER IDEA: ${storyPrompt}

Write a detailed story.

RULES:
- MUST be 300–500 words
- Third person narration
- Strong beginning, middle, and ending
- Rich descriptions
- Match character to the uploaded image
- NO title
          `,
          max_tokens: 1000,
          temperature: 0.75,
          top_p: 0.95,
        },
      });

      for await (const event of stream) {
        if (typeof event === "string") {
          storyText += event;
        }
      }
    } catch (err) {
      console.error("❌ Gemini failed:", err);
    }

    if (!storyText || storyText.split(" ").length < 200) {
      storyText = `
A young dreamer stood at the edge of destiny, heart pounding with hope and fear. The world seemed vast and uncertain, yet something deep within urged them forward.

With each step, challenges appeared, testing courage and strength. Doubt whispered, but determination answered louder. The journey grew intense, pushing limits beyond imagination.

Then came the defining moment — the challenge that would decide everything. The air grew still as focus sharpened. With unwavering belief, they moved forward and faced it head-on.

What followed changed everything. The impossible became possible, and the dream turned real. The moment echoed with triumph, marking the beginning of something far greater.

And in that instant, the story was no longer just a dream — it had become a legend.
      `;
    }

    storyText = storyText.trim();

    console.log("✅ Story words:", storyText.split(" ").length);

    // =========================
    // ⏳ DELAY
    // =========================
    await new Promise((r) => setTimeout(r, 5000));

    // =========================
    // 🎨 STEP 2: IMAGE (MAX FACE ACCURACY)
    // =========================
    // =========================
// 🎨 STEP 2: IMAGE (BALANCED + NATURAL)
// =========================
console.log("🎨 Generating image...");

let imageUrl = "";

try {
  const output = await replicate.run(
    "bytedance/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b",
    {
      input: {
        prompt: `
A cinematic photo of the SAME person from the reference image.

SCENE:
${storyPrompt}

IMPORTANT:
- Must resemble the same person
- Keep facial identity natural (not forced)
- Maintain hairstyle, face shape, skin tone

STYLE:
- realistic photography
- natural lighting
- cinematic composition
- medium shot (not extreme close-up)
- storytelling frame

MOOD:
- warm, emotional, natural
        `,

        main_face_image: imageDataUrl,

        // ✅ BALANCED SETTINGS
        num_outputs: 1,
        guidance_scale: 3.8,   // 🔥 sweet spot (not too rigid)
        num_inference_steps: 28,
        start_step: 5,         // 🔥 more natural blending

        negative_prompt: `
cartoon, anime, over-sharpened face,
plastic skin, distorted face, extra limbs,
low quality, watermark
        `,
      },
    }
  );

  console.log("RAW OUTPUT:", output);

  if (Array.isArray(output) && output.length > 0) {
    const img = output[0];

    if (typeof img?.url === "function") {
      imageUrl = img.url();
    } else if (typeof img === "string") {
      imageUrl = img;
    } else if (img?.url) {
      imageUrl = img.url;
    }
  }
} catch (err) {
  console.error("❌ Image error:", err);
}

    if (!imageUrl) {
      imageUrl = "https://placehold.co/600x800/png?text=Image+Failed";
    }

    console.log("✅ Image URL:", imageUrl);

    // =========================
    // RESPONSE
    // =========================
    return Response.json({
      success: true,
      story: storyText,
      illustration: imageUrl,
    });

  } catch (error) {
    console.error("❌ FINAL ERROR:", error);

    return Response.json({
      success: false,
      story: "",
      illustration: "https://placehold.co/600x800/png?text=Error",
      error: "Something went wrong",
    });
  }
}