import { Listing } from '@/components/product/listing';
import { metadata as meta } from '@/lib/seo';
import type { Filters } from '@/features/search/filter';
export const metadata = meta(
  'Tìm kiếm sản phẩm',
  'Tìm theo tên, model, SKU và thông số kỹ thuật.',
  '/tim-kiem',
  true,
);
export default async function Page({ searchParams }: { searchParams: Promise<Filters> }) {
  return <Listing title="Tìm kiếm sản phẩm" path="/tim-kiem" filters={await searchParams} />;
}
