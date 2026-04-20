import { NextResponse } from "next/server";
import { Resend } from "resend";
import puppeteer from "puppeteer-core";

const resend = new Resend(process.env.RESEND_API_KEY);
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;

export const maxDuration = 60; 

async function connectWithRetry(retries = 2, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_TOKEN}`,
      });
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export async function POST(req) {
  let browser = null;
  
  try {
    const { storyHtml, userEmail, storyTitle } = await req.json();

    browser = await connectWithRetry();
    const page = await browser.newPage();
    
    // images ke loading time ko optimize karne ke liye cache disable karein
    await page.setCacheEnabled(false);

    // FIX: 'load' use karein jo fast hota hai, aur timeout thoda badhayein
    await page.setContent(storyHtml, { 
      waitUntil: "load", 
      timeout: 30000 
    });

    // Sabse important: Ek manual wait taaki images render ho jayein
    // 4-8 pages ke liye 4000 (4s) kafi hai, 25 pages ke liye 8000 (8s) kar dena
    await new Promise(resolve => setTimeout(resolve, 5000)); 

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
    });

    await browser.close();
    browser = null;

    const base64Content = Buffer.from(pdfBuffer).toString("base64");

    const data = await resend.emails.send({
      from: "Ginnie Tales <magic@techwebsid.in>", 
      to: userEmail,
      subject: `✨ Your Magical Story: ${storyTitle}`,
      html: `<p>Your story <b>"${storyTitle}"</b> is ready!</p>`,
      attachments: [
        {
          filename: `${storyTitle.replace(/\s+/g, '_')}.pdf`,
          content: base64Content,
        },
      ],
    });

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Critical PDF Error:", error);
    if (browser) await browser.close();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}