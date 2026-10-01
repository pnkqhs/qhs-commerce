import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function proxy(request: NextRequest) {
  function next() {
    const response = NextResponse.next({ request });
    if (request.nextUrl.hostname.endsWith('.vercel.app'))
      response.headers.set('X-Robots-Tag', 'noindex, follow');
    if (/^\/(admin|crm)(\/|$)/.test(request.nextUrl.pathname))
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  let response = next();
  if (!/^\/(admin|crm|tai-khoan|dang-nhap)(\/|$)/.test(request.nextUrl.pathname)) return response;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    return response;
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = next();
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  await client.auth.getClaims();
  return response;
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|images/).*)'],
};
