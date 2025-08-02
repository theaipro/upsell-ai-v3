"use client"

import { CardDescription } from "@/components/ui/card"

import React from "react"

import type { ReactElement } from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { FloatingSidebar } from "@/components/floating-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  RefreshCw,
  List,
  Kanban,
  Tags,
  Search,
  Clock,
  CheckCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Edit3,
  Filter,
  GripVertical,
  X,
  AlertTriangle,
  ChefHat,
  Eye,
  EyeOff,
  Settings,
  Save,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePreferences } from "@/lib/preferences-context"

// Import centralized demo data
import { demoOrders, demoCustomers, menuItems, type Order, type Customer, type OrderItem } from "@/lib/demo-data"

interface OrderStatus {
  id: string
  name: string
  color: string
  step: number
  level: number // Multiple statuses can have the same step but different levels
  icon: ReactElement
  allowedTransitions: string[] // Which statuses this can transition to
}

const defaultOrderStatuses: OrderStatus[] = [
  {
    id: "new",
    name: "New",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    step: 1,
    level: 1,
    icon: Clock,
    allowedTransitions: ["preparing", "rejected"],
  },
  {
    id: "preparing",
    name: "Preparing",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    step: 2,
    level: 1,
    icon: ChefHat,
    allowedTransitions: ["ready", "cancelled"],
  },
  {
    id: "ready",
    name: "Ready",
    color: "bg-green-100 text-green-800 border-green-200",
    step: 3,
    level: 1,
    icon: CheckCircle,
    allowedTransitions: ["on-the-way", "delivered"],
  },
  {
    id: "on-the-way",
    name: "On the Way",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    step: 4,
    level: 1,
    icon: Truck,
    allowedTransitions: ["delivered", "cancelled"],
  },
  {
    id: "delivered",
    name: "Delivered",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    step: 5,
    level: 1,
    icon: CheckCircle,
    allowedTransitions: [],
  },
  {
    id: "cancelled",
    name: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    step: 6,
    level: 1,
    icon: X,
    allowedTransitions: [],
  },
  {
    id: "rejected",
    name: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    step: 6,
    level: 2,
    icon: X,
    allowedTransitions: [],
  },
]

type ViewMode = "list" | "board" | "tags"
type ScreenMode = "orders" | "kitchen"

const rejectionReasons = [
  "Out of stock",
  "Kitchen too busy",
  "Delivery area not covered",
  "Payment issue",
  "Customer request",
  "Technical issue",
  "Other",
]

const emptyOrder: Omit<Order, "id" | "time"> = {
  customerId: "",
  customer: "",
  phone: "",
  address: "",
  items: [],
  total: 0,
  status: "new",
  type: "delivery",
  tags: [],
  notes: "",
  estimatedTime: "25-30 min",
}

// Extract StatusSettings as a separate memoized component
interface StatusSettingsProps {
  orderStatuses: OrderStatus[]
  onRemoveStatus: (statusId: string) => void
  onMoveStatus: (fromIndex: number, toIndex: number) => void
  onAddStatus: (status: OrderStatus) => void
  onStatusDragStart: (e: React.DragEvent, status: OrderStatus, index: number) => void
  onStatusDragOver: (e: React.DragEvent) => void
  onStatusDrop: (e: React.DragEvent, dropIndex: number) => void
}

const StatusSettings = React.memo<StatusSettingsProps>(
  ({ orderStatuses, onRemoveStatus, onMoveStatus, onAddStatus, onStatusDragStart, onStatusDragOver, onStatusDrop }) => {
    // Local state for the form - this prevents parent re-renders from affecting input focus
    const [statusName, setStatusName] = useState("")
    const [statusStep, setStatusStep] = useState(1)
    const [statusLevel, setStatusLevel] = useState(1)
    const [statusColor, setStatusColor] = useState("bg-blue-100 text-blue-800 border-blue-200")

    const handleAddStatus = useCallback(() => {
      if (!statusName.trim()) return

      const newStatus: OrderStatus = {
        id: statusName.toLowerCase().replace(/\s+/g, "-"),
        name: statusName,
        color: statusColor,
        step: statusStep,
        level: statusLevel,
        icon: Clock,
        allowedTransitions: [],
      }

      onAddStatus(newStatus)

      // Reset form
      setStatusName("")
      setStatusStep(1)
      setStatusLevel(1)
      setStatusColor("bg-blue-100 text-blue-800 border-blue-200")
    }, [statusName, statusColor, statusStep, statusLevel, onAddStatus])

    return (
      <div className="space-y-6">
        <Card className="bg-upsell-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Current Statuses</CardTitle>
            <CardDescription>Drag to reorder statuses in your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orderStatuses.map((status, index) => {
                const StatusIcon = status.icon
                const isDefault = defaultOrderStatuses.some((s) => s.id === status.id)

                return (
                  <div
                    key={status.id}
                    draggable={!isDefault}
                    onDragStart={(e) => onStatusDragStart(e, status, index)}
                    onDragOver={onStatusDragOver}
                    onDrop={(e) => onStatusDrop(e, index)}
                    className={cn(
                      "flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors",
                      !isDefault && "cursor-move hover:bg-gray-100",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {!isDefault && <GripVertical size={16} className="text-gray-400" />}
                      <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", status.color)}>
                        <StatusIcon size={12} />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{status.name}</span>
                        <div className="text-xs text-gray-500">
                          Step {status.step}, Level {status.level}
                        </div>
                      </div>
                      {isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    {!isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveStatus(status.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add New Status */}
        <Card className="bg-upsell-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Add New Status</CardTitle>
            <CardDescription>Create custom order statuses for your workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statusName">Status Name</Label>
                <Input
                  id="statusName"
                  placeholder="e.g., In Transit, Cancelled"
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusColor">Color</Label>
                <Select value={statusColor} onValueChange={setStatusColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-100 text-blue-800 border-blue-200">Blue</SelectItem>
                    <SelectItem value="bg-green-100 text-green-800 border-green-200">Green</SelectItem>
                    <SelectItem value="bg-yellow-100 text-yellow-800 border-yellow-200">Yellow</SelectItem>
                    <SelectItem value="bg-red-100 text-red-800 border-red-200">Red</SelectItem>
                    <SelectItem value="bg-purple-100 text-purple-800 border-purple-200">Purple</SelectItem>
                    <SelectItem value="bg-orange-100 text-orange-800 border-orange-200">Orange</SelectItem>
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
                  value={statusStep}
                  onChange={(e) => setStatusStep(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusLevel">Level</Label>
                <Input
                  id="statusLevel"
                  type="number"
                  min="1"
                  value={statusLevel}
                  onChange={(e) => setStatusLevel(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <Button
              onClick={handleAddStatus}
              disabled={!statusName.trim()}
              className="w-full bg-upsell-blue hover:bg-upsell-blue-hover"
            >
              <Plus size={16} className="mr-2" />
              Add Status
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  },
)

StatusSettings.displayName = "StatusSettings"

// Order Form Component
const OrderForm = React.memo(
  ({ order, setOrder }: { order: Order | Omit<Order, "id" | "time">; setOrder: (o: any) => void }) => {
    const [tagInput, setTagInput] = useState("")
    const [itemName, setItemName] = useState("")
    const [itemQuantity, setItemQuantity] = useState(1)
    const [itemPrice, setItemPrice] = useState(0)
    const [itemNotes, setItemNotes] = useState("")
    const [customerSearch, setCustomerSearch] = useState("")
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    // Filter customers based on search
    const filteredCustomers = demoCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase()),
    )

    const selectCustomer = (customer: Customer) => {
      setSelectedCustomer(customer)
      setCustomerSearch(customer.name)
      setShowCustomerDropdown(false)
      setOrder({
        ...order,
        customerId: customer.id,
        customer: customer.name,
        phone: customer.phone,
        address: customer.address,
      })
    }

    const handleCustomerSearchChange = (value: string) => {
      setCustomerSearch(value)
      setShowCustomerDropdown(value.length > 0)

      // If user clears the search, clear the selected customer
      if (value === "") {
        setSelectedCustomer(null)
        setOrder({
          ...order,
          customerId: "",
          customer: "",
          phone: "",
          address: "",
        })
      } else {
        // Update the customer name in real-time
        setOrder({
          ...order,
          customer: value,
        })
      }
    }

    const addTag = () => {
      if (tagInput.trim()) {
        setOrder((prev: any) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
        setTagInput("")
      }
    }

    const removeTag = (index: number) => {
      setOrder((prev: any) => ({
        ...prev,
        tags: prev.tags.filter((_: any, i: number) => i !== index),
      }))
    }

    const addItem = () => {
      if (itemName.trim() && itemPrice > 0) {
        const newItem: OrderItem = {
          name: itemName.trim(),
          quantity: itemQuantity,
          price: itemPrice,
          notes: itemNotes.trim() || undefined,
        }

        setOrder((prev: any) => ({
          ...prev,
          items: [...prev.items, newItem],
          total:
            prev.items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0) +
            newItem.price * newItem.quantity,
        }))

        // Reset item form
        setItemName("")
        setItemQuantity(1)
        setItemPrice(0)
        setItemNotes("")
      }
    }

    const removeItem = (index: number) => {
      setOrder((prev: any) => {
        const newItems = prev.items.filter((_: any, i: number) => i !== index)
        return {
          ...prev,
          items: newItems,
          total: newItems.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0),
        }
      })
    }

    const selectMenuItem = (menuItem: (typeof menuItems)[0]) => {
      setItemName(menuItem.name)
      setItemPrice(menuItem.price)
    }

    const navigateToCustomer = (customerId: string) => {
      window.location.href = `/customers?customer=${customerId}`
    }

    return (
      <div className="space-y-4">
        {/* Customer Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerSearch">Customer</Label>
            <div className="relative">
              <Input
                id="customerSearch"
                value={customerSearch}
                onChange={(e) => handleCustomerSearchChange(e.target.value)}
                onFocus={() => setShowCustomerDropdown(customerSearch.length > 0)}
                placeholder="Search by name, phone, or email..."
                className="pr-10"
              />
              {selectedCustomer && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Badge variant="outline" className="text-xs">
                    {selectedCustomer.status === "vip" ? "VIP" : selectedCustomer.status}
                  </Badge>
                </div>
              )}

              {/* Customer Dropdown */}
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCustomers.slice(0, 10).map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.phone}</div>
                          <div className="text-xs text-gray-500 truncate">{customer.email}</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            customer.status === "vip" && "bg-purple-100 text-purple-800 border-purple-200",
                            customer.status === "active" && "bg-green-100 text-green-800 border-green-200",
                            customer.status === "inactive" && "bg-gray-100 text-gray-800 border-gray-200",
                          )}
                        >
                          {customer.status === "vip" ? "VIP" : customer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Show customer details if selected */}
          {selectedCustomer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">Customer Details</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToCustomer(selectedCustomer.id)}
                  className="text-xs h-6 bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
                >
                  View Profile
                </Button>
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                <div>📧 {selectedCustomer.email}</div>
                <div>📍 {selectedCustomer.address}</div>
                {selectedCustomer.notes && <div>📝 {selectedCustomer.notes}</div>}
                <div className="flex gap-1 mt-2">
                  {selectedCustomer.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manual customer info if no customer selected */}
          {!selectedCustomer && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={order.phone}
                  onChange={(e) => setOrder({ ...order, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Order Type</Label>
                <Select value={order.type} onValueChange={(value: any) => setOrder({ ...order, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {(!selectedCustomer || order.type === "delivery") && (
            <div className="space-y-2">
              <Label htmlFor="address">{order.type === "delivery" ? "Delivery Address" : "Address"}</Label>
              <Textarea
                id="address"
                value={order.address}
                onChange={(e) => setOrder({ ...order, address: e.target.value })}
                placeholder="123 Main St, Downtown, NY 10001"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">Estimated Time</Label>
            <Input
              id="estimatedTime"
              value={order.estimatedTime || ""}
              onChange={(e) => setOrder({ ...order, estimatedTime: e.target.value })}
              placeholder="25-30 min"
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Order Items</Label>
            <Badge variant="secondary">Total: ${order.total.toFixed(2)}</Badge>
          </div>

          {/* Current Items */}
          {order.items.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    {item.notes && <span className="text-gray-500 text-sm ml-2">({item.notes})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Menu Items */}
          <div className="space-y-2">
            <Label className="text-sm">Quick Add from Menu</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {menuItems.map((menuItem, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => selectMenuItem(menuItem)}
                  className="justify-between text-xs h-8"
                >
                  <span>{menuItem.name}</span>
                  <span>${menuItem.price}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Add Custom Item */}
          <div className="border rounded-lg p-3 space-y-3">
            <Label className="text-sm font-medium">Add Item</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="itemName" className="text-xs">
                  Item Name
                </Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Item name"
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="itemPrice" className="text-xs">
                  Price
                </Label>
                <Input
                  id="itemPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemPrice || ""}
                  onChange={(e) => setItemPrice(Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="itemQuantity" className="text-xs">
                  Quantity
                </Label>
                <Input
                  id="itemQuantity"
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(Number.parseInt(e.target.value) || 1)}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="itemNotes" className="text-xs">
                  Notes (Optional)
                </Label>
                <Input
                  id="itemNotes"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  placeholder="Special instructions"
                  className="h-8"
                />
              </div>
            </div>
            <Button onClick={addItem} disabled={!itemName.trim() || itemPrice <= 0} size="sm" className="w-full h-8">
              <Plus size={12} className="mr-1" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Order Notes</Label>
          <Textarea
            id="notes"
            value={order.notes}
            onChange={(e) => setOrder({ ...order, notes: e.target.value })}
            placeholder="Special instructions or notes..."
          />
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" onClick={addTag} size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {order.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {tag}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTag(index)} />
              </Badge>
            ))}
          </div>
        </div>
      </div>
    )
  },
)

OrderForm.displayName = "OrderForm"

export default function OrdersPage() {
  const { preferences, updatePreference } = usePreferences()
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>(demoOrders)
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>(defaultOrderStatuses)
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null)
  const [draggedStatus, setDraggedStatus] = useState<OrderStatus | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [statusSettingsOpen, setStatusSettingsOpen] = useState(false)
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState<Omit<Order, "id" | "time">>(emptyOrder)
  const [selectedOrderForReject, setSelectedOrderForReject] = useState<Order | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [customRejectionReason, setCustomRejectionReason] = useState("")
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [screenMode, setScreenMode] = useState<ScreenMode>(() => {
    // Check URL params first, then localStorage, then default to "orders"
    if (typeof window !== "undefined") {
      const urlView = searchParams.get("view")
      if (urlView === "kitchen") return "kitchen"

      const savedMode = localStorage.getItem("upsell-orders-screen-mode")
      return (savedMode as ScreenMode) || "orders"
    }
    return "orders"
  })

  // Add useEffect to handle URL params and persistence
  useEffect(() => {
    const urlView = searchParams.get("view")
    if (urlView === "kitchen") {
      setScreenMode("kitchen")
    }
  }, [searchParams])

  // Add useEffect to persist screen mode
  useEffect(() => {
    localStorage.setItem("upsell-orders-screen-mode", screenMode)
  }, [screenMode])
  const [showCustomerDetails, setShowCustomerDetails] = useState<{ [key: string]: boolean }>({})

  // Auto-focus search and handle global typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with typing in input fields, textareas, or when modals are open
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        isAddOrderDialogOpen ||
        rejectDialogOpen ||
        statusSettingsOpen ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return
      }

      // Handle space key to open add order dialog
      if (e.key === " ") {
        e.preventDefault()
        setIsAddOrderDialogOpen(true)
        return
      }

      // Handle alphanumeric keys and backspace for search
      if ((e.key.length === 1 && /[a-zA-Z0-9\s@.-]/.test(e.key)) || e.key === "Backspace") {
        e.preventDefault()

        if (searchInputRef.current) {
          searchInputRef.current.focus()

          if (e.key === "Backspace") {
            setSearchTerm((prev) => prev.slice(0, -1))
          } else {
            setSearchTerm((prev) => prev + e.key)
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isAddOrderDialogOpen, rejectDialogOpen, statusSettingsOpen])

  const allTags = ["VIP", "Regular", "Delivery", "Pickup", "Rush", "Special"]

  // Memoized callbacks for StatusSettings
  const handleRemoveStatus = useCallback((statusId: string) => {
    // Don't allow removing default statuses
    const defaultIds = defaultOrderStatuses.map((s) => s.id)
    if (defaultIds.includes(statusId)) return

    setOrderStatuses((prev) => prev.filter((status) => status.id !== statusId))
  }, [])

  const handleMoveStatus = useCallback((fromIndex: number, toIndex: number) => {
    setOrderStatuses((prev) => {
      const newStatuses = [...prev]
      const [movedStatus] = newStatuses.splice(fromIndex, 1)
      newStatuses.splice(toIndex, 0, movedStatus)
      return newStatuses
    })
  }, [])

  const handleAddStatus = useCallback((newStatus: OrderStatus) => {
    setOrderStatuses((prev) => [...prev, newStatus])
  }, [])

  // Update the statusConfig to use the current orderStatuses
  const statusConfig = orderStatuses.reduce(
    (acc, status) => {
      acc[status.id] = {
        label: status.name,
        color: status.color,
        icon: status.icon,
        order: status.step,
        level: status.level,
      }
      return acc
    },
    {} as Record<string, any>,
  )

  // Update statusTabs to include all current statuses
  const statusTabs = [
    { key: "all", label: "All", count: orders.length },
    ...orderStatuses.map((status) => ({
      key: status.id,
      label: status.name,
      count: orders.filter((o) => o.status === status.id).length,
    })),
  ]

  const filteredOrders = orders.filter((order) => {
    if (screenMode === "kitchen") {
      return order.status === "preparing"
    }

    const matchesSearch =
      (order.customer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm) ||
      (order.customer_phone?.includes(searchTerm) ?? false)
    const matchesTags =
      preferences.ordersSelectedTags.length === 0 ||
      preferences.ordersSelectedTags.some((tag) => order.tags.includes(tag))

    // Only apply status filtering for list view and tags view, not board view
    const matchesStatus =
      preferences.ordersViewMode === "board" ||
      preferences.ordersActiveStatusTab === "all" ||
      order.status === preferences.ordersActiveStatusTab

    return matchesSearch && matchesTags && matchesStatus
  })

  const toggleTag = (tag: string) => {
    const newTags = preferences.ordersSelectedTags.includes(tag)
      ? preferences.ordersSelectedTags.filter((t) => t !== tag)
      : [...preferences.ordersSelectedTags, tag]
    updatePreference("ordersSelectedTags", newTags)
  }

  const moveOrder = (orderId: string, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const currentStatus = orderStatuses.find((s) => s.id === order.status)
    if (!currentStatus) return

    // Check if transition is allowed
    if (!currentStatus.allowedTransitions.includes(newStatus)) {
      console.warn(`Transition from ${order.status} to ${newStatus} is not allowed`)
      return
    }

    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleAddOrder = () => {
    if (!newOrder.customer.trim() || newOrder.items.length === 0) return

    const id = (Math.max(...orders.map((o) => Number.parseInt(o.id))) + 1).toString()
    const order: Order = {
      ...newOrder,
      id,
      time: "Just now",
    }
    setOrders([order, ...orders])
    setNewOrder(emptyOrder)
    setIsAddOrderDialogOpen(false)
  }

  const acceptOrder = (orderId: string) => {
    moveOrder(orderId, "preparing")
  }

  const openRejectDialog = (order: Order) => {
    setSelectedOrderForReject(order)
    setRejectDialogOpen(true)
  }

  const rejectOrder = () => {
    if (selectedOrderForReject) {
      const reason = rejectionReason === "Other" ? customRejectionReason : rejectionReason
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrderForReject.id
            ? { ...order, status: "rejected", notes: `${order.notes}\nRejected: ${reason}` }
            : order,
        ),
      )
      setRejectDialogOpen(false)
      setSelectedOrderForReject(null)
      setRejectionReason("")
      setCustomRejectionReason("")
    }
  }

  const toggleCustomerDetails = (orderId: string) => {
    setShowCustomerDetails((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  // Drag and drop handlers for orders
  const handleOrderDragStart = (e: React.DragEvent, order: Order) => {
    setDraggedOrder(order)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleOrderDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleOrderDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedOrder && draggedOrder.status !== newStatus) {
      moveOrder(draggedOrder.id, newStatus)
    }
    setDraggedOrder(null)
  }

  // Drag and drop handlers for statuses
  const handleStatusDragStart = useCallback((e: React.DragEvent, status: OrderStatus, index: number) => {
    setDraggedStatus(status)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
  }, [])

  const handleStatusDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleStatusDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault()
      const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
      if (dragIndex !== dropIndex) {
        handleMoveStatus(dragIndex, dropIndex)
      }
      setDraggedStatus(null)
    },
    [handleMoveStatus],
  )

  const getAvailableActions = (order: Order) => {
    const currentStatus = orderStatuses.find((s) => s.id === order.status)
    if (!currentStatus) return []

    return currentStatus.allowedTransitions
      .map((statusId) => {
        const targetStatus = orderStatuses.find((s) => s.id === statusId)
        if (!targetStatus) return null

        const getActionLabel = (statusId: string, order_type: "delivery" | "pickup" | "dine_in") => {
          switch (statusId) {
            case "preparing":
              return "Accept"
            case "ready":
              return "Ready"
            case "on-the-way":
              return order_type === "delivery" ? "Send Out" : "Ready"
            case "delivered":
              return order_type === "pickup" ? "Picked Up" : "Delivered"
            case "cancelled":
              return "Cancel"
            case "rejected":
              return "Reject"
            default:
              return targetStatus.name
          }
        }

        const getActionColor = (statusId: string) => {
          switch (statusId) {
            case "preparing":
              return "bg-green-500 hover:bg-green-600"
            case "ready":
              return "bg-green-500 hover:bg-green-600"
            case "on-the-way":
              return "bg-purple-500 hover:bg-purple-600"
            case "delivered":
              return "bg-gray-500 hover:bg-gray-600"
            case "cancelled":
              return "bg-red-500 hover:bg-red-600"
            case "rejected":
              return "bg-red-500 hover:bg-red-600"
            default:
              return "bg-blue-500 hover:bg-blue-600"
          }
        }

        return {
          statusId,
          label: getActionLabel(statusId, order.order_type),
          color: getActionColor(statusId),
          icon: targetStatus.icon,
        }
      })
      .filter(Boolean)
  }

  const OrderCard = ({
    order,
    showActions = false,
    isDraggable = false,
    isKitchenView = false,
  }: { order: Order; showActions?: boolean; isDraggable?: boolean; isKitchenView?: boolean }) => {
    const statusInfo = statusConfig[order.status]
    if (!statusInfo) return null

    const StatusIcon = statusInfo.icon
    const isNewOrder = order.status === "new"
    const isPreparingOrder = order.status === "preparing"
    const shouldShowCustomerDetails = isPreparingOrder ? showCustomerDetails[order.id] : true
    const availableActions = getAvailableActions(order)

    const navigateToCustomer = (customerId: string) => {
      // Navigate to customers page with the specific customer
      window.location.href = `/customers?customer=${customerId}`
    }

    return (
      <Card
        className={cn(
          "bg-upsell-card border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mb-3",
          isNewOrder && "ring-2 ring-blue-400 ring-opacity-50 bg-blue-50",
          isKitchenView && "bg-yellow-50 border-l-4 border-l-yellow-400",
        )}
        draggable={isDraggable}
        onDragStart={isDraggable ? (e) => handleOrderDragStart(e, order) : undefined}
        onMouseDown={
          isDraggable
            ? (e) => {
                // Enable dragging on mouse down for better UX
                e.currentTarget.setAttribute("draggable", "true")
              }
            : undefined
        }
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className={cn("font-bold text-sm", isNewOrder && "text-blue-700")}>#{order.order_number}</span>
              <Badge className={cn("flex items-center gap-1 border text-xs", statusInfo.color)}>
                <StatusIcon size={10} />
                {statusInfo.label}
              </Badge>
              {isKitchenView && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <ChefHat size={10} className="mr-1" />
                  Kitchen
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className={cn("font-bold text-sm", isNewOrder && "text-blue-700")}>${order.total_amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{order.created_at.toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            {/* Customer Details - Highlighted for new orders, hideable for preparing orders */}
            {shouldShowCustomerDetails && (
              <div className={cn("p-2 rounded", isNewOrder && "bg-blue-100 border border-blue-200")}>
                <button
                  onClick={() => order.customer_id && navigateToCustomer(order.customer_id)}
                  className={cn(
                    "font-semibold text-sm mb-1 text-left hover:underline transition-colors",
                    isNewOrder ? "text-blue-900 hover:text-blue-700" : "text-gray-900 hover:text-blue-600",
                    order.customer_id ? "cursor-pointer" : "cursor-default",
                  )}
                  disabled={!order.customer_id}
                >
                  {order.customer_name}
                  {order.customer_id && <span className="ml-1 text-xs opacity-70">→</span>}
                </button>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={10} />
                  <span className="truncate">{order.customer_phone}</span>
                </div>
                {order.order_type === "delivery" && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-xs mt-1",
                      isNewOrder ? "text-blue-700 font-medium" : "text-gray-600",
                    )}
                  >
                    <MapPin size={10} />
                    <span className="truncate">{order.delivery_address}</span>
                  </div>
                )}
              </div>
            )}

            {/* Toggle button for preparing orders */}
            {isPreparingOrder && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCustomerDetails(order.id)}
                className="w-full justify-center text-xs text-gray-600 hover:text-gray-800"
              >
                {shouldShowCustomerDetails ? (
                  <>
                    <EyeOff size={12} className="mr-1" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <Eye size={12} className="mr-1" />
                    Show Details
                  </>
                )}
              </Button>
            )}

            {/* Items - Highlighted for new orders */}
            <div className={cn("rounded p-2", isNewOrder ? "bg-blue-50 border border-blue-200" : "bg-gray-50")}>
              <h4 className={cn("font-medium text-xs mb-1", isNewOrder ? "text-blue-800" : "text-gray-700")}>Items:</h4>
              <div className="space-y-1">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className={cn("truncate", isNewOrder && "font-medium text-blue-800")}>
                      {item.quantity}x {item.name}
                      {item.notes && <span className="text-gray-500 ml-1">({item.notes})</span>}
                    </span>
                    <span className={cn("font-medium", isNewOrder && "text-blue-800")}>
                      ${item.total_price.toFixed(2)}
                    </span>
                  </div>
                ))}
                {order.items.length > 2 && <p className="text-xs text-gray-500">+{order.items.length - 2} more</p>}
              </div>
            </div>

            {order.notes && (
              <div className="bg-blue-50 rounded p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Edit3 size={10} className="text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Notes:</span>
                </div>
                <p className="text-xs text-blue-700 truncate">{order.notes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex flex-wrap gap-1">
                {order.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-600">
                <Clock size={10} className="inline mr-1" />
                {order.estimated_prep_time} min
              </div>
            </div>

            {showActions && availableActions.length > 0 && (
              <div className="flex gap-2 pt-2 flex-wrap">
                {availableActions.map((action) => {
                  if (action.statusId === "rejected") {
                    return (
                      <Button
                        key={action.statusId}
                        size="sm"
                        variant="outline"
                        onClick={() => openRejectDialog(order)}
                        className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-7 flex items-center gap-1"
                      >
                        <action.icon size={12} />
                        {action.label}
                      </Button>
                    )
                  }

                  return (
                    <Button
                      key={action.statusId}
                      size="sm"
                      onClick={() => moveOrder(order.id, action.statusId)}
                      className={cn("text-white text-xs h-7 flex items-center gap-1", action.color)}
                    >
                      <action.icon size={12} />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const KitchenView = () => {
    const preparingOrders = filteredOrders.filter((order) => order.status === "preparing")

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-yellow-800">Kitchen Orders</h2>
            <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
              {preparingOrders.length} orders
            </Badge>
          </div>
          <p className="text-sm text-yellow-700">Orders currently being prepared in the kitchen</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {preparingOrders.map((order) => (
            <OrderCard key={order.id} order={order} showActions={true} isKitchenView={true} />
          ))}
        </div>

        {preparingOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <ChefHat size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No orders in kitchen</h3>
            <p className="text-sm">All orders are either completed or waiting to be accepted</p>
          </div>
        )}
      </div>
    )
  }

  const ListView = () => (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <OrderCard key={order.id} order={order} showActions={true} />
      ))}
    </div>
  )

  const BoardView = () => {
    // Group statuses by step, then by level
    const statusesByStep = orderStatuses.reduce(
      (acc, status) => {
        if (!acc[status.step]) {
          acc[status.step] = []
        }
        acc[status.step].push(status)
        return acc
      },
      {} as Record<number, OrderStatus[]>,
    )

    // Sort steps and levels
    const sortedSteps = Object.keys(statusesByStep)
      .map(Number)
      .sort((a, b) => a - b)

    return (
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4">
          {sortedSteps.map((stepNumber) => {
            const stepStatuses = statusesByStep[stepNumber].sort((a, b) => a.level - b.level)

            return (
              <div key={stepNumber} className="flex-shrink-0">
                <div className="mb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Step {stepNumber}</h3>
                  <div className="h-px bg-gray-200"></div>
                </div>

                <div className="flex gap-4">
                  {stepStatuses.map((status) => {
                    const statusOrders = filteredOrders.filter((order) => order.status === status.id)
                    const StatusIcon = status.icon

                    return (
                      <div key={status.id} className="flex-shrink-0 w-80">
                        <Card className="bg-upsell-card border-0 shadow-sm h-full">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <StatusIcon size={16} />
                              {status.name}
                              <Badge variant="secondary" className="ml-auto">
                                {statusOrders.length}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent
                            className="space-y-0 min-h-[500px] max-h-[600px] overflow-y-auto pt-4"
                            onDragOver={handleOrderDragOver}
                            onDrop={(e) => handleOrderDrop(e, status.id)}
                          >
                            {statusOrders.map((order) => (
                              <OrderCard key={order.id} order={order} isDraggable={true} />
                            ))}
                            {statusOrders.length === 0 && (
                              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                                No orders in {status.name.toLowerCase()}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const TagsView = () => (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="border-b border-gray-200 relative">
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <nav
            className="flex space-x-8 overflow-x-auto scrollbar-none pb-0 pl-4 pr-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
              scrollBehavior: "smooth",
            }}
          >
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => updatePreference("ordersActiveStatusTab", tab.key)}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 min-w-fit",
                  preferences.ordersActiveStatusTab === tab.key
                    ? "border-upsell-blue text-upsell-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
                style={{ touchAction: "manipulation" }}
              >
                {tab.label}
                <Badge variant="secondary" className="ml-2">
                  {tab.count}
                </Badge>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} showActions={true} />
        ))}
      </div>
    </div>
  )

  return (
    <FloatingSidebar>
      <div className="flex flex-col h-screen">
        {/* Fixed Header */}
        <div className="flex-shrink-0 mt-4 ml-4 mb-6 relative z-10">
          <div className="bg-upsell-sidebar text-white p-8 rounded-l-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">{screenMode === "kitchen" ? "Kitchen View" : "Orders"}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">Kitchen View</span>
                    <Switch
                      checked={screenMode === "kitchen"}
                      onCheckedChange={(checked) => setScreenMode(checked ? "kitchen" : "orders")}
                    />
                  </div>
                </div>
                <p className="text-gray-300">
                  {screenMode === "kitchen"
                    ? "Monitor orders currently being prepared in the kitchen"
                    : "Manage and track all your orders"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <RefreshCw size={16} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatusSettingsOpen(true)}
                  className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Settings size={16} />
                </Button>
              </div>
            </div>

            {/* Orders View Controls */}
            {screenMode === "orders" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search and Filters */}
                  <div className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        ref={searchInputRef}
                        placeholder="Search orders, customers, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => updatePreference("ordersShowFilters", !preferences.ordersShowFilters)}
                      className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Filter size={16} />
                      {preferences.ordersShowFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>

                  {/* View Switcher */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <Button
                      variant={preferences.ordersViewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updatePreference("ordersViewMode", "list")}
                      className={cn(
                        "flex items-center gap-2",
                        preferences.ordersViewMode === "list"
                          ? "bg-upsell-blue text-white shadow-sm hover:bg-upsell-blue-hover"
                          : "text-gray-300 hover:bg-gray-700",
                      )}
                    >
                      <List size={16} />
                      List
                    </Button>
                    <Button
                      variant={preferences.ordersViewMode === "board" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updatePreference("ordersViewMode", "board")}
                      className={cn(
                        "flex items-center gap-2",
                        preferences.ordersViewMode === "board"
                          ? "bg-upsell-blue text-white shadow-sm hover:bg-upsell-blue-hover"
                          : "text-gray-300 hover:bg-gray-700",
                      )}
                    >
                      <Kanban size={16} />
                      Board
                    </Button>
                    <Button
                      variant={preferences.ordersViewMode === "tags" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updatePreference("ordersViewMode", "tags")}
                      className={cn(
                        "flex items-center gap-2",
                        preferences.ordersViewMode === "tags"
                          ? "bg-upsell-blue text-white shadow-sm hover:bg-upsell-blue-hover"
                          : "text-gray-300 hover:bg-gray-700",
                      )}
                    >
                      <Tags size={16} />
                      Tags
                    </Button>
                  </div>
                </div>

                {/* Expandable Filters */}
                {preferences.ordersShowFilters && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-gray-300 mr-2">Filter by tags:</span>
                      {allTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={preferences.ordersSelectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "transition-colors",
                            preferences.ordersSelectedTags.includes(tag)
                              ? "bg-upsell-blue hover:bg-upsell-blue-hover text-white"
                              : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700",
                          )}
                        >
                          {tag}
                        </Button>
                      ))}
                      {preferences.ordersSelectedTags.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updatePreference("ordersSelectedTags", [])}
                          className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          {/* Kitchen View */}
          {screenMode === "kitchen" && <KitchenView />}

          {/* Orders View */}
          {screenMode === "orders" && (
            <>
              {/* Content */}
              {preferences.ordersViewMode === "list" && <ListView />}
              {preferences.ordersViewMode === "board" && <BoardView />}
              {preferences.ordersViewMode === "tags" && <TagsView />}
            </>
          )}
        </div>

        {/* Floating New Order Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsAddOrderDialogOpen(true)}
            className="rounded-full w-14 h-14 bg-upsell-blue hover:bg-upsell-blue-hover shadow-lg hover:shadow-xl transition-all duration-200"
            size="icon"
          >
            <Plus size={24} />
          </Button>
        </div>

        {/* Add Order Dialog */}
        <Dialog open={isAddOrderDialogOpen} onOpenChange={setIsAddOrderDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
              <DialogDescription>Create a new order for a customer</DialogDescription>
            </DialogHeader>
            <OrderForm order={newOrder} setOrder={setNewOrder} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddOrder}
                disabled={!newOrder.customer.trim() || newOrder.items.length === 0}
                className="bg-upsell-blue hover:bg-upsell-blue-hover"
              >
                <Save size={16} className="mr-2" />
                Add Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Settings Dialog */}
        <Dialog open={statusSettingsOpen} onOpenChange={setStatusSettingsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Status Settings</DialogTitle>
              <DialogDescription>Configure your order workflow statuses and transitions</DialogDescription>
            </DialogHeader>
            <StatusSettings
              orderStatuses={orderStatuses}
              onRemoveStatus={handleRemoveStatus}
              onMoveStatus={handleMoveStatus}
              onAddStatus={handleAddStatus}
              onStatusDragStart={handleStatusDragStart}
              onStatusDragOver={handleStatusDragOver}
              onStatusDrop={handleStatusDrop}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusSettingsOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-upsell-blue hover:bg-upsell-blue-hover">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Order Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Reject Order #{selectedOrderForReject?.id}
              </DialogTitle>
              <DialogDescription>
                Please select a reason for rejecting this order. This will notify the customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for rejection</label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {rejectionReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {rejectionReason === "Other" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom reason</label>
                  <Textarea
                    placeholder="Please specify the reason..."
                    value={customRejectionReason}
                    onChange={(e) => setCustomRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={rejectOrder}
                disabled={!rejectionReason || (rejectionReason === "Other" && !customRejectionReason.trim())}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FloatingSidebar>
  )
}
