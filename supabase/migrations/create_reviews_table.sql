-- Create a table for storing product reviews and testimonials
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid references public.products(id) on delete cascade, 
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  author_name text, -- For manual testimonials or if user profile is missing
  is_approved boolean default false, -- Moderation flag
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policy: Public can view approved reviews
create policy "Public can view approved reviews"
on public.reviews for select
using (is_approved = true);

-- Policy: Users can insert their own reviews (initially not approved)
create policy "Users can create reviews"
on public.reviews for insert
with check (true);

-- Policy: Admins can do everything (assuming service role or admin flag, for now simplified)
-- create policy "Admins can manage all" ... (Pending admin role setup)
