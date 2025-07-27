"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Truck, Shield, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [userType, setUserType] = useState<"vendor" | "supplier" | null>(null)

  const features = [
    {
      icon: Shield,
      title: "Verified Suppliers",
      description: "All suppliers are verified with quality certifications and background checks",
    },
    {
      icon: TrendingDown,
      title: "Group Ordering",
      description: "Join with other vendors to get bulk pricing and reduce costs by up to 30%",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description: "Track your orders in real-time with guaranteed delivery windows",
    },
    {
      icon: Users,
      title: "Community Trust",
      description: "Rating and review system based on real vendor experiences",
    },
  ]

  const stats = [
    { label: "Active Vendors", value: "2,500+" },
    { label: "Verified Suppliers", value: "450+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Average Savings", value: "28%" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VendorConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Street Food Vendors with
            <span className="text-orange-500"> Trusted Suppliers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            End the struggle of finding quality raw materials. Join India's largest network of verified suppliers and
            get access to transparent pricing, group discounts, and reliable delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/vendor-dashboard">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                I'm a Vendor
              </Button>
            </Link>
            <Link href="/supplier-dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 bg-transparent"
              >
                I'm a Supplier
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why VendorConnect Works</h2>
            <p className="text-xl text-gray-600">Built specifically for India's street food ecosystem</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Compare</h3>
              <p className="text-gray-600">
                Search verified suppliers, compare prices, and check quality ratings from other vendors
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Order & Save</h3>
              <p className="text-gray-600">
                Place individual orders or join group orders with nearby vendors for better pricing
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Receive</h3>
              <p className="text-gray-600">
                Track your delivery in real-time and receive quality materials on schedule
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Vendors Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "VendorConnect helped me reduce my raw material costs by 25%. The group ordering feature is amazing!"
                </p>
                <div className="font-semibold">Rajesh Kumar</div>
                <div className="text-sm text-gray-500">Chaat Vendor, Delhi</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally found reliable suppliers for my dosa stall. Quality is consistent and delivery is always on
                  time."
                </p>
                <div className="font-semibold">Priya Sharma</div>
                <div className="text-sm text-gray-500">Dosa Vendor, Bangalore</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The verification system gives me confidence. I know I'm getting quality ingredients every time."
                </p>
                <div className="font-semibold">Mohammed Ali</div>
                <div className="text-sm text-gray-500">Biryani Vendor, Mumbai</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Supply Chain?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of vendors who have already improved their business with VendorConnect
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VendorConnect</span>
              </div>
              <p className="text-gray-400">Connecting India's street food vendors with trusted suppliers.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/vendor-dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/suppliers" className="hover:text-white">
                    Find Suppliers
                  </Link>
                </li>
                <li>
                  <Link href="/group-orders" className="hover:text-white">
                    Group Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/supplier-dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white">
                    Get Verified
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-white">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VendorConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
