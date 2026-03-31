// app/api/pdf/route.js
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const { html } = await req.json();
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });
    
    const pdf = await page.pdf({
      width: '297mm',      // ✅ FIXED: A4 landscape width
      height: '210mm',     // ✅ FIXED: A4 landscape height
      printBackground: true,
      preferCSSPageSize: false,  // ✅ Let Puppeteer control size
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      },
    });
    
    await browser.close();
    
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=storybook.pdf",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error generating PDF", { status: 500 });
  }
}