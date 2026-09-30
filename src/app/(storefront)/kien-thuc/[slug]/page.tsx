import { ContentDetail } from '@/components/storefront/content-pages';
import { content } from '@/features/catalog/repository';
import { metadata } from '@/lib/seo';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = (await content('posts')).find((p) => p.slug === slug);
  return metadata(
    p?.seo_title || p?.title || 'Nội dung',
    p?.meta_description || p?.excerpt || '',
    '/kien-thuc/' + slug,
    p?.noindex || p?.is_demo,
  );
}
export default async function Page({ params }: Props) {
  return <ContentDetail kind="posts" slug={(await params).slug} />;
}
