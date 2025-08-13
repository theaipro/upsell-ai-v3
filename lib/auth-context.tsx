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
        // Fetch staff and company details
        const { data: staffData, error: staffError } = await supabase
          .from("staff")
          .select(`*, companies(*)`)
          .eq("user_id", currentUser.id)
          .single()

        if (staffError && staffError.code !== "PGRST116") { // PGRST116 = 'single row not found'
          console.error("Error fetching staff data:", staffError)
          setCompany(null)
          setNeedsOnboarding(false) // Unsure, may need onboarding
        } else if (staffData && staffData.companies) {
          const fetchedCompany = staffData.companies
          const companyForState: Company = {
            id: fetchedCompany.id,
            name: fetchedCompany.name,
            address: fetchedCompany.address || "",
            phone: fetchedCompany.phone || "",
            email: fetchedCompany.email || "",
            deliveryRange: fetchedCompany.delivery_range || 0,
            deliveryFee: fetchedCompany.delivery_fee || 0,
            minOrder: fetchedCompany.min_order_value || 0,
            freeDeliveryThreshold: fetchedCompany.free_delivery_threshold || 0,
          }
          setCompany(companyForState)
          setNeedsOnboarding(false)
        } else {
          // No staff record or no associated company
          setCompany(null)
          setNeedsOnboarding(true)
        }
      } else {
        setCompany(null)
        setNeedsOnboarding(false)
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

    // Retrieve user's name from local storage, with fallbacks.
    const userName =
      typeof window !== "undefined" ? localStorage.getItem("userNameForOnboarding") : null
    const staffName = userName || user.email || "Owner"

    // Call the transactional database function
    const { data: newCompanyId, error } = await supabase.rpc("create_company_for_user", {
      company_name: companyData.name,
      company_address: companyData.address,
      company_phone: companyData.phone,
      company_email: companyData.email,
      company_delivery_range: companyData.deliveryRange,
      company_delivery_fee: companyData.deliveryFee,
      company_min_order_value: companyData.minOrder,
      company_free_delivery_threshold: companyData.freeDeliveryThreshold,
      admin_name: staffName,
    })

    if (error) {
      console.error("Error creating company:", error)
      return false
    }

    // Clean up local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userNameForOnboarding")
    }

    // Optimistically update the company state.
    // A full fetch might be better for production to ensure data consistency.
    const companyForState: Company = {
      id: newCompanyId,
      ...companyData,
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
