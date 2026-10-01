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
  const category = categories.find((c) => c.id === p.category_id);
  return (
    <article className="product-card">
      <Link className="product-picture" href={productHref(p, categories)}>
        <Image
          src={p.featured_image || '/images/platform.svg'}
          alt={p.name}
          width={440}
          height={340}
          sizes="(max-width:760px) 45vw, (max-width:1100px) 30vw, 280px"
        />
        {p.is_demo && <span className="badge">DEMO</span>}
      </Link>
      <div className="product-info">
        <small>
          {category?.name || 'Thiết bị cân'}
          {p.model && ` · ${p.model}`}
        </small>
        <h3>
          <Link href={productHref(p, categories)}>{p.name}</Link>
        </h3>
        <ul className="card-specs">
          {p.specs.slice(0, 2).map((s) => (
            <li key={s.label}>
              <span>{s.label}</span>
              <strong>{s.value}</strong>
            </li>
          ))}
        </ul>
        <div className="product-bottom">
          <strong>{p.price === null ? 'Nhận báo giá' : money(p.sale_price ?? p.price)}</strong>
          <Link href={productHref(p, categories)} aria-label={`Xem ${p.name}`}>
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
