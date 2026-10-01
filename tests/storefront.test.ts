import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { allowIndexing } from '../src/lib/indexing';
import data from '../src/features/catalog/official.json';
import { solutions } from '../src/features/content/solutions';
import { knowledge } from '../src/features/content/editorial';
import { filterProducts } from '../src/features/search/filter';
import { demoProducts, demoCategories, demoBrands } from '../src/features/catalog/demo';
test('indexing requires production environment and a production hostname', () => {
  for (const host of ['https://qhs-commerce.vercel.app', 'http://localhost:3000', 'invalid'])
    assert.equal(allowIndexing(host, 'production'), false);
  assert.equal(allowIndexing('https://candientuquochung.com', 'staging'), false);
  assert.equal(allowIndexing('https://candientuquochung.com', 'production'), true);
});
test('published source assets exist and quoted products never acquire invented prices', () => {
  for (const p of data.products) {
    assert.equal(p.price, null);
    assert.ok(p.source_url.startsWith('https://candientuquochung.com/'));
    for (const image of p.gallery) assert.ok(existsSync(`public${image}`), image);
  }
  for (const item of [...data.projects, ...knowledge])
    assert.ok(existsSync(`public${item.featured_image}`), item.featured_image);
  for (const s of solutions) assert.ok(existsSync(`public${s.image}`), s.image);
});
test('technical filter matches a complete label and value pair', () => {
  const p = demoProducts[0];
  const spec = p.specs[0];
  assert.ok(
    filterProducts(demoProducts, demoCategories, demoBrands, {
      spec: `${spec.label}:${spec.value}`,
    }).some((found) => found.id === p.id),
  );
  assert.equal(
    filterProducts(demoProducts, demoCategories, demoBrands, { spec: 'Vật liệu:missing' }).length,
    0,
  );
});
