"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const models = [
  // Anthropic
  { value: "claude-4-sonnet", label: "Claude 4 Sonnet", provider: "anthropic" },
  { value: "claude-4.5-opus", label: "Claude 4.5 Opus", provider: "anthropic" },
  // OpenAI
  { value: "gpt-4o", label: "GPT-4o", provider: "openai" },
  { value: "o1", label: "o1", provider: "openai" },
  { value: "o1-mini", label: "o1-mini", provider: "openai" },
]

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const anthropicModels = models.filter(m => m.provider === "anthropic")
  const openaiModels = models.filter(m => m.provider === "openai")

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <span>Anthropic</span>
          {anthropicModels.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              {model.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <span>OpenAI</span>
          {openaiModels.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              {model.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
