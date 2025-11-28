"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, Send, X, Loader2 } from "lucide-react"
import { AddContextModal } from "@/components/add-context-modal"

interface MessageInputProps {
  onSend: (content: string, files?: File[], context?: Array<{ type: string; name: string }>) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [context, setContext] = useState<Array<{ type: string; name: string }>>([])
  const [showContextModal, setShowContextModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if ((message.trim() || files.length > 0) && !disabled) {
      onSend(message, files, context.length > 0 ? context : undefined)
      setMessage("")
      setFiles([])
      setContext([])
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }

    // Check for @ symbol to open context modal
    if (e.key === "@") {
      setShowContextModal(true)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeContext = (index: number) => {
    setContext((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddContext = (items: Array<{ type: string; name: string }>) => {
    setContext((prev) => [...prev, ...items])
    setShowContextModal(false)
  }

  return (
    <div className="space-y-3">
      {/* Context Pills */}
      {context.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {context.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1.5 text-sm dark:bg-blue-900/30"
            >
              <span className="font-medium">{item.type}:</span>
              <span>{item.name}</span>
              <button
                onClick={() => removeContext(index)}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Pills */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm dark:bg-gray-800"
            >
              <Paperclip className="h-3 w-3" />
              <span>{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-950">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (type @ to add context)"
            className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-0 disabled:opacity-50"
            rows={3}
            disabled={disabled}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowContextModal(true)}
            disabled={disabled}
          >
            <span className="text-lg">@</span>
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={disabled || (!message.trim() && files.length === 0)}
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Add Context Modal */}
      <AddContextModal
        open={showContextModal}
        onClose={() => setShowContextModal(false)}
        onAdd={handleAddContext}
      />
    </div>
  )
}
