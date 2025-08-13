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
      companies: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          delivery_enabled: boolean
          delivery_range: number | null
          delivery_fee: number | null
          min_order_value: number | null
          free_delivery_threshold: number | null
          operating_hours: Json | null
          ai_assistant_name: string | null
          ai_auto_upselling: boolean
          ai_smart_recommendations: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          delivery_enabled?: boolean
          delivery_range?: number | null
          delivery_fee?: number | null
          min_order_value?: number | null
          free_delivery_threshold?: number | null
          operating_hours?: Json | null
          ai_assistant_name?: string | null
          ai_auto_upselling?: boolean
          ai_smart_recommendations?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          delivery_enabled?: boolean
          delivery_range?: number | null
          delivery_fee?: number | null
          min_order_value?: number | null
          free_delivery_threshold?: number | null
          operating_hours?: Json | null
          ai_assistant_name?: string | null
          ai_auto_upselling?: boolean
          ai_smart_recommendations?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          company_id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          role: string
          permissions: Json | null
          invited_by: string | null
          invited_at: string | null
          joined_at: string | null
          status: string | null
          last_active: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          role?: string
          permissions?: Json | null
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string | null
          status?: string | null
          last_active?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          role?: string
          permissions?: Json | null
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string | null
          status?: string | null
          last_active?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          company_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          status_id: string | null
          join_date: string | null
          last_order_date: string | null
          total_orders: number
          total_spent: number
          average_order_value: number
          notes: string | null
          tags: string[] | null
          avatar: string | null
          preferences: Json | null
          loyalty_points: number
          loyalty_tier_id: string | null
          birthday: string | null
          referral_source: string | null
          marketing_consent: boolean
          sms_consent: boolean
          analysis: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status_id?: string | null
          join_date?: string | null
          last_order_date?: string | null
          total_orders?: number
          total_spent?: number
          average_order_value?: number
          notes?: string | null
          tags?: string[] | null
          avatar?: string | null
          preferences?: Json | null
          loyalty_points?: number
          loyalty_tier_id?: string | null
          birthday?: string | null
          referral_source?: string | null
          marketing_consent?: boolean
          sms_consent?: boolean
          analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status_id?: string | null
          join_date?: string | null
          last_order_date?: string | null
          total_orders?: number
          total_spent?: number
          average_order_value?: number
          notes?: string | null
          tags?: string[] | null
          avatar?: string | null
          preferences?: Json | null
          loyalty_points?: number
          loyalty_tier_id?: string | null
          birthday?: string | null
          referral_source?: string | null
          marketing_consent?: boolean
          sms_consent?: boolean
          analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          company_id: string
          category_id: string | null
          name: string
          description: string | null
          image_url: string | null
          price: number
          cost: number | null
          is_available: boolean
          is_featured: boolean
          track_inventory: boolean
          stock_quantity: number | null
          low_stock_threshold: number | null
          calories: number | null
          allergens: string[] | null
          dietary_tags: string[] | null
          tags: string[] | null
          ingredients: string[] | null
          nutritional_info: Json | null
          customization_options: Json | null
          ai_recommendation_score: number | null
          total_orders: number
          total_revenue: number
          sort_order: number
          monthly_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          category_id?: string | null
          name: string
          description?: string | null
          image_url?: string | null
          price: number
          cost?: number | null
          is_available?: boolean
          is_featured?: boolean
          track_inventory?: boolean
          stock_quantity?: number | null
          low_stock_threshold?: number | null
          calories?: number | null
          allergens?: string[] | null
          dietary_tags?: string[] | null
          tags?: string[] | null
          ingredients?: string[] | null
          nutritional_info?: Json | null
          customization_options?: Json | null
          ai_recommendation_score?: number | null
          total_orders?: number
          total_revenue?: number
          sort_order?: number
          monthly_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          image_url?: string | null
          price?: number
          cost?: number | null
          is_available?: boolean
          is_featured?: boolean
          track_inventory?: boolean
          stock_quantity?: number | null
          low_stock_threshold?: number | null
          calories?: number | null
          allergens?: string[] | null
          dietary_tags?: string[] | null
          tags?: string[] | null
          ingredients?: string[] | null
          nutritional_info?: Json | null
          customization_options?: Json | null
          ai_recommendation_score?: number | null
          total_orders?: number
          total_revenue?: number
          sort_order?: number
          monthly_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          company_id: string
          customer_id: string | null
          order_number: string
          status_id: string | null
          order_type: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          delivery_address: string | null
          delivery_instructions: string | null
          subtotal: number
          tax_amount: number
          tip_amount: number
          discount_amount: number
          total_amount: number
          payment_method: string | null
          payment_status_id: string | null
          payment_intent_id: string | null
          assigned_to: string | null
          special_instructions: string | null
          notes: string | null
          tags: string[] | null
          estimated_prep_time: number | null
          estimated_delivery_time: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          customer_id?: string | null
          order_number: string
          status_id?: string | null
          order_type?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_instructions?: string | null
          subtotal: number
          tax_amount?: number
          tip_amount?: number
          discount_amount?: number
          total_amount: number
          payment_method?: string | null
          payment_status_id?: string | null
          payment_intent_id?: string | null
          assigned_to?: string | null
          special_instructions?: string | null
          notes?: string | null
          tags?: string[] | null
          estimated_prep_time?: number | null
          estimated_delivery_time?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          customer_id?: string | null
          order_number?: string
          status_id?: string | null
          order_type?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_instructions?: string | null
          subtotal?: number
          tax_amount?: number
          tip_amount?: number
          discount_amount?: number
          total_amount?: number
          payment_method?: string | null
          payment_status_id?: string | null
          payment_intent_id?: string | null
          assigned_to?: string | null
          special_instructions?: string | null
          notes?: string | null
          tags?: string[] | null
          estimated_prep_time?: number | null
          estimated_delivery_time?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          name: string
          description: string | null
          quantity: number
          unit_price: number
          total_price: number
          notes: string | null
          customizations: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          name: string
          description?: string | null
          quantity: number
          unit_price: number
          total_price: number
          notes?: string | null
          customizations?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          name?: string
          description?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          notes?: string | null
          customizations?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
