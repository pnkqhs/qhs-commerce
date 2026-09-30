import { LeadForm } from '@/components/storefront/lead-form';
import { site } from '@/config/site';
import { metadata as meta, Breadcrumbs } from '@/lib/seo';
import { products } from '@/features/catalog/repository';
export const metadata = meta(
  'Liên hệ & tư vấn kỹ thuật',
  'Gửi nhu cầu tư vấn, báo giá hoặc khảo sát hệ thống cân.',
  '/lien-he',
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; type?: string }>;
}) {
  const params = await searchParams;
  const product = (await products()).find((p) => p.id === params.product);
  const type =
    params.type === 'quote' || params.type === 'survey' || params.type === 'callback'
      ? params.type
      : 'contact';
  return (
    <div className="container section">
      <Breadcrumbs items={[{ name: 'Liên hệ', href: '/lien-he' }]} />
      <div className="contact-grid">
        <div>
          <p className="eyebrow">ĐỘI NGŨ QUỐC HƯNG</p>
          <h1>
            Cùng tìm giải pháp
            <br />
            cho nhu cầu của bạn.
          </h1>
          <p className="lead-text">
            Tư vấn lựa chọn thiết bị, cấu hình hệ thống và giải pháp cân phù hợp với thực tế vận
            hành.
          </p>
          {product && (
            <p className="notice">
              Sản phẩm quan tâm: <strong>{product.name}</strong>
              {product.is_demo && ' (DEMO)'}
            </p>
          )}
          <h3>Cân điện tử Quốc Hưng</h3>
          <p>
            {site.phone ? <a href={`tel:${site.phone}`}>{site.phone}</a> : 'Hotline: đang cập nhật'}
            <br />
            {site.email ? (
              <a href={`mailto:${site.email}`}>{site.email}</a>
            ) : (
              'Email: đang cập nhật'
            )}
          </p>
          <div className="map-placeholder">
            Địa chỉ và bản đồ sẽ được cập nhật sau khi xác minh thông tin doanh nghiệp.
          </div>
        </div>
        <LeadForm product={product?.id} type={type} />
      </div>
    </div>
  );
}
