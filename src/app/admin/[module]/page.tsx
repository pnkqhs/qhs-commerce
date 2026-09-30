import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
const labels: Record<string, string> = {
  categories: 'Danh mục',
  brands: 'Thương hiệu',
  posts: 'Kiến thức',
  projects: 'Dự án',
  pages: 'Trang thông tin',
};
export default async function Page({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  if (!labels[module]) notFound();
  const { db } = await requireRole(['admin', 'content']);
  const { data, error } = await db
    .from(module)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Không thể tải nội dung');
  return (
    <>
      <div className="admin-heading">
        <h1>{labels[module]}</h1>
        <Link href={`/admin/${module}/new`} className="button button-primary">
          + Thêm mới
        </Link>
      </div>
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên / tiêu đề</th>
              <th>Slug</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.name || item.title}</td>
                <td>{item.slug}</td>
                <td>{item.status}</td>
                <td>
                  <Link href={`/admin/${module}/${item.id}`}>Chỉnh sửa ↗</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data.length && <p className="empty">Chưa có dữ liệu.</p>}
    </>
  );
}
