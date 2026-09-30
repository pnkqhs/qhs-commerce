'use client';
import { useSyncExternalStore } from 'react';
function subscribe(callback: () => void) {
  const media = window.matchMedia('(max-width: 760px)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
export function FilterPanel({ children }: { children: React.ReactNode }) {
  const mobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia('(max-width: 760px)').matches,
    () => false,
  );
  return (
    <details className="filter-panel" open={!mobile}>
      <summary>Bộ lọc sản phẩm</summary>
      {children}
    </details>
  );
}
