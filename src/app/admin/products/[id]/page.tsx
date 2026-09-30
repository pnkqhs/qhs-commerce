import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { ProductForm } from '@/components/admin/product-form';
import { deleteProduct } from '@/features/admin/actions';
import type { Product, Category, Brand } from '@/types/catalog';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db } = await requireRole(['admin', 'content']);
  const [cats, brands, result] = await Promise.all([
    db.from('categories').select('*'),
    db.from('brands').select('*'),
    id === 'new'
      ? Promise.resolve({ data: null, error: null })
      : db.from('products').select('*').eq('id', id).maybeSingle(),
  ]);
  if (cats.error || brands.error) throw new Error('Không thể tải danh mục');
  if (id !== 'new' && (!result.data || result.error)) notFound();
  return (
    <>
      <div className="admin-heading">
        <h1>{id === 'new' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</h1>
      </div>
      <ProductForm
        product={result.data as Product | undefined}
        categories={cats.data as Category[]}
        brands={brands.data as Brand[]}
      />
      {id !== 'new' && (
        <form action={deleteProduct.bind(null, id)}>
          <p>Lưu trữ sẽ gỡ sản phẩm khỏi storefront và giữ lại lịch sử.</p>
          <button className="button button-outline">Lưu trữ sản phẩm</button>
        </form>
      )}
    </>
  );
}
