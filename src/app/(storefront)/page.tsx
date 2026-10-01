import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Wrench, ScanLine, Cable, Monitor, Truck, Check, MapPin } from 'lucide-react';
import { categories, products, content } from '@/features/catalog/repository';
import { ProductCard } from '@/components/product/card';
import { JsonLd, metadata } from '@/lib/seo';
import { site } from '@/config/site';
import { Consultation } from '@/components/storefront/content-body';
import { solutions } from '@/features/content/solutions';
export const generateMetadata = () =>
  metadata(
    'Giải pháp cân điện tử & trạm cân Quốc Hưng',
    'Cung cấp, lắp đặt, sửa chữa thiết bị cân điện tử. Giải pháp trạm cân, loadcell, bộ chỉ thị và quản lý dữ liệu tại Quốc Hưng.',
    '/',
  );
export default async function Home() {
  const [cats, ps, posts, projects] = await Promise.all([
    categories(),
    products(),
    content('posts'),
    content('projects'),
  ]);
  const featured = ps.filter((p) => p.featured).slice(0, 8);
  const categorySlugs = [
    'can-xe-tai',
    'can-ban',
    'can-ban-lon',
    'cam-bien-khoi-luong',
    'bo-chi-thi',
    'dung-cu-nong-san',
  ];
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: site.name,
          legalName: site.legalName,
          url: site.url,
          logo: new URL(site.logo, site.url).href,
          telephone: site.phone,
          email: site.email,
          address: { '@type': 'PostalAddress', streetAddress: site.address, addressCountry: 'VN' },
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
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">CÂN ĐIỆN TỬ QUỐC HƯNG</p>
            <h1>
              Chính xác từng phép cân.
              <br />
              <em>Vững vàng mỗi công trình.</em>
            </h1>
            <p className="hero-description">
              Từ thiết bị cân đến trạm cân hoàn chỉnh.
              <br />
              Cùng bạn lựa chọn, lắp đặt và duy trì hệ thống phù hợp với thực tế vận hành.
            </p>
            <div className="actions">
              <Link className="button button-primary" href="/san-pham">
                Xem sản phẩm <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/lien-he">
                Nhận tư vấn kỹ thuật ↗
              </Link>
            </div>
            <div className="hero-service-line">
              <span>
                <Check size={15} /> Thiết bị & linh kiện
              </span>
              <span>
                <Check size={15} /> Lắp đặt & sửa chữa
              </span>
            </div>
          </div>
          <div className="home-hero-photo">
            <Image
              src="/images/official/tram-can-80-tan-ea-sup-0.webp"
              fill
              sizes="(max-width:760px) 100vw, 55vw"
              alt="Trạm cân xe tải 80 tấn do Quốc Hưng lắp đặt tại Ea Súp"
              loading="eager"
              fetchPriority="high"
            />
            <span className="photo-index">QHS / CÔNG TRÌNH THỰC TẾ</span>
            <Link className="hero-photo-caption" href="/du-an/tram-can-80-tan-ea-sup">
              <div>
                <span>
                  <MapPin size={13} /> Ea Súp, Đắk Lắk
                </span>
                <strong>Trạm cân xe tải 80 tấn</strong>
              </div>
              <ArrowUpRight size={23} />
            </Link>
            <div className="hero-mini-photo">
              <Image
                src="/images/official/dau-chi-thi-cti-1000.webp"
                width={180}
                height={130}
                sizes="160px"
                alt="Đầu chỉ thị CTI-1000"
              />
              <span>THIẾT BỊ • KẾT NỐI • DỮ LIỆU</span>
            </div>
          </div>
        </div>
      </section>
      <div className="container quick-finder" data-reveal>
        <div>
          <span className="eyebrow">BẠN ĐANG CẦN CÂN GÌ?</span>
          <h2>Tìm đúng thiết bị, nhanh hơn.</h2>
        </div>
        <form action="/tim-kiem">
          <label className="sr-only" htmlFor="quick-query">
            Nhu cầu hoặc tải trọng
          </label>
          <input id="quick-query" name="q" placeholder="Ví dụ: cân bàn, loadcell, 30 kg..." />
          <button className="button button-primary">
            Tìm thiết bị <ArrowUpRight size={18} />
          </button>
        </form>
      </div>
      <section className="container section" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">DANH MỤC THIẾT BỊ</p>
            <h2>Một nhu cầu. Nhiều lựa chọn phù hợp.</h2>
          </div>
          <Link href="/san-pham">Khám phá catalogue ↗</Link>
        </div>
        <div className="category-grid photo-categories">
          {categorySlugs.map((slug) => {
            const c = cats.find((c) => c.slug === slug);
            const p = ps.find((p) => p.category_id === c?.id);
            if (!c) return null;
            return (
              <Link className="category-tile" key={slug} href={`/${slug}`}>
                <div className="category-photo">
                  {p && (
                    <Image
                      src={p.featured_image}
                      width={240}
                      height={170}
                      sizes="(max-width:760px) 45vw, 200px"
                      alt={c.name}
                    />
                  )}
                </div>
                <h3>{c.name}</h3>
                <span>
                  Xem sản phẩm <ArrowUpRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      {featured.length > 0 && (
        <section className="section soft" data-reveal>
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THIẾT BỊ ĐƯỢC LỰA CHỌN THEO CẤU HÌNH</p>
                <h2>Khám phá sản phẩm Quốc Hưng</h2>
              </div>
              <Link href="/san-pham">Tất cả sản phẩm ↗</Link>
            </div>
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} categories={cats} />
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="container section" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">GIẢI PHÁP THEO NHU CẦU</p>
            <h2>Hiểu quy trình. Chọn đúng hệ thống.</h2>
          </div>
          <Link href="/giai-phap">Tất cả giải pháp ↗</Link>
        </div>
        <div className="solution-grid">
          {solutions.slice(0, 3).map((s, i) => (
            <Link href={`/giai-phap/${s.slug}`} key={s.slug} className="solution-card">
              <Image
                src={s.image}
                width={600}
                height={400}
                sizes="(max-width:760px) 100vw, 33vw"
                alt={s.title}
              />
              <div>
                <small>0{i + 1} / GIẢI PHÁP</small>
                <h3>{s.title}</h3>
                <p>{s.excerpt}</p>
                <span>
                  Khám phá giải pháp <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="ecosystem-section" data-reveal>
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HỆ SINH THÁI QUỐC HƯNG</p>
              <h2>
                Kết nối thiết bị.
                <br />
                Theo dõi cả quy trình.
              </h2>
            </div>
            <p>
              Từ bàn cân, cảm biến đến nhận diện phương tiện và phần mềm quản lý. Mỗi thành phần
              được lựa chọn theo nhu cầu của trạm cân.
            </p>
          </div>
          <div className="ecosystem-flow">
            {[
              [Truck, '01', 'Bàn cân xe tải'],
              [Cable, '02', 'Loadcell & bộ chỉ thị'],
              [ScanLine, '03', 'Camera nhận diện'],
              [Monitor, '04', 'Phần mềm & dữ liệu'],
            ].map(([Icon, n, title]) => {
              const I = Icon as typeof Truck;
              return (
                <div key={String(n)}>
                  <small>{String(n)}</small>
                  <I size={30} />
                  <h3>{String(title)}</h3>
                </div>
              );
            })}
          </div>
          <Link className="text-link" href="/giai-phap/tram-can-tu-dong">
            Khám phá trạm cân tự động ↗
          </Link>
        </div>
      </section>
      <section className="container section company-story" data-reveal>
        <div className="story-photo">
          <Image
            src="/images/official/quoc-hung-team.webp"
            width={750}
            height={600}
            sizes="(max-width:760px) 100vw, 50vw"
            alt="Đội ngũ Cân điện tử Quốc Hưng tại cơ sở doanh nghiệp"
          />
          <span>CON NGƯỜI THẬT. CÔNG VIỆC THẬT.</span>
        </div>
        <div>
          <p className="eyebrow">ĐỒNG HÀNH CÙNG VẬN HÀNH</p>
          <h2>
            Thiết bị là điểm bắt đầu.
            <br />
            Dịch vụ là hành trình tiếp nối.
          </h2>
          <p>
            Quốc Hưng cung cấp, lắp đặt và bảo trì cân điện tử tại Tây Nguyên và Duyên hải miền
            Trung. Nhu cầu của từng công trình là cơ sở để lựa chọn thiết bị và phương án triển
            khai.
          </p>
          <div className="story-points">
            <div>
              <Wrench size={23} />
              <div>
                <h3>Kỹ thuật gắn với thực tế</h3>
                <p>Lắp đặt, sửa chữa, thay thế thiết bị và hỗ trợ hiệu chuẩn.</p>
              </div>
            </div>
            <div>
              <Monitor size={23} />
              <div>
                <h3>Từ cân đo đến quản lý dữ liệu</h3>
                <p>Tư vấn kết nối thiết bị, camera và phần mềm quản lý cân.</p>
              </div>
            </div>
          </div>
          <Link className="text-link" href="/gioi-thieu">
            Tìm hiểu về Quốc Hưng ↗
          </Link>
        </div>
      </section>
      {projects.length > 0 && (
        <section className="section soft" data-reveal>
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">DẤU ẤN TRÊN TỪNG CÔNG TRÌNH</p>
                <h2>Từ nhu cầu đến bàn giao thực tế</h2>
              </div>
              <Link href="/du-an">Xem các công trình ↗</Link>
            </div>
            <div className="project-grid">
              {projects.slice(0, 3).map((p) => (
                <Link className="project-card" key={p.id} href={`/du-an/${p.slug}`}>
                  <div>
                    <Image
                      src={p.featured_image}
                      width={620}
                      height={420}
                      sizes="(max-width:760px) 100vw, 33vw"
                      alt={p.title}
                    />
                  </div>
                  <small>{p.location || 'CÔNG TRÌNH QUỐC HƯNG'}</small>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span>Xem hồ sơ công trình ↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {posts.length > 0 && (
        <section className="container section" data-reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">KIẾN THỨC CÂN ĐIỆN TỬ</p>
              <h2>Hiểu thiết bị. Chủ động vận hành.</h2>
            </div>
            <Link href="/kien-thuc">Đọc thêm kiến thức ↗</Link>
          </div>
          <div className="knowledge-grid">
            {posts.slice(0, 2).map((p) => (
              <Link key={p.id} href={`/kien-thuc/${p.slug}`} className="knowledge-card">
                <Image
                  src={p.featured_image}
                  width={400}
                  height={300}
                  sizes="(max-width:760px) 45vw, 230px"
                  alt={p.title}
                />
                <div>
                  <small>HƯỚNG DẪN LỰA CHỌN</small>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span>Đọc bài viết ↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <Consultation title="Bạn đang cần giải pháp cân nào?" />
    </>
  );
}
