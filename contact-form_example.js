const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    args: ["--start-maximized"],
    headless: false,
    slowMo: 500,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  //Go to my page and wait until the page loads
  await page.goto("https://www.aymen-loukil.com/en/contact-aymen/", {
    waitUntil: "networkidle2"
  });
  await page.waitForSelector("#genesis-content > article > header > h1");

  
  //type the name
  await page.focus(
    "#wpcf7-f97-p311-o1 > form > p:nth-child(2) > label > span > input"
  );
  await page.keyboard.type("PuppeteerBot");

  //type the email
  await page.focus(
    "#wpcf7-f97-p311-o1 > form > p:nth-child(3) > label > span > input"
  );
  await page.keyboard.type("PuppeteerBot@mail.com");
  //type the message
  await page.focus(
    "#wpcf7-f97-p311-o1 > form > p:nth-child(4) > label > span > textarea"
  );
  await page.keyboard.type(
    "Hello Aymen ! It is me your PuppeteerBot, i test your contact form !"
  );
  //Click on the submit button
  await page.click("#wpcf7-f97-p311-o1 > form > p:nth-child(5) > input");
  await page.screenshot({ path: "form.png", fullPage: true });
})();
