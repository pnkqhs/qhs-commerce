import { Header, Footer } from '@/components/layout/storefront';
import { AttributionCapture } from '@/components/storefront/attribution';
import { StorefrontMotion } from '@/components/storefront/motion';
import './storefront.css';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AttributionCapture />
      <StorefrontMotion />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
