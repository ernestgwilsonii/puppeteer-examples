const puppeteer = require('puppeteer');

(async () => {
  let headlessMode = false // true hides the browser
  const browser = await puppeteer.launch({
    headless: headlessMode
  });
  const page = await browser.newPage();
  await page.goto('https://github.com/');
  await page.screenshot({ path: 'screen-capture-example.png', fullPage: true });

  await browser.close();
})();
