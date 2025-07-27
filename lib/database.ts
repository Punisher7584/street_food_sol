import { supabase, isSupabaseConfigured, type Product, type SupplierProfile, type VendorProfile } from "./supabase"

// Add demo data with more comprehensive information
const demoSuppliers = [
  {
    id: "1",
    name: "Fresh Veggie Mart",
    category: "Vegetables",
    rating: 4.8,
    reviews: 234,
    location: "Azadpur Mandi, Delhi",
    deliveryTime: "2-4 hours",
    minOrder: "₹500",
    verified: true,
    groupOrderActive: true,
    products: [
      {
        id: "p1",
        name: "Onions",
        price: "₹25/kg",
        originalPrice: "₹30/kg",
        stock: "500kg",
        unit: "kg",
        description: "Fresh red onions",
      },
      {
        id: "p2",
        name: "Tomatoes",
        price: "₹35/kg",
        originalPrice: "₹40/kg",
        stock: "300kg",
        unit: "kg",
        description: "Ripe tomatoes",
      },
      {
        id: "p3",
        name: "Potatoes",
        price: "₹20/kg",
        originalPrice: "₹25/kg",
        stock: "800kg",
        unit: "kg",
        description: "Grade A potatoes",
      },
    ],
  },
  {
    id: "2",
    name: "Spice Kingdom",
    category: "Spices",
    rating: 4.9,
    reviews: 189,
    location: "Khari Baoli, Delhi",
    deliveryTime: "1-2 hours",
    minOrder: "₹300",
    verified: true,
    groupOrderActive: false,
    products: [
      {
        id: "p4",
        name: "Red Chili Powder",
        price: "₹180/kg",
        originalPrice: "₹200/kg",
        stock: "50kg",
        unit: "kg",
        description: "Pure red chili powder",
      },
      {
        id: "p5",
        name: "Turmeric Powder",
        price: "₹120/kg",
        originalPrice: "₹140/kg",
        stock: "30kg",
        unit: "kg",
        description: "Organic turmeric",
      },
      {
        id: "p6",
        name: "Garam Masala",
        price: "₹250/kg",
        originalPrice: "₹280/kg",
        stock: "25kg",
        unit: "kg",
        description: "Premium blend",
      },
    ],
  },
  {
    id: "3",
    name: "Grain Masters",
    category: "Grains",
    rating: 4.7,
    reviews: 156,
    location: "Mandoli, Delhi",
    deliveryTime: "3-5 hours",
    minOrder: "₹1000",
    verified: true,
    groupOrderActive: true,
    products: [
      {
        id: "p7",
        name: "Basmati Rice",
        price: "₹80/kg",
        originalPrice: "₹90/kg",
        stock: "200kg",
        unit: "kg",
        description: "Premium basmati rice",
      },
      {
        id: "p8",
        name: "Wheat Flour",
        price: "₹40/kg",
        originalPrice: "₹45/kg",
        stock: "500kg",
        unit: "kg",
        description: "Fresh wheat flour",
      },
      {
        id: "p9",
        name: "Chickpeas",
        price: "₹60/kg",
        originalPrice: "₹70/kg",
        stock: "150kg",
        unit: "kg",
        description: "Quality chickpeas",
      },
    ],
  },
]

const demoOrders = [
  {
    id: "ORD001",
    vendor: "Rajesh Kumar",
    vendorId: "vendor1",
    supplier: "Fresh Veggie Mart",
    supplierId: "1",
    items: "Onions (10kg), Tomatoes (5kg)",
    itemDetails: [
      { name: "Onions", quantity: 10, unit: "kg", price: 25, total: 250 },
      { name: "Tomatoes", quantity: 5, unit: "kg", price: 35, total: 175 },
    ],
    total: "₹425",
    totalAmount: 425,
    status: "In Transit",
    estimatedDelivery: "2:30 PM",
    orderDate: "2024-01-15",
    type: "individual",
    deliveryAddress: "Shop 12, Main Market, Delhi",
    trackingId: "TRK001",
  },
  {
    id: "GRP002",
    vendor: "Group Order (8 vendors)",
    vendorId: "group",
    supplier: "Spice Kingdom",
    supplierId: "2",
    items: "Red Chili Powder (2kg), Turmeric (1kg)",
    itemDetails: [
      { name: "Red Chili Powder", quantity: 2, unit: "kg", price: 180, total: 360 },
      { name: "Turmeric Powder", quantity: 1, unit: "kg", price: 120, total: 120 },
    ],
    total: "₹480",
    totalAmount: 480,
    status: "Group Order",
    estimatedDelivery: "Tomorrow 10 AM",
    orderDate: "2024-01-14",
    type: "group",
    groupMembers: 8,
    deliveryAddress: "Various locations in Delhi",
    trackingId: "GRP002",
  },
  {
    id: "ORD003",
    vendor: "Priya Sharma",
    vendorId: "vendor2",
    supplier: "Grain Masters",
    supplierId: "3",
    items: "Basmati Rice (5kg), Wheat Flour (10kg)",
    itemDetails: [
      { name: "Basmati Rice", quantity: 5, unit: "kg", price: 80, total: 400 },
      { name: "Wheat Flour", quantity: 10, unit: "kg", price: 40, total: 400 },
    ],
    total: "₹800",
    totalAmount: 800,
    status: "Delivered",
    estimatedDelivery: "Delivered",
    orderDate: "2024-01-13",
    type: "individual",
    deliveryAddress: "Dosa Corner, CP, Delhi",
    trackingId: "TRK003",
  },
]

// Add comprehensive supplier products data
const demoSupplierProducts = [
  {
    id: "p1",
    name: "Fresh Onions",
    category: "Vegetables",
    price: "₹25/kg",
    priceValue: 25,
    stock: "500kg",
    stockValue: 500,
    orders: 45,
    rating: 4.8,
    status: "active",
    unit: "kg",
    description: "Premium quality red onions",
    minOrderQuantity: 5,
  },
  {
    id: "p2",
    name: "Red Tomatoes",
    category: "Vegetables",
    price: "₹35/kg",
    priceValue: 35,
    stock: "300kg",
    stockValue: 300,
    orders: 32,
    rating: 4.7,
    status: "active",
    unit: "kg",
    description: "Fresh ripe tomatoes",
    minOrderQuantity: 3,
  },
  {
    id: "p4",
    name: "Red Chili Powder",
    category: "Spices",
    price: "₹180/kg",
    priceValue: 180,
    stock: "15kg",
    stockValue: 15,
    orders: 28,
    rating: 4.9,
    status: "low_stock",
    unit: "kg",
    description: "Pure red chili powder",
    minOrderQuantity: 1,
  },
  {
    id: "p7",
    name: "Basmati Rice",
    category: "Grains",
    price: "₹80/kg",
    priceValue: 80,
    stock: "200kg",
    stockValue: 200,
    orders: 22,
    rating: 4.8,
    status: "active",
    unit: "kg",
    description: "Premium basmati rice",
    minOrderQuantity: 10,
  },
]

// Supplier functions
export const getVerifiedSuppliers = async (city?: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: demoSuppliers }
    }

    let query = supabase!
      .from("supplier_profiles")
      .select(`
        *,
        profiles!inner(verification_status)
      `)
      .eq("is_active", true)
      .eq("profiles.verification_status", "verified")

    if (city) {
      query = query.eq("city", city)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return { success: false, data: [] }
  }
}

// Product functions
export const getProductsBySupplier = async (supplierId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: [] }
    }

    const { data, error } = await supabase!
      .from("products")
      .select("*")
      .eq("supplier_id", supplierId)
      .eq("is_active", true)
      .order("name")

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { success: false, data: [] }
  }
}

export const searchProducts = async (query: string, category?: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: demoSuppliers }
    }

    let dbQuery = supabase!
      .from("products")
      .select(`
        *,
        supplier_profiles!inner(company_name, city),
        profiles!inner(verification_status)
      `)
      .eq("is_active", true)
      .eq("profiles.verification_status", "verified")
      .ilike("name", `%${query}%`)

    if (category && category !== "all") {
      dbQuery = dbQuery.eq("category", category)
    }

    const { data, error } = await dbQuery.order("name")

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error searching products:", error)
    return { success: false, data: [] }
  }
}

// Order functions
export const createOrder = async (orderData: {
  vendorId: string
  supplierId: string
  items: Array<{ productId: string; quantity: number; unitPrice: number }>
  deliveryAddress: string
  notes?: string
}) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { id: "demo-order-id", order_number: "ORD" + Date.now() } }
    }

    // Generate order number
    const orderNumber = `ORD${Date.now()}`

    // Calculate total amount
    const totalAmount = orderData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    // Create order
    const { data: order, error: orderError } = await supabase!
      .from("orders")
      .insert({
        vendor_id: orderData.vendorId,
        supplier_id: orderData.supplierId,
        order_number: orderNumber,
        total_amount: totalAmount,
        delivery_address: orderData.deliveryAddress,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice,
    }))

    const { error: itemsError } = await supabase!.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return { success: true, data: order }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, data: null }
  }
}

export const getOrdersByVendor = async (vendorId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: demoOrders }
    }

    const { data, error } = await supabase!
      .from("orders")
      .select(`
        *,
        supplier_profiles(company_name),
        order_items(
          *,
          products(name, unit)
        )
      `)
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching vendor orders:", error)
    return { success: false, data: [] }
  }
}

export const getOrdersBySupplier = async (supplierId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: demoOrders }
    }

    const { data, error } = await supabase!
      .from("orders")
      .select(`
        *,
        vendor_profiles(business_name),
        order_items(
          *,
          products(name, unit)
        )
      `)
      .eq("supplier_id", supplierId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching supplier orders:", error)
    return { success: false, data: [] }
  }
}

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { id: orderId, status } }
    }

    const { data, error } = await supabase!.from("orders").update({ status }).eq("id", orderId).select().single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, data: null }
  }
}

// Group order functions
export const getActiveGroupOrders = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: [] }
    }

    const { data, error } = await supabase!
      .from("group_orders")
      .select(`
        *,
        products(name, price, unit),
        supplier_profiles(company_name),
        group_order_participants(vendor_id, quantity)
      `)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("expires_at")

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching group orders:", error)
    return { success: false, data: [] }
  }
}

export const joinGroupOrder = async (groupOrderId: string, vendorId: string, quantity: number) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { id: "demo-participation-id" } }
    }

    const { data, error } = await supabase!
      .from("group_order_participants")
      .insert({
        group_order_id: groupOrderId,
        vendor_id: vendorId,
        quantity,
      })
      .select()
      .single()

    if (error) throw error

    // Update current quantity in group order
    const { error: updateError } = await supabase!.rpc("increment_group_order_quantity", {
      group_order_id: groupOrderId,
      quantity_to_add: quantity,
    })

    if (updateError) throw updateError

    return { success: true, data }
  } catch (error) {
    console.error("Error joining group order:", error)
    return { success: false, data: null }
  }
}

// Profile functions
export const updateVendorProfile = async (vendorId: string, profileData: Partial<VendorProfile>) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { ...profileData, id: vendorId } }
    }

    const { data, error } = await supabase!
      .from("vendor_profiles")
      .update(profileData)
      .eq("id", vendorId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating vendor profile:", error)
    return { success: false, data: null }
  }
}

export const updateSupplierProfile = async (supplierId: string, profileData: Partial<SupplierProfile>) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { ...profileData, id: supplierId } }
    }

    const { data, error } = await supabase!
      .from("supplier_profiles")
      .update(profileData)
      .eq("id", supplierId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating supplier profile:", error)
    return { success: false, data: null }
  }
}

// Product management for suppliers
export const addProduct = async (productData: Omit<Product, "id" | "created_at" | "updated_at">) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { ...productData, id: "demo-product-id" } }
    }

    const { data, error } = await supabase!.from("products").insert(productData).select().single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error adding product:", error)
    return { success: false, data: null }
  }
}

export const updateProduct = async (productId: string, productData: Partial<Product>) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true, data: { ...productData, id: productId } }
    }

    const { data, error } = await supabase!.from("products").update(productData).eq("id", productId).select().single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, data: null }
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true }
    }

    const { error } = await supabase!.from("products").update({ is_active: false }).eq("id", productId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false }
  }
}

// Add functions for order management
export const getOrderDetails = async (orderId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      const order = demoOrders.find((o) => o.id === orderId)
      return { success: true, data: order }
    }

    const { data, error } = await supabase!
      .from("orders")
      .select(`
        *,
        vendor_profiles(business_name, address),
        supplier_profiles(company_name),
        order_items(
          *,
          products(name, unit, price)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching order details:", error)
    return { success: false, data: null }
  }
}

export const trackOrder = async (orderId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      const order = demoOrders.find((o) => o.id === orderId)
      const trackingInfo = {
        orderId: order?.id,
        status: order?.status,
        trackingId: order?.trackingId,
        estimatedDelivery: order?.estimatedDelivery,
        currentLocation: "Delhi Distribution Center",
        updates: [
          { time: "10:30 AM", status: "Order Confirmed", location: "Supplier Warehouse" },
          { time: "11:45 AM", status: "Packed", location: "Supplier Warehouse" },
          { time: "1:20 PM", status: "In Transit", location: "Delhi Distribution Center" },
        ],
      }
      return { success: true, data: trackingInfo }
    }

    // Implement real tracking logic here
    return { success: true, data: null }
  } catch (error) {
    console.error("Error tracking order:", error)
    return { success: false, data: null }
  }
}

// Add function to place order
export const placeOrder = async (orderData: {
  vendorId: string
  supplierId: string
  items: Array<{ productId: string; quantity: number; price: number }>
  deliveryAddress: string
  notes?: string
}) => {
  try {
    if (!isSupabaseConfigured()) {
      const newOrder = {
        id: `ORD${Date.now()}`,
        vendor: "Current User",
        vendorId: orderData.vendorId,
        supplier: demoSuppliers.find((s) => s.id === orderData.supplierId)?.name || "Unknown Supplier",
        supplierId: orderData.supplierId,
        items: orderData.items
          .map((item) => {
            const product = demoSuppliers.flatMap((s) => s.products).find((p) => p.id === item.productId)
            return `${product?.name} (${item.quantity}${product?.unit})`
          })
          .join(", "),
        total: `₹${orderData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}`,
        status: "Confirmed",
        estimatedDelivery: "2-4 hours",
        orderDate: new Date().toISOString().split("T")[0],
        type: "individual",
        deliveryAddress: orderData.deliveryAddress,
        trackingId: `TRK${Date.now()}`,
      }

      demoOrders.unshift(newOrder)
      return { success: true, data: newOrder }
    }

    return await createOrder(orderData)
  } catch (error) {
    console.error("Error placing order:", error)
    return { success: false, data: null }
  }
}
