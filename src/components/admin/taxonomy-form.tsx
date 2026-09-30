'use client';
import { startTransition, useActionState } from 'react';
import { saveTaxonomy } from '@/features/admin/actions';
import type { Category, Brand } from '@/types/catalog';
export function TaxonomyForm({
  kind,
  item,
  categories = [],
}: {
  kind: 'categories' | 'brands';
  item?: Category | Brand;
  categories?: Category[];
}) {
  const [state, action, pending] = useActionState(saveTaxonomy.bind(null, kind, item?.id || null), {
    error: '',
  });
  const category = item as Category | undefined;
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      className="admin-form"
    >
      <div className="form-grid">
        <label>
          Tên
          <input name="name" required defaultValue={item?.name} />
        </label>
        <label>
          Slug
          <input name="slug" required defaultValue={item?.slug} />
        </label>
        <label>
          Trạng thái
          <select name="status" defaultValue={item?.status || 'draft'}>
            <option value="draft">Nháp</option>
            <option value="published">Xuất bản</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </label>
        <label>
          Danh mục cha
          <select name="parent_id" defaultValue={category?.parent_id || ''}>
            <option value="">Không có</option>
            {kind === 'categories' &&
              categories
                .filter((c) => c.id !== item?.id)
                .map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
          </select>
        </label>
        <label className="full">
          Mô tả
          <textarea name="description" defaultValue={category?.description || ''} />
        </label>
        <label className="full">
          Nội dung SEO
          <textarea name="seo_content" defaultValue={category?.seo_content || ''} />
        </label>
      </div>
      {state.error && <p className="notice">{state.error}</p>}
      <button className="button button-primary" disabled={pending}>
        Lưu {kind === 'categories' ? 'danh mục' : 'thương hiệu'}
      </button>
    </form>
  );
}
