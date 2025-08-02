"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare, Clock, Bot, Download, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import centralized demo data
import { demoAIConversations, getCustomerById, getOrderById } from "@/lib/demo-data"

const statusColors = {
  completed: "bg-green-100 text-green-800",
  abandoned: "bg-red-100 text-red-800",
  active: "bg-blue-100 text-blue-800",
  escalated: "bg-yellow-100 text-yellow-800",
}

const channelIcons = {
  whatsapp: "💬",
  facebook: "📱",
  web: "🌐",
  phone: "📞",
  sms: "💬",
}

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterChannel, setFilterChannel] = useState("all")

  const filteredConversations = demoAIConversations.filter((conv) => {
    const customer = getCustomerById(conv.customer_id)
    const matchesSearch =
      conv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.customer_phone.includes(searchTerm) ||
      conv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === "all" || conv.status === filterStatus
    const matchesChannel = filterChannel === "all" || conv.channel === filterChannel

    return matchesSearch && matchesStatus && matchesChannel
  })

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleString()
  }

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return "Ongoing"
    const duration = end.getTime() - start.getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getConversationStats = () => {
    const total = demoAIConversations.length
    const completed = demoAIConversations.filter((c) => c.status === "completed").length
    const totalDuration = demoAIConversations
      .filter((c) => c.ended_at)
      .reduce((acc, c) => {
        const duration = c.ended_at!.getTime() - c.started_at.getTime()
        return acc + duration
      }, 0)
    const avgDuration = totalDuration / demoAIConversations.filter((c) => c.ended_at).length
    const conversionRate = (demoAIConversations.filter((c) => c.outcome === "order_placed").length / total) * 100

    return {
      total,
      completionRate: ((completed / total) * 100).toFixed(1),
      avgDuration: Math.floor(avgDuration / 60000) + "m " + Math.floor((avgDuration % 60000) / 1000) + "s",
      conversionRate: conversionRate.toFixed(1),
    }
  }

  const stats = getConversationStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-600 mt-2">View and analyze AI chat history with customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-upsell-blue" />
            </div>
            <p className="text-xs text-gray-500 mt-2">All AI interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Successfully completed chats</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgDuration}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Average conversation length</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Order Conversion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Conversations that led to orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
          <CardDescription>Browse and analyze customer conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="web">Web Widget</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const customer = getCustomerById(conversation.customer_id)
              const order = conversation.order_id ? getOrderById(conversation.order_id) : null

              return (
                <div
                  key={conversation.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={customer?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.customer_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{conversation.customer_name}</h3>
                          <span className="text-sm text-gray-500">{conversation.customer_phone}</span>
                          <span className="text-lg">{channelIcons[conversation.channel]}</span>
                          {customer && (
                            <Badge variant="outline" className="text-xs">
                              {customer.status === "vip" ? "VIP" : customer.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{conversation.last_message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatTime(conversation.started_at)}</span>
                          <span>{formatDuration(conversation.started_at, conversation.ended_at)}</span>
                          <span>{conversation.total_messages} messages</span>
                          {order && <span className="text-blue-600">Order #{order.order_number}</span>}
                          {conversation.ai_confidence_score && (
                            <span>Confidence: {(conversation.ai_confidence_score * 100).toFixed(0)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[conversation.status]}>{conversation.status}</Badge>
                      {conversation.order_value > 0 && (
                        <Badge variant="outline" className="text-green-600">
                          ${conversation.order_value.toFixed(2)}
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {conversation.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {conversation.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <MessageSquare size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No conversations found</h3>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
