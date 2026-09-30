import { requireRole } from '@/lib/auth';
export default async function Page() {
  const { db, profile } = await requireRole(['admin', 'content']);
  const counts = await Promise.all(
    ['products', 'categories', 'brands'].map(async (table) => {
      const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
      if (error) throw new Error('Không thể tải tổng quan');
      return { table, count };
    }),
  );
  return (
    <>
      <div className="admin-heading">
        <h1>Tổng quan catalogue</h1>
        <span>{profile.full_name || profile.role}</span>
      </div>
      <div className="stats">
        {counts.map((c) => (
          <div className="stat" key={c.table}>
            <span>{c.table}</span>
            <strong>{c.count}</strong>
          </div>
        ))}
      </div>
      <div className="form-card">
        <h2>Sẵn sàng cho nội dung thật</h2>
        <p>
          Thêm danh mục, thương hiệu, sau đó tạo sản phẩm. Kiểm tra cấu hình kỹ thuật và quyền sử
          dụng hình ảnh trước khi xuất bản.
        </p>
        <p>Commerce, thanh toán và pipeline CRM đầy đủ thuộc các giai đoạn tiếp theo.</p>
      </div>
    </>
  );
}
