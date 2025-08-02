"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-auto items-center justify-start bg-transparent p-0 text-muted-foreground border-b border-gray-100 w-full relative",
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group inline-flex items-center justify-center whitespace-nowrap px-6 py-4 text-sm font-medium ring-offset-background transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative bg-transparent rounded-none text-gray-500 hover:text-gray-700 data-[state=active]:text-gray-900",
      // Modern indicator with glow effect
      "before:absolute before:bottom-0 before:left-1/2 before:h-0.5 before:w-0 before:bg-gradient-to-r before:from-gray-900 before:to-gray-700 before:transform before:-translate-x-1/2 before:transition-all before:duration-500 before:ease-out",
      "data-[state=active]:before:w-12 data-[state=active]:before:shadow-lg data-[state=active]:before:shadow-gray-900/30",
      // Hover effect with shorter indicator
      "hover:before:w-8 hover:before:bg-gradient-to-r hover:before:from-gray-400 hover:before:to-gray-500",
      // Background glow on active
      "data-[state=active]:after:absolute data-[state=active]:after:inset-0 data-[state=active]:after:bg-gradient-to-b data-[state=active]:after:from-gray-50/50 data-[state=active]:after:to-transparent data-[state=active]:after:rounded-lg data-[state=active]:after:-z-10 data-[state=active]:after:opacity-0 data-[state=active]:after:animate-pulse",
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
