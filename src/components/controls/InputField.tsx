'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface InputFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  validSymbols?: string
  examples?: { label: string; value: string }[]
  className?: string
}

export function InputField({
  value,
  onChange,
  placeholder = 'Enter input...',
  validSymbols,
  examples,
  className = '',
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (validSymbols) {
      const filtered = Array.from(newValue)
        .filter((c) => validSymbols.includes(c))
        .join('')
      onChange(filtered)
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="font-mono text-xl h-12"
        spellCheck={false}
        autoComplete="off"
      />
      {examples && examples.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <Button
              key={ex.value}
              variant="outline"
              size="sm"
              onClick={() => onChange(ex.value)}
              className="text-sm font-mono h-9"
            >
              {ex.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
