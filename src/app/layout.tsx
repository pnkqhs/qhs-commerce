import type { Metadata } from 'next';
import { site } from '@/config/site';
import { allowIndexing } from '@/lib/indexing';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | Quốc Hưng` },
  description: 'Giải pháp cân điện tử cho công nghiệp, kho vận và nông nghiệp.',
  robots: { index: allowIndexing(site.url) && process.env.DEMO_MODE !== 'true', follow: true },
  icons: { icon: '/icon.png', apple: '/icon.png' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
