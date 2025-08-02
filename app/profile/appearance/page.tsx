"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Palette, Monitor, Sun, Type, Layout, Eye, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { demoAppearanceSettings, type AppearanceSettings } from "@/lib/demo-data"

export default function AppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings>(demoAppearanceSettings)

  const updateSetting = <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const themes = [
    { id: "light", name: "Light", icon: Sun, description: "Clean and bright interface" },
    { id: "dark", name: "Dark", description: "Easy on the eyes in low light" },
    { id: "system", name: "System", icon: Monitor, description: "Matches your device settings" },
  ]

  const colorSchemes = [
    { id: "blue", name: "Blue", color: "bg-blue-500" },
    { id: "green", name: "Green", color: "bg-green-500" },
    { id: "purple", name: "Purple", color: "bg-purple-500" },
    { id: "orange", name: "Orange", color: "bg-orange-500" },
    { id: "red", name: "Red", color: "bg-red-500" },
    { id: "teal", name: "Teal", color: "bg-teal-500" },
  ]

  const layouts = [
    { id: "default", name: "Default", description: "Standard layout with sidebar" },
    { id: "compact", name: "Compact", description: "Condensed layout for smaller screens" },
    { id: "wide", name: "Wide", description: "Expanded layout for large screens" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appearance</h1>
        <p className="text-gray-600 mt-2">Customize the look and feel of your dashboard</p>
      </div>

      {/* Theme Selection */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon || Sun
              return (
                <div
                  key={themeOption.id}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    settings.theme === themeOption.id
                      ? "border-upsell-blue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => updateSetting("theme", themeOption.id as any)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{themeOption.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{themeOption.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>Choose your accent color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {colorSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={cn(
                  "p-3 rounded-lg border-2 cursor-pointer transition-all text-center",
                  settings.color_scheme === scheme.id ? "border-gray-400" : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => updateSetting("color_scheme", scheme.id as any)}
              >
                <div className={cn("w-8 h-8 rounded-full mx-auto mb-2", scheme.color)} />
                <p className="text-sm font-medium text-gray-900">{scheme.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layout Options */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-green-600" />
            Layout
          </CardTitle>
          <CardDescription>Customize your dashboard layout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Compact Mode</p>
              <p className="text-sm text-gray-600">Reduce spacing and padding for more content</p>
            </div>
            <Switch
              checked={settings.compact_mode}
              onCheckedChange={(value) => updateSetting("compact_mode", value)}
              className="data-[state=checked]:bg-upsell-blue"
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5 text-orange-600" />
            Typography
          </CardTitle>
          <CardDescription>Adjust text size and readability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <div className="px-3">
                <Slider
                  value={[settings.font_size]}
                  onValueChange={(value) => updateSetting("font_size", value[0])}
                  max={20}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Small (12px)</span>
                <span>Current: {settings.font_size}px</span>
                <span>Large (20px)</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p style={{ fontSize: `${settings.font_size}px` }} className="text-gray-900">
                This is a preview of how text will appear with your selected font size.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">High Contrast</p>
              <p className="text-sm text-gray-600">Increase contrast for better readability</p>
            </div>
            <Switch
              checked={settings.high_contrast}
              onCheckedChange={(value) => updateSetting("high_contrast", value)}
              className="data-[state=checked]:bg-upsell-blue"
            />
          </div>
        </CardContent>
      </Card>

      {/* Animations & Effects */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Animations & Effects
          </CardTitle>
          <CardDescription>Control visual effects and animations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Enable Animations</p>
              <p className="text-sm text-gray-600">Show smooth transitions and hover effects</p>
            </div>
            <Switch
              checked={settings.animations}
              onCheckedChange={(value) => updateSetting("animations", value)}
              className="data-[state=checked]:bg-upsell-blue"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="bg-upsell-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Accessibility
          </CardTitle>
          <CardDescription>Settings to improve accessibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Screen Reader Support</Label>
            <p className="text-sm text-gray-600">
              This application includes ARIA labels and semantic HTML for screen readers.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Keyboard Navigation</Label>
            <p className="text-sm text-gray-600">Use Tab to navigate, Enter to select, and Escape to close dialogs.</p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="mb-4">Your appearance settings will be applied immediately.</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Theme:</strong> {themes.find((t) => t.id === settings.theme)?.name}
              </p>
              <p>
                <strong>Color:</strong> {colorSchemes.find((c) => c.id === settings.color_scheme)?.name}
              </p>
            </div>
            <div>
              <p>
                <strong>Font Size:</strong> {settings.font_size}px
              </p>
              <p>
                <strong>Compact Mode:</strong> {settings.compact_mode ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
