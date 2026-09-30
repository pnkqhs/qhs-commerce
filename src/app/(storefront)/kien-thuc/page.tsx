import { ContentIndex } from '@/components/storefront/content-pages';
import { metadata as meta } from '@/lib/seo';
export const metadata = meta(
  'Kiến thức kỹ thuật',
  'Thông tin và giải pháp cân điện tử.',
  '/kien-thuc',
);
export default function Page() {
  return <ContentIndex kind="posts" />;
}
