import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
test('migrations, seed, RLS, role isolation, rate limiting and integrity', async () => {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create schema storage;
 create table auth.users(id uuid primary key,raw_user_meta_data jsonb not null default '{}');
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
 grant usage on schema public,auth,storage to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated,service_role;`);
  for (const file of readdirSync('supabase/migrations').sort())
    await db.exec(
      readFileSync(`supabase/migrations/${file}`, 'utf8').replace(
        'create extension if not exists pgcrypto;',
        '',
      ),
    );
  await db.exec(readFileSync('supabase/seed.sql', 'utf8'));
  await db.exec(readFileSync('supabase/seed.demo.sql', 'utf8'));
  await db.exec(`grant select,insert,update,delete on all tables in schema public to anon,authenticated,service_role;
 insert into auth.users(id) values('20000000-0000-4000-8000-000000000001'),('20000000-0000-4000-8000-000000000002'),('20000000-0000-4000-8000-000000000003');
 update public.profiles set role='content' where id='20000000-0000-4000-8000-000000000002';
 update public.profiles set role='sales' where id='20000000-0000-4000-8000-000000000003';
 insert into public.products(name,slug,sku,category_id,status) values('Private draft','private-draft','PRIVATE','10000000-0000-4000-8000-000000000006','draft');
 insert into public.leads(name,phone,message) values('Private person','0900000000','Private inquiry');`);
  await db.exec('set role anon');
  assert.equal((await db.query('select * from public.products')).rows.length, 4);
  assert.equal((await db.query('select * from public.leads')).rows.length, 0);
  assert.equal((await db.query('select * from public.profiles')).rows.length, 0);
  await assert.rejects(() =>
    db.exec("insert into public.leads(name,phone,message) values('Bad','090','Bad')"),
  );
  await db.exec(
    "reset role;set role authenticated;select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false)",
  );
  await db.exec("update public.profiles set role='admin' where id=auth.uid()");
  assert.equal(
    (await db.query<{ role: string }>('select role from public.profiles where id=auth.uid()'))
      .rows[0].role,
    'customer',
  );
  assert.equal((await db.query('select * from public.leads')).rows.length, 0);
  await db.exec(
    "select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000002',false)",
  );
  assert.equal((await db.query('select * from public.products')).rows.length, 5);
  assert.equal((await db.query('select * from public.leads')).rows.length, 0);
  await db.exec("update public.products set name='Edited' where sku='PRIVATE'");
  await db.exec(
    "select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000003',false)",
  );
  assert.equal((await db.query('select * from public.leads')).rows.length, 1);
  assert.equal((await db.query('select * from public.products')).rows.length, 4);
  await assert.rejects(() => db.exec("select public.consume_rate_limit('x',4,900)"));
  await db.exec('reset role');
  await assert.rejects(() =>
    db.exec(
      "update public.categories set parent_id='10000000-0000-4000-8000-000000000006' where id='10000000-0000-4000-8000-000000000001'",
    ),
  );
  for (let i = 0; i < 5; i++) {
    const r = await db.query<{ allowed: boolean }>(
      "select public.consume_rate_limit('x',4,900) allowed",
    );
    assert.equal(r.rows[0].allowed, i < 4);
  }
  const tables = await db.query<{ tablename: string; rowsecurity: boolean }>(
    "select tablename,rowsecurity from pg_tables where schemaname='public'",
  );
  assert.ok(tables.rows.length >= 30);
  assert.ok(tables.rows.every((t) => t.rowsecurity));
  await db.close();
});
