import { Table } from "lucide-react"

export default function TablesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tables</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize your data in structured tables
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          "Customer Database",
          "Project Tasks",
          "Inventory",
          "Team Members",
          "Sales Pipeline",
          "Bug Tracker",
        ].map((title) => (
          <div
            key={title}
            className="rounded-lg border border-gray-200 p-6 transition-colors hover:border-green-500 dark:border-gray-800"
          >
            <Table className="mb-4 h-8 w-8 text-green-600" />
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">142 records</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
        <h3 className="mb-2 font-semibold">💡 AI-Powered Insights</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use the AI assistant to analyze your tables, generate reports, or ask
          questions about your data. Just click the AI button!
        </p>
      </div>
    </div>
  )
}
