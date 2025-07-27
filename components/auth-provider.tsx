"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { getCurrentUserProfile } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!isSupabaseConfigured()) {
        // For demo mode, set loading to false
        setLoading(false)
        return
      }

      const {
        data: { session },
      } = await supabase!.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        const userProfile = await getCurrentUserProfile()
        setProfile(userProfile)
      }

      setLoading(false)
    }

    getInitialSession()

    if (!isSupabaseConfigured()) {
      return
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const userProfile = await getCurrentUserProfile()
        setProfile(userProfile)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase!.auth.signOut()
    }
    setUser(null)
    setProfile(null)
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>
}
