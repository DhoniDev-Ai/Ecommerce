-- EXAMPLE: Sea Buckthorn with FULL nutrition data
-- Copy this pattern for updating your other products in 002_seed_products.sql

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
    -- NEW FIELDS ✨
    nutrition_facts,
    ingredient_details,
    usage_instructions
) VALUES (
    gen_random_uuid(),
    'Sea Buckthorn Pulp 300ml',
    'sea-buckthorn-pulp-300ml',
    'Pure, cold-pressed Sea Buckthorn from the Himalayas...',
    899,
    'Pulp',
    'Organic Sea Buckthorn Berries (100%)',
    'Supports skin health, Boosts immunity...',
    ARRAY['/assets/sea_buckthorn_pulp_300ml.png'],
    ARRAY['Energy', 'Immunity', 'Skin Health'],
    50,
    -- Nutrition Facts (JSONB)
    '{
        "calories": 70,
        "sugar": "12g",
        "fiber": "2g",
        "serving_size": "10 fl oz"
    }'::jsonb,
    -- Ingredient Details with certifications (JSONB Array)
    '[
        {
            "name": "Organic Sea Buckthorn Berries",
            "certification": "CERTIFIED ORGANIC"
        },
        {
            "name": "Natural Preservatives",
            "certification": "NON-GMO"
        }
    ]'::jsonb,
    -- Usage Instructions (TEXT)
    'Best enjoyed chilled in the morning on an empty stomach. Mix with warm water or consume directly. Start with 30ml and gradually increase to 60ml per day.'
);
