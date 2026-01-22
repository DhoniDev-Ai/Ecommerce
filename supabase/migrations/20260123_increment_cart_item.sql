-- Add missing columns to cart_items table for production readiness
ALTER TABLE public.cart_items 
ADD COLUMN IF NOT EXISTS price_at_add NUMERIC,
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'INR';

-- PostgreSQL RPC function for atomic cart increment operations
-- This version handles cart creation internally for better performance
-- Prevents race conditions during rapid "Add to Ritual" clicks

CREATE OR REPLACE FUNCTION increment_cart_item(
  p_user_id UUID,
  p_product_id UUID,
  p_price_at_add NUMERIC,
  p_currency VARCHAR(3),
  p_increment_qty INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
  v_cart_id UUID;
  v_result JSONB;
BEGIN
  -- Ensure cart exists (creates if not, updates timestamp if exists)
  INSERT INTO carts (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
  RETURNING id INTO v_cart_id;

  -- Upsert cart item (atomic increment or create)
  INSERT INTO cart_items (cart_id, product_id, quantity, price_at_add, currency)
  VALUES (v_cart_id, p_product_id, p_increment_qty, p_price_at_add, p_currency)
  ON CONFLICT (cart_id, product_id) 
  DO UPDATE SET 
    quantity = cart_items.quantity + p_increment_qty,
    updated_at = NOW()
  RETURNING to_jsonb(cart_items.*) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

