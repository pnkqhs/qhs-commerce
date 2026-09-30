# QHS Commerce

Website catalogue, SEO storefront và nền tảng commerce/CRM riêng cho **Cân điện tử Quốc Hưng**. Phase 1 được triển khai trong repo này. Không dùng bất kỳ schema, API, Auth, Storage hay khóa nào của QHS Manager.

## Khởi chạy

Yêu cầu Node.js 22+, npm. Từ thư mục dự án:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

PowerShell: thay `cp` bằng `Copy-Item .env.example .env.local`. Mở http://localhost:3000. `.env.local` đã được tạo cho bản xem trước local, không chứa credential và được gitignore.

`DEMO_MODE=true` cùng Supabase chưa cấu hình sẽ dùng catalogue DEMO. Không tự động thay dữ liệu thật bằng demo khi database lỗi. Các form không báo thành công nếu chưa lưu thật. Không dùng demo để nhận đơn hay công bố giá/thông số. Bản demo chặn index và có nhãn hiển thị rõ.

## Stack và kiến trúc

- Next.js 16.3.7 App Router, React 19, TypeScript strict, npm lockfile.
- Server Components cho storefront và admin; client islands cho form/đăng nhập/upload.
- Tailwind CSS 4, design tokens xanh `#238838`, lime `#DDE22C`; Button theo cấu trúc shadcn với Radix Slot/CVA; Lucide icons.
- Supabase SSR/Auth/Postgres/Storage, Zod, React Hook Form.
- Văn bản nội dung được React escape; chưa chấp nhận HTML tùy ý. Editor rich text nâng cao là phần mở rộng, hiện nội dung dạng văn bản có xuống dòng.

```text
src/app/(storefront)   Trang công khai, tài khoản và đăng nhập
src/app/admin          Catalogue/CMS/Media có RBAC
src/app/crm            Danh sách lead cho admin/sales
src/app/api            Nhận lead và upload media
src/components        UI, layout, product, forms, admin
src/features/catalog  Repository và dữ liệu demo
src/features/search   Adapter tìm kiếm/lọc không dấu
src/features/admin    Schema Zod và Server Actions
src/features/leads    Hợp đồng form lead
src/lib/supabase       Browser/server/service-role client tách riêng
src/lib/payments       Hợp đồng provider, hiện fail-closed
src/lib/seo.tsx        Metadata, JSON-LD và breadcrumbs
supabase/migrations   Schema, RLS, audit, integrity
tests                 Unit/SQL integration và Playwright
```

Storefront đọc dữ liệu published theo repository chung. Trong Phase 1, tìm kiếm và phân trang được thực hiện trên server qua adapter không dấu (tên/model/SKU/thương hiệu/danh mục/specs). Repository đọc theo batch để không cắt âm thầm ở giới hạn 1.000 dòng. GIN/tsvector đã có trong PostgreSQL. Với catalogue lớn, chuyển adapter sang truy vấn FTS/filter/count tại database trước khi nhập hàng chục nghìn sản phẩm; đây chưa phải search service quy mô lớn. React `cache` khử truy vấn trùng trong cùng request. Các lần lưu admin gọi revalidate layout. Khi có Supabase, cookie client khiến dữ liệu render động; chưa bật cache xuyên request cho dữ liệu có quyền.

## Biến môi trường

Xem `.env.example`.

- `NEXT_PUBLIC_SITE_URL`: origin canonical, đồng thời là origin được phép gửi API; production phải là HTTPS và đúng domain người dùng truy cập.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: dự án **QHS Commerce riêng**.
- `SUPABASE_SERVICE_ROLE_KEY`: chỉ server, dùng nhận lead/rate limit. Không đưa vào tên biến `NEXT_PUBLIC_*`.
- `DEMO_MODE`: `true` chỉ cho local/preview; production đặt `false`.
- `NEXT_PUBLIC_COMPANY_PHONE`, `NEXT_PUBLIC_COMPANY_EMAIL`: thông tin đã xác minh.
- `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`: dành cho Phase 2, chưa cần ở Phase 1.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: dự phòng. Chưa tải tracker hoặc gửi event ra ngoài.

Không gửi service-role qua chat hoặc commit git. Cấu hình trong `.env.local` hoặc secret manager của hosting.

## Supabase riêng và migration

1. Tạo Supabase project mới dành riêng QHS Commerce. Kiểm tra project ref/URL khác QHS Manager. Không dùng credential của QHS Manager.
2. Trên project trống, chạy lần lượt SQL trong `supabase/migrations/` qua SQL Editor hoặc CLI. Migration không import dữ liệu cũ.
3. Chạy `supabase/seed.sql`: chỉ 5 nhóm cha + 13 danh mục yêu cầu.
4. **Tùy chọn trên development**: chạy `supabase/seed.demo.sql` để có 4 sản phẩm DEMO, 1 thương hiệu DEMO và 1 bài viết DEMO. Không chạy seed demo ở production.
5. Điền URL/key riêng, cấu hình Auth Site URL, tắt public signup nếu chỉ cấp tài khoản nội bộ.

CLI (chỉ sau khi xác minh project ref):

```sh
npx supabase login
npx supabase link --project-ref YOUR_QHS_COMMERCE_PROJECT_REF
npx supabase db push
```

Seed production-safe có thể chạy trong SQL Editor riêng. Không chạy `db reset` trên remote. Local Docker: `npx supabase start` rồi `npx supabase db reset` chỉ cho database local có thể xóa. `supabase/config.toml` tự seed taxonomy local.

Migrations:

- `202609300001_foundation.sql`: 32 bảng public (bao gồm profiles), FK/unique/check/index, 5 role, RLS, audit, rate limit, 5 Storage buckets.
- `202609300002_integrity.sql`: chống chu trình danh mục, bảo vệ order item snapshot, sequence số đơn.

Specs/gallery/documents/videos là JSONB có hợp đồng Zod, tránh bảng con dư thừa trong Phase 1. Variant và related products có bảng riêng. Commerce có cart/items, orders/items/history, payments/events, địa chỉ. CRM có leads/customers/contacts, opportunities/activities, quotations/items, tasks/notes. Content có posts/categories, pages, projects/products, FAQs. Mọi bảng public bật RLS.

`scripts/generate-seed.ts` tái tạo seed từ demo types, chạy `npx tsx scripts/generate-seed.ts` nếu đổi dữ liệu mẫu.

## Tài khoản và quyền

Tạo user đầu tiên trong **Supabase Auth của Commerce**. Trigger tạo profile role customer, bỏ qua role do user metadata tự khai. Sau đó dùng SQL Editor có quyền quản trị để cấp admin cho đúng email:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR_ADMIN_EMAIL');
```

- `admin`: toàn quyền quản trị; audit log chỉ đọc, trigger ghi.
- `content`: sản phẩm, danh mục, thương hiệu, nội dung, media; không đọc lead/PII.
- `sales`: CRM leads/customers/opportunities/quotation/tasks/notes; đọc đơn.
- `warehouse`: đọc đơn và lịch sử; cập nhật fulfillment sẽ qua service Phase 2.
- `customer`: profile/đơn/địa chỉ của chính mình; không vào admin/CRM. Không có self-update role.
- Anonymous: chỉ catalogue/content published. Không direct insert lead hoặc upload.

Đăng nhập `/dang-nhap`, tài khoản `/tai-khoan`. Server Actions tự kiểm tra role, không chỉ dựa trên layout. Supabase RLS là lớp kiểm tra thứ hai. Auth proxy refresh cookie; server dùng `getUser()` để xác thực.

## Các route chính

- `/`: trang chủ; mega menu, danh mục, featured/new products, giải pháp, kiến thức, CTA.
- `/san-pham`, `/tim-kiem`, `/{category-slug}`: filter/sort/pagination SSR, filter URLs noindex.
- `/{category-slug}/{product-slug}`: gallery, specs, tài liệu/video, tư vấn, structured data.
- `/giai-phap`, `/giai-phap/[slug]`; `/kien-thuc`, `/kien-thuc/[slug]`; `/du-an`, `/du-an/[slug]`.
- `/lien-he`: contact/quote/survey/callback → lead; lưu product, UTM, referrer, consent.
- `/gioi-thieu`, các `/chinh-sach-*`, `/dieu-khoan-su-dung`: template có ghi rõ chờ phê duyệt; soạn trong admin pages với slug tương ứng.
- `/admin/products`, `/admin/categories`, `/admin/brands`: create/read/update/archive. Archive giữ FK/historical references, không xóa vật lý.
- `/admin/posts`, `/admin/projects`, `/admin/pages`, `/admin/media`.
- `/crm`: 200 lead gần nhất, quyền admin/sales.
- `/gio-hang`: trạng thái chuẩn bị Phase 2; không giả lập mua hàng.
- `/sitemap.xml`, `/robots.txt`: loại draft/demo/noindex, chặn khu vực nội bộ.

## SEO, media và bảo mật

HTML server-rendered, canonical, metadata riêng cho product/category/article/project, OpenGraph/Twitter, BreadcrumbList, Organization, WebSite, Product/Offer cho dữ liệu thật đủ trường, Article. Không tạo rating hoặc LocalBusiness với địa chỉ giả. FAQ schema chỉ thêm khi có FAQ thật hiển thị. Chính sách placeholder noindex. Robots không phải cơ chế phân quyền.

Media: ảnh JPG/PNG/WebP ≤5 MB, PDF ≤10 MB; kiểm MIME/size/magic bytes; UUID filename, role check, bucket policy. Ảnh tối ưu qua Next/Image, chỉ cho host Storage Supabase trong config. SVG local là hình minh họa do dự án tạo, không phải ảnh sản phẩm thật. Các bucket products/posts/projects/documents công khai: chỉ upload tài liệu đã được duyệt; avatars là private và chưa có UI upload.

Lead API: Zod, honeypot, đồng ý liên hệ, cùng origin, rate limit atomic trong Postgres (4 yêu cầu/15 phút/số điện thoại chuẩn hóa). Chưa có CAPTCHA/IP-based WAF; khi public internet cần cấu hình rate limit ở hosting/WAF để hạn chế spam đổi số. Không lưu lead thành công giả khi thiếu key. Audit không ghi bản sao PII vào log. HTTPS/domain đúng là điều kiện để cookie/auth/origin hoạt động trên production.

Giá/snapshot/payment fields nằm server-side; RLS không cho customer tự ghi đơn/paid. Webhook và checkout chưa được bật. CSP cơ bản, chống iframe, nosniff, referrer/permissions policy được cấu hình. Nội dung text được escape, JSON-LD escape `<`. Không xuất stack trace tùy chỉnh ra UI.

## Kiểm tra

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run check` gộp lint/typecheck/unit+SQL/build. Playwright cần `DEMO_MODE=true`, không có Supabase env và port 3000; config có thể tự khởi động bản production đã build. Screenshot nằm `artifacts/` (gitignore). CI chạy cùng các kiểm tra này.

SQL integration test dùng PostgreSQL WASM (PGlite), dựng auth/storage schemas tối thiểu, chạy migration/seed thật rồi kiểm anonymous/customer/content/sales, quyền role, chu trình danh mục và rate limit. Test này **không thay thế** kiểm thử với Supabase Auth/Storage thật. Cần chạy smoke test staging sau khi cấp credential: login admin, tạo/publish sản phẩm, upload ảnh/PDF, gửi lead, kiểm sales thấy lead và customer không thấy lead.

## Deploy

Chưa deploy remote vì chưa có Supabase/domain/hosting production.

1. Tạo project Supabase riêng, apply migrations và taxonomy seed.
2. Deploy repo lên hosting hỗ trợ Next.js Node runtime (ví dụ Vercel), build `npm run build`; với Node server dùng `npm run start` sau build. Không dùng static export vì cần API/Auth/SSR.
3. Điền env qua secret manager; `DEMO_MODE=false`, site URL đúng HTTPS. Thay mọi ảnh/text demo, thông tin doanh nghiệp và chính sách trước khi public.
4. Cấu hình Auth Site URL tương ứng; cấp admin, thử RBAC/CRUD/lead/upload trên staging.
5. Kiểm robots/sitemap/canonical, test mobile, sau đó nối domain/DNS và Search Console. Sao lưu database theo chính sách vận hành.

Tham khảo nền tảng: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

## Phạm vi tiếp theo

Phase 1 có catalogue, lead và admin thao tác thật khi cấu hình database. Chưa có rich text editor, gallery drag/drop, quản lý FAQ/relations nâng cao, customer self-signup/reset-password, email notification, so sánh/finder, Merchant feed hay analytics gửi sự kiện. Admin editor hiện dùng các nhóm field, danh sách media/specs nhập JSON có validate; có thể nâng lên UI hàng động/tabs sau khi nhập catalogue thực.

Phase 2: triển khai cart/checkout và tạo order transaction với giá tính từ DB, immutable snapshots, COD/chuyển khoản; sau đó payOS tạo link, verify chữ ký raw-body, kiểm amount/currency và xử lý webhook idempotent trong transaction. `PaymentProvider` hiện chỉ là hợp đồng và **fail closed**, không có mock PAID hay API thu tiền. Phase 3: pipeline/activities/quotation. Phase 4: finder/compare/feed/analytics/automation. Không có integration QHS Manager trong repo.
