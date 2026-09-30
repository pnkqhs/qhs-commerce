import { NextResponse } from 'next/server';
import { configured, supabaseServer } from '@/lib/supabase/server';
import { site } from '@/config/site';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(site.url).origin)
    return NextResponse.json({ error: 'Nguồn gửi không hợp lệ' }, { status: 403 });
  if (!configured()) return NextResponse.json({ error: 'Chưa cấu hình Supabase' }, { status: 503 });
  const db = await supabaseServer();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Cần đăng nhập' }, { status: 401 });
  const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'content'].includes(profile.role))
    return NextResponse.json({ error: 'Không đủ quyền' }, { status: 403 });
  if (Number(request.headers.get('content-length')) > 11 * 1024 * 1024)
    return NextResponse.json({ error: 'Tệp quá lớn' }, { status: 413 });
  try {
    const form = await request.formData();
    const bucket = String(form.get('bucket'));
    const file = form.get('file');
    if (!(file instanceof File) || !['products', 'posts', 'projects', 'documents'].includes(bucket))
      return NextResponse.json({ error: 'Tệp không hợp lệ' }, { status: 400 });
    const types: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
    };
    if (
      !types[file.type] ||
      (bucket === 'documents'
        ? file.type !== 'application/pdf'
        : file.type === 'application/pdf') ||
      file.size > (bucket === 'documents' ? 10 : 5) * 1024 * 1024 ||
      !file.size
    )
      return NextResponse.json({ error: 'Sai định dạng hoặc kích thước tệp' }, { status: 400 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const magic =
      file.type === 'application/pdf'
        ? new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-'
        : file.type === 'image/png'
          ? bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71
          : file.type === 'image/jpeg'
            ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
            : new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' &&
              new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
    if (!magic)
      return NextResponse.json({ error: 'Nội dung tệp không khớp định dạng' }, { status: 400 });
    const path = `${user.id}/${crypto.randomUUID()}.${types[file.type]}`;
    const { error } = await db.storage
      .from(bucket)
      .upload(path, bytes, { contentType: file.type, upsert: false });
    if (error) return NextResponse.json({ error: 'Không thể lưu tệp' }, { status: 400 });
    return NextResponse.json({ url: db.storage.from(bucket).getPublicUrl(path).data.publicUrl });
  } catch {
    return NextResponse.json({ error: 'Không thể xử lý tệp' }, { status: 400 });
  }
}
