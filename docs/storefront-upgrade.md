# QHS storefront — 01/10/2026

## Audit and delivery

The configured Commerce database had no published categories, products, brands, posts or projects. The storefront had demo illustrations, incomplete contact/about content, category slugs used as solution URLs, a project-specific empty state on Knowledge, and filters exposed all at once. Existing Auth/RLS/admin architecture is retained.

The updated storefront uses the supplied logo and company-owned photographs, a new homepage composition, product galleries with native modal focus handling, responsive cards, five substantive solution pages, real About/Contact, technical filters derived from available specs, and keyboard-accessible navigation/search. Server Components remain the default. CSS handles motion; a small observer adds off-screen reveal progressively and respects reduced motion. No motion dependency was added.

## Sources and import

- Company and contact source: https://candientuquochung.com/
- Each product/project source URL and curated facts: `src/features/catalog/official.json`.
- Knowledge sources and internal links: `src/features/content/editorial.ts`.
- Solution sources: `src/features/content/solutions.ts`.
- Image provenance: `docs/media-provenance.json`.
- Logo: user supplied `D:/QHS/Design/Logo/Logo.png`; preserved aspect ratio; favicon uses the QHS symbol.

On 01/10/2026, `npx tsx scripts/import-official-content.ts --apply` inserted 35 records: 18 taxonomy nodes, 2 brands, 10 products, 3 projects, 2 knowledge articles. Existing slugs are preserved, without updates or deletes. Prices are null; all products use quote/project consultation. `QHS-WP-*` is an internal import identifier, omitted from public SKU and structured data.

The script loads only this project's `.env.local` credentials. No QHS Manager integration. Run without `--apply` to review prospective inserts. Its report is saved under ignored `artifacts/official-import-result.json`. A second run is safe and inserts no duplicate slugs. No schema migration is necessary.

`scripts/prepare-official-content.py` prepares and caches source data/media (requires Python requests and Pillow); it does not write to the database. Images are WebP, with product images capped at 1200px and photography at 1600px. Review source changes before rerunning preparation/import; source snapshots are ignored in git.

## Indexing and routes

Staging defaults to noindex. `NEXT_PUBLIC_SITE_ENV=production` AND a non-Vercel `NEXT_PUBLIC_SITE_URL` are required to allow indexing. Vercel request hostnames additionally receive `X-Robots-Tag: noindex, follow`, even if a production canonical domain is configured. Admin/CRM retain role checks, noindex/nofollow and sitemap exclusion.

Deployment verification found an absent/localhost site URL. The site config now resolves a missing/local URL to Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (or `VERCEL_URL`) so canonicals, OG URLs and the lead API's trusted origin use the actual deployment domain. An explicit real domain remains authoritative. Keep `NEXT_PUBLIC_SITE_URL=https://qhs-commerce.vercel.app` and `NEXT_PUBLIC_SITE_ENV=staging` in staging settings; use the official domain and `production` only for the later domain launch.

Permanent 308 redirects:

- `/giai-phap/can-ban-lon` → `/giai-phap/nha-may-san-xuat`
- `/giai-phap/can-ban` → `/giai-phap/kho-van-logistics`
- `/giai-phap/dung-cu-nong-san` → `/giai-phap/nong-nghiep-nong-san`

New semantic solutions also include `/giai-phap/tram-can-xe-tai` and `/giai-phap/tram-can-tu-dong`. Canonicals, breadcrumbs, internal links and production sitemap use the new URLs. Staging sitemap is empty. Organization/WebSite/Product/Article/BreadcrumbList and visible solution FAQs use factual fields; no fake Offer or rating is generated. No domain migration was performed.

## Required business data / TODO

- Approved privacy, payment, shipping, returns, warranty and terms policies. Existing policy pages explicitly show pending approval and remain noindex.
- Confirmed prices, stock, variant-specific accuracy/division, delivery scope and warranty terms where source pages do not provide them.
- Product manuals, videos and verified accessory compatibility. Unsupported sections stay hidden.
- Project acceptance dates, publicly shareable customer names and measurable outcomes. Source publication dates are not presented as completion dates.
- Verified social links if desired.
- The old website contains conflicting experience/project/customer counters. None are imported. No invented certifications, reviews or statistics.

## Verification

`npm run check` covers ESLint, Next type generation/TypeScript, unit/database tests and production build. Real-data browser checks: set `QHS_TEST_REAL_DATA=1` and optionally `PLAYWRIGHT_BASE_URL`, then run `npm run test:e2e`. Default CI retains isolated demo tests; valid form submission is mocked to avoid creating test leads in the company database.

Browser tests cover homepage, catalogue, product, solution, About, Contact, Knowledge and Project at 1440/1280/768/390px; horizontal overflow; reveal visibility; reduced motion; gallery keyboard/focus return; menu Escape; redirects; search; private-route redirect; noindex; and invalid API origin. Screenshots are local under `artifacts/visual-*`.

Local browser timing is a lab observation, not a Core Web Vitals field score. Recheck production field data after traffic is available.

Final local production lab observations: desktop 1440px LCP 468ms, mobile 390px LCP 500ms; CLS 0 at both sizes; initial encoded JS 147,830 bytes; initial images 203,310 / 81,144 bytes respectively. All official media together is approximately 2,006 KiB (loaded selectively with responsive image sizes). No broken loaded images or page errors were observed. Run `node scripts/audit-storefront.mjs` against the production server to refresh observations; output is in `artifacts/performance-audit.json`.

Production 404 regression: the root loading boundary caused React #419 when an asynchronous catalogue lookup returned not-found. Removed that global skeleton boundary and scoped the not-found UI to the storefront. Unknown catalogue routes now return HTTP 404 without client recovery errors; authorized page content and private-route redirects still pass browser tests.

First post-deploy remote probe: LCP 8.58s desktop and 1.73s mobile, CLS 0, no broken images or page errors. This first desktop request included cold deployment/image-cache costs; it is not a field score or evidence of a sustained performance target. Monitor cold-cache behavior and production Core Web Vitals before the official domain launch.
