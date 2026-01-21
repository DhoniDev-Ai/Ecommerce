-- =====================================================
-- IMAGE PATH REFERENCE GUIDE
-- =====================================================
-- Your Supabase Storage URL: https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/
-- 
-- IMPORTANT: Before running this script, make sure you've uploaded these images to Supabase Storage:
--
-- BLOG IMAGES:
-- - blog-1.png ✅ (you've confirmed this exists)
-- - blog-2.png
-- - blog-3.png
-- - blog-hero-1.jpg
--
-- PRODUCT IMAGES:
-- - sea_buckthorn_pulp_300ml.png
-- - sea_buckthorn_pulp_500ml.png
-- - duo_shecare.png
-- - heromi.png
-- - demo1.jpg (Green Goddess)
-- - demo2.jpg (Diabetic Wellness)
-- - kapiva cholesterol care juice ,cholesterol lowering supplements.png
--
-- Upload these to: Supabase Dashboard > Storage > product-images bucket
-- =====================================================

-- Clear existing posts
TRUNCATE TABLE posts CASCADE;

-- BLOG POST 1: Alchemy of Sea Buckthorn
INSERT INTO posts (
    id, title, slug, excerpt, content, category, image_url, published_at, author_id
) VALUES (
    gen_random_uuid(),
    'The Alchemy of Sea Buckthorn: Himalayan Gold',
    'alchemy-of-sea-buckthorn',
    'Discover why this ancient berry is the cornerstone of modern Ayuniv elixirs.',
    '<p>In the high-altitude valleys of the Himalayas, where the air is thin and the sun is fierce, grows a berry of legendary potency. For centuries, the people of these regions have harvested Sea Buckthorn, calling it "Himalayan Gold"—not for its color, but for its life-sustaining properties.</p>

<h2>The Rare Sigma-7 Nutrient</h2>
<p>What makes Sea Buckthorn truly unique isn''t just its Vitamin C content (which is 12x that of an orange), but its rare concentration of Omega-7 fatty acids. This ''elusive'' fatty acid is a vital component for skin health, mucosal lining repair, and cellular hydration. At Ayuniv, we source our berries from certified organic farms in the Spiti Valley to ensure that every drop of pulp retains its enzymatic life.</p>

<blockquote>"Nature doesn''t rush, yet everything is accomplished. Our cold-press process honors this patience, extracting nectar without heat to preserve the berry''s soul."</blockquote>

<h2>Our Extraction Ritual</h2>
<p>Unlike industrial juices that use high heat pasteurization, our Jaipur studio utilizes a gentle, slow-press method. We apply 10 tons of hydraulic pressure to extract the juice, ensuring that the delicate lipid layers remain intact. This results in a bioavailable elixir that your body recognizes not as a supplement, but as pure, living food.</p>',
    'Health',
    'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-hero-1.jpg',
    '2026-01-20T10:00:00Z',
    NULL
);

-- BLOG POST 2: Morning Rituals
INSERT INTO posts (
    id, title, slug, excerpt, content, category, image_url, published_at, author_id
) VALUES (
    gen_random_uuid(),
    'Morning Rituals for Sustained Vitality',
    'morning-rituals-vitality',
    'How to structure your first hour for a day of focused, natural energy.',
    '<p>The first hour of your day sets the biological tempo for the next twenty-three. In Ayurveda, this time represents ''Brahma Muhurta''—a window of heightened cosmic awareness. How we inhabit these moments determines our clarity, digestion, and energy.</p>

<h2>Hydration Before Caffeination</h2>
<p>Before the acidity of coffee touches your palate, the body craves alkalinity. We recommend starting with 500ml of warm water infused with a squeeze of lime. This simple act flushes the lymphatic system, clears toxins (Ama) accumulated during sleep, and ignites your Agni (digestive fire) without shocking the adrenals.</p>

<blockquote>"A ritual is not a routine. A routine is something you have to do; a ritual is something you get to do. Shift your mindset from obligation to adoration."</blockquote>

<h2>The Grounding Practice</h2>
<p>Spend just five minutes with your feet on the earth or sitting in silence. In our hyper-connected 2026, this analog connection is the ultimate luxury. Follow this with a nutrient-dense elixir like our Green Goddess Cleanse to flood your cells with chlorophyll, effectively ''plugging in'' to the sun''s energy for the day ahead.</p>',
    'Rituals',
    'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-2.png',
    '2026-01-18T09:00:00Z',
    NULL
);

-- BLOG POST 3: Blood Purifiers Guide
INSERT INTO posts (
    id, title, slug, excerpt, content, category, image_url, published_at, author_id
) VALUES (
    gen_random_uuid(),
    'Natural Blood Purifiers: A Guide to Clarity',
    'blood-purifiers-guide',
    'Deep dive into the botanical ingredients that help cleanse your system from within.',
    '<p>True radiance isn''t painted on; it surfaces from the bloodstream. When our blood is congested with toxins from processed foods and pollution, our skin dulls and our energy stagnates. Nature provides powerful botanicals that act as ''rivers'' to wash away this debris.</p>

<h2>The Bitter Truth</h2>
<p>In modern diets, we''ve largely eliminated the ''bitter'' taste profile, yet this is the exact flavor that stimulates the liver to detoxify. Ingredients like Neem, Manjistha, and Karela are revered in Ayurveda not for their culinary delight, but for their potent ability to scrub the blood clean.</p>

<h2>Signs of Toxic Buildup</h2>
<p>Listen to your body''s subtle signals before they become loud symptoms. Watch for persistent brain fog or lethargy upon waking, unexplained skin breakouts or dullness, digestive sluggishness or bloating after meals, and a coated tongue in the morning.</p>

<blockquote>"Clarity comes from within. Cleanse your body to clear your mind."</blockquote>

<p>Our Curated Cleanses introduce these bitter principles in balanced formulations, paired with cooling herbs to ensure the detoxification process is gentle, consistent, and restorative rather than depleting.</p>',
    'Blood Purifiers',
    'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-3.png',
    '2026-01-15T08:00:00Z',
    NULL
);

-- BLOG POST 4: Art of Slow Living
INSERT INTO posts (
    id, title, slug, excerpt, content, category, image_url, published_at, author_id
) VALUES (
    gen_random_uuid(),
    'The Art of Slow Living: Why We Hand-Pour',
    'art-of-slow-living',
    'In a world of instant gratification, we choose the path of patience. Learn about our small-batch process.',
    '<p>In an era of AI automation and instant delivery, doing things ''the hard way'' is a radical act. At Ayuniv, we embrace the philosophy of slow living not just as a lifestyle choice, but as a manufacturing standard. Speed destroys nutrients; patience preserves them.</p>

<h2>Energy Transfer</h2>
<p>We believe in the concept of ''Prana''—life force. When a machine violently processes an ingredient, its Prana is diminished. When a human hand intentionally pours, seals, and packages a bottle, there is an energetic transfer of care. You can taste this silence in every sip.</p>

<blockquote>"Slowing down allows us to savor the richness of life. We bottle this stillness so you can drink it amidst the chaos."</blockquote>

<p>From our small-batch sourcing in local Rajasthan markets to our manual quality checks, we refuse to scale at the cost of soul. This is not just juice; it is a protest against the mindless acceleration of our world.</p>',
    'Wellness',
    'https://rcrbbvnrkwjtyjyytarx.supabase.co/storage/v1/object/public/product-images/blog-1.png',
    '2026-01-12T07:00:00Z',
    NULL
);

-- Verify
SELECT 'Blog posts seeded successfully! Total posts: ' || COUNT(*)::text as status FROM posts;
SELECT title, slug, category, image_url FROM posts ORDER BY published_at DESC;
