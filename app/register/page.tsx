"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Truck, Store, MapPin, User, Building, FileText, Shield } from "lucide-react"
import Link from "next/link"
import { registerUser, sendOTP, verifyOTP } from "@/lib/auth"

export default function RegisterPage() {
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    city: "",
    pincode: "",
    businessType: "",
    description: "",
    documents: null,
    agreeTerms: false,
  })

  const [step, setStep] = useState<"form" | "otp" | "success">("form")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (step === "form") {
      // Send OTP
      const result = await sendOTP(formData.phone, "registration")
      if (result.success) {
        setStep("otp")
      } else {
        setError(result.message)
      }
    } else if (step === "otp") {
      // Verify OTP and register
      const otpResult = await verifyOTP({ phone: formData.phone, otp, purpose: "registration" })
      if (otpResult.success) {
        const registerResult = await registerUser({
          email: formData.email,
          password: "temp123", // You should add password field to form
          phone: formData.phone,
          fullName: formData.name,
          username: formData.username,
          userType,
          businessName: formData.businessName,
          businessType: formData.businessType,
          companyName: formData.businessName,
          productCategories: formData.businessType.split(","),
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          businessDescription: formData.description,
        })

        if (registerResult.success) {
          setStep("success")
          setTimeout(() => {
            window.location.href = userType === "vendor" ? "/vendor-dashboard" : "/supplier-dashboard"
          }, 2000)
        } else {
          setError(registerResult.message)
        }
      } else {
        setError(otpResult.message)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
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
            <Link href="/login">
              <Button variant="ghost">Already have an account? Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join VendorConnect</h1>
          <p className="text-xl text-gray-600">Connect with India's largest network of food vendors and suppliers</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Choose your account type and fill in your details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "vendor" | "supplier")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  I'm a Vendor
                </TabsTrigger>
                <TabsTrigger value="supplier" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  I'm a Supplier
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                <TabsContent value="vendor" className="space-y-6 mt-0">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Vendor Account</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      Perfect for street food vendors, small restaurants, and food stall owners looking for reliable
                      suppliers.
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          placeholder="Choose a unique username"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Business Information
                    </h4>
                    <div>
                      <Label htmlFor="businessName">Business/Stall Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder="e.g., Rajesh's Chaat Corner"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Food Type *</Label>
                      <Input
                        id="businessType"
                        value={formData.businessType}
                        onChange={(e) => handleInputChange("businessType", e.target.value)}
                        placeholder="e.g., Chaat, Dosa, Biryani, etc."
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="supplier" className="space-y-6 mt-0">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Supplier Account</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      For wholesalers, distributors, and suppliers who want to connect with food vendors across India.
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Contact Person Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter contact person name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          placeholder="Choose a unique username"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="business@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Business Information
                    </h4>
                    <div>
                      <Label htmlFor="businessName">Company/Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder="e.g., Fresh Veggie Mart"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Product Categories *</Label>
                      <Input
                        id="businessType"
                        value={formData.businessType}
                        onChange={(e) => handleInputChange("businessType", e.target.value)}
                        placeholder="e.g., Vegetables, Spices, Grains, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Tell us about your business, products, and services..."
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Location Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location Information
                  </h4>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your complete address"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="Enter PIN code"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Verification */}
                {userType === "supplier" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Verification Documents
                    </h4>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Upload business documents for verification (GST certificate, business license, etc.)
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleInputChange("documents", e.target.files)}
                      />
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-orange-500 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-orange-500 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {step === "otp" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">Verify Your Phone Number</h3>
                      <p className="text-gray-600">Enter the OTP sent to {formData.phone}</p>
                    </div>
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={!formData.agreeTerms || isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : step === "form"
                      ? "Send OTP"
                      : step === "otp"
                        ? "Verify & Register"
                        : "Success!"}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                Vendor Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Access to 450+ verified suppliers</li>
                <li>• Save up to 30% with group ordering</li>
                <li>• Quality guaranteed products</li>
                <li>• Real-time order tracking</li>
                <li>• 24/7 customer support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-green-600" />
                Supplier Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Connect with 2,500+ active vendors</li>
                <li>• Increase sales by 40% on average</li>
                <li>• Verified vendor network</li>
                <li>• Analytics and insights dashboard</li>
                <li>• Secure payment processing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
