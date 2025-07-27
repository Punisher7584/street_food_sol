"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Shield,
  Star,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { getCurrentUserProfile } from "@/lib/auth"
import { updateVendorProfile, updateSupplierProfile } from "@/lib/database"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState<any>({})

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    const userProfile = await getCurrentUserProfile()
    if (userProfile) {
      setProfile(userProfile)
      setEditData(userProfile.user_type === "vendor" ? userProfile.vendor_profiles : userProfile.supplier_profiles)
    }
    setIsLoading(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(profile.user_type === "vendor" ? profile.vendor_profiles : profile.supplier_profiles)
  }

  const handleSave = async () => {
    setIsSaving(true)

    let result
    if (profile.user_type === "vendor") {
      result = await updateVendorProfile(profile.id, editData)
    } else {
      result = await updateSupplierProfile(profile.id, editData)
    }

    if (result.success) {
      setProfile((prev) => ({
        ...prev,
        [profile.user_type === "vendor" ? "vendor_profiles" : "supplier_profiles"]: result.data,
      }))
      setIsEditing(false)
    }

    setIsSaving(false)
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Profile not found</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const specificProfile = profile.user_type === "vendor" ? profile.vendor_profiles : profile.supplier_profiles
  const isVendor = profile.user_type === "vendor"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VendorConnect</span>
            </Link>
            <Link href={isVendor ? "/vendor-dashboard" : "/supplier-dashboard"}>
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={isVendor ? "default" : "secondary"}>{isVendor ? "Vendor" : "Supplier"}</Badge>
                    <Badge
                      variant={profile.verification_status === "verified" ? "default" : "secondary"}
                      className={
                        profile.verification_status === "verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {profile.verification_status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">{isVendor ? "Total Orders" : "Products Listed"}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{isVendor ? "24" : "12"}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">{isVendor ? "Total Spent" : "Revenue"}</span>
                </div>
                <div className="text-2xl font-bold text-green-600">₹{isVendor ? "12,450" : "45,680"}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Rating</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">4.8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="business">Business Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic contact and personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.full_name}</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.email}</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.phone}</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="verification">Verification Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <Badge
                        variant={profile.verification_status === "verified" ? "default" : "secondary"}
                        className={
                          profile.verification_status === "verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {profile.verification_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  {isVendor ? "Your food business details" : "Your supplier business details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isVendor ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="business_name">Business Name</Label>
                        {isEditing ? (
                          <Input
                            id="business_name"
                            value={editData.business_name || ""}
                            onChange={(e) => handleInputChange("business_name", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{specificProfile?.business_name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="business_type">Food Type</Label>
                        {isEditing ? (
                          <Input
                            id="business_type"
                            value={editData.business_type || ""}
                            onChange={(e) => handleInputChange("business_type", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{specificProfile?.business_type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company_name">Company Name</Label>
                        {isEditing ? (
                          <Input
                            id="company_name"
                            value={editData.company_name || ""}
                            onChange={(e) => handleInputChange("company_name", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{specificProfile?.company_name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="min_order_amount">Minimum Order Amount</Label>
                        {isEditing ? (
                          <Input
                            id="min_order_amount"
                            type="number"
                            value={editData.min_order_amount || ""}
                            onChange={(e) => handleInputChange("min_order_amount", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">₹{specificProfile?.min_order_amount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="product_categories">Product Categories</Label>
                      {isEditing ? (
                        <Input
                          id="product_categories"
                          value={editData.product_categories?.join(", ") || ""}
                          onChange={(e) => handleInputChange("product_categories", e.target.value.split(", "))}
                          placeholder="e.g., Vegetables, Spices, Grains"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {specificProfile?.product_categories?.map((category, index) => (
                            <Badge key={index} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="business_description">Business Description</Label>
                      {isEditing ? (
                        <Textarea
                          id="business_description"
                          value={editData.business_description || ""}
                          onChange={(e) => handleInputChange("business_description", e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">
                          {specificProfile?.business_description || "No description provided"}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Address Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Full Address</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          value={editData.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          rows={2}
                        />
                      ) : (
                        <p className="text-gray-900 mt-1">{specificProfile?.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        {isEditing ? (
                          <Input
                            id="city"
                            value={editData.city || ""}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{specificProfile?.city}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code</Label>
                        {isEditing ? (
                          <Input
                            id="pincode"
                            value={editData.pincode || ""}
                            onChange={(e) => handleInputChange("pincode", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{specificProfile?.pincode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
