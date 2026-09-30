import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/config/site';
export function metadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
  image = '/images/truck.svg',
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: !noindex && process.env.DEMO_MODE !== 'true', follow: true },
    openGraph: { title, description, url: path, locale: 'vi_VN', type: 'website', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <>
      <nav aria-label="Đường dẫn" className="breadcrumbs">
        <Link href="/">Trang chủ</Link>
        {items.map((i) => (
          <span key={i.href}>
            {' '}
            / <Link href={i.href}>{i.name}</Link>
          </span>
        ))}
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{ name: 'Trang chủ', href: '/' }, ...items].map((i, n) => ({
            '@type': 'ListItem',
            position: n + 1,
            name: i.name,
            item: new URL(i.href, site.url).href,
          })),
        }}
      />
    </>
  );
}
