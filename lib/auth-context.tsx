"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  email: string
  name: string
  isVerified: boolean
  companyId?: string
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
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  verifyEmail: (code: string) => Promise<boolean>
  createCompany: (companyData: Omit<Company, "id">) => Promise<boolean>
  logout: () => void
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
    // Check for existing session
    const savedUser = localStorage.getItem("upsell-user")
    const savedCompany = localStorage.getItem("upsell-company")

    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)

      if (!userData.isVerified) {
        setNeedsVerification(true)
      } else if (!userData.companyId && !savedCompany) {
        setNeedsOnboarding(true)
      }
    }

    if (savedCompany) {
      setCompany(JSON.parse(savedCompany))
    }

    setIsLoading(false)
  }, [])

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData: User = {
      email,
      name,
      isVerified: false,
    }

    setUser(userData)
    setNeedsVerification(true)
    localStorage.setItem("upsell-user", JSON.stringify(userData))
    return true
  }

  const verifyEmail = async (code: string): Promise<boolean> => {
    // Simulate verification - accept any 6-digit code
    if (code.length === 6) {
      const verifiedUser = { ...user!, isVerified: true }
      setUser(verifiedUser)
      setNeedsVerification(false)
      setNeedsOnboarding(true)
      localStorage.setItem("upsell-user", JSON.stringify(verifiedUser))
      return true
    }
    return false
  }

  const createCompany = async (companyData: Omit<Company, "id">): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newCompany: Company = {
      ...companyData,
      id: Math.random().toString(36).substr(2, 9),
    }

    const updatedUser = { ...user!, companyId: newCompany.id }

    setCompany(newCompany)
    setUser(updatedUser)
    setNeedsOnboarding(false)

    localStorage.setItem("upsell-company", JSON.stringify(newCompany))
    localStorage.setItem("upsell-user", JSON.stringify(updatedUser))

    return true
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials
    if (email === "admin@upsell.ai" && password === "12345678") {
      const userData: User = {
        email,
        name: "Admin User",
        isVerified: true,
        companyId: "demo-company",
      }
      const companyData: Company = {
        id: "demo-company",
        name: "Demo Restaurant",
        address: "123 Main St, City, State 12345",
        phone: "+1 (555) 123-4567",
        email: "demo@restaurant.com",
        deliveryRange: 5,
        deliveryFee: 5.0,
        minOrder: 15.0,
        freeDeliveryThreshold: 30.0,
      }

      setUser(userData)
      setCompany(companyData)
      localStorage.setItem("upsell-user", JSON.stringify(userData))
      localStorage.setItem("upsell-company", JSON.stringify(companyData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setCompany(null)
    setNeedsVerification(false)
    setNeedsOnboarding(false)
    localStorage.removeItem("upsell-user")
    localStorage.removeItem("upsell-company")
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
