import puppeteer from "puppeteer";
// https://crawlee.dev/docs/quick-start

export const pptr = async (url: string) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.resourceType() === "image") {
      request.abort();
    } else {
      request.continue();
    }
  });

  // Navigate the page to a URL
  await page.goto(url, { waitUntil: "networkidle0" });

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  );
  await page.setJavaScriptEnabled(true);

  // Query for an element handle.
  // const element = await page.waitForSelector("::-p-xpath(body)");
  const content = await page.content();
  await browser.close();

  return content;
};
