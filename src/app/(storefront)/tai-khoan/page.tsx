import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { logout } from '@/features/auth/actions';
export const metadata = { title: 'Tài khoản', robots: { index: false, follow: false } };
export default async function Page() {
  const { user, profile } = await requireRole([
    'admin',
    'content',
    'sales',
    'warehouse',
    'customer',
  ]);
  return (
    <div className="container section">
      <h1>Tài khoản của bạn</h1>
      <p>{profile.full_name || user.email}</p>
      <p>Quyền truy cập: {profile.role}</p>
      <div className="actions">
        {['admin', 'content'].includes(profile.role) && (
          <Link className="button button-primary" href="/admin">
            Quản trị catalogue
          </Link>
        )}
        {['admin', 'sales'].includes(profile.role) && (
          <Link className="button button-primary" href="/crm">
            CRM / Leads
          </Link>
        )}
        <form action={logout}>
          <button className="button button-outline">Đăng xuất</button>
        </form>
      </div>
      <p className="notice" style={{ marginTop: 30 }}>
        Lịch sử đơn hàng và địa chỉ sẽ được mở cùng giai đoạn commerce.
      </p>
    </div>
  );
}
