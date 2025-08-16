"use client"

import React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { FloatingSidebar } from "@/components/floating-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Users, SettingsIcon, Bell, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Company {
  id: string
  name: string
  industry: string
  size: string
  website: string
  description: string
  address: string
  phone: string
  email: string
  delivery_enabled: boolean
  delivery_fee: number
  delivery_range: number
  min_order_value: number
  free_delivery_threshold: number
  operating_hours: {
    [key: string]: { open: string; close: string; enabled: boolean }
  }
}

interface StaffMember {
  id: string
  company_id: string
  user_id: string | null
  name: string
  email: string
  phone: string
  role: string
  permissions: {
    dashboard: boolean
    orders: boolean
    customers: boolean
    products: boolean
    settings: boolean
  }
  invited_at: string
  joined_at: string | null
  last_active: string | null
}

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar_url: string | null
  preferences: {
    notifications: {
      new_orders: boolean
      email_summary: boolean
      sms_alerts: boolean
    }
  }
}

const permissionLabels = {
  dashboard: "Dashboard",
  orders: "Orders",
  customers: "Customers",
  products: "Products",
  settings: "Settings",
}

const emptyStaffMember: Omit<StaffMember, "id" | "company_id" | "invited_at"> = {
  user_id: null,
  name: "",
  email: "",
  phone: "",
  role: "staff",
  permissions: {
    dashboard: true,
    orders: true,
    customers: false,
    products: false,
    settings: false,
  },
  joined_at: null,
  last_active: null,
}

const StaffForm = React.memo(
  ({
    staffMember,
    setStaffMember,
  }: {
    staffMember: StaffMember | Omit<StaffMember, "id" | "company_id" | "invited_at">
    setStaffMember: (s: any) => void
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={staffMember.name || ""}
            onChange={(e) => setStaffMember({ ...staffMember, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={staffMember.role}
            onValueChange={(value: any) => setStaffMember({ ...staffMember, role: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="head_chef">Head Chef</SelectItem>
              <SelectItem value="chef">Chef</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={staffMember.email || ""}
            onChange={(e) => setStaffMember({ ...staffMember, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={staffMember.phone || ""}
            onChange={(e) => setStaffMember({ ...staffMember, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Access Permissions</h3>
        <div className="space-y-4">
          {Object.entries(permissionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">
                  {key === "dashboard" && "View dashboard and analytics"}
                  {key === "orders" && "Manage orders and customer requests"}
                  {key === "customers" && "Access customer information and history"}
                  {key === "products" && "Manage products and offers"}
                  {key === "settings" && "Access system settings and configuration"}
                </p>
              </div>
              <Switch
                checked={staffMember.permissions[key as keyof StaffMember["permissions"]]}
                onCheckedChange={(checked) =>
                  setStaffMember({
                    ...staffMember,
                    permissions: { ...staffMember.permissions, [key]: checked },
                  })
                }
                className="data-[state=checked]:bg-upsell-blue"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
)

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [deliveryRange, setDeliveryRange] = useState(5)

  // Dialog states
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false)
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false)
  const [isDeleteStaffDialogOpen, setIsDeleteStaffDialogOpen] = useState(false)
  const [newStaffMember, setNewStaffMember] =
    useState<Omit<StaffMember, "id" | "company_id" | "invited_at">>(emptyStaffMember)
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null)

  const supabase = createClient()

  const loadData = async () => {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (!session?.user) {
        toast.error("Please sign in to access settings")
        return
      }

      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError)
      } else if (profile) {
        setUserProfile(profile)
      }

      // Load company data
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", session.user.id)
        .single()

      if (companyError && companyError.code !== "PGRST116") {
        console.error("Company error:", companyError)
      } else if (companyData) {
        setCompany(companyData)
        setDeliveryRange(companyData.delivery_range || 5)

        // Load staff for this company
        const { data: staffData, error: staffError } = await supabase
          .from("staff")
          .select("*")
          .eq("company_id", companyData.id)
          .order("created_at", { ascending: true })

        if (staffError) {
          console.error("Staff error:", staffError)
        } else if (staffData) {
          setStaff(staffData)
          if (staffData.length > 0) {
            setSelectedStaff(staffData[0])
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load settings data")
    } finally {
      setLoading(false)
    }
  }

  const saveCompanyData = async () => {
    if (!company) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          address: company.address,
          phone: company.phone,
          email: company.email,
          delivery_enabled: company.delivery_enabled,
          delivery_fee: company.delivery_fee,
          delivery_range: deliveryRange,
          min_order_value: company.min_order_value,
          free_delivery_threshold: company.free_delivery_threshold,
          operating_hours: company.operating_hours,
        })
        .eq("id", company.id)

      if (error) throw error

      setCompany({ ...company, delivery_range: deliveryRange })
      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving company data:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const saveUserPreferences = async () => {
    if (!userProfile) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from("user_profiles")
        .update({
          preferences: userProfile.preferences,
        })
        .eq("id", userProfile.id)

      if (error) throw error

      toast.success("Notification preferences saved")
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast.error("Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  const handleAddStaff = async () => {
    if (!company) return

    try {
      setSaving(true)
      const { data, error } = await supabase
        .from("staff")
        .insert([
          {
            ...newStaffMember,
            company_id: company.id,
            invited_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      setStaff([...staff, data])
      setNewStaffMember(emptyStaffMember)
      setIsAddStaffDialogOpen(false)
      toast.success("Staff member added successfully")
    } catch (error) {
      console.error("Error adding staff:", error)
      toast.error("Failed to add staff member")
    } finally {
      setSaving(false)
    }
  }

  const handleEditStaff = async () => {
    if (!editingStaffMember) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from("staff")
        .update({
          name: editingStaffMember.name,
          email: editingStaffMember.email,
          phone: editingStaffMember.phone,
          role: editingStaffMember.role,
          permissions: editingStaffMember.permissions,
        })
        .eq("id", editingStaffMember.id)

      if (error) throw error

      setStaff(staff.map((s) => (s.id === editingStaffMember.id ? editingStaffMember : s)))
      if (selectedStaff?.id === editingStaffMember.id) {
        setSelectedStaff(editingStaffMember)
      }
      setEditingStaffMember(null)
      setIsEditStaffDialogOpen(false)
      toast.success("Staff member updated successfully")
    } catch (error) {
      console.error("Error updating staff:", error)
      toast.error("Failed to update staff member")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return

    try {
      setSaving(true)
      const { error } = await supabase.from("staff").delete().eq("id", selectedStaff.id)

      if (error) throw error

      const newStaff = staff.filter((s) => s.id !== selectedStaff.id)
      setStaff(newStaff)
      setSelectedStaff(newStaff[0] || null)
      setIsDeleteStaffDialogOpen(false)
      toast.success("Staff member deleted successfully")
    } catch (error) {
      console.error("Error deleting staff:", error)
      toast.error("Failed to delete staff member")
    } finally {
      setSaving(false)
    }
  }

  const updatePermission = async (staffId: string, permission: keyof StaffMember["permissions"], value: boolean) => {
    const staffMember = staff.find((s) => s.id === staffId)
    if (!staffMember) return

    const updatedPermissions = { ...staffMember.permissions, [permission]: value }

    try {
      const { error } = await supabase.from("staff").update({ permissions: updatedPermissions }).eq("id", staffId)

      if (error) throw error

      setStaff(staff.map((s) => (s.id === staffId ? { ...s, permissions: updatedPermissions } : s)))

      if (selectedStaff?.id === staffId) {
        setSelectedStaff({ ...selectedStaff, permissions: updatedPermissions })
      }

      toast.success("Permissions updated")
    } catch (error) {
      console.error("Error updating permissions:", error)
      toast.error("Failed to update permissions")
    }
  }

  const resetOnboarding = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { onboarding_completed: false, company_id: null },
      })

      if (error) throw error

      toast.success("Onboarding status reset. Redirecting...")
      setTimeout(() => {
        window.location.href = "/onboarding"
      }, 1000)
    } catch (error) {
      console.error("Error resetting onboarding:", error)
      toast.error("Failed to reset onboarding status")
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <FloatingSidebar>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-upsell-blue" />
            <span className="text-gray-600">Loading settings...</span>
          </div>
        </div>
      </FloatingSidebar>
    )
  }

  if (!company) {
    return (
      <FloatingSidebar>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <SettingsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Company Found</h2>
              <p className="text-gray-600 mb-6">
                It looks like your onboarding wasn't completed successfully. Please complete your company setup to
                access settings.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => (window.location.href = "/onboarding")}
                className="w-full bg-upsell-blue hover:bg-upsell-blue/90"
              >
                Complete Onboarding
              </Button>

              <Button onClick={resetOnboarding} variant="outline" className="w-full bg-transparent">
                Reset & Retry Onboarding
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Having trouble? The reset option will clear your onboarding status and let you start fresh.
            </p>
          </div>
        </div>
      </FloatingSidebar>
    )
  }

  return (
    <FloatingSidebar>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your restaurant and system preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-3">
              <SettingsIcon size={18} />
              General
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-3">
              <Users size={18} />
              Staff
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-3">
              <Bell size={18} />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Restaurant Information */}
              <Card className="bg-upsell-card border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                  <CardDescription>Basic information about your restaurant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input
                      id="restaurant-name"
                      placeholder="Your Restaurant Name"
                      value={company.name || ""}
                      onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Full restaurant address"
                      value={company.address || ""}
                      onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={company.phone || ""}
                        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@restaurant.com"
                        value={company.email || ""}
                        onChange={(e) => setCompany({ ...company, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={saveCompanyData}
                    disabled={saving}
                    className="bg-upsell-blue hover:bg-upsell-blue-hover"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Delivery Settings */}
              <Card className="bg-upsell-card border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Delivery Settings</CardTitle>
                  <CardDescription>Configure delivery options and range</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Delivery</Label>
                      <Switch
                        checked={company.delivery_enabled}
                        onCheckedChange={(value) => setCompany({ ...company, delivery_enabled: value })}
                        className="data-[state=checked]:bg-upsell-blue"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="delivery-range">Delivery Range (miles)</Label>
                        <span className="text-sm font-medium">{deliveryRange} miles</span>
                      </div>
                      <Slider
                        id="delivery-range"
                        min={1}
                        max={20}
                        step={1}
                        value={[deliveryRange]}
                        onValueChange={(value) => setDeliveryRange(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 mile</span>
                        <span>20 miles</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery-fee">Delivery Fee ($)</Label>
                      <Input
                        id="delivery-fee"
                        type="number"
                        step="0.01"
                        placeholder="5.00"
                        value={company.delivery_fee?.toString() || "0"}
                        onChange={(e) =>
                          setCompany({ ...company, delivery_fee: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min-order">Minimum Order Value ($)</Label>
                      <Input
                        id="min-order"
                        type="number"
                        step="0.01"
                        placeholder="15.00"
                        value={company.min_order_value?.toString() || "0"}
                        onChange={(e) =>
                          setCompany({ ...company, min_order_value: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="free-delivery-threshold">Free Delivery Threshold ($)</Label>
                      <Input
                        id="free-delivery-threshold"
                        type="number"
                        step="0.01"
                        placeholder="30.00"
                        value={company.free_delivery_threshold?.toString() || "0"}
                        onChange={(e) =>
                          setCompany({ ...company, free_delivery_threshold: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                      <p className="text-xs text-gray-500">Orders above this amount qualify for free delivery</p>
                    </div>
                  </div>
                  <Button
                    onClick={saveCompanyData}
                    disabled={saving}
                    className="bg-upsell-blue hover:bg-upsell-blue-hover"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Operating Hours */}
            <Card className="bg-upsell-card border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
                <CardDescription>Set your restaurant's operating schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.operating_hours &&
                  Object.entries(company.operating_hours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between">
                      <Label className="w-20 capitalize">{day}</Label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={hours.open}
                          onValueChange={(value) =>
                            setCompany({
                              ...company,
                              operating_hours: { ...company.operating_hours, [day]: { ...hours, open: value } },
                            })
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={`${i}:00`}>
                                {i}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-gray-500">to</span>
                        <Select
                          value={hours.close}
                          onValueChange={(value) =>
                            setCompany({
                              ...company,
                              operating_hours: { ...company.operating_hours, [day]: { ...hours, close: value } },
                            })
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={`${i}:00`}>
                                {i}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Switch
                          checked={hours.enabled}
                          onCheckedChange={(value) =>
                            setCompany({
                              ...company,
                              operating_hours: { ...company.operating_hours, [day]: { ...hours, enabled: value } },
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                <Button
                  onClick={saveCompanyData}
                  disabled={saving}
                  className="bg-upsell-blue hover:bg-upsell-blue-hover"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Hours
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Staff List */}
              <Card className="bg-upsell-card border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Staff Members</CardTitle>
                    <CardDescription>Select a staff member to manage permissions</CardDescription>
                  </div>
                  <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-upsell-blue hover:bg-upsell-blue-hover">
                        <Plus size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>Create a new staff account with appropriate permissions</DialogDescription>
                      </DialogHeader>
                      <StaffForm staffMember={newStaffMember} setStaffMember={setNewStaffMember} />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddStaff}
                          disabled={saving}
                          className="bg-upsell-blue hover:bg-upsell-blue-hover"
                        >
                          {saving ? (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                          ) : (
                            <Save size={16} className="mr-2" />
                          )}
                          Add Staff Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staff.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No staff members yet</p>
                  ) : (
                    staff.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedStaff(member)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedStaff?.id === member.id
                            ? "bg-upsell-blue/10 border-2 border-upsell-blue"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-upsell-blue text-white">
                              {member.name
                                ? member.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{member.name}</p>
                            <p className="text-sm text-gray-500 truncate capitalize">{member.role}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Staff Permissions */}
              <div className="lg:col-span-2">
                {selectedStaff ? (
                  <Card className="bg-upsell-card border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-upsell-blue text-white text-lg">
                              {selectedStaff.name
                                ? selectedStaff.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">{selectedStaff.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Badge variant="secondary" className="capitalize">
                                {selectedStaff.role}
                              </Badge>
                              <span>{selectedStaff.email}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog open={isEditStaffDialogOpen} onOpenChange={setIsEditStaffDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingStaffMember(selectedStaff)}>
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Staff Member</DialogTitle>
                                <DialogDescription>Update staff information and permissions</DialogDescription>
                              </DialogHeader>
                              {editingStaffMember && (
                                <StaffForm staffMember={editingStaffMember} setStaffMember={setEditingStaffMember} />
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditStaffDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleEditStaff}
                                  disabled={saving}
                                  className="bg-upsell-blue hover:bg-upsell-blue-hover"
                                >
                                  {saving ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                  ) : (
                                    <Save size={16} className="mr-2" />
                                  )}
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={isDeleteStaffDialogOpen} onOpenChange={setIsDeleteStaffDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                              >
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Staff Member</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete {selectedStaff.name}? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteStaffDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleDeleteStaff}
                                  disabled={saving}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {saving ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                  ) : (
                                    <Trash2 size={16} className="mr-2" />
                                  )}
                                  Delete Staff Member
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-sm text-gray-500">Email</Label>
                              <p className="font-medium">{selectedStaff.email}</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm text-gray-500">Phone</Label>
                              <p className="font-medium">{selectedStaff.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Access Permissions</h3>
                          <div className="space-y-4">
                            {Object.entries(permissionLabels).map(([key, label]) => (
                              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{label}</p>
                                  <p className="text-sm text-gray-500">
                                    {key === "dashboard" && "View dashboard and analytics"}
                                    {key === "orders" && "Manage orders and customer requests"}
                                    {key === "customers" && "Access customer information and history"}
                                    {key === "products" && "Manage products and offers"}
                                    {key === "settings" && "Access system settings and configuration"}
                                  </p>
                                </div>
                                <Switch
                                  checked={selectedStaff.permissions[key as keyof StaffMember["permissions"]]}
                                  onCheckedChange={(checked) =>
                                    updatePermission(selectedStaff.id, key as keyof StaffMember["permissions"], checked)
                                  }
                                  className="data-[state=checked]:bg-upsell-blue"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-upsell-card border-0 shadow-sm">
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-gray-500">Select a staff member to manage their permissions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-upsell-card border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile?.preferences?.notifications ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Order Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified when new orders arrive</p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.notifications.new_orders}
                        onCheckedChange={(checked) =>
                          setUserProfile({
                            ...userProfile,
                            preferences: {
                              ...userProfile.preferences,
                              notifications: {
                                ...userProfile.preferences.notifications,
                                new_orders: checked,
                              },
                            },
                          })
                        }
                        className="data-[state=checked]:bg-upsell-blue"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive daily summary emails</p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.notifications.email_summary}
                        onCheckedChange={(checked) =>
                          setUserProfile({
                            ...userProfile,
                            preferences: {
                              ...userProfile.preferences,
                              notifications: {
                                ...userProfile.preferences.notifications,
                                email_summary: checked,
                              },
                            },
                          })
                        }
                        className="data-[state=checked]:bg-upsell-blue"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Alerts</Label>
                        <p className="text-sm text-gray-500">Get SMS for urgent notifications</p>
                      </div>
                      <Switch
                        checked={userProfile.preferences.notifications.sms_alerts}
                        onCheckedChange={(checked) =>
                          setUserProfile({
                            ...userProfile,
                            preferences: {
                              ...userProfile.preferences,
                              notifications: {
                                ...userProfile.preferences.notifications,
                                sms_alerts: checked,
                              },
                            },
                          })
                        }
                        className="data-[state=checked]:bg-upsell-blue"
                      />
                    </div>
                    <Button
                      onClick={saveUserPreferences}
                      disabled={saving}
                      className="bg-upsell-blue hover:bg-upsell-blue-hover"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Preferences
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">Loading notification preferences...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FloatingSidebar>
  )
}
