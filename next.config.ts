import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/giai-phap/can-ban-lon',
        destination: '/giai-phap/nha-may-san-xuat',
        permanent: true,
      },
      {
        source: '/giai-phap/can-ban',
        destination: '/giai-phap/kho-van-logistics',
        permanent: true,
      },
      {
        source: '/giai-phap/dung-cu-nong-san',
        destination: '/giai-phap/nong-nghiep-nong-san',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: 'https',
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...(process.env.NEXT_PUBLIC_SITE_ENV !== 'production' ||
          (process.env.NEXT_PUBLIC_SITE_URL || '').includes('.vercel.app')
            ? [{ key: 'X-Robots-Tag', value: 'noindex, follow' }]
            : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
