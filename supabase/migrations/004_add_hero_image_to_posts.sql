-- =====================================================
-- ADD HERO IMAGE TO POSTS TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add hero_image_url column for detail page hero (16:9)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Update existing posts with hero images
UPDATE posts 
SET hero_image_url = 'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/productdetail/landscape_1.png'
WHERE slug = 'blood-purifiers-guide';

UPDATE posts 
SET hero_image_url = 'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/productdetail/landscape_2.png'
WHERE slug = 'alchemy-of-sea-buckthorn';

UPDATE posts 
SET hero_image_url = 'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/productdetail/landscape_1.png'
WHERE slug = 'morning-rituals-vitality';

-- Verify the update
SELECT slug, image_url, hero_image_url 
FROM posts 
ORDER BY published_at DESC;
