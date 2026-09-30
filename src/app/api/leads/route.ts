import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { leadSchema } from '@/features/leads/schema';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { site } from '@/config/site';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(site.url).origin)
    return NextResponse.json({ error: 'Nguồn gửi không hợp lệ.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json'))
    return NextResponse.json({ error: 'Định dạng không hợp lệ.' }, { status: 415 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    return NextResponse.json(
      {
        error:
          'Hệ thống chưa kết nối cơ sở dữ liệu. Yêu cầu chưa được lưu; vui lòng liên hệ trực tiếp.',
      },
      { status: 503 },
    );
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > 16000)
      return NextResponse.json({ error: 'Yêu cầu quá lớn.' }, { status: 413 });
    const parsed = leadSchema.safeParse(JSON.parse(body));
    if (!parsed.success)
      return NextResponse.json({ error: 'Vui lòng kiểm tra thông tin biểu mẫu.' }, { status: 400 });
    const db = supabaseAdmin();
    const input = parsed.data;
    const key = createHash('sha256').update(input.phone.replace(/\D/g, '')).digest('hex');
    const { data: allowed, error: rateError } = await db.rpc('consume_rate_limit', {
      p_key: key,
      p_limit: 4,
      p_window_seconds: 900,
    });
    if (rateError || !allowed)
      return NextResponse.json(
        { error: 'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau 15 phút.' },
        { status: 429 },
      );
    const { consent, website, ...lead } = input;
    void website;
    const { error } = await db.from('leads').insert({
      ...lead,
      product_id: lead.product_id || null,
      consent_at: consent ? new Date().toISOString() : null,
      source:
        /google/i.test(lead.utm_source) && /cpc|ppc|paid/i.test(lead.utm_medium)
          ? 'Google Ads'
          : /facebook|fb|meta/i.test(lead.utm_source)
            ? 'Facebook'
            : /organic/i.test(lead.utm_medium) || /google\.|bing\./i.test(lead.referrer)
              ? 'Organic'
              : lead.utm_source
                ? 'Other'
                : lead.referrer && !lead.referrer.startsWith(site.url)
                  ? 'Referral'
                  : 'Direct',
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Không thể lưu yêu cầu. Vui lòng thử lại.' },
      { status: 500 },
    );
  }
}
