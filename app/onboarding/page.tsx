"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Building2, User, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { updateCompany, updateStaff } from "@/lib/mutations"
import { supabase } from "@/lib/supabase-client"

interface CompanyFormData {
  name: string
  address: string
  phone: string
  email: string
}

interface StaffFormData {
  name: string
  phone: string
  role: string
}

const initialCompanyData: CompanyFormData = {
  name: "",
  address: "",
  phone: "",
  email: "",
}

const initialStaffData: StaffFormData = {
  name: "",
  phone: "",
  role: "admin",
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [companyData, setCompanyData] = useState<CompanyFormData>(initialCompanyData)
  const [staffData, setStaffData] = useState<StaffFormData>(initialStaffData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { user, company, needsOnboarding } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !needsOnboarding) {
      router.push("/dashboard")
    }
  }, [user, needsOnboarding, router])

  const totalSteps = 2
  const progress = (currentStep / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!companyData.name.trim()) newErrors.name = "Restaurant name is required"
      if (!companyData.address.trim()) newErrors.address = "Address is required"
    } else if (step === 2) {
      if (!staffData.name.trim()) newErrors.name = "Your name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleCompanyDataChange = (field: keyof CompanyFormData, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleStaffDataChange = (field: keyof StaffFormData, value: string) => {
    setStaffData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFinishOnboarding = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      return
    }
    setIsLoading(true)

    try {
      if (company && user) {
        await updateCompany(company.id, companyData)

        const { data: staff, error } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        if(staff) {
          await updateStaff(staff.id, staffData)
        }

        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to update company and staff:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !company) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Image
            src="/images/upsell-ai-logo-landscape.png"
            alt="Upsell AI"
            width={200}
            height={50}
            className="h-10 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Upsell AI</h1>
          <p className="text-gray-600">Let's set up your business in just a few steps</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-8">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
                  <p className="text-gray-600">Tell us about your company</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="name"
                      value={companyData.name}
                      onChange={(e) => handleCompanyDataChange("name", e.target.value)}
                      placeholder="Your Company Name"
                      className={`h-12 ${errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"} focus:ring-black/10 transition-colors`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700 font-medium">
                      Full Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={companyData.address}
                      onChange={(e) => handleCompanyDataChange("address", e.target.value)}
                      placeholder="123 Main Street, City, State, ZIP Code"
                      className={`min-h-[100px] ${errors.address ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"} focus:ring-black/10 transition-colors`}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: User Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Information</h2>
                  <p className="text-gray-600">Tell us a bit about yourself</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffName" className="text-gray-700 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="staffName"
                      value={staffData.name}
                      onChange={(e) => handleStaffDataChange("name", e.target.value)}
                      placeholder="John Doe"
                      className={`h-12 ${errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"} focus:ring-black/10 transition-colors`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staffPhone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="staffPhone"
                      value={staffData.phone}
                      onChange={(e) => handleStaffDataChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft size={16} />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
                  Next
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleFinishOnboarding}
                  disabled={isLoading}
                  className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Complete Setup
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
