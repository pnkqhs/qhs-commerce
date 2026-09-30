import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, content, isDemo } from '@/features/catalog/repository';
import { Listing } from '@/components/product/listing';
import { policies } from '@/config/site';
import { metadata, Breadcrumbs } from '@/lib/seo';
import type { Filters } from '@/features/search/filter';
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Filters> };
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = (await categories()).find((c) => c.slug === slug);
  return metadata(
    cat?.name || policies[slug] || 'Thông tin',
    cat?.description || 'Thông tin Quốc Hưng',
    `/${slug}`,
    isDemo() || !cat || Object.keys(await searchParams).length > 0,
  );
}
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = (await categories()).find((c) => c.slug === slug);
  if (cat)
    return (
      <Listing title={cat.name} category={cat} path={`/${slug}`} filters={await searchParams} />
    );
  if (!policies[slug]) notFound();
  const page = (await content('pages')).find((p) => p.slug === slug);
  return (
    <div className="container section prose">
      <Breadcrumbs items={[{ name: policies[slug], href: `/${slug}` }]} />
      <h1>{policies[slug]}</h1>
      {page ? (
        <div className="rich-text">{page.content}</div>
      ) : (
        <>
          <p className="notice">
            Nội dung đang chờ doanh nghiệp cung cấp và phê duyệt trước khi công bố chính thức.
          </p>
          <p>
            Vui lòng liên hệ Quốc Hưng để được xác nhận thông tin áp dụng cho sản phẩm hoặc yêu cầu
            của bạn.
          </p>
          <Link className="button button-primary" href="/lien-he">
            Liên hệ Quốc Hưng
          </Link>
        </>
      )}
    </div>
  );
}
