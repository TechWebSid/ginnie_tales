export const downloadVendorPDF = async (story) => {
  const brandName = "Genie Tales";
  
  // This is the HTML structure that your Puppeteer route will render
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
          .page { width: 297mm; height: 210mm; display: flex; page-break-after: always; overflow: hidden; position: relative; }
          .img-side { width: 50%; height: 100%; }
          .img-side img { width: 100%; height: 100%; object-fit: cover; }
          .text-side { width: 50%; height: 100%; background: #FFFCF9; padding: 60px; display: flex; flex-direction: column; justify-content: center; border-left: 1px solid #eee; }
          .story-text { font-size: 24px; line-height: 1.6; color: #1e293b; }
          .footer { margin-top: auto; font-size: 12px; color: #ec4899; font-weight: bold; text-transform: uppercase; border-top: 1px solid #eee; pt: 10px; }
        </style>
      </head>
      <body>
        <div class="page" style="background: #ec4899; justify-content: center; align-items: center; color: white;">
          <img src="${story.coverImage}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.4;" />
          <h1 style="font-size: 60px; text-align: center; position: relative; z-index: 10; text-transform: uppercase;">${story.prompt}</h1>
        </div>

        ${story.pages.map((text, i) => `
          <div class="page">
            <div class="img-side"><img src="${story.images?.[i] || story.coverImage}" /></div>
            <div class="text-side">
              <p class="story-text">${text}</p>
              <div class="footer">${brandName} | PAGE ${i + 1}</div>
            </div>
          </div>
        `).join('')}
      </body>
    </html>
  `;

  const response = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: htmlContent }),
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `VENDOR_${story.id}.pdf`;
  a.click();
};