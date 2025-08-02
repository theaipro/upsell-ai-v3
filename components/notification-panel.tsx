"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Check, Clock, ShoppingCart, Users, Bot, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications, type Notification } from "@/lib/notifications-context"
import { useRouter } from "next/navigation"

interface NotificationPanelProps {
  isMinimized: boolean
}

export function NotificationPanel({ isMinimized }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 })
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
      const panelWidth = 384 // w-96 = 384px
      const panelHeight = 500 // max-h-[500px]

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

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart size={16} className="text-blue-500" />
      case "customer":
        return <Users size={16} className="text-green-500" />
      case "ai":
        return <Bot size={16} className="text-purple-500" />
      case "system":
        return <Settings size={16} className="text-orange-500" />
      default:
        return <Bell size={16} className="text-gray-500" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
    setIsOpen(false)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "text-gray-300 hover:bg-white/10 hover:text-white transition-colors relative",
          isMinimized ? "justify-center w-full h-12 px-2" : "justify-start px-3 py-3",
        )}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center p-0">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
        {!isMinimized && <span className="ml-3 text-sm">Notifications</span>}
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[500px] z-[60] animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: `${panelPosition.top}px`,
            left: `${panelPosition.left}px`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-gray-700" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <Check size={14} className="mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell size={48} className="mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]",
                      !notification.read && "bg-blue-50 border-l-4 border-l-blue-500",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{formatTime(notification.timestamp)}</span>
                          {notification.orderId && (
                            <>
                              <span>•</span>
                              <span>Order #{notification.orderId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
