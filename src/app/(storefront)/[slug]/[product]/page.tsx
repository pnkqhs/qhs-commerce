import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { categories, products, brands, productHref, money } from '@/features/catalog/repository';
import { Breadcrumbs, JsonLd, metadata } from '@/lib/seo';
import { ProductCard } from '@/components/product/card';
import { site } from '@/config/site';
type Props = { params: Promise<{ slug: string; product: string }> };
async function load(params: Props['params']) {
  const { slug, product } = await params;
  const [cats, ps, bs] = await Promise.all([categories(), products(), brands()]);
  const cat = cats.find((c) => c.slug === slug);
  const p = ps.find((p) => p.slug === product && p.category_id === cat?.id);
  if (!p || !cat) notFound();
  return { p, cat, cats, ps, brand: bs.find((b) => b.id === p.brand_id) };
}
export async function generateMetadata({ params }: Props) {
  const { p, cat } = await load(params);
  return metadata(
    p.seo_title || p.name,
    p.meta_description || p.short_description,
    p.canonical_url || `/${cat.slug}/${p.slug}`,
    p.noindex || p.is_demo,
    p.og_image || p.featured_image,
  );
}
export default async function Page({ params }: Props) {
  const { p, cat, cats, ps, brand } = await load(params);
  const href = productHref(p, cats);
  return (
    <div className="container section">
      <Breadcrumbs
        items={[
          { name: cat.name, href: `/${cat.slug}` },
          { name: p.name, href },
        ]}
      />
      {!p.is_demo && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            sku: p.sku,
            model: p.model,
            description: p.short_description,
            image: new URL(p.featured_image || '/images/platform.svg', site.url).href,
            ...(brand ? { brand: { '@type': 'Brand', name: brand.name } } : {}),
            ...(p.sales_type === 'DIRECT' && p.price !== null
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: p.sale_price ?? p.price,
                    priceCurrency: 'VND',
                    url: new URL(href, site.url).href,
                    availability:
                      p.stock_status === 'in_stock'
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                  },
                }
              : {}),
          }}
        />
      )}
      <div className="product-detail">
        <div>
          <div className="detail-image">
            <Image
              src={p.featured_image || '/images/platform.svg'}
              alt={p.name}
              width={760}
              height={560}
              priority
            />
            {p.is_demo && <span className="badge">HÌNH MINH HỌA DEMO</span>}
          </div>
          <div className="gallery">
            {p.gallery.map((src, i) => (
              <a href={src} key={i}>
                <Image src={src} width={160} height={120} alt={`${p.name} — ảnh ${i + 1}`} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">{brand?.name || 'CATALOGUE QUỐC HƯNG'}</p>
          <h1>{p.name}</h1>
          <p className="muted">
            Model: {p.model} <span> · </span> SKU: {p.sku}
          </p>
          <p className="lead-text">{p.short_description}</p>
          <div className="price">{money(p.sale_price ?? p.price)}</div>
          <p className="muted">
            {p.is_demo
              ? 'Giá minh họa, không dùng để giao dịch'
              : `VAT: ${p.vat}% · ${p.stock_status === 'in_stock' ? 'Còn hàng' : 'Liên hệ xác nhận hàng'}`}
          </p>
          <div className="spec-preview">
            <div>
              <span>Tải trọng</span>
              <strong>{p.capacity || 'Theo cấu hình'}</strong>
            </div>
            <div>
              <span>Độ chia</span>
              <strong>{p.division || 'Theo cấu hình'}</strong>
            </div>
            <div>
              <span>Bảo hành</span>
              <strong>{p.warranty || 'Liên hệ xác nhận'}</strong>
            </div>
          </div>
          <div className="actions sticky-cta">
            <Link
              className="button button-primary"
              href={`/lien-he?product=${p.id}&type=${p.sales_type === 'PROJECT' ? 'survey' : 'quote'}`}
            >
              {p.sales_type === 'PROJECT' ? 'Yêu cầu khảo sát' : 'Nhận báo giá'} ↗
            </Link>
            {site.phone && (
              <a className="button button-outline" href={`tel:${site.phone}`}>
                Gọi kỹ thuật
              </a>
            )}
          </div>
          {p.sales_type === 'DIRECT' && (
            <small>
              Mua hàng trực tuyến sẽ được mở ở giai đoạn commerce. Hiện tại vui lòng gửi yêu cầu tư
              vấn.
            </small>
          )}
        </div>
      </div>
      <nav className="detail-tabs">
        <a href="#overview">Tổng quan</a>
        <a href="#specs">Thông số kỹ thuật</a>
        <a href="#documents">Tài liệu & video</a>
        <a href="#support">Bảo hành & giao hàng</a>
      </nav>
      <div className="detail-content">
        <article>
          <section id="overview" className="prose">
            <h2>Tổng quan sản phẩm</h2>
            <div className="rich-text">{p.full_description}</div>
            <h3>Ứng dụng</h3>
            <p>{p.application || 'Liên hệ để xác nhận ứng dụng phù hợp.'}</p>
          </section>
          <section id="specs">
            <h2>Thông số kỹ thuật {p.is_demo && '(DEMO)'}</h2>
            <dl className="spec-table">
              {p.specs.map((s, i) => (
                <div key={i}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section id="documents">
            <h2>Tài liệu & video</h2>
            {!p.documents.length && !p.videos.length && (
              <p>Tài liệu đang được cập nhật. Gửi yêu cầu để nhận datasheet đúng cấu hình.</p>
            )}
            {p.documents.map((d) => (
              <p key={d.url}>
                <a href={d.url} target="_blank" rel="noopener noreferrer">
                  ↓ {d.name}
                </a>
              </p>
            ))}
            {p.videos.map((v) => (
              <p key={v}>
                <a href={v} target="_blank" rel="noopener noreferrer">
                  Xem video ↗
                </a>
              </p>
            ))}
          </section>
          <section id="support">
            <h2>Bảo hành & giao hàng</h2>
            <p>{p.warranty || 'Điều kiện bảo hành được xác nhận trong báo giá.'}</p>
            <p>Lịch giao, lắp đặt và yêu cầu kiểm định được xác nhận theo từng thiết bị.</p>
            <Link href="/chinh-sach-bao-hanh">Thông tin bảo hành ↗</Link>
          </section>
        </article>
        <aside className="support-card">
          <h3>Cần cấu hình khác?</h3>
          <p>Trao đổi tải trọng, kích thước và môi trường sử dụng với đội ngũ kỹ thuật.</p>
          <Link href={`/lien-he?product=${p.id}`}>Gửi yêu cầu tư vấn ↗</Link>
        </aside>
      </div>
      <section className="section">
        <h2>Khám phá thêm thiết bị</h2>
        <div className="product-grid">
          {ps
            .filter((x) => x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} categories={cats} />
            ))}
        </div>
      </section>
    </div>
  );
}
