-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- DATA TYPES --

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');

-- TABLES --

-- 1. Users (Syncs with auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  phone text,
  role public.user_role default 'customer'::public.user_role,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.users enable row level security;

-- 2. Products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  category text not null,
  ingredients text[], 
  benefits text[],
  image_urls text[],
  stock_quantity integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.products enable row level security;

-- 3. Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete set null,
  total_amount decimal(10,2) not null,
  status public.order_status default 'pending'::public.order_status not null,
  payment_status public.payment_status default 'pending'::public.payment_status not null,
  shipping_address jsonb, -- Stores snapshot of address
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.orders enable row level security;

-- 4. Order Items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  price_at_purchase decimal(10,2) not null -- Snapshot of price
);
alter table public.order_items enable row level security;

-- 5. Carts
create table public.carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique, -- One cart per user
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.carts enable row level security;

-- 6. Cart Items
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  cart_id uuid references public.carts(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer default 1 not null,
  unique(cart_id, product_id)
);
alter table public.cart_items enable row level security;


-- RLS POLICIES --

-- Users
create policy "Users can view their own profile" 
  on public.users for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.users for update 
  using (auth.uid() = id);

-- Products
create policy "Products are viewable by everyone" 
  on public.products for select 
  using (true);

create policy "Admins can insert products" 
  on public.products for insert 
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update products" 
  on public.products for update 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can delete products" 
  on public.products for delete 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Orders
create policy "Users can view their own orders" 
  on public.orders for select 
  using (auth.uid() = user_id);

create policy "Admins can view all orders" 
  on public.orders for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update orders" 
  on public.orders for update 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Order Items
create policy "Users can view their own order items" 
  on public.order_items for select 
  using (exists (select 1 from public.orders where id = public.order_items.order_id and user_id = auth.uid()));

create policy "Admins can view all order items" 
  on public.order_items for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Carts
create policy "Users can view their own cart" 
  on public.carts for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own cart" 
  on public.carts for insert 
  with check (auth.uid() = user_id);

-- Cart Items
create policy "Users can view their own cart items" 
  on public.cart_items for select 
  using (exists (select 1 from public.carts where id = public.cart_items.cart_id and user_id = auth.uid()));

create policy "Users can insert/update/delete their own cart items" 
  on public.cart_items for all
  using (exists (select 1 from public.carts where id = public.cart_items.cart_id and user_id = auth.uid()));


-- STORAGE --
-- Note: You must manually create a bucket named 'product-images' in Supabase Dashboard -> Storage
-- OR run the following if you have permissions:
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict do nothing;

create policy "Product images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Admins can upload product images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' and exists (select 1 from public.users where id = auth.uid() and role = 'admin') );

create policy "Admins can delete product images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and exists (select 1 from public.users where id = auth.uid() and role = 'admin') );


-- FUNCTIONS & TRIGGERS --

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  
  -- Create a cart for the new user immediately
  insert into public.carts (user_id) values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables with that column
create trigger update_users_updated_at before update on public.users for each row execute procedure update_updated_at_column();
create trigger update_products_updated_at before update on public.products for each row execute procedure update_updated_at_column();
create trigger update_orders_updated_at before update on public.orders for each row execute procedure update_updated_at_column();
create trigger update_carts_updated_at before update on public.carts for each row execute procedure update_updated_at_column();
