import Link from 'next/link';
import Image from 'next/image';
import { solutions } from '@/features/content/solutions';
import { metadata as meta, Breadcrumbs } from '@/lib/seo';
import { Consultation } from '@/components/storefront/content-body';
export const metadata = meta(
  'Giải pháp cân theo ngành & quy trình',
  'Lựa chọn giải pháp cân cho nhà máy, kho vận, nông sản, trạm cân xe tải và quản lý tự động.',
  '/giai-phap',
);
export default function Page() {
  return (
    <>
      <div className="container section">
        <Breadcrumbs items={[{ name: 'Giải pháp', href: '/giai-phap' }]} />
        <p className="eyebrow">TỪ THIẾT BỊ ĐẾN QUY TRÌNH</p>
        <h1>
          Giải pháp phù hợp
          <br />
          với cách bạn vận hành.
        </h1>
        <p className="lead-text">
          Chọn theo nhu cầu, mặt bằng và luồng dữ liệu. Mỗi hệ thống bắt đầu bằng việc hiểu rõ công
          việc thực tế.
        </p>
        <div className="solution-grid section">
          {solutions.map((s) => (
            <Link href={`/giai-phap/${s.slug}`} key={s.slug} className="solution-card">
              <Image
                src={s.image}
                width={600}
                height={400}
                sizes="(max-width:760px) 100vw, 33vw"
                alt={s.title}
              />
              <div>
                <h2>{s.title}</h2>
                <p>{s.excerpt}</p>
                <span>Khám phá giải pháp ↗</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Consultation />
    </>
  );
}
