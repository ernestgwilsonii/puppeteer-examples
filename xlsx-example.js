const puppeteer = require("puppeteer");
const xlsx = require("xlsx"); // REF: https://www.youtube.com/watch?v=QKAAIWJp6cU

let headlessMode = true; // true hides the browser

let url = "https://books.toscrape.com/";

async function getPageData(url, page) {
  await page.goto(url);
  // await page.screenshot({ path: 'example.png', fullPage: true });

  const product = await page.$eval(
    ".product_main h1",
    (product) => product.textContent
  );
  const price = await page.$eval(".price_color", (price) => price.textContent);
  const availability = await page.$eval(
    ".instock.availability",
    (availability) => availability.innerText.trim()
  );

  results = {
    product: product,
    price: price,
    availability: availability,
  };
  //console.log(results);
  return results;
}

async function getAllProductUrls(url) {
  const browser = await puppeteer.launch({
    headless: headlessMode,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const productUrls = await page.$$eval(
    ".product_pod .image_container a",
    (allAs) => allAs.map((a) => a.href)
  );
  //console.log(productUrls);
  await browser.close();
  return productUrls;
}

async function main(url) {
  const browser = await puppeteer.launch({
    headless: headlessMode,
  });
  const page = await browser.newPage();

  const productUrls = await getAllProductUrls(url);
  //console.log(productUrls);

  const scrapedData = [];
  for (let productLink of productUrls) {
    const data = await getPageData(productLink, page);
    // console.log(data);
    scrapedData.push(data);
  }
  //console.log(scrapedData);

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(scrapedData);
  xlsx.utils.book_append_sheet(wb, ws);
  xlsx.writeFile(wb, "books.xlsx");

  await browser.close();
  console.log("Done!");
}

main(url);
