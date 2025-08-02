"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user, isLoading, needsVerification, needsOnboarding } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin")
      } else if (needsVerification) {
        router.push("/verify")
      } else if (needsOnboarding) {
        router.push("/onboarding")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, needsVerification, needsOnboarding, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-upsell-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upsell-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
