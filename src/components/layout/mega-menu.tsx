'use client';
import { useRef } from 'react';
import { Menu } from 'lucide-react';
export function MegaMenu({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={ref}
      className="mega"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false;
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && ref.current) {
          ref.current.open = false;
          ref.current.querySelector('summary')?.focus();
        }
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a') && ref.current) ref.current.open = false;
      }}
    >
      <summary>
        <Menu size={18} />
        <span>Danh mục sản phẩm</span>
        <span aria-hidden>⌄</span>
      </summary>
      <div className="mega-panel">{children}</div>
    </details>
  );
}
