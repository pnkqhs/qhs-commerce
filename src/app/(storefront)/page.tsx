import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  Gauge,
  Wrench,
  ShieldCheck,
  Truck,
  Factory,
  Wheat,
  PackageCheck,
} from 'lucide-react';
import { categories, products, content, isDemo } from '@/features/catalog/repository';
import { ProductCard } from '@/components/product/card';
import { JsonLd, metadata } from '@/lib/seo';
import { site } from '@/config/site';
export const generateMetadata = () =>
  metadata(
    'Giải pháp cân điện tử cho mọi nhu cầu',
    'Khám phá thiết bị cân, linh kiện và giải pháp đo lường cho công nghiệp, kho vận, nông sản.',
    '/',
    isDemo(),
  );
export default async function Home() {
  const [cats, items, posts, projects] = await Promise.all([
    categories(),
    products(),
    content('posts'),
    content('projects'),
  ]);
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: site.name,
          url: site.url,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: site.name,
          url: site.url,
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> CHÍNH XÁC TRONG TỪNG GIẢI PHÁP
            </p>
            <h1>
              Cân đúng nhu cầu.
              <br />
              <em>Vững mỗi bước tiến.</em>
            </h1>
            <p className="hero-description">
              Thiết bị cân điện tử và giải pháp đo lường dành cho nhà máy, kho vận, nông sản và trạm
              cân.
            </p>
            <div className="actions">
              <Link className="button button-primary" href="/san-pham">
                Khám phá sản phẩm <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/lien-he">
                Nhận tư vấn kỹ thuật ↗
              </Link>
            </div>
            <div className="hero-foot">
              <ShieldCheck size={18} /> Tư vấn cấu hình <span>•</span> Hỗ trợ lắp đặt
            </div>
          </div>
          <div className="hero-visual">
            <div className="technical-label">QHS / INDUSTRIAL WEIGHING SYSTEMS</div>
            <Image
              src="/images/hero.svg"
              alt="Minh họa hệ thống cân xe tải và cân công nghiệp"
              width={820}
              height={540}
              priority
            />
            <div className="visual-caption">
              <span>GIẢI PHÁP CÂN CÔNG NGHIỆP</span>
              <Link href="/can-xe-tai">
                Khám phá <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="container benefit-strip">
        {[
          [Gauge, 'Lựa chọn đúng tải trọng'],
          [Wrench, 'Tư vấn kỹ thuật chuyên sâu'],
          [ShieldCheck, 'Thông tin cấu hình rõ ràng'],
          [Truck, 'Giải pháp theo công trình'],
        ].map(([Icon, text], i) => {
          const I = Icon as typeof Gauge;
          return (
            <div key={i}>
              <I size={25} />
              <span>{String(text)}</span>
            </div>
          );
        })}
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DANH MỤC THIẾT BỊ</p>
            <h2>Bắt đầu từ nhu cầu của bạn</h2>
          </div>
          <Link href="/san-pham">Tất cả danh mục ↗</Link>
        </div>
        <div className="category-grid">
          {cats
            .filter((c) => c.parent_id)
            .slice(0, 6)
            .map((c, i) => (
              <Link className="category-tile" key={c.id} href={`/${c.slug}`}>
                <span className="category-number">0{i + 1}</span>
                <Gauge size={32} />
                <h3>{c.name}</h3>
                <span>Khám phá thiết bị ↗</span>
              </Link>
            ))}
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CATALOGUE KỸ THUẬT</p>
              <h2>Sản phẩm nổi bật</h2>
            </div>
            <Link href="/san-pham">Xem toàn bộ sản phẩm ↗</Link>
          </div>
          <div className="product-grid">
            {items
              .filter((p) => p.featured)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} categories={cats} />
              ))}
          </div>
          {items.length === 0 && (
            <p className="empty">Catalogue đang được cập nhật. Liên hệ để được tư vấn cấu hình.</p>
          )}
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GIẢI PHÁP THEO NGÀNH</p>
            <h2>Hiểu quy trình. Chọn đúng thiết bị.</h2>
          </div>
        </div>
        <div className="industry-grid">
          {[
            [Factory, 'Nhà máy & sản xuất', 'can-ban-lon'],
            [PackageCheck, 'Kho vận & logistics', 'can-ban'],
            [Wheat, 'Nông nghiệp & nông sản', 'dung-cu-nong-san'],
          ].map(([Icon, title, slug], i) => {
            const I = Icon as typeof Factory;
            return (
              <Link href={`/giai-phap/${slug}`} className="industry-card" key={i}>
                <I size={36} />
                <span>0{i + 1} / GIẢI PHÁP</span>
                <h3>{String(title)}</h3>
                <p>Thiết bị phù hợp với môi trường và quy trình vận hành.</p>
                <ArrowUpRight size={24} />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="about-strip">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">VÌ SAO CHỌN QUỐC HƯNG</p>
            <h2>
              Không chỉ là thiết bị.
              <br />
              Là một giải pháp phù hợp.
            </h2>
            <Link href="/gioi-thieu">Tìm hiểu về chúng tôi ↗</Link>
          </div>
          <div>
            <h3>01 / Bắt đầu bằng việc lắng nghe</h3>
            <p>Làm rõ tải trọng, môi trường và quy trình trước khi đề xuất cấu hình.</p>
            <h3>02 / Thông tin kỹ thuật minh bạch</h3>
            <p>Trao đổi tài liệu và thông số cần thiết để bạn có cơ sở lựa chọn.</p>
            <h3>03 / Hướng đến vận hành lâu dài</h3>
            <p>Tư vấn lắp đặt, sử dụng và nhu cầu bảo trì theo từng hệ thống.</p>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ỨNG DỤNG THỰC TẾ</p>
            <h2>Dự án & công trình</h2>
          </div>
          <Link href="/du-an">Xem dự án ↗</Link>
        </div>
        {projects.length ? (
          projects.slice(0, 3).map((p) => (
            <Link key={p.id} href={`/du-an/${p.slug}`}>
              {p.title}
            </Link>
          ))
        ) : (
          <div className="project-placeholder">
            <Factory size={48} />
            <div>
              <h3>Mỗi công trình có một bài toán riêng.</h3>
              <p>Hồ sơ dự án đang được biên tập và xác minh trước khi công bố.</p>
            </div>
            <Link className="button button-outline" href="/lien-he?type=survey">
              Trao đổi dự án của bạn ↗
            </Link>
          </div>
        )}
      </section>
      <section className="container section border-top">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CẬP NHẬT CATALOGUE</p>
            <h2>Thiết bị mới trong danh mục</h2>
          </div>
        </div>
        <div className="product-grid">
          {items.slice(-4).map((p) => (
            <ProductCard key={p.id} product={p} categories={cats} />
          ))}
        </div>
      </section>
      <section className="container section border-top">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GÓC KIẾN THỨC</p>
            <h2>Hiểu thiết bị. Vận hành tốt hơn.</h2>
          </div>
          <Link href="/kien-thuc">Tất cả bài viết ↗</Link>
        </div>
        {posts.map((p) => (
          <Link href={`/kien-thuc/${p.slug}`} className="article-preview" key={p.id}>
            <Image
              src={p.featured_image || '/images/platform.svg'}
              width={260}
              height={170}
              alt=""
            />
            <div>
              <small>{p.is_demo ? 'NỘI DUNG DEMO' : 'KIẾN THỨC KỸ THUẬT'}</small>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </div>
            <ArrowUpRight />
          </Link>
        ))}
      </section>
      <section className="container cta-banner">
        <div>
          <p className="eyebrow">CÙNG TÌM GIẢI PHÁP</p>
          <h2>Bạn đang cần loại cân nào?</h2>
          <p>Chia sẻ nhu cầu. Đội ngũ Quốc Hưng sẽ cùng bạn lựa chọn.</p>
        </div>
        <Link className="button" href="/lien-he">
          Nhận tư vấn kỹ thuật <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
