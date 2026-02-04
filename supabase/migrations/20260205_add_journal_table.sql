-- 1. Create posts table safely
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null,
  excerpt text,
  content text, 
  category text,
  image_url text,
  hero_image_url text, 
  published_at timestamptz default now(),
  author_id uuid references auth.users(id),
  related_product_id uuid references public.products(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(slug)
);

-- OPTIONAL: If table already exists, run this to add the column manually:
-- ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS related_product_id uuid references public.products(id) on delete set null;

-- 2. Enable RLS
alter table public.posts enable row level security;

-- 3. Policies (Drop existing to avoid conflicts)
drop policy if exists "Public can view posts" on public.posts;
create policy "Public can view posts" on public.posts for select using (true);

drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts" on public.posts for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts" on public.posts for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts" on public.posts for delete using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- 4. Seed Data (Sea Buckthorn Blogs)
-- Upsert based on slug

INSERT INTO public.posts (title, slug, category, published_at, image_url, excerpt, content)
VALUES 
(
  'What is Sea Buckthorn? The Himalayan Wonder Berry', 
  'what-is-sea-buckthorn', 
  'Health', 
  NOW(), 
  '/assets/sea_hero.png',
  'Sea buckthorn is a natural fruit that resembles small, orange berries and is primarily found in the Himalayan regions.',
  '<p>Sea buckthorn is a natural fruit that resembles small, orange berries and is primarily found in the Himalayan regions. This fruit is known for its nutritional value. It contains vitamin C, antioxidants, and beneficial fatty acids, which help strengthen the body from within. Sea buckthorn is used in the form of juice, oil, and supplements and is considered beneficial for immunity, digestion, skin health, and energy levels.</p>
   <h2>Top 10 Amazing Health Benefits of Sea Buckthorn Juice</h2>
   <p>In today''s fast-paced, stressful, and irregular lifestyle, the body needs natural support more than ever. Sea buckthorn juice is one such natural beverage that works gradually and deeply on the body without any artificial ingredients or immediate side effects.</p>
   <h3>1. Strengthens the Body''s Immune System</h3>
   <p>Many people today fall ill easily without any major reason. The main reason for this is a weak immune system. Sea buckthorn juice naturally contains Vitamin C and antioxidants, which strengthen the body''s defense system from within.</p>
   <h3>2. Balances and Soothes the Digestive System</h3>
   <p>Stomach problems are common in almost every other person today. Sea buckthorn juice is considered light and easily digestible for the stomach.</p>
   <h3>3. Helps Maintain Long-Term Heart Health</h3>
   <p>Heart-related problems are no longer limited to older people. The beneficial fatty acids found in sea buckthorn juice are considered good for the heart.</p>
   <h3>4. Provides natural radiance by nourishing the skin from within</h3>
   <p>Sea buckthorn juice nourishes skin cells from the inside. It helps maintain moisture in the skin, reducing dryness and dullness.</p>
   <h3>5. Helps reduce inflammation and pain in the body</h3>
   <p>Sometimes, the body experiences pain, stiffness, or heaviness even without any injury. This can be a sign of internal inflammation.</p>
   <h3>6. Helps cleanse the liver and enhance its function</h3>
   <p>The liver is the body''s main filter, responsible for removing toxins from the body. Sea buckthorn juice supports the liver and aids in its natural cleansing process.</p>
   <h3>7. Provides sustained energy to the body and reduces weakness</h3>
   <p>If you feel tired throughout the day without much physical exertion, it could be a sign of nutritional deficiencies. Sea buckthorn juice provides the body with sustained energy.</p>
   <h3>8. Helps maintain eye health</h3>
   <p>The nutrients in sea buckthorn juice nourish the eye cells and help reduce fatigue.</p>
   <h3>9. Supports blood sugar balance</h3>
   <p>Sea buckthorn juice helps improve the body''s metabolism.</p>
   <h3>10. Balances and strengthens the entire body from within</h3>
   <p>The biggest advantage of sea buckthorn juice is that it works not on a single organ, but on the entire body.</p>
   <hr/>
   <h3>How to Use</h3>
   <p>Consuming 5 to 10 ml of sea buckthorn juice daily is considered sufficient. It is best to mix it with water and drink it on an empty stomach in the morning.</p>'
),
(
  'Where is Sea Buckthorn Found? Origins & Benefits', 
  'where-is-sea-buckthorn-found', 
  'Wellness', 
  NOW() - interval '1 day', 
  '/assets/sea_hero.png',
  'Sea buckthorn is a fruit that many people are still unaware of, even though it has been growing naturally in India for a very long time.',
  '<p>Sea buckthorn is a fruit that many people are still unaware of, even though it has been growing naturally in India for a very long time. It is a small, bright orange fruit that grows on a thorny bush.</p>
   <p>In India, sea buckthorn is primarily found in high-altitude regions such as Ladakh, Himachal Pradesh, and Arunachal Pradesh. These areas are characterized by extreme cold, rocky soil, and thin air. Most plants cannot survive in such conditions, but sea buckthorn thrives.</p>
   <h3>Sea Buckthorn Benefits</h3>
   <p>Nowadays, people are gradually returning to natural and traditional remedies. Sea buckthorn is one such natural fruit that has been known and used in mountainous regions for centuries.</p>
   <h4>1. Strengthens the Immune System</h4>
   <p>The most well-known benefit of sea buckthorn is its ability to support immunity. It is naturally very high in Vitamin C.</p>
   <h4>2. Improves the Digestive System</h4>
   <p>Poor digestion is one of the most common problems today. When taken regularly, it makes the stomach feel lighter and gradually reduces digestive problems.</p>
   <h4>3. Supports Heart Health</h4>
   <p>Heart diseases are no longer limited to the elderly. Natural fatty acids found in sea buckthorn nourish the heart.</p>
   <h4>4. Makes the skin healthy and radiant from within</h4>
   <p>Sea buckthorn is often called the "beauty fruit." This is due to its profound effect on the skin.</p>
   <h4>5. Reduces inflammation and pain in the body</h4>
   <p>Chronic inflammation can cause many health problems. Sea buckthorn soothes internal inflammation in the body.</p>
   <h4>6. Improves liver health</h4>
   <p>The liver is the body''s main detoxification organ. Sea buckthorn supports the liver''s natural cleansing process.</p>
   <h4>Conclusion</h4>
   <p>Sea buckthorn is not an ordinary fruit. It is a precious gift of nature, which offers numerous benefits.</p>'
)
ON CONFLICT (slug) DO UPDATE 
SET 
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  image_url = EXCLUDED.image_url;
