import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageSquare, Wrench } from 'lucide-react';
import {
  categories,
  products,
  brands,
  content,
  productHref,
  money,
} from '@/features/catalog/repository';
import { Breadcrumbs, JsonLd, metadata } from '@/lib/seo';
import { ProductCard } from '@/components/product/card';
import { ProductGallery } from '@/components/product/gallery';
import { ContentBody } from '@/components/storefront/content-body';
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
  const quote = `/lien-he?product=${p.id}&type=${p.sales_type === 'PROJECT' ? 'survey' : 'quote'}`;
  const projects = cat.slug === 'can-xe-tai' ? await content('projects') : [];
  const related = ps.filter((x) => x.id !== p.id && x.category_id === p.category_id);
  const faqs = [
    {
      q: 'Giá và cấu hình được xác nhận như thế nào?',
      a: 'Gửi yêu cầu kèm nhu cầu sử dụng. Quốc Hưng sẽ xác nhận cấu hình, phụ kiện, giá và phạm vi bàn giao trong báo giá.',
    },
    {
      q: 'Có thể nhận tư vấn trước khi chọn thiết bị không?',
      a: 'Bạn có thể gọi bộ phận kỹ thuật hoặc gửi thông tin về vật cần cân, tải trọng, môi trường và yêu cầu kết nối để trao đổi lựa chọn.',
    },
  ];
  return (
    <div className="container section product-page">
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
            description: p.short_description,
            image: [p.featured_image, ...p.gallery]
              .filter(Boolean)
              .map((src) => new URL(src, site.url).href),
            ...(p.model ? { model: p.model } : {}),
            ...(!p.sku.startsWith('QHS-WP-') ? { sku: p.sku } : {}),
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
        <ProductGallery name={p.name} images={[p.featured_image, ...p.gallery]} />
        <div className="product-summary">
          <p className="eyebrow">{brand?.name || cat.name}</p>
          <h1>{p.name}</h1>
          {p.model && (
            <p className="muted">
              Model: <strong>{p.model}</strong>
            </p>
          )}
          {!p.sku.startsWith('QHS-WP-') && <p className="muted">SKU: {p.sku}</p>}
          <p className="lead-text">{p.short_description}</p>
          <div className="key-spec-grid">
            {p.specs.slice(0, 3).map((s) => (
              <div key={s.label}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
          <div className="price-block">
            <span>{p.price === null ? 'BÁO GIÁ THEO CẤU HÌNH' : 'GIÁ THAM KHẢO'}</span>
            <div className="price">{money(p.sale_price ?? p.price)}</div>
            <p>
              {p.is_demo
                ? 'Dữ liệu DEMO, chưa dùng để giao dịch.'
                : 'Trao đổi nhu cầu để xác nhận thiết bị và hạng mục đi kèm.'}
            </p>
          </div>
          <div className="actions product-actions">
            <Link className="button button-primary" href={quote}>
              {p.sales_type === 'PROJECT' ? 'Yêu cầu khảo sát' : 'Nhận báo giá'} ↗
            </Link>
            <a className="button button-outline" href={`tel:${site.technicalPhone}`}>
              <Phone size={17} /> Gọi kỹ thuật
            </a>
          </div>
          <div className="product-trust">
            <span>
              <MessageSquare size={17} /> Tư vấn lựa chọn cấu hình
            </span>
            <span>
              <Wrench size={17} /> Hỗ trợ kỹ thuật Quốc Hưng
            </span>
          </div>
        </div>
      </div>
      <nav className="detail-tabs" aria-label="Nội dung sản phẩm">
        <a href="#overview">Tổng quan</a>
        <a href="#specs">Thông số</a>
        {p.documents.length > 0 && <a href="#documents">Tài liệu</a>}
        <a href="#support">Tư vấn & bảo hành</a>
        <a href="#faq">Câu hỏi thường gặp</a>
      </nav>
      <div className="detail-content">
        <article>
          <section id="overview">
            <ContentBody text={p.full_description} />
            {p.application && (
              <>
                <h2>Ứng dụng</h2>
                <p>{p.application}</p>
              </>
            )}
          </section>
          <section id="specs">
            <p className="eyebrow">CƠ SỞ LỰA CHỌN THIẾT BỊ</p>
            <h2>Thông số kỹ thuật</h2>
            <p>Những thông số có nhiều lựa chọn cần được xác nhận theo cấu hình đặt hàng.</p>
            <div className="table-scroll">
              <table className="technical-table">
                <caption className="sr-only">Thông số {p.name}</caption>
                <tbody>
                  {p.specs.map((s, i) => (
                    <tr key={`${s.label}-${i}`}>
                      <th scope="row">{s.label}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {p.documents.length > 0 && (
            <section id="documents">
              <h2>Tài liệu sản phẩm</h2>
              {p.documents.map((d) => (
                <p key={d.url}>
                  <a href={d.url} target="_blank" rel="noopener noreferrer">
                    ↓ {d.name}
                  </a>
                </p>
              ))}
            </section>
          )}
          {p.videos.length > 0 && (
            <section>
              <h2>Video hướng dẫn</h2>
              {p.videos.map((v) => (
                <p key={v}>
                  <a href={v} target="_blank" rel="noopener noreferrer">
                    Xem video ↗
                  </a>
                </p>
              ))}
            </section>
          )}
          <section id="support">
            <h2>Tư vấn, bảo hành & giao nhận</h2>
            {p.warranty && (
              <p>
                <strong>Bảo hành:</strong> {p.warranty}.
              </p>
            )}
            <p>
              Điều kiện bảo hành, lịch giao nhận và phạm vi lắp đặt được xác nhận trong báo giá. Nếu
              cần tài liệu hoặc hướng dẫn đúng phiên bản, hãy gửi model và cấu hình bạn đang sử
              dụng.
            </p>
            <Link className="text-link" href={quote}>
              Trao đổi với Quốc Hưng ↗
            </Link>
          </section>
          <section id="faq" className="faq-section">
            <h2>Câu hỏi thường gặp</h2>
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        </article>
        <aside className="support-card product-help">
          <p className="eyebrow">CẦN CHỌN ĐÚNG CẤU HÌNH?</p>
          <h3>
            Gửi nhu cầu.
            <br />
            Cùng tìm giải pháp.
          </h3>
          <p>
            Loại hàng, tải trọng, môi trường và kết nối dữ liệu — chúng tôi cùng bạn làm rõ trước
            khi chọn thiết bị.
          </p>
          <Link className="button button-primary" href={quote}>
            Yêu cầu tư vấn ↗
          </Link>
          <a href={`tel:${site.technicalPhone}`}>Kỹ thuật: {site.technicalPhone}</a>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section" data-reveal>
          <h2>Sản phẩm cùng danh mục</h2>
          <div className="product-grid">
            {related.slice(0, 4).map((x) => (
              <ProductCard key={x.id} product={x} categories={cats} />
            ))}
          </div>
        </section>
      )}
      {projects.length > 0 && (
        <section className="section" data-reveal>
          <h2>Công trình trạm cân thực tế</h2>
          <div className="project-grid">
            {projects.slice(0, 3).map((item) => (
              <Link className="project-card" key={item.id} href={`/du-an/${item.slug}`}>
                <Image
                  src={item.featured_image}
                  width={600}
                  height={400}
                  sizes="(max-width:760px) 100vw, 33vw"
                  alt={item.title}
                />
                <h3>{item.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="mobile-product-cta">
        <Link className="button button-primary" href={quote}>
          Nhận báo giá ↗
        </Link>
        <a className="button button-outline" href={`tel:${site.technicalPhone}`}>
          Gọi kỹ thuật
        </a>
      </div>
    </div>
  );
}
