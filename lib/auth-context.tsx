"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "./supabase-client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User extends SupabaseUser {
  companyId?: string;
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
      const currentUser = session?.user ?? null;
      setUser(currentUser as User);
      setIsLoading(false);

      if (currentUser) {
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*, companies(*)')
          .eq('user_id', currentUser.id)
          .single();

        if (staffData) {
          const companyData = staffData.companies;
          setUser(prevUser => ({ ...prevUser!, companyId: companyData.id }));
          setCompany(companyData);

          // Check if the company name is the default one
          if (companyData.name.endsWith("'s Company")) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } else if (staffError) {
          console.error('Error fetching staff data:', staffError.message);
        }
      } else {
        setCompany(null);
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Check if user needs verification
    if (data.user && !data.user.email_confirmed_at) {
        setNeedsVerification(true);
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
