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
import { Slider } from "@/components/ui/slider"
import { ArrowRight, ArrowLeft, Building2, Phone, Truck, Users, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface CompanyFormData {
  name: string
  address: string
  phone: string
  email: string
  deliveryRange: number
  deliveryFee: number
  minOrder: number
  freeDeliveryThreshold: number
}

interface StaffMember {
  name: string
  email: string
  phone: string
  role: string
}

const initialCompanyData: CompanyFormData = {
  name: "",
  address: "",
  phone: "",
  email: "",
  deliveryRange: 5,
  deliveryFee: 5.0,
  minOrder: 15.0,
  freeDeliveryThreshold: 30.0,
}

const initialStaffMember: StaffMember = {
  name: "",
  email: "",
  phone: "",
  role: "Staff",
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [companyData, setCompanyData] = useState<CompanyFormData>(initialCompanyData)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [newStaffMember, setNewStaffMember] = useState<StaffMember>(initialStaffMember)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { user, createCompany, company, needsOnboarding, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if user is loaded and has a company, or if they don't need onboarding
    if (!isLoading && (company || !needsOnboarding)) {
      router.push("/dashboard")
    }
  }, [user, company, needsOnboarding, isLoading, router])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!companyData.name.trim()) newErrors.name = "Restaurant name is required"
      if (!companyData.address.trim()) newErrors.address = "Address is required"
    } else if (step === 2) {
      if (!companyData.phone.trim()) newErrors.phone = "Phone number is required"
      if (!companyData.email.trim()) newErrors.email = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(companyData.email)) newErrors.email = "Invalid email format"
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

  const handleCompanyDataChange = (field: keyof CompanyFormData, value: string | number) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddStaffMember = () => {
    if (newStaffMember.name.trim() && newStaffMember.email.trim()) {
      setStaffMembers((prev) => [...prev, newStaffMember])
      setNewStaffMember(initialStaffMember)
    }
  }

  const handleRemoveStaffMember = (index: number) => {
    setStaffMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFinishOnboarding = async () => {
    setIsLoading(true)

    try {
      const success = await createCompany(companyData)
      if (success) {
        // Store staff members for later use
        if (staffMembers.length > 0) {
          localStorage.setItem("pending-staff-invites", JSON.stringify(staffMembers))
        }
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to create company:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

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
          <p className="text-gray-600">Let's set up your restaurant in just a few steps</p>
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
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Information</h2>
                  <p className="text-gray-600">Tell us about your restaurant</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Restaurant Name *
                    </Label>
                    <Input
                      id="name"
                      value={companyData.name}
                      onChange={(e) => handleCompanyDataChange("name", e.target.value)}
                      placeholder="Your Restaurant Name"
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

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                  <p className="text-gray-600">How can customers reach you?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={companyData.phone}
                      onChange={(e) => handleCompanyDataChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`h-12 ${errors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"} focus:ring-black/10 transition-colors`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Business Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={companyData.email}
                      onChange={(e) => handleCompanyDataChange("email", e.target.value)}
                      placeholder="contact@restaurant.com"
                      className={`h-12 ${errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"} focus:ring-black/10 transition-colors`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Delivery Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Settings</h2>
                  <p className="text-gray-600">Configure your delivery options</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-gray-700 font-medium">Delivery Range</Label>
                        <span className="text-sm font-medium">{companyData.deliveryRange} miles</span>
                      </div>
                      <Slider
                        min={1}
                        max={20}
                        step={1}
                        value={[companyData.deliveryRange]}
                        onValueChange={(value) => handleCompanyDataChange("deliveryRange", value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 mile</span>
                        <span>20 miles</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deliveryFee" className="text-gray-700 font-medium">
                          Delivery Fee ($)
                        </Label>
                        <Input
                          id="deliveryFee"
                          type="number"
                          step="0.01"
                          min="0"
                          value={companyData.deliveryFee}
                          onChange={(e) =>
                            handleCompanyDataChange("deliveryFee", Number.parseFloat(e.target.value) || 0)
                          }
                          className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minOrder" className="text-gray-700 font-medium">
                          Minimum Order ($)
                        </Label>
                        <Input
                          id="minOrder"
                          type="number"
                          step="0.01"
                          min="0"
                          value={companyData.minOrder}
                          onChange={(e) => handleCompanyDataChange("minOrder", Number.parseFloat(e.target.value) || 0)}
                          className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="freeDeliveryThreshold" className="text-gray-700 font-medium">
                          Free Delivery At ($)
                        </Label>
                        <Input
                          id="freeDeliveryThreshold"
                          type="number"
                          step="0.01"
                          min="0"
                          value={companyData.freeDeliveryThreshold}
                          onChange={(e) =>
                            handleCompanyDataChange("freeDeliveryThreshold", Number.parseFloat(e.target.value) || 0)
                          }
                          className="h-12 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Staff Invitation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite Your Team</h2>
                  <p className="text-gray-600">Add staff members to get started (optional)</p>
                </div>

                <div className="space-y-6">
                  {/* Add Staff Form */}
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Add Staff Member</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="staffName" className="text-gray-700 font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="staffName"
                            value={newStaffMember.name}
                            onChange={(e) => setNewStaffMember((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="John Doe"
                            className="h-10 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="staffEmail" className="text-gray-700 font-medium">
                            Email
                          </Label>
                          <Input
                            id="staffEmail"
                            type="email"
                            value={newStaffMember.email}
                            onChange={(e) => setNewStaffMember((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="john@restaurant.com"
                            className="h-10 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="staffPhone" className="text-gray-700 font-medium">
                            Phone
                          </Label>
                          <Input
                            id="staffPhone"
                            value={newStaffMember.phone}
                            onChange={(e) => setNewStaffMember((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                            className="h-10 border-gray-200 focus:border-black focus:ring-black/10 transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="staffRole" className="text-gray-700 font-medium">
                            Role
                          </Label>
                          <select
                            id="staffRole"
                            value={newStaffMember.role}
                            onChange={(e) => setNewStaffMember((prev) => ({ ...prev, role: e.target.value }))}
                            className="h-10 w-full border border-gray-200 rounded-md px-3 focus:border-black focus:ring-black/10 transition-colors"
                          >
                            <option value="Staff">Staff</option>
                            <option value="Manager">Manager</option>
                            <option value="Head Chef">Head Chef</option>
                            <option value="Chef">Chef</option>
                            <option value="Server">Server</option>
                            <option value="Delivery">Delivery</option>
                          </select>
                        </div>
                      </div>

                      <Button
                        onClick={handleAddStaffMember}
                        disabled={!newStaffMember.name.trim() || !newStaffMember.email.trim()}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        Add Staff Member
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Staff List */}
                  {staffMembers.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Staff Members to Invite</h3>
                      {staffMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">
                              {member.email} • {member.role}
                            </p>
                            {member.phone && <p className="text-sm text-gray-500">{member.phone}</p>}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveStaffMember(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {staffMembers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No staff members added yet</p>
                      <p className="text-sm">You can always invite team members later from settings</p>
                    </div>
                  )}
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
                      Setting up...
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
