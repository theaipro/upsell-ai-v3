"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signUp } from "@/lib/auth-actions"

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
          Creating account...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          Create Account
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signUp, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (state?.success && state?.email) {
      // Store email in sessionStorage for verification page
      sessionStorage.setItem("verification-email", state.email)
      router.push("/auth/verify")
    }
  }, [state, router])

  const features = [
    "AI-powered order management",
    "Real-time analytics dashboard",
    "Customer insights & preferences",
    "Staff management tools",
    "Multi-channel integration",
  ]

  return (
    <>
      {/* Left Side - Dark Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Subtle geometric patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rotate-45"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 border border-white/10 rotate-12"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-white/5 rotate-45"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <Image
              src="/images/upsell-ai-logo-landscape-transparent.png"
              alt="Upsell AI"
              width={240}
              height={60}
              className="h-12 w-auto filter invert mb-8"
            />
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Start Your
            <br />
            <span className="text-gray-400">AI Journey</span>
            <br />
            Today
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Join thousands of restaurants already using AI to boost their operations and customer satisfaction.
          </p>

          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-white/60" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Minimal decorative elements */}
          <div className="mt-12 flex items-center gap-4">
            <div className="w-12 h-px bg-white/20"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-8 h-px bg-white/10"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Light Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Image
              src="/images/upsell-ai-logo-landscape.png"
              alt="Upsell AI"
              width={200}
              height={50}
              className="h-10 w-auto mx-auto mb-6"
            />
          </div>

          <Card className="border-0 shadow-2xl bg-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Get started with Upsell AI</p>
              </div>

              {state?.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{state.error}</p>
                </div>
              )}

              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@restaurant.com"
                    required
                    className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      required
                      minLength={8}
                      className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      minLength={8}
                      className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <SubmitButton />
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-black hover:underline font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
