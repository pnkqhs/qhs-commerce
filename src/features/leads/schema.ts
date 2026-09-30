import { z } from 'zod';
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Nhập họ tên').max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{8,20}$/, 'Số điện thoại chưa hợp lệ'),
  email: z.union([z.email(), z.literal('')]),
  company: z.string().max(200),
  province: z.string().max(100),
  message: z.string().trim().min(10, 'Vui lòng mô tả ít nhất 10 ký tự').max(3000),
  product_id: z.union([z.uuid(), z.literal('')]),
  type: z.enum(['contact', 'quote', 'survey', 'callback']),
  consent: z.literal(true, { error: 'Cần đồng ý để gửi yêu cầu' }),
  website: z.string().max(0),
  landing_page: z.string().max(1000),
  referrer: z.string().max(1000),
  utm_source: z.string().max(200),
  utm_medium: z.string().max(200),
  utm_campaign: z.string().max(200),
  utm_content: z.string().max(200),
  utm_term: z.string().max(200),
});
export type LeadInput = z.infer<typeof leadSchema>;
