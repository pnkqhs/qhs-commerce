import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
mkdirSync('artifacts', { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.auditVitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.auditVitals.lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.auditVitals.cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => ({
    ...window.auditVitals,
    jsBytes: performance
      .getEntriesByType('resource')
      .filter((e) => e.initiatorType === 'script')
      .reduce((sum, e) => sum + e.encodedBodySize, 0),
    imageBytes: performance
      .getEntriesByType('resource')
      .filter((e) => e.initiatorType === 'img')
      .reduce((sum, e) => sum + e.encodedBodySize, 0),
    imagesMissing: [...document.images]
      .filter((i) => i.complete && !i.naturalWidth)
      .map((i) => i.src),
    noindex: document.querySelector('meta[name="robots"]')?.content,
  }));
  await page.screenshot({ path: `artifacts/production-home-${width}.png` });
  results.push({ width, ...metrics, errors });
  await page.close();
}
await browser.close();
mkdirSync('artifacts', { recursive: true });
writeFileSync(
  'artifacts/performance-audit.json',
  JSON.stringify(
    { origin, context: 'Local lab, unthrottled, not field Core Web Vitals', results },
    null,
    2,
  ),
);
console.log(JSON.stringify(results, null, 2));
