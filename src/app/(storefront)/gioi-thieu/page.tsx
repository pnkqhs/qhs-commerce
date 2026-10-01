import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/config/site';
import { Breadcrumbs, metadata as meta } from '@/lib/seo';
import { Consultation } from '@/components/storefront/content-body';
export const metadata = meta(
  'Về Quốc Hưng',
  'Thiết bị cân điện tử, trạm cân và giải pháp quản lý dữ liệu cân của Quốc Hưng tại Đắk Lắk.',
  '/gioi-thieu',
);
export default function Page() {
  return (
    <>
      <div className="container section">
        <Breadcrumbs items={[{ name: 'Về Quốc Hưng', href: '/gioi-thieu' }]} />
        <div className="solution-hero">
          <div>
            <p className="eyebrow">CÂN ĐIỆN TỬ QUỐC HƯNG</p>
            <h1>Từ thiết bị cân đến hệ thống vận hành.</h1>
            <p className="lead-text">
              Quốc Hưng cung cấp cân điện tử, lắp đặt trạm cân xe tải và giải pháp phần mềm, tự động
              hóa cho hoạt động cân hàng hóa.
            </p>
            <p>
              Đặt tại Buôn Ma Thuột, đội ngũ Quốc Hưng tiếp nhận nhu cầu, tư vấn cấu hình và triển
              khai thiết bị theo điều kiện sử dụng thực tế.
            </p>
            <Link href="/du-an" className="button button-primary">
              Xem công trình thực tế ↗
            </Link>
          </div>
          <Image
            src="/images/official/quoc-hung-team.webp"
            alt="Đội ngũ Quốc Hưng"
            width={1000}
            height={750}
            sizes="(max-width:760px) 100vw, 50vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <section className="section" data-reveal>
          <p className="eyebrow">LĨNH VỰC HOẠT ĐỘNG</p>
          <h2>Mỗi nhu cầu, một cấu hình phù hợp.</h2>
          <div className="solution-grid">
            {[
              [
                'Thiết bị cân',
                'Cân bàn, cân sàn, cân xe tải và các thiết bị phục vụ cân đo trong sản xuất, kho hàng, thu mua.',
                '/san-pham',
              ],
              [
                'Linh kiện & kết nối',
                'Loadcell, đầu chỉ thị và các lựa chọn kết nối dữ liệu theo cấu hình hệ thống.',
                '/bo-chi-thi',
              ],
              [
                'Trạm cân & tự động hóa',
                'Khảo sát, lắp đặt trạm cân; trao đổi phương án phần mềm và nhận diện biển số theo nhu cầu.',
                '/giai-phap/tram-can-tu-dong',
              ],
            ].map(([title, description, href]) => (
              <Link className="feature-card" key={title} href={href}>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>Tìm hiểu ↗</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="section" data-reveal>
          <h2>Trao đổi rõ từ nhu cầu đến bàn giao.</h2>
          <p className="lead-text">
            Tải trọng, kích thước vật cân, môi trường sử dụng và yêu cầu lưu dữ liệu là cơ sở để lựa
            chọn thiết bị. Những hạng mục bảo hành, vận chuyển và hồ sơ đi kèm được xác nhận trong
            báo giá.
          </p>
          <div className="company-details">
            <h3>{site.legalName}</h3>
            <p>Mã số doanh nghiệp: {site.registration}</p>
            <p>{site.address}</p>
            <p>Giờ làm việc: {site.hours}</p>
            <a href={`tel:${site.phone}`}>Kinh doanh: {site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </section>
      </div>
      <Consultation />
    </>
  );
}
