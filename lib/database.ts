// Mock database functions for demo purposes
// In production, these would connect to your actual database

interface User {
  id: string
  username: string
  email: string
  phone: string
  user_type: "vendor" | "supplier"
  business_name?: string
  address?: string
}

interface Product {
  id: string
  name: string
  price: number
  unit: string
  category: string
  description: string
  min_order_quantity: number
  availability: boolean
  stock_quantity: number
  supplier_id: string
  supplier_name: string
}

interface Order {
  id: string
  vendor_id: string
  vendor_name: string
  vendor_phone: string
  supplier_id: string
  supplier_name: string
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  created_at: string
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    price: number
  }>
  delivery_address: string
}

interface Supplier {
  id: string
  business_name: string
  contact_person: string
  phone: string
  email: string
  address: string
  rating: number
  total_orders: number
  specialties: string[]
}

// Mock data
const mockUsers: User[] = [
  {
    id: "vendor-1",
    username: "rajesh_vendor",
    email: "rajesh@example.com",
    phone: "+91 9876543210",
    user_type: "vendor",
    business_name: "Rajesh Street Food",
    address: "Connaught Place, New Delhi",
  },
  {
    id: "supplier-1",
    username: "kumar_supplier",
    email: "kumar@example.com",
    phone: "+91 9876543211",
    user_type: "supplier",
    business_name: "Kumar Wholesale",
    address: "Azadpur Mandi, Delhi",
  },
]

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Basmati Rice",
    price: 80,
    unit: "kg",
    category: "Grains",
    description: "Premium quality basmati rice, perfect for biryanis and pulao",
    min_order_quantity: 10,
    availability: true,
    stock_quantity: 500,
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
  },
  {
    id: "prod-2",
    name: "Onions",
    price: 25,
    unit: "kg",
    category: "Vegetables",
    description: "Fresh red onions, essential for Indian cooking",
    min_order_quantity: 5,
    availability: true,
    stock_quantity: 200,
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
  },
  {
    id: "prod-3",
    name: "Tomatoes",
    price: 30,
    unit: "kg",
    category: "Vegetables",
    description: "Fresh ripe tomatoes, perfect for curries and chutneys",
    min_order_quantity: 5,
    availability: true,
    stock_quantity: 150,
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
  },
  {
    id: "prod-4",
    name: "Cooking Oil",
    price: 120,
    unit: "liter",
    category: "Oil & Spices",
    description: "Refined sunflower oil for healthy cooking",
    min_order_quantity: 2,
    availability: true,
    stock_quantity: 100,
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
  },
  {
    id: "prod-5",
    name: "Garam Masala",
    price: 200,
    unit: "kg",
    category: "Oil & Spices",
    description: "Authentic blend of Indian spices",
    min_order_quantity: 1,
    availability: true,
    stock_quantity: 50,
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
  },
  {
    id: "prod-6",
    name: "Wheat Flour",
    price: 40,
    unit: "kg",
    category: "Grains",
    description: "Fine quality wheat flour for rotis and parathas",
    min_order_quantity: 10,
    availability: true,
    stock_quantity: 300,
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
  },
]

const mockOrders: Order[] = [
  {
    id: "order-1",
    vendor_id: "vendor-1",
    vendor_name: "Rajesh Street Food",
    vendor_phone: "+91 9876543210",
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
    total_amount: 850,
    status: "delivered",
    created_at: "2024-01-15T10:30:00Z",
    items: [
      {
        product_id: "prod-1",
        product_name: "Basmati Rice",
        quantity: 10,
        price: 80,
      },
      {
        product_id: "prod-2",
        product_name: "Onions",
        quantity: 2,
        price: 25,
      },
    ],
    delivery_address: "Connaught Place, New Delhi",
  },
  {
    id: "order-2",
    vendor_id: "vendor-1",
    vendor_name: "Rajesh Street Food",
    vendor_phone: "+91 9876543210",
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
    total_amount: 390,
    status: "shipped",
    created_at: "2024-01-20T14:15:00Z",
    items: [
      {
        product_id: "prod-3",
        product_name: "Tomatoes",
        quantity: 5,
        price: 30,
      },
      {
        product_id: "prod-4",
        product_name: "Cooking Oil",
        quantity: 2,
        price: 120,
      },
    ],
    delivery_address: "Connaught Place, New Delhi",
  },
  {
    id: "order-3",
    vendor_id: "vendor-1",
    vendor_name: "Rajesh Street Food",
    vendor_phone: "+91 9876543210",
    supplier_id: "supplier-1",
    supplier_name: "Kumar Wholesale",
    total_amount: 200,
    status: "pending",
    created_at: "2024-01-25T09:00:00Z",
    items: [
      {
        product_id: "prod-5",
        product_name: "Garam Masala",
        quantity: 1,
        price: 200,
      },
    ],
    delivery_address: "Connaught Place, New Delhi",
  },
]

const mockSuppliers: Supplier[] = [
  {
    id: "supplier-1",
    business_name: "Kumar Wholesale",
    contact_person: "Amit Kumar",
    phone: "+91 9876543211",
    email: "kumar@example.com",
    address: "Azadpur Mandi, Delhi",
    rating: 4.5,
    total_orders: 150,
    specialties: ["Grains", "Vegetables", "Oil & Spices"],
  },
  {
    id: "supplier-2",
    business_name: "Fresh Produce Co.",
    contact_person: "Priya Sharma",
    phone: "+91 9876543212",
    email: "priya@freshproduce.com",
    address: "Ghazipur Mandi, Delhi",
    rating: 4.2,
    total_orders: 89,
    specialties: ["Vegetables", "Fruits"],
  },
  {
    id: "supplier-3",
    business_name: "Spice Masters",
    contact_person: "Ravi Gupta",
    phone: "+91 9876543213",
    email: "ravi@spicemasters.com",
    address: "Khari Baoli, Delhi",
    rating: 4.8,
    total_orders: 200,
    specialties: ["Oil & Spices", "Dry Fruits"],
  },
]

// Utility function to simulate async operations
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Database functions
export async function getVendorData(vendorId: string) {
  await delay(500)
  return mockUsers.find((user) => user.id === vendorId && user.user_type === "vendor") || null
}

export async function getSupplierData(supplierId: string) {
  await delay(500)
  return mockUsers.find((user) => user.id === supplierId && user.user_type === "supplier") || null
}

export async function getSuppliers() {
  await delay(500)
  return mockSuppliers
}

export async function getProducts() {
  await delay(500)
  return mockProducts
}

export async function getSupplierProducts(supplierId: string) {
  await delay(500)
  return mockProducts.filter((product) => product.supplier_id === supplierId)
}

export async function getVendorOrders(vendorId: string) {
  await delay(500)
  return mockOrders.filter((order) => order.vendor_id === vendorId)
}

export async function getSupplierOrders(supplierId: string) {
  await delay(500)
  return mockOrders.filter((order) => order.supplier_id === supplierId)
}

export async function createOrder(orderData: any) {
  await delay(1000)

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    vendor_id: orderData.vendor_id,
    vendor_name: "Rajesh Street Food", // In real app, fetch from user data
    vendor_phone: "+91 9876543210", // In real app, fetch from user data
    supplier_id: "supplier-1", // In real app, determine from items
    supplier_name: "Kumar Wholesale", // In real app, fetch from supplier data
    total_amount: orderData.total_amount,
    status: "pending",
    created_at: new Date().toISOString(),
    items: orderData.items.map((item: any) => ({
      product_id: item.product_id,
      product_name: mockProducts.find((p) => p.id === item.product_id)?.name || "Unknown Product",
      quantity: item.quantity,
      price: item.price,
    })),
    delivery_address: orderData.delivery_address,
  }

  mockOrders.push(newOrder)
  return newOrder
}

export async function addProduct(productData: any) {
  await delay(1000)

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: productData.name,
    price: productData.price,
    unit: productData.unit,
    category: productData.category,
    description: productData.description,
    min_order_quantity: productData.min_order_quantity,
    availability: productData.availability,
    stock_quantity: productData.stock_quantity,
    supplier_id: productData.supplier_id,
    supplier_name: "Kumar Wholesale", // In real app, fetch from supplier data
  }

  mockProducts.push(newProduct)
  return newProduct
}

export async function updateProduct(productId: string, productData: Partial<Product>) {
  await delay(1000)

  const index = mockProducts.findIndex((product) => product.id === productId)
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...productData }
    return mockProducts[index]
  }
  throw new Error("Product not found")
}

export async function deleteProduct(productId: string) {
  await delay(1000)

  const index = mockProducts.findIndex((product) => product.id === productId)
  if (index !== -1) {
    mockProducts.splice(index, 1)
    return true
  }
  throw new Error("Product not found")
}

export async function updateOrderStatus(orderId: string, status: string) {
  await delay(1000)

  const index = mockOrders.findIndex((order) => order.id === orderId)
  if (index !== -1) {
    mockOrders[index].status = status as any
    return mockOrders[index]
  }
  throw new Error("Order not found")
}
