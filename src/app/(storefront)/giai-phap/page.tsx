import Link from 'next/link';
import { metadata as meta, Breadcrumbs } from '@/lib/seo';
export const metadata = meta(
  'Giải pháp theo ngành',
  'Giải pháp cân cho sản xuất, kho vận và nông nghiệp.',
  '/giai-phap',
);
export default function Page() {
  return (
    <div className="container section">
      <Breadcrumbs items={[{ name: 'Giải pháp', href: '/giai-phap' }]} />
      <h1>Giải pháp theo ngành</h1>
      <p className="lead-text">Bắt đầu từ quy trình vận hành để xác định thiết bị phù hợp.</p>
      <div className="industry-grid">
        {[
          ['can-ban-lon', 'Nhà máy & sản xuất'],
          ['can-ban', 'Kho vận & logistics'],
          ['dung-cu-nong-san', 'Nông nghiệp & nông sản'],
        ].map(([slug, title]) => (
          <Link href={`/giai-phap/${slug}`} key={slug} className="industry-card">
            <h2>{title}</h2>
            <p>Trao đổi tải trọng, môi trường và kết nối dữ liệu.</p>Khám phá giải pháp ↗
          </Link>
        ))}
      </div>
    </div>
  );
}
