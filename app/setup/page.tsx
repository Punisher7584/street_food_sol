"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Copy, ExternalLink, Truck, Settings } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function SetupPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const isConfigured = isSupabaseConfigured()

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const envExample = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`

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
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Setup Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Settings className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">VendorConnect Setup</h1>
          <p className="text-xl text-gray-600">Configure your database to get started</p>
        </div>

        {/* Configuration Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isConfigured ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge
                  variant={isConfigured ? "default" : "secondary"}
                  className={isConfigured ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                >
                  {isConfigured ? "Configured" : "Demo Mode"}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  {isConfigured
                    ? "Supabase is configured and ready to use"
                    : "Running in demo mode. Configure Supabase for full functionality."}
                </p>
              </div>
              {isConfigured && <CheckCircle className="w-8 h-8 text-green-500" />}
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-6">
          {/* Step 1: Create Supabase Project */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                Create Supabase Project
              </CardTitle>
              <CardDescription>Set up your database backend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>
                    Go to{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      supabase.com
                    </a>
                  </li>
                  <li>Create a new account or sign in</li>
                  <li>Click "New Project"</li>
                  <li>Choose your organization and fill in project details</li>
                  <li>Wait for the project to be created</li>
                </ol>
              </div>
              <Button variant="outline" asChild>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase Dashboard
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Get API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                Get API Keys
              </CardTitle>
              <CardDescription>Copy your project URL and API key</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">In your Supabase project:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to Settings → API</li>
                  <li>Copy the "Project URL"</li>
                  <li>Copy the "anon public" API key</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                Set Environment Variables
              </CardTitle>
              <CardDescription>Configure your local environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="env-vars">Create a .env.local file in your project root:</Label>
                <div className="relative mt-2">
                  <Textarea id="env-vars" value={envExample} readOnly className="font-mono text-sm" rows={3} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(envExample, "env")}
                  >
                    {copied === "env" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Replace the placeholder values with your actual Supabase project URL and
                  API key.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Run Database Scripts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                Set Up Database
              </CardTitle>
              <CardDescription>Run the SQL scripts to create your database schema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">In your Supabase project:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to the SQL Editor</li>
                  <li>Run the scripts in this order:</li>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <code className="bg-white px-1 rounded">scripts/01-create-tables.sql</code>
                    </li>
                    <li>
                      <code className="bg-white px-1 rounded">scripts/02-row-level-security.sql</code>
                    </li>
                    <li>
                      <code className="bg-white px-1 rounded">scripts/03-seed-data.sql</code>
                    </li>
                    <li>
                      <code className="bg-white px-1 rounded">scripts/04-functions.sql</code>
                    </li>
                  </ul>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 5: Restart Application */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">5</span>
                </div>
                Restart Application
              </CardTitle>
              <CardDescription>Restart your development server to load the new environment variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700">
                  Stop your development server (Ctrl+C) and restart it with{" "}
                  <code className="bg-white px-1 rounded">npm run dev</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Mode Notice */}
        {!isConfigured && (
          <Card className="mt-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                Demo Mode Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                The application is currently running in demo mode with sample data. Complete the setup above to enable
                full functionality with real data persistence.
              </p>
              <div className="space-y-2 text-sm text-yellow-600">
                <p>
                  <strong>Demo Features:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Sample supplier and product data</li>
                  <li>Mock authentication (use OTP: 123456)</li>
                  <li>Simulated order management</li>
                  <li>No real data persistence</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {isConfigured && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                Setup Complete!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Your VendorConnect application is fully configured and ready to use.
              </p>
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700">Go to Application</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
