"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  ShoppingCart,
  Star,
  MapPin,
  Clock,
  Users,
  TrendingDown,
  Package,
  Truck,
  Bell,
  Filter,
  Eye,
  LogOut,
  Plus,
  Minus,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/toast"

import { getCurrentUserProfile, logoutUser } from "@/lib/auth"
import {
  getVerifiedSuppliers,
  searchProducts,
  getOrdersByVendor,
  getOrderDetails,
  trackOrder,
  placeOrder,
} from "@/lib/database"

export default function VendorDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [trackingInfo, setTrackingInfo] = useState(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [cart, setCart] = useState([])
  const [deliveryAddress, setDeliveryAddress] = useState("")

  const [profile, setProfile] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [orders, setOrders] = useState([])
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
      setDeliveryAddress(userProfile.vendor_profiles?.address || "")

      const [suppliersResult, ordersResult] = await Promise.all([
        getVerifiedSuppliers(userProfile.vendor_profiles?.city),
        getOrdersByVendor(userProfile.id),
      ])

      if (suppliersResult.success) setSuppliers(suppliersResult.data)
      if (ordersResult.success) setOrders(ordersResult.data)
    }

    setIsLoading(false)
  }

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const result = await searchProducts(searchQuery, selectedCategory)
      if (result.success) {
        setSuppliers(result.data)
      }
    } else {
      loadDashboardData()
    }
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

  const handleViewOrder = async (orderId: string) => {
    const result = await getOrderDetails(orderId)
    if (result.success) {
      setSelectedOrder(result.data)
    }
  }

  const handleTrackOrder = async (orderId: string) => {
    const result = await trackOrder(orderId)
    if (result.success) {
      setTrackingInfo(result.data)
    }
  }

  const addToCart = (product, supplierId) => {
    const existingItem = cart.find((item) => item.productId === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: Number.parseInt(product.price.replace(/[₹,]/g, "")),
          quantity: 1,
          unit: product.unit,
          supplierId,
        },
      ])
    }
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
      variant: "success",
    })
  }

  const updateCartQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = Math.max(0, item.quantity + change)
            return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean),
    )
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    const orderData = {
      vendorId: profile.id,
      supplierId: cart[0].supplierId,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryAddress,
      notes: "",
    }

    const result = await placeOrder(orderData)
    if (result.success) {
      toast({
        title: "Order placed successfully!",
        description: `Order ${result.data.id} has been confirmed.`,
        variant: "success",
      })
      setCart([])
      setOrderDialogOpen(false)
      loadDashboardData()
    } else {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "vegetables", name: "Vegetables" },
    { id: "spices", name: "Spices" },
    { id: "grains", name: "Grains" },
    { id: "dairy", name: "Dairy" },
    { id: "oil", name: "Oil & Ghee" },
  ]

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      (selectedCategory === "all" || supplier.category.toLowerCase() === selectedCategory) &&
      (searchQuery === "" ||
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.products.some((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-orange-600">
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
              Welcome back, {profile.username || profile.full_name}!
            </h1>
          )}
          <p className="text-gray-600">Find the best suppliers for your business</p>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="suppliers" className="text-xs sm:text-sm">
              Find Suppliers
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm">
              My Orders
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs sm:text-sm">
              Group Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-4 sm:space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search suppliers or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{cart.length} items in cart</span>
                      <span className="text-sm text-gray-600 ml-2">Total: ₹{cartTotal}</span>
                    </div>
                    <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          Review Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Review Your Order</DialogTitle>
                          <DialogDescription>Review your items and confirm your order</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="max-h-60 overflow-y-auto">
                            {cart.map((item) => (
                              <div key={item.productId} className="flex justify-between items-center py-2 border-b">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{item.name}</div>
                                  <div className="text-xs text-gray-500">
                                    ₹{item.price}/{item.unit}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateCartQuantity(item.productId, -1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateCartQuantity(item.productId, 1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="text-sm font-semibold ml-4">₹{item.price * item.quantity}</div>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="delivery-address">Delivery Address</Label>
                            <Textarea
                              id="delivery-address"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Enter delivery address"
                              rows={2}
                            />
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-bold">Total: ₹{cartTotal}</span>
                            <Button onClick={handlePlaceOrder} className="bg-orange-500 hover:bg-orange-600">
                              Place Order
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suppliers Grid */}
            <div className="grid gap-4 sm:gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <CardTitle className="text-lg sm:text-xl">{supplier.name}</CardTitle>
                          {supplier.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              Verified
                            </Badge>
                          )}
                          {supplier.groupOrderActive && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              Group Order
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                            <span>{supplier.rating}</span>
                            <span>({supplier.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{supplier.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{supplier.deliveryTime}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {supplier.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      {supplier.products.map((product, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="font-medium text-sm mb-1">{product.name}</div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-green-600 text-sm">{product.price}</span>
                            <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">Stock: {product.stock}</div>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product, supplier.id)}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-xs"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="text-sm text-gray-600">Min Order: {supplier.minOrder}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-xs"
                          onClick={() => {
                            setSelectedSupplier(supplier)
                            setOrderDialogOpen(true)
                          }}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">My Orders</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-sm sm:text-base">#{order.id}</span>
                          {order.type === "group" && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              Group Order ({order.groupMembers} members)
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>{order.supplier}</strong>
                        </div>
                        <div className="text-sm text-gray-600">{order.items}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg mb-1">{order.total}</div>
                        <Badge
                          variant={order.status === "In Transit" ? "default" : "secondary"}
                          className={order.status === "In Transit" ? "bg-green-100 text-green-700" : ""}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Expected: {order.estimatedDelivery}</span>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                              className="text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                              <DialogDescription>Order #{order.id}</DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Items:</h4>
                                  {selectedOrder.itemDetails?.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm py-1">
                                      <span>
                                        {item.name} ({item.quantity}
                                        {item.unit})
                                      </span>
                                      <span>₹{item.total}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="border-t pt-2">
                                  <div className="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span>{selectedOrder.total}</span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-1">Delivery Address:</h4>
                                  <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTrackOrder(order.id)}
                              className="text-xs"
                            >
                              <Truck className="w-3 h-3 mr-1" />
                              Track
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Track Order</DialogTitle>
                              <DialogDescription>Order #{order.id}</DialogDescription>
                            </DialogHeader>
                            {trackingInfo && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Current Status: {trackingInfo.status}</h4>
                                  <p className="text-sm text-gray-600">Tracking ID: {trackingInfo.trackingId}</p>
                                  <p className="text-sm text-gray-600">
                                    Current Location: {trackingInfo.currentLocation}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Updates:</h4>
                                  <div className="space-y-2">
                                    {trackingInfo.updates?.map((update, index) => (
                                      <div key={index} className="flex justify-between text-sm">
                                        <div>
                                          <div className="font-medium">{update.status}</div>
                                          <div className="text-gray-500">{update.location}</div>
                                        </div>
                                        <div className="text-gray-500">{update.time}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4 sm:space-y-6">
            <div className="text-center py-8 sm:py-12">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Join Group Orders</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
                Team up with nearby vendors to get bulk pricing and save up to 30% on your orders
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      Active Group Order
                    </CardTitle>
                    <CardDescription className="text-sm">Spice Kingdom - Red Chili Powder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Current Members:</span>
                        <span className="font-semibold">8/10</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Your Savings:</span>
                        <span className="font-semibold text-green-600">₹120 (25%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Closes in:</span>
                        <span className="font-semibold text-orange-600">2 hours</span>
                      </div>
                      <Button className="w-full text-sm">Join Group Order</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      Start New Group
                    </CardTitle>
                    <CardDescription className="text-sm">Create a group order for your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">• Minimum 5 members required</div>
                      <div className="text-sm text-gray-600">• Save 15-30% on bulk orders</div>
                      <div className="text-sm text-gray-600">• Automatic member matching</div>
                      <Button variant="outline" className="w-full bg-transparent text-sm">
                        Create Group Order
                      </Button>
                    </div>
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
