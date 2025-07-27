"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, Phone, RefreshCw } from "lucide-react"
import Link from "next/link"
import { verifyOTP, sendOTP } from "@/lib/auth"
import { useSearchParams } from "next/navigation"

export default function OTPVerificationPage() {
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone") || ""
  const purpose = searchParams.get("purpose") || "registration"

  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [countdown, setCountdown] = useState(0)

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await verifyOTP({ phone, otp, purpose })

    if (result.success) {
      setSuccess("OTP verified successfully!")
      setTimeout(() => {
        // Redirect based on purpose
        if (purpose === "registration") {
          window.location.href = "/register?verified=true"
        } else if (purpose === "login") {
          window.location.href = "/login?verified=true"
        }
      }, 1500)
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError("")

    const result = await sendOTP(phone, purpose)

    if (result.success) {
      setSuccess("New OTP sent successfully!")
      setCountdown(60)

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setError(result.message)
    }

    setIsResending(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">VendorConnect</span>
              </Link>
            </div>
          </div>
        </header>
      </div>

      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-orange-500" />
            </div>
            <CardTitle>Verify Your Phone Number</CardTitle>
            <CardDescription>
              We've sent a 6-digit OTP to <strong>{phone}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isResending || countdown > 0}
                className="text-orange-500 hover:text-orange-600"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/register" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to registration
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
