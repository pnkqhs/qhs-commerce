import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { TaxonomyForm } from '@/components/admin/taxonomy-form';
import { ContentForm } from '@/components/admin/content-form';
import type { Category, Brand, Content } from '@/types/catalog';
export default async function Page({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module, id } = await params;
  if (!['categories', 'brands', 'posts', 'projects', 'pages'].includes(module)) notFound();
  const { db } = await requireRole(['admin', 'content']);
  const { data, error } =
    id === 'new'
      ? { data: undefined, error: null }
      : await db.from(module).select('*').eq('id', id).maybeSingle();
  if (id !== 'new' && (!data || error)) notFound();
  const { data: cats, error: catError } = await db.from('categories').select('*');
  if (catError) throw new Error('Không thể tải danh mục');
  return (
    <>
      <div className="admin-heading">
        <h1>
          {id === 'new' ? 'Thêm mới' : 'Chỉnh sửa'} / {module}
        </h1>
      </div>
      {module === 'categories' || module === 'brands' ? (
        <TaxonomyForm
          kind={module}
          item={data as Category | Brand | undefined}
          categories={cats as Category[]}
        />
      ) : (
        <ContentForm
          kind={module as 'posts' | 'projects' | 'pages'}
          item={data as Content | undefined}
        />
      )}
    </>
  );
}
