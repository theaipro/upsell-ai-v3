"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Shield, Bell, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
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
      icon: User,
      label: "General",
      href: "/profile",
      description: "Personal information and preferences",
    },
    {
      icon: Shield,
      label: "Security",
      href: "/profile/security",
      description: "Password and authentication settings",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/profile/notifications",
      description: "Email and push notification preferences",
    },
    {
      icon: CreditCard,
      label: "Billing",
      href: "/profile/billing",
      description: "Subscription and payment methods",
    },
  ]

  return (
    <div className="flex h-screen bg-upsell-bg">
      {/* Sidebar */}
      <div className="hidden md:flex w-80 flex-col bg-upsell-sidebar text-white rounded-r-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-upsell-blue text-white">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = item.href === "/profile" ? pathname === "/profile" : pathname.startsWith(item.href)

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
          <h1 className="ml-4 text-lg font-semibold">Profile Settings</h1>
        </div>
        <Separator />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="md:p-8 p-4 md:pt-8 pt-20 max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
