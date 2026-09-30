'use client';
import { startTransition, useActionState } from 'react';
import { saveContent } from '@/features/admin/actions';
import type { Content } from '@/types/catalog';
export function ContentForm({
  kind,
  item,
}: {
  kind: 'posts' | 'projects' | 'pages';
  item?: Content & { publication_consent?: boolean };
}) {
  const [state, action, pending] = useActionState(saveContent.bind(null, kind, item?.id || null), {
    error: '',
  });
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
        {[
          ['title', 'Tiêu đề'],
          ['slug', 'Slug'],
          ['featured_image', 'Ảnh đại diện URL'],
          ['seo_title', 'SEO title'],
          ['meta_description', 'Meta description'],
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input name={key} defaultValue={String(item?.[key as keyof Content] || '')} />
          </label>
        ))}
        <label>
          Trạng thái
          <select name="status" defaultValue={item?.status || 'draft'}>
            <option value="draft">Nháp</option>
            <option value="published">Xuất bản</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </label>
        <label className="full">
          Tóm tắt
          <textarea name="excerpt" defaultValue={item?.excerpt} />
        </label>
        <label className="full">
          Nội dung (văn bản thuần, giữ xuống dòng)
          <textarea name="content" defaultValue={item?.content} style={{ minHeight: 300 }} />
        </label>
        {[
          ['noindex', 'Không lập chỉ mục'],
          ['is_demo', 'Dữ liệu DEMO'],
          ['publication_consent', 'Đã có đồng ý công bố dự án'],
        ].map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              name={key}
              defaultChecked={Boolean(item?.[key as keyof typeof item])}
            />
            {label}
          </label>
        ))}
      </div>
      {state.error && <p className="notice">{state.error}</p>}
      <button className="button button-primary" disabled={pending}>
        Lưu nội dung
      </button>
    </form>
  );
}
