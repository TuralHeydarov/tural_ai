"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, FileText, Table, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: MessageSquare, label: "AI Chat", href: "/chat" },
  { icon: FileText, label: "Pages", href: "/pages" },
  { icon: Table, label: "Tables", href: "/tables" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600">
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <span className="text-xl font-bold">Tural.AI</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section (optional) */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="flex-1">
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-gray-500">user@tural.ai</p>
          </div>
        </div>
      </div>
    </div>
  )
}
