import type { Brand, Category, Product, Content } from '@/types/catalog';
const groups = [
  'Cân công nghiệp',
  'Cân chuyên dụng',
  'Linh kiện cân',
  'Nông sản',
  'Thương hiệu / thiết bị',
];
const names = [
  'Cân xe tải',
  'Cân bàn',
  'Cân đồng hồ',
  'Cân ghế',
  'Cân bàn lớn',
  'Cân động vật',
  'Cân kỹ thuật',
  'Dụng cụ nông sản',
  'Cân treo',
  'Cảm biến khối lượng',
  'Bộ chỉ thị',
  'Phụ kiện',
  'Thiết bị Curiotec',
];
export const slugs = [
  'can-xe-tai',
  'can-ban',
  'can-dong-ho',
  'can-ghe',
  'can-ban-lon',
  'can-dong-vat',
  'can-ky-thuat',
  'dung-cu-nong-san',
  'can-treo',
  'cam-bien-khoi-luong',
  'bo-chi-thi',
  'phu-kien',
  'thiet-bi-curiotec',
];
const parents = [0, 0, 0, 1, 0, 1, 1, 3, 1, 2, 2, 2, 4];
export const demoCategories: Category[] = [
  ...groups.map((name, i) => ({
    id: `group-${i}`,
    name,
    slug: `nhom-${i}`,
    parent_id: null,
    description: 'Giải pháp thiết bị cân theo nhu cầu sử dụng.',
    seo_content: '',
    status: 'published',
  })),
  ...names.map((name, i) => ({
    id: `cat-${i}`,
    name,
    slug: slugs[i],
    parent_id: `group-${parents[i]}`,
    description: `Tìm hiểu ${name.toLowerCase()}, cấu hình và giải pháp phù hợp với nhu cầu của bạn.`,
    seo_content:
      'Lựa chọn thiết bị dựa trên tải trọng, độ chia, môi trường làm việc và yêu cầu kết nối. Liên hệ đội ngũ kỹ thuật để được xác nhận cấu hình trước khi đặt hàng.',
    status: 'published',
  })),
];
export const demoBrands: Brand[] = [
  { id: 'demo-brand', name: 'QHS DEMO', slug: 'qhs-demo', status: 'published' },
];
export const demoProducts: Product[] = [
  ['Cân bàn điện tử 300kg', 'can-ban-300kg-demo', 1, 'DIRECT', '300 kg', 'platform'],
  ['Cân xe tải 80 tấn', 'can-xe-tai-80-tan-demo', 0, 'PROJECT', '80 tấn', 'truck'],
  ['Loadcell 2 tấn', 'loadcell-2-tan-demo', 9, 'QUOTE', '2 tấn', 'loadcell'],
  ['Bộ chỉ thị cân điện tử', 'bo-chi-thi-demo', 10, 'QUOTE', 'Theo cấu hình', 'indicator'],
].map((v, i) => ({
  id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
  name: String(v[0]),
  slug: String(v[1]),
  sku: `DEMO-00${i + 1}`,
  model: `QHS-D${i + 1}`,
  category_id: `cat-${v[2]}`,
  brand_id: 'demo-brand',
  short_description:
    'Dữ liệu DEMO để kiểm thử giao diện. Cấu hình và giá chưa phải thông tin thương mại của Quốc Hưng.',
  full_description:
    'Sản phẩm minh họa cho catalogue kỹ thuật. Thông số dưới đây là ví dụ, cần thay bằng dữ liệu đã được xác minh trước khi xuất bản chính thức.',
  featured_image: `/images/${v[5]}.svg`,
  sales_type: v[3] as Product['sales_type'],
  price: i === 0 ? 3500000 : null,
  sale_price: null,
  vat: 0,
  stock_status: 'contact',
  stock_quantity: null,
  status: 'published',
  featured: true,
  is_demo: true,
  warranty: 'Cần xác nhận theo cấu hình',
  application: 'Nhà máy, kho vận',
  capacity: String(v[4]),
  division: 'Cần xác nhận',
  seo_title: '',
  meta_description: '',
  canonical_url: '',
  og_image: '',
  noindex: true,
  specs: [
    { label: 'Tải trọng minh họa', value: String(v[4]) },
    { label: 'Model minh họa', value: `QHS-D${i + 1}` },
  ],
  gallery: [],
  documents: [],
  videos: [],
}));
export const demoPosts: Content[] = [
  {
    id: 'demo-post',
    title: 'Chọn cân bàn: bắt đầu từ nhu cầu vận hành',
    slug: 'chon-can-ban-theo-nhu-cau',
    excerpt: 'Tải trọng, kích thước bàn cân và môi trường làm việc là những yếu tố cần làm rõ.',
    content:
      'Nội dung DEMO — bản nháp biên tập.\n\nXác định khối lượng tối đa của hàng hóa và kích thước kiện hàng. Sau đó trao đổi với đơn vị cung cấp về độ chia, môi trường và yêu cầu kết nối.\n\nThông số cuối cùng cần được xác nhận trên tài liệu chính thức của thiết bị.',
    featured_image: '/images/platform.svg',
    status: 'published',
    seo_title: '',
    meta_description: '',
    noindex: true,
    created_at: '2026-09-30T00:00:00Z',
    is_demo: true,
  },
];
