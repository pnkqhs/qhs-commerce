import Link from 'next/link';
import { requireRole } from '@/lib/auth';
export default async function Page() {
  const { db } = await requireRole(['admin', 'content']);
  const { data, error } = await db
    .from('products')
    .select('id,name,sku,status,sales_type')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Không thể tải sản phẩm');
  return (
    <>
      <div className="admin-heading">
        <h1>Sản phẩm</h1>
        <Link className="button button-primary" href="/admin/products/new">
          + Thêm sản phẩm
        </Link>
      </div>
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SKU</th>
              <th>Hình thức</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.sales_type}</td>
                <td>{p.status}</td>
                <td>
                  <Link href={`/admin/products/${p.id}`}>Chỉnh sửa ↗</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data.length && (
        <p className="empty">Chưa có sản phẩm. Tạo sản phẩm đầu tiên để bắt đầu catalogue.</p>
      )}
    </>
  );
}
