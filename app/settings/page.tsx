import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 font-semibold">AI Model Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Default Model</span>
              <span className="text-sm text-gray-500">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Temperature</span>
              <span className="text-sm text-gray-500">0.7</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 font-semibold">Account</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email</span>
              <span className="text-sm text-gray-500">user@tural.ai</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Plan</span>
              <span className="text-sm text-gray-500">Pro</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
          <Settings className="mb-4 h-8 w-8 text-gray-600" />
          <h3 className="mb-2 font-semibold">Settings Page</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a demo settings page. In production, this would include full
            account management, API keys, billing, and more.
          </p>
        </div>
      </div>
    </div>
  )
}
