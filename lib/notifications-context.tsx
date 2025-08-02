"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: "order" | "customer" | "system" | "ai"
  timestamp: Date
  read: boolean
  actionUrl?: string
  orderId?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  removeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #1007 from John Smith - $45.99",
    type: "order",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    actionUrl: "/orders",
    orderId: "1007",
  },
  {
    id: "2",
    title: "Order Ready for Pickup",
    message: "Order #1005 is ready for customer pickup",
    type: "order",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    actionUrl: "/orders",
    orderId: "1005",
  },
  {
    id: "3",
    title: "AI Upsell Success",
    message: "AI successfully upsold dessert to customer - +$8.99",
    type: "ai",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    actionUrl: "/ai-management",
  },
  {
    id: "4",
    title: "VIP Customer Order",
    message: "Sarah Wilson (VIP) placed a new order",
    type: "customer",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: true,
    actionUrl: "/customers",
  },
  {
    id: "5",
    title: "Kitchen Alert",
    message: "Order #1003 taking longer than expected",
    type: "system",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    read: false,
    actionUrl: "/orders",
    orderId: "1003",
  },
  {
    id: "6",
    title: "Daily Report Ready",
    message: "Your daily sales report is now available",
    type: "system",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: true,
    actionUrl: "/dashboard",
  },
  {
    id: "7",
    title: "Staff Check-in",
    message: "Mike Johnson checked in for evening shift",
    type: "system",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    read: false,
    actionUrl: "/settings",
  },
]

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
