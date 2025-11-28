"use client"

import { useState } from "react"
import { MessageInput } from "@/components/message-input"
import { ModelSelector } from "@/components/model-selector"
import { MessageList } from "@/components/message-list"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  context?: Array<{ type: string; name: string }>
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedModel, setSelectedModel] = useState("claude-3.5-sonnet")

  const handleSendMessage = (content: string, files?: File[], context?: Array<{ type: string; name: string }>) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      context,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a simulated response from ${selectedModel}. In production, this would call the actual AI API.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <p className="text-sm text-gray-500">Ask anything, get instant answers</p>
        </div>
        <ModelSelector value={selectedModel} onChange={setSelectedModel} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
