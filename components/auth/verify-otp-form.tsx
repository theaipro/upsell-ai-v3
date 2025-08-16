"use client"

import type React from "react"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Mail, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { verifyOTP, resendOTP } from "@/lib/auth-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium transition-colors group"
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Verifying...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          Verify Email
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </Button>
  )
}

export default function VerifyOTPForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(verifyOTP, null)
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [email, setEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get email from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verification-email")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email found, redirect to signup
      router.push("/auth/signup")
    }
  }, [router])

  // Handle successful verification
  useEffect(() => {
    if (state?.success) {
      sessionStorage.removeItem("verification-email")
      router.push("/onboarding")
    }
  }, [state, router])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6)
    setCode(newCode)

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((val) => !val)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleResendCode = async () => {
    if (!email) return

    setIsResending(true)
    try {
      const result = await resendOTP(email)
      if (result.error) {
        console.error("Resend error:", result.error)
      }
    } catch (error) {
      console.error("Resend error:", error)
    } finally {
      setIsResending(false)
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Image
          src="/images/upsell-ai-logo-landscape.png"
          alt="Upsell AI"
          width={200}
          height={50}
          className="h-10 w-auto mx-auto mb-8"
        />
      </div>

      <Card className="border-0 shadow-2xl bg-white">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="token" value={code.join("")} />

            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-semibold border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                />
              ))}
            </div>

            <SubmitButton />
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm bg-transparent"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin" />
                  Sending...
                </div>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
