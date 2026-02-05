-- Ensure a user can only review a product once
alter table public.reviews
add constraint reviews_user_product_unique unique (user_id, product_id);

-- Add updated_at column for editing support
alter table public.reviews
add column updated_at timestamp with time zone default timezone('utc'::text, now());

-- Add trigger for updated_at
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.reviews
  for each row execute procedure moddatetime (updated_at);
