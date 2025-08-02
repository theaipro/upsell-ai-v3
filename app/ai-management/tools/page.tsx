"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  Calendar,
  Clock,
  CloudSun,
  CreditCard,
  Database,
  FileText,
  MapPin,
  RefreshCw,
  ShoppingBag,
  Star,
  Tag,
  Users,
  Icon,
} from "lucide-react"
import { demoAITools } from "@/lib/demo-data"
import { useState } from "react"
import { AITool } from "@/lib/demo-data"

const toolIcons: { [key: string]: Icon } = {
  "menu-items": FileText,
  "menu-prices": Tag,
  "menu-allergens": AlertCircle,
  "menu-recommendations": Star,
  "inventory-status": ShoppingBag,
  "inventory-sync": Database,
  "inventory-alerts": AlertCircle,
  "customer-history": Users,
  "customer-preferences": Star,
  "loyalty-points": Star,
  "store-hours": Clock,
  "store-location": MapPin,
  "store-events": Calendar,
  "payment-processing": CreditCard,
  "weather-data": CloudSun,
  "location-services": MapPin,
}

const ToolCard = ({ tool }: { tool: AITool }) => {
  const [isEnabled, setIsEnabled] = useState(tool.is_enabled)

  const getToolIcon = (settingKey: string) => {
    const IconComponent = toolIcons[settingKey]
    return IconComponent ? <IconComponent className="h-5 w-5 text-primary" /> : null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                tool.connection_status === "connected" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }
            >
              {tool.connection_status}
            </Badge>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(tool.settings).map(([key, value], index) => (
          <div key={key}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">{getToolIcon(key)}</div>
                <div>
                  <Label htmlFor={key}>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</Label>
                  <p className="text-sm text-muted-foreground">
                    {typeof value === "boolean"
                      ? `Allow AI to ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`
                      : `Sync interval: ${value} minutes`}
                  </p>
                </div>
              </div>
              <Switch id={key} checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>
            {index < Object.entries(tool.settings).length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function ToolsPage() {
  const [tools, setTools] = useState<AITool[]>(demoAITools)

  const toolsByCategory = tools.reduce(
    (acc, tool) => {
      acc[tool.category] = acc[tool.category] || []
      acc[tool.category].push(tool)
      return acc
    },
    {} as Record<string, AITool[]>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
        <p className="text-muted-foreground">Configure data sources and tools that the AI can access.</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold tracking-tight mb-4 capitalize">{category}</h2>
            <div className="grid gap-6">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
