# 🗄️ Supabase Database Migration Guide

## Quick Start
Run these 3 SQL files in order in your Supabase SQL Editor.

---

## Step 1: Update Schema
📁 File: `001_schema_updates.sql`

**What it does:**
- Adds `slug` column for SEO URLs
- Adds `wellness_goals` array for filtering
- Converts `image_urls` to array format
- Creates performance indexes
- Adds auto-update triggers

**How to run:**
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in left sidebar
3. Create new query
4. Copy/paste entire `001_schema_updates.sql` file
5. Click **RUN**

✅ You should see: "Schema migration completed successfully!"

---

## Step 2: Insert Product Data
📁 File: `002_seed_products.sql`

**What it does:**
- Inserts 7 Ayuniv products with all metadata
- Includes images, pricing, wellness goals
- Stock quantities set

**Products added:**
1. Sea Buckthorn Pulp 300ml - ₹899
2. Sea Buckthorn Pulp 500ml - ₹1499
3. Duo SheCare Wellness Set - ₹2199
4. Green Goddess Cleanse - ₹1299
5. Heromi Immunity Blend - ₹999
6. Cholesterol Care Juice - ₹1399
7. Diabetic Wellness Formula - ₹1499

**How to run:**
1. In SQL Editor, create new query
2. Copy/paste entire `002_seed_products.sql`
3. Click **RUN**

✅ You should see: "Product data seeded successfully! Total products: 7"

---

## Step 3: Insert Blog Posts
📁 File: `003_seed_posts.sql`

**⚠️ IMPORTANT:** Before running, you need your `author_id`

### Get your User ID:
```sql
SELECT id FROM auth.users LIMIT 1;
```

Copy the returned UUID and replace `'YOUR_USER_ID_HERE'` in the SQL file.

**What it does:**
- Inserts 4 blog posts with rich content
- Matches journal page structure

**How to run:**
1. Get your user ID (query above)
2. Find/replace `YOUR_USER_ID_HERE` with your actual UUID
3. Copy/paste modified SQL
4. Click **RUN**

✅ You should see: "Blog posts seeded successfully! Total posts: 4"

---

## Verify Everything Worked

Run these verification queries:

```sql
-- Check products
SELECT name, slug, price, wellness_goals 
FROM products 
ORDER BY name;

-- Check blog posts
SELECT title, slug, category 
FROM posts 
ORDER BY published_at DESC;

-- Count everything
SELECT 
    (SELECT COUNT(*) FROM products) as product_count,
    (SELECT COUNT(*) FROM posts) as post_count;
```

Expected results:
- `product_count`: 7
- `post_count`: 4

---

## Troubleshooting

### Error: "column already exists"
- Safe to ignore if re-running script
- The `IF NOT EXISTS` clauses handle this

### Error: "relation does not exist"
- Check that your tables were created in Supabase initially
- Review your schema setup

### Products not showing images
- Verify image files exist in `/public/assets/`
- Check image paths match exactly

---

## Next Steps
Once data migration is complete:
1. ✅ Test connection with Supabase client
2. ✅ Replace mock data in frontend
3. ✅ Verify pages load correctly

See `implementation_plan.md` for full integration roadmap.
