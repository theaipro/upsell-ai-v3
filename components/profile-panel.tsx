"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Key, Shield, Palette, HelpCircle, LogOut, Bell } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface ProfilePanelProps {
  isMinimized: boolean
}

export function ProfilePanel({ isMinimized }: ProfilePanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 })
  const { user, logout } = useAuth()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const panelWidth = 288 // w-72 = 288px
      const panelHeight = 400 // approximate height

      // Position panel to the right of the button
      let left = buttonRect.right + 8 // 8px gap
      let top = buttonRect.top

      // Check if panel would go off-screen horizontally
      if (left + panelWidth > window.innerWidth) {
        left = buttonRect.left - panelWidth - 8 // Position to the left instead
      }

      // Check if panel would go off-screen vertically
      if (top + panelHeight > window.innerHeight) {
        top = window.innerHeight - panelHeight - 16 // 16px margin from bottom
      }

      setPanelPosition({ top, left })
    }
  }, [isOpen])

  const handleNavigation = (path: string) => {
    // Store current path before navigating to profile pages
    if (!pathname.startsWith("/profile")) {
      localStorage.setItem("lastMainRoute", pathname)
    }
    router.push(path)
    setIsOpen(false)
  }

  const profileMenuItems = [
    {
      icon: User,
      label: "Profile Settings",
      action: () => handleNavigation("/profile"),
    },
    {
      icon: Key,
      label: "API Keys",
      action: () => handleNavigation("/profile/api-keys"),
    },
    {
      icon: Shield,
      label: "Security",
      action: () => handleNavigation("/profile/security"),
    },
    {
      icon: Palette,
      label: "Appearance",
      action: () => handleNavigation("/profile/appearance"),
    },
    {
      icon: Bell,
      label: "Notification Settings",
      action: () => handleNavigation("/profile/notifications"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => console.log("Help & Support"),
    },
  ]

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "text-gray-300 hover:bg-white/10 hover:text-white transition-colors",
          isMinimized ? "justify-center w-full h-12 px-2" : "justify-start px-3 py-3",
        )}
      >
        {isMinimized ? (
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-upsell-blue text-white text-xs">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <>
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-upsell-blue text-white text-xs">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 text-left flex-1">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </>
        )}
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 w-72 z-[60] animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: `${panelPosition.top}px`,
            left: `${panelPosition.left}px`,
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-upsell-blue text-white">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user?.name || "User"}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-xs text-gray-500">Restaurant Manager</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {profileMenuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => {
                  item.action()
                  setIsOpen(false)
                }}
                className="w-full justify-start px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Logout */}
          <div className="p-2">
            <Button
              variant="ghost"
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
