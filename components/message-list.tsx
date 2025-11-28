"use client"

import { type Message } from "@/app/chat/page"
import { cn } from "@/lib/utils"
import { Bot, User, Loader2 } from "lucide-react"

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-semibold">Start a conversation</h2>
          <p className="text-gray-500">
            Ask a question or type @ to add context from your workspace
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-4",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}

          <div
            className={cn(
              "max-w-[70%] rounded-lg px-4 py-3",
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            )}
          >
            {message.context && message.context.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {message.context.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs"
                  >
                    {item.type}: {item.name}
                  </span>
                ))}
              </div>
            )}
            {message.content ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm opacity-70">Thinking...</span>
              </div>
            )}
            {message.content && (
              <p className="mt-1 text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            )}
          </div>

          {message.role === "user" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <User className="h-5 w-5" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
