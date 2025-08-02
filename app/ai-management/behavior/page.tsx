"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, MessageCircle, Heart, Save, RotateCcw, AlertTriangle, Lock, Eye, EyeOff, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  demoGreetingTemplates,
  demoUpsellMode,
  demoAIBehaviorValues,
  demoUpsellingValues,
  demoAdvancedBehaviorValues,
} from "@/lib/demo-data"

export default function BehaviorPage() {
  const [settings, setSettings] = useState(demoAIBehaviorValues)
  const [upselling, setUpselling] = useState(demoUpsellingValues)
  const [advanced, setAdvanced] = useState(demoAdvancedBehaviorValues)
  const [upsellMode, setUpsellMode] = useState<"smart" | "manual" | "advanced">(demoUpsellMode)
  const [showAdvancedWarning, setShowAdvancedWarning] = useState(false)
  const [advancedUnlocked, setAdvancedUnlocked] = useState(false)

  const greetingTemplates = demoGreetingTemplates

  const updateSettingValue = (key: keyof typeof settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateUpsellingValue = (key: keyof typeof upselling, value: any) => {
    setUpselling((prev) => ({ ...prev, [key]: value }))
  }

  const handleUpsellModeChange = (mode: "smart" | "manual" | "advanced") => {
    if (mode === "advanced" && !advancedUnlocked) {
      setShowAdvancedWarning(true)
      return
    }
    setUpsellMode(mode)
  }

  const unlockAdvanced = () => {
    setAdvancedUnlocked(true)
    setUpsellMode("advanced")
    setShowAdvancedWarning(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Behavior</h1>
        <p className="text-gray-600 mt-2">Configure your AI assistant's personality and response patterns</p>
      </div>

      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personality" className="flex items-center gap-3">
            <Bot size={18} />
            Personality
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-3">
            <MessageCircle size={18} />
            Responses
          </TabsTrigger>
          <TabsTrigger value="upselling" className="flex items-center gap-3">
            <Zap size={18} />
            Upselling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="space-y-6">
          {/* Personality Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Personality
              </CardTitle>
              <CardDescription>Choose how your AI assistant should interact with customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: "professional", label: "Professional" },
                  { value: "friendly", label: "Friendly" },
                  { value: "casual", label: "Casual" },
                  { value: "enthusiastic", label: "Enthusiastic" },
                  { value: "custom", label: "Custom" },
                ].map((option: any) => (
                  <div
                    key={option.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      settings.personality_type === option.value
                        ? "border-upsell-blue bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => updateSettingValue("personality_type", option.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{option.label}</h3>
                      {settings.personality_type === option.value && (
                        <Badge className="bg-upsell-blue">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                ))}
              </div>

              {settings.personality_type === "custom" && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <Label htmlFor="custom-personality">Custom Personality Description</Label>
                  <Textarea
                    id="custom-personality"
                    placeholder="Describe how you want your AI to behave and interact with customers..."
                    className="min-h-24"
                    value={settings.custom_personality_description}
                    onChange={(e) => updateSettingValue("custom_personality_description", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Greeting Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Greeting Messages
              </CardTitle>
              <CardDescription>Customize how your AI greets new customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {greetingTemplates.map((template, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                    <p className="text-sm">{template}</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Use This Template
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="custom-greeting">Custom Greeting</Label>
                <Textarea id="custom-greeting" placeholder="Create your own greeting message..." className="min-h-20" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          {/* Response Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Response Behavior
              </CardTitle>
              <CardDescription>Configure how your AI responds to customer messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Response Speed (seconds)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[settings.response_speed]}
                      onValueChange={(value) => updateSettingValue("response_speed", value[0])}
                      max={10}
                      min={0.5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Instant</span>
                      <span>Current: {settings.response_speed}s</span>
                      <span>10s delay</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Add a slight delay to make responses feel more natural</p>
                </div>

                <div>
                  <Label>Creativity Level</Label>
                  <div className="mt-2">
                    <Slider
                      value={[settings.creativity_level]}
                      onValueChange={(value) => updateSettingValue("creativity_level", value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Conservative</span>
                      <span>Level: {settings.creativity_level}</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Higher creativity leads to more varied and expressive responses
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Emojis</Label>
                    <p className="text-sm text-gray-600">Use emojis in responses to add personality</p>
                  </div>
                  <Switch
                    checked={settings.enable_emojis}
                    onCheckedChange={(value) => updateSettingValue("enable_emojis", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Personalization</Label>
                    <p className="text-sm text-gray-600">Use customer names and remember preferences</p>
                  </div>
                  <Switch
                    checked={settings.enable_personalization}
                    onCheckedChange={(value) => updateSettingValue("enable_personalization", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Small Talk</Label>
                    <p className="text-sm text-gray-600">Allow casual conversation beyond orders</p>
                  </div>
                  <Switch
                    checked={settings.enable_small_talk}
                    onCheckedChange={(value) => updateSettingValue("enable_small_talk", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upselling" className="space-y-6">
          {/* Advanced Warning Dialog */}
          {showAdvancedWarning && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="space-y-3">
                  <p className="font-medium">⚠️ Advanced Settings Warning</p>
                  <p>
                    Advanced upselling settings contain sensitive configurations that can significantly impact your AI's
                    behavior and sales performance. Incorrect settings may lead to aggressive upselling that could
                    negatively affect customer experience.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={unlockAdvanced} className="bg-orange-600 hover:bg-orange-700 text-white">
                      I Understand, Proceed
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAdvancedWarning(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Upselling Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Upselling Mode
              </CardTitle>
              <CardDescription>Choose how your AI handles upselling to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Smart Mode */}
                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    upsellMode === "smart" ? "border-upsell-blue bg-blue-50" : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => handleUpsellModeChange("smart")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-700">Smart</h3>
                    {upsellMode === "smart" && <Badge className="bg-upsell-blue">Active</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">
                    AI automatically optimizes upselling based on customer behavior and preferences. Recommended for
                    most restaurants.
                  </p>
                </div>

                {/* Manual Mode */}
                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    upsellMode === "manual" ? "border-upsell-blue bg-blue-50" : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => handleUpsellModeChange("manual")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-700">Manual</h3>
                    {upsellMode === "manual" && <Badge className="bg-upsell-blue">Active</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">
                    Configure specific upselling rules and triggers. Good for restaurants with specific sales
                    strategies.
                  </p>
                </div>

                {/* Advanced Mode */}
                <div
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all relative",
                    upsellMode === "advanced"
                      ? "border-upsell-blue bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                    !advancedUnlocked && "opacity-60",
                  )}
                  onClick={() => handleUpsellModeChange("advanced")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-red-700">Advanced</h3>
                      {!advancedUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                    {upsellMode === "advanced" && <Badge className="bg-red-600">Active</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">
                    Full control over all AI behavior parameters. For experienced users only. May impact customer
                    satisfaction if misconfigured.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upselling Settings based on mode */}
          <Card>
            <CardHeader>
              <CardTitle>Upselling Configuration</CardTitle>
              <CardDescription>
                {upsellMode === "smart" && "Smart mode settings are automatically optimized"}
                {upsellMode === "manual" && "Configure your manual upselling preferences"}
                {upsellMode === "advanced" && "Advanced configuration - use with caution"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Smart Mode - All settings blurred/disabled */}
              {upsellMode === "smart" && (
                <div className="relative">
                  <div className="filter blur-sm pointer-events-none opacity-50">
                    <div className="space-y-4">
                      <div>
                        <Label>Upselling Frequency</Label>
                        <Slider value={[7]} max={10} min={1} className="w-full mt-2" />
                        <p className="text-sm text-gray-600 mt-2">Automatically optimized based on customer response</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium">Triggers</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">After item selection</span>
                              <Switch checked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">During customization</span>
                              <Switch checked />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">Types</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Complementary items</span>
                              <Switch checked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Size upgrades</span>
                              <Switch checked />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg p-4 text-center">
                      <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Smart Mode Active</p>
                      <p className="text-xs text-gray-500">Settings are automatically optimized</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Mode - Some settings available */}
              {upsellMode === "manual" && (
                <div className="space-y-6">
                  <div>
                    <Label>Upselling Frequency</Label>
                    <div className="mt-2">
                      <Slider
                        value={[settings.upsell_frequency]}
                        onValueChange={(value) => updateSettingValue("upsell_frequency", value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Subtle</span>
                        <span>Level: {settings.upsell_frequency}</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Upselling Triggers</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">After item selection</span>
                          <Switch
                            checked={upselling.after_item_selection}
                            onCheckedChange={(value) => updateUpsellingValue("after_item_selection", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">During customization</span>
                          <Switch
                            checked={upselling.during_customization}
                            onCheckedChange={(value) => updateUpsellingValue("during_customization", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Before checkout</span>
                          <Switch
                            checked={upselling.before_checkout}
                            onCheckedChange={(value) => updateUpsellingValue("before_checkout", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Based on order value</span>
                          <Switch
                            checked={upselling.based_on_order_value}
                            onCheckedChange={(value) => updateUpsellingValue("based_on_order_value", value)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Upselling Types</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Complementary items</span>
                          <Switch
                            checked={upselling.complementary_items}
                            onCheckedChange={(value) => updateUpsellingValue("complementary_items", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Size upgrades</span>
                          <Switch
                            checked={upselling.size_upgrades}
                            onCheckedChange={(value) => updateUpsellingValue("size_upgrades", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Add-ons & extras</span>
                          <Switch
                            checked={upselling.add_ons_extras}
                            onCheckedChange={(value) => updateUpsellingValue("add_ons_extras", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Combo deals</span>
                          <Switch
                            checked={upselling.combo_deals}
                            onCheckedChange={(value) => updateUpsellingValue("combo_deals", value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Advanced settings still blurred in manual mode */}
                  <div className="relative mt-6">
                    <div className="filter blur-sm pointer-events-none opacity-40">
                      <h4 className="font-medium mb-4">Advanced Behavior Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Context Memory</Label>
                          <Input type="number" value="10" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Response Length</Label>
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="Medium" />
                            </SelectTrigger>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-lg p-3 text-center">
                        <EyeOff className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-600">Advanced Settings Locked</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Mode - All settings available */}
              {upsellMode === "advanced" && (
                <div className="space-y-6">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Warning:</strong> You are in Advanced Mode. Changes here can significantly impact customer
                      experience and sales performance.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label>Upselling Frequency</Label>
                    <div className="mt-2">
                      <Slider
                        value={[settings.upsell_frequency]}
                        onValueChange={(value) => updateSettingValue("upsell_frequency", value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Subtle</span>
                        <span>Level: {settings.upsell_frequency}</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Upselling Triggers</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">After item selection</span>
                          <Switch
                            checked={upselling.after_item_selection}
                            onCheckedChange={(value) => updateUpsellingValue("after_item_selection", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">During customization</span>
                          <Switch
                            checked={upselling.during_customization}
                            onCheckedChange={(value) => updateUpsellingValue("during_customization", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Before checkout</span>
                          <Switch
                            checked={upselling.before_checkout}
                            onCheckedChange={(value) => updateUpsellingValue("before_checkout", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Based on order value</span>
                          <Switch
                            checked={upselling.based_on_order_value}
                            onCheckedChange={(value) => updateUpsellingValue("based_on_order_value", value)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Upselling Types</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Complementary items</span>
                          <Switch
                            checked={upselling.complementary_items}
                            onCheckedChange={(value) => updateUpsellingValue("complementary_items", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Size upgrades</span>
                          <Switch
                            checked={upselling.size_upgrades}
                            onCheckedChange={(value) => updateUpsellingValue("size_upgrades", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Add-ons & extras</span>
                          <Switch
                            checked={upselling.add_ons_extras}
                            onCheckedChange={(value) => updateUpsellingValue("add_ons_extras", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Combo deals</span>
                          <Switch
                            checked={upselling.combo_deals}
                            onCheckedChange={(value) => updateUpsellingValue("combo_deals", value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Advanced Behavior Settings - Only available in advanced mode */}
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-base text-red-700 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Advanced Behavior Settings
                      </CardTitle>
                      <CardDescription className="text-red-600">
                        These settings directly control AI behavior. Incorrect values may negatively impact customer
                        experience.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="context-memory">Context Memory (messages)</Label>
                            <Input
                              id="context-memory"
                              type="number"
                              value={advanced.context_memory}
                              onChange={(e) =>
                                setAdvanced({ ...advanced, context_memory: Number(e.target.value) })
                              }
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              How many previous messages to remember in conversation
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="max-response-length">Max Response Length</Label>
                            <Select
                              value={advanced.max_response_length}
                              onValueChange={(value) => setAdvanced({ ...advanced, max_response_length: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="short">Short (50 words)</SelectItem>
                                <SelectItem value="medium">Medium (100 words)</SelectItem>
                                <SelectItem value="long">Long (200 words)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="fallback-behavior">Fallback Behavior</Label>
                            <Select
                              value={advanced.fallback_behavior}
                              onValueChange={(value) => setAdvanced({ ...advanced, fallback_behavior: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="transfer">Transfer to human</SelectItem>
                                <SelectItem value="apologize">Apologize and retry</SelectItem>
                                <SelectItem value="suggest">Suggest alternatives</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Handle Complaints</Label>
                              <p className="text-xs text-gray-600">Allow AI to address customer complaints</p>
                            </div>
                            <Switch
                              checked={advanced.handle_complaints}
                              onCheckedChange={(value) => setAdvanced({ ...advanced, handle_complaints: value })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Process Refunds</Label>
                              <p className="text-xs text-gray-600">Enable AI to handle refund requests</p>
                            </div>
                            <Switch
                              checked={advanced.process_refunds}
                              onCheckedChange={(value) => setAdvanced({ ...advanced, process_refunds: value })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Collect Feedback</Label>
                              <p className="text-xs text-gray-600">Ask for feedback after orders</p>
                            </div>
                            <Switch
                              checked={advanced.collect_feedback}
                              onCheckedChange={(value) => setAdvanced({ ...advanced, collect_feedback: value })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Learning Mode</Label>
                              <p className="text-xs text-gray-600">Continuously improve from interactions</p>
                            </div>
                            <Switch
                              checked={advanced.learning_mode}
                              onCheckedChange={(value) => setAdvanced({ ...advanced, learning_mode: value })}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
