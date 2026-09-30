import type { MetadataRoute } from 'next';
import { categories, products, content, productHref, isDemo } from '@/features/catalog/repository';
import { site } from '@/config/site';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isDemo()) return [];
  const [cats, ps, posts, projects] = await Promise.all([
    categories(),
    products(),
    content('posts'),
    content('projects'),
  ]);
  const routes = [
    '/',
    '/san-pham',
    '/giai-phap',
    '/lien-he',
    '/kien-thuc',
    '/du-an',
    ...cats.map((c) => `/${c.slug}`),
    ...ps.filter((p) => !p.noindex && !p.is_demo).map((p) => productHref(p, cats)),
    ...posts.filter((p) => !p.noindex && !p.is_demo).map((p) => `/kien-thuc/${p.slug}`),
    ...projects.filter((p) => !p.noindex && !p.is_demo).map((p) => `/du-an/${p.slug}`),
  ];
  return routes.map((path) => ({
    url: new URL(path, site.url).href,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
