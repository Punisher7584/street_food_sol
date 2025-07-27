"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/toast"
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Search,
  Plus,
  Minus,
  Eye,
  LogOut,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Truck,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { getVendorData, getSuppliers, getProducts, createOrder, getVendorOrders } from "@/lib/database"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  supplier: string
  unit: string
}

interface Order {
  id: string
  supplier_name: string
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
  delivery_address: string
}

interface Product {
  id: string
  name: string
  price: number
  unit: string
  supplier_name: string
  supplier_id: string
  category: string
  description: string
  min_order_quantity: number
  availability: boolean
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

export default function VendorDashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [vendorData, setVendorData] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [vendorInfo, suppliersData, productsData, ordersData] = await Promise.all([
        getVendorData(user?.id || ""),
        getSuppliers(),
        getProducts(),
        getVendorOrders(user?.id || ""),
      ])

      setVendorData(vendorInfo)
      setSuppliers(suppliersData)
      setProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
      toast({
        title: "Success",
        description: "Signed out successfully",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          supplier: product.supplier_name,
          unit: product.unit,
        },
      ])
    }
    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
      variant: "success",
    })
  }

  const updateCartQuantity = (id: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change)
            return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as CartItem[],
    )
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
    toast({
      title: "Removed from Cart",
      description: "Item removed from cart",
      variant: "success",
    })
  }

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      })
      return
    }

    try {
      const orderData = {
        vendor_id: user?.id || "",
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        delivery_address: vendorData?.address || "Default Address",
      }

      await createOrder(orderData)
      setCart([])
      await loadDashboardData()

      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory && product.availability
  })

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">VendorConnect</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>{vendorData?.username?.[0]?.toUpperCase() || "V"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{vendorData?.username?.[0]?.toUpperCase() || "V"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{vendorData?.username || "Vendor"}</p>
                  <p className="text-sm text-gray-500">Street Food Vendor</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                <Package className="h-4 w-4 mr-3" />
                Products
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingCart className="h-4 w-4 mr-3" />
                Cart ({cartItemCount})
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                <Users className="h-4 w-4 mr-3" />
                Suppliers
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">VendorConnect</h1>
            </div>

            <div className="mt-8 px-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{vendorData?.username?.[0]?.toUpperCase() || "V"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">Welcome, {vendorData?.username || "Vendor"}</p>
                  <p className="text-sm text-gray-500">Street Food Vendor</p>
                </div>
              </div>
            </div>

            <nav className="mt-8 flex-1 px-4 space-y-2">
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dashboard</h3>
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-3" />
                  Products
                </Button>
                <div className="relative">
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    Cart
                    {cartItemCount > 0 && <Badge className="ml-auto bg-orange-500">{cartItemCount}</Badge>}
                  </Button>
                </div>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-3" />
                  Suppliers
                </Button>
              </div>
            </nav>

            <div className="px-4 pb-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1 p-4 lg:p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {orders.filter((o) => o.status === "delivered").length} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cartItemCount}</div>
                  <p className="text-xs text-muted-foreground">₹{cartTotal.toFixed(2)} total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.length}</div>
                  <p className="text-xs text-muted-foreground">Available partners</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">Available items</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="products" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="cart">Cart {cartItemCount > 0 && `(${cartItemCount})`}</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products or suppliers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription className="text-sm">by {product.supplier_name}</CardDescription>
                          </div>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                            <span className="text-sm text-gray-500">/{product.unit}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Min: {product.min_order_quantity} {product.unit}
                          </span>
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Cart Tab */}
              <TabsContent value="cart" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shopping Cart</CardTitle>
                    <CardDescription>
                      {cartItemCount} items • Total: ₹{cartTotal.toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Your cart is empty</p>
                        <p className="text-sm text-gray-400">Add some products to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">by {item.supplier}</p>
                              <p className="text-sm font-medium text-green-600">
                                ₹{item.price}/{item.unit}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, -1)}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, 1)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-xl font-bold text-green-600">₹{cartTotal.toFixed(2)}</span>
                          </div>
                          <Button onClick={placeOrder} className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                            Place Order
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <div className="grid gap-4">
                  {orders.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No orders yet</p>
                        <p className="text-sm text-gray-400">Your orders will appear here</p>
                      </CardContent>
                    </Card>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                              <CardDescription>
                                {order.supplier_name} • {new Date(order.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Order Details</DialogTitle>
                                    <DialogDescription>Order #{order.id.slice(-8)}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Items:</h4>
                                      {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span>
                                            {item.product_name} x{item.quantity}
                                          </span>
                                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="border-t pt-2">
                                      <div className="flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span>₹{order.total_amount.toFixed(2)}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-1">Delivery Address:</h4>
                                      <p className="text-sm text-gray-600">{order.delivery_address}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                {order.items.length} items • ₹{order.total_amount.toFixed(2)}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {order.delivery_address}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Suppliers Tab */}
              <TabsContent value="suppliers" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {suppliers.map((supplier) => (
                    <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{supplier.business_name}</CardTitle>
                            <CardDescription>{supplier.contact_person}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{supplier.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {supplier.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {supplier.email}
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                            <span className="line-clamp-2">{supplier.address}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {supplier.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm text-gray-500">{supplier.total_orders} orders completed</span>
                          <Button size="sm" variant="outline">
                            View Products
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
