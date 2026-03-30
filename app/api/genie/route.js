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
    // 🧠 STEP 1: STORY (DYNAMIC + LONG)
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
- Rich descriptions (environment, emotions, actions)
- Match the character to the uploaded image
- Story should feel like a real storybook
- NO title
          `,
          max_tokens: 1000,
          temperature: 0.8,
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

    // =========================
    // ENSURE STORY LENGTH
    // =========================
    if (!storyText || storyText.split(" ").length < 200) {
      console.log("⚠️ Story too short → using fallback");

      storyText = `
The journey began on a quiet morning, when everything felt ordinary — yet something in the air hinted at change. The young dreamer stepped forward, unaware that this moment would shape everything ahead.

As the world unfolded around them, challenges appeared one after another. Doubts crept in, whispering hesitation, but courage answered louder. With every step, confidence grew, and fear slowly faded into determination.

Then came the defining moment. The challenge that seemed impossible now stood directly in front of them. The world held its breath. With a deep inhale, they moved forward — steady, focused, unstoppable.

What followed was nothing short of extraordinary. The effort, the belief, the persistence — it all came together in a single moment of brilliance. The impossible was achieved.

And as the echoes of that moment faded into memory, one truth remained: this was only the beginning of a much greater story.
      `;
    }

    storyText = storyText.trim();

    console.log("✅ Story length:", storyText.split(" ").length);

    // =========================
    // ⏳ DELAY (RATE LIMIT SAFE)
    // =========================
    await new Promise((r) => setTimeout(r, 5000));

    // =========================
    // 🎨 STEP 2: IMAGE (FLUX-PULID)
    // =========================
    console.log("🎨 Generating image...");

    let imageUrl = "";

    try {
      const output = await replicate.run(
        "bytedance/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b",
        {
          input: {
            prompt: `
A cinematic scene of a character.

SCENE:
${storyPrompt}

STYLE:
- realistic
- cinematic lighting
- detailed
- professional composition

IMPORTANT:
keep the SAME face identity as reference image
            `,
            main_face_image: imageDataUrl,
            num_outputs: 1,
            guidance_scale: 3.5,
            num_inference_steps: 28,
            negative_prompt:
              "low quality, blurry, distorted face, extra limbs, watermark",
          },
        }
      );

      console.log("RAW OUTPUT:", output);

      // =========================
      // IMAGE EXTRACTION FIX
      // =========================
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

    // =========================
    // IMAGE FALLBACK
    // =========================
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
    console.error("FINAL ERROR:", error);

    return Response.json({
      success: false,
      story: "",
      illustration: "https://placehold.co/600x800/png?text=Error",
      error: "Something went wrong",
    });
  }
}