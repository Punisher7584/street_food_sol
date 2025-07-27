import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found, skipping auth middleware")
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protected routes
    const protectedRoutes = ["/vendor-dashboard", "/supplier-dashboard", "/profile"]
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // If accessing protected route without session, redirect to login
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // If logged in and accessing auth pages, redirect to appropriate dashboard
    if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
      // Get user profile to determine redirect
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

      if (profile) {
        const dashboardUrl = profile.user_type === "vendor" ? "/vendor-dashboard" : "/supplier-dashboard"
        return NextResponse.redirect(new URL(dashboardUrl, req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
