import crypto from "crypto"; 
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, storyId, userId } = body;

    // 1. Verify Secret exists
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("SECRET MISSING IN ENV");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // 2. Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
    }

    // 3. Database Updates
    try {
      await updateDoc(doc(db, "stories", storyId), {
        paid: true,
        status: "processing",
        lastUpdated: serverTimestamp()
      });

      await addDoc(collection(db, "orders"), {
        userId: userId || "anonymous",
        storyId,
        paymentId: razorpay_payment_id,
        createdAt: serverTimestamp()
      });
    } catch (dbError) {
      console.error("FIRESTORE ERROR:", dbError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("VERIFY ROUTE GLOBAL ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}