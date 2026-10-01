import { z } from 'zod';
const slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang')
  .max(160);
const text = z.string().max(50000);
const url = z.union([
  z.literal(''),
  z
    .string()
    .url()
    .refine((v) => v.startsWith('https://'), 'URL phải dùng HTTPS')
    .refine(
      (v) =>
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        (new URL(v).hostname === new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname &&
          new URL(v).pathname.startsWith('/storage/v1/object/public/')),
      'Ảnh phải được tải lên Storage của QHS Commerce',
    ),
  z.string().regex(/^\/images\/(?:[a-z0-9-]+\.svg|official\/[a-z0-9-]+\.(?:webp|png|jpg))$/),
]);
const optionalId = z.union([z.uuid(), z.literal('')]).transform((v) => v || null);
const price = z
  .union([z.literal(''), z.coerce.number().min(0).max(999999999999)])
  .transform((v) => (v === '' ? null : v));
const jsonArray = <T extends z.ZodType>(schema: T) =>
  z
    .string()
    .transform((s, ctx) => {
      try {
        return JSON.parse(s || '[]') as unknown;
      } catch {
        ctx.addIssue({ code: 'custom', message: 'JSON không hợp lệ' });
        return z.NEVER;
      }
    })
    .pipe(z.array(schema).max(100));
export const productSchema = z
  .object({
    name: z.string().trim().min(3).max(200),
    slug,
    sku: z.string().min(1).max(100),
    model: z.string().max(100),
    category_id: z.uuid(),
    brand_id: optionalId,
    short_description: z.string().max(1000),
    full_description: text,
    featured_image: url,
    sales_type: z.enum(['DIRECT', 'QUOTE', 'PROJECT']),
    price,
    sale_price: price,
    vat: z.coerce.number().min(0).max(100),
    stock_status: z.enum(['in_stock', 'out_of_stock', 'contact']),
    stock_quantity: z
      .union([z.literal(''), z.coerce.number().int().min(0)])
      .transform((v) => (v === '' ? null : v)),
    status: z.enum(['draft', 'published', 'archived']),
    featured: z.coerce.boolean(),
    is_demo: z.coerce.boolean(),
    warranty: z.string().max(500),
    application: z.string().max(500),
    capacity: z.string().max(100),
    division: z.string().max(100),
    seo_title: z.string().max(200),
    meta_description: z.string().max(500),
    canonical_url: z.union([z.literal(''), z.url().refine((v) => v.startsWith('https://'))]),
    og_image: url,
    noindex: z.coerce.boolean(),
    specs: jsonArray(z.object({ label: z.string().min(1).max(100), value: z.string().max(500) })),
    gallery: jsonArray(url.refine((v) => v !== '')),
    documents: jsonArray(
      z.object({
        name: z.string().min(1).max(150),
        url: z.url().refine((v) => v.startsWith('https://')),
      }),
    ),
    videos: jsonArray(z.url().refine((v) => v.startsWith('https://'))),
  })
  .refine((p) => p.sales_type !== 'DIRECT' || p.price !== null, {
    message: 'Sản phẩm DIRECT cần giá',
    path: ['price'],
  })
  .refine((p) => p.sale_price === null || (p.price !== null && p.sale_price <= p.price), {
    message: 'Giá khuyến mãi không được cao hơn giá bán',
    path: ['sale_price'],
  });
export const taxonomySchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug,
  status: z.enum(['draft', 'published', 'archived']),
  parent_id: optionalId,
  description: z.string().max(2000),
  seo_content: text,
});
export const contentSchema = z.object({
  title: z.string().min(3).max(200),
  slug,
  excerpt: z.string().max(1000),
  content: text,
  featured_image: url,
  status: z.enum(['draft', 'published', 'archived']),
  seo_title: z.string().max(200),
  meta_description: z.string().max(500),
  noindex: z.coerce.boolean(),
  is_demo: z.coerce.boolean(),
  publication_consent: z.coerce.boolean(),
});
