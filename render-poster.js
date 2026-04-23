const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('🎨 Rendering PhishWise poster at high resolution...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // Render at native poster size (1280x960) with 3x device scale
  // Results in 3840x2880 pixels = 3.125x upscale for crisp printing
  await page.setViewport({
    width: 1280,
    height: 960,
    deviceScaleFactor: 3
  });

  // Load HTML from file system
  const htmlPath = path.join(__dirname, 'PhishWise_Poster.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle2', timeout: 30000 });

  // Screenshot at full resolution with high quality
  const outputPath = path.join(__dirname, 'PhishWise_Poster_HiRes.png');
  await page.screenshot({
    path: outputPath,
    fullPage: false,
    type: 'png',
    omitBackground: false
  });

  console.log(`✅ Poster rendered successfully!`);
  console.log(`📐 Resolution: 3840×2880 pixels (4:3 aspect ratio, 3x upscale)`);
  console.log(`💾 File: ${outputPath}`);
  console.log(`📏 Print quality: ~12.8" × 9.6" at 300 DPI (suitable for 3ft poster)`);
  console.log('\n📌 Next steps:');
  console.log('  1. Open PhishWise_Poster_HiRes.png');
  console.log('  2. In PowerPoint: Insert > Pictures > Select the PNG');
  console.log('  3. Position next to your ribbon on the left');
  console.log('  4. Right-click > Position and Size to set exact dimensions');

  await browser.close();
})();
