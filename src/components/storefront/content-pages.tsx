import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { content } from '@/features/catalog/repository';
import { Breadcrumbs, JsonLd } from '@/lib/seo';
import { site } from '@/config/site';
import { ContentBody, Consultation } from './content-body';
import { ProductGallery } from '@/components/product/gallery';
import { knowledge } from '@/features/content/editorial';
import official from '@/features/catalog/official.json';
export async function ContentIndex({ kind }: { kind: 'posts' | 'projects' }) {
  const title = kind === 'posts' ? 'Kiến thức kỹ thuật' : 'Dự án & công trình';
  const path = kind === 'posts' ? '/kien-thuc' : '/du-an';
  const items = await content(kind);
  return (
    <>
      <div className="container section">
        <Breadcrumbs items={[{ name: title, href: path }]} />
        <p className="eyebrow">GÓC QUỐC HƯNG</p>
        <h1>{title}</h1>
        <p className="lead-text">
          {kind === 'posts'
            ? 'Hiểu thiết bị. Chọn đúng cấu hình. Chuẩn bị tốt cho vận hành.'
            : 'Hình ảnh và hạng mục triển khai từ những công trình Quốc Hưng đã công bố.'}
        </p>
        <div className="solution-grid">
          {items.map((p) => (
            <Link className="photo-card" key={p.id} href={`${path}/${p.slug}`} data-reveal>
              {p.featured_image && (
                <Image
                  src={p.featured_image}
                  width={700}
                  height={480}
                  sizes="(max-width:760px) 100vw, 33vw"
                  alt={p.title}
                />
              )}
              <div>
                <small>{p.is_demo ? 'NỘI DUNG DEMO' : p.location || 'HƯỚNG DẪN LỰA CHỌN'}</small>
                <h2>{p.title}</h2>
                <p>{p.excerpt}</p>
                <span>Đọc tiếp ↗</span>
              </div>
            </Link>
          ))}
        </div>
        {!items.length && (
          <div className="empty">
            <h2>
              {kind === 'posts'
                ? 'Bạn cần tìm hiểu loại cân nào?'
                : 'Trao đổi về công trình của bạn'}
            </h2>
            <p>
              {kind === 'posts'
                ? 'Gửi câu hỏi về thiết bị, cấu hình hoặc cách vận hành cho đội ngũ kỹ thuật.'
                : 'Cùng làm rõ mặt bằng, tải trọng và nhu cầu quản lý dữ liệu.'}
            </p>
            <Link href="/lien-he" className="button button-primary">
              Nhận tư vấn
            </Link>
          </div>
        )}
      </div>
      <Consultation />
    </>
  );
}
export async function ContentDetail({ kind, slug }: { kind: 'posts' | 'projects'; slug: string }) {
  const item = (await content(kind)).find((p) => p.slug === slug);
  if (!item) notFound();
  const path = kind === 'posts' ? '/kien-thuc' : '/du-an';
  const editorial = knowledge.find((p) => p.slug === slug);
  const source =
    kind === 'posts'
      ? editorial?.source_url
      : official.projects.find((p) => p.slug === slug)?.source_url;
  return (
    <>
      <div className="container section">
        <Breadcrumbs
          items={[
            { name: kind === 'posts' ? 'Kiến thức' : 'Dự án', href: path },
            { name: item.title, href: `${path}/${slug}` },
          ]}
        />
        {!item.is_demo && (
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: item.title,
              description: item.excerpt,
              author: { '@type': 'Organization', name: site.name },
              image: item.featured_image ? new URL(item.featured_image, site.url).href : undefined,
              mainEntityOfPage: new URL(`${path}/${slug}`, site.url).href,
            }}
          />
        )}
        <article className="content-body">
          <p className="eyebrow">{item.location || 'KIẾN THỨC THIẾT BỊ'}</p>
          <h1>{item.title}</h1>
          <p className="lead-text">{item.excerpt}</p>
          {kind === 'projects' ? (
            <ProductGallery
              images={item.gallery?.length ? item.gallery : [item.featured_image]}
              name={item.title}
            />
          ) : (
            item.featured_image && (
              <Image
                className="article-hero"
                src={item.featured_image}
                alt={item.title}
                width={1000}
                height={650}
                sizes="(max-width:760px) 100vw, 800px"
                loading="eager"
                fetchPriority="high"
              />
            )
          )}
          <ContentBody text={item.content} />
          {editorial && (
            <aside className="company-details">
              <h2>Thiết bị & giải pháp liên quan</h2>
              <div className="tags">
                {editorial.links.map((l) => (
                  <Link key={l.href} href={l.href}>
                    {l.name} ↗
                  </Link>
                ))}
              </div>
            </aside>
          )}
          {kind === 'projects' && (
            <p>
              <Link href="/giai-phap/tram-can-xe-tai">Tìm hiểu giải pháp trạm cân xe tải ↗</Link>
            </p>
          )}
          {source && (
            <p className="source-note">
              Biên tập từ hồ sơ công bố trên{' '}
              <a href={source} target="_blank" rel="noopener noreferrer">
                website Quốc Hưng ↗
              </a>
              .
            </p>
          )}
        </article>
      </div>
      <Consultation
        title={
          kind === 'projects' ? 'Trao đổi về trạm cân của bạn.' : 'Cần làm rõ cấu hình thiết bị?'
        }
      />
    </>
  );
}
