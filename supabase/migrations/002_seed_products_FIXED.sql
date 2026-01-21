-- =====================================================
-- AYUNIV PRODUCT DATA - COMPLETE WITH NUTRITION
-- Run this AFTER 001_schema_updates.sql
-- =====================================================

-- Clear existing data (CAUTION: This deletes all products)
TRUNCATE TABLE products CASCADE;

-- PRODUCT 1: Sea Buckthorn Pulp 300ml
INSERT INTO products (
    id, name, slug, description, price, category, ingredients, benefits,
    image_urls, wellness_goals, stock_quantity,
    nutrition_facts, ingredient_details, usage_instructions
) VALUES (
    gen_random_uuid(),
    'Sea Buckthorn Pulp 300ml',
    'sea-buckthorn-pulp-300ml',
    'Pure, cold-pressed Sea Buckthorn from the Himalayas. Rich in Omega-7, Vitamin C, and antioxidants.',
    899,
    'Pulp',
    '{Organic Sea Buckthorn Berries (100%), No Preservatives, No Added Sugar}',
    '{Supports skin health and hydration, Boosts immunity with 12x Vitamin C, Rare Omega-7 for mucosal lining repair, Anti-inflammatory properties}',
    ARRAY['/assets/sea_buckthorn_pulp_300ml.png', '/assets/sea_buckthorn_pulp_300ml_1.png'],
    ARRAY['Energy', 'Immunity', 'Skin Health'],
    50,
    '{"calories": 70, "sugar": "12g", "fiber": "2g", "serving_size": "10 fl oz"}'::jsonb,
    '[
        {"name": "Organic Sea Buckthorn Berries", "certification": "CERTIFIED ORGANIC"},
        {"name": "Natural Fruit Sugars", "certification": ""}
    ]'::jsonb,
    'Best consumed on an empty stomach in the morning. Mix 30ml with warm water or drink directly.'
);

-- PRODUCT 2: Sea Buckthorn Pulp 500ml
INSERT INTO products (
    id, name, slug, description, price, category, ingredients, benefits,
    image_urls, wellness_goals, stock_quantity,
    nutrition_facts, ingredient_details, usage_instructions
) VALUES (
    gen_random_uuid(),
    'Sea Buckthorn Pulp 500ml',
    'sea-buckthorn-pulp-500ml',
    'Premium cold-pressed Sea Buckthorn nectar in our larger 500ml format. Perfect for daily rituals.',
    1499,
    'Pulp',
    '{Organic Sea Buckthorn Berries (100%), Cold-Pressed}',
    '{High concentration of Omega-7 fatty acids, Supports digestive health, Natural energy without caffeine, Cellular hydration from within}',
    ARRAY['/assets/sea_buckthorn_pulp_500ml.png'],
    ARRAY['Energy', 'Immunity', 'Digestion'],
    30,
    '{"calories": 70, "sugar": "12g", "fiber": "2g", "serving_size": "10 fl oz"}'::jsonb,
    '[
        {"name": "Organic Sea Buckthorn Berries", "certification": "CERTIFIED ORGANIC"}
    ]'::jsonb,
    'Shake well before use. Consume 30-60ml daily, preferably in the morning.'
);

-- PRODUCT 3: Duo SheCare
INSERT INTO products (
    id, name, slug, description, price, category, ingredients, benefits,
    image_urls, wellness_goals, stock_quantity,
    nutrition_facts, ingredient_details, usage_instructions
) VALUES (
    gen_random_uuid(),
    'Duo SheCare Wellness Set',
    'duo-shecare',
    'A curated wellness ritual designed specifically for womens health. Supports hormonal balance and vitality.',
    2199,
    'She Care',
    '{Shatavari, Ashoka, Lodhra, Organic Herbs, Natural Extracts}',
    '{Hormonal balance support, Menstrual wellness, Reproductive health, Natural energy and vitality}',
    ARRAY['/assets/duo_shecare.png', '/assets/duo_shecare_2.png', '/assets/shecare_closup_duo.png'],
    ARRAY['Womens Health', 'Hormonal Balance', 'Vitality'],
    25,
    '{"calories": 45, "sugar": "8g", "fiber": "1g", "serving_size": "8 fl oz"}'::jsonb,
    '[
        {"name": "Shatavari Root", "certification": "CERTIFIED ORGANIC"},
        {"name": "Ashoka Bark", "certification": "CERTIFIED ORGANIC"},
        {"name": "Lodhra Extract", "certification": "CERTIFIED ORGANIC"},
        {"name": "Herbal Blend", "certification": "NATURAL"}
    ]'::jsonb,
    'Take 15-20ml twice daily, morning and evening. Best consumed warm.'
);

-- PRODUCT 4: Green Goddess Cleanse
INSERT INTO products (
    id, name, slug, description, price, category, ingredients, benefits,
    image_urls, wellness_goals, stock_quantity,
    nutrition_facts, ingredient_details, usage_instructions
) VALUES (
    gen_random_uuid(),
    'Green Goddess Cleanse',
    'green-goddess-cleanse',
    'Chlorophyll-rich morning elixir that floods your cells with sunlight energy. Gentle detox blend.',
    1299,
    'Cleanse',
    '{Spirulina, Wheatgrass, Moringa, Tulsi, Organic Greens}',
    '{Alkalizes the body, Gentle detoxification, Energy without caffeine, Supports digestive fire}',
    ARRAY['/assets/demo1.jpg'],
    ARRAY['Detox', 'Energy', 'Digestion'],
    40,
    '{"calories": 35, "sugar": "4g", "fiber": "3g", "serving_size": "8 fl oz"}'::jsonb,
    '[
        {"name": "Organic Spirulina", "certification": "CERTIFIED ORGANIC"},
        {"name": "Wheatgrass Juice", "certification": "CERTIFIED ORGANIC"},
        {"name": "Moringa Leaf", "certification": "CERTIFIED ORGANIC"},
        {"name": "Tulsi (Holy Basil)", "certification": "CERTIFIED ORGANIC"}
    ]'::jsonb,
    'Best consumed first thing in the morning on an empty stomach. Mix 50ml with cold water or add to smoothies.'
);

-- PRODUCT 5: Heromi Immunity Boost
INSERT INTO products (
    id, name, slug, description, price, category, ingredients, benefits,
    image_urls, wellness_goals, stock_quantity,
    nutrition_facts, ingredient_details, usage_instructions
) VALUES (
    gen_random_uuid(),
    'Heromi Immunity Blend',
    'heromi-immunity',
    'Ancient Ayurvedic formula featuring Turmeric and Ginger roots. Enhanced with black pepper for better curcumin absorption.',
    999,
    'Immunity',
    '{Organic Turmeric Root, Fresh Ginger, Black Pepper, Tulsi, Raw Honey}',
    '{Powerful anti-inflammatory, Immunity support, Improved curcumin absorption, Natural warmth and circulation}',
    ARRAY['/assets/heromi.png'],
    ARRAY['Immunity', 'Anti-Inflammatory'],
    45,
    '{"calories": 60, "sugar": "14g", "fiber": "1g", "serving_size": "8 fl oz"}'::jsonb,
    '[
        {"name": "Organic Turmeric Root", "certification": "CERTIFIED ORGANIC"},
        {"name": "Fresh Ginger Root", "certification": "CERTIFIED ORGANIC"},
        {"name": "Black Pepper Extract", "certification": "NATURAL"},
        {"name": "Tulsi Leaf", "certification": "CERTIFIED ORGANIC"},
        {"name": "Raw Himalayan Honey", "certification": "WILD HARVESTED"}
    ]'::jsonb,
    'Consume 20-30ml daily, preferably with meals for better absorption.'
);

-- PRODUCT 6: Cholesterol Care Juice
INSERT INTO products (
    id, name, slug, description, price, category, ingredients, benefits,
    image_urls, wellness_goals, stock_quantity,
    nutrition_facts, ingredient_details, usage_instructions
) VALUES (
    gen_random_uuid(),
    'Cholesterol Care Juice',
    'cholesterol-care',
    'Targeted formula for cardiovascular wellness. Blends heart-healthy botanicals with proven cholesterol-balancing properties.',
    1399,
    'Heart Health',
    '{Arjuna Bark, Garlic Extract, Amla, Guggul, Natural Herbs}',
    '{Supports healthy cholesterol levels, Cardiovascular wellness, Natural heart support, Metabolic balance}',
    ARRAY['/assets/kapiva cholesterol care juice ,cholesterol lowering supplements.png'],
    ARRAY['Heart Health', 'Metabolic Health'],
    20,
    '{"calories": 50, "sugar": "10g", "fiber": "2g", "serving_size": "10 fl oz"}'::jsonb,
    '[
        {"name": "Arjuna Bark Extract", "certification": "CERTIFIED ORGANIC"},
        {"name": "Garlic Extract", "certification": "NATURAL"},
        {"name": "Amla (Indian Gooseberry)", "certification": "CERTIFIED ORGANIC"},
        {"name": "Guggul Resin", "certification": "NATURAL"}
    ]'::jsonb,
    'Take 30ml twice daily before meals. Best results when combined with a heart-healthy diet.'
);

-- PRODUCT 7: Diabetic Wellness Formula
INSERT INTO products (
    id, name, slug, description, price, category, ingredients, benefits,
    image_urls, wellness_goals, stock_quantity,
    nutrition_facts, ingredient_details, usage_instructions
) VALUES (
    gen_random_uuid(),
    'Diabetic Wellness Formula',
    'diabetic-wellness',
    'Carefully formulated to support healthy blood sugar metabolism. Features bitter botanicals like Karela and Jamun.',
    1499,
    'Diabetic Care',
    '{Karela (Bitter Gourd), Jamun, Gudmar, Fenugreek, Neem}',
    '{Supports healthy blood sugar levels, Natural glucose metabolism, Pancreatic health, Energy stability}',
    ARRAY['/assets/Demo2.jpg'],
    ARRAY['Blood Sugar', 'Metabolic Health', 'Energy'],
    35,
    '{"calories": 40, "sugar": "6g", "fiber": "4g", "serving_size": "8 fl oz"}'::jsonb,
    '[
        {"name": "Karela (Bitter Gourd)", "certification": "CERTIFIED ORGANIC"},
        {"name": "Jamun Fruit", "certification": "CERTIFIED ORGANIC"},
        {"name": "Gudmar Leaf", "certification": "CERTIFIED ORGANIC"},
        {"name": "Fenugreek Seeds", "certification": "CERTIFIED ORGANIC"},
        {"name": "Neem Leaf", "certification": "CERTIFIED ORGANIC"}
    ]'::jsonb,
    'Consume 30ml on an empty stomach, 30 minutes before breakfast. Monitor blood sugar levels regularly.'
);

-- Verify
SELECT 'Product data seeded successfully! Total products: ' || COUNT(*)::text as status FROM products;
