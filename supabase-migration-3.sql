-- Clientes salvos
create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  address text,
  email text,
  created_at timestamptz default now()
);

-- Itens salvos (templates de serviço)
create table item_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  description text not null,
  rate numeric,
  has_date boolean default false,
  created_at timestamptz default now()
);

alter table clients enable row level security;
alter table item_templates enable row level security;

create policy "usuario ve seus clientes"
  on clients for all
  using (auth.uid() = user_id);

create policy "usuario ve seus itens salvos"
  on item_templates for all
  using (auth.uid() = user_id);
