"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  TrendingUp,
  Users,
  Star,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Bell,
  LogOut,
  Menu,
  X,
  Save,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/toast"

import { getCurrentUserProfile, logoutUser } from "@/lib/auth"
import {
  getOrdersBySupplier,
  getProductsBySupplier,
  updateOrderStatus,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/database"

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "kg",
    description: "",
    minOrderQuantity: "1",
  })

  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [supplierProducts, setSupplierProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)

    const userProfile = await getCurrentUserProfile()
    if (userProfile) {
      setProfile(userProfile)

      const [ordersResult, productsResult] = await Promise.all([
        getOrdersBySupplier(userProfile.id),
        getProductsBySupplier(userProfile.id),
      ])

      if (ordersResult.success) setOrders(ordersResult.data)
      if (productsResult.success) setSupplierProducts(productsResult.data)
    }

    setIsLoading(false)
  }

  const handleLogout = async () => {
    const result = await logoutUser()
    if (result.success) {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        variant: "success",
      })
      window.location.href = "/login"
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      toast({
        title: "Order updated",
        description: `Order status updated to ${newStatus}`,
        variant: "success",
      })
      loadDashboardData()
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const productData = {
      supplier_id: profile.id,
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      unit: newProduct.unit,
      stock_quantity: Number.parseInt(newProduct.stock),
      min_order_quantity: Number.parseInt(newProduct.minOrderQuantity),
      description: newProduct.description,
      is_active: true,
    }

    const result = await addProduct(productData)
    if (result.success) {
      toast({
        title: "Product added",
        description: "New product has been added successfully",
        variant: "success",
      })
      setNewProduct({
        name: "",
        category: "",
        price: "",
        stock: "",
        unit: "kg",
        description: "",
        minOrderQuantity: "1",
      })
      loadDashboardData()
    }
  }

  const handleUpdateProduct = async (productId: string, updatedData: any) => {
    const result = await updateProduct(productId, updatedData)
    if (result.success) {
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
        variant: "success",
      })
      setEditingProduct(null)
      loadDashboardData()
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    const result = await deleteProduct(productId)
    if (result.success) {
      toast({
        title: "Product deleted",
        description: "Product has been removed from your inventory",
        variant: "success",
      })
      loadDashboardData()
    }
  }

  const stats = [
    {
      title: "Total Orders",
      value: "1,247",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Revenue",
      value: "₹2,45,680",
      change: "+18%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Active Vendors",
      value: "89",
      change: "+5%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  const recentOrders = [
    {
      id: "ORD001",
      vendor: "Rajesh Kumar",
      items: "Onions (10kg), Tomatoes (5kg)",
      total: "₹425",
      status: "confirmed",
      time: "2 hours ago",
      type: "individual",
      deliveryAddress: "Shop 12, Main Market, Delhi",
    },
    {
      id: "GRP002",
      vendor: "Group Order (8 vendors)",
      items: "Red Chili Powder (16kg)",
      total: "₹2,880",
      status: "processing",
      time: "4 hours ago",
      type: "group",
      deliveryAddress: "Various locations in Delhi",
    },
    {
      id: "ORD003",
      vendor: "Priya Sharma",
      items: "Potatoes (20kg)",
      total: "₹500",
      status: "delivered",
      time: "1 day ago",
      type: "individual",
      deliveryAddress: "Dosa Corner, CP, Delhi",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700"
      case "processing":
        return "bg-yellow-100 text-yellow-700"
      case "delivered":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <Clock className="w-4 h-4" />
      case "delivered":
        return <Truck className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">VendorConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">
                  {profile?.username?.charAt(0).toUpperCase() || profile?.full_name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" size="sm" className="justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="justify-start w-full">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          {profile && (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome, {profile.username || profile.full_name}!
            </h1>
          )}
          <p className="text-gray-600">Manage your inventory and orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm">
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm">
              Products
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change} from last month</p>
                      </div>
                      <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">{getStatusIcon(order.status)}</div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium text-sm sm:text-base">#{order.id}</span>
                            {order.type === "group" && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                Group
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{order.vendor}</p>
                          <p className="text-sm text-gray-500">{order.items}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="text-right">
                          <p className="font-bold text-sm sm:text-base">{order.total}</p>
                          <Badge className={getStatusColor(order.status) + " text-xs"}>{order.status}</Badge>
                          <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>Order #{order.id}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Customer:</h4>
                                  <p className="text-sm">{order.vendor}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Items:</h4>
                                  <p className="text-sm">{order.items}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Delivery Address:</h4>
                                  <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="font-semibold">Total: {order.total}</span>
                                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                              className="text-xs"
                            >
                              Process
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Order Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                  Export
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-sm sm:text-base">#{order.id}</span>
                          {order.type === "group" && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              Group Order
                            </Badge>
                          )}
                          <Badge className={getStatusColor(order.status) + " text-xs"}>{order.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>{order.vendor}</strong>
                        </div>
                        <div className="text-sm text-gray-600">{order.items}</div>
                        <div className="text-xs text-gray-500 mt-2">{order.time}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg mb-2">{order.total}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs bg-transparent">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                              className="text-xs"
                            >
                              Process Order
                            </Button>
                          )}
                          {order.status === "processing" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                              className="text-xs bg-green-600 hover:bg-green-700"
                            >
                              Mark Delivered
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Product Inventory</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="text-xs sm:text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Add a new product to your inventory</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-name">Product Name *</Label>
                        <Input
                          id="product-name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g., Fresh Onions"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Input
                          id="category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          placeholder="e.g., Vegetables"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price per unit *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                          placeholder="kg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stock">Stock Quantity *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="min-order">Min Order Qty</Label>
                        <Input
                          id="min-order"
                          type="number"
                          value={newProduct.minOrderQuantity}
                          onChange={(e) => setNewProduct({ ...newProduct, minOrderQuantity: e.target.value })}
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Product description..."
                        rows={2}
                      />
                    </div>
                    <Button onClick={handleAddProduct} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {supplierProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-base sm:text-lg">{product.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          {product.status === "low_stock" && (
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <div className="font-semibold">{product.price}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Stock:</span>
                            <div className="font-semibold">{product.stock}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Orders:</span>
                            <div className="font-semibold">{product.orders}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs bg-transparent">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                              <DialogDescription>Update product information</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Product Name</Label>
                                  <Input defaultValue={product.name} />
                                </div>
                                <div>
                                  <Label>Category</Label>
                                  <Input defaultValue={product.category} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Price</Label>
                                  <Input defaultValue={product.priceValue} type="number" />
                                </div>
                                <div>
                                  <Label>Stock</Label>
                                  <Input defaultValue={product.stockValue} type="number" />
                                </div>
                              </div>
                              <Button className="w-full">
                                <Save className="w-4 h-4 mr-2" />
                                Update Product
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="text-center py-8 sm:py-12">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
                Track your performance, sales trends, and customer insights
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Sales Trends</CardTitle>
                    <CardDescription className="text-sm">Monthly revenue analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">₹2,45,680</div>
                    <div className="text-sm text-gray-600">+18% from last month</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Top Products</CardTitle>
                    <CardDescription className="text-sm">Best selling items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Onions</span>
                        <span className="text-sm font-semibold">45 orders</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tomatoes</span>
                        <span className="text-sm font-semibold">32 orders</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Potatoes</span>
                        <span className="text-sm font-semibold">28 orders</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Customer Satisfaction</CardTitle>
                    <CardDescription className="text-sm">Average ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl sm:text-3xl font-bold">4.8</span>
                    </div>
                    <div className="text-sm text-gray-600">Based on 234 reviews</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
