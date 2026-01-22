# PriceDisplay Component Documentation

## Overview
The `PriceDisplay` component provides a consistent way to show product prices across your Ayuniv e-commerce app. It automatically handles sale pricing, strikethrough for comparison prices, and discount badges.

## Features
✅ **Automatic Sale Detection**: Shows sale UI only when `compare_at_price` > `price`  
✅ **Ghost Price Design**: Light, thin strikethrough for the original price  
✅ **Sage Green Accents**: Sale prices highlighted in your brand color (#5A7A6A)  
✅ **Auto-Calculated Discounts**: Automatically calculates and displays discount percentage  
✅ **Flexible Styling**: Customizable classes for different contexts (card vs detail page)

## Usage

### Basic Usage
```tsx
import { PriceDisplay } from "@/components/product/PriceDisplay";

<PriceDisplay 
  price={599} 
  comparisonPrice={799} 
/>
```
**Output**: Shows ₹799 with strikethrough, ₹599 in sage green, and "SAVE 25%" badge

### Product Card
```tsx
<PriceDisplay
  price={product.price}
  comparisonPrice={product.compare_at_price}
  priceClassName="text-lg"
  comparisonClassName="text-xs"
/>
```

### Product Detail Page
```tsx
<PriceDisplay
  price={product.price}
  comparisonPrice={product.compare_at_price}
  priceClassName="text-4xl font-light tracking-tight"
  comparisonClassName="text-lg"
/>
```

### Custom Badge Text
```tsx
<PriceDisplay
  price={599}
  comparisonPrice={799}
  badgeText="LIMITED OFFER"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `price` | `number` | *required* | Current selling price |
| `comparisonPrice` | `number?` | `undefined` | Original/comparison price (if higher, shows strikethrough) |
| `badgeText` | `string?` | Auto-calculated | Custom text for badge (e.g., "LIMITED OFFER") |
| `priceClassName` | `string?` | - | Custom classes for main price |
| `comparisonClassName` | `string?` | - | Custom classes for comparison price |
| `currency` | `string?` | `"₹"` | Currency symbol |

## Supabase Admin Setup

### 1. Database Schema
Your `products` table should have these columns:
- `price` (numeric) - The current selling price
- `compare_at_price` (numeric, nullable) - The original/comparison price

### 2. Setting Up Sale Pricing
In your Supabase dashboard:

**Regular Product (No Sale)**:
```
price: 599
compare_at_price: null (or empty)
```
→ Shows: ₹599 (normal display)

**Product On Sale**:
```
price: 449
compare_at_price: 599
```
→ Shows: ~~₹599~~ ₹449 + "SAVE 25%" badge

**Important**: The component only shows sale UI when `compare_at_price > price`

### 3. Bulk Update Example
If you want to put products on sale:

```sql
-- Set a 20% discount on all products in "Wellness" category
UPDATE products 
SET 
  compare_at_price = price,
  price = price * 0.80
WHERE category = 'Wellness';
```

### 4. Seasonal Sales
```sql
-- Summer Sale: Save original price, apply discount
UPDATE products 
SET 
  compare_at_price = price,
  price = price * 0.75  -- 25% off
WHERE id IN ('product-id-1', 'product-id-2');

-- End Sale: Restore original pricing
UPDATE products 
SET 
  price = compare_at_price,
  compare_at_price = NULL
WHERE compare_at_price IS NOT NULL;
```

## Design Philosophy

### The "Ghost" Price
The strikethrough price is intentionally subtle:
- Light gray color (#7A8A8A)
- Thin font weight
- 60% opacity
- Sage green strikethrough decoration

This ensures it doesn't clutter the premium design while still showing value.

### Sage Green Accents (#5A7A6A)
Sale prices use your signature Sage Green to signal "Health & Value" - a key part of the Ayuniv brand identity.

### Auto-Calculated Percentage
The discount percentage is calculated using:
```
Discount % = (1 - price / compare_at_price) × 100
```

Example:
- Original: ₹800
- Sale: ₹600
- Discount: (1 - 600/800) × 100 = 25%

## Examples

### Scenario 1: Regular Product
```tsx
<PriceDisplay price={599} />
```
**Displays**: ₹599 (in dark color, no badge)

### Scenario 2: On Sale
```tsx
<PriceDisplay price={449} comparisonPrice={599} />
```
**Displays**: 
- ~~₹599~~ (light gray, strikethrough)
- ₹449 (sage green)
- "SAVE 25%" (small badge below)

### Scenario 3: Flash Sale with Custom Badge
```tsx
<PriceDisplay 
  price={349} 
  comparisonPrice={599} 
  badgeText="FLASH SALE" 
/>
```
**Displays**: 
- ~~₹599~~ 
- ₹349 (sage green)
- "FLASH SALE" (instead of auto-calculated percentage)

## Integration Status

✅ **ProductCard** - Small card display  
✅ **Product Detail Page** - Large hero display  
✅ **Related Products** - Recommendation cards  

All components now use `PriceDisplay` for consistent pricing across the entire app.
