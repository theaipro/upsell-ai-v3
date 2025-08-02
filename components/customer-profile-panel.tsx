"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  ShoppingBag,
  TrendingUp,
  Heart,
  Gift,
  MessageSquare,
  User,
  Users,
  Crown,
  Edit,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

import type { Customer } from "@/lib/demo-data"
// Add the import statement for the new utility function
import { handleNullValue } from "@/lib/null-value-handler"

interface CustomerProfilePanelProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
  onStartChat: (customer: Customer) => void
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800 border-green-200", icon: User },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Users },
  vip: { label: "VIP", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Crown },
}

const mockOrderHistory = [
  {
    id: "1001",
    date: "2024-01-20",
    total: 34.99,
    status: "Delivered",
    items: ["Margherita Pizza", "Caesar Salad"],
  },
  {
    id: "1002",
    date: "2024-01-18",
    total: 28.5,
    status: "Delivered",
    items: ["Chicken Burger", "Fries"],
  },
  {
    id: "1003",
    date: "2024-01-15",
    total: 42.75,
    status: "Delivered",
    items: ["Pasta Carbonara", "Garlic Bread", "Tiramisu"],
  },
  {
    id: "1004",
    date: "2024-01-12",
    total: 19.99,
    status: "Delivered",
    items: ["Thai Curry", "Spring Rolls"],
  },
  {
    id: "1005",
    date: "2024-01-10",
    total: 52.25,
    status: "Delivered",
    items: ["Ribeye Steak", "Mashed Potatoes", "Red Wine"],
  },
]

export function CustomerProfilePanel({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStartChat,
}: CustomerProfilePanelProps) {
  if (!customer) return null

  const config = statusConfig[customer.status]
  const StatusIcon = config.icon

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Profile Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-[600px] sm:w-[600px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage src={customer.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-upsell-blue text-white text-xl">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900 truncate">{customer.name}</h2>
                <Badge className={cn("flex items-center gap-1 flex-shrink-0", config.color)}>
                  <StatusIcon size={12} />
                  {config.label}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={12} />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 flex-shrink-0">
            <X size={16} />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b bg-white flex-shrink-0">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button onClick={() => onStartChat(customer)} className="bg-upsell-blue hover:bg-upsell-blue-hover">
              <MessageSquare size={16} className="mr-2" />
              Start Chat
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Phone size={16} className="mr-2" />
              Call
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onEdit(customer)} className="flex-1">
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent flex-1"
              onClick={() => onDelete(customer)}
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <div className="px-6 pt-6 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 space-y-6 flex-1">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ShoppingBag size={20} className="text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{customer.total_orders || 0}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${(customer.total_spent || 0).toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star size={20} className="text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{customer.loyalty_points || 0}</p>
                    <p className="text-sm text-gray-600">Loyalty Points</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">Last Order</p>
                  </CardContent>
                </Card>
              </div>

              {/* Average Order Value */}
              <Card className="border-0 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">${(customer.average_order_value || 0).toFixed(2)}</p>
                  <p className="text-sm text-blue-700">Average Order Value</p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="text-sm">{handleNullValue(customer.address, "No address provided")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="text-sm">
                      Member since {handleNullValue(new Date(customer.join_date).toLocaleDateString(), "N/A")}
                    </span>
                  </div>
                  {customer.birthday && (
                    <div className="flex items-center gap-3">
                      <Gift size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-sm">Birthday: {new Date(customer.birthday).toLocaleDateString()}</span>
                    </div>
                  )}
                  {customer.referral_source && (
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-sm">Found us via: {customer.referral_source}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Favorite Items */}
              {customer.analysis?.favorite_items && customer.analysis?.favorite_items.length > 0 && (
                <Card className="border-0 bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Favorite Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {customer.analysis.favorite_items.map((item, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Heart size={10} className="text-red-500" />
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {customer.tags && customer.tags.length > 0 && (
                <Card className="border-0 bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {customer.notes && (
                <Card className="border-0 bg-yellow-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{customer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="p-6 space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">${(customer.analysis?.ltv || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Lifetime Value</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      ${(customer.analysis?.predicted_clv || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Predicted CLV</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {(customer.analysis?.churn_risk || 0).toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600">Churn Risk</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {customer.analysis?.avg_days_between_orders || 0}
                    </p>
                    <p className="text-sm text-gray-600">Avg Days Between Orders</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="border-0 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Favorite Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(customer.analysis?.favorite_items || []).map((item, index) => (
                      <Badge key={index} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Favorite Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(customer.analysis?.favorite_categories || []).map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="p-6 flex-1">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Order History</h3>
                <div className="space-y-3">
                  {mockOrderHistory.map((order) => (
                    <Card key={order.id} className="border-0 bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total}</p>
                            <Badge variant="outline" className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Items: {order.items.join(", ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="p-6 space-y-6 flex-1">
              {/* Communication Preferences */}
              <Card className="border-0 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Communication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="text-sm">
                      Prefers: {customer.preferences?.preferred_contact_method || "Email"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Dietary Restrictions */}
              {customer.preferences?.dietary_restrictions && customer.preferences.dietary_restrictions.length > 0 && (
                <Card className="border-0 bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Dietary Restrictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {customer.preferences.dietary_restrictions.map((restriction, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Instructions */}
              {customer.preferences?.delivery_instructions && (
                <Card className="border-0 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Delivery Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{customer.preferences.delivery_instructions}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
