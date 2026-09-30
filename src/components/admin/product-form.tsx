'use client';
import { startTransition, useActionState, useState } from 'react';
import { ListEditor } from './list-editor';
import { saveProduct } from '@/features/admin/actions';
import type { Product, Category, Brand } from '@/types/catalog';
export function ProductForm({
  product: p,
  categories,
  brands,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}) {
  const [tab, setTab] = useState(0);
  const tabs = [
    'Thông tin chung',
    'Giá & bán hàng',
    'Kho & bảo hành',
    'Thông số & nội dung',
    'Hình ảnh & tài liệu',
    'SEO & xuất bản',
  ];
  const [state, action, pending] = useActionState(saveProduct.bind(null, p?.id || null), {
    error: '',
  });
  function field(key: keyof Product, label: string, type = 'text') {
    return (
      <label key={key}>
        {label}
        <input
          name={key}
          type={type}
          step={type === 'number' ? 'any' : undefined}
          defaultValue={String(p?.[key] ?? '')}
        />
      </label>
    );
  }
  function area(key: keyof Product, label: string, json = false) {
    return (
      <label key={key} className="full">
        {label}
        <textarea
          name={key}
          defaultValue={json ? JSON.stringify(p?.[key] || [], null, 2) : String(p?.[key] || '')}
        />
      </label>
    );
  }
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
      <p className="notice">
        Hoàn thiện cấu hình và nội dung trước khi xuất bản. Tải ảnh và tài liệu trong Media rồi dán
        URL vào các trường tương ứng.
      </p>
      <div className="editor-tabs" role="tablist" aria-label="Chỉnh sửa sản phẩm">
        {tabs.map((label, i) => (
          <button
            type="button"
            key={label}
            role="tab"
            id={`tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`panel-${i}`}
            onClick={() => setTab(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <fieldset hidden={tab !== 0} role="tabpanel" id="panel-0" aria-labelledby="tab-0">
        <legend>Thông tin chung</legend>
        <div className="form-grid">
          {field('name', 'Tên sản phẩm *')}
          {field('slug', 'Slug *')}
          {field('sku', 'SKU *')}
          {field('model', 'Model')}
          <label>
            Danh mục *
            <select name="category_id" defaultValue={p?.category_id}>
              <option value="">Chọn danh mục</option>
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Thương hiệu
            <select name="brand_id" defaultValue={p?.brand_id || ''}>
              <option value="">Chưa chọn</option>
              {brands.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          {area('short_description', 'Mô tả ngắn')}
        </div>
      </fieldset>
      <fieldset hidden={tab !== 1} role="tabpanel" id="panel-1" aria-labelledby="tab-1">
        <legend>Giá & bán hàng</legend>
        <div className="form-grid">
          <label>
            Hình thức
            <select name="sales_type" defaultValue={p?.sales_type || 'QUOTE'}>
              <option>DIRECT</option>
              <option>QUOTE</option>
              <option>PROJECT</option>
            </select>
          </label>
          {field('price', 'Giá (VND)', 'number')}
          {field('sale_price', 'Giá khuyến mãi (VND)', 'number')}
          <label>
            VAT (%)
            <input
              name="vat"
              type="number"
              min="0"
              max="100"
              step="0.01"
              defaultValue={p?.vat || 0}
            />
          </label>
        </div>
      </fieldset>
      <fieldset hidden={tab !== 2} role="tabpanel" id="panel-2" aria-labelledby="tab-2">
        <legend>Kho & bảo hành</legend>
        <div className="form-grid">
          <label>
            Tình trạng
            <select name="stock_status" defaultValue={p?.stock_status || 'contact'}>
              <option value="contact">Liên hệ</option>
              <option value="in_stock">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
          </label>
          {field('stock_quantity', 'Số lượng', 'number')}
          {field('warranty', 'Bảo hành')}
        </div>
      </fieldset>
      <fieldset hidden={tab !== 3} role="tabpanel" id="panel-3" aria-labelledby="tab-3">
        <legend>Thông số & nội dung</legend>
        <div className="form-grid">
          {field('capacity', 'Tải trọng')}
          {field('division', 'Độ chia')}
          {field('application', 'Ứng dụng')}
          <ListEditor
            name="specs"
            label="Thông số"
            columns={[
              { key: 'label', label: 'Tên thông số' },
              { key: 'value', label: 'Giá trị' },
            ]}
            initial={p?.specs}
          />
          {area('full_description', 'Nội dung đầy đủ')}
        </div>
      </fieldset>
      <fieldset hidden={tab !== 4} role="tabpanel" id="panel-4" aria-labelledby="tab-4">
        <legend>Hình ảnh & tài liệu</legend>
        <div className="form-grid">
          {field('featured_image', 'URL ảnh chính')}
          <ListEditor
            name="gallery"
            label="Ảnh thư viện"
            columns={[{ key: 'url', label: 'URL ảnh' }]}
            initial={p?.gallery}
            strings
          />
          <ListEditor
            name="documents"
            label="Tài liệu"
            columns={[
              { key: 'name', label: 'Tên tài liệu' },
              { key: 'url', label: 'URL PDF' },
            ]}
            initial={p?.documents}
          />
          <ListEditor
            name="videos"
            label="Video"
            columns={[{ key: 'url', label: 'URL video' }]}
            initial={p?.videos}
            strings
          />
        </div>
      </fieldset>
      <fieldset hidden={tab !== 5} role="tabpanel" id="panel-5" aria-labelledby="tab-5">
        <legend>SEO & xuất bản</legend>
        <div className="form-grid">
          {field('seo_title', 'SEO title')}
          {field('meta_description', 'Meta description')}
          {field('canonical_url', 'Canonical URL (để trống dùng URL chuẩn)')}
          {field('og_image', 'OG image URL')}
          <label>
            Trạng thái
            <select name="status" defaultValue={p?.status || 'draft'}>
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </label>
          {(['featured', 'noindex', 'is_demo'] as const).map((key) => (
            <label key={key}>
              <input type="checkbox" name={key} defaultChecked={p?.[key]} />
              {key === 'featured'
                ? 'Sản phẩm nổi bật'
                : key === 'noindex'
                  ? 'Không lập chỉ mục'
                  : 'Dữ liệu DEMO'}
            </label>
          ))}
        </div>
      </fieldset>
      {state.error && (
        <p className="notice" role="alert">
          {state.error}
        </p>
      )}
      <button className="button button-primary" disabled={pending}>
        {pending ? 'Đang lưu...' : 'Lưu sản phẩm'}
      </button>
    </form>
  );
}
