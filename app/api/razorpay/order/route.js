import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { amount, storyId, planType } = await req.json();

    const options = {
      amount: amount * 100, // Razorpay works in Paisa
      currency: "INR",
      receipt: `rcpt_${storyId}`,
      notes: { storyId, planType },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}