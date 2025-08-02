"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingCart, Users, Settings, ChevronLeft, ChevronRight, Pizza, Bot } from "lucide-react"
import { usePreferences } from "@/lib/preferences-context"
import { NotificationPanel } from "@/components/notification-panel"
import { ProfilePanel } from "@/components/profile-panel"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Products", href: "/products", icon: Pizza },
  { name: "AI Management", href: "/ai-management", icon: Bot },
]

interface FloatingSidebarProps {
  children: React.ReactNode
}

export function FloatingSidebar({ children }: FloatingSidebarProps) {
  const pathname = usePathname()
  const { preferences, updatePreference } = usePreferences()

  const toggleSidebar = () => {
    updatePreference("sidebarMinimized", !preferences.sidebarMinimized)
  }

  const toggleOnlineStatus = () => {
    updatePreference("isOnline", !preferences.isOnline)
  }

  return (
    <div className="min-h-screen bg-upsell-bg">
      {/* Floating Sidebar */}
      <div
        className={cn(
          "fixed left-4 top-4 bottom-4 z-50 bg-upsell-sidebar rounded-2xl shadow-2xl transition-all duration-300 ease-in-out",
          preferences.sidebarMinimized ? "w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className={cn("mb-6 flex items-center justify-between", preferences.sidebarMinimized ? "px-0" : "px-2")}>
            {!preferences.sidebarMinimized && (
              <Image
                src="/images/upsell-ai-logo-landscape-transparent.png"
                alt="Upsell AI"
                width={200}
                height={50}
                className="h-10 w-auto filter invert"
              />
            )}
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="text-white hover:bg-white/10 p-2">
              {preferences.sidebarMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-upsell-blue text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white",
                    preferences.sidebarMinimized
                      ? "justify-center h-12 w-full mx-0 px-2"
                      : "justify-start px-3 py-3 text-sm",
                  )}
                >
                  <item.icon size={20} />
                  {!preferences.sidebarMinimized && <span className="ml-3">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="space-y-2">
            {/* Online Status Indicator */}
            <Button
              variant="ghost"
              onClick={toggleOnlineStatus}
              className={cn(
                "transition-colors w-full",
                preferences.isOnline ? "text-green-400 hover:bg-green-500/20" : "text-red-400 hover:bg-red-500/20",
                preferences.sidebarMinimized ? "justify-center h-12 px-2" : "justify-start px-3 py-3",
              )}
            >
              <div className={cn("w-3 h-3 rounded-full", preferences.isOnline ? "bg-green-400" : "bg-red-400")} />
              {!preferences.sidebarMinimized && (
                <span className="ml-3 text-sm">{preferences.isOnline ? "Online" : "Offline"}</span>
              )}
            </Button>

            {/* Notifications */}
            <NotificationPanel isMinimized={preferences.sidebarMinimized} />

            {/* Settings */}
            <Link
              href="/settings"
              className={cn(
                "flex items-center rounded-xl font-medium transition-all duration-200",
                pathname === "/settings" || pathname.startsWith("/settings/")
                  ? "bg-upsell-blue text-white shadow-lg"
                  : "text-gray-300 hover:bg-white/10 hover:text-white",
                preferences.sidebarMinimized
                  ? "justify-center h-12 w-full mx-0 px-2"
                  : "justify-start px-3 py-3 text-sm",
              )}
            >
              <Settings size={20} />
              {!preferences.sidebarMinimized && <span className="ml-3">Settings</span>}
            </Link>

            {/* Profile */}
            <ProfilePanel isMinimized={preferences.sidebarMinimized} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("transition-all duration-300 ease-in-out", preferences.sidebarMinimized ? "ml-24" : "ml-72")}>
        {children}
      </div>
    </div>
  )
}
