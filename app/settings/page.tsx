"use client"

import React from "react"
import type { StaffMember } from "@/types/staff" // Declare StaffMember type
import { useState } from "react"
import { FloatingSidebar } from "@/components/floating-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Plus, Trash2, Users, SettingsIcon, Bell, Save } from "lucide-react"
import { demoStaff, demoOrderStatuses, demoCompany, type Staff, type OrderStatus, type Company } from "@/lib/demo-data"

const permissionLabels = {
  dashboard: "Dashboard",
  orders: "Orders",
  customers: "Customers",
  products: "Products",
  settings: "Settings",
}

const emptyStaffMember: Omit<StaffMember, "id"> = {
  name: "",
  email: "",
  phone: "",
  role: "Staff",
  permissions: {
    dashboard: true,
    orders: true,
    customers: false,
    products: false,
    settings: false,
  },
}

const colorOptions = [
  { value: "bg-blue-100 text-blue-800 border-blue-200", label: "Blue", class: "bg-blue-500" },
  { value: "bg-green-100 text-green-800 border-green-200", label: "Green", class: "bg-green-500" },
  { value: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Yellow", class: "bg-yellow-500" },
  { value: "bg-red-100 text-red-800 border-red-200", label: "Red", class: "bg-red-500" },
  { value: "bg-purple-100 text-purple-800 border-purple-200", label: "Purple", class: "bg-purple-500" },
  { value: "bg-orange-100 text-orange-800 border-orange-200", label: "Orange", class: "bg-orange-500" },
]

// Update the StaffForm component to use React.memo
const StaffForm = React.memo(
  ({ staffMember, setStaffMember }: { staffMember: Staff | Omit<Staff, "id">; setStaffMember: (s: any) => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={staffMember.name}
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
            value={(staffMember as any).email}
            onChange={(e) => setStaffMember({ ...staffMember, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={(staffMember as any).phone}
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
                checked={staffMember.permissions[key as keyof Staff["permissions"]]}
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

// Update the StatusForm component to use React.memo
const StatusForm = React.memo(
  ({
    status,
    setStatus,
  }: {
    status: OrderStatus | Omit<OrderStatus, "id">
    setStatus: (s: any) => void
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="statusName">Status Name</Label>
          <Input
            id="statusName"
            value={status.name}
            onChange={(e) => setStatus({ ...status, name: e.target.value })}
            placeholder="In Transit"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="statusColor">Color</Label>
          <Select value={status.color} onValueChange={(value) => setStatus({ ...status, color: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color.class}`}></div>
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="statusStep">Step</Label>
          <Input
            id="statusStep"
            type="number"
            min="1"
            value={status.step}
            onChange={(e) => setStatus({ ...status, step: Number.parseInt(e.target.value) || 1 })}
          />
          <p className="text-xs text-gray-500">Order in workflow sequence</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="statusLevel">Level</Label>
          <Input
            id="statusLevel"
            type="number"
            min="1"
            value={status.level}
            onChange={(e) => setStatus({ ...status, level: Number.parseInt(e.target.value) || 1 })}
          />
          <p className="text-xs text-gray-500">Sub-level within same step</p>
        </div>
      </div>
    </div>
  ),
)

export default function SettingsPage() {
  const [staff, setStaff] = useState<Staff[]>(demoStaff)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(staff[0])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>(demoOrderStatuses)
  const [draggedStatus, setDraggedStatus] = useState<OrderStatus | null>(null)
  const [newStatusName, setNewStatusName] = useState("")
  const [newStatusColor, setNewStatusColor] = useState("bg-blue-100 text-blue-800 border-blue-200")
  const [newStatusStep, setNewStatusStep] = useState(1)
  const [newStatusLevel, setNewStatusLevel] = useState(1)
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false)
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false)
  const [isDeleteStaffDialogOpen, setIsDeleteStaffDialogOpen] = useState(false)
  const [isAddStatusDialogOpen, setIsAddStatusDialogOpen] = useState(false)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [isDeleteStatusDialogOpen, setIsDeleteStatusDialogOpen] = useState(false)
  const [newStaffMember, setNewStaffMember] = useState<
    Omit<Staff, "id" | "company_id" | "user_id" | "invited_at" | "joined_at" | "last_active">
  >(emptyStaffMember as any)
  const [editingStaffMember, setEditingStaffMember] = useState<Staff | null>(null)
  const [editingStatus, setEditingStatus] = useState<OrderStatus | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const [company, setCompany] = useState<Company>(demoCompany)
  const [deliveryRange, setDeliveryRange] = useState(company.delivery_range)

  const updatePermission = (staffId: string, permission: keyof Staff["permissions"], value: boolean) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === staffId ? { ...member, permissions: { ...member.permissions, [permission]: value } } : member,
      ),
    )

    if (selectedStaff?.id === staffId) {
      setSelectedStaff((prev) =>
        prev
          ? {
              ...prev,
              permissions: { ...prev.permissions, [permission]: value },
            }
          : null,
      )
    }
  }

  const addOrderStatus = () => {
    if (newStatusName.trim()) {
      const newStatus: OrderStatus = {
        id: newStatusName.toLowerCase().replace(/\s+/g, "-"),
        company_id: "comp_1",
        name: newStatusName,
        color: newStatusColor,
        step: newStatusStep,
        level: newStatusLevel,
        icon: "Clock",
        allowed_transitions: [],
        is_default: false,
        is_active: true,
      }
      setOrderStatuses([...orderStatuses, newStatus])
      setNewStatusName("")
      setNewStatusStep(1)
      setNewStatusLevel(1)
      setIsAddStatusDialogOpen(false)
    }
  }

  const editOrderStatus = () => {
    if (editingStatus) {
      setOrderStatuses((prev) => prev.map((status) => (status.id === editingStatus.id ? editingStatus : status)))
      setEditingStatus(null)
      setIsEditStatusDialogOpen(false)
    }
  }

  const removeOrderStatus = (statusId: string) => {
    // Don't allow removing default statuses
    const status = orderStatuses.find((s) => s.id === statusId)
    if (status?.is_default) return

    setOrderStatuses((prev) => prev.filter((status) => status.id !== statusId))
    setSelectedStatus(null)
    setIsDeleteStatusDialogOpen(false)
  }

  const moveStatus = (fromIndex: number, toIndex: number) => {
    const newStatuses = [...orderStatuses]
    const [movedStatus] = newStatuses.splice(fromIndex, 1)
    newStatuses.splice(toIndex, 0, movedStatus)
    setOrderStatuses(newStatuses)
  }

  // Drag and drop handlers for statuses
  const handleStatusDragStart = (e: React.DragEvent, status: OrderStatus, index: number) => {
    setDraggedStatus(status)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleStatusDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleStatusDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
    if (dragIndex !== dropIndex) {
      moveStatus(dragIndex, dropIndex)
    }
    setDraggedStatus(null)
  }

  const handleAddStaff = () => {
    const staffMember: Staff = {
      ...(newStaffMember as any),
      id: `staff_${Date.now()}`,
      company_id: "comp_1",
      user_id: `user_${Date.now()}`,
      invited_at: new Date(),
    }
    setStaff([...staff, staffMember])
    setNewStaffMember(emptyStaffMember as any)
    setIsAddStaffDialogOpen(false)
  }

  // Update the state update functions to use functional updates
  // For example in the handleEditStaff function:
  const handleEditStaff = () => {
    if (editingStaffMember) {
      setStaff((prevStaff) => prevStaff.map((s) => (s.id === editingStaffMember.id ? editingStaffMember : s)))
      if (selectedStaff?.id === editingStaffMember.id) {
        setSelectedStaff(editingStaffMember)
      }
      setEditingStaffMember(null)
      setIsEditStaffDialogOpen(false)
    }
  }

  const handleDeleteStaff = () => {
    if (selectedStaff) {
      setStaff(staff.filter((s) => s.id !== selectedStaff.id))
      setSelectedStaff(staff.find((s) => s.id !== selectedStaff.id) || null)
      setIsDeleteStaffDialogOpen(false)
    }
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
                      value={company.name}
                      onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Full restaurant address"
                      value={company.address}
                      onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={company.phone}
                        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@restaurant.com"
                        value={company.email}
                        onChange={(e) => setCompany({ ...company, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button className="bg-upsell-blue hover:bg-upsell-blue-hover">Save Changes</Button>
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
                        value={company.delivery_fee}
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
                        value={company.min_order_value}
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
                        value={company.free_delivery_threshold}
                        onChange={(e) =>
                          setCompany({ ...company, free_delivery_threshold: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                      <p className="text-xs text-gray-500">Orders above this amount qualify for free delivery</p>
                    </div>
                  </div>
                  <Button className="bg-upsell-blue hover:bg-upsell-blue-hover">Save Changes</Button>
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
                {Object.entries(company.operating_hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between">
                    <Label className="w-20 capitalize">{day}</Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        defaultValue={hours.open}
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
                        defaultValue={hours.close}
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
                <Button className="bg-upsell-blue hover:bg-upsell-blue-hover">Save Hours</Button>
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
                        <Button onClick={handleAddStaff} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                          <Save size={16} className="mr-2" />
                          Add Staff Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staff.map((member) => (
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
                          <AvatarImage src={(member as any).avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-upsell-blue text-white">
                            {member.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-sm text-gray-500 truncate">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                            <AvatarImage src={(selectedStaff as any).avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-upsell-blue text-white text-lg">
                              {selectedStaff.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">{selectedStaff.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Badge variant="secondary">{selectedStaff.role}</Badge>
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
                                <Button onClick={handleEditStaff} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                                  <Save size={16} className="mr-2" />
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
                                <Button onClick={handleDeleteStaff} className="bg-red-600 hover:bg-red-700 text-white">
                                  <Trash2 size={16} className="mr-2" />
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
                                  </p>
                                </div>
                                <Switch
                                  checked={selectedStaff.permissions[key as keyof Staff["permissions"]]}
                                  onCheckedChange={(checked) =>
                                    updatePermission(selectedStaff.id, key as keyof Staff["permissions"], checked)
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Order Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when new orders arrive</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-upsell-blue" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive daily summary emails</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-upsell-blue" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-gray-500">Get SMS for urgent notifications</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-upsell-blue" />
                </div>
                <Button className="bg-upsell-blue hover:bg-upsell-blue-hover">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FloatingSidebar>
  )
}
