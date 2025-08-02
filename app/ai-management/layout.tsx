"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart3, Bot, MessageSquare, Settings, Sliders, Wrench, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function AIManagementLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [lastRoute, setLastRoute] = useState("/dashboard")

  useEffect(() => {
    // Get the last main route from localStorage
    const storedRoute = localStorage.getItem("lastMainRoute")
    if (storedRoute) {
      setLastRoute(storedRoute)
    }
  }, [])

  const handleBackClick = () => {
    router.push(lastRoute)
  }

  const navItems = [
    {
      icon: Bot,
      label: "Overview",
      href: "/ai-management",
      description: "AI system status and performance",
    },
    {
      icon: Wrench,
      label: "Tools",
      href: "/ai-management/tools",
      description: "Configure AI-accessible data sources",
    },
    {
      icon: MessageSquare,
      label: "Conversations",
      href: "/ai-management/conversations",
      description: "View and analyze AI chat history",
    },
    {
      icon: Sliders,
      label: "Behavior",
      href: "/ai-management/behavior",
      description: "Adjust AI personality and responses",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/ai-management/analytics",
      description: "AI performance metrics and insights",
    },
    {
      icon: TestTube,
      label: "Testing",
      href: "/ai-management/testing",
      description: "Test AI responses in sandbox",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/ai-management/settings",
      description: "Configure AI system settings",
    },
  ]

  return (
    <div className="flex h-screen bg-upsell-bg">
      {/* Sidebar */}
      <div className="hidden md:flex w-80 flex-col bg-upsell-sidebar text-white rounded-r-2xl">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold">AI Management</h2>
            <p className="text-sm text-gray-400">Configure and monitor your AI assistant</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/ai-management" ? pathname === "/ai-management" : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-upsell-blue text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="text-xs text-gray-500 mb-4">
            <p>AI Assistant v2.1.0</p>
            <p>Last trained: Jan 15, 2024</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="w-full text-gray-300 hover:bg-white/10 hover:text-white border-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to App
          </Button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-10 border-b">
        <div className="flex items-center h-16 px-4">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">AI Management</h1>
        </div>
        <Separator />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="md:p-8 p-4 md:pt-8 pt-20 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
