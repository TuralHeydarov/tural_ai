"use client"

import { useState } from "react"
import { Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageInput } from "@/components/message-input"
import { MessageList } from "@/components/message-list"
import { ModelSelector } from "@/components/model-selector"
import { cn } from "@/lib/utils"
import { type Message } from "@/app/chat/page"

interface AIPanelProps {
  pageContext?: {
    type: string
    name: string
  }
}

export function AIPanel({ pageContext }: AIPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedModel, setSelectedModel] = useState("claude-3.5-sonnet")

  const handleSendMessage = (
    content: string,
    files?: File[],
    context?: Array<{ type: string; name: string }>
  ) => {
    // Automatically include page context
    const fullContext = pageContext
      ? [pageContext, ...(context || [])]
      : context

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      context: fullContext,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a response from ${selectedModel}${
          pageContext ? ` with context from ${pageContext.name}` : ""
        }. In production, this would call the actual AI API.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-transform hover:scale-110"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Side Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-96 transform flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 dark:border-gray-800 dark:bg-gray-950",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              {pageContext && (
                <p className="text-xs text-gray-500">
                  Context: {pageContext.name}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Model Selector */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
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

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
