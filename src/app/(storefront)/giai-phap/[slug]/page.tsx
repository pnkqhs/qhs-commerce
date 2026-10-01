import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { solutions } from '@/features/content/solutions';
import { products, categories, content } from '@/features/catalog/repository';
import { ProductCard } from '@/components/product/card';
import { metadata, Breadcrumbs, JsonLd } from '@/lib/seo';
import { Consultation } from '@/components/storefront/content-body';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = solutions.find((s) => s.slug === slug);
  return metadata(s?.title || 'Giải pháp', s?.excerpt || '', `/giai-phap/${slug}`, false, s?.image);
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const s = solutions.find((s) => s.slug === slug);
  if (!s) notFound();
  const [cats, ps, projects] = await Promise.all([categories(), products(), content('projects')]);
  const ids = cats.filter((c) => s.categories.includes(c.slug)).map((c) => c.id);
  const relevant = ps.filter((p) => ids.includes(p.category_id));
  return (
    <>
      <div className="container section">
        <Breadcrumbs
          items={[
            { name: 'Giải pháp', href: '/giai-phap' },
            { name: s.title, href: `/giai-phap/${slug}` },
          ]}
        />
        <div className="solution-hero">
          <div>
            <p className="eyebrow">GIẢI PHÁP QUỐC HƯNG</p>
            <h1>{s.title}</h1>
            <p className="lead-text">{s.excerpt}</p>
            <Link className="button button-primary" href="/lien-he?type=survey">
              Trao đổi phương án triển khai ↗
            </Link>
          </div>
          <Image
            src={s.image}
            width={800}
            height={530}
            sizes="(max-width:760px) 100vw, 50vw"
            alt={s.title}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="solution-body section" data-reveal>
          <div>
            <p className="eyebrow">HIỂU BÀI TOÁN TRƯỚC KHI CHỌN THIẾT BỊ</p>
            <h2>Nhu cầu thực tế của bạn</h2>
            <p>{s.problem}</p>
            <ul>
              {s.needs.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div className="support-card">
            <h2>Giải pháp từ Quốc Hưng</h2>
            <p>{s.approach}</p>
            <ul>
              {s.options.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
        <section className="section border-top" data-reveal>
          <p className="eyebrow">CÙNG LÀM RÕ PHƯƠNG ÁN</p>
          <h2>Trao đổi từ nhu cầu đến cấu hình</h2>
          <div className="process-grid">
            {[
              ['01', 'Tiếp nhận nhu cầu', 'Loại hàng, phương tiện, tải trọng và tần suất sử dụng.'],
              ['02', 'Khảo sát điều kiện', 'Mặt bằng, môi trường và thiết bị hiện có.'],
              ['03', 'Đề xuất cấu hình', 'Thiết bị, kết nối dữ liệu và các lựa chọn kỹ thuật.'],
              [
                '04',
                'Thống nhất triển khai',
                'Xác nhận phạm vi công việc, báo giá và kế hoạch bàn giao.',
              ],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        {relevant.length > 0 && (
          <section className="section" data-reveal>
            <h2>Thiết bị phù hợp với giải pháp</h2>
            <div className="product-grid">
              {relevant.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} categories={cats} />
              ))}
            </div>
          </section>
        )}
        {s.categories.includes('can-xe-tai') && projects.length > 0 && (
          <section className="section" data-reveal>
            <h2>Công trình đã triển khai</h2>
            <div className="project-grid">
              {projects.slice(0, 3).map((p) => (
                <Link className="project-card" href={`/du-an/${p.slug}`} key={p.id}>
                  <Image
                    src={p.featured_image}
                    width={600}
                    height={400}
                    sizes="(max-width:760px) 100vw, 33vw"
                    alt={p.title}
                  />
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        <section className="faq-section section">
          <h2>Câu hỏi thường gặp</h2>
          {s.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: s.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      </div>
      <Consultation title="Trao đổi bài toán của doanh nghiệp bạn." />
    </>
  );
}
