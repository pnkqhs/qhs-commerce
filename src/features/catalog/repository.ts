import 'server-only';
import { cache } from 'react';
import { configured, supabaseServer } from '@/lib/supabase/server';
import { demoBrands, demoCategories, demoProducts, demoPosts } from './demo';
import type { Brand, Category, Content, Product } from '@/types/catalog';
export const isDemo = () => !configured() && process.env.DEMO_MODE === 'true';
async function read<T>(table: string, demo: T[]): Promise<T[]> {
  if (!configured()) return isDemo() ? demo : [];
  const db = await supabaseServer();
  const rows: T[] = [];
  for (let start = 0; ; start += 500) {
    const { data, error } = await db
      .from(table)
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .order('id')
      .range(start, start + 499);
    if (error) throw new Error('Không thể tải dữ liệu. Vui lòng thử lại.');
    rows.push(...(data as T[]));
    if (data.length < 500) return rows;
  }
}
export const categories = cache(() => read<Category>('categories', demoCategories));
export const brands = cache(() => read<Brand>('brands', demoBrands));
export const products = cache(() => read<Product>('products', demoProducts));
export const content = cache((kind: 'posts' | 'projects' | 'pages') =>
  read<Content>(kind, kind === 'posts' ? demoPosts : []),
);
export function productHref(p: Product, cats: Category[]) {
  return `/${cats.find((c) => c.id === p.category_id)?.slug || 'san-pham'}/${p.slug}`;
}
export const money = (value: number | null) =>
  value === null
    ? 'Liên hệ báo giá'
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
