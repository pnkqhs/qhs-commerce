'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { productSchema, taxonomySchema, contentSchema } from './schema';
export type SaveState = { error: string };
export async function saveProduct(
  id: string | null,
  _state: SaveState,
  form: FormData,
): Promise<SaveState> {
  const { db } = await requireRole(['admin', 'content']);
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' · '),
    };
  const query = id
    ? db.from('products').update(parsed.data).eq('id', id)
    : db.from('products').insert(parsed.data);
  const { error } = await query;
  if (error)
    return { error: 'Không thể lưu. Kiểm tra SKU/slug trùng, danh mục và quyền truy cập.' };
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}
export async function deleteProduct(id: string) {
  const { db } = await requireRole(['admin', 'content']);
  const { error } = await db.from('products').update({ status: 'archived' }).eq('id', id);
  if (error) throw new Error('Không thể lưu trữ sản phẩm');
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}
export async function saveTaxonomy(
  kind: 'categories' | 'brands',
  id: string | null,
  _state: SaveState,
  form: FormData,
): Promise<SaveState> {
  const { db } = await requireRole(['admin', 'content']);
  const parsed = taxonomySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(' · ') };
  const data =
    kind === 'brands'
      ? { name: parsed.data.name, slug: parsed.data.slug, status: parsed.data.status }
      : parsed.data;
  if (kind === 'categories' && id && parsed.data.parent_id === id)
    return { error: 'Danh mục không thể là cha của chính nó.' };
  const { error } = await (id
    ? db.from(kind).update(data).eq('id', id)
    : db.from(kind).insert(data));
  if (error) return { error: 'Không thể lưu. Kiểm tra slug và quan hệ danh mục.' };
  revalidatePath('/', 'layout');
  redirect(`/admin/${kind}`);
}
export async function saveContent(
  kind: 'posts' | 'projects' | 'pages',
  id: string | null,
  _state: SaveState,
  form: FormData,
): Promise<SaveState> {
  const { db } = await requireRole(['admin', 'content']);
  const parsed = contentSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(' · ') };
  const { publication_consent, ...rest } = parsed.data;
  const data = kind === 'projects' ? { ...rest, publication_consent } : rest;
  const { error } = await (id
    ? db.from(kind).update(data).eq('id', id)
    : db.from(kind).insert(data));
  if (error) return { error: 'Không thể lưu. Kiểm tra slug và đồng ý công bố dự án.' };
  revalidatePath('/', 'layout');
  redirect(`/admin/${kind}`);
}
