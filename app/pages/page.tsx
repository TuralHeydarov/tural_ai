import { FileText } from "lucide-react"

export default function PagesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Pages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your documents and notes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          "Product Requirements",
          "Meeting Notes",
          "Design System",
          "API Documentation",
          "User Research",
          "Quarterly Goals",
        ].map((title) => (
          <div
            key={title}
            className="rounded-lg border border-gray-200 p-6 transition-colors hover:border-blue-500 dark:border-gray-800"
          >
            <FileText className="mb-4 h-8 w-8 text-blue-600" />
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">Last edited 2 hours ago</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold">💡 Try the AI Assistant</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click the AI button in the bottom right to chat about this page. The AI
          will automatically have context about the current page!
        </p>
      </div>
    </div>
  )
}
