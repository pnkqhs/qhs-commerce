import Link from 'next/link';
export const metadata = { title: 'Không đủ quyền', robots: { index: false, follow: false } };
export default function Page() {
  return (
    <div className="container section">
      <h1>Không đủ quyền truy cập</h1>
      <p>Tài khoản của bạn chưa được cấp quyền cho khu vực này.</p>
      <Link className="button button-primary" href="/tai-khoan">
        Về tài khoản
      </Link>
    </div>
  );
}
