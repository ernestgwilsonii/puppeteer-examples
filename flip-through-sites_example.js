const puppeteer = require("puppeteer");
let sites = ["https://www.cnn.com/", "https://www.npmjs.org/", "https://news.google.com"];
let headlessMode = false; // If true the browser will be hidden
let screenCaptures = true;
let fullPageScreenCaptureMode = false;
let pageNum = 1; // Starting number for screen captures

(async () => {
  const browser = await puppeteer.launch({
    args: ["--start-maximized"],
    headless: headlessMode,
    //slowMo: 500,
    defaultViewport: { width: 1024, height: 768 }
  });

  const page = await browser.newPage();

  for (let site of sites) {
    await page.goto(site, {
      waitUntil: "networkidle2"
    });
    if (screenCaptures){
      await page.screenshot({ path: "page" + pageNum++ + ".png", fullPage: fullPageScreenCaptureMode });
    }
    
  }
  await browser.close();
})();
