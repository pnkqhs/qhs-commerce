import { test, expect } from '@playwright/test';
const real = process.env.QHS_TEST_REAL_DATA === '1';
const productName = real ? 'Cân bàn VDI02 Kubota MasterScale' : 'Cân bàn điện tử 300kg';
test('desktop catalogue, search, product and protected routes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Chính xác từng phép cân');
  await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true });
  await page.locator('summary').filter({ hasText: 'Danh mục sản phẩm' }).click();
  await expect(page.locator('.mega-panel')).toBeVisible();
  await page.locator('.mega-panel').getByRole('link', { name: 'Cân bàn', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cân bàn');
  await page.goto(real ? '/tim-kiem?q=vdi02' : '/tim-kiem?q=can%20ban%20300');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.locator('.product-card h3 a').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(productName);
  await expect(page.locator('#specs')).toContainText(real ? '500' : '300 kg');
  await page.screenshot({ path: 'artifacts/product-desktop.png', fullPage: true });
  await page
    .getByRole('link', { name: /Nhận báo giá/ })
    .first()
    .click();
  await expect(page.locator('.notice')).toContainText(productName);
  await page.goto('/admin/products');
  await expect(page).toHaveURL(/dang-nhap/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Đăng nhập tài khoản');
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Trang này không còn');
  expect(errors).toEqual([]);
});
test('mobile layout, filters and honest unconfigured lead response', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'artifacts/home-mobile.png', fullPage: true });
  await page.goto('/san-pham');
  await page.getByText('Bộ lọc sản phẩm', { exact: true }).click();
  await page.getByLabel('Giá đến (₫)').fill('4000000');
  await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
  await expect(page.locator('.product-card')).toHaveCount(real ? 0 : 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.goto('/lien-he');
  await page.route('**/api/leads', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Yêu cầu chưa được lưu. Vui lòng thử lại.' }),
    }),
  );
  await page.getByRole('button', { name: 'Gửi yêu cầu tư vấn' }).click();
  await expect(page.getByText('Nhập họ tên')).toBeVisible();
  await page.getByLabel('Họ và tên *').fill('Khách kiểm thử');
  await page.getByLabel('Điện thoại *').fill('0901234567');
  await page.getByLabel('Nhu cầu của bạn *').fill('Cần tư vấn cân bàn 300 kg cho kho hàng.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Gửi yêu cầu tư vấn' }).click();
  await expect(page.locator('form [role="alert"]')).toContainText('Yêu cầu chưa được lưu');
  await expect(page.getByText('Đã nhận yêu cầu của bạn')).toHaveCount(0);
  await page.screenshot({ path: 'artifacts/contact-mobile.png', fullPage: true });
});
test('SEO HTML and API origin checks', async ({ request }) => {
  const response = await request.get(
    real ? '/can-ban/can-ban-vdi02-kubota' : '/can-ban/can-ban-300kg-demo',
  );
  const html = await response.text();
  expect(html).toContain(productName);
  expect(html).toContain('noindex');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('BreadcrumbList');
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  expect(
    (
      await request.post('/api/leads', { headers: { origin: 'https://invalid.example' }, data: {} })
    ).status(),
  ).toBe(403);
});
