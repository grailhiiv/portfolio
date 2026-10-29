create table public.strategy_records (
 id uuid primary key,
 owner_id uuid not null default auth.uid() references auth.users(id),
 draft jsonb not null,
 updated_at timestamptz not null default now(),
 constraint strategy_records_owner_admin check (owner_id = 'dfca1897-93ed-410f-9c74-3aba585d5b70'::uuid)
);
alter table public.strategy_records enable row level security;
grant select, insert, update, delete on public.strategy_records to authenticated;
create policy strategy_records_select on public.strategy_records for select to authenticated using ((select auth.uid()) = owner_id);
create policy strategy_records_insert on public.strategy_records for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy strategy_records_update on public.strategy_records for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy strategy_records_delete on public.strategy_records for delete to authenticated using ((select auth.uid()) = owner_id);
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('strategy-screenshots', 'strategy-screenshots', false, 10485760, array['image/png','image/jpeg','image/webp','image/gif']);
create policy strategy_screenshots_select on storage.objects for select to authenticated using (bucket_id = 'strategy-screenshots' and (select auth.uid()) = 'dfca1897-93ed-410f-9c74-3aba585d5b70'::uuid and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy strategy_screenshots_insert on storage.objects for insert to authenticated with check (bucket_id = 'strategy-screenshots' and (select auth.uid()) = 'dfca1897-93ed-410f-9c74-3aba585d5b70'::uuid and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy strategy_screenshots_update on storage.objects for update to authenticated using (bucket_id = 'strategy-screenshots' and (select auth.uid()) = 'dfca1897-93ed-410f-9c74-3aba585d5b70'::uuid and (storage.foldername(name))[1] = (select auth.uid())::text) with check (bucket_id = 'strategy-screenshots' and (select auth.uid()) = 'dfca1897-93ed-410f-9c74-3aba585d5b70'::uuid and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy strategy_screenshots_delete on storage.objects for delete to authenticated using (bucket_id = 'strategy-screenshots' and (select auth.uid()) = 'dfca1897-93ed-410f-9c74-3aba585d5b70'::uuid and (storage.foldername(name))[1] = (select auth.uid())::text);
