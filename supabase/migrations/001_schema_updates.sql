-- =====================================================
-- AYUNIV DATABASE SCHEMA UPDATES
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. ADD MISSING COLUMNS TO PRODUCTS TABLE
-- =====================================================

-- Add slug column for SEO-friendly URLs
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add wellness_goals array for filtering
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS wellness_goals TEXT[];

-- Change image_urls from text to text[] (array)
-- First, create a temporary column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_urls_array TEXT[];

-- Copy and convert existing data (if any exists)
UPDATE products 
SET image_urls_array = ARRAY[image_urls] 
WHERE image_urls IS NOT NULL;

-- Drop old column and rename new one
ALTER TABLE products DROP COLUMN IF EXISTS image_urls;
ALTER TABLE products RENAME COLUMN image_urls_array TO image_urls;

-- Add nutrition facts, usage instructions, and ingredient details
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS nutrition_facts JSONB DEFAULT '{
  "calories": 0,
  "sugar": "0g",
  "fiber": "0g",
  "serving_size": "16 fl oz"
}'::jsonb,
ADD COLUMN IF NOT EXISTS usage_instructions TEXT,
ADD COLUMN IF NOT EXISTS ingredient_details JSONB DEFAULT '[]'::jsonb;

-- 2. CREATE INDEX FOR BETTER PERFORMANCE
-- =====================================================

-- Index for slug lookups (products by slug)
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Index for wellness goals (GIN index for array searches)
CREATE INDEX IF NOT EXISTS idx_products_wellness_goals ON products USING GIN(wellness_goals);

-- Index for blog posts slug
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Index for blog posts category
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Index for nutrition facts JSONB queries
CREATE INDEX IF NOT EXISTS idx_products_nutrition_facts ON products USING GIN(nutrition_facts);

-- 3. ADD UPDATED_AT TRIGGER (Auto-update timestamps)
-- =====================================================

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to carts
DROP TRIGGER IF EXISTS update_carts_updated_at ON carts;
CREATE TRIGGER update_carts_updated_at 
    BEFORE UPDATE ON carts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check products table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'products';

-- Success message
SELECT 'Schema migration completed successfully!' as status;
