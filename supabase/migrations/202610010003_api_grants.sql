-- QHS Commerce: table privileges are required in addition to RLS policies.
-- Additive repair: does not delete data or disable/change RLS.
begin;

grant usage on schema public to anon, authenticated, service_role;

grant select on table
  public.categories, public.brands, public.products,
  public.product_variants, public.related_products,
  public.posts, public.post_categories, public.pages,
  public.projects, public.project_products, public.faqs
to anon;

grant select, insert, update, delete on all tables in schema public
to authenticated, service_role;

grant usage, select on sequence public.order_number_seq to service_role;

-- Authenticated grants remain constrained by the existing role/ownership RLS.
-- No anonymous table writes or access to private CRM tables is granted here.
notify pgrst, 'reload schema';
commit;
