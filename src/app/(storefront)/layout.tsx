import { Header, Footer } from '@/components/layout/storefront';
import { AttributionCapture } from '@/components/storefront/attribution';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AttributionCapture />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
