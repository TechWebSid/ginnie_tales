import { NextResponse } from "next/server";
import { Resend } from "resend";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel timeout issue fix karne ke liye
export const maxDuration = 60; 

export async function POST(req) {
  let browser = null;
  try {
    const { storyHtml, userEmail, storyTitle } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Production-Ready Puppeteer Launch Settings
    // Ye logic serverless environment (Vercel) mein chrome dhundne ke liye hai
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // HTML content set karein
    await page.setContent(storyHtml, { waitUntil: "networkidle0" });

    // 2. Buffer mein PDF generate karein
    // Landscape mode isliye kyunki aapka template 297x210 (A4 Landscape) hai
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true, 
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
    });

    await browser.close();

    // 3. Resend se email bhejein
    const base64Content = Buffer.from(pdfBuffer).toString("base64");

    const data = await resend.emails.send({
      from: "Ginnie Tales <magic@techwebsid.in>", 
      to: userEmail, 
      subject: `✨ Your Magical Story: ${storyTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #FEF9EF; border-radius: 20px;">
          <h2 style="color: #EF476F;">Hi Explorer! 🧞‍♂️</h2>
          <p style="font-size: 16px; color: #073B4C;">Aapki magical story <strong>"${storyTitle}"</strong> ab ready hai.</p>
          <p style="font-size: 14px; color: #118AB2;">Humne is email ke saath aapki PDF attach kar di hai. Isse download karein aur maze karein!</p>
          <br/>
          <p style="font-weight: bold; color: #073B4C;">Team GinnieTales ✨</p>
        </div>
      `,
      attachments: [
        {
          filename: `${storyTitle.replace(/\s+/g, '_')}.pdf`,
          content: base64Content,
        },
      ],
    });

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Email/PDF Error:", error);
    
    // Browser close karna mat bhoolna agar error aaye toh, warna memory leak hoga
    if (browser !== null) {
      await browser.close();
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}