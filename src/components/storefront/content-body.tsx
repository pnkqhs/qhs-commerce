import Link from 'next/link';
/** Small safe text format, with no raw HTML execution. */
export function ContentBody({ text }: { text: string }) {
  return (
    <div className="content-prose">
      {text.split(/\n\n+/).map((block, i) => {
        const lines = block.split('\n');
        const heading = lines[0].startsWith('## ') ? lines.shift()!.slice(3) : null;
        return (
          <section key={i}>
            {heading && <h2>{heading}</h2>}
            {lines.every((l) => l.startsWith('- ')) ? (
              <ul>
                {lines.map((l, n) => (
                  <li key={n}>{l.slice(2)}</li>
                ))}
              </ul>
            ) : (
              lines.map((line, n) => <p key={n}>{line}</p>)
            )}
          </section>
        );
      })}
    </div>
  );
}
export function Consultation({ title = 'Cùng chọn cấu hình phù hợp.' }: { title?: string }) {
  return (
    <section className="container cta-banner" data-reveal>
      <div>
        <p className="eyebrow">TRAO ĐỔI VỚI QUỐC HƯNG</p>
        <h2>{title}</h2>
        <p>Gửi nhu cầu và mặt bằng. Chúng tôi cùng bạn làm rõ giải pháp.</p>
      </div>
      <Link className="button" href="/lien-he">
        Nhận tư vấn kỹ thuật ↗
      </Link>
    </section>
  );
}
