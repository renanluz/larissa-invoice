-- Só roda isso se você JÁ executou o supabase-schema.sql antes.
-- Se ainda não criou as tabelas, ignore este arquivo e rode supabase-schema.sql direto.

alter table invoices add column if not exists discount numeric default 0;
alter table invoices add column if not exists shipping numeric default 0;
