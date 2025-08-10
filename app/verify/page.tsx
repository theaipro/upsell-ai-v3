"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, ArrowRight } from "lucide-react"

function VerifyFormComponent() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { verifyEmail } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email not found. Please go back to sign up and try again.")
      return
    }

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.")
      return
    }

    setIsLoading(true)

    const { success, error: apiError } = await verifyEmail(email, code)

    if (success) {
      router.push("/onboarding")
    } else if (apiError) {
      setError(apiError)
    } else {
      setError("An unexpected error occurred. Please try again.")
    }

    setIsLoading(false)
  }

  if (!email) {
    return (
      <div className="text-center text-red-500">
        <p>Email parameter is missing. Please return to the sign-up page.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-gray-100 rounded-full p-3 w-fit mb-4">
            <Mail className="h-8 w-8 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-gray-800">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading || code.length < 6}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium transition-colors group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Verify Account
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              <button className="text-black hover:underline font-medium">Resend code</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyFormComponent />
    </Suspense>
  )
}
