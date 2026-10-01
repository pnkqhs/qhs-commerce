'use client';
import Link from 'next/link';
import { useId, useState } from 'react';
import { normalize } from '@/features/search/filter';
import { Search, ArrowUpRight } from 'lucide-react';
export function GlobalSearch({ suggestions }: { suggestions: { name: string; href: string }[] }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const id = useId();
  const matches = suggestions
    .filter((s) => normalize(s.name).includes(normalize(query)))
    .slice(0, 5);
  return (
    <div
      className="global-search"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <form action="/tim-kiem" className="search">
        <Search size={19} />
        <input
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label="Tìm sản phẩm"
          aria-controls={open ? id : undefined}
          placeholder="Tìm sản phẩm, model, tải trọng..."
          autoComplete="off"
        />
        <button aria-label="Tìm kiếm">
          <ArrowUpRight size={20} />
        </button>
      </form>
      {open && (
        <div className="search-suggestions" id={id}>
          <small>{query ? 'Sản phẩm phù hợp' : 'Khám phá catalogue'}</small>
          {matches.map((s) => (
            <Link key={s.href} href={s.href} onClick={() => setOpen(false)}>
              {s.name}
              <ArrowUpRight size={14} />
            </Link>
          ))}
          <Link href={`/tim-kiem?q=${encodeURIComponent(query)}`} onClick={() => setOpen(false)}>
            Xem tất cả kết quả →
          </Link>
        </div>
      )}
    </div>
  );
}
