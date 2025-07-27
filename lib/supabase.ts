import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a fallback client if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}

// Types for our database
export interface Profile {
  id: string
  user_type: "vendor" | "supplier"
  full_name: string
  username: string
  phone: string
  email: string
  verification_status: "pending" | "verified" | "rejected"
  created_at: string
  updated_at: string
}

export interface VendorProfile {
  id: string
  business_name: string
  business_type: string
  address: string
  city: string
  pincode: string
  latitude?: number
  longitude?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SupplierProfile {
  id: string
  company_name: string
  business_description?: string
  product_categories: string[]
  address: string
  city: string
  pincode: string
  latitude?: number
  longitude?: number
  min_order_amount: number
  delivery_radius: number
  gst_number?: string
  business_license?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  supplier_id: string
  name: string
  category: string
  description?: string
  price: number
  unit: string
  stock_quantity: number
  min_order_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  vendor_id: string
  supplier_id: string
  order_number: string
  total_amount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  is_group_order: boolean
  group_order_id?: string
  delivery_address: string
  estimated_delivery?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface GroupOrder {
  id: string
  supplier_id: string
  product_id: string
  target_quantity: number
  current_quantity: number
  discount_percentage: number
  min_participants: number
  max_participants: number
  expires_at: string
  is_active: boolean
  created_at: string
  updated_at: string
}
