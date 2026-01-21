-- =====================================================
-- SIMPLE TEST DATA - 2 Products
-- Run this in Supabase SQL Editor to test
-- =====================================================

-- Clear existing data
TRUNCATE TABLE products CASCADE;

-- PRODUCT 1: Sea Buckthorn Elixir
INSERT INTO products (
    id,
    name,
    slug,
    description,
    price,
    category,
    ingredients,
    benefits,
    image_urls,
    wellness_goals,
    stock_quantity,
    nutrition_facts,
    usage_instructions,
    ingredient_details,
    lifestyle_images
) VALUES (
    gen_random_uuid(),
    'Sea Buckthorn Elixir',
    'sea-buckthorn-elixir',
    'Pure, cold-pressed Sea Buckthorn from the Himalayas. Rich in Omega-7, Vitamin C, and antioxidants.',
    899,
    'Pulp',
    ARRAY['Organic Sea Buckthorn Berries', 'No Preservatives', 'No Added Sugar'],
    ARRAY['Supports skin health', 'Boosts immunity', 'Anti-inflammatory'],
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/sea_buckthorn_pulp_300ml.png',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/sea_buckthorn_pulp_500ml.png'
    ],
    ARRAY['Energy', 'Immunity', 'Skin Health'],
    50,
    '{"calories": 70, "sugar": "12g", "fiber": "2g", "serving_size": "10 fl oz"}'::jsonb,
    'Best consumed on an empty stomach in the morning. Mix 30ml with warm water or drink directly.',
    '[
        {"name": "Organic Sea Buckthorn Berries", "certification": "CERTIFIED ORGANIC"},
        {"name": "Natural Enzymes", "certification": "WILD HARVESTED"}
    ]'::jsonb,
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-hero-1.jpg',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-1.png'
    ]
);

-- PRODUCT 2: Green Goddess Cleanse
INSERT INTO products (
    id,
    name,
    slug,
    description,
    price,
    category,
    ingredients,
    benefits,
    image_urls,
    wellness_goals,
    stock_quantity,
    nutrition_facts,
    usage_instructions,
    ingredient_details,
    lifestyle_images
) VALUES (
    gen_random_uuid(),
    'Green Goddess Cleanse',
    'green-goddess-cleanse',
    'Chlorophyll-rich morning elixir that floods your cells with sunlight energy.',
    1299,
    'Cleanse',
    ARRAY['Spirulina', 'Wheatgrass', 'Moringa', 'Tulsi'],
    ARRAY['Alkalizes the body', 'Gentle detox', 'Natural energy'],
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/demo1.jpg',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/demo2.jpg'
    ],
    ARRAY['Detox', 'Energy', 'Digestion'],
    40,
    '{"calories": 35, "sugar": "4g", "fiber": "3g", "serving_size": "8 fl oz"}'::jsonb,
    'Best consumed first thing in the morning on an empty stomach. Mix 50ml with cold water.',
    '[
        {"name": "Organic Spirulina", "certification": "CERTIFIED ORGANIC"},
        {"name": "Wheatgrass Juice", "certification": "CERTIFIED ORGANIC"},
        {"name": "Moringa Leaf", "certification": "CERTIFIED ORGANIC"},
        {"name": "Tulsi (Holy Basil)", "certification": "WILDCRAFTED"}
    ]'::jsonb,
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-2.png',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-3.png'
    ]
);

-- Verify
SELECT 
    name, 
    slug, 
    price, 
    array_length(image_urls, 1) as num_images,
    array_length(lifestyle_images, 1) as num_lifestyle_images
FROM products 
ORDER BY created_at DESC;
