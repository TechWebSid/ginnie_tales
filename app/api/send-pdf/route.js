import { NextResponse } from "next/server";
import { Resend } from "resend";
import puppeteer from "puppeteer";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { storyHtml, userEmail, storyTitle } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Puppeteer Setup
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Reliability ke liye best practice
    });
    const page = await browser.newPage();
    
    // HTML content set karein
    await page.setContent(storyHtml, { waitUntil: "networkidle0" });

    // 2. Buffer mein PDF generate karein
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" }
    });

    await browser.close();

    // 3. Resend se email bhejein
    // Sabse important change: Buffer ko base64 mein convert karne ka sahi tarika
    const base64Content = Buffer.from(pdfBuffer).toString("base64");

 // api/send-pdf/route.js ke andar "resend.emails.send" wala part badlein:

const data = await resend.emails.send({
  // 'from' mein apna verified domain wala email daalein
  from: "Ginnie Tales <magic@techwebsid.in>", 
  to: userEmail, // Ye dynamic rahega jo frontend se aayega
  subject: `✨ Your Magical Story: ${storyTitle}`,
  html: `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2 style="color: #EF476F;">Hi Explorer!</h2>
      <p>Aapki story <strong>"${storyTitle}"</strong> ready hai.</p>
      <p>Enjoy your magical journey! 🧞‍♂️✨</p>
    </div>
  `,
  attachments: [
    {
      filename: `${storyTitle.replace(/\s+/g, '_')}.pdf`,
      content: Buffer.from(pdfBuffer).toString("base64"),
    },
  ],
});

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}