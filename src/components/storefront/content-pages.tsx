import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { content } from '@/features/catalog/repository';
import { Breadcrumbs, JsonLd } from '@/lib/seo';
import { site } from '@/config/site';
export async function ContentIndex({ kind }: { kind: 'posts' | 'projects' }) {
  const title = kind === 'posts' ? 'Kiến thức kỹ thuật' : 'Dự án & công trình';
  const path = kind === 'posts' ? '/kien-thuc' : '/du-an';
  const items = await content(kind);
  return (
    <div className="container section">
      <Breadcrumbs items={[{ name: title, href: path }]} />
      <p className="eyebrow">GÓC QUỐC HƯNG</p>
      <h1>{title}</h1>
      <p className="lead-text">
        {kind === 'posts'
          ? 'Thông tin thiết bị, lựa chọn cấu hình và vận hành hệ thống cân.'
          : 'Hồ sơ giải pháp và ứng dụng tại các công trình.'}
      </p>
      <div className="content-list">
        {items.map((p) => (
          <Link className="article-preview" key={p.id} href={`${path}/${p.slug}`}>
            <Image
              src={p.featured_image || '/images/truck.svg'}
              width={260}
              height={180}
              alt={p.title}
            />
            <div>
              {p.is_demo && <small>NỘI DUNG DEMO</small>}
              <h2>{p.title}</h2>
              <p>{p.excerpt}</p>
              <span>Đọc tiếp ↗</span>
            </div>
          </Link>
        ))}
      </div>
      {!items.length && (
        <div className="empty">
          <h2>Nội dung đang được cập nhật</h2>
          <p>Chúng tôi chỉ công bố hồ sơ dự án sau khi xác minh và có sự đồng ý của khách hàng.</p>
          <Link href="/lien-he" className="button button-primary">
            Trao đổi nhu cầu của bạn
          </Link>
        </div>
      )}
    </div>
  );
}
export async function ContentDetail({ kind, slug }: { kind: 'posts' | 'projects'; slug: string }) {
  const item = (await content(kind)).find((p) => p.slug === slug);
  if (!item) notFound();
  const path = kind === 'posts' ? '/kien-thuc' : '/du-an';
  return (
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
            datePublished: item.created_at,
            author: { '@type': 'Organization', name: site.name },
            mainEntityOfPage: new URL(`${path}/${slug}`, site.url).href,
          }}
        />
      )}
      <article className="content-body">
        {item.is_demo && (
          <p className="notice">Bài viết DEMO, chưa phải nội dung công bố chính thức.</p>
        )}
        <h1>{item.title}</h1>
        <p className="lead-text">{item.excerpt}</p>
        {item.featured_image && (
          <Image src={item.featured_image} alt={item.title} width={780} height={500} />
        )}
        <div className="rich-text section">{item.content}</div>
        <Link className="button button-primary" href="/lien-he">
          Trao đổi với đội ngũ kỹ thuật ↗
        </Link>
      </article>
    </div>
  );
}
