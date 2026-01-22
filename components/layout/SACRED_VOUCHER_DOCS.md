# Sacred Voucher System - Documentation

## Overview
The Sacred Voucher system adds a premium coupon/discount code feature to your Ayuniv e-commerce CartSidebar. It allows customers to "invoke" discount codes that reduce their cart total.

## Features
✅ **Premium Language**: Uses "Sacred Voucher" and "Invoke" instead of generic coupon language  
✅ **Smart Validation**: Checks for minimum purchase amounts and active status  
✅ **Percentage or Fixed Discounts**: Supports both discount types  
✅ **Refined UI**: Sage green accents, smooth transitions, error handling  
✅ **Stacking Logic**: Works alongside product-level sales from PriceDisplay

## Supabase Database Setup

### 1. Create Coupons Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create coupons table
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_purchase_amount NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active coupons (for validation)
CREATE POLICY "Allow public read of active coupons"
  ON coupons FOR SELECT
  TO public
  USING (is_active = true);

-- Only admins can insert/update coupons
CREATE POLICY "Allow admins to manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for faster code lookups
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
```

### 2. Insert Sample Coupons

```sql
-- Welcome discount: 15% off for new customers
INSERT INTO coupons (code, discount_type, discount_value, min_purchase_amount)
VALUES ('WELCOME15', 'percentage', 15, 500);

-- Premium wellness bundle: ₹200 off on orders over ₹2000
INSERT INTO coupons (code, discount_type, discount_value, min_purchase_amount)
VALUES ('WELLNESS200', 'fixed', 200, 2000);

-- Ayuniv loyalty: 20% off, no minimum
INSERT INTO coupons (code, discount_type, discount_value, min_purchase_amount)
VALUES ('AYUNIV20', 'percentage', 20, 0);

-- Limited time flash sale: ₹500 flat off
INSERT INTO coupons (code, discount_type, discount_value, min_purchase_amount, valid_until)
VALUES ('FLASH500', 'fixed', 500, 3000, NOW() + INTERVAL '7 days');
```

## How It Works

### User Flow

1. **User adds items to cart** → Opens CartSidebar
2. **Sees "Sacred Voucher" section** → Enters code (e.g., "AYUNIV20")
3. **Clicks "Invoke" button** → System validates:
   - Code exists in database
   - Code is currently active (`is_active = true`)
   - Cart total meets minimum purchase requirement
4. **If valid** → Shows success message with discount applied
5. **If invalid** → Shows error message (not found / min purchase not met)

### Calculation Logic

```typescript
// For percentage discounts
discount = (cartTotal × discountPercentage) / 100

// For fixed discounts
discount = fixedAmount

// Final total
finalTotal = cartTotal - discount
```

### Example Scenarios

**Scenario 1: Percentage Discount**
- Cart Subtotal: ₹1,200
- Coupon: `AYUNIV20` (20% off)
- Discount: ₹240
- Final Total: ₹960

**Scenario 2: Fixed Discount**
- Cart Subtotal: ₹3,500
- Coupon: `FLASH500` (₹500 off, min ₹3,000)
- Discount: ₹500
- Final Total: ₹3,000

**Scenario 3: Minimum Not Met**
- Cart Subtotal: ₹400
- Coupon: `WELCOME15` (15% off, min ₹500)
- Error: "Min. ritual of ₹500 required."

## UI States

### 1. Default State (No Coupon Applied)
```
┌─────────────────────────────────┐
│  SACRED VOUCHER                 │
│  ┌──────────────┐  ┌─────────┐ │
│  │ ENTER CODE   │  │ Invoke  │ │
│  └──────────────┘  └─────────┘ │
└─────────────────────────────────┘
```

### 2. Coupon Applied
```
┌─────────────────────────────────┐
│  AYUNIV20 APPLIED          ✕    │
│  Voucher ritual successfully    │
│  synchronized.                  │
└─────────────────────────────────┘
```

### 3. Error State
```
┌─────────────────────────────────┐
│  SACRED VOUCHER                 │
│  ┌──────────────┐  ┌─────────┐ │
│  │ INVALID123   │  │ Invoke  │ │
│  └──────────────┘  └─────────┘ │
│  ❌ This voucher code is not    │
│     found in the archive.       │
└─────────────────────────────────┘
```

## Total Breakdown Display

When a coupon is applied, the total section shows:

```
Subtotal                    ₹1,200
Voucher Reduction          - ₹240
─────────────────────────────────
Archive Total               ₹960
```

## Admin Management

### Creating a New Coupon

```sql
INSERT INTO coupons (
  code, 
  discount_type, 
  discount_value, 
  min_purchase_amount,
  valid_until
) VALUES (
  'SUMMER30',           -- Code to use
  'percentage',         -- 'percentage' or 'fixed'
  30,                   -- 30% off or ₹30 off
  1000,                 -- Minimum purchase ₹1000
  '2026-08-31'         -- Optional expiry date
);
```

### Deactivating a Coupon

```sql
UPDATE coupons 
SET is_active = false 
WHERE code = 'EXPIRED_CODE';
```

### Extending Coupon Validity

```sql
UPDATE coupons 
SET valid_until = '2026-12-31' 
WHERE code = 'AYUNIV20';
```

## Stacking with Product Sales

The Sacred Voucher system works beautifully with the PriceDisplay component:

**Product-Level Sales** (via `compare_at_price`):
- Individual products have sale prices
- User sees ~~₹799~~ ₹599 on product cards

**Cart-Level Discounts** (via Sacred Voucher):
- Applies to the entire cart total
- User enters code like "AYUNIV20"

**Combined Example**:
1. Product normally ₹800, on sale for ₹600 (PriceDisplay)
2. User adds 2 items → Cart: ₹1,200
3. User applies "AYUNIV20" (20% off)
4. Final total: ₹960

### Controlling Stacking

If you want to prevent stacking, add a `stackable` column:

```sql
-- Add stackable column
ALTER TABLE coupons ADD COLUMN stackable BOOLEAN DEFAULT true;

-- Make FLASH500 non-stackable with sale items
UPDATE coupons SET stackable = false WHERE code = 'FLASH500';
```

Then update the validation logic in `CartSidebar.tsx`:

```typescript
// Check if any items are on sale
const hasSaleItems = items.some(item => item.products.compare_at_price);

if (!data.stackable && hasSaleItems) {
    setCouponError("This voucher cannot be combined with sale items.");
    return;
}
```

## Best Practices

### 1. Coupon Code Naming
- **Generic**: `WELCOME15`, `SAVE20`, `FLASH500`
- **Seasonal**: `SUMMER30`, `DIWALI25`
- **Brand-specific**: `AYUNIV20`, `WELLNESS200`
- Always UPPERCASE for consistency

### 2. Minimum Purchase Strategy
- **Low threshold** (₹500): Encourages trial
- **Medium threshold** (₹1,500): Boosts average order value
- **High threshold** (₹3,000): Premium bundles only

### 3. Discount Sweet Spots
- **10-15%**: Entry-level, wide appeal
- **20-30%**: Strong motivation, special occasions
- **₹200-500 fixed**: Clear value, easy to understand
- **>30% or >₹500**: Reserve for flash sales/clearing stock

### 4. Expiry Dates
- **No expiry**: Loyalty codes (AYUNIV20)
- **7 days**: Flash sales
- **30 days**: Monthly campaigns
- **Seasonal**: SUMMER30 (valid June-August)

## Troubleshooting

### "This voucher code is not found in the archive."
- Code doesn't exist in database
- Code is spelled incorrectly (remember: case-insensitive but stored UPPERCASE)
- Code has `is_active = false`

### "Min. ritual of ₹X required."
- Cart total is below `min_purchase_amount`
- User needs to add more items

### Discount not calculating correctly
- Check `discount_type` is 'percentage' or 'fixed'
- Percentage should be a number (20, not 0.20)
- Fixed should be the actual amount (500, not 5)

## Future Enhancements

Consider adding these features:

1. **Usage Limits**
   ```sql
   ALTER TABLE coupons ADD COLUMN max_uses INTEGER;
   ALTER TABLE coupons ADD COLUMN times_used INTEGER DEFAULT 0;
   ```

2. **Per-User Limits**
   ```sql
   CREATE TABLE coupon_usage (
     user_id UUID,
     coupon_id UUID,
     used_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Category-Specific Coupons**
   ```sql
   ALTER TABLE coupons ADD COLUMN valid_categories TEXT[];
   ```

4. **First-Order Only**
   ```sql
   ALTER TABLE coupons ADD COLUMN first_order_only BOOLEAN DEFAULT false;
   ```

## Integration Status

✅ **CartSidebar** - Sacred Voucher UI implemented  
✅ **Types** - Coupon interface defined  
✅ **Validation** - Min purchase + active status checks  
✅ **Total Breakdown** - Shows subtotal, discount, final total  

The Sacred Voucher system is now fully operational! 🎉
