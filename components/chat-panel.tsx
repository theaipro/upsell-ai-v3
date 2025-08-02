"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Paperclip, Smile, Phone, User, Users, Crown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "vip"
  joinDate: string
  lastOrder: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  favoriteItems: string[]
  notes: string
  tags: string[]
  avatar?: string
  preferences?: {
    dietaryRestrictions: string[]
    communicationPreference: "email" | "sms" | "phone" | "app"
    deliveryInstructions: string
    paymentMethod: string
  }
  loyaltyPoints?: number
  birthday?: string
  referralSource?: string
}

interface Message {
  id: string
  text: string
  sender: "customer" | "staff"
  timestamp: Date
  status?: "sent" | "delivered" | "read"
}

interface ChatPanelProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onOpenProfile?: (customer: Customer) => void
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800 border-green-200", icon: User },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Users },
  vip: { label: "VIP", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Crown },
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hi! I'd like to place an order for delivery.",
    sender: "customer",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "read",
  },
  {
    id: "2",
    text: "Hello! I'd be happy to help you with your order. What would you like today?",
    sender: "staff",
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    status: "read",
  },
  {
    id: "3",
    text: "I'll have my usual - Margherita pizza with extra cheese, and a Caesar salad.",
    sender: "customer",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    status: "read",
  },
  {
    id: "4",
    text: "Perfect! I see your usual order. That'll be one Margherita pizza with extra cheese and one Caesar salad. Your total is $28.99. Should I use your address on file?",
    sender: "staff",
    timestamp: new Date(Date.now() - 1000 * 60 * 23),
    status: "read",
  },
  {
    id: "5",
    text: "Yes, that's correct. How long for delivery?",
    sender: "customer",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    status: "read",
  },
  {
    id: "6",
    text: "Estimated delivery time is 25-30 minutes. I'll send you the order confirmation now.",
    sender: "staff",
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    status: "delivered",
  },
]

export function ChatPanel({ customer, isOpen, onClose, onOpenProfile }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: "staff",
        timestamp: new Date(),
        status: "sent",
      }
      setMessages([...messages, message])
      setNewMessage("")

      // Simulate customer typing
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const customerReply: Message = {
            id: (Date.now() + 1).toString(),
            text: "Thank you! I'll be waiting for the delivery.",
            sender: "customer",
            timestamp: new Date(),
            status: "sent",
          }
          setMessages((prev) => [...prev, customerReply])
        }, 2000)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!customer) return null

  const config = statusConfig[customer.status]
  const StatusIcon = config.icon

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-[480px] sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={customer.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-upsell-blue text-white">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                <Badge className={cn("flex items-center gap-1 text-xs flex-shrink-0", config.color)}>
                  <StatusIcon size={10} />
                  {config.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 truncate">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Phone size={16} />
            </Button>
            {onOpenProfile && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onOpenProfile(customer)}>
                <MoreHorizontal size={16} />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.sender === "staff" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.sender === "staff" ? "bg-upsell-blue text-white" : "bg-gray-100 text-gray-900",
                  )}
                >
                  <p>{message.text}</p>
                  <p className={cn("text-xs mt-1", message.sender === "staff" ? "text-blue-100" : "text-gray-500")}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="ml-2">typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
              <Paperclip size={16} />
            </Button>
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
              <Smile size={16} />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="bg-upsell-blue hover:bg-upsell-blue-hover flex-shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
