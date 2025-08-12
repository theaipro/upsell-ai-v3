"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "./supabase-client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User extends SupabaseUser {
  // Add any custom user properties here if needed in the future
}

interface Company {
  id: string
  name: string
  address: string
  phone: string
  email: string
  deliveryRange: number
  deliveryFee: number
  minOrder: number
  freeDeliveryThreshold: number
}

interface AuthContextType {
  user: User | null
  company: Company | null
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error: string | null }>
  createCompany: (companyData: Omit<Company, "id">) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  needsVerification: boolean
  needsOnboarding: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser as User)
      setIsLoading(false)

      if (currentUser) {
        // TODO: Fetch company data based on user's companyId
      } else {
        setCompany(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Store user's name for onboarding
    if (typeof window !== "undefined") {
      localStorage.setItem("userNameForOnboarding", name)
    }

    // Check if user needs verification
    if (data.user && !data.user.email_confirmed_at) {
      setNeedsVerification(true)
    }

    return { success: true, error: null }
  }

  const verifyEmail = async (email: string, code: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      setUser(data.user as User)
      setNeedsVerification(false)
    }

    return { success: true, error: null }
  }

  const createCompany = async (companyData: Omit<Company, "id">): Promise<boolean> => {
    if (!user) {
      console.error("No user logged in to create a company.")
      return false
    }

    // Insert new company
    const { data: newCompany, error: companyError } = await supabase
      .from("companies")
      .insert([
        {
          name: companyData.name,
          address: companyData.address,
          phone: companyData.phone,
          email: companyData.email,
          delivery_range: companyData.deliveryRange,
          delivery_fee: companyData.deliveryFee,
          min_order_value: companyData.minOrder,
          free_delivery_threshold: companyData.freeDeliveryThreshold,
        },
      ])
      .select()
      .single()

    if (companyError || !newCompany) {
      console.error("Error creating company:", companyError)
      return false
    }

    // Retrieve user's name from local storage
    const userName =
      typeof window !== "undefined" ? localStorage.getItem("userNameForOnboarding") : null

    const staffName = userName || user.email || "Owner"

    // Create staff entry for the owner
    const { error: staffError } = await supabase.from("staff").insert([
      {
        company_id: newCompany.id,
        user_id: user.id,
        name: staffName,
        email: user.email,
        role: "owner",
        status: "active",
        joined_at: new Date().toISOString(),
      },
    ])

    if (staffError) {
      console.error("Error creating staff entry:", staffError)
      // Ideally, rollback company creation in a transaction
      return false
    }

    // Clean up local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userNameForOnboarding")
    }

    const companyForState: Company = {
      id: newCompany.id,
      name: newCompany.name,
      address: newCompany.address,
      phone: newCompany.phone,
      email: newCompany.email,
      deliveryRange: newCompany.delivery_range,
      deliveryFee: newCompany.delivery_fee,
      minOrder: newCompany.min_order_value,
      freeDeliveryThreshold: newCompany.free_delivery_threshold,
    }

    setCompany(companyForState)
    setNeedsOnboarding(false)

    return true
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    setUser(data.user as User)
    return { success: true, error: null }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCompany(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        login,
        signup,
        verifyEmail,
        createCompany,
        logout,
        isLoading,
        needsVerification,
        needsOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
