import Link from 'next/link';
import Image from 'next/image';
import { UserRound, ShoppingCart, Phone, ArrowUpRight } from 'lucide-react';
import { categories, products, productHref, isDemo } from '@/features/catalog/repository';
import { policies, site } from '@/config/site';
import { GlobalSearch } from '@/components/storefront/search';
import { MegaMenu } from './mega-menu';
export async function Header() {
  const [cats, ps] = await Promise.all([categories(), products()]);
  return (
    <>
      <a className="skip-link" href="#main">
        Bỏ qua điều hướng
      </a>
      {isDemo() && (
        <div className="demo-bar">BẢN XEM TRƯỚC · Dữ liệu DEMO, chưa dùng để giao dịch</div>
      )}
      <div className="topbar">
        <div className="container">
          <span>{site.address}</span>
          <a href={`tel:${site.phone}`}>
            <Phone size={12} /> Kinh doanh: {site.phone}
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <Link href="/" className="brand" aria-label="Quốc Hưng - Trang chủ">
            <Image
              src={site.logo}
              width={270}
              height={84}
              sizes="(max-width:760px) 210px, 270px"
              alt="Cân điện tử Quốc Hưng"
              loading="eager"
              fetchPriority="high"
            />
          </Link>
          <GlobalSearch
            suggestions={ps
              .filter((p) => !p.is_demo)
              .map((p) => ({ name: p.name, href: productHref(p, cats) }))}
          />
          <div className="header-actions">
            <Link href="/tai-khoan" aria-label="Tài khoản">
              <UserRound size={21} />
              <span>Tài khoản</span>
            </Link>
            <Link href="/gio-hang" aria-label="Giỏ hàng">
              <ShoppingCart size={21} />
              <span>Giỏ hàng</span>
            </Link>
          </div>
        </div>
        <nav className="container desktop-nav" aria-label="Điều hướng chính">
          <MegaMenu>
            <div className="mobile-menu-links">
              <strong>Khám phá Quốc Hưng</strong>
              {[
                ['/san-pham', 'Tất cả sản phẩm'],
                ['/giai-phap', 'Giải pháp'],
                ['/du-an', 'Dự án'],
                ['/kien-thuc', 'Kiến thức'],
                ['/gioi-thieu', 'Về Quốc Hưng'],
              ].map(([href, label]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
            {cats
              .filter((c) => !c.parent_id)
              .map((parent) => (
                <div key={parent.id}>
                  <Link href={`/${parent.slug}`}>
                    <strong>{parent.name}</strong>
                  </Link>
                  {cats
                    .filter((c) => c.parent_id === parent.id)
                    .map((c) => (
                      <Link href={`/${c.slug}`} key={c.id}>
                        {c.name}
                      </Link>
                    ))}
                </div>
              ))}
            <Link href="/giai-phap/tram-can-xe-tai" className="mega-feature">
              <Image
                src="/images/official/tram-can-khanh-vinh-1.webp"
                width={380}
                height={220}
                alt="Trạm cân Quốc Hưng tại Khánh Vĩnh"
              />
              <strong>Giải pháp trạm cân xe tải</strong>
              <span>
                Từ mặt bằng đến vận hành <ArrowUpRight size={16} />
              </span>
            </Link>
          </MegaMenu>
          <Link href="/san-pham">Sản phẩm</Link>
          <Link href="/giai-phap">Giải pháp</Link>
          <Link href="/du-an">Dự án</Link>
          <Link href="/kien-thuc">Kiến thức</Link>
          <Link href="/gioi-thieu">Về Quốc Hưng</Link>
          <Link href="/lien-he">Liên hệ ↗</Link>
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="footer-logo">
            <Image
              src={site.logo}
              width={270}
              height={84}
              sizes="270px"
              alt="Cân điện tử Quốc Hưng"
            />
          </Link>
          <h3>{site.legalName}</h3>
          <p>
            Thiết bị cân, giải pháp trạm cân và dịch vụ kỹ thuật cho doanh nghiệp, cơ sở sản xuất và
            điểm thu mua.
          </p>
          <p>{site.address}</p>
          <small>
            ĐKDN số {site.registration}
            <br />
            Giờ mở cửa: {site.hours}
          </small>
        </div>
        <div>
          <h3>Sản phẩm & giải pháp</h3>
          {[
            ['/can-xe-tai', 'Cân xe tải'],
            ['/can-ban', 'Cân bàn điện tử'],
            ['/cam-bien-khoi-luong', 'Loadcell & cảm biến'],
            ['/bo-chi-thi', 'Bộ chỉ thị'],
            ['/giai-phap/tram-can-tu-dong', 'Trạm cân tự động'],
            ['/giai-phap/nong-nghiep-nong-san', 'Nông nghiệp & nông sản'],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h3>Thông tin & hỗ trợ</h3>
          <Link href="/gioi-thieu">Về Quốc Hưng</Link>
          <Link href="/du-an">Công trình thực tế</Link>
          <Link href="/kien-thuc">Kiến thức kỹ thuật</Link>
          {Object.entries(policies)
            .filter(([s]) => s !== 'gioi-thieu')
            .map(([s, title]) => (
              <Link href={`/${s}`} key={s}>
                {title}
              </Link>
            ))}
        </div>
        <div>
          <h3>Kết nối với chúng tôi</h3>
          <p>Kinh doanh</p>
          <a className="footer-phone" href={`tel:${site.phone}`}>
            {site.phone}
          </a>
          <p>Kỹ thuật</p>
          <a className="footer-phone" href={`tel:${site.technicalPhone}`}>
            {site.technicalPhone}
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.map} target="_blank" rel="noopener noreferrer">
            Chỉ đường đến Quốc Hưng ↗
          </a>
          <Link className="footer-contact" href="/lien-he">
            Gửi yêu cầu tư vấn ↗
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Cân điện tử Quốc Hưng</span>
        <span>Chính xác · Bền bỉ · Tận tâm</span>
      </div>
    </footer>
  );
}
