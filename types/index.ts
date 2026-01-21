export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  image_urls: string[];
  category: string;
  stock: number;
  ingredients: string[];
  benefits: string[];
  wellness_goals: string[];
  nutrition_info?: NutritionInfo;
  usage_guidance?: string;
  safety_disclaimer?: string;
  lifestyle_images?: string[];
  is_featured?: boolean;
  popularity_score?: number;
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
}

export interface NutritionInfo {
  calories?: number;
  sugar?: string;
  fiber?: string;
  vitamins?: string[];
  serving_size?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  created_at: string;
  shipping_address: Address;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number; // Snapshot of price at time of order
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Address;
  shipping_address?: Address;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
