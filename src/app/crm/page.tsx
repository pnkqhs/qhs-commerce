import Link from 'next/link';
import { requireRole } from '@/lib/auth';
export const metadata = { title: 'CRM / Leads', robots: { index: false, follow: false } };
export default async function Page() {
  const { db } = await requireRole(['admin', 'sales']);
  const { data, error } = await db
    .from('leads')
    .select('id,name,phone,email,company,message,type,status,created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error('Không thể tải leads');
  return (
    <main className="container section">
      <div className="admin-heading">
        <h1>CRM / Yêu cầu tư vấn</h1>
        <Link href="/tai-khoan">Tài khoản ↗</Link>
      </div>
      <p>200 yêu cầu mới nhất. Pipeline, khách hàng và báo giá sẽ được mở trong Phase 3.</p>
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Nhu cầu</th>
              <th>Nguồn form</th>
              <th>Trạng thái</th>
              <th>Ngày nhận</th>
            </tr>
          </thead>
          <tbody>
            {data.map((l) => (
              <tr key={l.id}>
                <td>
                  {l.name}
                  <br />
                  {l.company}
                </td>
                <td>
                  {l.phone}
                  <br />
                  {l.email}
                </td>
                <td>{l.message}</td>
                <td>{l.type}</td>
                <td>{l.status}</td>
                <td>{new Date(l.created_at).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data.length && <p className="empty">Chưa có yêu cầu tư vấn.</p>}
    </main>
  );
}
