"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { FloatingSidebar } from "@/components/floating-sidebar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Activity,
  Clock,
  Star,
  Settings,
  BarChart3,
  Pizza,
  TrendingDown,
  ChefHat,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Users2, UserPlus, Crown } from "lucide-react"
import { usePreferences } from "@/lib/preferences-context"
import { useState } from "react"

// Import centralized demo data
import {
  demoOrders,
  demoCustomers,
  demoProducts,
  demoAIConversations,
  getDashboardStats,
  getProductStats,
} from "@/lib/demo-data"

const quickActions = [
  { label: "New Order", icon: ShoppingCart, color: "blue", href: "/orders" },
  { label: "Kitchen View", icon: ChefHat, color: "yellow", href: "/orders?view=kitchen" },
  { label: "Add Customer", icon: UserPlus, color: "green", href: "/customers" },
  { label: "AI Assistant", icon: Bot, color: "purple", href: "/ai-management" },
]

const MenuPerformanceCard = ({ isDragging }: { isDragging?: boolean }) => {
  const [timeRange, setTimeRange] = useState(30)

  const topProducts = demoProducts
    .map((p) => {
      const orders = p.monthly_data.orders.slice(-timeRange).reduce((acc, curr) => acc + curr.value, 0)
      const revenue = p.monthly_data.revenue.slice(-timeRange).reduce((acc, curr) => acc + curr.value, 0)
      return { ...p, total_orders: orders, total_revenue: revenue }
    })
    .filter((p) => p.total_orders > 0)
    .sort((a, b) => b.total_orders - a.total_orders)
    .slice(0, 4)

  return (
    <Card
      className={cn(
        "bg-upsell-card border-0 shadow-sm cursor-move hover:shadow-lg transition-all duration-200",
        isDragging && "opacity-50 scale-95",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Menu Performance
          </CardTitle>
          <CardDescription>Top performing items by orders and revenue</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {[1, 7, 30, 90].map((range) => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className="text-xs"
            >
              {range}d
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => {
            const percentage = Math.round((product.total_orders / (topProducts[0]?.total_orders || 1)) * 100)
            const trend = product.total_revenue > product.total_orders * (product.cost || 0) ? "up" : "down"

            return (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold",
                      index === 0 && "bg-yellow-500",
                      index === 1 && "bg-gray-400",
                      index === 2 && "bg-orange-500",
                      index >= 3 && "bg-blue-500",
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{product.total_orders} orders</span>
                      <span>${product.total_revenue.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        index === 0 && "bg-yellow-500",
                        index === 1 && "bg-gray-400",
                        index === 2 && "bg-orange-500",
                        index >= 3 && "bg-blue-500",
                      )}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const CategoryBreakdownCard = ({ isDragging }: { isDragging?: boolean }) => {
  // Calculate category performance from real data
  const categoryStats = demoProducts.reduce(
    (acc, product) => {
      const categoryName =
        product.category_id === "cat_1"
          ? "Pizza"
          : product.category_id === "cat_2"
            ? "Salads"
            : product.category_id === "cat_3"
              ? "Burgers"
              : product.category_id === "cat_4"
                ? "Pasta"
                : product.category_id === "cat_5"
                  ? "Beverages"
                  : "Other"

      if (!acc[categoryName]) {
        acc[categoryName] = { revenue: 0, orders: 0 }
      }
      acc[categoryName].revenue += product.total_revenue
      acc[categoryName].orders += product.total_orders
      return acc
    },
    {} as Record<string, { revenue: number; orders: number }>,
  )

  const totalRevenue = Object.values(categoryStats).reduce((sum, cat) => sum + cat.revenue, 0)
  const categories = Object.entries(categoryStats)
    .map(([name, stats]) => ({
      name,
      revenue: stats.revenue,
      orders: stats.orders,
      percentage: Math.round((stats.revenue / totalRevenue) * 100),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)

  return (
    <Card
      className={cn(
        "bg-upsell-card border-0 shadow-sm cursor-move hover:shadow-lg transition-all duration-200",
        isDragging && "opacity-50 scale-95",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Pizza className="h-5 w-5 text-orange-500" />
            Category Breakdown
          </CardTitle>
          <CardDescription>Revenue distribution by menu categories</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{category.orders} orders</span>
                    <span>${category.revenue.toFixed(0)}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">{category.percentage}%</span>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const TrendingItemsCard = ({ isDragging }: { isDragging?: boolean }) => {
  // Get trending items based on recent orders and AI conversations
  const trendingItems = [
    { name: "Margherita Pizza", growth: "+45%", orders: 156 },
    { name: "Caesar Salad", growth: "+32%", orders: 89 },
    { name: "Chicken Burger", growth: "+28%", orders: 98 },
    { name: "Cappuccino", growth: "+22%", orders: 245 },
  ]

  return (
    <Card
      className={cn(
        "bg-upsell-card border-0 shadow-sm cursor-move hover:shadow-lg transition-all duration-200",
        isDragging && "opacity-50 scale-95",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Trending Items
          </CardTitle>
          <CardDescription>Items with highest growth this week</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingItems.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                <p className="text-xs text-gray-600">{item.orders} orders this week</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">{item.growth}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const ProfitAnalysisCard = ({ isDragging }: { isDragging?: boolean }) => {
  // Calculate profit margins from real product data
  const profitableItems = demoProducts
    .filter((p) => p.cost && p.total_revenue > 0)
    .map((p) => ({
      name: p.name,
      profit: p.total_revenue - p.cost! * p.total_orders,
      margin: p.cost ? Math.round(((p.price - p.cost) / p.price) * 100) : 0,
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 4)

  return (
    <Card
      className={cn(
        "bg-upsell-card border-0 shadow-sm cursor-move hover:shadow-lg transition-all duration-200",
        isDragging && "opacity-50 scale-95",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Profit Analysis
          </CardTitle>
          <CardDescription>Most profitable items and margins</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {profitableItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                <p className="text-sm text-gray-600">Profit margin: {item.margin}%</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-sm">${item.profit.toFixed(0)}</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const analyticsCards = [
  {
    id: "menu-performance",
    title: "Menu Performance",
    component: MenuPerformanceCard,
  },
  {
    id: "category-breakdown",
    title: "Category Breakdown",
    component: CategoryBreakdownCard,
  },
  {
    id: "trending-items",
    title: "Trending Items",
    component: TrendingItemsCard,
  },
  {
    id: "profit-analysis",
    title: "Profit Analysis",
    component: ProfitAnalysisCard,
  },
]

export default function DashboardPage() {
  const { preferences, updatePreference } = usePreferences()
  const [draggedCard, setDraggedCard] = useState<string | null>(null)

  // Get real dashboard statistics
  const dashboardStats = getDashboardStats()
  const productStats = getProductStats()

  // Calculate real-time stats from demo data
  const stats = [
    {
      id: "orders",
      title: "Total Orders",
      value: dashboardStats.totalOrders.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      color: "blue",
      trend: [65, 78, 82, 95, 88, 92, 100],
    },
    {
      id: "revenue",
      title: "Revenue",
      value: `$${dashboardStats.totalRevenue.toFixed(0)}`,
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "green",
      trend: [45, 52, 48, 61, 58, 67, 72],
    },
    {
      id: "staff",
      title: "Active Staff",
      value: "12",
      change: "+2",
      changeType: "positive" as const,
      icon: Users,
      color: "purple",
      trend: [8, 9, 10, 11, 10, 11, 12],
    },
    {
      id: "growth",
      title: "AI Conversion",
      value: `${dashboardStats.conversionRate.toFixed(1)}%`,
      change: "+4.2%",
      changeType: "positive" as const,
      icon: Bot,
      color: "orange",
      trend: [15, 18, 20, 19, 21, 22, 23.5],
    },
  ]

  const customerStats = [
    {
      id: "total-customers",
      title: "Total Customers",
      value: demoCustomers.length.toString(),
      change: "+23",
      changeType: "positive" as const,
      icon: Users2,
      color: "green",
      trend: [120, 135, 148, 142, 156, 151, 145],
    },
    {
      id: "vip-customers",
      title: "VIP Customers",
      value: demoCustomers.filter((c) => c.status === "vip").length.toString(),
      change: "+5",
      changeType: "positive" as const,
      icon: Crown,
      color: "purple",
      trend: [78, 82, 85, 83, 87, 89, 89],
    },
  ]

  const allStats = [...stats, ...customerStats]

  const toggleCardVisibility = (cardId: string) => {
    const newVisibleCards = preferences.dashboardVisibleCards.includes(cardId)
      ? preferences.dashboardVisibleCards.filter((id) => id !== cardId)
      : [...preferences.dashboardVisibleCards, cardId]
    updatePreference("dashboardVisibleCards", newVisibleCards)
  }

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", cardId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault()
    const draggedCardId = e.dataTransfer.getData("text/plain")

    if (draggedCardId && draggedCardId !== targetCardId) {
      const currentOrder = preferences.dashboardVisibleCards
      const draggedIndex = currentOrder.indexOf(draggedCardId)
      const targetIndex = currentOrder.indexOf(targetCardId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newOrder = [...currentOrder]
        newOrder.splice(draggedIndex, 1)
        newOrder.splice(targetIndex, 0, draggedCardId)
        updatePreference("dashboardVisibleCards", newOrder)
      }
    }
    setDraggedCard(null)
  }

  const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)

    return (
      <div className="flex items-end h-8 gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className={cn(
              "w-1 rounded-t transition-all duration-300",
              color === "blue" && "bg-blue-500",
              color === "green" && "bg-green-500",
              color === "purple" && "bg-purple-500",
              color === "orange" && "bg-orange-500",
            )}
            style={{
              height: `${((value - min) / (max - min)) * 100}%`,
              minHeight: "4px",
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <FloatingSidebar>
      <div className="p-8">
        {/* Header with Customization */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your restaurant.</p>
          </div>
          <div className="relative group">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Settings size={16} />
              Customize Dashboard
            </Button>
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Analytics Cards</p>
                <div className="space-y-2">
                  {allStats.map((stat) => (
                    <label key={stat.id} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.dashboardVisibleCards.includes(stat.id)}
                        onChange={() => toggleCardVisibility(stat.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">{stat.title}</span>
                    </label>
                  ))}
                </div>
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-3">Advanced Analytics</p>
                  <div className="space-y-2">
                    {analyticsCards.map((card) => (
                      <label key={card.id} className="flex items-center gap-2 py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.dashboardVisibleCards.includes(card.id)}
                          onChange={() => toggleCardVisibility(card.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{card.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className={cn(
                  "h-16 flex flex-col items-center gap-2 hover:scale-105 transition-transform w-full",
                  action.color === "blue" && "hover:bg-blue-50 hover:border-blue-200",
                  action.color === "yellow" && "hover:bg-yellow-50 hover:border-yellow-200",
                  action.color === "green" && "hover:bg-green-50 hover:border-green-200",
                  action.color === "purple" && "hover:bg-purple-50 hover:border-purple-200",
                )}
              >
                <action.icon
                  size={20}
                  className={cn(
                    action.color === "blue" && "text-blue-500",
                    action.color === "yellow" && "text-yellow-500",
                    action.color === "green" && "text-green-500",
                    action.color === "purple" && "text-purple-500",
                  )}
                />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Live System Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
              <p className="text-gray-600">Real-time system and AI performance monitoring</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              All Systems Operational
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-upsell-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Assistant</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                  <Bot className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-3 text-xs text-gray-500">Response time: 1.2s avg</div>
              </CardContent>
            </Card>

            <Card className="bg-upsell-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Order System</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-3 text-xs text-gray-500">Processing: 24 orders/min</div>
              </CardContent>
            </Card>

            <Card className="bg-upsell-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Kitchen Display</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                    </div>
                  </div>
                  <ChefHat className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-3 text-xs text-gray-500">Last sync: 30s ago</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Key Metrics</h2>
              <p className="text-gray-600">Essential performance indicators for your restaurant</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {allStats
              .filter((stat) => preferences.dashboardVisibleCards.includes(stat.id))
              .map((stat) => (
                <Card
                  key={stat.id}
                  className="bg-upsell-card border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                >
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-full h-1",
                      stat.color === "blue" && "bg-gradient-to-r from-blue-400 to-blue-600",
                      stat.color === "green" && "bg-gradient-to-r from-green-400 to-green-600",
                      stat.color === "purple" && "bg-gradient-to-r from-purple-400 to-purple-600",
                      stat.color === "orange" && "bg-gradient-to-r from-orange-400 to-orange-600",
                    )}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        stat.color === "blue" && "bg-blue-100",
                        stat.color === "green" && "bg-green-100",
                        stat.color === "purple" && "bg-purple-100",
                        stat.color === "orange" && "bg-orange-100",
                      )}
                    >
                      <stat.icon
                        className={cn(
                          "h-4 w-4",
                          stat.color === "blue" && "text-blue-600",
                          stat.color === "green" && "text-green-600",
                          stat.color === "purple" && "text-purple-600",
                          stat.color === "orange" && "text-orange-600",
                        )}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-gray-500">from last month</span>
                    </div>
                    <MiniChart data={stat.trend} color={stat.color} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
              <p className="text-gray-600">Comprehensive insights into your restaurant performance</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <BarChart3 size={16} />
              View Full Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsCards
              .filter((card) => preferences.dashboardVisibleCards.includes(card.id))
              .sort((a, b) => {
                const aIndex = preferences.dashboardVisibleCards.indexOf(a.id)
                const bIndex = preferences.dashboardVisibleCards.indexOf(b.id)
                return aIndex - bIndex
              })
              .map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, card.id)}
                  className="transition-transform duration-200 hover:scale-[1.02]"
                >
                  <card.component isDragging={draggedCard === card.id} />
                </div>
              ))}
          </div>
        </div>

        {/* Enhanced Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-upsell-card border-0 shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Orders</CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                <Activity size={12} className="mr-1" />
                Live
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoOrders.slice(0, 5).map((order, i) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total_amount.toFixed(2)}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock size={12} />
                        {order.created_at.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-upsell-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Live Metrics
              </CardTitle>
              <CardDescription>Real-time restaurant activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900 text-sm">Orders Today</p>
                    <p className="text-xs text-green-600">+12% from yesterday</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-900">{demoOrders.length}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900 text-sm">Active Customers</p>
                    <p className="text-xs text-blue-600">
                      {demoCustomers.filter((c) => c.status === "active").length} active
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">
                      {demoCustomers.filter((c) => c.status === "active" || c.status === "vip").length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-900 text-sm">AI Conversations</p>
                    <p className="text-xs text-orange-600">
                      {demoAIConversations.filter((c) => c.status === "completed").length} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-900">{demoAIConversations.length}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-900 text-sm">Products Available</p>
                    <p className="text-xs text-purple-600">
                      {demoProducts.filter((p) => p.is_available).length} in stock
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-900">{demoProducts.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FloatingSidebar>
  )
}
