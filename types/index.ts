export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  category: string;
  stock: number;
  ingredients?: string[];
  benefits?: string[];
  created_at: string;
  metadata?: Record<string, any>;
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
