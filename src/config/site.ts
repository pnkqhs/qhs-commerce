export const site = {
  name: 'Cân điện tử Quốc Hưng',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || '',
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
