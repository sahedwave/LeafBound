import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const html = pathToFileURL("/workspace/.grok/og-card.html").href;
const out = "/workspace/.grok/card-raw.png";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  await page.goto(html, { waitUntil: "load", timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const fonts = await page.evaluate(() =>
    [...document.fonts].map((f) => `${f.family} ${f.status} ${f.weight}`),
  );
  console.log("fonts", fonts);
  await page.screenshot({ path: out, type: "png", omitBackground: false });
  console.log("wrote", out);
} finally {
  await browser.close();
}
