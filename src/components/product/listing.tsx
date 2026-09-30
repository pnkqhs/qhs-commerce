import Link from 'next/link';
import { categories, brands, products } from '@/features/catalog/repository';
import { filterProducts, safeFilters, type Filters } from '@/features/search/filter';
import { ProductCard } from './card';
import { FilterPanel } from './filter-panel';
import { Breadcrumbs } from '@/lib/seo';
import type { Category } from '@/types/catalog';
export async function Listing({
  title,
  path,
  filters: rawFilters,
  category,
}: {
  title: string;
  path: string;
  filters: Filters;
  category?: Category;
}) {
  const filters = safeFilters(rawFilters);
  const [cats, bs, ps] = await Promise.all([categories(), brands(), products()]);
  const found = filterProducts(ps, cats, bs, filters, category?.id);
  const pages = Math.max(1, Math.ceil(found.length / 12));
  const page = Math.min(pages, Math.max(1, Number.parseInt(filters.page || '1') || 1));
  function url(n: number) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set('page', String(n));
    return `${path}?${params}`;
  }
  return (
    <div className="container section">
      <Breadcrumbs items={[{ name: title, href: path }]} />
      <p className="eyebrow">CATALOGUE QUỐC HƯNG</p>
      <h1>{title}</h1>
      <p className="lead-text">
        {category?.description || 'Tìm thiết bị theo tải trọng, cấu hình và nhu cầu vận hành.'}
      </p>
      <div className="catalog-layout">
        <aside>
          <FilterPanel>
            <form action={path}>
              <label>
                Từ khóa
                <input name="q" defaultValue={filters.q} placeholder="Tên, model, SKU..." />
              </label>
              <label>
                Danh mục
                <select name="category" defaultValue={filters.category || ''}>
                  <option value="">Tất cả danh mục</option>
                  {cats
                    .filter((c) => c.parent_id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                Thương hiệu
                <select name="brand" defaultValue={filters.brand || ''}>
                  <option value="">Tất cả thương hiệu</option>
                  {bs.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              {[
                ['capacity', 'Tải trọng', '300 kg'],
                ['division', 'Độ chia', '0.1 kg'],
                ['application', 'Ứng dụng', 'Nhà máy'],
                ['min', 'Giá từ (₫)', '0'],
                ['max', 'Giá đến (₫)', '10000000'],
              ].map(([name, label, placeholder]) => (
                <label key={name}>
                  {label}
                  <input
                    name={name}
                    type={['min', 'max'].includes(name) ? 'number' : 'text'}
                    min="0"
                    defaultValue={filters[name]}
                    placeholder={placeholder}
                  />
                </label>
              ))}
              <label>
                Tình trạng
                <select name="stock" defaultValue={filters.stock || ''}>
                  <option value="">Tất cả</option>
                  <option value="in_stock">Còn hàng</option>
                  <option value="out_of_stock">Hết hàng</option>
                  <option value="contact">Liên hệ</option>
                </select>
              </label>
              <label>
                Sắp xếp
                <select name="sort" defaultValue={filters.sort || ''}>
                  <option value="">Mới nhất</option>
                  <option value="name">Tên A–Z</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </label>
              <button className="button button-primary">Áp dụng bộ lọc</button>
              <Link href={path}>Xóa bộ lọc</Link>
            </form>
          </FilterPanel>
        </aside>
        <div>
          <div className="results-bar">
            <span>
              {found.length} sản phẩm {filters.q && `cho “${filters.q}”`}
            </span>
            <span>
              Trang {page}/{pages}
            </span>
          </div>
          <div className="product-grid catalog-products">
            {found.slice((page - 1) * 12, page * 12).map((p) => (
              <ProductCard key={p.id} product={p} categories={cats} />
            ))}
          </div>
          {!found.length && (
            <div className="empty">
              <h2>Chưa tìm thấy thiết bị phù hợp</h2>
              <p>Thử bỏ bớt bộ lọc hoặc gửi nhu cầu để được tư vấn.</p>
              <Link className="button button-primary" href="/lien-he">
                Nhận tư vấn
              </Link>
            </div>
          )}
          <nav className="pagination" aria-label="Phân trang">
            {Array.from({ length: pages }, (_, i) => (
              <Link key={i} aria-current={page === i + 1 ? 'page' : undefined} href={url(i + 1)}>
                {i + 1}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {category && (
        <section className="prose section">
          <h2>Lựa chọn {category.name.toLowerCase()}</h2>
          <p>{category.seo_content}</p>
          <h3>Danh mục liên quan</h3>
          <div className="tags">
            {cats
              .filter((c) => c.parent_id === category.parent_id && c.id !== category.id)
              .map((c) => (
                <Link key={c.id} href={`/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
