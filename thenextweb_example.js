const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    args: ["--start-maximized"],
    //defaultViewport: null,
    defaultViewport: { width: 320, height: 480 },
    headless: false
  });
  const page = await browser.newPage();
  await page.goto("https://thenextweb.com/");
  await page.setViewport({ width: 320, height: 480 });

  await page.screenshot({ path: "next.png", fullPage: false });

  await browser.close();
})();
