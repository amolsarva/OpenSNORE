const { chromium } = require('/opt/node22/lib/node_modules/playwright/node_modules/playwright-core');
const path = require('path');

const html = (size) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${size}px;
    height: ${size}px;
    overflow: hidden;
  }
  .icon {
    width: ${size}px;
    height: ${size}px;
    background: #0a0a1f;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
  }
  .moon {
    font-size: ${Math.round(size * 0.58)}px;
    line-height: 1;
    filter: drop-shadow(0 0 ${Math.round(size * 0.04)}px rgba(255, 220, 100, 0.6));
    position: relative;
    z-index: 1;
  }
  .zz {
    position: absolute;
    top: ${Math.round(size * 0.07)}px;
    right: ${Math.round(size * 0.07)}px;
    font-size: ${Math.round(size * 0.22)}px;
    font-weight: 900;
    color: #8b5cf6;
    font-family: 'Arial Black', 'Impact', sans-serif;
    letter-spacing: -0.05em;
    text-shadow:
      0 0 ${Math.round(size * 0.03)}px #8b5cf6,
      0 0 ${Math.round(size * 0.06)}px #8b5cf6,
      0 0 ${Math.round(size * 0.10)}px rgba(139, 92, 246, 0.7),
      0 0 ${Math.round(size * 0.16)}px rgba(139, 92, 246, 0.4);
    z-index: 2;
    line-height: 1;
  }
  /* Subtle purple glow overlay */
  .glow {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(
      ellipse at 75% 20%,
      rgba(139, 92, 246, 0.15) 0%,
      transparent 60%
    );
    z-index: 0;
    pointer-events: none;
  }
</style>
</head>
<body>
  <div class="icon">
    <div class="glow"></div>
    <div class="moon">🌙</div>
    <div class="zz">ZZ</div>
  </div>
</body>
</html>`;

async function generateIcon(browser, size, outputPath) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html(size), { waitUntil: 'networkidle' });
  // Small wait to ensure fonts/emojis render
  await page.waitForTimeout(500);
  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: size, height: size },
    type: 'png'
  });
  await page.close();
  console.log(`Generated ${outputPath} (${size}x${size})`);
}

(async () => {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const publicDir = '/home/user/OpenSnoRE/public';

  await generateIcon(browser, 512, path.join(publicDir, 'icon-512.png'));
  await generateIcon(browser, 192, path.join(publicDir, 'icon-192.png'));
  await generateIcon(browser, 180, path.join(publicDir, 'apple-touch-icon.png'));

  await browser.close();
  console.log('All icons generated successfully!');
})();
