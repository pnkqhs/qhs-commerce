import Link from 'next/link';
import { notFound } from 'next/navigation';
import { metadata, Breadcrumbs } from '@/lib/seo';
const solutions: Record<string, { title: string; description: string }> = {
  'can-ban-lon': {
    title: 'Nhà máy & sản xuất',
    description:
      'Xác định vị trí cân trong dây chuyền, kích thước vật cân, tải trọng và yêu cầu kết nối trước khi lựa chọn thiết bị.',
  },
  'can-ban': {
    title: 'Kho vận & logistics',
    description:
      'Lựa chọn cân theo kích thước kiện hàng, tần suất sử dụng và nhu cầu lưu trữ dữ liệu giao nhận.',
  },
  'dung-cu-nong-san': {
    title: 'Nông nghiệp & nông sản',
    description:
      'Trao đổi đặc tính sản phẩm, môi trường bụi ẩm và phương thức vận hành để xác định cấu hình phù hợp.',
  },
};
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = solutions[slug];
  return metadata(s?.title || 'Giải pháp', s?.description || '', `/giai-phap/${slug}`);
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = solutions[slug];
  if (!s) notFound();
  return (
    <div className="container section prose">
      <Breadcrumbs
        items={[
          { name: 'Giải pháp', href: '/giai-phap' },
          { name: s.title, href: `/giai-phap/${slug}` },
        ]}
      />
      <p className="eyebrow">GIẢI PHÁP QUỐC HƯNG</p>
      <h1>{s.title}</h1>
      <p className="lead-text">{s.description}</p>
      <h2>Thông tin cần chuẩn bị</h2>
      <ul>
        <li>Khối lượng lớn nhất và kích thước vật cân.</li>
        <li>Môi trường sử dụng và yêu cầu vệ sinh.</li>
        <li>Tần suất cân, điện nguồn và vị trí lắp đặt.</li>
        <li>Nhu cầu kết nối máy tính hoặc hệ thống quản lý.</li>
      </ul>
      <div className="actions" style={{ marginTop: 30 }}>
        <Link className="button button-primary" href="/lien-he?type=survey">
          Yêu cầu tư vấn giải pháp ↗
        </Link>
        <Link href={`/${slug}`}>Xem thiết bị liên quan</Link>
      </div>
    </div>
  );
}
