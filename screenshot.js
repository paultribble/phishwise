const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 960 },
    deviceScaleFactor: 3
  });

  const filePath = path.resolve(__dirname, 'PhishWise_Poster.html');
  await page.goto(`file:///${filePath}`);

  const outputPath = path.resolve('C:/Users/Ptribble/Desktop', 'PhishWise_Poster.png');
  await page.screenshot({
    path: outputPath
  });

  await browser.close();
  console.log(`✅ Screenshot saved: ${outputPath}`);
})();
