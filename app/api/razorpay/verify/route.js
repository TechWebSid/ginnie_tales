import crypto from "crypto"; 
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin"; // 1. Use the Admin DB
import { FieldValue } from "firebase-admin/firestore"; // 2. Admin use FieldValue for timestamps

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, storyId, userId, shipping, planType } = body;

    // 1. Signature Verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
    }

    // 2. Stories Update (Using Admin SDK)
    let storyTitle = "My Magical Tale";
    let coverImage = "";

    if (storyId) {
      const storyRef = adminDb.collection("stories").doc(storyId);
      const storySnap = await storyRef.get(); // Admin SDK uses .get() on a DocumentReference
      
      if (storySnap.exists) {
        const sData = storySnap.data();
        storyTitle = sData.title || sData.prompt || "My Adventure";
        coverImage = sData.coverImage || (sData.images ? sData.images[0] : "");
        
        await storyRef.update({
          paid: true,
          planType: planType,
          status: "processing",
          lastUpdated: FieldValue.serverTimestamp() // Admin SDK timestamp
        });
      }
    }

    // 3. Orders Logic (Using Admin SDK)
    const ordersRef = adminDb.collection("orders");
    
    // Admin SDK query syntax
    const querySnapshot = await ordersRef
      .where("storyId", "==", storyId)
      .where("userId", "==", userId)
      .get();

    if (!querySnapshot.empty && planType === "hardcopy") {
      // UPGRADE: Update existing record
      const orderDoc = querySnapshot.docs[0];
      await orderDoc.ref.update({
        planType: "hardcopy",
        shipping: shipping,
        status: "Sent for Printing",
        upgradePaymentId: razorpay_payment_id,
        lastUpdated: FieldValue.serverTimestamp()
      });
    } else {
      // NEW: Create record
      await ordersRef.add({
        userId: userId || "unknown",
        storyId: storyId || "unknown",
        storyTitle,
        coverImage,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        planType,
        shipping,
        status: planType === "hardcopy" ? "Sent for Printing" : "Digital Delivered",
        createdAt: FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 VERIFY ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}