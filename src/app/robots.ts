import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { isDemo } from '@/features/catalog/repository';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: isDemo()
        ? ['/']
        : ['/admin', '/crm', '/api', '/tai-khoan', '/dang-nhap', '/gio-hang', '/tim-kiem', '/*?'],
    },
    sitemap: new URL('/sitemap.xml', site.url).href,
  };
}
