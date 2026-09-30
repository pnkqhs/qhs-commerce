'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { configured, supabaseServer } from '@/lib/supabase/server';
export async function login(_state: { error: string }, form: FormData) {
  if (!configured()) return { error: 'Chưa cấu hình Supabase riêng cho QHS Commerce.' };
  const parsed = z
    .object({ email: z.email(), password: z.string().min(8).max(128) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: 'Nhập email và mật khẩu hợp lệ.' };
  const db = await supabaseServer();
  const { error } = await db.auth.signInWithPassword(parsed.data);
  if (error) return { error: 'Không thể đăng nhập. Kiểm tra thông tin hoặc thử lại sau.' };
  redirect('/tai-khoan');
}
export async function logout() {
  const db = await supabaseServer();
  await db.auth.signOut();
  redirect('/dang-nhap');
}
