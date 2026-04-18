import { NextResponse } from "next/server";
import { Resend } from "resend";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const resend = new Resend(process.env.RESEND_API_KEY);
export const maxDuration = 60;

export async function POST(req) {
  let browser = null;
  try {
    const { storyHtml, userEmail, storyTitle } = await req.json();

    // LOCAL vs PRODUCTION check
    const isLocal = process.env.NODE_ENV === 'development';

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      // Local pe ye aapke system ka Chrome path uthayega, Vercel pe Chromium ka
      executablePath: isLocal 
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // Windows path (Change if Mac)
        : await chromium.executablePath(), 
      headless: isLocal ? true : chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(storyHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
    });

    await browser.close();

    const base64Content = Buffer.from(pdfBuffer).toString("base64");

    const data = await resend.emails.send({
      from: "Ginnie Tales <magic@techwebsid.in>",
      to: userEmail,
      subject: `✨ Your Magical Story: ${storyTitle}`,
      html: `<div><h2>Hi Explorer!</h2><p>Story attached!</p></div>`,
      attachments: [
        {
          filename: `${storyTitle.replace(/\s+/g, '_')}.pdf`,
          content: base64Content,
        },
      ],
    });

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Critical Error:", error);
    if (browser) await browser.close();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}