import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ordersSnap = await adminDb.collection("orders").get();
    
    let totalEarning = 0;
    let ebookCount = 0;
    let hardcopyCount = 0;

    ordersSnap.forEach((doc) => {
      const data = doc.data();
      
      // Order types count
      if (data.planType === "hardcopy") {
        hardcopyCount++;
        totalEarning += 999; // Replace with your actual hardcopy price
      } else {
        ebookCount++;
        totalEarning += 199; // Replace with your actual ebook price
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: ordersSnap.size,
        totalEarning,
        ebookCount,
        hardcopyCount,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}