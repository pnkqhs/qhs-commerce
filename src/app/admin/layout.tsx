import Link from 'next/link';
import { requireRole } from '@/lib/auth';
export const metadata = { title: 'Quản trị QHS Commerce', robots: { index: false, follow: false } };
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole(['admin', 'content']);
  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <h2>QHS / Admin</h2>
        {[
          ['', 'Tổng quan'],
          ['products', 'Sản phẩm'],
          ['categories', 'Danh mục'],
          ['brands', 'Thương hiệu'],
          ['posts', 'Kiến thức'],
          ['projects', 'Dự án'],
          ['pages', 'Trang thông tin'],
          ['media', 'Media'],
        ].map(([path, label]) => (
          <Link key={path} href={`/admin/${path}`}>
            {label}
          </Link>
        ))}
        <Link href="/crm">CRM / Leads ↗</Link>
        <Link href="/">Xem website ↗</Link>
        <Link href="/tai-khoan">Tài khoản</Link>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
