"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Download,
  TestTube,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    responseTime?: number
    upsellAttempt?: boolean
  }
}

import { demoAITestScenarios, AITestScenario } from "@/lib/demo-data"

export default function TestingPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi there! 👋 Welcome to Tony's Pizza! I'm here to help you with your order. What can I get started for you today?",
      timestamp: new Date(),
      metadata: {
        responseTime: 1.2,
      },
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("whatsapp")
  const [isLoading, setIsLoading] = useState(false)
  const [testScenarios, setTestScenarios] = useState<AITestScenario[]>(demoAITestScenarios)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: generateMockResponse(inputMessage),
          timestamp: new Date(),
          metadata: {
            intent: detectIntent(inputMessage),
            confidence: Math.random() * 0.3 + 0.7, // 70-100%
            responseTime: Math.random() * 2 + 0.5, // 0.5-2.5s
            upsellAttempt: Math.random() > 0.6,
          },
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      },
      1000 + Math.random() * 1500,
    )
  }

  const generateMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("pizza")) {
      return "Great choice! We have several delicious pizza options. Would you like to see our most popular pizzas, or do you have a specific type in mind? 🍕"
    }
    if (lowerInput.includes("size")) {
      return 'We offer three sizes: Small (10"), Medium (12"), and Large (14"). Our Large is perfect for sharing and only $3 more than the Medium. Which size would you prefer?'
    }
    if (lowerInput.includes("margherita") || lowerInput.includes("pepperoni")) {
      return "Excellent choice! That's one of our customer favorites. Would you like to add any drinks or sides to complete your meal? Our garlic bread pairs perfectly with pizza! 🥖"
    }
    if (lowerInput.includes("cold") || lowerInput.includes("complaint")) {
      return "I'm really sorry to hear about that experience. That's definitely not the quality we strive for. Let me help make this right for you. I can offer you a replacement order or a full refund. Which would you prefer?"
    }

    return "I understand! Let me help you with that. Could you tell me a bit more about what you're looking for?"
  }

  const detectIntent = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("order") || lowerInput.includes("want") || lowerInput.includes("get")) {
      return "place_order"
    }
    if (lowerInput.includes("size") || lowerInput.includes("price")) {
      return "menu_inquiry"
    }
    if (lowerInput.includes("cold") || lowerInput.includes("wrong") || lowerInput.includes("complaint")) {
      return "complaint"
    }
    if (lowerInput.includes("refund") || lowerInput.includes("cancel")) {
      return "refund_request"
    }

    return "general_inquiry"
  }

  const runTestScenario = async (scenario: AITestScenario) => {
    // Clear current conversation
    setMessages([
      {
        id: "reset",
        type: "ai",
        content:
          "Hi there! 👋 Welcome to Tony's Pizza! I'm here to help you with your order. What can I get started for you today?",
        timestamp: new Date(),
        metadata: { responseTime: 1.2 },
      },
    ])

    // Run through scenario messages with delays
    for (let i = 0; i < scenario.test_messages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const userMessage: Message = {
        id: `scenario-${i}`,
        type: "user",
        content: scenario.test_messages[i],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiResponse: Message = {
        id: `scenario-ai-${i}`,
        type: "ai",
        content: generateMockResponse(scenario.test_messages[i]),
        timestamp: new Date(),
        metadata: {
          intent: detectIntent(scenario.test_messages[i]),
          confidence: Math.random() * 0.3 + 0.7,
          responseTime: Math.random() * 2 + 0.5,
          upsellAttempt: Math.random() > 0.6,
        },
      }

      setMessages((prev) => [...prev, aiResponse])
    }
  }

  const clearConversation = () => {
    setMessages([
      {
        id: "clear",
        type: "ai",
        content:
          "Hi there! 👋 Welcome to Tony's Pizza! I'm here to help you with your order. What can I get started for you today?",
        timestamp: new Date(),
        metadata: { responseTime: 1.2 },
      },
    ])
  }

  const exportConversation = () => {
    const conversationData = {
      channel: selectedChannel,
      timestamp: new Date().toISOString(),
      messages: messages.map((msg) => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        metadata: msg.metadata,
      })),
    }

    const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-test-conversation-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Testing</h1>
          <p className="text-gray-600 mt-2">Test your AI assistant's responses in a sandbox environment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearConversation}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" onClick={exportConversation}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Scenarios
            </CardTitle>
            <CardDescription>Pre-built scenarios to test common interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{scenario.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <Button size="sm" variant="outline" onClick={() => runTestScenario(scenario)} className="w-full">
                  Run Test
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Chat Simulator
              </CardTitle>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="messenger">Messenger</SelectItem>
                  <SelectItem value="web_widget">Web Widget</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>Test conversations as they would appear to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat Messages */}
            <ScrollArea className="h-96 border rounded-lg p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "user" ? "bg-upsell-blue text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        <span className="text-xs opacity-75">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>

                      {/* AI Metadata */}
                      {message.type === "ai" && message.metadata && (
                        <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                          {message.metadata.intent && (
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {message.metadata.intent}
                              </Badge>
                              {message.metadata.confidence && (
                                <span className="text-xs text-gray-600">
                                  {(message.metadata.confidence * 100).toFixed(1)}%
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            {message.metadata.responseTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {message.metadata.responseTime.toFixed(1)}s
                              </span>
                            )}
                            {message.metadata.upsellAttempt && (
                              <Badge variant="outline" className="text-xs">
                                Upsell
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span className="text-sm">AI is typing...</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Test Session Summary</CardTitle>
          <CardDescription>Overview of current testing session performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              <p className="text-sm text-gray-600">Total Messages</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {
                  messages.filter((m) => m.type === "ai" && m.metadata?.confidence && m.metadata.confidence > 0.8)
                    .length
                }
              </p>
              <p className="text-sm text-gray-600">High Confidence</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter((m) => m.metadata?.responseTime).length > 0
                  ? (
                      messages
                        .filter((m) => m.metadata?.responseTime)
                        .reduce((acc, m) => acc + (m.metadata?.responseTime || 0), 0) /
                      messages.filter((m) => m.metadata?.responseTime).length
                    ).toFixed(1)
                  : "0.0"}
                s
              </p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter((m) => m.metadata?.upsellAttempt).length}
              </p>
              <p className="text-sm text-gray-600">Upsell Attempts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
