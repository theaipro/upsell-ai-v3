import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import VerifyOTPForm from "@/components/auth/verify-otp-form"

export default async function VerifyPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Check if user is already logged in and verified
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    // User is already verified, redirect to onboarding
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <VerifyOTPForm />
    </div>
  )
}
