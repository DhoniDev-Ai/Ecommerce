-- =====================================================
-- NEW PRODUCT - Himalayan Wellness Blend
-- Run this in Supabase SQL Editor
-- =====================================================

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
    'Himalayan Wellness Blend',
    'himalayan-wellness-blend',
    'A harmonious blend of ancient Himalayan herbs and berries. Rich in antioxidants and designed to support your daily wellness journey.',
    1499,
    'Wellness',
    ARRAY['Himalayan Sea Buckthorn', 'Ashwagandha Root', 'Tulsi Leaves', 'Amla Berry', 'Ginger Root'],
    ARRAY['Supports immunity', 'Reduces stress', 'Rich in antioxidants', 'Enhances vitality'],
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/shecare_closup_duo.png',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/duo_shecare_2.png',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/duo_shecare.png'
    ],
    ARRAY['Immunity', 'Vitality', 'Stress Relief'],
    35,
    '{"calories": 45, "sugar": "8g", "fiber": "3g", "serving_size": "12 fl oz"}'::jsonb,
    'Take 30ml daily on an empty stomach. Can be mixed with warm water or consumed directly. Best enjoyed in the morning.',
    '[
        {"name": "Himalayan Sea Buckthorn", "certification": "WILDCRAFTED"},
        {"name": "Organic Ashwagandha Root", "certification": "CERTIFIED ORGANIC"},
        {"name": "Tulsi (Holy Basil)", "certification": "CERTIFIED ORGANIC"},
        {"name": "Amla Berry Extract", "certification": "WILDCRAFTED"},
        {"name": "Fresh Ginger Root", "certification": "CERTIFIED ORGANIC"}
    ]'::jsonb,
    ARRAY[
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/productdetail/landscape_1.png',
        'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/productdetail/landscape_2.png'
    ]
);

-- Verify insertion
SELECT 
    name, 
    slug, 
    price, 
    array_length(image_urls, 1) as num_images,
    array_length(lifestyle_images, 1) as num_lifestyle_images,
    jsonb_array_length(ingredient_details) as num_ingredient_details
FROM products 
WHERE slug = 'himalayan-wellness-blend';
