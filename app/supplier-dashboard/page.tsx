"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Menu,
  X,
  MapPin,
  Phone,
  Star,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import {
  getSupplierData,
  getSupplierProducts,
  getSupplierOrders,
  addProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
} from "@/lib/database"

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
}

interface Order {
  id: string
  vendor_name: string
  vendor_phone: string
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

interface SupplierStats {
  total_revenue: number
  total_orders: number
  pending_orders: number
  total_products: number
  avg_rating: number
}

export default function SupplierDashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<SupplierStats>({
    total_revenue: 0,
    total_orders: 0,
    pending_orders: 0,
    total_products: 0,
    avg_rating: 4.5,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [supplierData, setSupplierData] = useState<any>(null)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "",
    category: "",
    description: "",
    min_order_quantity: "",
    stock_quantity: "",
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [supplierInfo, productsData, ordersData] = await Promise.all([
        getSupplierData(user?.id || ""),
        getSupplierProducts(user?.id || ""),
        getSupplierOrders(user?.id || ""),
      ])

      setSupplierData(supplierInfo)
      setProducts(productsData)
      setOrders(ordersData)

      // Calculate stats
      const totalRevenue = ordersData
        .filter((order: Order) => order.status === "delivered")
        .reduce((sum: number, order: Order) => sum + order.total_amount, 0)

      setStats({
        total_revenue: totalRevenue,
        total_orders: ordersData.length,
        pending_orders: ordersData.filter((order: Order) => order.status === "pending").length,
        total_products: productsData.length,
        avg_rating: 4.5,
      })
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

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...newProduct,
        price: Number.parseFloat(newProduct.price),
        min_order_quantity: Number.parseInt(newProduct.min_order_quantity),
        stock_quantity: Number.parseInt(newProduct.stock_quantity),
        supplier_id: user?.id || "",
        availability: true,
      }

      await addProduct(productData)
      setNewProduct({
        name: "",
        price: "",
        unit: "",
        category: "",
        description: "",
        min_order_quantity: "",
        stock_quantity: "",
      })
      setIsAddProductOpen(false)
      await loadDashboardData()

      toast({
        title: "Success",
        description: "Product added successfully",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      await updateProduct(editingProduct.id, editingProduct)
      setEditingProduct(null)
      await loadDashboardData()

      toast({
        title: "Success",
        description: "Product updated successfully",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      await loadDashboardData()

      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      await loadDashboardData()

      toast({
        title: "Success",
        description: "Order status updated successfully",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

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
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
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
          <h1 className="text-lg font-semibold text-gray-900">SupplierHub</h1>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>{supplierData?.username?.[0]?.toUpperCase() || "S"}</AvatarFallback>
        </Avatar>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{supplierData?.username?.[0]?.toUpperCase() || "S"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{supplierData?.username || "Supplier"}</p>
                  <p className="text-sm text-gray-500">Supplier Dashboard</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                <Package className="h-4 w-4 mr-3" />
                Products
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                <Users className="h-4 w-4 mr-3" />
                Orders
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
              <h1 className="text-xl font-bold text-gray-900">SupplierHub</h1>
            </div>

            <div className="mt-8 px-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{supplierData?.username?.[0]?.toUpperCase() || "S"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">Welcome, {supplierData?.username || "Supplier"}</p>
                  <p className="text-sm text-gray-500">Supplier Dashboard</p>
                </div>
              </div>
            </div>

            <nav className="mt-8 flex-1 px-4 space-y-2">
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</h3>
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-3" />
                  Products
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-3" />
                  Orders
                  {stats.pending_orders > 0 && <Badge className="ml-auto bg-orange-500">{stats.pending_orders}</Badge>}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  Analytics
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
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.total_revenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">From {stats.total_orders} orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending_orders}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_products}</div>
                  <p className="text-xs text-muted-foreground">In your catalog</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avg_rating}</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="products" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">
                  Orders {stats.pending_orders > 0 && `(${stats.pending_orders})`}
                </TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Product Management</h2>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Add a new product to your catalog</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Product Name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          />
                          <Input
                            placeholder="Unit (kg, pieces)"
                            value={newProduct.unit}
                            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                          />
                        </div>
                        <Input
                          placeholder="Category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        />
                        <Textarea
                          placeholder="Description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Min Order Qty"
                            type="number"
                            value={newProduct.min_order_quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, min_order_quantity: e.target.value })}
                          />
                          <Input
                            placeholder="Stock Quantity"
                            type="number"
                            value={newProduct.stock_quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleAddProduct} className="w-full">
                          Add Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription className="text-sm">{product.category}</CardDescription>
                          </div>
                          <Badge variant={product.availability ? "default" : "secondary"}>
                            {product.availability ? "Available" : "Out of Stock"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                            <span className="text-sm text-gray-500">/{product.unit}</span>
                          </div>
                          <span className="text-xs text-gray-500">Stock: {product.stock_quantity}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                                <DialogDescription>Update product information</DialogDescription>
                              </DialogHeader>
                              {editingProduct && (
                                <div className="space-y-4">
                                  <Input
                                    placeholder="Product Name"
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input
                                      placeholder="Price"
                                      type="number"
                                      value={editingProduct.price.toString()}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          price: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                    />
                                    <Input
                                      placeholder="Unit"
                                      value={editingProduct.unit}
                                      onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                                    />
                                  </div>
                                  <Input
                                    placeholder="Category"
                                    value={editingProduct.category}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                  />
                                  <Textarea
                                    placeholder="Description"
                                    value={editingProduct.description}
                                    onChange={(e) =>
                                      setEditingProduct({ ...editingProduct, description: e.target.value })
                                    }
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input
                                      placeholder="Min Order Qty"
                                      type="number"
                                      value={editingProduct.min_order_quantity.toString()}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          min_order_quantity: Number.parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                    <Input
                                      placeholder="Stock Quantity"
                                      type="number"
                                      value={editingProduct.stock_quantity.toString()}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          stock_quantity: Number.parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                  <Button onClick={handleUpdateProduct} className="w-full">
                                    Update Product
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <div className="grid gap-4">
                  {orders.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No orders yet</p>
                        <p className="text-sm text-gray-400">Orders from vendors will appear here</p>
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
                                {order.vendor_name} • {new Date(order.created_at).toLocaleDateString()}
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
                                      <h4 className="font-medium mb-2">Customer Info:</h4>
                                      <div className="space-y-1 text-sm">
                                        <p>{order.vendor_name}</p>
                                        <div className="flex items-center">
                                          <Phone className="h-4 w-4 mr-2" />
                                          {order.vendor_phone}
                                        </div>
                                      </div>
                                    </div>
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
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                {order.items.length} items • ₹{order.total_amount.toFixed(2)}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-4 w-4 mr-1" />
                                {order.vendor_phone}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {order.delivery_address}
                              </div>
                            </div>
                            {order.status !== "delivered" && (
                              <div className="flex flex-wrap gap-2">
                                {order.status === "pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                                    className="bg-blue-500 hover:bg-blue-600"
                                  >
                                    Confirm Order
                                  </Button>
                                )}
                                {order.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                                    className="bg-purple-500 hover:bg-purple-600"
                                  >
                                    Mark as Shipped
                                  </Button>
                                )}
                                {order.status === "shipped" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    Mark as Delivered
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>Your earnings summary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Revenue</span>
                        <span className="text-lg font-bold text-green-600">₹{stats.total_revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Order Value</span>
                        <span className="text-lg font-bold">
                          ₹{stats.total_orders > 0 ? (stats.total_revenue / stats.total_orders).toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed Orders</span>
                        <span className="text-lg font-bold">
                          {orders.filter((o) => o.status === "delivered").length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Business Metrics</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Customer Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-lg font-bold">{stats.avg_rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Products</span>
                        <span className="text-lg font-bold">{products.filter((p) => p.availability).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending Orders</span>
                        <span className="text-lg font-bold text-orange-600">{stats.pending_orders}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest orders and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-medium">Order #{order.id.slice(-8)}</p>
                              <p className="text-sm text-gray-500">{order.vendor_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{order.total_amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
