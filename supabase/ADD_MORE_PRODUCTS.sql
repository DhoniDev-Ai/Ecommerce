-- =====================================================
-- ADD MORE PRODUCTS IN SAME CATEGORIES
-- Run this to see related products working
-- =====================================================

-- Add 2 more Wellness products
INSERT INTO products (
    id, name, slug, description, price, category,
    ingredients, benefits, image_urls, wellness_goals,
    stock_quantity, nutrition_facts, usage_instructions, ingredient_details, lifestyle_images
) VALUES 
(
    gen_random_uuid(),
    'Golden Turmeric Blend',
    'golden-turmeric-blend',
    'Anti-inflammatory golden milk base with turmeric, black pepper, and coconut. Ancient Ayurvedic wisdom.',
    999,
    'Wellness',
    ARRAY['Organic Turmeric', 'Black Pepper', 'Coconut Milk', 'Cinnamon'],
    ARRAY['Anti-inflammatory', 'Supports joint health', 'Aids digestion'],
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/sea_buckthorn_pulp_300ml.png',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/sea_buckthorn_pulp_300ml_1.png'
    ],
    ARRAY['Inflammation', 'Immunity', 'Digestion'],
    45,
    '{"calories": 55, "sugar": "6g", "fiber": "1g", "serving_size": "8 fl oz"}'::jsonb,
    'Mix 1 tablespoon with warm milk or water. Best enjoyed in the evening.',
    '[
        {"name": "Organic Turmeric Root", "certification": "CERTIFIED ORGANIC"},
        {"name": "Black Pepper Extract", "certification": "WILDCRAFTED"},
        {"name": "Coconut Milk Powder", "certification": "CERTIFIED ORGANIC"}
    ]'::jsonb,
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/productdetail/landscape_1.png'
    ]
),
(
    gen_random_uuid(),
    'Adaptogen Power Mix',
    'adaptogen-power-mix',
    'Stress-fighting adaptogens including ashwagandha, rhodiola, and maca. Build resilience naturally.',
    1399,
    'Wellness',
    ARRAY['Ashwagandha', 'Rhodiola', 'Maca Root', 'Reishi Mushroom'],
    ARRAY['Reduces stress', 'Enhances focus', 'Boosts energy'],
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/duo_shecare.png',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/shecare_closup_duo.png'
    ],
    ARRAY['Stress Relief', 'Energy', 'Focus'],
    30,
    '{"calories": 40, "sugar": "5g", "fiber": "2g", "serving_size": "10 fl oz"}'::jsonb,
    'Take 30ml daily. Can be mixed with smoothies or taken directly.',
    '[
        {"name": "Ashwagandha Root Extract", "certification": "CERTIFIED ORGANIC"},
        {"name": "Rhodiola Rosea", "certification": "WILDCRAFTED"},
        {"name": "Maca Root Powder", "certification": "CERTIFIED ORGANIC"},
        {"name": "Reishi Mushroom", "certification": "CERTIFIED ORGANIC"}
    ]'::jsonb,
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/productdetail/landscape_2.png'
    ]
);

-- Verify we have products in same categories now
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category
ORDER BY product_count DESC;
