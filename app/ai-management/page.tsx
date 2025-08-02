import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Activity, ArrowRight, Bot, CheckCircle, Clock, MessageSquare, RefreshCw, Server, Settings } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Import centralized demo data
import { demoAIConversations } from "@/lib/demo-data"

export default function AIManagementPage() {
  // Calculate real-time AI statistics from demo data
  const totalConversations = demoAIConversations.length
  const completedConversations = demoAIConversations.filter((c) => c.status === "completed").length
  const ordersFromAI = demoAIConversations.filter((c) => c.outcome === "order_placed").length
  const totalAIRevenue = demoAIConversations.reduce((sum, conv) => sum + conv.order_value, 0)
  const conversionRate = totalConversations > 0 ? (ordersFromAI / totalConversations) * 100 : 0
  const avgResponseTime = 1.2 // This would come from actual AI metrics
  const avgConfidence =
    demoAIConversations.reduce((sum, conv) => sum + (conv.ai_confidence_score || 0), 0) / totalConversations

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Management</h1>
        <p className="text-muted-foreground">Monitor and manage your AI assistant system.</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of your AI assistant system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">AI System</p>
                  <p className="text-xl font-bold text-green-700">Online</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Server className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">API Status</p>
                  <p className="text-xl font-bold text-green-700">Operational</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Response Time</p>
                  <p className="text-xl font-bold text-green-700">{avgResponseTime}s</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>System Load</Label>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Memory Usage</Label>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>API Rate Limit</Label>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Last checked: Today at 10:42 AM</p>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest AI interactions and events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {demoAIConversations.slice(0, 3).map((conversation, index) => (
                  <div key={conversation.id}>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {conversation.outcome === "order_placed" ? "Order completed" : "New conversation started"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {conversation.outcome === "order_placed"
                            ? `AI successfully processed order from ${conversation.customer_name}`
                            : `Customer ${conversation.customer_name} started a new chat`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conversation.started_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {index < 2 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View All Activity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common AI management tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                  <Bot className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Test AI Responses</p>
                    <p className="text-xs text-muted-foreground">Try out conversations in a sandbox environment</p>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                  <Settings className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Configure AI Behavior</p>
                    <p className="text-xs text-muted-foreground">Adjust personality, tone, and response patterns</p>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                  <Clock className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Update Operating Hours</p>
                    <p className="text-xs text-muted-foreground">Set when the AI should accept orders</p>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3 bg-transparent">
                  <RefreshCw className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Sync Menu Data</p>
                    <p className="text-xs text-muted-foreground">Update AI with latest menu and inventory</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for your AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Conversations Today</p>
                <p className="text-2xl font-bold">{totalConversations}</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Orders Processed</p>
                <p className="text-2xl font-bold">{ordersFromAI}</p>
                <p className="text-xs text-green-600">+8% from yesterday</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                <p className="text-2xl font-bold">{avgResponseTime}s</p>
                <p className="text-xs text-green-600">-0.3s from yesterday</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600">+5% from yesterday</p>
              </div>
            </div>

            <div className="mt-6">
              <Button>
                View Detailed Analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium">{children}</p>
}
