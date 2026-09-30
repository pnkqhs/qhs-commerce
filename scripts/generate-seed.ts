import { writeFileSync } from 'node:fs';
import { demoCategories, demoBrands, demoProducts, demoPosts } from '../src/features/catalog/demo';
const id = (n: number) => `10000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const categoryIds = new Map(demoCategories.map((c, i) => [c.id, id(i + 1)]));
const quote = (v: unknown): string =>
  v === null
    ? 'null'
    : typeof v === 'boolean' || typeof v === 'number'
      ? String(v)
      : `'${(typeof v === 'object' ? JSON.stringify(v) : String(v)).replaceAll("'", "''")}'`;
function insert(table: string, rows: Record<string, unknown>[]) {
  return rows
    .map(
      (row) =>
        `insert into public.${table}(${Object.keys(row).join(',')}) values(${Object.values(row).map(quote).join(',')}) on conflict(id) do nothing;`,
    )
    .join('\n');
}
const catalog = demoCategories.map((c) => ({
  ...c,
  id: categoryIds.get(c.id),
  parent_id: c.parent_id ? categoryIds.get(c.parent_id) : null,
}));
writeFileSync(
  'supabase/seed.sql',
  '-- Production-safe taxonomy only. No products or commercial claims.\nbegin;\n' +
    insert('categories', catalog) +
    '\ncommit;\n',
);
writeFileSync(
  'supabase/seed.demo.sql',
  '-- OPTIONAL DEMO ONLY. Never run on production.\nbegin;\n' +
    insert(
      'brands',
      demoBrands.map((b) => ({ ...b, id: id(100) })),
    ) +
    '\n' +
    insert(
      'products',
      demoProducts.map((p) => ({
        ...p,
        category_id: categoryIds.get(p.category_id),
        brand_id: id(100),
      })),
    ) +
    '\n' +
    insert(
      'posts',
      demoPosts.map((p) => ({ ...p, id: id(200) })),
    ) +
    '\ncommit;\n',
);
