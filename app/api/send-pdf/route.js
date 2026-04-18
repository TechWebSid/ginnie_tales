import { NextResponse } from "next/server";
import { Resend } from "resend";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel function timeout fix
export const maxDuration = 60; 

export async function POST(req) {
  let browser = null;
  
  try {
    const { storyHtml, userEmail, storyTitle } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const isLocal = process.env.NODE_ENV === 'development';
    
    // Vercel/Lambda specific settings
    if (!isLocal) {
      // Graphics mode disable karna zaroori hai serverless environment ke liye
      chromium.setGraphicsMode = false;
    }

    // Path resolution
    const execPath = isLocal 
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // Windows
      : await chromium.executablePath();

    browser = await puppeteer.launch({
      args: isLocal 
        ? ["--no-sandbox"] 
        : [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: execPath,
      headless: isLocal ? true : chromium.headless,
    });

    const page = await browser.newPage();
    
    // Inject HTML
    await page.setContent(storyHtml, { 
      waitUntil: "networkidle0",
      timeout: 30000 
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
    });

    await browser.close();
    browser = null;

    // Convert to Base64
    const base64Content = Buffer.from(pdfBuffer).toString("base64");

    // Send via Resend
    const data = await resend.emails.send({
      from: "Ginnie Tales <magic@techwebsid.in>", 
      to: userEmail,
      subject: `✨ Your Magical Story: ${storyTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #EF476F; border-radius: 15px;">
          <h2 style="color: #EF476F;">Magic Delivered! 🧞‍♂️</h2>
          <p>Hi Explorer, your story <b>"${storyTitle}"</b> is ready for printing.</p>
          <p>Check the attachment below.</p>
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
    console.error("Critical Error in PDF Route:", error);
    
    if (browser !== null) {
      await browser.close();
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}