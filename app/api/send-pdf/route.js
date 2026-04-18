import { NextResponse } from "next/server";
import { Resend } from "resend";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel Timeout issue fix (Free tier pe 10s hota hai, hum 60s tak le ja rahe hain)
export const maxDuration = 60; 

export async function POST(req) {
  let browser = null;
  
  try {
    const { storyHtml, userEmail, storyTitle } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const isLocal = process.env.NODE_ENV === 'development';
    
    // --- FORCE PATH LOGIC ---
    let execPath;
    if (isLocal) {
      // Windows standard path, Mac/Linux hai toh please change it
      execPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; 
    } else {
      // Vercel/Production: @sparticuz/chromium will fetch the binary
      execPath = await chromium.executablePath();
    }

    console.log("Launching browser with path:", execPath);

    browser = await puppeteer.launch({
      args: isLocal 
        ? ['--no-sandbox'] 
        : [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      defaultViewport: chromium.defaultViewport,
      executablePath: execPath,
      headless: isLocal ? true : chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // Yahan hum html content inject kar rahe hain
    await page.setContent(storyHtml, { 
      waitUntil: "networkidle0",
      timeout: 30000 // 30 seconds wait for assets to load
    });

    // Generate PDF (Landscape mode for your template)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
    });

    await browser.close();
    browser = null; // Memory management

    // Convert PDF Buffer to Base64 for Resend
    const base64Content = Buffer.from(pdfBuffer).toString("base64");

    // Send Email via Resend
    const data = await resend.emails.send({
      from: "Ginnie Tales <magic@techwebsid.in>", 
      to: userEmail,
      subject: `✨ Your Magical Story: ${storyTitle}`,
      html: `
        <div style="font-family: 'Helvetica', sans-serif; padding: 30px; background-color: #FEF9EF; border-radius: 20px; border: 4px solid #FFD166;">
          <h1 style="color: #EF476F; font-style: italic;">Hello, Magic Maker! 🧞‍♂️</h1>
          <p style="font-size: 18px; color: #073B4C;">Aapki story <b>"${storyTitle}"</b> ban kar taiyaar ho chuki hai.</p>
          <p style="font-size: 14px; color: #118AB2;">Humne is email ke saath print-ready PDF attach kar di hai.</p>
          <hr style="border: 1px dashed #FFD166; margin: 20px 0;" />
          <p style="font-weight: bold; color: #073B4C;">Magic awaits you!</p>
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
    console.error("Critical PDF/Email Error:", error);
    
    // Safety check to close browser in case of crash
    if (browser !== null) {
      await browser.close();
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}