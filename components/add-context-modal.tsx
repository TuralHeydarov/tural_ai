"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileText, Table, File, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data - in production, this would come from your database
const mockItems = [
  { id: "1", type: "Page", name: "Product Requirements", icon: FileText },
  { id: "2", type: "Page", name: "Meeting Notes", icon: FileText },
  { id: "3", type: "Table", name: "Customer Database", icon: Table },
  { id: "4", type: "Table", name: "Project Tasks", icon: Table },
  { id: "5", type: "Record", name: "User Story #42", icon: File },
  { id: "6", type: "Record", name: "Bug Report #123", icon: File },
]

interface AddContextModalProps {
  open: boolean
  onClose: () => void
  onAdd: (items: Array<{ type: string; name: string }>) => void
}

export function AddContextModal({ open, onClose, onAdd }: AddContextModalProps) {
  const [search, setSearch] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const filteredItems = mockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  )

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleAdd = () => {
    const items = mockItems
      .filter((item) => selectedItems.has(item.id))
      .map((item) => ({ type: item.type, name: item.name }))
    onAdd(items)
    setSelectedItems(new Set())
    setSearch("")
  }

  const handleClose = () => {
    setSelectedItems(new Set())
    setSearch("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Context</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search pages, tables, or records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          {/* Items List */}
          <div className="max-h-[400px] space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No items found
              </div>
            ) : (
              filteredItems.map((item) => {
                const Icon = item.icon
                const isSelected = selectedItems.has(item.id)

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                      isSelected && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        {
                          "bg-blue-100 text-blue-600 dark:bg-blue-900/30":
                            item.type === "Page",
                          "bg-green-100 text-green-600 dark:bg-green-900/30":
                            item.type === "Table",
                          "bg-purple-100 text-purple-600 dark:bg-purple-900/30":
                            item.type === "Record",
                        }
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.type}</p>
                    </div>

                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">
              {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={selectedItems.size === 0}
              >
                Add Context
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
