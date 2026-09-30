import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts } from '../src/features/search/filter';
import { demoProducts, demoCategories, demoBrands } from '../src/features/catalog/demo';
import { leadSchema } from '../src/features/leads/schema';
import { productSchema } from '../src/features/admin/schema';
test('search matches accents, model, SKU, category and technical values', () => {
  for (const q of ['can ban 300', 'DEMO-001', 'QHS-D1', '300 kg'])
    assert.equal(
      filterProducts(demoProducts, demoCategories, demoBrands, { q })[0]?.id,
      demoProducts[0].id,
    );
  assert.equal(
    filterProducts(demoProducts, demoCategories, demoBrands, { q: 'khong-ton-tai' }).length,
    0,
  );
});
test('category subtree and numeric price filters do not include unpriced products', () => {
  assert.equal(filterProducts(demoProducts, demoCategories, demoBrands, {}, 'group-0').length, 2);
  assert.equal(
    filterProducts(demoProducts, demoCategories, demoBrands, { max: '4000000' }).length,
    1,
  );
  assert.equal(
    filterProducts(demoProducts, demoCategories, demoBrands, { min: '4000000' }).length,
    0,
  );
});
test('lead rejects missing consent, malformed phone and honeypot', () => {
  const lead = {
    name: 'Nguyen Van A',
    phone: '0901234567',
    email: '',
    company: '',
    province: '',
    message: 'Can tu van can ban',
    product_id: '',
    type: 'quote',
    consent: true,
    website: '',
    landing_page: '/',
    referrer: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
  };
  assert.equal(leadSchema.safeParse(lead).success, true);
  for (const invalid of [
    { consent: false },
    { phone: 'abc' },
    { website: 'spam' },
    { product_id: 'not-uuid' },
  ])
    assert.equal(leadSchema.safeParse({ ...lead, ...invalid }).success, false);
});
test('product validation rejects dangerous URLs, invalid direct prices and malformed specs', () => {
  const p = {
    ...demoProducts[0],
    category_id: '10000000-0000-4000-8000-000000000001',
    brand_id: '',
    price: '3500000',
    sale_price: '',
    stock_quantity: '',
    specs: JSON.stringify(demoProducts[0].specs),
    gallery: '[]',
    documents: '[]',
    videos: '[]',
  };
  assert.equal(productSchema.safeParse(p).success, true);
  for (const invalid of [
    { featured_image: 'javascript:alert(1)' },
    { price: '' },
    { sale_price: '9000000' },
    { specs: '<script>' },
  ])
    assert.equal(productSchema.safeParse({ ...p, ...invalid }).success, false);
});
