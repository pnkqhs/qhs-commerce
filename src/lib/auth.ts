import 'server-only';
import { redirect } from 'next/navigation';
import { configured, supabaseServer } from './supabase/server';
export async function requireRole(roles: string[]) {
  if (!configured()) redirect('/dang-nhap?setup=1');
  const db = await supabaseServer();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect('/dang-nhap');
  const { data } = await db.from('profiles').select('role,full_name').eq('id', user.id).single();
  if (!data || !roles.includes(data.role)) redirect('/forbidden');
  return { db, user, profile: data };
}
