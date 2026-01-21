-- =====================================================
-- OPTION 1: Get your User ID (Run this FIRST)
-- =====================================================
-- Copy/paste this in Supabase SQL Editor and run it
-- It will show your user ID

SELECT id, email FROM auth.users LIMIT 1;

-- Copy the UUID that appears in the 'id' column
-- Example output: 
-- id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
-- email: your@email.com

-- =====================================================
-- OPTION 2: If you don't have a user yet, create one
-- =====================================================
-- If the above query returns empty, you need to sign up first:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" or sign up through your app
-- 3. Then come back and run the SELECT query above

-- =====================================================
-- OPTION 3: Use a dummy UUID for testing (NOT RECOMMENDED)
-- =====================================================
-- If you just want to test, you can use this dummy UUID:
-- But you won't see author info correctly
-- Replace 'YOUR_USER_ID_HERE' with: '00000000-0000-0000-0000-000000000000'
