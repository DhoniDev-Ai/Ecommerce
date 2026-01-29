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
          ingredients: string[]
          benefits: string[]
          image_urls: string[]
          stock_quantity: number
          created_at: string
          updated_at: string
          slug?: string
          wellness_goals?: string[]
          nutrition_facts?: Json
          usage_instructions?: string
          ingredient_details?: Json
          lifestyle_images?: string[]
          is_active: boolean
          low_stock_threshold: number
          sale_price?: number
          is_on_sale: boolean
          comparison_price?: number
          sale_badge_text?: string
          faq?: Json
          meta_description?: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          ingredients: string[]
          benefits: string[]
          image_urls: string[]
          stock_quantity?: number
          created_at?: string
          updated_at?: string
          slug?: string
          wellness_goals?: string[]
          nutrition_facts?: Json
          usage_instructions?: string
          ingredient_details?: Json
          lifestyle_images?: string[]
          is_active?: boolean
          low_stock_threshold?: number
          sale_price?: number
          is_on_sale?: boolean
          comparison_price?: number
          sale_badge_text?: string
          faq?: Json
          meta_description?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          ingredients?: string[]
          benefits?: string[]
          image_urls?: string[]
          stock_quantity?: number
          created_at?: string
          updated_at?: string
          slug?: string
          wellness_goals?: string[]
          nutrition_facts?: Json
          usage_instructions?: string
          ingredient_details?: Json
          lifestyle_images?: string[]
          is_active?: boolean
          low_stock_threshold?: number
          sale_price?: number
          is_on_sale?: boolean
          comparison_price?: number
          sale_badge_text?: string
          faq?: Json
          meta_description?: string
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'succeeded' | 'failed'
          shipping_address: Json
          stripe_payment_intent_id: string | null
          cashfree_order_id: string | null
          payment_method: 'online' | 'COD' | null
          cancellation_reason: string | null
          coupon_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'succeeded' | 'failed'
          payment_method?: 'online' | 'COD'
          cancellation_reason?: string
          coupon_id?: string | null
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
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'succeeded' | 'failed'
          payment_method?: 'online' | 'COD'
          cancellation_reason?: string
          coupon_id?: string | null
          shipping_address?: Json
          stripe_payment_intent_id?: string | null
          cashfree_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      coupons: {
        Row: {
          id: string
          code: string
          type: 'percentage' | 'fixed'
          value: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          type: 'percentage' | 'fixed'
          value: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          type?: 'percentage' | 'fixed'
          value?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
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
