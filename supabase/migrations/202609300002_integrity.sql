begin;
-- Serialize category graph edits to prevent concurrent cycles.
create function public.prevent_category_cycle() returns trigger language plpgsql set search_path='' as $$
begin
  perform pg_advisory_xact_lock(7392851);
  if new.parent_id is not null and exists (
    with recursive ancestors as (
      select id,parent_id from public.categories where id=new.parent_id
      union select c.id,c.parent_id from public.categories c join ancestors a on c.id=a.parent_id
    ) select 1 from ancestors where id=new.id
  ) then raise exception 'Category cycle is not allowed'; end if;
  return new;
end; $$;
create trigger category_cycle before insert or update of parent_id on public.categories for each row execute function public.prevent_category_cycle();
-- Protect order snapshots once created; payment and fulfillment evolve separately.
create function public.protect_order_item() returns trigger language plpgsql set search_path='' as $$ begin raise exception 'Order item snapshots are immutable'; end; $$;
create trigger immutable_order_item before update on public.order_items for each row execute function public.protect_order_item();
create sequence public.order_number_seq;
create function public.next_order_number() returns text language sql set search_path='' as $$ select 'QHS-'||extract(year from now())::text||'-'||lpad(nextval('public.order_number_seq')::text,6,'0'); $$;
revoke all on function public.next_order_number() from public,anon,authenticated;
grant execute on function public.next_order_number() to service_role;
alter table public.orders alter column order_number set default public.next_order_number();
commit;
