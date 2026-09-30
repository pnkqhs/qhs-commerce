import { ContentIndex } from '@/components/storefront/content-pages';
import { metadata as meta } from '@/lib/seo';
export const metadata = meta('Dự án & công trình', 'Thông tin và giải pháp cân điện tử.', '/du-an');
export default function Page() {
  return <ContentIndex kind="projects" />;
}
