import Link from 'next/link';
export const metadata = { title: 'Giỏ hàng', robots: { index: false, follow: false } };
export default function Page() {
  return (
    <div className="container section empty">
      <h1>Mua hàng trực tuyến đang được chuẩn bị</h1>
      <p>Trong giai đoạn catalogue, bạn có thể gửi yêu cầu báo giá và tư vấn trực tiếp.</p>
      <Link className="button button-primary" href="/lien-he">
        Gửi yêu cầu báo giá ↗
      </Link>
    </div>
  );
}
