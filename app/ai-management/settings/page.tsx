"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Globe, Shield, Database, Save, RotateCcw, AlertTriangle, CheckCircle, Lock } from "lucide-react"
import { demoCompany, type Company, demoAISettings, demoChannels, type AISettings } from "@/lib/demo-data"

export default function SettingsPage() {
  const [settings, setSettings] = useState<AISettings>(demoAISettings)
  const [company, setCompany] = useState<Company>(demoCompany)

  // Get current day and format operating hours
  const getCurrentDayHours = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
    return `${today}: 9:00 AM - 10:00 PM`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Settings</h1>
        <p className="text-gray-600 mt-2">Configure system-wide AI settings and preferences</p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">AI Service</p>
                <p className="text-sm text-gray-600">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Last Backup</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-3">
            <Settings size={18} />
            General
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-3">
            <Globe size={18} />
            Channels
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-3">
            <Shield size={18} />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-3">
            <Database size={18} />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic configuration options for your AI assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <div className="relative">
                      <Input id="restaurant-name" value={company.name} disabled className="bg-gray-50 text-gray-500" />
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Restaurant name is managed in main settings</p>
                  </div>

                  <div>
                    <Label htmlFor="ai-name">AI Assistant Name</Label>
                    <Input
                      id="ai-name"
                      value={company.ai_assistant_name}
                      onChange={(e) => setCompany({ ...company, ai_assistant_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="america/new_york">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america/new_york">Eastern Time</SelectItem>
                        <SelectItem value="america/chicago">Central Time</SelectItem>
                        <SelectItem value="america/denver">Mountain Time</SelectItem>
                        <SelectItem value="america/los_angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="cad">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Primary Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="operating-hours">Operating Hours (Today)</Label>
                    <div className="relative">
                      <Input
                        id="operating-hours"
                        value={getCurrentDayHours()}
                        disabled
                        className="bg-gray-50 text-gray-500"
                      />
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Operating hours are managed in main settings</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">System Preferences</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Temporarily disable AI for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(value) => setSettings({ ...settings, maintenanceMode: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Update Menu</Label>
                    <p className="text-sm text-gray-600">Automatically sync menu changes</p>
                  </div>
                  <Switch
                    checked={settings.autoUpdateMenu}
                    onCheckedChange={(value) => setSettings({ ...settings, autoUpdateMenu: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Smart Notifications</Label>
                    <p className="text-sm text-gray-600">Get alerts for important events</p>
                  </div>
                  <Switch
                    checked={settings.smartNotifications}
                    onCheckedChange={(value) => setSettings({ ...settings, smartNotifications: value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Channel Configuration
              </CardTitle>
              <CardDescription>Manage AI integration across different communication channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {demoChannels.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{channel.icon}</span>
                    <div>
                      <h3 className="font-semibold">{channel.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={channel.status === "connected" ? "default" : "secondary"}
                          className={channel.status === "connected" ? "bg-green-600" : ""}
                        >
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                    <Switch defaultChecked={channel.status === "connected"} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and privacy settings for your AI system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Rate Limiting</Label>
                    <p className="text-sm text-gray-600">Limit requests per user to prevent abuse</p>
                  </div>
                  <Switch
                    checked={settings.enableRateLimiting}
                    onCheckedChange={(value) => setSettings({ ...settings, enableRateLimiting: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Encrypt Customer Data</Label>
                    <p className="text-sm text-gray-600">Encrypt sensitive customer information</p>
                  </div>
                  <Switch
                    checked={settings.encryptCustomerData}
                    onCheckedChange={(value) => setSettings({ ...settings, encryptCustomerData: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for admin access</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuthentication}
                    onCheckedChange={(value) => setSettings({ ...settings, twoFactorAuthentication: value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">API Security</h3>

                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2 mt-1">
                    <Input id="api-key" type="password" defaultValue="sk-1234567890abcdef" readOnly />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <div className="flex gap-2 mt-1">
                    <Input id="webhook-secret" type="password" defaultValue="whsec_abcdef123456" readOnly />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Configure data storage, backup, and retention policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-gray-600">Automatically backup data daily</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(value) => setSettings({ ...settings, autoBackup: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Conversation Logging</Label>
                    <p className="text-sm text-gray-600">Log all AI conversations for analysis</p>
                  </div>
                  <Switch
                    checked={settings.enableLogging}
                    onCheckedChange={(value) => setSettings({ ...settings, enableLogging: value })}
                  />
                </div>

                <div>
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Select
                    value={settings.dataRetention}
                    onValueChange={(value) => setSettings({ ...settings, dataRetention: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Export & Import</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Database className="h-6 w-6 mb-2" />
                    Export All Data
                  </Button>

                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Database className="h-6 w-6 mb-2" />
                    Import Data
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Data Retention Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Changing retention settings will affect existing data. Data older than the selected period will be
                      automatically deleted.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Changes
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
