import Link from "next/link"
import { MessageSquare, FileText, Table, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
          Tural.AI
        </h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          AI-powered workspace that understands your content
        </p>

        {/* Features */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <MessageSquare className="mb-4 h-8 w-8 text-blue-600" />
            <h3 className="mb-2 font-semibold">AI Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chat with AI using Claude or GPT-4 with full context awareness
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <FileText className="mb-4 h-8 w-8 text-green-600" />
            <h3 className="mb-2 font-semibold">Smart Context</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add pages, tables, and records to your AI conversations
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <Table className="mb-4 h-8 w-8 text-purple-600" />
            <h3 className="mb-2 font-semibold">Everywhere Access</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI assistant available on every page with automatic context
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link href="/chat">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
            <MessageSquare className="mr-2 h-5 w-5" />
            Start Chatting
          </Button>
        </Link>
      </div>
    </div>
  )
}
