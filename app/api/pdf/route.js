import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const { html } = await req.json();
    
    // Note: If deploying to Vercel, consider using @sparticuz/chromium 
    // but for local/VPS this standard puppeteer setup is fine.
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    
    const page = await browser.newPage();
    
    await page.setContent(html, {
      waitUntil: "networkidle0", // Wait for images to load
    });
    
    const pdf = await page.pdf({
      width: '297mm',      
      height: '210mm',     
      printBackground: true,
      preferCSSPageSize: false,  
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      },
    });
    
    await browser.close();
    
    // ✅ MOBILE OPTIMIZED RESPONSE
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=GinnieTales_MagicBook.pdf",
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (err) {
    console.error("Puppeteer Error:", err);
    return new Response(JSON.stringify({ error: "PDF Generation Failed" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}