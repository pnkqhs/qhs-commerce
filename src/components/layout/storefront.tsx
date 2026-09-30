import Link from 'next/link';
import { Search, UserRound, ShoppingCart, ArrowUpRight, Menu } from 'lucide-react';
import { categories, isDemo } from '@/features/catalog/repository';
import { policies, site } from '@/config/site';
export async function Header() {
  const cats = await categories();
  return (
    <>
      <a className="skip-link" href="#main">
        Bỏ qua điều hướng
      </a>
      {isDemo() && (
        <div className="demo-bar">
          BẢN XEM TRƯỚC · Sản phẩm và thông số DEMO, chưa dùng để giao dịch
        </div>
      )}
      <div className="topbar">
        <div className="container">
          <span>Thiết bị cân & giải pháp đo lường</span>
          <Link href="/lien-he">Kết nối đội ngũ kỹ thuật ↗</Link>
        </div>
      </div>
      <header>
        <div className="container header-main">
          <Link href="/" className="brand" aria-label="Quốc Hưng - Trang chủ">
            <strong>
              QHS<span>▰</span>
            </strong>
            <small>CÂN ĐIỆN TỬ QUỐC HƯNG</small>
          </Link>
          <form action="/tim-kiem" className="search">
            <Search size={20} />
            <input
              name="q"
              aria-label="Tìm sản phẩm"
              placeholder="Tìm tên sản phẩm, model, mã SKU..."
            />
            <button aria-label="Tìm kiếm">
              <ArrowUpRight size={20} />
            </button>
          </form>
          <div className="header-actions">
            <Link href="/tai-khoan" aria-label="Tài khoản">
              <UserRound size={22} />
              <span>Tài khoản</span>
            </Link>
            <Link href="/gio-hang" aria-label="Giỏ hàng">
              <ShoppingCart size={22} />
              <span>Giỏ hàng</span>
            </Link>
          </div>
        </div>
        <nav className="container desktop-nav" aria-label="Điều hướng chính">
          <details className="mega">
            <summary>
              <Menu size={18} /> Danh mục sản phẩm <span>⌄</span>
            </summary>
            <div className="mega-panel">
              <div className="mobile-menu-links">
                <strong>Khám phá Quốc Hưng</strong>
                <Link href="/san-pham">Tất cả sản phẩm</Link>
                <Link href="/giai-phap">Giải pháp</Link>
                <Link href="/du-an">Dự án</Link>
                <Link href="/kien-thuc">Kiến thức</Link>
                <Link href="/gioi-thieu">Về Quốc Hưng</Link>
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
                        <Link key={c.id} href={`/${c.slug}`}>
                          {c.name}
                        </Link>
                      ))}
                  </div>
                ))}
            </div>
          </details>
          <Link href="/san-pham">Tất cả sản phẩm</Link>
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
    <footer>
      <div className="container footer-grid">
        <div>
          <Link className="footer-logo" href="/">
            QHS<span>▰</span>
          </Link>
          <h3>Cân điện tử Quốc Hưng</h3>
          <p>
            Giải pháp cân phù hợp.
            <br />
            Đồng hành cùng vận hành của bạn.
          </p>
          <small>Thông tin pháp lý, địa chỉ và mã số thuế đang chờ doanh nghiệp cung cấp.</small>
        </div>
        <div>
          <h3>Khám phá</h3>
          {[
            ['/san-pham', 'Sản phẩm'],
            ['/giai-phap', 'Giải pháp'],
            ['/du-an', 'Dự án'],
            ['/kien-thuc', 'Kiến thức'],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h3>Chính sách</h3>
          {Object.entries(policies)
            .filter(([s]) => s !== 'gioi-thieu')
            .map(([slug, title]) => (
              <Link key={slug} href={`/${slug}`}>
                {title}
              </Link>
            ))}
        </div>
        <div>
          <h3>Hỗ trợ kỹ thuật</h3>
          <p>Cần chọn tải trọng hay cấu hình kết nối?</p>
          <Link className="footer-contact" href="/lien-he">
            Gửi yêu cầu tư vấn ↗
          </Link>
          {site.phone && <a href={`tel:${site.phone}`}>{site.phone}</a>}
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          <small>Kênh mạng xã hội: đang cập nhật.</small>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} Quốc Hưng · QHS Commerce <Link href="/admin">Quản trị</Link>
      </div>
    </footer>
  );
}
