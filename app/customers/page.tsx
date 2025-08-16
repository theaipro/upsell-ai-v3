"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { FloatingSidebar } from "@/components/floating-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChatPanel } from "@/components/chat-panel"
import { CustomerProfilePanel } from "@/components/customer-profile-panel"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Crown,
  MoreHorizontal,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Customer {
  id: string
  company_id: string
  name: string
  email: string
  phone: string
  address: string
  city?: string
  state?: string
  zip_code?: string
  status: "active" | "inactive" | "vip"
  join_date: string
  birthday?: string
  referral_source?: string
  marketing_consent?: boolean
  sms_consent?: boolean
  notes?: string
  tags: string[]
  total_orders_lifetime: number
  total_spent_lifetime: number
  total_orders_month: number
  total_spent_month: number
  loyalty_points: number
  loyalty_tier?: string
  last_order_date?: string
  last_chat_summary?: string
  avg_days_between_orders: number
  preferences: {
    dietary_restrictions?: string[]
    preferred_contact_method?: string
    delivery_instructions?: string
    favorite_product_id?: string
  }
  analysis_data: {
    ltv?: number
    predicted_clv?: number
    churn_risk?: number
    favorite_items?: string[]
    favorite_categories?: string[]
    most_active_day?: string
    most_active_time?: string
  }
  recent_orders_history: any[]
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

interface Product {
  id: string
  name: string
  category_id: string
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800 border-green-200", icon: User },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Users },
  vip: { label: "VIP", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Crown },
}

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "last_order_date", label: "Last Order" },
  { value: "join_date", label: "Join Date" },
  { value: "total_orders_lifetime", label: "Total Orders" },
  { value: "total_spent_lifetime", label: "Total Spent" },
  { value: "status", label: "Status" },
]

const emptyCustomer: Omit<Customer, "id"> = {
  company_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  status: "active",
  join_date: new Date().toISOString(),
  total_orders_lifetime: 0,
  total_spent_lifetime: 0,
  total_orders_month: 0,
  total_spent_month: 0,
  loyalty_points: 0,
  avg_days_between_orders: 0,
  notes: "",
  tags: [],
  preferences: {
    dietary_restrictions: [],
    preferred_contact_method: "email",
    delivery_instructions: "",
    favorite_product_id: "",
  },
  analysis_data: {
    ltv: 0,
    predicted_clv: 0,
    churn_risk: 0,
    favorite_items: [],
    favorite_categories: [],
    most_active_day: "",
    most_active_time: "",
  },
  recent_orders_history: [],
}

const CustomerForm = React.memo(
  ({
    customer,
    setCustomer,
    products,
  }: { customer: Customer | Omit<Customer, "id">; setCustomer: (c: any) => void; products: any[] }) => {
    const [tagInput, setTagInput] = useState("")
    const [dietaryRestrictionInput, setDietaryRestrictionInput] = useState("")
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [favoriteProductSearch, setFavoriteProductSearch] = useState("")
    const [showProductDropdown, setShowProductDropdown] = useState(false)

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(favoriteProductSearch.toLowerCase()),
    )

    const addTag = () => {
      if (tagInput.trim()) {
        setCustomer((prev: any) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
        setTagInput("")
      }
    }

    const removeTag = (index: number) => {
      setCustomer((prev: any) => ({
        ...prev,
        tags: prev.tags.filter((_: any, i: number) => i !== index),
      }))
    }

    const addDietaryRestriction = () => {
      if (dietaryRestrictionInput.trim()) {
        setCustomer((prev: any) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            dietary_restrictions: [...(prev.preferences?.dietary_restrictions || []), dietaryRestrictionInput.trim()],
          },
        }))
        setDietaryRestrictionInput("")
      }
    }

    const removeDietaryRestriction = (index: number) => {
      setCustomer((prev: any) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          dietary_restrictions:
            prev.preferences?.dietary_restrictions?.filter((_: any, i: number) => i !== index) || [],
        },
      }))
    }

    const selectFavoriteProduct = (product: any) => {
      const currentFavorites = customer.analysis_data?.favorite_items || []
      if (!currentFavorites.includes(product.name)) {
        setCustomer({
          ...customer,
          analysis_data: {
            ...customer.analysis_data,
            favorite_items: [...currentFavorites, product.name],
          },
        })
      }
      setFavoriteProductSearch("")
      setShowProductDropdown(false)
    }

    const removeFavoriteProduct = (productName: string) => {
      const currentFavorites = customer.analysis_data?.favorite_items || []
      setCustomer({
        ...customer,
        analysis_data: {
          ...customer.analysis_data,
          favorite_items: currentFavorites.filter((item) => item !== productName),
        },
      })
    }

    return (
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              placeholder="john.doe@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={customer.status} onValueChange={(value: any) => setCustomer({ ...customer, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            placeholder="123 Main St, Downtown, NY 10001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={customer.notes}
            onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
            placeholder="Any special notes about this customer..."
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
            {customer.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {tag}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTag(index)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* Advanced Customer Information */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              Advanced Customer Information
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={customer.birthday ? new Date(customer.birthday).toISOString().split("T")[0] : ""}
                  onChange={(e) => setCustomer({ ...customer, birthday: new Date(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralSource">Referral Source</Label>
                <Select
                  value={customer.referral_source || ""}
                  onValueChange={(value) => setCustomer({ ...customer, referral_source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Friend Referral">Friend Referral</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Online Search">Online Search</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
              <Input
                id="loyaltyPoints"
                type="number"
                value={customer.loyalty_points || 0}
                onChange={(e) => setCustomer({ ...customer, loyalty_points: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-gray-900">Preferences</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="communicationPreference">Communication Preference</Label>
                  <Select
                    value={customer.preferences?.preferred_contact_method || "email"}
                    onValueChange={(value: any) =>
                      setCustomer({
                        ...customer,
                        preferences: { ...customer.preferences, preferred_contact_method: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="app">App Notifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                <Textarea
                  id="deliveryInstructions"
                  value={customer.preferences?.delivery_instructions || ""}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      preferences: { ...customer.preferences, delivery_instructions: e.target.value },
                    })
                  }
                  placeholder="Special delivery instructions..."
                />
              </div>

              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={dietaryRestrictionInput}
                    onChange={(e) => setDietaryRestrictionInput(e.target.value)}
                    placeholder="Add dietary restriction..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addDietaryRestriction()
                      }
                    }}
                  />
                  <Button type="button" onClick={addDietaryRestriction} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.preferences?.dietary_restrictions?.map((restriction, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {restriction}
                      <X
                        size={12}
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => removeDietaryRestriction(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Favorite Products section */}
              <div className="space-y-2">
                <Label>Favorite Products</Label>
                <div className="relative">
                  <Input
                    value={favoriteProductSearch}
                    onChange={(e) => {
                      setFavoriteProductSearch(e.target.value)
                      setShowProductDropdown(true)
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    placeholder="Search and select favorite products..."
                  />
                  {showProductDropdown && favoriteProductSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100"
                            onClick={() => selectFavoriteProduct(product)}
                          >
                            {product.name}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500">No products found</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(customer.analysis_data?.favorite_items || []).map((productName, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Heart size={10} className="text-red-500" />
                      {productName}
                      <X
                        size={12}
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => removeFavoriteProduct(productName)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
)

CustomerForm.displayName = "CustomerForm"

const handleNullValue = (value: any, defaultValue: string) => {
  return value ? value : defaultValue
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>(emptyCustomer)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false)
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false)
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false)
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false)
  const [chatCustomer, setChatCustomer] = useState<Customer | null>(null)
  const [profileCustomer, setProfileCustomer] = useState<Customer | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()

  const supabase = createClient()
  const { toast } = useToast()

  const fetchCustomers = async () => {
    try {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view customers.",
          variant: "destructive",
        })
        return
      }

      const { data } = await supabase.from("user_profiles").select("company_id").eq("id", user.id).single()

      if (!data?.company_id) {
        toast({
          title: "Setup Required",
          description: "Please complete your company setup first.",
          variant: "destructive",
        })
        return
      }

      const { data: customerData, error } = await supabase
        .from("customers")
        .select("*")
        .eq("company_id", data.company_id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching customers:", error)
        toast({
          title: "Error",
          description: "Failed to load customers. Please try again.",
          variant: "destructive",
        })
        return
      }

      setCustomers(customerData || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.user_metadata?.company_id) return

    setLoadingProducts(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category_id")
        .eq("company_id", user.user_metadata.company_id)
        .eq("is_available", true)
        .order("name")

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchProducts()
  }, [])

  useEffect(() => {
    const customerId = searchParams.get("customer")
    if (customerId) {
      const customer = customers.find((c) => c.id === customerId)
      if (customer) {
        setProfileCustomer(customer)
        setIsProfilePanelOpen(true)
      }
    }
  }, [searchParams, customers])

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        isAddCustomerDialogOpen ||
        isEditCustomerDialogOpen ||
        isDeleteCustomerDialogOpen ||
        isChatPanelOpen ||
        isProfilePanelOpen ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return
      }

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
  }, [
    isAddCustomerDialogOpen,
    isEditCustomerDialogOpen,
    isDeleteCustomerDialogOpen,
    isChatPanelOpen,
    isProfilePanelOpen,
  ])

  const getGridColumns = () => {
    if (containerWidth < 640) return "grid-cols-1"
    if (containerWidth < 1024) return "grid-cols-2"
    if (containerWidth < 1400) return "grid-cols-3"
    return "grid-cols-3"
  }

  const sortCustomers = (customers: Customer[]) => {
    return [...customers].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "last_order_date":
          aValue = a.last_order_date ? new Date(a.last_order_date).getTime() : 0
          bValue = b.last_order_date ? new Date(b.last_order_date).getTime() : 0
          break
        case "join_date":
          aValue = new Date(a.join_date).getTime()
          bValue = new Date(b.join_date).getTime()
          break
        case "total_orders_lifetime":
          aValue = a.total_orders_lifetime
          bValue = b.total_orders_lifetime
          break
        case "total_spent_lifetime":
          aValue = a.total_spent_lifetime
          bValue = b.total_spent_lifetime
          break
        case "status":
          const statusOrder = { vip: 3, active: 2, inactive: 1 }
          aValue = statusOrder[a.status]
          bValue = statusOrder[b.status]
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }

  const filteredAndSortedCustomers = sortCustomers(
    customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesSearch
    }),
  )

  const handleAddCustomer = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to add customers.",
          variant: "destructive",
        })
        return
      }

      const { data } = await supabase.from("user_profiles").select("company_id").eq("id", user.id).single()

      if (!data?.company_id) {
        toast({
          title: "Setup Required",
          description: "Please complete your company setup first.",
          variant: "destructive",
        })
        return
      }

      const customerData = {
        ...newCustomer,
        company_id: data.company_id,
        join_date: new Date().toISOString(),
      }

      const { data: insertedCustomer, error } = await supabase
        .from("customers")
        .insert([customerData])
        .select()
        .single()

      if (error) {
        console.error("Error adding customer:", error)
        toast({
          title: "Error",
          description: "Failed to add customer. Please try again.",
          variant: "destructive",
        })
        return
      }

      setCustomers([insertedCustomer, ...customers])
      setNewCustomer(emptyCustomer)
      setIsAddCustomerDialogOpen(false)

      toast({
        title: "Success",
        description: "Customer added successfully.",
      })
    } catch (error) {
      console.error("Error adding customer:", error)
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditCustomer = async () => {
    if (!editingCustomer) return

    try {
      const { error } = await supabase.from("customers").update(editingCustomer).eq("id", editingCustomer.id)

      if (error) {
        console.error("Error updating customer:", error)
        toast({
          title: "Error",
          description: "Failed to update customer. Please try again.",
          variant: "destructive",
        })
        return
      }

      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? editingCustomer : c)))
      setEditingCustomer(null)
      setIsEditCustomerDialogOpen(false)

      toast({
        title: "Success",
        description: "Customer updated successfully.",
      })
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return

    try {
      const { error } = await supabase.from("customers").delete().eq("id", selectedCustomer.id)

      if (error) {
        console.error("Error deleting customer:", error)
        toast({
          title: "Error",
          description: "Failed to delete customer. Please try again.",
          variant: "destructive",
        })
        return
      }

      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id))
      setSelectedCustomer(null)
      setIsDeleteCustomerDialogOpen(false)

      toast({
        title: "Success",
        description: "Customer deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openChat = (customer: Customer) => {
    setChatCustomer(customer)
    setIsChatPanelOpen(true)
  }

  const openProfile = (customer: Customer) => {
    setProfileCustomer(customer)
    setIsProfilePanelOpen(true)
    const url = new URL(window.location.href)
    url.searchParams.set("customer", customer.id)
    window.history.replaceState({}, "", url.toString())
  }

  const handleCustomerDoubleClick = (customer: Customer) => {
    openChat(customer)
  }

  const CustomerCard = ({ customer }: { customer: Customer }) => {
    const config = statusConfig[customer.status]
    const StatusIcon = config.icon

    return (
      <Card
        className="bg-upsell-card border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        onDoubleClick={() => handleCustomerDoubleClick(customer)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={customer.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-upsell-blue text-white">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">{customer.name}</h3>
                    <p className="text-sm text-gray-500 leading-tight mb-1">{customer.email}</p>
                    <p className="text-sm text-gray-500 leading-tight">{customer.phone}</p>
                  </div>
                  <Badge className={cn("flex items-center gap-1 flex-shrink-0 ml-2", config.color)}>
                    <StatusIcon size={12} />
                    {config.label}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 ml-2 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                openProfile(customer)
              }}
            >
              <MoreHorizontal size={16} />
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="flex-shrink-0" />
              <span>Joined {handleNullValue(new Date(customer.join_date).toLocaleDateString(), "N/A")}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={14} className="flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-tight">
                {handleNullValue(customer.address, "No address provided")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded p-2">
                <div className="font-medium text-gray-900">{customer.total_orders_lifetime}</div>
                <div className="text-gray-500">Orders</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="font-medium text-gray-900">${customer.total_spent_lifetime.toFixed(0)}</div>
                <div className="text-gray-500">Spent</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {customer.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {customer.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{customer.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                openChat(customer)
              }}
              className="flex-1"
            >
              <MessageCircle size={14} className="mr-1" />
              Chat
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Phone size={14} className="mr-1" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setEditingCustomer(customer)
                setIsEditCustomerDialogOpen(true)
              }}
            >
              <Edit size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedCustomer(customer)
                setIsDeleteCustomerDialogOpen(true)
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <FloatingSidebar>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upsell-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      </FloatingSidebar>
    )
  }

  return (
    <FloatingSidebar>
      <div className="flex flex-col h-screen">
        <div className="flex-shrink-0 mt-4 ml-4 mb-6 relative z-10">
          <div className="bg-upsell-sidebar text-white p-8 rounded-l-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Customers</h1>
                <p className="text-gray-300 mt-2">Manage your customer relationships and data</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search customers by name, email, phone, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 px-3"
                  >
                    <ArrowUpDown size={16} className="mr-1" />
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative z-0" ref={containerRef}>
          <div className={cn("grid gap-6", getGridColumns())}>
            {filteredAndSortedCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>

          {filteredAndSortedCustomers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No customers found</h3>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 right-6 z-30">
          <Button
            onClick={() => setIsAddCustomerDialogOpen(true)}
            className="rounded-full w-14 h-14 bg-upsell-blue hover:bg-upsell-blue-hover shadow-lg hover:shadow-xl transition-all duration-200"
            size="icon"
          >
            <Plus size={24} />
          </Button>
        </div>

        <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Create a new customer profile</DialogDescription>
            </DialogHeader>
            <CustomerForm customer={newCustomer} setCustomer={setNewCustomer} products={products} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                <Save size={16} className="mr-2" />
                Add Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>Update customer information</DialogDescription>
            </DialogHeader>
            {editingCustomer && (
              <CustomerForm customer={editingCustomer} setCustomer={setEditingCustomer} products={products} />
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCustomerDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCustomer} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteCustomerDialogOpen} onOpenChange={setIsDeleteCustomerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Customer</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCustomer?.name}? This action cannot be undone and will remove
                all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteCustomerDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteCustomer} className="bg-red-600 hover:bg-red-700 text-white">
                Delete Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ChatPanel
          customer={chatCustomer}
          isOpen={isChatPanelOpen}
          onClose={() => setIsChatPanelOpen(false)}
          onOpenProfile={openProfile}
        />

        <CustomerProfilePanel
          customer={profileCustomer}
          isOpen={isProfilePanelOpen}
          onClose={() => {
            setIsProfilePanelOpen(false)
            const url = new URL(window.location.href)
            url.searchParams.delete("customer")
            window.history.replaceState({}, "", url.toString())
          }}
          onEdit={(customer) => {
            setEditingCustomer(customer)
            setIsEditCustomerDialogOpen(true)
            setIsProfilePanelOpen(false)
          }}
          onDelete={(customer) => {
            setSelectedCustomer(customer)
            setIsDeleteCustomerDialogOpen(true)
            setIsProfilePanelOpen(false)
          }}
          onStartChat={(customer) => {
            openChat(customer)
            setIsProfilePanelOpen(false)
          }}
        />
      </div>
    </FloatingSidebar>
  )
}
