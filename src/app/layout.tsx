import type { Metadata } from 'next';
import { site } from '@/config/site';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | Quốc Hưng` },
  description: 'Giải pháp cân điện tử cho công nghiệp, kho vận và nông nghiệp.',
  ...(process.env.DEMO_MODE === 'true' ? { robots: { index: false, follow: true } } : {}),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
