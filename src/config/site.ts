import { resolveSiteUrl } from '@/lib/site-url';
export const site = {
  name: 'Cân điện tử Quốc Hưng',
  url: resolveSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL,
  ),
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '0869031468',
  technicalPhone: '0869271468',
  servicePhone: '0981912347',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@candientuquochung.com',
  legalName: 'CÔNG TY TNHH SX DV KT QUỐC HƯNG',
  address: 'Số 78, Đường 10/3, P. Buôn Ma Thuột, Tỉnh Đắk Lắk',
  registration: '6001541813',
  hours: '07:30 – 17:30',
  logo: '/images/official/logo.webp',
  source: 'https://candientuquochung.com/',
  map: 'https://www.google.com/maps/search/?api=1&query=78+%C4%90%C6%B0%E1%BB%9Dng+10%2F3+Bu%C3%B4n+Ma+Thu%E1%BB%99t',
};
export const policies: Record<string, string> = {
  'gioi-thieu': 'Về Quốc Hưng',
  'chinh-sach-bao-mat': 'Chính sách bảo mật',
  'chinh-sach-thanh-toan': 'Chính sách thanh toán',
  'chinh-sach-van-chuyen': 'Chính sách vận chuyển',
  'chinh-sach-doi-tra': 'Chính sách đổi trả',
  'chinh-sach-bao-hanh': 'Chính sách bảo hành',
  'dieu-khoan-su-dung': 'Điều khoản sử dụng',
};
