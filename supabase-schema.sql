-- Tabela de invoices
create table invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  number text not null,
  date date not null,
  due_date date,
  client_name text not null,
  client_address text,
  client_email text,
  notes text,
  items jsonb default '[]',
  discount numeric default 0,
  shipping numeric default 0,
  paid boolean default false,
  created_at timestamptz default now()
);

-- Tabela de perfil
create table profiles (
  id uuid primary key references auth.users,
  name text,
  abn text,
  email text,
  phone text,
  bsb text,
  account_number text,
  account_name text,
  bank_name text
);

-- Row Level Security (só a Larissa vê os dados dela)
alter table invoices enable row level security;
alter table profiles enable row level security;

create policy "usuario ve suas invoices"
  on invoices for all
  using (auth.uid() = user_id);

create policy "usuario ve seu perfil"
  on profiles for all
  using (auth.uid() = id);
