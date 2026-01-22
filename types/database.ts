export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          ingredients: string
          benefits: string
          image_urls: string
          stock_quantity: number
          created_at: string
          updated_at: string
          slug?: string
          wellness_goals?: string[]
          nutrition_facts?: {
            calories: number
            sugar: string
            fiber: string
            serving_size: string
          }
          usage_instructions?: string
          ingredient_details?: Array<{
            name: string
            certification?: string
          }>
          lifestyle_images?: string[]
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          ingredients: string
          benefits: string
          image_urls: string
          stock_quantity?: number
          created_at?: string
          updated_at?: string
          slug?: string
          wellness_goals?: string[]
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          ingredients?: string
          benefits?: string
          image_urls?: string
          stock_quantity?: number
          created_at?: string
          updated_at?: string
          slug?: string
          wellness_goals?: string[]
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          category: string
          image_url: string
          published_at: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          category: string
          image_url: string
          published_at?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          category?: string
          image_url?: string
          published_at?: string
          author_id?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          alt_phone: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          alt_phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          alt_phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
     carts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
  Row: {
    id: string
    cart_id: string
    product_id: string
    quantity: number
    price_at_add: number
    currency: string
    updated_at: string // Add this line
  }
  Insert: {
    id?: string
    cart_id: string
    product_id: string
    quantity?: number
    price_at_add: number
    currency?: string
    updated_at?: string // Add this line
  }
  Update: {
    id?: string
    cart_id?: string
    product_id?: string
    quantity?: number
    price_at_add?: number
    currency?: string
    updated_at?: string // Add this line
  }
}
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed'
          shipping_address: Json
          stripe_payment_intent_id: string | null
          cashfree_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed'
          shipping_address: Json
          stripe_payment_intent_id?: string | null
          cashfree_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed'
          shipping_address?: Json
          stripe_payment_intent_id?: string | null
          cashfree_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          address_line_1: string
          address_line_2: string | null
          city: string
          state: string
          pincode: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          address_line_1: string
          address_line_2?: string | null
          city: string
          state: string
          pincode: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          state?: string
          pincode?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_purchase?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_cart_item: {
        Args: {
          p_user_id: string
          p_product_id: string
          p_price_at_add: number
          p_currency: string
          p_increment_qty: number
        }
        Returns: any
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
