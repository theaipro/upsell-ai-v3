"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { error: "Network connection issue. Please try again in a moment." }
    }
    return { error: "Authentication service temporarily unavailable. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const name = formData.get("name")

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        data: {
          name: name.toString(),
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, email: email.toString() }
  } catch (error) {
    console.error("Sign up error:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { error: "Network connection issue. Please try again in a moment." }
    }
    return { error: "Registration service temporarily unavailable. Please try again." }
  }
}

export async function verifyOTP(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const token = formData.get("token")

  if (!email || !token) {
    return { error: "Email and verification code are required" }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      email: email.toString(),
      token: token.toString(),
      type: "email",
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("OTP verification error:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { error: "Network connection issue. Please try again in a moment." }
    }
    return { error: "Verification service temporarily unavailable. Please try again." }
  }
}

export async function signOut() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Sign out error:", error)
    // Continue with redirect even if sign out fails
  }
  redirect("/auth/login")
}

export async function resendOTP(email: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Verification code resent successfully." }
  } catch (error) {
    console.error("Resend OTP error:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { error: "Network connection issue. Please try again in a moment." }
    }
    return { error: "Resend service temporarily unavailable. Please try again." }
  }
}
