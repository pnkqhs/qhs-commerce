import type { Product, Category, Brand } from '@/types/catalog';
export type Filters = Record<string, string | undefined>;
export function safeFilters(raw: Record<string, unknown>): Filters {
  const allowed = [
    'q',
    'category',
    'brand',
    'capacity',
    'division',
    'application',
    'min',
    'max',
    'stock',
    'sort',
    'page',
  ];
  return Object.fromEntries(
    allowed.map((key) => {
      const value = raw[key];
      return [
        key,
        typeof value === 'string'
          ? value.slice(0, 300)
          : Array.isArray(value) && typeof value[0] === 'string'
            ? value[0].slice(0, 300)
            : undefined,
      ];
    }),
  );
}
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
export function filterProducts(
  products: Product[],
  categories: Category[],
  brands: Brand[],
  filters: Filters,
  categoryId?: string,
) {
  const categoryIds = new Set<string>();
  function descend(id: string) {
    if (categoryIds.has(id)) return;
    categoryIds.add(id);
    categories.filter((c) => c.parent_id === id).forEach((c) => descend(c.id));
  }
  if (categoryId) descend(categoryId);
  const tokens = normalize(filters.q || '')
    .split(/\s+/)
    .filter(Boolean);
  const selected = products.filter((p) => {
    const hay = normalize(
      [
        p.name,
        p.sku,
        p.model,
        p.short_description,
        p.full_description,
        p.capacity,
        p.application,
        p.division,
        JSON.stringify(p.specs),
        categories.find((c) => c.id === p.category_id)?.name,
        brands.find((b) => b.id === p.brand_id)?.name,
      ].join(' '),
    );
    const price = p.sale_price ?? p.price;
    return (
      (!categoryId || categoryIds.has(p.category_id)) &&
      tokens.every((t) => hay.includes(t)) &&
      (!filters.category || p.category_id === filters.category) &&
      (!filters.brand || p.brand_id === filters.brand) &&
      (!filters.capacity || normalize(p.capacity).includes(normalize(filters.capacity))) &&
      (!filters.division || normalize(p.division).includes(normalize(filters.division))) &&
      (!filters.application || normalize(p.application).includes(normalize(filters.application))) &&
      (!filters.stock || p.stock_status === filters.stock) &&
      (!filters.min || (price !== null && price >= Number(filters.min))) &&
      (!filters.max || (price !== null && price <= Number(filters.max)))
    );
  });
  if (filters.sort === 'price-asc')
    selected.sort(
      (a, b) => (a.sale_price ?? a.price ?? Infinity) - (b.sale_price ?? b.price ?? Infinity),
    );
  if (filters.sort === 'price-desc')
    selected.sort((a, b) => (b.sale_price ?? b.price ?? -1) - (a.sale_price ?? a.price ?? -1));
  if (filters.sort === 'name') selected.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  return selected;
}
