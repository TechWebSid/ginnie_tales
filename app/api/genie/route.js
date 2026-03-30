import Replicate from "replicate";

// Next.js config
export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // 1. API Key check
    if (!process.env.REPLICATE_API_KEY) {
      return Response.json({
        success: false,
        error: "Missing Replicate API key",
      }, { status: 500 });
    }

    // 2. Parse request
    const body = await req.json();
    const { imageBase64, storyPrompt } = body;

    if (!imageBase64 || !storyPrompt) {
      return Response.json({
        success: false,
        error: "Missing image or prompt",
      }, { status: 400 });
    }

    if (storyPrompt.length < 10 || storyPrompt.length > 500) {
      return Response.json({
        success: false,
        error: "Prompt must be between 10–500 characters",
      }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    // ✅ Convert base64 → data URL
    const imageDataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/png;base64,${imageBase64}`;

    // =========================
    // 🧠 STEP 1: GEMINI STORY
    // =========================
    console.log("📝 Generating story...");

    const geminiInput = {
      images: [imageDataUrl],
      prompt: `
You are a children's story writer.

USER IDEA: ${storyPrompt}

Write a 150–200 word magical story:
- Third person
- Emotional + engaging
- Beginning, middle, end
- Match character to image
- No title, no extra text
      `,
    };

    let storyText = "";

    for await (const event of replicate.stream(
      "google/gemini-2.5-flash",
      { input: geminiInput }
    )) {
      storyText += event;
    }

    storyText = storyText.trim();

    if (!storyText || storyText.length < 50) {
      throw new Error("Story generation failed");
    }

    console.log("✅ Story generated");

    // =========================
    // ⏳ IMPORTANT DELAY (RATE LIMIT FIX)
    // =========================
    console.log("⏳ Waiting to avoid rate limit...");
    await new Promise((resolve) => setTimeout(resolve, 6000)); // 6 sec

    // =========================
    // 🎨 STEP 2: IMAGEN 4
    // =========================
    console.log("🎨 Generating illustration...");

    const imagePrompt = `
Children's storybook illustration.

Scene: ${storyPrompt}

Character: same person as uploaded image

Style:
- Pixar / Disney style
- Soft lighting
- Magical atmosphere
- Warm colors
- Cinematic

Context:
${storyText.slice(0, 200)}
`;

    const imageOutput = await replicate.run(
      "google/imagen-4",
      {
        input: {
          prompt: imagePrompt,
          aspect_ratio: "3:4",
          safety_filter_level: "block_medium_and_above",
        },
      }
    );

    // ✅ Extract URL properly
    let imageUrl = "";

    if (typeof imageOutput?.url === "function") {
      imageUrl = imageOutput.url();
    } else if (typeof imageOutput === "string") {
      imageUrl = imageOutput;
    }

    if (!imageUrl) {
      throw new Error("Image generation failed");
    }

    console.log("✅ Image generated");

    // =========================
    // RESPONSE
    // =========================
    return Response.json({
      success: true,
      story: storyText,
      illustration: imageUrl,
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return Response.json({
      success: false,
      error: error.message || "Something went wrong",
    }, { status: 500 });
  }
}