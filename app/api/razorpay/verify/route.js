import crypto from "crypto"; 
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, addDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. Destructure with extreme safety
    const razorpay_order_id = body?.razorpay_order_id;
    const razorpay_payment_id = body?.razorpay_payment_id;
    const razorpay_signature = body?.razorpay_signature;
    const storyId = body?.storyId;
    const userId = body?.userId || "anonymous";
    const shipping = body?.shipping || null;
    const planType = body?.planType || "ebook";

    // 2. Signature Verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
    }

    // 3. Database Updates (Wrapped in try-catch so payment success isn't blocked by a UI fetch error)
    let storyTitle = "My Magical Tale";
    let coverImage = "";

    try {
      // ONLY attempt fetch if storyId is a valid string
      if (storyId && typeof storyId === "string") {
        const storyRef = doc(db, "stories", storyId);
        const storySnap = await getDoc(storyRef);
        
        if (storySnap.exists()) {
          const sData = storySnap.data();
          storyTitle = sData.title || sData.prompt || "My Adventure";
          coverImage = sData.coverImage || (sData.images ? sData.images[0] : "");
          
          // Update the story status to paid
          await updateDoc(storyRef, {
            paid: true,
            status: "processing",
            lastUpdated: serverTimestamp()
          });
        }
      }
    } catch (innerDbError) {
      console.error("⚠️ Non-Fatal Story Update Error:", innerDbError);
      // We don't return 500 here because the payment IS verified. 
      // We want the user to get their success screen.
    }

    // 4. Create the Order (This is what your Dashboard reads)
    await addDoc(collection(db, "orders"), {
      userId,
      storyId: storyId || "unknown",
      storyTitle,
      coverImage,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      planType,
      shipping,
      status: planType === "hardcopy" ? "Sent for Printing" : "Digital Delivered",
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 FATAL VERIFY ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}