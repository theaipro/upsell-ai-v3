import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PreferencesProvider } from "@/lib/preferences-context"
import { NotificationsProvider } from "@/lib/notifications-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Upsell AI - Restaurant Management Platform",
  description: "AI-powered restaurant management and upselling platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PreferencesProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </PreferencesProvider>
      </body>
    </html>
  )
}
