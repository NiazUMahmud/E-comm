-- Run this in your Supabase SQL editor to set up the database schema

-- ─── Profiles ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- is_admin() uses SECURITY DEFINER to bypass RLS and avoid infinite recursion
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select public.is_admin()
$$;

create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Categories ───────────────────────────────────────────────────────────────
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
create policy "Categories are publicly visible" on public.categories for select using (true);
create policy "Only admins can manage categories"
  on public.categories for all using (
    public.is_admin()
  );

-- ─── Subcategories ────────────────────────────────────────────────────────────
create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories on delete cascade not null,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now()
);

alter table public.subcategories enable row level security;
create policy "Subcategories are publicly visible" on public.subcategories for select using (true);
create policy "Only admins can manage subcategories"
  on public.subcategories for all using (
    public.is_admin()
  );

-- ─── Products ─────────────────────────────────────────────────────────────────
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  images text[] not null default '{}',
  category text not null,
  subcategory text,
  brand text not null,
  stock integer not null default 0,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  featured boolean not null default false,
  tags text[] not null default '{}',
  specifications jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "Products are publicly visible" on public.products for select using (true);
create policy "Only admins can manage products"
  on public.products for all using (
    public.is_admin()
  );

-- ─── Orders ───────────────────────────────────────────────────────────────────
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete set null,
  status text not null default 'pending'
    check (status in ('pending','processing','shipped','delivered','cancelled')),
  subtotal numeric(10,2) not null,
  tax numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_address jsonb not null,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users can create orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select using (
    public.is_admin()
  );

create policy "Admins can update orders"
  on public.orders for update using (
    public.is_admin()
  );

-- ─── Order Items ──────────────────────────────────────────────────────────────
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  name text not null,
  price numeric(10,2) not null,
  quantity integer not null,
  image text not null,
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

create policy "Users can view their own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Users can create order items"
  on public.order_items for insert with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Admins can view all order items"
  on public.order_items for select using (
    public.is_admin()
  );

-- ─── Seed data ────────────────────────────────────────────────────────────────
insert into public.categories (name, slug, icon) values
  ('Electronics', 'electronics', 'Smartphone'),
  ('Fashion', 'fashion', 'Shirt'),
  ('Home & Garden', 'home-garden', 'Home'),
  ('Sports & Outdoors', 'sports-outdoors', 'Bike');

insert into public.products (name, description, price, original_price, images, category, subcategory, brand, stock, rating, review_count, featured, tags, specifications) values
  ('iPhone 15 Pro', 'The most advanced iPhone yet, featuring the powerful A17 Pro chip and titanium design.', 999, 1099,
   ARRAY['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
   'Electronics', 'Smartphones', 'Apple', 50, 4.8, 1247, true,
   ARRAY['smartphone','apple','pro','titanium'],
   '{"Screen Size":"6.1 inches","Storage":"128GB","Color":"Natural Titanium","Camera":"48MP Main"}'),

  ('MacBook Air M2', 'Supercharged by the next-generation M2 chip with incredible performance and 18-hour battery life.', 1199, null,
   ARRAY['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg'],
   'Electronics', 'Laptops', 'Apple', 25, 4.9, 892, true,
   ARRAY['laptop','apple','m2','portable'],
   '{"Screen Size":"13.6 inches","Processor":"Apple M2","Memory":"8GB","Storage":"256GB SSD"}'),

  ('Sony WH-1000XM5', 'Industry-leading noise cancellation with premium sound quality and all-day comfort.', 399, 449,
   ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
   'Electronics', 'Audio', 'Sony', 100, 4.7, 2156, false,
   ARRAY['headphones','wireless','noise-canceling'],
   '{"Battery Life":"30 hours","Connectivity":"Bluetooth 5.2","Weight":"250g","Driver Size":"30mm"}'),

  ('Classic Denim Jacket', 'Timeless denim jacket crafted from premium cotton with a vintage-inspired wash.', 89, null,
   ARRAY['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'],
   'Fashion', 'Men''s Clothing', 'Urban Style', 75, 4.4, 324, false,
   ARRAY['jacket','denim','casual','vintage'],
   '{"Material":"100% Cotton","Fit":"Regular","Care":"Machine wash cold","Origin":"Made in USA"}'),

  ('Modern Office Chair', 'Ergonomic office chair with lumbar support and adjustable height for all-day comfort.', 299, 349,
   ARRAY['https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg'],
   'Home & Garden', 'Furniture', 'WorkSpace Pro', 30, 4.6, 567, true,
   ARRAY['chair','office','ergonomic','adjustable'],
   '{"Material":"Mesh back, fabric seat","Weight Capacity":"300 lbs","Height Range":"42-46 inches","Warranty":"5 years"}'),

  ('Yoga Mat Premium', 'Non-slip yoga mat made from eco-friendly TPE material, perfect for all types of yoga.', 45, null,
   ARRAY['https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg'],
   'Sports & Outdoors', 'Fitness', 'ZenFlow', 200, 4.5, 743, false,
   ARRAY['yoga','mat','exercise','eco-friendly'],
   '{"Material":"TPE","Thickness":"6mm","Size":"72\" x 24\"","Weight":"2.5 lbs"}');
