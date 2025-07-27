import { supabase, isSupabaseConfigured } from "./supabase"

export interface RegisterData {
  email: string
  password: string
  phone: string
  fullName: string
  username: string
  userType: "vendor" | "supplier"
  businessName?: string
  businessType?: string
  companyName?: string
  productCategories?: string[]
  address: string
  city: string
  pincode: string
  businessDescription?: string
}

export interface OTPVerification {
  phone: string
  otp: string
  purpose: "registration" | "login" | "password_reset"
}

// Generate random OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP (in real implementation, integrate with SMS service like Twilio)
export const sendOTP = async (phone: string, purpose: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      // For demo purposes, simulate OTP sending
      console.log(`Demo OTP for ${phone}: 123456`)
      return { success: true, message: "OTP sent successfully (Demo mode)" }
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Store OTP in database
    const { error } = await supabase!.from("otp_verifications").insert({
      phone,
      otp,
      purpose,
      expires_at: expiresAt.toISOString(),
    })

    if (error) throw error

    // In real implementation, send SMS here
    console.log(`OTP for ${phone}: ${otp}`) // For demo purposes

    return { success: true, message: "OTP sent successfully" }
  } catch (error) {
    console.error("Error sending OTP:", error)
    return { success: false, message: "Failed to send OTP" }
  }
}

// Verify OTP
export const verifyOTP = async ({
  phone,
  otp,
  purpose,
}: OTPVerification): Promise<{ success: boolean; message: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      // For demo purposes, accept 123456 as valid OTP
      if (otp === "123456") {
        return { success: true, message: "OTP verified successfully (Demo mode)" }
      } else {
        return { success: false, message: "Invalid OTP. Use 123456 for demo." }
      }
    }

    const { data, error } = await supabase!
      .from("otp_verifications")
      .select("*")
      .eq("phone", phone)
      .eq("otp", otp)
      .eq("purpose", purpose)
      .eq("is_verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired OTP" }
    }

    // Mark OTP as verified
    await supabase!.from("otp_verifications").update({ is_verified: true }).eq("id", data.id)

    return { success: true, message: "OTP verified successfully" }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return { success: false, message: "Failed to verify OTP" }
  }
}

// Register user
export const registerUser = async (data: RegisterData): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    if (!isSupabaseConfigured()) {
      // For demo purposes, simulate successful registration
      return {
        success: true,
        message: "Registration successful (Demo mode)",
        user: { id: "demo-user-id", email: data.email, username: data.username },
      }
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase!.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error("Failed to create user")
    }

    // Create profile with username
    const { error: profileError } = await supabase!.from("profiles").insert({
      id: authData.user.id,
      user_type: data.userType,
      full_name: data.fullName,
      username: data.username,
      phone: data.phone,
      email: data.email,
    })

    if (profileError) throw profileError

    // Rest of the function remains the same...
    if (data.userType === "vendor") {
      const { error: vendorError } = await supabase!.from("vendor_profiles").insert({
        id: authData.user.id,
        business_name: data.businessName!,
        business_type: data.businessType!,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
      })

      if (vendorError) throw vendorError
    } else {
      const { error: supplierError } = await supabase!.from("supplier_profiles").insert({
        id: authData.user.id,
        company_name: data.companyName!,
        product_categories: data.productCategories!,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        business_description: data.businessDescription,
      })

      if (supplierError) throw supplierError
    }

    return { success: true, message: "Registration successful", user: authData.user }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Registration failed. Please try again." }
  }
}

// Login user
export const loginUser = async (
  email: string,
  password: string,
  username?: string,
): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    if (!isSupabaseConfigured()) {
      // For demo purposes, simulate successful login
      return {
        success: true,
        message: "Login successful (Demo mode)",
        user: { id: "demo-user-id", email, username },
      }
    }

    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true, message: "Login successful", user: data.user }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Invalid credentials. Please check your email and password." }
  }
}

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    if (!isSupabaseConfigured()) {
      // Return demo profile data with username
      return {
        id: "demo-user-id",
        user_type: "vendor",
        full_name: "Demo User",
        username: "demo_vendor", // Changed from "demo_user" to be more specific
        phone: "+91 9876543210",
        email: "demo@example.com",
        verification_status: "verified",
        vendor_profiles: {
          id: "demo-user-id",
          business_name: "Demo Chaat Corner",
          business_type: "Street Food",
          address: "123 Demo Street, Demo Area",
          city: "Delhi",
          pincode: "110001",
          is_active: true,
        },
      }
    }

    const {
      data: { user },
    } = await supabase!.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase!
      .from("profiles")
      .select(`
        *,
        vendor_profiles(*),
        supplier_profiles(*)
      `)
      .eq("id", user.id)
      .single()

    if (error) throw error

    return profile
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

// Logout user
export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, message: "Logout successful (Demo mode)" }
    }

    const { error } = await supabase!.auth.signOut()
    if (error) throw error

    return { success: true, message: "Logout successful" }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "Logout failed" }
  }
}
