import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product, Category } from '@/types/catalog';
import { money, productHref } from '@/features/catalog/repository';
export function ProductCard({
  product: p,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  return (
    <article className="product-card">
      <Link href={productHref(p, categories)} className="product-picture">
        <Image
          src={p.featured_image || '/images/platform.svg'}
          alt={p.name}
          width={440}
          height={320}
        />
        {p.is_demo && <span className="badge">DEMO</span>}
      </Link>
      <div className="product-info">
        <small>
          {p.sku} ·{' '}
          {p.sales_type === 'PROJECT'
            ? 'Giải pháp dự án'
            : p.sales_type === 'QUOTE'
              ? 'Theo cấu hình'
              : 'Thiết bị cân'}
        </small>
        <h3>
          <Link href={productHref(p, categories)}>{p.name}</Link>
        </h3>
        <p>
          {p.capacity || 'Tư vấn tải trọng'} <span> / </span> {p.model}
        </p>
        <div className="product-bottom">
          <strong>{money(p.sale_price ?? p.price)}</strong>
          <Link href={productHref(p, categories)} aria-label={`Xem ${p.name}`}>
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}
