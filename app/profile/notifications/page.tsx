"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Smartphone, MessageSquare, TrendingUp, AlertCircle, Users, ShoppingCart } from "lucide-react"
import { demoNotificationPreferences, type NotificationPreference } from "@/lib/demo-data"

export default function NotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationPreference>(demoNotificationPreferences[0])

  const [quietHours, setQuietHours] = useState({
    enabled: notificationSettings.quiet_hours_enabled,
    start: notificationSettings.quiet_hours_start,
    end: notificationSettings.quiet_hours_end,
  })

  const [frequency, setFrequency] = useState("immediate")

  const updateNotificationSetting = (id: string, channel: "email" | "push" | "sms", value: boolean) => {
    setNotificationSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, [channel]: value } : setting)),
    )
  }

  const getIcon = (id: string) => {
    switch (id) {
      case "orders":
        return ShoppingCart
      case "ai_conversations":
        return MessageSquare
      case "upsell_success":
        return TrendingUp
      case "system_alerts":
        return AlertCircle
      case "customer_feedback":
        return Users
      case "billing":
        return Bell
      default:
        return Bell
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">Manage how and when you receive notifications</p>
      </div>

      {/* Notification Preferences */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to be notified for different events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Headers */}
            <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200">
              <div className="col-span-6">
                <Label className="text-sm font-medium text-gray-700">Notification Type</Label>
              </div>
              <div className="col-span-2 text-center">
                <Label className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                  <Mail size={14} />
                  Email
                </Label>
              </div>
              <div className="col-span-2 text-center">
                <Label className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                  <Smartphone size={14} />
                  Push
                </Label>
              </div>
              <div className="col-span-2 text-center">
                <Label className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                  <MessageSquare size={14} />
                  SMS
                </Label>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="grid grid-cols-12 gap-4 items-center py-3">
              <div className="col-span-6 flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Orders</p>
                  <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <Switch
                  checked={notificationSettings.email_new_orders}
                  onCheckedChange={(value) =>
                    setNotificationSettings((prev) => ({ ...prev, email_new_orders: value }))
                  }
                  className="data-[state=checked]:bg-upsell-blue"
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <Switch
                  checked={notificationSettings.push_new_orders}
                  onCheckedChange={(value) => setNotificationSettings((prev) => ({ ...prev, push_new_orders: value }))}
                  className="data-[state=checked]:bg-upsell-blue"
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <Switch
                  checked={notificationSettings.sms_urgent_orders}
                  onCheckedChange={(value) =>
                    setNotificationSettings((prev) => ({ ...prev, sms_urgent_orders: value }))
                  }
                  className="data-[state=checked]:bg-upsell-blue"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>Control how often you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Email Digest Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">Choose how often you want to receive email notifications</p>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>Set times when you don't want to receive push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Enable Quiet Hours</p>
              <p className="text-sm text-gray-600">Pause push notifications during specified hours</p>
            </div>
            <Switch
              checked={quietHours.enabled}
              onCheckedChange={(value) => setQuietHours((prev) => ({ ...prev, enabled: value }))}
              className="data-[state=checked]:bg-upsell-blue"
            />
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiet-start">Start Time</Label>
                <Select
                  value={quietHours.start}
                  onValueChange={(value) => setQuietHours((prev) => ({ ...prev, start: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0")
                      return (
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-end">End Time</Label>
                <Select
                  value={quietHours.end}
                  onValueChange={(value) => setQuietHours((prev) => ({ ...prev, end: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0")
                      return (
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Contact Preferences</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>• You can unsubscribe from marketing emails at any time</p>
          <p>• System notifications and security alerts cannot be disabled</p>
          <p>• SMS notifications may incur charges from your carrier</p>
          <p>• Push notifications require browser or app permissions</p>
        </CardContent>
      </Card>
    </div>
  )
}
