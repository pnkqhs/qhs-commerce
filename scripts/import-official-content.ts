/** Additive import. Existing slugs are preserved, never overwritten or deleted. */
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import data from '../src/features/catalog/official.json';
import { demoCategories } from '../src/features/catalog/demo';
import { knowledge } from '../src/features/content/editorial';
loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('QHS Commerce credentials are required.');
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const apply = process.argv.includes('--apply');
const imported: { table: string; id: string; slug: string }[] = [];
async function ensure(table: string, row: Record<string, unknown>) {
  const { data: existing, error } = await db
    .from(table)
    .select('id,slug')
    .eq('slug', row.slug)
    .maybeSingle();
  if (error) throw new Error(`${table}: ${error.code}`);
  if (existing) return existing.id as string;
  if (!apply) {
    console.log('Would insert', table, row.slug);
    return crypto.randomUUID();
  }
  const { data: saved, error: saveError } = await db
    .from(table)
    .insert(row)
    .select('id,slug')
    .single();
  if (saveError) throw new Error(`${table}: ${saveError.code} ${saveError.message}`);
  imported.push({ table, id: saved.id, slug: saved.slug });
  return saved.id as string;
}
async function main() {
  const ids = new Map<string, string>();
  const categories = new Map<string, string>();
  for (const c of demoCategories) {
    const { id, ...row } = c;
    const saved = await ensure('categories', {
      ...row,
      parent_id: c.parent_id ? ids.get(c.parent_id) : null,
    });
    ids.set(id, saved);
    categories.set(c.slug, saved);
  }
  const brands = new Map<string, string>();
  for (const [name, slug] of [
    ['Curiotec', 'curiotec'],
    ['CURIOSITY TECHNOLOGY', 'curiosity-technology'],
  ])
    brands.set(name, await ensure('brands', { name, slug, status: 'published' }));
  for (const p of data.products) {
    const { source_url, source_id, category_slug, brand, ...row } = p;
    void source_url;
    await ensure('products', {
      ...row,
      category_id: categories.get(category_slug),
      brand_id: brands.get(brand) || null,
      sku: `QHS-WP-${source_id}`,
      status: 'published',
      featured: true,
      is_demo: false,
      noindex: false,
      stock_status: 'contact',
      vat: 0,
      sale_price: null,
      stock_quantity: null,
      documents: [],
      videos: [],
      seo_title: p.name,
      meta_description: p.short_description,
    });
  }
  for (const p of data.projects) {
    const { source_url, source_id, source_date, ...row } = p;
    void source_url;
    void source_id;
    await ensure('projects', {
      ...row,
      status: 'published',
      publication_consent: true,
      is_demo: false,
      noindex: false,
      seo_title: p.title,
      meta_description: p.excerpt,
    });
    void source_date;
  }
  for (const p of knowledge) {
    const { source_url, links, ...row } = p;
    void source_url;
    void links;
    await ensure('posts', {
      ...row,
      status: 'published',
      is_demo: false,
      noindex: false,
      seo_title: p.title,
      meta_description: p.excerpt,
      published_at: new Date().toISOString(),
    });
  }
  if (apply)
    writeFileSync(
      'artifacts/official-import-result.json',
      JSON.stringify({ date: new Date().toISOString(), inserted: imported }, null, 2),
    );
  console.log(
    apply
      ? `Inserted ${imported.length} records. Existing content preserved.`
      : 'Dry run completed; use --apply to insert.',
  );
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Import failed');
  process.exitCode = 1;
});
