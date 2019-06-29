const puppeteer = require("puppeteer");

async function main() {
  const browser = await puppeteer.launch({
    args: ["--start-maximized"],
    headless: false,
    defaultViewport: null
  });

  const page = (await browser.pages())[0];
  await page.goto("https://coinmarketcap.com/", { waitUntil: "networkidle0" });
  await page.evaluate(() =>
    document.querySelector(".banner-alert-fixed-bottom").remove()
  );
  await screenshotDOMElements({
    page,
    path: "element.png",
    selector: "table.dataTable > tbody > tr:nth-child(-n+50)",
    addHeight: true
  });
  await screenshotDOMElements({
    page,
    path: "element2.png",
    selector: "table.dataTable > tbody > tr:nth-child(n+50)",
    addHeight: true
  });
  console.log("Finished");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

/**
 * Takes a screenshot of a DOM elements on the page, with optional padding.
 * @return {!Promise<!Buffer>}
 */
async function screenshotDOMElements({
  page,
  padding = 0,
  path = null,
  selector,
  addWidth = false,
  addHeight = false
} = {}) {
  if (!selector) {
    throw Error("Please provide a selector.");
  }

  const rect = await page.evaluate(
    (selector, addWidth, addHeight) => {
      let minX = Infinity;
      let minY = Infinity;
      let maxWidth = 0;
      let maxHeight = 0;
      const elements = document.querySelectorAll(selector);
      if (elements) {
        for (const element of elements) {
          const { x, y, width, height } = element.getBoundingClientRect();
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxWidth = addWidth ? maxWidth + width : Math.max(maxWidth, width);
          maxHeight = addHeight
            ? maxHeight + height
            : Math.max(maxHeight, height);
        }
        return {
          left: minX,
          top: minY,
          width: maxWidth,
          height: maxHeight
        };
      }
      return null;
    },
    selector,
    addWidth,
    addHeight
  );

  if (!rect) {
    throw Error(`Could not find element that matches selector: ${selector}.`);
  }

  return page.screenshot({
    path,
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    }
  });
}
