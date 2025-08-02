"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, MessageSquare, DollarSign, Clock, Download, Target, Globe } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { demoAIAnalyticsData, demoAIConversations, getAIAnalyticsStats, getChannelStats } from "@/lib/demo-data"
import { format } from "date-fns"

const conversationData = demoAIAnalyticsData.map((d) => ({
  date: format(d.analytics_date, "MMM d"),
  conversations: d.total_conversations,
  completed: d.completed_conversations,
  abandoned: d.abandoned_conversations,
}))

const upsellData = demoAIAnalyticsData.map((d) => ({
  date: format(d.analytics_date, "MMM d"),
  attempts: d.upsell_attempts,
  successful: d.successful_upsells,
  revenue: d.upsell_revenue,
}))

const channelData = getChannelStats().map((c) => ({
  name: c.name,
  value: c.conversations,
  color:
    c.name === "WhatsApp"
      ? "#25D366"
      : c.name === "Facebook Messenger"
        ? "#0084FF"
        : c.name === "Web Widget"
          ? "#6366F1"
          : "#E4405F",
}))

const topIntents = Object.entries(
  demoAIConversations.reduce(
    (acc, conv) => {
      if (conv.tags) {
        conv.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
      }
      return acc
    },
    {} as Record<string, number>,
  ),
)
  .map(([intent, count]) => ({
    intent,
    count,
    success: Math.floor(Math.random() * 40) + 60,
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5)

const stats = getAIAnalyticsStats()

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Analytics</h1>
          <p className="text-gray-600 mt-2">Performance metrics and insights for your AI assistant</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs last week
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-upsell-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedConversations}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.1% vs last week
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalOrderValue.toFixed(2)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18.7% vs last week
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgConfidence.toFixed(1)}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.3% vs last week
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conversations" className="flex items-center gap-3">
            <MessageSquare size={18} />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="upselling" className="flex items-center gap-3">
            <Target size={18} />
            Upselling
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-3">
            <Globe size={18} />
            Channels
          </TabsTrigger>
          <TabsTrigger value="intents" className="flex items-center gap-3">
            <BarChart3 size={18} />
            Intents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Trends</CardTitle>
              <CardDescription>Daily conversation volume and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="conversations"
                      stroke="#6366F1"
                      strokeWidth={2}
                      name="Total Conversations"
                    />
                    <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
                    <Line type="monotone" dataKey="abandoned" stroke="#EF4444" strokeWidth={2} name="Abandoned" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upselling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upselling Performance</CardTitle>
              <CardDescription>Track upselling attempts, success rates, and revenue generated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={upsellData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="attempts" fill="#94A3B8" name="Attempts" />
                    <Bar dataKey="successful" fill="#10B981" name="Successful" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Upsell Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">73.2%</p>
                  <Progress value={73.2} className="mt-4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Avg Upsell Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">$8.45</p>
                  <p className="text-sm text-green-600 mt-2">+$1.20 vs last week</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Upsell Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">$2,847</p>
                  <p className="text-sm text-green-600 mt-2">18.7% of total revenue</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>Conversation volume by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Completion rates and metrics by channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {channelData.map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: channel.color }} />
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{channel.value}%</p>
                      <p className="text-sm text-gray-600">of conversations</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Customer Intents</CardTitle>
              <CardDescription>Most common customer requests and AI success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topIntents.map((intent, index) => (
                  <div key={intent.intent} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <h3 className="font-semibold">{intent.intent}</h3>
                        <p className="text-sm text-gray-600">{intent.count} occurrences</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={intent.success >= 80 ? "default" : intent.success >= 60 ? "secondary" : "destructive"}
                        className="mb-2"
                      >
                        {intent.success}% Success
                      </Badge>
                      <Progress value={intent.success} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
