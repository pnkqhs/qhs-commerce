import { test, expect } from '@playwright/test';
test.skip(process.env.QHS_TEST_REAL_DATA !== '1', 'Requires the imported official catalogue');
for (const width of [1440, 1280, 768, 390])
  test(`real storefront responsive ${width}`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const [name, path] of Object.entries({
      home: '/',
      catalog: '/san-pham',
      product: '/bo-chi-thi/dau-chi-thi-cti-1000',
      solution: '/giai-phap/tram-can-tu-dong',
      about: '/gioi-thieu',
      contact: '/lien-he',
      knowledge: '/kien-thuc/can-xe-tai-noi-va-chim',
      project: '/du-an/tram-can-80-tan-ea-sup',
    })) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo({ top: y, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForTimeout(550);
      await expect(page.locator('.reveal-pending')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} overflow at ${width}`,
      ).toBe(true);
      await expect(page.locator('footer a[href="/admin"]')).toHaveCount(0);
      await page.screenshot({ path: `artifacts/visual-${name}-${width}.png`, fullPage: true });
    }
    expect(errors).toEqual([]);
  });
test('gallery, keyboard menu, reduced motion and permanent redirects', async ({
  page,
  request,
}) => {
  await page.goto('/bo-chi-thi/dau-chi-thi-cti-1000');
  await page.getByRole('button', { name: 'Xem ảnh 2', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Xem ảnh 2', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: /Phóng to ảnh/ }).click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: /Phóng to ảnh/ })).toBeFocused();
  await page.locator('.mega summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.mega-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mega-panel')).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.reveal-pending')).toHaveCount(0);
  for (const [oldPath, newPath] of [
    ['can-ban-lon', 'nha-may-san-xuat'],
    ['can-ban', 'kho-van-logistics'],
    ['dung-cu-nong-san', 'nong-nghiep-nong-san'],
  ]) {
    const res = await request.get(`/giai-phap/${oldPath}`, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toContain(newPath);
  }
});
