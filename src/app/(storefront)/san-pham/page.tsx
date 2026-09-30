import { Listing } from '@/components/product/listing';
import { metadata } from '@/lib/seo';
import type { Filters } from '@/features/search/filter';
export async function generateMetadata({ searchParams }: { searchParams: Promise<Filters> }) {
  return metadata(
    'Sản phẩm',
    'Catalogue cân điện tử và linh kiện.',
    '/san-pham',
    Object.keys(await searchParams).length > 0,
  );
}
export default async function Page({ searchParams }: { searchParams: Promise<Filters> }) {
  return <Listing title="Sản phẩm & thiết bị" path="/san-pham" filters={await searchParams} />;
}
