"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "@/lib/auth-actions"

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
          Signing in...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          Sign In
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)
  const [showPassword, setShowPassword] = useState(false)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

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
            Welcome
            <br />
            <span className="text-gray-400">Back</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sign in to continue managing your restaurant with AI-powered insights and automation.
          </p>

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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Welcome back to Upsell AI</p>
              </div>

              {state?.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{state.error}</p>
                </div>
              )}

              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@restaurant.com"
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
                      required
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

                <SubmitButton />
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-black hover:underline font-medium transition-colors">
                    Sign up
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
