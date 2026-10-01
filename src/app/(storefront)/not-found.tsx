import Link from 'next/link';
/** Keep a missing catalogue route inside its layout while the async header streams. */
export default function NotFound() {
  return (
    <div className="container section empty">
      <p className="eyebrow">404 / KHÔNG TÌM THẤY</p>
      <h1>Trang này không còn ở đây.</h1>
      <p>Thử tìm trong catalogue hoặc liên hệ đội ngũ kỹ thuật.</p>
      <Link className="button button-primary" href="/san-pham">
        Khám phá sản phẩm
      </Link>
    </div>
  );
}
