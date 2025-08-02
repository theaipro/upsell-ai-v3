"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface UserPreferences {
  sidebarMinimized: boolean
  dashboardLayout: "grid" | "list"
  dashboardVisibleCards: string[]
  ordersViewMode: "list" | "board" | "tags"
  ordersShowFilters: boolean
  ordersSelectedTags: string[]
  ordersActiveStatusTab: string
  notificationsEnabled: boolean
  isOnline: boolean
}

interface PreferencesContextType {
  preferences: UserPreferences
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  resetPreferences: () => void
}

const defaultPreferences: UserPreferences = {
  sidebarMinimized: false,
  dashboardLayout: "grid",
  dashboardVisibleCards: [
    "orders",
    "revenue",
    "staff",
    "growth",
    "total-customers",
    "vip-customers",
    "menu-performance",
    "category-breakdown",
    "trending-items",
    "profit-analysis",
  ],
  ordersViewMode: "list",
  ordersShowFilters: false,
  ordersSelectedTags: [],
  ordersActiveStatusTab: "all",
  notificationsEnabled: true,
  isOnline: true,
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem("upsell-preferences")
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences({ ...defaultPreferences, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved preferences:", error)
      }
    }
  }, [])

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value }
      localStorage.setItem("upsell-preferences", JSON.stringify(updated))
      return updated
    })
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    localStorage.setItem("upsell-preferences", JSON.stringify(defaultPreferences))
  }

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}
